# Epic 6 Planning Context: Multilingual Voice Assistant & Grounded Conversational Support

## Executive Summary
Epic 6 equips SchemeSathi with voice-first accessibility and an intelligent conversational assistant ("Saathi AI") tailored for low-literacy citizens and grassroots facilitators. It integrates browser-native Web Speech API voice capture in Hindi (`hi-IN`), Marathi (`mr-IN`), and English (`en-IN`) with rule-based parameter extraction and a grounded conversational assistant with strict zero-hallucination guardrails based on verified scheme data.

## Epic 6 Stories
1. **Story 6.1: Web Speech API Multilingual Voice Intake**
   - Web Speech API integration supporting Hindi (`hi-IN`), Marathi (`mr-IN`), and Indian English (`en-IN`).
   - Voice intake overlay with animated listening ripple and speech waveform.
   - Natural language parameter extractor parsing spoken Indian phrases (e.g. "Dukan ke liye 1 lakh" $\rightarrow$ purpose: shop, amount: 100000; "Padhai ke liye 4 lakh loan" $\rightarrow$ purpose: higher_education, amount: 400000).
   - Direct integration across `/find-schemes` intake wizard, global floating voice button, and text fallback.

2. **Story 6.2: Grounded Conversational Scheme Assistant ("Saathi AI")**
   - Floating and dedicated conversational assistant page (`/assistant` and global bottom-right bubble).
   - Strict source-grounded RAG/rule engine querying verified local/Firestore scheme datasets.
   - Mandatory AI safety guardrails: if an answer is not present in official scheme guidelines, responds with: "I couldn't verify this information from the available official government guidelines" and strictly refuses to fabricate loan approval commitments.
   - Suggested quick prompts (e.g., "Interest rate for women entrepreneurs?", "Documents for Education Loan?").
   - Voice-to-chat dictation and text-to-speech reading output for accessibility.
