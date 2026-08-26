## Why

A conversational AI assistant helps users navigate scheme discovery through natural dialogue. Unlike a generic chatbot, it operates on verified Scheme Sathi data and never invents scheme benefits, eligibility, or government policies.

## What Changes

- Conversational AI at `/assistant`
- Guided conversation: ask purpose → amount → income → state → category → recommend
- Operates on verified scheme data only
- AI safety rule: "I couldn't verify this information from the available official source" when uncertain
- Never hallucinate: loan limits, interest rates, income limits, eligibility, government benefits
- Integration with recommendation engine for scheme suggestions
- Text input with voice input option (from voice-chat module)

## Capabilities

### New Capabilities
- `ai-assistant`: Conversational interface for scheme discovery guidance
- `ai-safety`: Verification layer preventing hallucinated scheme information
- `ai-guided-conversation`: Structured conversation flow extracting user requirements

### Modified Capabilities

(none)

## Impact

- New `src/pages/Assistant.tsx`
- New `src/services/ai/` directory with assistant, safety modules
- New component: ChatInterface, MessageBubble, AIAssistant
- Optional dependency: LLM API (Gemini or similar) for advanced conversation
- Depends on: `scheme-data-model`, `smart-scheme-recommender`
