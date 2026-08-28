# Epic 3 Planning Context: Financial Planning, Moratorium & Project Cost Calculators

## Executive Summary
Epic 3 provides beneficiaries with tools to simulate EMI obligations under concessional scheme terms, model the true lifetime cost of interest capitalization vs servicing interest during moratorium grace periods, and itemize total project startup expenses with automatic calculation of the Scheme Concessional Loan share vs Beneficiary Own Contribution (Promoter Margin).

## Epic 3 Stories
1. **Story 3.1: Standard & Scheme-Aware EMI Amortization Calculator (`/calculator`)**
   - Interactive sliders & numerical inputs for Loan Principal (₹10K to ₹50L+), Interest Rate (2% to 18%), Tenure (6 to 120 months).
   - Real-time monthly reducing-balance EMI, total interest, and total payable calculation.
   - Scheme-aware preset loader (reads URL query params: `amount`, `rate`, `tenure`, `moratorium`, `accrual`, `scheme`).
   - Annual & monthly amortization schedule breakdown with principal vs interest visualization.

2. **Story 3.2: Moratorium & Interest Capitalization Simulation**
   - Interactive moratorium slider (0 to 60 months).
   - Side-by-side comparative simulation:
     - **Scenario A (Capitalize Interest)**: Unpaid interest during moratorium added to principal; subsequent EMIs run on higher balance.
     - **Scenario B (Service Interest Monthly)**: Simple monthly interest paid during moratorium; principal balance remains uninflated.
   - Clear highlight of extra lifetime interest paid under capitalization.

3. **Story 3.3: Project Cost Planner & Financing Breakdown**
   - Startup expense category planner: Equipment / Machinery, Raw Materials / Inventory, Rent / Security Deposit, Working Capital, Registration / Training, Other.
   - Live total project cost summation.
   - Financing Breakdown calculation: Concessional Scheme Loan (e.g. 90% or 95%) vs Beneficiary Own Contribution (Promoter Margin 5%–10%).
   - Direct CTA passing the calculated project budget and purpose directly into the `/find-schemes` guided intake wizard.
