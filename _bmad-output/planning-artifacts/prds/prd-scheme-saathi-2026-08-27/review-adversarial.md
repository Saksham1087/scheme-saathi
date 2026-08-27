# Adversarial Review: SchemeSathi PRD & Technical Addendum

**Date:** 2026-08-27  
**Status:** Completed  
**Review Lens:** Adversarial & Edge-Case Hunter  
**Overall Verdict:** ⚠️ **AMBER (Logical conflicts, security/privacy risks, and critical gaps identified)**

---

## Executive Summary

While the PRD and Addendum outline a functional and localized scheme matching platform suitable for a Hackathon MVP, the adversarial analysis reveals several logical gaps, missing requirements, data leakage risks, and calculation inconsistencies. Addressing these findings is crucial to avoid developer confusion during implementation, security vulnerabilities during public demos, and user frustration on real-world routing.

---

## Detailed Findings

| ID | Location | Category | Trigger Condition | Guard Snippet | Potential Consequence |
|---|---|---|---|---|---|
| **01** | `addendum.md:Section 2` & `prd.md:Section 6.1` | **Data Privacy & PII Leakage** | Hardcoded mock OTP (`123456`) combined with any phone number bypasses authentication for saving PII. | Maintain mock user profile states in localized browser `sessionStorage` instead of shared databases, and display a prominent warning banner: *"Demo Mode: Do not enter real PII."* | Unauthorized users can guess a 10-digit number and access another user's saved data (income, caste, phone). |
| **02** | `prd.md:FR-1` & `addendum.md:Section 1.3` | **Missing Requirement** | No gender field is collected in the demographic intake form, but scheme rules contain gender-specific concessional rates. | Add `gender` enum field (`MALE`, `FEMALE`, `OTHER`) to demographic intake fields in `FR-1` and update the matching engine input parameters. | Match scoring and calculator pre-fills fail to apply gender-specific scheme rates or rules, causing calculation mismatch. |
| **03** | `prd.md:Section 10 (NFR)` & `FR-4` | **Edge Case / Offline Fallback** | React Leaflet and OpenStreetMap depend on dynamic tile loading over internet, causing maps to fail in offline mode. | Add a clean, text-based fallback list showing SCA/partner office addresses, phone numbers, and districts when map tile requests fail. | The mapping UI freezes or renders a broken blank grid, making the partner locator completely unusable in rural offline mode. |
| **04** | `prd.md:FR-3` & `addendum.md:Section 1.1` | **Logical Conflict** | Calculator shows capitalized interest vs. interest paid during moratorium, even for schemes where `interest_accrues = FALSE`. | If `scheme.interest_accrues` is false, disable capitalization options in UI and display: *"Interest is fully subsidized during moratorium (0% interest accrued)."* | Users are presented with confusing or inflated repayment schedules for fully subsidized loan schemes. |
| **05** | `prd.md:FR-4` & `addendum.md:Section 1.2` | **Edge Case / Performance** | Leaflet maps display local partners without bounding/filtering by user's selected state/district. | Filter the SQL query dynamically based on user intake: `SELECT * FROM partners WHERE state = ? AND city = ?` before plotting map markers. | The map attempts to render all partners nationwide, causing rendering lag and massive visual clutter on mobile screens. |
| **06** | `prd.md:FR-6` | **User Process Illusion** | "Mock DigiLocker Sync" marks document certificates as "verified" on the dashboard without clear mock disclaimers. | Add an explicit modal and inline disclaimer: *"Demo Simulation: This verification is for demonstration only and does not constitute official submission."* | Users mistakenly assume their documents are officially verified and ready, leading to rejection at the bank or SCA office. |
| **07** | `addendum.md:Section 1.2` | **Missing Business Rules** | `npa_flag` and `fund_utilization` columns are defined in the schema, but no requirements define their impact. | Specify rules: gray out partners with `npa_flag == 'high'` or `fund_utilization >= 1.0` (exhausted), or rank low-NPA partners higher. | Developers ignore the fields or implement non-validated routing logic, potentially steering users to inactive/insolvent partners. |
| **08** | `prd.md:FR-5` | **State Contamination** | Document checklist checked-status is persisted globally in local state without partitioning by scheme. | Key the checklist local storage/state by scheme ID: `checklist_state[scheme_id] = { doc_id: boolean }`. | Checking off a document for one scheme carries over to a different scheme with entirely different requirements, confusing users. |
| **09** | `prd.md:FR-3` & `addendum.md:Section 1.1` | **Input Boundary Validation** | Moratorium and tenure input sliders allow values that exceed a scheme's configured maximum limit. | Set UI slider bounds dynamically: `max={scheme.max_moratorium}` and `max={scheme.max_tenure_months}`. | Users calculate and plan repayments that violate the scheme's legal/policy constraints, rendering calculations invalid. |
| **10** | `prd.md:UJ-1` & `addendum.md:Section 1.1` | **Logical Conflict** | Scheme matching does not display promoter contribution vs. loan coverage ratio, causing user expectations mismatch. | Explicitly show the breakdown in recommendation cards: *"Sanctioned Loan (e.g., 90%): ₹90,000 \| Required Self Contribution (10%): ₹10,000"*. | Users expect 100% funding of project costs and face disappointment/rejection when applying at the bank without margin money. |
| **11** | `prd.md:FR-2` & `MVP Scope` | **Multilingual Edge Case** | Rules engine returns dynamically generated matching explanations in English, bypassing Marathi/Hindi locales. | Implement dynamic explanation templates with localization keys (e.g., `matched_income_ceiling` in `en.json`, `hi.json`, `mr.json`). | The user interface displays a mix of Marathi/Hindi headers but English matching reasons, resulting in a broken localized UX. |

---

## Recommendations & Mitigation Path

1. **Intake Upgrades:** Update `FR-1` to include `gender` so that eligibility calculations match correct concession criteria.
2. **Safe Mocking:** Clear all SQLite session-derived tables on browser session termination or limit mock profile storage to the local frontend storage to prevent cross-profile leakage under the shared OTP emulator.
3. **Map Fallback:** Code a robust list-view fallback for Leaflet/OSM to maintain the "offline" reliability NFR.
4. **Data Consistency:** Validate that calculator sliders and promoter contributions adhere strictly to the scheme metadata fields (`max_moratorium`, `max_tenure_months`, `coverage_max_pct`).
