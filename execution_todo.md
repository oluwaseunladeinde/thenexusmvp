# Epic 3.1: HR Partner Onboarding
The goal of this task is to design and develop a comprehensive HR onboarding flow for new partners. This includes creating a seamless process that integrates design, development, and database components. The task is a high priority and is part of the current sprint, with a due date set for November 22, 2025. The focus is on ensuring a smooth onboarding experience that aligns with organizational standards and enhances efficiency.

## [P0] Design HR Onboarding Flow (Figma)
**Description:**
- Design 3-step onboarding wizard
- Step 1: Personal information
- Step 2: Company information
- Step 3: Hiring plans
- Design progress indicator
- Mobile responsive designs

### Acceptance Criteria:
- All 3 steps designed
- Progress bar included
- Form validation states designed
- Success confirmation designed

## [P0] Build HR Onboarding Step 1: Personal Info
**Description:**
- Build form fields:
  - First name, last name
  - Job title, department
  - LinkedIn URL
- Add validation
- Use onboarding layout from Task #24

### Acceptance Criteria:
- All fields validate
- Can proceed to step 2
- Form data persists


## [P0] Build HR Onboarding Step 2: Company Info
**Description:**
- Build form fields:
  - Company name, industry, size
  - Company website, description
  - Headquarters location
  - Logo upload
- Add validation

### Acceptance Criteria:
- Industry dropdown populated
- Company size options present
- Logo uploads successfully
- Can proceed to step 3


## [P0] Build HR Onboarding Step 3: Hiring Plans
**Description:**
- Build form fields:
  - Hiring timeline dropdown
  - Number of roles planning
  - Team size
- Add "What happens next" info box
- Implement final submission

### Acceptance Criteria:
- All fields validate
- Info box displays trial details
- Shows completion confirmation


## [P0] Create Company & HR Partner API Endpoint
**Description:**
- Create POST /api/hr-partners/create
- Create company record first
- Create HR partner record linked to company
- Link to Clerk user
- Start 14-day trial
- Update Clerk metadata

### Acceptance Criteria:
- Creates both company and HR partner
- Trial subscription initialized
- 5 introduction credits assigned
- Returns 201 on success


## [P0] Connect HR Onboarding to API
**Description:**
- Integrate form submission with API
- Handle loading/success/error states
- Redirect to HR dashboard on success

### Acceptance Criteria:
- Submits all form data
- Shows loading spinner
- Displays errors clearly
- Redirects to /dashboard


## [P0] Add Logo Upload to Company Info Step
**Description:**
- Integrate FileUploader component in Step 2 of HR onboarding wizard
- Allow HR partners to upload company logo during onboarding
- Store uploaded logo and update company record

### Acceptance Criteria:
- Logo upload field present in Step 2
- File validation (size, type) implemented
- Logo displays in preview after upload
- Logo URL saved to company record on submission


## [P0] Add Trial Info Box to Hiring Plans Step
**Description:**
- Add "What happens next" information box in Step 3
- Display details about 14-day trial and 5 introduction credits
- Explain next steps after onboarding completion

### Acceptance Criteria:
- Info box visible in Step 3
- Shows trial duration and credit allocation
- Explains dashboard access and next actions
- Box styled consistently with form design


## [P0] Implement HR Dashboard APIs
**Description:**
- Create API endpoints to fetch real HR data
- Replace mock data in dashboard with actual API calls
- Implement endpoints for HR stats, active jobs, and candidate matches

### Acceptance Criteria:
- GET /api/hr-partners/stats returns real statistics
- GET /api/hr-partners/jobs returns active job postings
- GET /api/hr-partners/matches returns candidate matches
- Dashboard loads real data instead of mocks


## [P0] Create Success Confirmation Page
**Description:**
- Build dedicated success page after onboarding completion
- Display trial details, credit balance, and welcome message
- Provide clear next steps and dashboard access

### Acceptance Criteria:
- Success page shows after form submission
- Displays trial expiration and credits remaining
- Includes welcome message and navigation to dashboard
- Mobile responsive and matches app design


## [P0] Build Missing HR Dashboard Pages
**Description:**
- Create job creation, talent search, team management, and analytics pages
- Implement navigation and basic functionality for dashboard links
- Ensure pages integrate with existing dashboard layout

### Acceptance Criteria:
- /dashboard/hr-partner/jobs/create page functional
- /dashboard/hr-partner/talents page shows candidate search
- /dashboard/hr-partner/team page for team management
- /dashboard/hr-partner/analytics page with hiring metrics


## [P0] Integrate Dual Role Option
**Description:**
- Add optional dual role selection to HR onboarding wizard
- Allow HR partners to create confidential professional profiles
- Ensure dual profiles are separate and private

### Acceptance Criteria:
- Dual role checkbox in Step 3
- Conditional professional profile form appears
- Creates separate professional record if selected
- Professional profile not visible to company


## [P0] Standardize Onboarding Layout
**Description:**
- Update OnboardingLayout component to support HR flow
- Ensure consistent design patterns across professional and HR onboarding
- Maintain mobile responsiveness and accessibility

### Acceptance Criteria:
- HR onboarding uses OnboardingLayout or updated version
- Consistent progress indicators and navigation
- Form styling matches professional onboarding
- Layout works on all screen sizes
