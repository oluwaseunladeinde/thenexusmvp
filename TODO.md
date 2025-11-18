# Epic 3.4: Introduction Request Flow (HR Side) - Implementation Plan

## P0 Tasks - Implementation Steps

### [x] Step 1: Create POST /api/v1/introductions/request API
- Create route.ts file under src/app/api/v1/introductions/request/
- Implement validations: HR permissions (SEND_INTRODUCTION_REQUESTS), professional availability, no duplicates, sufficient credits
- Create introduction_request record with expiresAt = now + 7 days
- Deduct 1 credit from company.introductionCredits (transactional)
- Send in-app notification to professional
- Return 201 on success, appropriate errors (400/403)

### [x] Step 2: Build IntroductionRequestModal Component
- Create src/components/hr/dashboard/IntroductionRequestModal.tsx (Note: Currently in hr/dashboard, should move to hr-partner)
- Include job role dropdown (fetch active roles only)
- Personalized message input (50-500 chars, required)
- Preview section showing what professional sees
- Send button with loading state
- Credit check warning if low on credits
- Modal opens from "Request Introduction" button in profile view

### [x] Step 3: Connect IntroductionRequestModal to API
- Integrate form submission to POST /api/v1/introductions/request
- Handle success: show confirmation, close modal, update credit balance in UI
- Handle errors: display validation messages clearly
- Use existing error handling patterns

### [x] Step 4: Create GET /api/v1/introductions/sent API
- Create route.ts file under src/app/api/v1/introductions/sent/
- Filter by HR partner's company
- Include professional and job role data in response
- Sort by date (newest first)
- Support pagination and status filtering
- Authenticate and authorize properly

### [x] Step 5: Build /dashboard/introductions Page (HR Side)
- Create src/app/dashboard/hr-partner/introductions/page.tsx
- List all sent introduction requests grouped by status (pending, accepted, declined, expired)
- Show professional name, job role, sent date, status
- Add filters (status, role, date range)
- Implement pagination
- Ensure mobile responsive

### [x] Step 6: Move IntroductionRequestModal to correct location
- Move from src/components/hr/dashboard/ to src/components/hr-partner/
- Update any imports that reference the old location

### [x] Step 7: Build IntroductionDetailView Component
- Create src/components/hr-partner/IntroductionDetailView.tsx (modal or page)
- Show full request details, professional's response (if any), status timeline
- If accepted: display contact details
- Add link/button to start message/conversation
- Handle different statuses appropriately

## P1 Tasks - Implementation Steps (Lower Priority)

### [ ] Step 9: Add Introduction Request Stats API
- Create GET /api/v1/introductions/stats API
- Calculate: total sent, acceptance rate, average response time, pending count
- Optimize with caching for performance
- Filter by HR partner's company

### [ ] Step 10: Display Stats on HR Dashboard
- Update src/components/hr-partner/dashboard/ to include stats cards
- Show key metrics with trend indicators
- Link cards to detailed views (/dashboard/introductions)

## Additional Identified Gaps

### [ ] Credit Balance Display
- Show real-time credit balance in IntroductionRequestModal
- Update UI when credits are deducted

### [ ] "Start Conversation" Functionality
- Implement messaging/conversation flow after accepted introductions
- Add API endpoints for messaging between HR and professionals

### [ ] Professional Response Handling
- Create API for professionals to accept/decline introduction requests
- Update request status and send notifications

### [ ] Notification Integration
- Add in-app notification UI for HR partners
- Show notification count and allow viewing

### [ ] Testing Implementation
- Add unit tests for API endpoints
- Add integration tests for UI components
- Perform end-to-end testing of complete flow

## Implementation Notes
- Follow existing API patterns (/api/v1/...)
- Use existing authentication (Clerk) and RBAC systems
- Integrate with notification system (src/lib/notifications.ts)
- Handle database transactions properly for credit deduction
- Ensure mobile responsiveness across all components
- Test complete flow from request to acceptance
- Update progress in this TODO.md as tasks are completed

## Progress Tracking
- [ ] Prisma migration run after schema update
- [ ] API endpoints tested with Postman/insomnia
- [ ] UI components tested on different screen sizes
- [ ] End-to-end flow tested
