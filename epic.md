# Epic 3.3: Talent Search
**Sprint Goal:** Allow HR to search and discover professionals

This epic focuses on enabling HR teams to efficiently search for and discover professionals. The goal is to develop a robust system that integrates a database and API functionality, ensuring seamless access to talent information. This feature will streamline the recruitment process and improve talent acquisition strategies.

Tags: database, API, development

## [P0] Build Search Page UI
### Description
- Create /dashboard/search page
- Build search bar with keyword input
- Build filter sidebar: 
  - Location (city/state)
  - Years of experience (range slider)
  - Industry dropdown
  - Skills multi-select
  - Salary range
  - Verification status
- Build results grid
- Add pagination

### Acceptance Criteria: 
- Search input functional
- All filters present
- Results display in grid
- Pagination works

## [P0] Create Professional Search API
### Description
- Create POST /api/professionals/search
- Implement filters: 
  - Full-text search on title, headline, summary
  - Location filters
  - Experience range
  - Industry match
  - Skills array contains
  - Salary range overlap
  - Verification status
- Only return professionals with openToOpportunities = true
- Implement pagination (20 per page)
- Order by relevance score

### Acceptance Criteria: 
- Search performs well (<2s)
- All filters work correctly
- Returns paginated results
- Only returns available professionals

## [P0] Build Professional Result Card
### Description
- Create result card component showing: 
  - Name initials (or photo if public)
  - Profile headline
  - Location, experience
  - Top 3 skills
  - Verification badge
  - Salary range
  - "View Profile" button
- Handle confidential profiles (limited info)

### Acceptance Criteria: 
- Card displays key info
- Verification badge shows
- Click opens profile
- Responsive design


## [P0] Connect Search to API
### Description
- Fetch search results on form submit
- Handle filter changes (debounced)
- Show loading skeleton
- Handle empty results
- Implement pagination controls

### Acceptance Criteria: 
- Search returns results
- Filters update results
- Loading states smooth
- Pagination works
- Empty state displays

## [P0] Build Professional Profile View (HR Side)
### Description
- Create /dashboard/professionals/:id page
- Display full professional profile: 
  - Header (name, title, location)
  - Verification badge
  - Profile summary
  - Work history
  - Education
  - Skills
  - Certifications
- Add "Request Introduction" button
- Add "Save for later" button

### Acceptance Criteria: 
- All profile sections visible
- CTA buttons prominent
- Responsive layout
- Professional's contact info hidden until intro accepted


## [P0] Create Professional Profile View API
### Description
- Check HR permissions (can they view this profile?)
- Log profile view in profile_views table
- Increment view counter

### Acceptance Criteria: 
- Returns complete profile
- View is logged
- Contact info only if intro accepted
- 403 if unauthorized

## [P0] Connect Search to API
### Description
- Fetch search results on form submit
- Handle filter changes (debounced)
- Show loading skeleton
- Handle empty results
- Implement pagination controls

### Acceptance Criteria: 
- Search returns results
- Filters update results
- Loading states smooth
- Pagination works
- Empty state displays


## [P1] Implement Saved Professionals Feature
### Description
- Create POST /api/professionals/:id/save
- Create DELETE /api/professionals/:id/unsave
- Create GET /api/professionals/saved
- Add "Saved" page in dashboard
- Add save/unsave button to profile view

### Acceptance Criteria: 
- Can save professionals
- Can view saved list
- Can remove from saved
- Saved count displays

## [P2] Add Search Filters Persistence
### Description
- Save active filters to URL query params
- Restore filters on page load
- Enable shareable search links

### Acceptance Criteria: 
- Filters in URL
- Filters restore on refresh
- Can share search links


# # Epic 3.2: Job Role Posting
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
