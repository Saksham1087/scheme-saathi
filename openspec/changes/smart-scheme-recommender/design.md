## Context

Scheme Sathi's core value proposition is intelligent scheme matching — users describe their situation and receive ranked recommendations with explainable matching. This change implements the primary recommendation engine: a conversational assessment flow that feeds into a rule-based eligibility check, weighted suitability scoring, and human-readable explanations for why schemes do or do not match. It is the primary differentiator of the product.

## Goals / Non-Goals

**Goals:**
- Provide a 6-8 question multi-step assessment flow (form and conversational modes)
- Check eligibility against scheme rules (income, age, category, state, occupation, education, purpose)
- Score suitability using weighted factors (income 20%, category 20%, purpose 20%, loan amount 20%, age 10%, location 10%)
- Return ranked scheme recommendations with match scores
- Explain why each scheme was recommended or rejected
- Handle no-match scenarios gracefully with alternative suggestions
- Save assessment history to user profile

**Non-Goals:**
- ML/AI-based scoring (rule-based only)
- Real-time comparison (covered in `scheme-comparison` change)
- Financial calculations (covered in `emi-calculator`, `moratorium-calculator` changes)
- Scheme application or document upload flows

## Decisions

- Assessment flow uses a stepper/progress pattern with both form and conversational modes for accessibility
- Eligibility engine is pure rule-based — no ML model dependencies, keeping the system auditable and offline-capable
- Suitability scoring uses fixed weights as specified in the PRD; weights are configurable but not user-facing
- Match scores are displayed as "Indicative matching score" — never as approval guarantees, to manage user expectations
- Explanation text is pre-defined per rejection/acceptance reason, not dynamically generated, ensuring consistency
- No-match alternatives are based on relaxed eligibility criteria (e.g., suggesting nearby states or slightly different categories)
- Assessment history is persisted to Firebase user profile for continuity across sessions

## Risks / Trade-offs

- **Fixed scoring weights** may not suit all user segments; mitigation is that weights are configurable in code even if not user-facing
- **Rule-based eligibility** may miss edge cases that ML could catch; acceptable trade-off for transparency and auditability
- **Conversational mode** adds complexity; forms are the primary path, conversational is progressive enhancement
- **No-match scenarios** could frustrate users; mitigated by always providing alternatives or guidance
- **Performance**: Scoring against a large scheme catalog may need optimization; initial implementation should profile and paginate if needed
