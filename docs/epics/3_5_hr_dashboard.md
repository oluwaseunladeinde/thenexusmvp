# Epic 3.5: HR Dashboard
**Sprint Goal:** Complete HR partner dashboard experience

This task involves the development of an HR Dashboard to streamline and centralize HR-related data and processes. The dashboard will provide key metrics, employee data, and tools to enhance HR operations and decision-making. The goal is to create an intuitive, user-friendly interface that improves efficiency and supports HR teams in managing tasks such as employee records, performance tracking, and reporting.

Tags: database, API, development

## [P0] Design HR Dashboard (Figma)
### Description
- Design dashboard layout
- Stats overview cards
- Recent activity feed
- Quick actions section
- Pipeline view (candidates by stage)

### Acceptance Criteria: 
- Dashboard layout complete
- All components designed
- Mobile responsive
- Matches brand aesthetic


## [P0] Build HR Dashboard Layout
### Description
- Create /dashboard page (HR version)
- Add sidebar navigation
- Implement route protection (requireHrPartner)
- Add header with company logo and user menu

### Acceptance Criteria: 
- Layout responsive
- Sidebar navigation works
- Only authenticated HR can access
- Company logo displays

## [P0] Build Dashboard Stats Overview
### Description
- Display: 
    - Active job roles
    - Introduction requests sent
    - Acceptance rate
    - Available credits
- Add loading states

### Acceptance Criteria: 
- All stats display
- Loading skeletons smooth
- Stats update on data change

## [P0] Build Dashboard Stats Overview
### Description
- Display: 
    - Active job roles
    - Introduction requests sent
    - Acceptance rate
    - Available credits
- Add loading states

### Acceptance Criteria: 
- All stats display
- Loading skeletons smooth
- Stats update on data change

## [P0] Build Dashboard Stats Overview
### Description
- Show recent activity:
    - Introduction requests sent
    - Requests accepted/declined
    - New saved professionals
    - Profile views
- Display timestamps
- Add "View all" link

### Acceptance Criteria: 
- Recent activity visible
- Timestamps human-readable
- Links to relevant pages

## [P1] Build Quick Actions Section
### Description
- Add quick action buttons: 
    - "Post new role"
    - "Search talent"
    - "View saved professionals"
    - "Buy credits" (if trial/low)
- Make buttons prominent and accessible

### Acceptance Criteria: 
- Buttons navigate correctly
- Styled consistently
- Responsive layout

## [P2] Add Pipeline View (Kanban)
### Description
- Create kanban board component
- Columns: Search → Contacted → Accepted → Interview → Offer
- Cards show candidate name and role
- Drag to move between stages

### Acceptance Criteria: 
- Kanban board displays
- Can drag cards between columns
- Updates backend on move
- Mobile responsive (horizontal scroll)