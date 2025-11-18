# Epic 3.4: Introduction Request Flow (HR Side)
**Sprint Goal:** Allow HR to send introduction requests to professionals

This task focuses on developing the HR-side functionality for sending introduction requests to professionals. The goal is to create a seamless flow that allows HR teams to initiate and manage these requests efficiently. Key areas of focus include database integration, API development, and user interface design to ensure a smooth and intuitive experience.

Tags: database, API, development

## [P0] Design Introduction Request Modal (Figma)
### Description
- Design modal for sending intro request
- Job role selector
- Personalized message textarea
- Preview section
- Send button with confirmation

### Acceptance Criteria: 
- Modal design complete
- All fields included
- Preview shows what professional sees
- Mobile responsive

## [P0] Build Introduction Request Modal
### Description
- Create modal component
- Job role dropdown (active roles only)
- Personalized message input (required, 50-500 chars)
- Show preview of request
- Add send button
- Handle credit check warning

### Acceptance Criteria: 
- Modal opens from profile view
- Job roles populated
- Message validates
- Preview accurate
- Warns if low on credits

## [P0] Create Introduction Request API (Send)
### Description
- Create POST /api/v1/introductions/request
- Validate: 
    - HR has permission to send
    - Professional is available
    - No duplicate pending request
    - Company has credits
- Create introduction_request record
- Deduct 1 credit from company
- Set expires_at = now + 7 days
- Send notification to professional (email + WhatsApp)

### Acceptance Criteria: 
- Creates request successfully
- Credits deducted
- Notifications sent
- Returns 201 on success
- Returns 400/403 on validation failure

## [P0] Connect Introduction Modal to API
### Description
- Submit form data to API
- Handle success (show confirmation, close modal)
- Handle errors (display message)
- Update credit balance in UI

### Acceptance Criteria: 
- Request sends successfully
- Success message displays
- Modal closes
- Credit count updates
- Errors displayed clearly

## [P0] Connect Introduction Modal to API
### Description
- Create /dashboard/introductions page
- List all sent introduction requests
- Group by status (pending, accepted, declined, expired)
- Show professional name, job role, sent date, status
- Add filters (status, role, date)

### Acceptance Criteria: 
- Lists all sent requests
- Grouped by status
- Filters work
- Shows key info per request

## [P0] Create Get Introduction Requests API (HR Side)
### Description
- Create GET /api/introductions/sent
- Filter by HR partner's company
- Include professional and job role data
- Sort by date (newest first)
- Paginate results

### Acceptance Criteria: 
- Returns all company's requests
- Includes related data
- Properly paginated
- Authenticated

## [P0] Build Introduction Detail View (HR Side)
### Description
- Create detail modal or page
- Show full request details
- Show professional's response (if any)
- Show status timeline
- If accepted: show contact details
- Add message/conversation link

### Acceptance Criteria: 
- All details visible
- Contact info shown if accepted
- Status history displayed
- Can start conversation

## [P0] Build Introduction Detail View (HR Side)
### Description
- Create detail modal or page
- Show full request details
- Show professional's response (if any)
- Show status timeline
- If accepted: show contact details
- Add message/conversation link

### Acceptance Criteria: 
- All details visible
- Contact info shown if accepted
- Status history displayed
- Can start conversation

## [P1] Add Introduction Request Stats
### Description
- Calculate stats for HR dashboard: 
    - Total sent
    - Acceptance rate
    - Average response time
    - Pending count
- Create API endpoint

### Acceptance Criteria: 
- Stats calculated correctly
- API returns stats
- Performance optimized (cached)


## [P1] Display Stats on HR Dashboard
### Description
- Add stats cards to HR dashboard
- Show key metrics
- Add trend indicators
- Link to detailed views

### Acceptance Criteria: 
- Stats display correctly
- Updates in real-time
- Cards link to relevant pages