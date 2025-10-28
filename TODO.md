# TODO: Implement Comprehensive Profile Completeness Calculator

## Overview
Enhance the profile completeness calculation from basic field counting to a weighted, comprehensive system that considers verification, documents, and professional details. Build a full profile update page for users to manage their information.

## Tasks

### 1. Create Profile Completeness Calculator Utility
- [ ] Create `src/lib/services/profileCompletenessCalculator.ts`
- [ ] Implement weighted calculation with categories:
  - Basic Info (20%): firstName, lastName, profileHeadline, locationCity, locationState, currentIndustry
  - Professional Details (25%): currentTitle, currentCompany, yearsOfExperience, profileSummary
  - Verification (20%): verificationStatus (admin), phoneVerified (user)
  - Documents (15%): resumeUrl, profilePhotoUrl
  - Network & Skills (10%): linkedinUrl, skills (at least 3), workHistory (at least 1)
  - Additional (10%): portfolioUrl, education (at least 1), certifications (at least 1)
- [ ] Add detailed breakdown function for UI display
- [ ] Add unit tests for calculator

### 2. Update API Route (/api/v1/professionals/me)
- [ ] Import and use new calculator in PUT endpoint
- [ ] Update GET endpoint to return completeness breakdown
- [ ] Add profile completeness recalculation on profile updates
- [ ] Update Swagger documentation

### 3. Build Profile Update Page
- [ ] Create comprehensive form in `src/app/professional/profile/page.tsx`
- [ ] Add sections:
  - Personal Information (name, headline, location)
  - Professional Details (title, company, experience, summary)
  - Documents Upload (resume, profile picture)
  - Verification Status (phone verification, admin status)
  - Skills & Experience (skills, work history, education, certifications)
- [ ] Implement file upload for resume and profile picture
- [ ] Add form validation and error handling
- [ ] Connect to API for updates

### 4. Update CompletenessCard Component
- [ ] Modify `src/components/professional/dashboard/CompletenessCard.tsx`
- [ ] Show detailed breakdown of completeness categories
- [ ] Add progress indicators for each section
- [ ] Update link to point to new profile update page

### 5. Add File Upload API
- [ ] Create `/api/v1/professionals/upload` endpoint
- [ ] Support resume and profile picture uploads
- [ ] Integrate with cloud storage (AWS S3 or similar)
- [ ] Update file URLs in professional profile

### 6. Update Database Schema (if needed)
- [ ] Review if additional fields needed for completeness tracking
- [ ] Consider adding completeness breakdown JSON field
- [ ] Add migration if schema changes required

### 7. Testing & Validation
- [ ] Test calculator with various profile states
- [ ] Test profile update page functionality
- [ ] Test file uploads
- [ ] Validate API responses
- [ ] Update existing tests

### 8. Documentation
- [ ] Update API documentation
- [ ] Add comments to calculator logic
- [ ] Document profile update flow
