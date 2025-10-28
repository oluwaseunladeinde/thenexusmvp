# Execution Plan

## Epic 2.1: Professional Onboarding
**Sprint Goal:** CSprint Goal: Build complete professional onboarding flow
This feature focuses on building a complete professional onboarding flow to enhance user experience. The goal is to design and develop a seamless process that ensures new users can efficiently integrate and navigate the platform. Key areas include interface design, functionality development, and user guidance.

### 1. Design Professional Onboarding Flow (Figma)
#### Description:
- Design a 3-step onboarding wizard
- Step 1: Basic info
- Step 2: Career expectations
- Step 3: Skills & profile links
- Design progress indicator
- Mobile responsive designs
#### Acceptance Criteria:
- All 3 steps designed
- Progress bar included
- Form validation states designed
- Success confirmation designed
#### Files to Create/Update:
- Design assets (external Figma file)

### 2. Create Onboarding Layout Component
#### Description:
- Create multi-step form layout
- Implement progress bar
- Add step navigation (back/next)
- Handle form state management (zustand | useState | useReducer)
#### Acceptance Criteria:
- Can navigate between steps
- Form data persists across steps
- Progress indicator updates correctly

### 3. Build Onboarding Step 1: Basic Info
#### Description:
- Build form fields: 
    - First name, last name
    - Profile headline
    - Location (city, state dropdowns) Note: Selected state determines sity selection, reference the state and city tables.
    - Years of experience
    - Current title, company, industry
- Add form validation (Zod)
- Handle form submission
#### Acceptance Criteria:
- All fields validate correctly
- Nigerian states in the dropdown
- Can proceed to step 2

### 4. Build Onboarding Step 2: Career Expectations
#### Description:
- Build form fields: 
    - Salary expectations (min/max)
    - Notice period dropdown
    - Willing to relocate checkbox
    - Open to opportunities checkbox
- Add validation
- Add privacy notice banner
#### Acceptance Criteria:
- Salary inputs formatted as currency (Naira)
- Privacy guarantee visible
- Can proceed to step 3

### 5. Build Onboarding Step 3: Skills & Links
#### Description:
- Build skill input with add/remove
- LinkedIn URL input
- Portfolio URL input
- Resume upload component
- Add validation
- Implement final submission
#### Acceptance Criteria:
- Can add up to 10 skills.
- URLs validate correctly
- Resume uploads to storage
- Shows completion confirmation

### 6. Create Professional Profile API Endpoint
#### Description:
- Create POST /api/professionals/create
- Validate input with Zod
- Create professional record in database
- Link to Clerk user
- Update Clerk metadata (onboardingComplete: true)
- Handle errors gracefully
#### Acceptance Criteria:
- Returns 201 on success
- Validates all required fields
- Creates professional and related records
- Returns helpful error messages

### 7. Implement Resume Upload to Cloud Storage
#### Description:
- Set up AWS S3 or Cloudflare R2
- Create upload API endpoint
- Implement file validation (PDF only, <5MB)
- Generate secure URLs
- Handle upload errors
#### Acceptance Criteria:
- PDF files upload successfully
- File size validated
- Returns secure URL
- Handles errors gracefully

### 8. Connect Onboarding to API
#### Description:
- Integrate form submission with API
- Handle loading states
- Handle success/error states
- Redirect to professional dashboard on success
#### Acceptance Criteria:
- Shows loading spinner during submission
- Displays success message
- Shows error messages
- Redirects to /professional/dashboard

### 9. Add Onboarding Progress Persistence
#### Description:
- Save form data to localStorage
- Restore data on page refresh
- Clear data on successful completion 
#### Acceptance Criteria
- Form data persists across refreshes
- Can resume from any step
- Data cleared on success

### Additional Notes
- Use Tailwind CSS for styling, ShadcnUI for any UI components.
- Ensure all components are TypeScript (.tsx).
- Test locally with npm run dev, check responsiveness in browser dev tools.
- After implementation, run performance tests as per README and update README with features additions as necessary.

