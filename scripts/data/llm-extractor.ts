/**
 * Groq API client for LLM-based eligibility extraction
 * Uses free tier: 30 RPM, 500K TPD for llama-3.1-8b-instant
 */

import type { ParsedEligibility } from "./types"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL = "llama-3.1-8b-instant"

/** Rate limiting state */
const rateLimitState = {
  requestsThisMinute: 0,
  lastMinuteReset: Date.now(),
  tokensToday: 0,
  lastDayReset: Date.now(),
  requestCount: 0,
}

/** Daily limits */
const DAILY_TOKEN_LIMIT = 500000
const RPM_LIMIT = 25 // Leave some buffer below 30

/**
 * Wait for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Check and update rate limits
 */
async function checkRateLimit(estimatedTokens: number = 1000): Promise<void> {
  const now = Date.now()

  // Reset minute counter if needed
  if (now - rateLimitState.lastMinuteReset > 60000) {
    rateLimitState.requestsThisMinute = 0
    rateLimitState.lastMinuteReset = now
  }

  // Reset daily counter if needed
  if (now - rateLimitState.lastDayReset > 86400000) {
    rateLimitState.tokensToday = 0
    rateLimitState.lastDayReset = now
  }

  // Check daily limit
  if (rateLimitState.tokensToday + estimatedTokens > DAILY_TOKEN_LIMIT) {
    console.log(`[Groq] Daily token limit reached (${rateLimitState.tokensToday}/${DAILY_TOKEN_LIMIT}). Waiting until tomorrow...`)
    // Wait until midnight UTC
    const tomorrow = new Date()
    tomorrow.setUTCHours(24, 0, 0, 0)
    const waitMs = tomorrow.getTime() - now
    await sleep(waitMs)
    rateLimitState.tokensToday = 0
    rateLimitState.lastDayReset = Date.now()
  }

  // Check RPM limit
  if (rateLimitState.requestsThisMinute >= RPM_LIMIT) {
    const waitMs = 60000 - (now - rateLimitState.lastMinuteReset)
    console.log(`[Groq] RPM limit reached. Waiting ${Math.ceil(waitMs / 1000)}s...`)
    await sleep(waitMs)
    rateLimitState.requestsThisMinute = 0
    rateLimitState.lastMinuteReset = Date.now()
  }
}

/**
 * Call Groq API with retry logic
 */
async function callGroq(
  prompt: string,
  maxRetries: number = 3
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable not set")
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    await checkRateLimit()

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: EXTRACTOR_PROMPT,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 1000,
          response_format: { type: "json_object" },
        }),
      })

      if (response.status === 429) {
        // Rate limited - get retry-after header
        const retryAfter = response.headers.get("retry-after")
        const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : 60000
        console.log(`[Groq] Rate limited. Waiting ${waitMs / 1000}s...`)
        await sleep(waitMs)
        continue
      }

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Groq API error: ${response.status} - ${error}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      // Update token count
      if (data.usage) {
        rateLimitState.tokensToday += data.usage.total_tokens
        rateLimitState.requestsThisMinute++
        rateLimitState.requestCount++
      }

      if (!content) {
        throw new Error("No content in response")
      }

      return content
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error
      }
      console.log(`[Groq] Attempt ${attempt + 1} failed, retrying...`)
      await sleep(2000 * (attempt + 1)) // Exponential backoff
    }
  }

  throw new Error("Max retries exceeded")
}

/** System prompt for eligibility extraction */
const EXTRACTOR_PROMPT = `You are an expert at extracting structured eligibility information from Indian government scheme descriptions.

Given eligibility text from a government scheme, extract the following fields into JSON:

{
  "states": ["State Name"],           // Array of Indian states/UTs, or ["ALL"] if nationwide
  "categories": ["SC"],               // Array of: "SC", "ST", "OBC", "General"
  "minIncome": 0,                     // Minimum annual income in ₹ (number)
  "maxIncome": 250000,                // Maximum annual income in ₹ (number)
  "minAge": 18,                       // Minimum age (number)
  "maxAge": 45,                       // Maximum age (number)
  "occupations": ["Farmer"],          // Array of occupations
  "purposes": ["dairy"],              // Array of loan/project purposes
  "education": ["Class VIII"],        // Array of education levels
  "gender": "female",                 // "male", "female", or null
  "disabilityRequired": false,        // true if scheme is for disabled persons
  "existingBusiness": false           // true if requires existing business
}

Rules:
- Use standard Indian state names (e.g., "Gujarat", not "GJ")
- If text says "all over India" or similar, use ["ALL"]
- If field is not mentioned, use empty array [] or null
- Income amounts should be in rupees (not lakhs)
- Be precise - only extract what is explicitly stated
- For categories, only include if explicitly mentioned (SC, ST, OBC, General)
- For occupations, map to standard terms: Farmer, Student, Self-employed, Salaried, etc.
- For purposes, map to standard terms: agriculture, dairy, poultry, etc.

Return ONLY valid JSON, no other text.`

/**
 * Extract eligibility using LLM
 */
export async function extractWithLLM(
  eligibilityText: string
): Promise<{ extracted: ParsedEligibility; tokensUsed: number }> {
  if (!eligibilityText || eligibilityText.trim().length < 20) {
    return {
      extracted: {
        states: ["ALL"],
        categories: ["SC", "ST", "OBC", "General"],
        occupations: [],
        purposes: [],
        education: [],
      },
      tokensUsed: 0,
    }
  }

  // Truncate very long texts
  const truncated = eligibilityText.length > 2000
    ? eligibilityText.substring(0, 2000) + "..."
    : eligibilityText

  const prompt = `Extract eligibility from this text:\n\n${truncated}`

  const response = await callGroq(prompt)

  try {
    const parsed = JSON.parse(response)

    // Normalize the response
    const extracted: ParsedEligibility = {
      states: Array.isArray(parsed.states) ? parsed.states : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      minIncome: typeof parsed.minIncome === "number" ? parsed.minIncome : undefined,
      maxIncome: typeof parsed.maxIncome === "number" ? parsed.maxIncome : undefined,
      minAge: typeof parsed.minAge === "number" ? parsed.minAge : undefined,
      maxAge: typeof parsed.maxAge === "number" ? parsed.maxAge : undefined,
      occupations: Array.isArray(parsed.occupations) ? parsed.occupations : [],
      purposes: Array.isArray(parsed.purposes) ? parsed.purposes : [],
      education: Array.isArray(parsed.education) ? parsed.education : [],
      gender: parsed.gender || undefined,
      disabilityRequired: typeof parsed.disabilityRequired === "boolean"
        ? parsed.disabilityRequired
        : undefined,
      existingBusiness: typeof parsed.existingBusiness === "boolean"
        ? parsed.existingBusiness
        : undefined,
    }

    return { extracted, tokensUsed: rateLimitState.requestCount }
  } catch (error) {
    console.error("[Groq] Failed to parse response:", response)
    throw new Error("Failed to parse LLM response as JSON")
  }
}

/**
 * Get current token usage stats
 */
export function getTokenUsage(): { today: number; limit: number; remaining: number } {
  return {
    today: rateLimitState.tokensToday,
    limit: DAILY_TOKEN_LIMIT,
    remaining: DAILY_TOKEN_LIMIT - rateLimitState.tokensToday,
  }
}
