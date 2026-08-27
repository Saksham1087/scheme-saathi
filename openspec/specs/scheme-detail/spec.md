# Scheme Detail

## Purpose

TBD - Define comprehensive scheme detail page with sections, CTA buttons, source attribution, and responsive layout.

## Requirements

### Requirement: Scheme Detail Page
The system SHALL provide a scheme detail page at route `/schemes/:slug` displaying comprehensive information about a single scheme.

#### Scenario: Page loads with valid slug
- **WHEN** a user navigates to `/schemes/pradhan-mantri-mudra-yojana`
- **THEN** the full scheme detail page SHALL render with all available sections

#### Scenario: Invalid slug
- **WHEN** a user navigates to `/schemes/nonexistent-scheme`
- **THEN** a 404 page SHALL be displayed indicating the scheme was not found

### Requirement: Detail Page Sections
The scheme detail page SHALL contain the following sections: Overview, Eligibility, Financial Assistance, Required Documents, Channel Partners, Application Process, and Source & Trust.

#### Scenario: All sections render
- **WHEN** a scheme detail page loads
- **THEN** each section SHALL be rendered with its heading and content, even if some sections have no data (displayed as "Not available")

### Requirement: Overview Section
The overview section SHALL display the scheme name, ministry, department, category tags, short description, and full description.

#### Scenario: Overview renders
- **WHEN** the scheme detail page loads
- **THEN** the overview section SHALL show scheme name as the page title, ministry/department as subtitles, category as badges, and the full description text

### Requirement: Eligibility Section
The eligibility section SHALL display the scheme's eligibility rules in a human-readable format.

#### Scenario: Eligibility rules displayed
- **WHEN** a scheme has eligibility rules
- **THEN** the eligibility section SHALL list each rule as a readable bullet point (e.g., "Annual household income must be ≤ ₹8,00,000")

### Requirement: Financial Assistance Section
The financial assistance section SHALL display the scheme's financial parameters including type, amount range, interest rate, loan limits, moratorium, and repayment terms.

#### Scenario: Loan scheme financial details
- **WHEN** a loan-type scheme is displayed
- **THEN** the financial section SHALL show interest rate, maximum loan amount, moratorium period, and repayment period

### Requirement: Documents Section
The documents section SHALL list all required documents with their names, descriptions, and mandatory/optional status.

#### Scenario: Document list rendered
- **WHEN** a scheme has required documents
- **THEN** the documents section SHALL list each document with a checkmark icon for mandatory documents and an info icon for optional documents

### Requirement: CTA Buttons
The scheme detail page SHALL include "Calculate My EMI" and "Find Partner" call-to-action buttons.

#### Scenario: CTA buttons present
- **WHEN** the scheme detail page loads
- **THEN** a "Calculate My EMI" button linking to the calculator and a "Find Partner" button linking to the partner locator SHALL be visible

#### Scenario: Calculate EMI link
- **WHEN** a user clicks "Calculate My EMI"
- **THEN** the user SHALL be navigated to the calculator page with the scheme's financial parameters pre-filled if supported

### Requirement: Source & Trust Section
The scheme detail page SHALL display the official source URL, source tier, last updated date, and verification status.

#### Scenario: Source attribution
- **WHEN** the scheme detail page loads
- **THEN** the source section SHALL show the official government URL as a clickable link and the data tier level

### Requirement: Responsive Layout
The scheme detail page SHALL use a responsive layout that adapts from multi-column on desktop to single-column on mobile.

#### Scenario: Desktop layout
- **WHEN** viewed on desktop
- **THEN** the detail page SHALL use a two-column layout with main content on the left and sidebar (CTAs, source info) on the right

#### Scenario: Mobile layout
- **WHEN** viewed on mobile
- **THEN** the detail page SHALL use a single-column layout with all sections stacked vertically