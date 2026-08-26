## ADDED Requirements

### Requirement: Itemized cost builder
The system SHALL provide an itemized project cost builder where users can add, edit, and remove line items with a description, category, and amount.

#### Scenario: User adds a line item
- **WHEN** the user clicks "Add item" in the cost planner
- **THEN** the system SHALL add a new empty row with fields for category (dropdown), description (text input), and amount (number input)

#### Scenario: User removes a line item
- **WHEN** the user clicks the remove/delete button on a line item
- **THEN** the system SHALL remove that line item from the list
- **THEN** the running total SHALL update to exclude the removed item's amount

#### Scenario: User edits a line item amount
- **WHEN** the user changes a line item's amount from ₹50,000 to ₹75,000
- **THEN** the running total SHALL update immediately to reflect the change

### Requirement: Running total calculation
The system SHALL display a running total of all line item amounts that updates in real-time as items are added, edited, or removed.

#### Scenario: Multiple items with running total
- **WHEN** the user has three items: ₹1,00,000, ₹50,000, and ₹25,000
- **THEN** the running total SHALL display ₹1,75,000
- **THEN** the total SHALL update immediately when any item changes

#### Scenario: Empty planner
- **WHEN** the user has no line items
- **THEN** the running total SHALL display ₹0

### Requirement: Link from assessment flow
The system SHALL provide a link or CTA from the assessment flow to the project cost planner with the text "Don't know your project cost? Use the planner".

#### Scenario: User accesses planner from assessment
- **WHEN** the user is on the assessment flow and clicks the project cost planner link
- **THEN** the system SHALL open the planner (modal or page)
- **THEN** upon completing the planner, the total SHALL be passed back to the assessment flow

### Requirement: Project plan persistence
The system SHALL save project cost plans (line items and total) to the user's Firebase profile for logged-in users.

#### Scenario: Logged-in user saves a plan
- **WHEN** a logged-in user completes a project cost plan
- **THEN** the system SHALL save the line items (category, description, amount) and total to Firebase
- **THEN** the plan SHALL be available for the user to load on subsequent visits

#### Scenario: Offline user creates a plan
- **WHEN** an offline user creates a project cost plan
- **THEN** the planner SHALL function locally
- **THEN** the plan SHALL be saved to Firebase when connectivity is restored (if user is logged in)
