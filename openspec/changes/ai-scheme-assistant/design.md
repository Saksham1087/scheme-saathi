## Context

A conversational AI assistant helps users navigate scheme discovery through natural dialogue. Unlike a generic chatbot, it operates on verified Scheme Sathi data and never invents scheme benefits, eligibility criteria, or government policies. The assistant guides users through a structured conversation to collect their requirements and provide scheme recommendations, functioning as an intelligent layer on top of the recommendation engine.

## Goals / Non-Goals

**Goals:**
- Provide a conversational interface at `/assistant` for scheme discovery guidance
- Implement guided conversation flow: purpose → amount → income → state → category → recommend
- Operate exclusively on verified scheme data from the scheme-data-model
- Implement an AI safety layer that prevents hallucinated scheme information
- Integrate with the recommendation engine for scheme suggestions
- Support both text and voice input (voice from the voice-chat module)

**Non-Goals:**
- General-purpose chatbot functionality (no open-domain conversation)
- Providing legal, financial, or medical advice
- Processing or storing user documents
- Real-time scheme data updates or scraping
- Multi-turn memory beyond a single session conversation

## Decisions

1. **Conversation model**: The assistant SHALL follow a guided conversation pattern — it asks targeted questions in sequence rather than handling free-form conversation. This ensures structured data collection for the recommendation engine while still feeling conversational.

2. **AI safety rule**: The system SHALL NEVER fabricate or guess scheme-specific data. When the assistant is uncertain about a scheme's benefits, eligibility, interest rate, or any official detail, it SHALL respond with: "I couldn't verify this information from the available official source. Please check the official scheme page or contact the scheme authority." This is a hard rule with no exceptions.

3. **Data boundary**: The assistant's knowledge base is limited to scheme data in the scheme-data-model. It SHALL NOT generate information about schemes not in the database or make predictions about scheme availability.

4. **LLM integration**: The system MAY use an LLM API (e.g., Gemini) for natural language understanding and generation, but all scheme-specific claims SHALL be grounded in data from the scheme-data-model. The LLM handles conversation flow; the scheme data provides factual content.

5. **Integration with recommendation engine**: When the assistant has collected sufficient user requirements, it SHALL pass them to the smart-scheme-recommender to generate scheme suggestions, then present them conversationally.

6. **Voice input integration**: The assistant SHALL accept voice input through the voice-chat module's voice-input capability. Text input remains the default and always-available option.

7. **Session scope**: Each conversation is scoped to a single session. The assistant SHALL NOT retain conversation history across page refreshes or new sessions unless explicitly saved by the user.

## Risks / Trade-offs

- **LLM hallucination risk**: Even with grounding, LLMs can hallucinate. The AI safety layer SHALL cross-reference all scheme-specific claims against the scheme-data-model before presenting them. Any claim not verifiable against the data SHALL trigger the safety response.
- **Conversation length**: Users may abandon long guided conversations. The assistant SHALL allow users to skip non-critical questions and proceed with partial data, noting which fields are missing.
- **API dependency**: If using an LLM API, the assistant requires network connectivity. The system SHALL degrade gracefully to a simpler rule-based assistant if the API is unavailable.
- **Cost**: LLM API calls have costs. The system SHALL implement reasonable conversation length limits and consider caching common conversation patterns.
