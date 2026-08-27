## ADDED Requirements

### Requirement: Scheme Listing Page
The system SHALL provide a scheme listing page at route `/schemes` displaying all available schemes in a responsive card grid.

#### Scenario: Page loads
- **WHEN** a user navigates to `/schemes`
- **THEN** a grid of scheme cards SHALL be displayed with the page title "Explore Schemes"

#### Scenario: Empty state
- **WHEN** no schemes match the current filters/search
- **THEN** a message SHALL be displayed indicating "No schemes found" with an option to clear filters

### Requirement: Pagination
The scheme listing SHALL support pagination with a "Load More" button or infinite scroll.

#### Scenario: Initial load
- **WHEN** the scheme listing page loads
- **THEN** the first page of schemes (up to 20) SHALL be displayed

#### Scenario: Load more
- **WHEN** a user clicks "Load More" or scrolls to the bottom
- **THEN** the next batch of schemes SHALL be loaded and appended to the existing list

### Requirement: Sorting
The scheme listing SHALL support sorting by relevance (default), name, loan amount (high to low), and match score.

#### Scenario: Sort by loan amount
- **WHEN** a user selects "Loan Amount: High to Low" sort option
- **THEN** schemes SHALL be reordered with highest loan amount first

#### Scenario: Default sort
- **WHEN** the page loads without a sort selection
- **THEN** schemes SHALL be sorted by relevance (combination of match score and popularity)

### Requirement: Responsive Grid
The scheme card grid SHALL adapt to viewport width.

#### Scenario: Desktop grid
- **WHEN** viewed on desktop (width >= 1024px)
- **THEN** scheme cards SHALL be displayed in a 3-column grid

#### Scenario: Tablet grid
- **WHEN** viewed on tablet (width >= 768px and < 1024px)
- **THEN** scheme cards SHALL be displayed in a 2-column grid

#### Scenario: Mobile grid
- **WHEN** viewed on mobile (width < 768px)
- **THEN** scheme cards SHALL be displayed in a single column

### Requirement: URL Filter State
Filter and search state SHALL be encoded in URL query parameters for shareability and back-button support.

#### Scenario: Filter URL
- **WHEN** a user applies category=education filter
- **THEN** the URL SHALL update to `/schemes?category=education`

#### Scenario: Restore from URL
- **WHEN** a user opens `/schemes?category=education&state=Maharashtra`
- **THEN** the listing SHALL display only education schemes in Maharashtra
