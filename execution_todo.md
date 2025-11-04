# Epic 2.3: Introduction Request Management (Professional Side)
Epic 2.3 focuses on building a system that enables professionals to receive and respond to introduction requests efficiently. This feature will streamline communication, making it easier for professionals to connect and collaborate. The goal is to enhance user experience by providing a seamless process for managing introductions.

## Key Objectives:
Develop functionality for professionals to receive introduction requests.
Enable professionals to respond to these requests within the platform.
Ensure the process is intuitive and user-friendly.

## [P0] Design Introduction Request Card (Figma)
### Design card showing: 
  - Job role details
  - Company info (or "Confidential")
  - Salary range 
  - Personalized message 
  - Accept/Decline buttons 
- Design expanded view

### Acceptance Criteria: 
- Card design completed
- CTA buttons prominent
- Mobile responsive

## [P0] Build Introduction Requests List
**Description:** 
- Create introductions list page
- Display pending introductions
- Group by status (pending, accepted, declined)
- Add filters (status, date)

### Acceptance Criteria: 
- Lists all introductions
- Grouped by status
- Filters work correctly
- Responsive layout

## [P0] Create Get Introduction Requests API
**Description:** 
- Create GET /api/v1/introductions/received
- Filter by professional ID
- Include job role and company details
- Sort by date (newest first)

### Acceptance Criteria: 
- Returns all introductions for professional
- Includes related data (job, company)
- Properly paginated
- Authenticated

## [P0] Build Introduction Request Detail Modal
**Description:** 
- Create modal component
- Show full job description
- Show HR contact preview
- Add accept/decline buttons with optional message

### Acceptance Criteria: 
- Modal opens on card click
- All details visible
- Can accept/decline with message
- Closes on action

## [P0] Create Accept/Decline Introduction API
**Description:** 
- Create POST /api/v1/introductions/:id/accept
- Create POST /api/v1/introductions/:id/decline
- Update introduction status
- Create a notification for the HR partner
- If accepted: unlock contact details

### Acceptance Criteria: 
- Status updates correctly
- Notifications sent
- Contact details revealed on accept
- Optional message saved

## [P0] Connect Accept/Decline to API
**Description:** 
- Connect modal actions to API
- Show success/error messages
- Update UI optimistically
- Redirect or refresh list

### Acceptance Criteria: 
- Accept button works
- Decline button works
- UI updates immediately
- Shows confirmation message

## [P1] Add Introduction Request Expiration Logic
**Description:** 
- Create cron job to expire old requests
- Set expires_at = sent_at + 7 days
- Update status to 'expired' automatically
- Send notification to HR partner

### Acceptance Criteria: 
- Cron runs daily
- Expired requests marked correctly
- Notifications sent
- Testable locally

## [P1] Display Expired Requests
**Description:** 
- Show expired requests in a separate section
- Gray out expired cards
- Display expiration date

### Acceptance Criteria: 
- Expired section visible
- Cards styled differently
- Clear messaging