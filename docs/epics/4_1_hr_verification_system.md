# Epic 4.1: Verification System
**Sprint Goal:**  Implement basic verification for professionals and companies

This task focuses on developing a basic verification system for professionals and companies. The goal is to ensure that users can verify their identities and credentials, enhancing trust and credibility within the platform. This feature will serve as a foundation for more advanced verification processes in the future.

## [P0] Create LinkedIn Verification Logic
### Description
- Validate LinkedIn URL format
- Check URL is accessible (HEAD request)
- Mark as 'basic' verification if LinkedIn present
- Store verification date

### Acceptance Criteria: 
- URL format validated
- Accessibility checked
- Verification status updated

## [P0] Create Admin Verification Queue
### Description
- Create GET /api/admin/verification/queue
- Return unverified professionals and companies
- Create POST /api/admin/verification/approve
- Create POST /api/admin/verification/reject
- Send notification on verification decision

### Acceptance Criteria: 
- Queue lists unverified entities
- Can approve/reject
- Notifications sent
- Verification date recorded

## [P1] Build Admin Verification Page
### Description
- Create /admin/verification page
- List professionals and companies pending verification
- Show profile details for review
- Add approve/reject buttons
- Add notes field for rejection reason

### Acceptance Criteria: 
- Lists pending verifications
- Can view full profiles
- Approve/reject works
- Rejection notes saved

## [P0] Display Verification Badge
### Description
- Create verification badge component
- Display on professional profile (both views)
- Display on search result cards
- Add tooltip explaining verification

### Acceptance Criteria:
- Badge displays correctly
- Only shows if verified
- Tooltip informative
- Matches design

## [P1] Implement Company Domain Verification
### Description
- Extract the domain from the company website
- Extract the domain from the HR email
- Verify domains match
- Auto-verify if match
- Flag for manual review if a mismatch

### Acceptance Criteria: 
- Domain extraction works
- Comparison logic accurate
- Auto-verification functional
- Manual review flagged

## [P2] Add Verification Reminders
### Description
- Send email reminder if profile incomplete after 3 days
- Remind to add LinkedIn for verification
- Send admin notification if queue > 10 items

### Acceptance Criteria:
- Reminders sent via email
- Timing configurable
- Admin notifications work