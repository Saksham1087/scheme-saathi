# PRD Quality Review — SchemeSathi

## Overall verdict
The SchemeSathi PRD provides a clean, well-scoped foundation for a demo-focused MVP, featuring highly functional user journeys and clear constraints against scope creep. However, it is currently blocked from being fully actionable by thin done-ness clarity, specifically the lack of algorithms or math for the Match Score and moratorium interest calculations. Addressing these technical definition gaps and adding explicit strategic trade-off notes will elevate the PRD to a decision-ready state.

## Decision-readiness — adequate
The PRD outlines the scope boundaries clearly, but it fails to surface strategic trade-offs or highlight tensions using PM callouts. Choices like opting for a local static SQLite database over a live sync are presented simply as parameters rather than active trade-offs with what was sacrificed.

### Findings
- **medium** (§4.1/4.2) Missing `[NOTE FOR PM]` Callouts — There are no `[NOTE FOR PM]` callouts anywhere in the PRD, which means real development tensions (e.g. database client caching, SMS mocking limits) are not surfaced as PM-level decisions or trade-offs. *Fix:* Add `[NOTE FOR PM]` callouts in §4.1 and §4.2 highlighting the trade-offs of offline capabilities and local database seeds.
- **low** (§5/6) Lack of Explicit Strategic Trade-off Analysis — Strategic choices (e.g., opting for offline SQLite client-side routing over centralized server database) are listed but not framed with what was sacrificed (e.g., losing centralized analytics and real-time scheme updates). *Fix:* Document the specific trade-offs (benefits vs sacrifices) in the MVP Scope (§6) or Vision (§1).

## Substance over theater — strong
The PRD avoids theater completely. It contains exactly two personas that directly map to specific functional requirements and user journeys (Ramesh in UJ-1 and Anjali in UJ-2). Non-functional requirements (NFRs) are product-specific and concrete, such as the 3-second database query performance under a 1,000-user load, and the vision statement is uniquely tailored to concessional loans for SC beneficiaries.

## Strategic coherence — strong
The document has a strong strategic thesis centered on translating complex, fragmented scheme eligibility criteria into simple recommendations and local channel routing. The feature set and MVP scope follow directly from this thesis, and the success metrics (e.g. match accuracy and journey completion time) are supported by a great counter-metric (time-on-site) that explicitly discourages artificially maximizing session length.

## Done-ness clarity — thin
While the PRD provides testable consequences for several requirements, it has major gaps that prevent an engineer from building the system without making arbitrary design assumptions. Most notably, the mathematical calculation for the Match Score percentage and the interest capitalization formulas during a moratorium are entirely undefined.

### Findings
- **high** (§3 / 4.1 / FR-2) Unspecified Match Score Logic — The glossary defines Match Score as "An indicative percentage score showing the alignment of a user's profile with a scheme's eligibility rules" (§3), and UJ-1 refers to a "95% match" (§2.3), but the PRD does not specify the algorithm or weighting rules to calculate this percentage. *Fix:* Add an explicit formula or step-by-step logic for calculating the Match Score in §4.1 or the technical addendum.
- **high** (§4.2 / FR-3) Undefined Moratorium Calculation Formulas — FR-3 requires the calculator to display the difference between "capitalizing interest" and "non-capitalizing interest" (§4.2), but the exact mathematical formulas, compounding frequencies, or amortization rules are not defined in the PRD or technical addendum. *Fix:* Document the compounding interest formulas and repayment schedule calculations in the addendum.
- **medium** (§4.3 / FR-4) Vague Proximity Boundaries for Locator — FR-4 specifies finding "local Channel Partners" (§4.3) and UJ-1 refers to "nearest... office in his district" (§2.3), but there are no geometric radius constraints or strict hierarchical filtering rules (e.g., district-level vs state-level search) defined for the matching query. *Fix:* Define the search radius or filtering bounds (e.g., query restricted to the user's selected district) in §4.3.

## Scope honesty — adequate
The PRD is highly transparent about what is in and out of scope, using a clear Non-Goals section to prevent scope creep (e.g., explicitly excluding direct loan disbursement). Assumptions are also tracked and indexed in Section 9. However, it lacks PM notes on persistence boundaries for user profiles.

### Findings
- **low** (§10) Lack of PM Note on Persistent User Profile Data — The PRD states in §10 that no PII is stored "unless saved by an authenticated user", but it is unclear what happens to the user profile and mock OTP state when a user logs out or leaves. *Fix:* Add an assumption or PM note clarifying that user profile data in the MVP is stored only in the browser's local storage and cleared upon logout.

## Downstream usability — adequate
The PRD features contiguous, unique IDs (FR-1 through FR-6, UJ-1, UJ-2, SM-1, SM-2) and clear cross-references. UJs have named protagonists (Ramesh and Anjali) with relevant context. However, there is a minor glossary drift.

### Findings
- **low** (§3 / Glossary) Unused Glossary Term "Scheme Explorer" — "Scheme Explorer" is defined in the glossary (§3) but is never used or referenced in the user journeys, functional requirements, or addendum. *Fix:* Remove "Scheme Explorer" from the glossary or update §4.1 to reference it.

## Shape fit — strong
The PRD shape is a perfect fit for a consumer-facing digital companion. The combination of user-focused journeys (with named proponents) and strict constraint traceabilities matches the multi-stakeholder routing nature of the product.

## Mechanical notes
- **Glossary Drift:** The term "Scheme Explorer" is defined in the Glossary (§3) but never referenced anywhere else in the main PRD or addendum.
- **ID Continuity:** Fully contiguous and unique IDs (UJ-1, UJ-2, FR-1 to FR-6, SM-1, SM-2, SM-C1) with resolved cross-references.
- **Assumptions Index Roundtrip:** All inline assumptions (§4.1 and §4.2) are indexed in Section 9. However, they are labeled "Assumption 4.1" and "Assumption 4.2" in the index, which drifts slightly from the generic inline label `[ASSUMPTION: ...]`.
- **UJ Protagonist Naming:** Both journeys feature named protagonists (Ramesh, Anjali) with specific context (SC category, location, and financial objectives).
