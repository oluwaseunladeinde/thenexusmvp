# Epic 3.2: Job Role Posting
**Sprint Goal:** Allow HR to create and manage job postings

This task focuses on enabling HR to create and manage job postings effectively. It involves developing features that streamline the job posting process, including API integration and design elements. Tagged under "development," "API," and "design," this task is part of the sprint goal to enhance HR's capabilities. The task is currently in the backlog with a due date of November 27, 2025.

## [P0] Design Job Role Form (Figma)
### Description
- Design job role creation form
- All fields (title, description, requirements, etc.)
- Skills selector component
- Salary range inputs
- Confidential role toggle
- Save as draft / publish buttons

### Acceptance Criteria:
- All fields from schema included
- Skills selector designed
- Mobile responsive
- Draft vs publish states clear

## [P0] Build Job Role Creation Page
### Description
- Create /dashboard/roles/new page
- Build form with all fields:
  - Title, description, responsibilities
  - Requirements, qualifications
  - Seniority level, industry, department
  - Location, remote options
  - Salary range, benefits
  - Required/preferred skills (multi-select)
  - Confidential toggle
- Add validation
- Implement a rich text editor for description

### Acceptance Criteria:
- All fields are present and functional
- Rich text editor works
- Skills can be added/removed
- Validation prevents submission of invalid data

## [P0] Build Job Role Creation Page
### Description
- Create POST /api/job-roles
- Create GET /api/job-roles (list for company)
- Create GET /api/job-roles/:id
- Create PUT /api/job-roles/:id
- Create DELETE /api/job-roles/:id (soft delete)
- Validate permissions (HR can only manage own company's roles)

### Acceptance Criteria:
- CRUD operations work
- Permissions enforced
- Skills stored as JSONB array
- Returns proper status codes

## [P0] Connect Job Role Form to API
### Description
- Connect form submission to API
- Handle save as draft vs publish
- Show success message
- Redirect to roles list

### Acceptance Criteria:
- Draft saves successfully
- Publish changes status to 'active'
- Success toast displays
- Redirects to /dashboard/roles

## [P0] Connect Job Role Form to API
### Description
- Connect form submission to API
- Handle save as draft vs publish
- Show success message
- Redirect to roles list

### Acceptance Criteria:
- Draft saves successfully
- Publish changes status to 'active'
- Success toast displays
- Redirects to /dashboard/roles

## [P0] Design Job Roles List Page (Figma)
### Description
- Design roles list/grid view
- Role card design (title, status, stats)
- Empty state design
- Filters (status, date)

### Acceptance Criteria:
- List and grid views designed
- Card shows key info
- Empty state clear and actionable


## [P0] Build Job Roles List Page
### Description
- Create /dashboard/roles page
Fetch and display company's roles
Show status badges (draft, active, filled, closed)
Add "Create new role" button
Add filters (status)
Show intro request stats per role

### Acceptance Criteria:
- Lists all roles for company
- Status badges display
- Filters work
- Links to role detail pages

## [P0] Build Job Roles List Page
### Description
- Create /dashboard/roles page
- Fetch and display company's roles
- Show status badges (draft, active, filled, closed)
- Add "Create new role" button
- Add filters (status)
- Show intro request stats per role

### Acceptance Criteria:
- Lists all roles for company
- Status badges display
- Filters work
- Links to role detail pages

## [P1] Build Job Role Detail Page
### Description
- Create /dashboard/roles/:id page
- Display full role details
- Show introduction requests for this role
- Add edit/close role buttons
- Show applicant pipeline

### Acceptance Criteria:
- All role details visible
- Can edit role
- Can close role
- Shows related introductions


## [P1] Implement Role Status Management
### Description
- Create PATCH /api/job-roles/:id/status
- Allow status changes: draft → active → paused/filled/closed
- Validate status transitions
- Send notifications on status change

### Acceptance Criteria:
- Status updates correctly
- Invalid transitions rejected
- Notifications sent to professionals with pending intros

## [P2] Job Role Templates System
### Description
- Create predefined job role templates for common positions
- Templates include pre-filled descriptions, responsibilities, requirements, and skills
- Template categories: Software Engineer, Product Manager, Marketing Director, etc.
- "Use Template" button in job creation form
- Modal to select and customize templates

### Acceptance Criteria:
- Templates cover major job categories
- Pre-fills all relevant form fields
- Users can customize template content
- Templates are easily extensible

## [P2] AI-Assisted Job Description Generation
### Description
- Integrate OpenAI API for generating custom job descriptions
- Generate descriptions based on role title, industry, and seniority level
- "Generate with AI" button in form
- Allow users to refine AI-generated content
- Rate limiting and cost management

### Acceptance Criteria:
- AI generates relevant, professional descriptions
- Generation considers role context (seniority, industry)
- Users can edit AI-generated content
- Proper error handling for API failures
- Cost-effective implementation
