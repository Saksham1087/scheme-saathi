## ADDED Requirements

### Requirement: Persistent side-drawer chat widget
The system SHALL provide a persistent side-drawer chat widget accessible on all pages for signed-in users.

#### Scenario: Widget opens from Navbar trigger
- **WHEN** a signed-in user clicks the "Talk to Scheme Sathi" button in the Navbar
- **THEN** the side drawer SHALL slide in from the right (380px width on desktop, 100% on mobile <480px)
- **THEN** the drawer SHALL display the chat header, message list, and input bar

#### Scenario: Widget persists across navigation
- **WHEN** a user navigates between pages while the drawer is open
- **THEN** the drawer SHALL remain open with conversation intact
- **THEN** the message history SHALL be preserved

#### Scenario: Widget minimizes to tab
- **WHEN** a user clicks the minimize button in the drawer header
- **THEN** the drawer SHALL collapse to a 60px vertical tab on the right edge
- **THEN** the tab SHALL display "Scheme Sathi" vertically and an expand icon
- **WHEN** a user clicks the minimized tab
- **THEN** the drawer SHALL expand back to full width

#### Scenario: Widget closes completely
- **WHEN** a user clicks the close button in the drawer header
- **THEN** the drawer SHALL close and the minimized tab SHALL be hidden
- **WHEN** the user clicks the Navbar trigger again
- **THEN** the drawer SHALL open with full conversation history restored

#### Scenario: Unauthenticated user sees auth prompt
- **WHEN** an unauthenticated user clicks the Navbar trigger
- **THEN** the system SHALL redirect to the login page with a redirect back to current page
- **THEN** after successful login, the drawer SHALL open automatically

### Requirement: Chat message display
The system SHALL display conversation messages in a virtualized list with user and assistant bubbles.

#### Scenario: User message renders right-aligned
- **WHEN** a user sends a message
- **THEN** the message SHALL appear right-aligned in a primary-colored bubble
- **THEN** the message SHALL show timestamp

#### Scenario: Assistant message renders left-aligned with avatar
- **WHEN** the assistant responds
- **THEN** the message SHALL appear left-aligned in a secondary-colored bubble
- **THEN** the message SHALL show the Scheme Sathi bot avatar
- **THEN** the message SHALL include a "Play" button for TTS (if TTS enabled)

#### Scenario: Message list auto-scrolls to bottom
- **WHEN** a new message is added
- **THEN** the message list SHALL smoothly scroll to the bottom
- **WHEN** a user scrolls up to read history
- **THEN** auto-scroll SHALL pause until user returns to bottom

#### Scenario: Loading state during assistant response
- **WHEN** a request is sent to the backend
- **THEN** a typing indicator SHALL appear ("Scheme Sathi is thinking...")
- **WHEN** the response arrives
- **THEN** the typing indicator SHALL be replaced with the actual message

### Requirement: Conversation persistence
The system SHALL persist conversation history to IndexedDB keyed by user UID.

#### Scenario: Conversation loads on drawer open
- **WHEN** a signed-in user opens the drawer
- **THEN** the system SHALL load messages from IndexedDB for the current UID
- **THEN** the message list SHALL render with persisted history

#### Scenario: Conversation saves on each message
- **WHEN** a user or assistant message is added
- **THEN** the system SHALL debounced-save (500ms) the updated history to IndexedDB
- **THEN** the saved data SHALL include messages, timestamps, and TTS playback state

#### Scenario: Conversation clears on explicit action
- **WHEN** a user clicks "New Conversation" in the drawer header
- **THEN** the system SHALL clear the current message list
- **THEN** the system SHALL remove the persisted data for this UID
- **THEN** the assistant SHALL send the welcome message

#### Scenario: History limit enforced
- **WHEN** the message count exceeds 100
- **THEN** the system SHALL remove oldest messages (keep last 100)
- **THEN** the persisted data SHALL reflect the trimmed history

### Requirement: Drawer responsive behavior
The system SHALL adapt the drawer layout for mobile viewports.

#### Scenario: Mobile full-width drawer
- **WHEN** viewport width is < 480px
- **THEN** the drawer SHALL use 100% viewport width
- **THEN** the drawer SHALL slide in from bottom or right with swipe-to-close gesture

#### Scenario: Desktop fixed width
- **WHEN** viewport width is >= 480px
- **THEN** the drawer SHALL use fixed 380px width
- **THEN** the drawer SHALL not be swipe-dismissible

### Requirement: Welcome message and quick prompts
The system SHALL display a contextual welcome message with example prompts on empty conversation.

#### Scenario: First-time user sees welcome
- **WHEN** a user opens the drawer with no conversation history
- **THEN** the assistant SHALL send a welcome message: "Namaste! I'm Scheme Sathi. Ask me about government schemes, eligibility, repayment, documents, or Channel Partners."
- **THEN** quick prompt chips SHALL appear: "Find schemes for business", "Calculate EMI", "Required documents", "Find Channel Partner"

#### Scenario: Quick prompt sends predefined message
- **WHEN** a user clicks a quick prompt chip
- **THEN** the chip's text SHALL be sent as a user message
- **THEN** the assistant SHALL respond appropriately