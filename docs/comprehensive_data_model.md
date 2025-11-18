# theNexus - Comprehensive Data Model

*Version 1.0 - October 2025*

---

## **Overview**

This document defines the complete data model for theNexus platform - Nigeria's premier network for senior professionals and companies. The model is designed to support:

- **Verified professional profiles** with privacy controls
- **Company/HR partner accounts** with role management
- **Introduction request workflow** (opt-in matching)
- **Confidential search** capabilities
- **Reference and verification** systems
- **Communication tracking** and analytics
- **Subscription and billing** management

---

## **Technology Stack Assumptions**

- **Database:** PostgreSQL (primary), Redis (caching/sessions)
- **ORM:** Prisma / Sequelize / TypeORM
- **Auth:** NextAuth.js / Supabase Auth / Clerk
- **Storage:** AWS S3 / Cloudflare R2 (for documents/images)
- **Search:** Algolia / Typesense / PostgreSQL Full-Text Search

---

## **Data Model Structure**

### **1. USER & AUTHENTICATION MODELS**

These models handle user accounts, authentication, and role-based access control.

---

#### **1.1 Users**

Core user account table - shared by both Professionals and HR Partners.

```typescript
Table: users
Purpose: Base user account for authentication and authorization
```

| Field              | Type         | Constraints                    | Description                                |
|--------------------|--------------|--------------------------------|--------------------------------------------|
| id                 | UUID         | PRIMARY KEY                    | Unique user identifier                     |
| email              | VARCHAR(255) | UNIQUE, NOT NULL               | User email (login credential)              |
| phone              | VARCHAR(20)  | UNIQUE, NULLABLE               | Nigerian phone (+234...)                   |
| password_hash      | VARCHAR(255) | NOT NULL                       | Bcrypt hashed password                     |
| user_type          | ENUM         | NOT NULL                       | 'professional', 'hr_partner', 'admin'      |
| status             | ENUM         | NOT NULL, DEFAULT 'pending'    | 'pending', 'active', 'suspended', 'deleted'|
| email_verified     | BOOLEAN      | DEFAULT FALSE                  | Email verification status                  |
| phone_verified     | BOOLEAN      | DEFAULT FALSE                  | Phone/WhatsApp verification status         |
| last_login_at      | TIMESTAMP    | NULLABLE                       | Last successful login                      |
| created_at         | TIMESTAMP    | DEFAULT NOW()                  | Account creation timestamp                 |
| updated_at         | TIMESTAMP    | DEFAULT NOW()                  | Last update timestamp                      |
| deleted_at         | TIMESTAMP    | NULLABLE                       | Soft delete timestamp                      |

**Indexes:**
- `idx_users_email` (email)
- `idx_users_phone` (phone)
- `idx_users_user_type` (user_type)
- `idx_users_status` (status)

**Relationships:**
- `one-to-one` with `professionals` (if user_type = 'professional')
- `one-to-one` with `hr_partners` (if user_type = 'hr_partner')
- `one-to-many` with `user_sessions`

---

#### **1.2 User Sessions**

Tracks active login sessions for security and analytics.

```typescript
Table: user_sessions
Purpose: Track active login sessions, support multi-device access
```

| Field              | Type         | Constraints              | Description                           |
|--------------------|--------------|--------------------------|---------------------------------------|
| id                 | UUID         | PRIMARY KEY              | Session identifier                    |
| user_id            | UUID         | FK → users.id, NOT NULL  | User owning this session              |
| session_token      | VARCHAR(500) | UNIQUE, NOT NULL         | JWT or session token                  |
| device_info        | JSONB        | NULLABLE                 | Device type, browser, OS              |
| ip_address         | VARCHAR(45)  | NULLABLE                 | IP address of session                 |
| user_agent         | TEXT         | NULLABLE                 | Browser user agent string             |
| expires_at         | TIMESTAMP    | NOT NULL                 | Session expiration time               |
| created_at         | TIMESTAMP    | DEFAULT NOW()            | Session creation time                 |

**Indexes:**
- `idx_sessions_user_id` (user_id)
- `idx_sessions_token` (session_token)
- `idx_sessions_expires_at` (expires_at)

---

#### **1.3 Password Resets**

Temporary tokens for password reset flow.

```typescript
Table: password_resets
Purpose: Manage password reset requests securely
```

| Field              | Type         | Constraints              | Description                           |
|--------------------|--------------|--------------------------|---------------------------------------|
| id                 | UUID         | PRIMARY KEY              | Reset request identifier              |
| user_id            | UUID         | FK → users.id, NOT NULL  | User requesting reset                 |
| token              | VARCHAR(255) | UNIQUE, NOT NULL         | Secure reset token                    |
| expires_at         | TIMESTAMP    | NOT NULL                 | Token expiration (15 mins typical)    |
| used_at            | TIMESTAMP    | NULLABLE                 | When token was used (prevents reuse)  |
| created_at         | TIMESTAMP    | DEFAULT NOW()            | Request creation time                 |

**Indexes:**
- `idx_password_resets_token` (token)
- `idx_password_resets_user_id` (user_id)

---

### **2. PROFESSIONAL MODELS**

These models represent senior professionals seeking opportunities.

---

#### **2.1 Professionals**

Extended profile for professional users.

```typescript
Table: professionals
Purpose: Senior professional profiles (Directors, VPs, C-suite)
```

| Field                  | Type          | Constraints                    | Description                                    |
|------------------------|---------------|--------------------------------|------------------------------------------------|
| id                     | UUID          | PRIMARY KEY                    | Professional identifier                        |
| user_id                | UUID          | FK → users.id, UNIQUE, NOT NULL| Link to base user account                      |
| first_name             | VARCHAR(100)  | NOT NULL                       | Legal first name                               |
| last_name              | VARCHAR(100)  | NOT NULL                       | Legal last name                                |
| preferred_name         | VARCHAR(100)  | NULLABLE                       | How they want to be addressed                  |
| profile_headline       | VARCHAR(200)  | NULLABLE                       | One-line professional summary                  |
| profile_summary        | TEXT          | NULLABLE                       | Detailed career summary (500-1000 words)       |
| profile_photo_url      | VARCHAR(500)  | NULLABLE                       | S3 URL to profile photo                        |
| years_of_experience    | INTEGER       | CHECK (>= 5)                   | Total years of professional experience         |
| current_title          | VARCHAR(150)  | NULLABLE                       | Current job title                              |
| current_company        | VARCHAR(150)  | NULLABLE                       | Current employer name                          |
| current_industry       | VARCHAR(100)  | NULLABLE                       | Current industry/sector                        |
| location_city          | VARCHAR(100)  | NOT NULL                       | City (Lagos, Abuja, Port Harcourt, etc.)       |
| location_state         | VARCHAR(100)  | NOT NULL                       | Nigerian state                                 |
| willing_to_relocate    | BOOLEAN       | DEFAULT FALSE                  | Open to relocation                             |
| salary_expectation_min | INTEGER       | NULLABLE                       | Minimum expected salary (Naira, annual)        |
| salary_expectation_max | INTEGER       | NULLABLE                       | Maximum expected salary (Naira, annual)        |
| notice_period_days     | INTEGER       | DEFAULT 30                     | Notice period in current role                  |
| open_to_opportunities  | BOOLEAN       | DEFAULT TRUE                   | Currently open to new roles                    |
| confidential_search    | BOOLEAN       | DEFAULT TRUE                   | Hide from current employer                     |
| profile_visibility     | ENUM          | DEFAULT 'private'              | 'private', 'network', 'public'                 |
| verification_status    | ENUM          | DEFAULT 'unverified'           | 'unverified', 'basic', 'full', 'premium'       |
| verification_date      | TIMESTAMP     | NULLABLE                       | When verification completed                    |
| linkedin_url           | VARCHAR(255)  | NULLABLE                       | LinkedIn profile URL                           |
| portfolio_url          | VARCHAR(255)  | NULLABLE                       | Personal website/portfolio                     |
| resume_url             | VARCHAR(500)  | NULLABLE                       | S3 URL to CV/resume document                   |
| onboarding_completed   | BOOLEAN       | DEFAULT FALSE                  | Has completed profile setup                    |
| profile_completeness   | INTEGER       | CHECK (0-100), DEFAULT 0       | Calculated profile completion percentage       |
| created_at             | TIMESTAMP     | DEFAULT NOW()                  | Profile creation date                          |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                  | Last profile update                            |
| last_active_at         | TIMESTAMP     | DEFAULT NOW()                  | Last platform activity                         |

**Indexes:**
- `idx_professionals_user_id` (user_id)
- `idx_professionals_location` (location_city, location_state)
- `idx_professionals_verification` (verification_status)
- `idx_professionals_visibility` (profile_visibility)
- `idx_professionals_search` (GIN index on first_name, last_name, current_title)

**Relationships:**
- `one-to-one` with `users`
- `one-to-many` with `professional_work_history`
- `one-to-many` with `professional_education`
- `one-to-many` with `professional_skills`
- `one-to-many` with `professional_certifications`
- `one-to-many` with `professional_references`
- `one-to-many` with `introduction_requests` (as recipient)

---

#### **2.2 Professional Work History**

Employment history for professionals.

```typescript
Table: professional_work_history
Purpose: Track career progression and experience
```

| Field              | Type          | Constraints                        | Description                           |
|--------------------|---------------|------------------------------------|---------------------------------------|
| id                 | UUID          | PRIMARY KEY                        | Work history entry identifier         |
| professional_id    | UUID          | FK → professionals.id, NOT NULL    | Professional this belongs to          |
| company_name       | VARCHAR(150)  | NOT NULL                           | Employer name                         |
| job_title          | VARCHAR(150)  | NOT NULL                           | Role/position title                   |
| industry           | VARCHAR(100)  | NULLABLE                           | Industry/sector                       |
| location           | VARCHAR(100)  | NULLABLE                           | Job location                          |
| employment_type    | ENUM          | NOT NULL                           | 'full_time', 'contract', 'consulting' |
| start_date         | DATE          | NOT NULL                           | Employment start date                 |
| end_date           | DATE          | NULLABLE                           | Employment end (NULL = current)       |
| is_current         | BOOLEAN       | DEFAULT FALSE                      | Currently employed here               |
| description        | TEXT          | NULLABLE                           | Responsibilities and achievements     |
| achievements       | JSONB         | NULLABLE                           | Array of key achievements             |
| team_size          | INTEGER       | NULLABLE                           | Size of team managed (if applicable)  |
| sort_order         | INTEGER       | DEFAULT 0                          | Display order (0 = most recent)       |
| created_at         | TIMESTAMP     | DEFAULT NOW()                      | Entry creation date                   |
| updated_at         | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_work_history_professional_id` (professional_id)
- `idx_work_history_current` (is_current)

---

#### **2.3 Professional Education**

Educational background and qualifications.

```typescript
Table: professional_education
Purpose: Academic qualifications and degrees
```

| Field              | Type          | Constraints                        | Description                           |
|--------------------|---------------|------------------------------------|---------------------------------------|
| id                 | UUID          | PRIMARY KEY                        | Education entry identifier            |
| professional_id    | UUID          | FK → professionals.id, NOT NULL    | Professional this belongs to          |
| institution_name   | VARCHAR(200)  | NOT NULL                           | University/school name                |
| degree_type        | ENUM          | NOT NULL                           | 'bachelor', 'master', 'phd', 'other'  |
| field_of_study     | VARCHAR(150)  | NOT NULL                           | Major/specialization                  |
| start_year         | INTEGER       | NOT NULL                           | Start year                            |
| end_year           | INTEGER       | NULLABLE                           | Graduation year (NULL = ongoing)      |
| grade              | VARCHAR(50)   | NULLABLE                           | GPA, classification, honors           |
| is_verified        | BOOLEAN       | DEFAULT FALSE                      | Verified by theNexus team             |
| sort_order         | INTEGER       | DEFAULT 0                          | Display order (0 = most recent)       |
| created_at         | TIMESTAMP     | DEFAULT NOW()                      | Entry creation date                   |
| updated_at         | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_education_professional_id` (professional_id)

---

#### **2.4 Professional Skills**

Skills and competencies with endorsements.

```typescript
Table: professional_skills
Purpose: Tag skills for matching and search
```

| Field              | Type          | Constraints                        | Description                           |
|--------------------|---------------|------------------------------------|---------------------------------------|
| id                 | UUID          | PRIMARY KEY                        | Skill entry identifier                |
| professional_id    | UUID          | FK → professionals.id, NOT NULL    | Professional this belongs to          |
| skill_name         | VARCHAR(100)  | NOT NULL                           | Skill name (normalized lowercase)     |
| proficiency_level  | ENUM          | DEFAULT 'intermediate'             | 'beginner', 'intermediate', 'expert'  |
| years_of_experience| INTEGER       | NULLABLE                           | Years using this skill                |
| endorsement_count  | INTEGER       | DEFAULT 0                          | Number of endorsements (future)       |
| is_primary_skill   | BOOLEAN       | DEFAULT FALSE                      | Core/primary skill for professional   |
| created_at         | TIMESTAMP     | DEFAULT NOW()                      | Skill addition date                   |

**Indexes:**
- `idx_skills_professional_id` (professional_id)
- `idx_skills_name` (skill_name)
- `idx_skills_primary` (is_primary_skill)

---

#### **2.5 Professional Certifications**

Professional certifications and licenses.

```typescript
Table: professional_certifications
Purpose: Track professional credentials and certifications
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Certification identifier              |
| professional_id        | UUID          | FK → professionals.id, NOT NULL    | Professional this belongs to          |
| certification_name     | VARCHAR(200)  | NOT NULL                           | Name of certification                 |
| issuing_organization   | VARCHAR(200)  | NOT NULL                           | Certifying body                       |
| issue_date             | DATE          | NOT NULL                           | Date obtained                         |
| expiry_date            | DATE          | NULLABLE                           | Expiration date (if applicable)       |
| credential_id          | VARCHAR(100)  | NULLABLE                           | Credential/license number             |
| credential_url         | VARCHAR(500)  | NULLABLE                           | Verification URL                      |
| is_verified            | BOOLEAN       | DEFAULT FALSE                      | Verified by theNexus                  |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Entry creation date                   |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_certifications_professional_id` (professional_id)

---

#### **2.6 Professional References**

Reference contacts for verification.

```typescript
Table: professional_references
Purpose: Store reference information for verification
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Reference identifier                  |
| professional_id        | UUID          | FK → professionals.id, NOT NULL    | Professional this belongs to          |
| reference_name         | VARCHAR(150)  | NOT NULL                           | Full name of reference                |
| reference_email        | VARCHAR(255)  | NOT NULL                           | Contact email                         |
| reference_phone        | VARCHAR(20)   | NULLABLE                           | Contact phone                         |
| reference_company      | VARCHAR(150)  | NULLABLE                           | Reference's company                   |
| reference_title        | VARCHAR(150)  | NULLABLE                           | Reference's job title                 |
| relationship           | VARCHAR(100)  | NOT NULL                           | 'manager', 'colleague', 'client', etc |
| verification_status    | ENUM          | DEFAULT 'pending'                  | 'pending', 'contacted', 'verified'    |
| verification_date      | TIMESTAMP     | NULLABLE                           | When reference was verified           |
| verification_notes     | TEXT          | NULLABLE                           | Internal notes (not visible to user)  |
| permission_granted     | BOOLEAN       | DEFAULT FALSE                      | Professional gave permission to contact |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Reference added date                  |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_references_professional_id` (professional_id)
- `idx_references_verification_status` (verification_status)

---

### **3. COMPANY & HR PARTNER MODELS**

These models represent companies and their HR team members.

---

#### **3.1 Companies**

Organization profiles for companies hiring through theNexus.

```typescript
Table: companies
Purpose: Company/organization accounts
```

| Field                  | Type          | Constraints                    | Description                                |
|------------------------|---------------|--------------------------------|--------------------------------------------|
| id                     | UUID          | PRIMARY KEY                    | Company identifier                         |
| company_name           | VARCHAR(200)  | UNIQUE, NOT NULL               | Legal company name                         |
| company_logo_url       | VARCHAR(500)  | NULLABLE                       | S3 URL to company logo                     |
| industry               | VARCHAR(100)  | NOT NULL                       | Primary industry/sector                    |
| company_size           | ENUM          | NOT NULL                       | '1-10', '11-50', '51-200', '201-500', '500+'|
| headquarters_location  | VARCHAR(100)  | NOT NULL                       | HQ city                                    |
| company_website        | VARCHAR(255)  | NULLABLE                       | Corporate website                          |
| company_description    | TEXT          | NULLABLE                       | About the company                          |
| linkedin_url           | VARCHAR(255)  | NULLABLE                       | Company LinkedIn page                      |
| verification_status    | ENUM          | DEFAULT 'pending'              | 'pending', 'verified', 'premium'           |
| verification_date      | TIMESTAMP     | NULLABLE                       | When company was verified                  |
| status                 | ENUM          | DEFAULT 'active'               | 'active', 'suspended', 'inactive'          |
| subscription_tier      | ENUM          | DEFAULT 'trial'                | 'trial', 'basic', 'professional', 'enterprise'|
| subscription_expires_at| TIMESTAMP     | NULLABLE                       | Subscription expiration date               |
| introduction_credits   | INTEGER       | DEFAULT 0                      | Available introduction request credits     |
| created_at             | TIMESTAMP     | DEFAULT NOW()                  | Company account creation                   |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                  | Last update                                |

**Indexes:**
- `idx_companies_name` (company_name)
- `idx_companies_industry` (industry)
- `idx_companies_verification` (verification_status)
- `idx_companies_subscription` (subscription_tier)

**Relationships:**
- `one-to-many` with `hr_partners`
- `one-to-many` with `job_roles`
- `one-to-many` with `introduction_requests`

---

#### **3.2 HR Partners**

HR professionals/hiring managers who use the platform.

```typescript
Table: hr_partners
Purpose: HR users who send introduction requests
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | HR partner identifier                 |
| user_id                | UUID          | FK → users.id, UNIQUE, NOT NULL    | Link to base user account             |
| company_id             | UUID          | FK → companies.id, NOT NULL        | Company they work for                 |
| first_name             | VARCHAR(100)  | NOT NULL                           | HR person's first name                |
| last_name              | VARCHAR(100)  | NOT NULL                           | HR person's last name                 |
| job_title              | VARCHAR(150)  | NOT NULL                           | Role at company                       |
| department             | VARCHAR(100)  | NULLABLE                           | Department (HR, Talent, etc.)         |
| profile_photo_url      | VARCHAR(500)  | NULLABLE                           | S3 URL to profile photo               |
| linkedin_url           | VARCHAR(255)  | NULLABLE                           | Personal LinkedIn                     |
| role_in_platform       | ENUM          | DEFAULT 'member'                   | 'owner', 'admin', 'member'            |
| can_create_roles       | BOOLEAN       | DEFAULT TRUE                       | Permission to post roles              |
| can_send_introductions | BOOLEAN       | DEFAULT TRUE                       | Permission to send intro requests     |
| can_manage_billing     | BOOLEAN       | DEFAULT FALSE                      | Access to billing/subscription        |
| status                 | ENUM          | DEFAULT 'active'                   | 'active', 'inactive'                  |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Account creation                      |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |
| last_active_at         | TIMESTAMP     | DEFAULT NOW()                      | Last platform activity                |

**Indexes:**
- `idx_hr_partners_user_id` (user_id)
- `idx_hr_partners_company_id` (company_id)
- `idx_hr_partners_role` (role_in_platform)

**Relationships:**
- `one-to-one` with `users`
- `many-to-one` with `companies`
- `one-to-many` with `introduction_requests` (as sender)

---

### **4. JOB ROLE MODELS**

Models for job opportunities posted by companies.

---

#### **4.1 Job Roles**

Open positions that companies are hiring for.

```typescript
Table: job_roles
Purpose: Job opportunities posted by companies
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Role identifier                       |
| company_id             | UUID          | FK → companies.id, NOT NULL        | Hiring company                        |
| created_by_hr_id       | UUID          | FK → hr_partners.id, NOT NULL      | HR person who created role            |
| role_title             | VARCHAR(200)  | NOT NULL                           | Job title                             |
| role_description       | TEXT          | NOT NULL                           | Detailed job description              |
| responsibilities       | TEXT          | NULLABLE                           | Key responsibilities                  |
| requirements           | TEXT          | NOT NULL                           | Required qualifications               |
| preferred_qualifications| TEXT         | NULLABLE                           | Nice-to-have qualifications           |
| seniority_level        | ENUM          | NOT NULL                           | 'director', 'vp', 'c_suite', 'executive'|
| industry               | VARCHAR(100)  | NOT NULL                           | Industry/sector                       |
| department             | VARCHAR(100)  | NULLABLE                           | Department/function                   |
| location_city          | VARCHAR(100)  | NOT NULL                           | Job location city                     |
| location_state         | VARCHAR(100)  | NOT NULL                           | Job location state                    |
| remote_option          | ENUM          | DEFAULT 'on_site'                  | 'on_site', 'hybrid', 'remote'         |
| employment_type        | ENUM          | DEFAULT 'full_time'                | 'full_time', 'contract', 'consulting' |
| salary_range_min       | INTEGER       | NOT NULL                           | Minimum salary (Naira, annual)        |
| salary_range_max       | INTEGER       | NOT NULL                           | Maximum salary (Naira, annual)        |
| benefits               | TEXT          | NULLABLE                           | Benefits and perks description        |
| years_experience_min   | INTEGER       | DEFAULT 5                          | Minimum years of experience           |
| years_experience_max   | INTEGER       | NULLABLE                           | Maximum years of experience           |
| required_skills        | JSONB         | NULLABLE                           | Array of required skill names         |
| preferred_skills       | JSONB         | NULLABLE                           | Array of preferred skill names        |
| is_confidential        | BOOLEAN       | DEFAULT FALSE                      | Hide company name in initial outreach |
| confidential_reason    | TEXT          | NULLABLE                           | Why confidential (internal notes)     |
| status                 | ENUM          | DEFAULT 'draft'                    | 'draft', 'active', 'paused', 'filled', 'closed'|
| application_deadline   | DATE          | NULLABLE                           | Deadline for introductions            |
| expected_start_date    | DATE          | NULLABLE                           | When hire should start                |
| introduction_count     | INTEGER       | DEFAULT 0                          | Number of intros sent for this role   |
| view_count             | INTEGER       | DEFAULT 0                          | Views by HR (analytics)               |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Role creation date                    |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |
| published_at           | TIMESTAMP     | NULLABLE                           | When role went active                 |
| closed_at              | TIMESTAMP     | NULLABLE                           | When role was closed/filled           |

**Indexes:**
- `idx_job_roles_company_id` (company_id)
- `idx_job_roles_status` (status)
- `idx_job_roles_seniority` (seniority_level)
- `idx_job_roles_location` (location_city, location_state)
- `idx_job_roles_created_by` (created_by_hr_id)
- `idx_job_roles_search` (GIN index on role_title, role_description)

**Relationships:**
- `many-to-one` with `companies`
- `many-to-one` with `hr_partners` (creator)
- `one-to-many` with `introduction_requests`

---

### **5. INTRODUCTION & MATCHING MODELS**

Core workflow: HR sends introduction requests to professionals.

---

#### **5.1 Introduction Requests**

The core matching/introduction mechanism.

```typescript
Table: introduction_requests
Purpose: Track introduction requests from HR to professionals
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Introduction request identifier       |
| job_role_id            | UUID          | FK → job_roles.id, NOT NULL        | Role being filled                     |
| company_id             | UUID          | FK → companies.id, NOT NULL        | Company making request                |
| sent_by_hr_id          | UUID          | FK → hr_partners.id, NOT NULL      | HR person sending request             |
| sent_to_professional_id| UUID          | FK → professionals.id, NOT NULL    | Professional receiving request        |
| personalized_message   | TEXT          | NULLABLE                           | Custom message from HR                |
| status                 | ENUM          | DEFAULT 'pending'                  | 'pending', 'accepted', 'declined', 'expired', 'withdrawn'|
| professional_response  | TEXT          | NULLABLE                           | Professional's response message       |
| response_date          | TIMESTAMP     | NULLABLE                           | When professional responded           |
| expires_at             | TIMESTAMP     | NOT NULL                           | Request expiration (7 days typical)   |
| viewed_by_professional | BOOLEAN       | DEFAULT FALSE                      | Has professional viewed request       |
| viewed_at              | TIMESTAMP     | NULLABLE                           | When professional first viewed        |
| conversation_started   | BOOLEAN       | DEFAULT FALSE                      | Did they start messaging              |
| interview_scheduled    | BOOLEAN       | DEFAULT FALSE                      | Interview scheduled (tracked)         |
| outcome                | ENUM          | NULLABLE                           | 'hired', 'rejected', 'withdrew', 'no_response'|
| outcome_date           | TIMESTAMP     | NULLABLE                           | Final outcome date                    |
| outcome_notes          | TEXT          | NULLABLE                           | Internal notes on outcome             |
| sent_at                | TIMESTAMP     | DEFAULT NOW()                      | When request was sent                 |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Record creation                       |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_intro_job_role_id` (job_role_id)
- `idx_intro_company_id` (company_id)
- `idx_intro_hr_id` (sent_by_hr_id)
- `idx_intro_professional_id` (sent_to_professional_id)
- `idx_intro_status` (status)
- `idx_intro_outcome` (outcome)
- `idx_intro_sent_at` (sent_at)

**Relationships:**
- `many-to-one` with `job_roles`
- `many-to-one` with `companies`
- `many-to-one` with `hr_partners`
- `many-to-one` with `professionals`
- `one-to-many` with `messages`

**Business Logic:**
- Only 1 introduction request per (job_role_id + professional_id) combination
- Expires after 7 days if not responded to
- Status transitions: pending → accepted/declined/expired
- On acceptance, both parties get contact details via email/WhatsApp

---

#### **5.2 Saved Professionals**

HR partners can save/bookmark professionals for later.

```typescript
Table: saved_professionals
Purpose: Allow HR to bookmark professionals
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Saved entry identifier                |
| hr_partner_id          | UUID          | FK → hr_partners.id, NOT NULL      | HR person saving                      |
| professional_id        | UUID          | FK → professionals.id, NOT NULL    | Professional being saved              |
| notes                  | TEXT          | NULLABLE                           | Private notes about professional      |
| tags                   | JSONB         | NULLABLE                           | Custom tags (array of strings)        |
| saved_at               | TIMESTAMP     | DEFAULT NOW()                      | When saved                            |

**Indexes:**
- `idx_saved_hr_id` (hr_partner_id)
- `idx_saved_professional_id` (professional_id)
- Unique constraint on (hr_partner_id, professional_id)

---

### **6. MESSAGING & COMMUNICATION MODELS**

Post-acceptance communication tracking.

---

#### **6.1 Messages**

Messages exchanged after introduction acceptance.

```typescript
Table: messages
Purpose: Track messages between HR and professionals
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Message identifier                    |
| introduction_request_id| UUID          | FK → introduction_requests.id      | Related introduction                  |
| sender_user_id         | UUID          | FK → users.id, NOT NULL            | User who sent message                 |
| recipient_user_id      | UUID          | FK → users.id, NOT NULL            | User receiving message                |
| message_body           | TEXT          | NOT NULL                           | Message content                       |
| is_read                | BOOLEAN       | DEFAULT FALSE                      | Has recipient read message            |
| read_at                | TIMESTAMP     | NULLABLE                           | When message was read                 |
| sent_at                | TIMESTAMP     | DEFAULT NOW()                      | Message send time                     |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Record creation                       |

**Indexes:**
- `idx_messages_intro_id` (introduction_request_id)
- `idx_messages_sender_id` (sender_user_id)
- `idx_messages_recipient_id` (recipient_user_id)
- `idx_messages_sent_at` (sent_at)

**Relationships:**
- `many-to-one` with `introduction_requests`
- `many-to-one` with `users` (sender)
- `many-to-one` with `users` (recipient)

---

#### **6.2 Notifications**

Platform notifications (email, WhatsApp, in-app).

```typescript
Table: notifications
Purpose: Track all platform notifications sent to users
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Notification identifier               |
| user_id                | UUID          | FK → users.id, NOT NULL            | User receiving notification           |
| notification_type      | ENUM          | NOT NULL                           | 'intro_request', 'intro_accepted', 'message', 'profile_viewed', etc.|
| title                  | VARCHAR(200)  | NOT NULL                           | Notification title                    |
| message                | TEXT          | NOT NULL                           | Notification body                     |
| related_entity_type    | VARCHAR(50)   | NULLABLE                           | 'introduction_request', 'job_role', etc.|
| related_entity_id      | UUID          | NULLABLE                           | ID of related entity                  |
| action_url             | VARCHAR(500)  | NULLABLE                           | Deep link to related item             |
| channel                | ENUM          | NOT NULL                           | 'in_app', 'email', 'whatsapp', 'sms'  |
| status                 | ENUM          | DEFAULT 'pending'                  | 'pending', 'sent', 'delivered', 'failed'|
| is_read                | BOOLEAN       | DEFAULT FALSE                      | Has user read notification            |
| read_at                | TIMESTAMP     | NULLABLE                           | When notification was read            |
| sent_at                | TIMESTAMP     | NULLABLE                           | When notification was sent            |
| delivered_at           | TIMESTAMP     | NULLABLE                           | When delivered (if trackable)         |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Notification creation                 |

**Indexes:**
- `idx_notifications_user_id` (user_id)
- `idx_notifications_type` (notification_type)
- `idx_notifications_status` (status)
- `idx_notifications_is_read` (is_read)
- `idx_notifications_created_at` (created_at)

---

### **7. SEARCH & MATCHING MODELS**

Support intelligent matching and search functionality.

---

#### **7.1 Search Queries**

Track HR partner searches for analytics and improvement.

```typescript
Table: search_queries
Purpose: Log search queries for analytics and matching algorithm improvement
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Search query identifier               |
| hr_partner_id          | UUID          | FK → hr_partners.id, NOT NULL      | HR person searching                   |
| job_role_id            | UUID          | FK → job_roles.id, NULLABLE        | Related job role (if applicable)      |
| search_text            | TEXT          | NULLABLE                           | Free-text search query                |
| filters                | JSONB         | NULLABLE                           | Applied filters (JSON object)         |
| results_count          | INTEGER       | DEFAULT 0                          | Number of results returned            |
| clicked_profile_ids    | JSONB         | NULLABLE                           | Array of professional IDs clicked     |
| search_duration_ms     | INTEGER       | NULLABLE                           | Search execution time                 |
| searched_at            | TIMESTAMP     | DEFAULT NOW()                      | When search was performed             |

**Indexes:**
- `idx_search_hr_id` (hr_partner_id)
- `idx_search_job_role_id` (job_role_id)
- `idx_search_searched_at` (searched_at)

---

#### **7.2 Profile Views**

Track when HR views professional profiles (analytics).

```typescript
Table: profile_views
Purpose: Track profile views for analytics and "who viewed your profile" feature
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Profile view identifier               |
| viewer_hr_id           | UUID          | FK → hr_partners.id, NOT NULL      | HR person viewing                     |
| viewed_professional_id | UUID          | FK → professionals.id, NOT NULL    | Professional being viewed             |
| view_source            | ENUM          | NOT NULL                           | 'search', 'saved', 'recommendation'   |
| job_role_id            | UUID          | FK → job_roles.id, NULLABLE        | Related job (if viewing for a role)   |
| view_duration_seconds  | INTEGER       | NULLABLE                           | How long they viewed profile          |
| viewed_at              | TIMESTAMP     | DEFAULT NOW()                      | View timestamp                        |

**Indexes:**
- `idx_profile_views_viewer_id` (viewer_hr_id)
- `idx_profile_views_professional_id` (viewed_professional_id)
- `idx_profile_views_viewed_at` (viewed_at)

---

### **8. SUBSCRIPTION & BILLING MODELS**

Handle company subscriptions and payments.

---

#### **8.1 Subscription Plans**

Available subscription tiers.

```typescript
Table: subscription_plans
Purpose: Define available subscription tiers for companies
```

| Field                      | Type          | Constraints                    | Description                           |
|----------------------------|---------------|--------------------------------|---------------------------------------|
| id                         | UUID          | PRIMARY KEY                    | Plan identifier                       |
| plan_name                  | VARCHAR(100)  | UNIQUE, NOT NULL               | Plan name (Trial, Basic, Professional, Enterprise)|
| plan_description           | TEXT          | NULLABLE                       | Plan description                      |
| price_monthly_ngn          | INTEGER       | NOT NULL                       | Monthly price (Naira)                 |
| price_annual_ngn           | INTEGER       | NULLABLE                       | Annual price (Naira, discounted)      |
| introduction_credits_monthly| INTEGER      | NOT NULL                       | Monthly intro request credits         |
| max_hr_users               | INTEGER       | NULLABLE                       | Max HR team members (NULL = unlimited)|
| max_active_roles           | INTEGER       | NULLABLE                       | Max active job postings               |
| support_level              | ENUM          | DEFAULT 'standard'             | 'basic', 'standard', 'priority'       |
| features                   | JSONB         | NOT NULL                       | Array of feature flags                |
| is_active                  | BOOLEAN       | DEFAULT TRUE                   | Plan currently offered                |
| sort_order                 | INTEGER       | DEFAULT 0                      | Display order on pricing page         |
| created_at                 | TIMESTAMP     | DEFAULT NOW()                  | Plan creation date                    |
| updated_at                 | TIMESTAMP     | DEFAULT NOW()                  | Last update                           |

**Indexes:**
- `idx_subscription_plans_active` (is_active)

---

#### **8.2 Company Subscriptions**

Track company subscription history.

```typescript
Table: company_subscriptions
Purpose: Track subscription history and current status for companies
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Subscription record identifier        |
| company_id             | UUID          | FK → companies.id, NOT NULL        | Company with subscription             |
| plan_id                | UUID          | FK → subscription_plans.id         | Subscription plan                     |
| status                 | ENUM          | DEFAULT 'active'                   | 'trial', 'active', 'past_due', 'cancelled', 'expired'|
| billing_cycle          | ENUM          | NOT NULL                           | 'monthly', 'annual'                   |
| start_date             | DATE          | NOT NULL                           | Subscription start date               |
| end_date               | DATE          | NULLABLE                           | Subscription end date                 |
| trial_ends_at          | TIMESTAMP     | NULLABLE                           | Trial expiration                      |
| next_billing_date      | DATE          | NULLABLE                           | Next billing date                     |
| auto_renew             | BOOLEAN       | DEFAULT TRUE                       | Auto-renewal enabled                  |
| cancelled_at           | TIMESTAMP     | NULLABLE                           | Cancellation date                     |
| cancellation_reason    | TEXT          | NULLABLE                           | Why subscription was cancelled        |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Record creation                       |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_company_subscriptions_company_id` (company_id)
- `idx_company_subscriptions_status` (status)
- `idx_company_subscriptions_next_billing` (next_billing_date)

---

#### **8.3 Invoices**

Track billing invoices.

```typescript
Table: invoices
Purpose: Store invoice records for billing
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Invoice identifier                    |
| invoice_number         | VARCHAR(50)   | UNIQUE, NOT NULL                   | Human-readable invoice number         |
| company_id             | UUID          | FK → companies.id, NOT NULL        | Company being billed                  |
| subscription_id        | UUID          | FK → company_subscriptions.id      | Related subscription                  |
| invoice_date           | DATE          | NOT NULL                           | Invoice issue date                    |
| due_date               | DATE          | NOT NULL                           | Payment due date                      |
| subtotal_ngn           | INTEGER       | NOT NULL                           | Subtotal amount (Naira)               |
| tax_percentage         | DECIMAL(5,2)  | DEFAULT 0.00                       | VAT percentage (7.5% in Nigeria)      |
| tax_amount_ngn         | INTEGER       | DEFAULT 0                          | Tax amount (Naira)                    |
| total_amount_ngn       | INTEGER       | NOT NULL                           | Total invoice amount (Naira)          |
| status                 | ENUM          | DEFAULT 'pending'                  | 'pending', 'paid', 'overdue', 'cancelled'|
| paid_at                | TIMESTAMP     | NULLABLE                           | Payment date                          |
| payment_method         | VARCHAR(50)   | NULLABLE                           | How payment was made                  |
| payment_reference      | VARCHAR(255)  | NULLABLE                           | Payment gateway reference             |
| invoice_pdf_url        | VARCHAR(500)  | NULLABLE                           | S3 URL to PDF invoice                 |
| notes                  | TEXT          | NULLABLE                           | Invoice notes                         |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Invoice creation                      |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_invoices_company_id` (company_id)
- `idx_invoices_subscription_id` (subscription_id)
- `idx_invoices_status` (status)
- `idx_invoices_due_date` (due_date)
- `idx_invoices_invoice_number` (invoice_number)

---

#### **8.4 Payments**

Track payment transactions.

```typescript
Table: payments
Purpose: Record payment transactions
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Payment identifier                    |
| invoice_id             | UUID          | FK → invoices.id, NOT NULL         | Related invoice                       |
| company_id             | UUID          | FK → companies.id, NOT NULL        | Company making payment                |
| amount_ngn             | INTEGER       | NOT NULL                           | Payment amount (Naira)                |
| payment_method         | ENUM          | NOT NULL                           | 'bank_transfer', 'card', 'paystack', 'flutterwave'|
| payment_gateway        | VARCHAR(50)   | NULLABLE                           | Payment processor used                |
| transaction_reference  | VARCHAR(255)  | UNIQUE, NOT NULL                   | Gateway transaction ID                |
| status                 | ENUM          | DEFAULT 'pending'                  | 'pending', 'successful', 'failed', 'refunded'|
| failure_reason         | TEXT          | NULLABLE                           | Why payment failed                    |
| paid_at                | TIMESTAMP     | NULLABLE                           | Successful payment timestamp          |
| refunded_at            | TIMESTAMP     | NULLABLE                           | Refund timestamp                      |
| refund_reason          | TEXT          | NULLABLE                           | Why payment was refunded              |
| metadata               | JSONB         | NULLABLE                           | Additional payment gateway data       |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Payment attempt creation              |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_payments_invoice_id` (invoice_id)
- `idx_payments_company_id` (company_id)
- `idx_payments_status` (status)
- `idx_payments_transaction_ref` (transaction_reference)

---

### **9. ANALYTICS & REPORTING MODELS**

Support platform analytics and insights.

---

#### **9.1 Platform Metrics**

Daily aggregated metrics for dashboard.

```typescript
Table: platform_metrics
Purpose: Store daily aggregated metrics for platform health monitoring
```

| Field                          | Type          | Constraints                    | Description                           |
|--------------------------------|---------------|--------------------------------|---------------------------------------|
| id                             | UUID          | PRIMARY KEY                    | Metric record identifier              |
| metric_date                    | DATE          | UNIQUE, NOT NULL               | Date of metrics                       |
| total_professionals            | INTEGER       | DEFAULT 0                      | Total active professionals            |
| total_companies                | INTEGER       | DEFAULT 0                      | Total active companies                |
| total_hr_partners              | INTEGER       | DEFAULT 0                      | Total HR users                        |
| new_professionals_today        | INTEGER       | DEFAULT 0                      | New signups today                     |
| new_companies_today            | INTEGER       | DEFAULT 0                      | New companies today                   |
| active_job_roles               | INTEGER       | DEFAULT 0                      | Active job postings                   |
| introductions_sent_today       | INTEGER       | DEFAULT 0                      | Intro requests sent                   |
| introductions_accepted_today   | INTEGER       | DEFAULT 0                      | Accepted today                        |
| introductions_declined_today   | INTEGER       | DEFAULT 0                      | Declined today                        |
| acceptance_rate_percentage     | DECIMAL(5,2)  | DEFAULT 0.00                   | Acceptance rate                       |
| avg_response_time_hours        | DECIMAL(10,2) | NULLABLE                       | Avg time to respond                   |
| total_searches_today           | INTEGER       | DEFAULT 0                      | Search queries today                  |
| total_profile_views_today      | INTEGER       | DEFAULT 0                      | Profile views today                   |
| revenue_today_ngn              | INTEGER       | DEFAULT 0                      | Revenue today (Naira)                 |
| created_at                     | TIMESTAMP     | DEFAULT NOW()                  | Record creation                       |

**Indexes:**
- `idx_platform_metrics_date` (metric_date)

---

#### **9.2 User Activity Logs**

Audit trail for security and debugging.

```typescript
Table: user_activity_logs
Purpose: Audit trail for important user actions
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Log entry identifier                  |
| user_id                | UUID          | FK → users.id, NOT NULL            | User who performed action             |
| action_type            | VARCHAR(100)  | NOT NULL                           | Type of action (login, profile_update, etc.)|
| entity_type            | VARCHAR(50)   | NULLABLE                           | Type of entity affected               |
| entity_id              | UUID          | NULLABLE                           | ID of entity affected                 |
| description            | TEXT          | NULLABLE                           | Human-readable description            |
| ip_address             | VARCHAR(45)   | NULLABLE                           | IP address                            |
| user_agent             | TEXT          | NULLABLE                           | Browser user agent                    |
| metadata               | JSONB         | NULLABLE                           | Additional context data               |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Action timestamp                      |

**Indexes:**
- `idx_activity_logs_user_id` (user_id)
- `idx_activity_logs_action_type` (action_type)
- `idx_activity_logs_created_at` (created_at)

---

### **10. CONTENT & CONFIGURATION MODELS**

System configuration and content management.

---

#### **10.1 System Settings**

Platform-wide configuration.

```typescript
Table: system_settings
Purpose: Store platform configuration and feature flags
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Setting identifier                    |
| setting_key            | VARCHAR(100)  | UNIQUE, NOT NULL                   | Setting key (e.g., 'intro_expiry_days')|
| setting_value          | TEXT          | NOT NULL                           | Setting value                         |
| value_type             | ENUM          | NOT NULL                           | 'string', 'integer', 'boolean', 'json'|
| description            | TEXT          | NULLABLE                           | What this setting controls            |
| is_public              | BOOLEAN       | DEFAULT FALSE                      | Can clients see this setting          |
| updated_by_admin_id    | UUID          | FK → users.id, NULLABLE            | Admin who last updated                |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Setting creation                      |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_system_settings_key` (setting_key)

**Example Settings:**
```json
{
  "introduction_expiry_days": "7",
  "max_pending_introductions_per_professional": "10",
  "verification_required_for_visibility": "true",
  "trial_duration_days": "14",
  "min_salary_threshold_ngn": "3000000"
}
```

---

#### **10.2 Industries**

Standardized industry/sector list.

```typescript
Table: industries
Purpose: Standardized industry list for consistency
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Industry identifier                   |
| industry_name          | VARCHAR(100)  | UNIQUE, NOT NULL                   | Industry name                         |
| industry_slug          | VARCHAR(100)  | UNIQUE, NOT NULL                   | URL-friendly slug                     |
| description            | TEXT          | NULLABLE                           | Industry description                  |
| is_active              | BOOLEAN       | DEFAULT TRUE                       | Currently selectable                  |
| sort_order             | INTEGER       | DEFAULT 0                          | Display order                         |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Record creation                       |

**Example Industries:**
- Financial Services
- Technology
- Oil & Gas
- Telecommunications
- Healthcare
- Manufacturing
- Retail & E-commerce
- Professional Services
- etc.

---

#### **10.3 Skills Taxonomy**

Standardized skill names for consistent tagging.

```typescript
Table: skills_taxonomy
Purpose: Standardized skill names for matching and search
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Skill identifier                      |
| skill_name             | VARCHAR(100)  | UNIQUE, NOT NULL                   | Standardized skill name               |
| skill_slug             | VARCHAR(100)  | UNIQUE, NOT NULL                   | URL-friendly slug                     |
| skill_category         | VARCHAR(50)   | NULLABLE                           | Category (Technical, Soft, Domain)    |
| parent_skill_id        | UUID          | FK → skills_taxonomy.id, NULLABLE  | Parent skill (for hierarchy)          |
| synonyms               | JSONB         | NULLABLE                           | Array of alternative names            |
| usage_count            | INTEGER       | DEFAULT 0                          | How many profiles use this skill      |
| is_active              | BOOLEAN       | DEFAULT TRUE                       | Currently selectable                  |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Record creation                       |

**Example Skills:**
- Project Management
- Python Programming
- Financial Analysis
- Change Management
- Strategic Planning
- etc.

---

### **11. EMAIL & TEMPLATE MODELS**

Email campaign and template management.

---

#### **11.1 Email Templates**

Reusable email templates for platform communications.

```typescript
Table: email_templates
Purpose: Store email templates for transactional and marketing emails
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Template identifier                   |
| template_name          | VARCHAR(100)  | UNIQUE, NOT NULL                   | Template identifier                   |
| template_subject       | VARCHAR(255)  | NOT NULL                           | Email subject line                    |
| template_body_html     | TEXT          | NOT NULL                           | HTML email body                       |
| template_body_text     | TEXT          | NULLABLE                           | Plain text fallback                   |
| template_variables     | JSONB         | NULLABLE                           | Available variables (for documentation)|
| category               | ENUM          | NOT NULL                           | 'transactional', 'marketing', 'system'|
| is_active              | BOOLEAN       | DEFAULT TRUE                       | Currently in use                      |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Template creation                     |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Example Templates:**
- welcome_professional
- welcome_hr_partner
- introduction_request_received
- introduction_accepted
- introduction_declined
- password_reset
- verification_complete
- subscription_expiring
- invoice_due
- etc.

---

#### **11.2 Email Logs**

Track all emails sent from the platform.

```typescript
Table: email_logs
Purpose: Track all outgoing emails for debugging and compliance
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Email log identifier                  |
| user_id                | UUID          | FK → users.id, NULLABLE            | Recipient user (if applicable)        |
| recipient_email        | VARCHAR(255)  | NOT NULL                           | Email address sent to                 |
| template_id            | UUID          | FK → email_templates.id, NULLABLE  | Template used                         |
| subject                | VARCHAR(255)  | NOT NULL                           | Email subject                         |
| body_html              | TEXT          | NULLABLE                           | Rendered HTML body                    |
| status                 | ENUM          | DEFAULT 'pending'                  | 'pending', 'sent', 'delivered', 'bounced', 'failed'|
| email_provider         | VARCHAR(50)   | NULLABLE                           | Email service used (SendGrid, etc.)   |
| provider_message_id    | VARCHAR(255)  | NULLABLE                           | Provider's message ID                 |
| error_message          | TEXT          | NULLABLE                           | Error if failed                       |
| sent_at                | TIMESTAMP     | NULLABLE                           | When sent                             |
| delivered_at           | TIMESTAMP     | NULLABLE                           | When delivered (if tracked)           |
| opened_at              | TIMESTAMP     | NULLABLE                           | First open (if tracked)               |
| clicked_at             | TIMESTAMP     | NULLABLE                           | First link click (if tracked)         |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Record creation                       |

**Indexes:**
- `idx_email_logs_user_id` (user_id)
- `idx_email_logs_status` (status)
- `idx_email_logs_sent_at` (sent_at)
- `idx_email_logs_recipient` (recipient_email)

---

### **12. ADMIN & MODERATION MODELS**

Support admin operations and content moderation.

---

#### **12.1 Admin Users**

Platform administrators (separate from regular users).

```typescript
Table: admin_users
Purpose: Platform administrators with elevated permissions
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Admin identifier                      |
| user_id                | UUID          | FK → users.id, UNIQUE, NOT NULL    | Linked user account                   |
| admin_role             | ENUM          | DEFAULT 'moderator'                | 'super_admin', 'admin', 'moderator'   |
| permissions            | JSONB         | NOT NULL                           | Array of permission strings           |
| can_verify_professionals| BOOLEAN      | DEFAULT FALSE                      | Can verify professional profiles      |
| can_verify_companies   | BOOLEAN       | DEFAULT FALSE                      | Can verify companies                  |
| can_manage_billing     | BOOLEAN       | DEFAULT FALSE                      | Access to billing/subscriptions       |
| can_view_analytics     | BOOLEAN       | DEFAULT TRUE                       | Access to analytics dashboard         |
| can_moderate_content   | BOOLEAN       | DEFAULT TRUE                       | Can review/remove content             |
| status                 | ENUM          | DEFAULT 'active'                   | 'active', 'suspended'                 |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Admin account creation                |
| updated_at             | TIMESTAMP     | DEFAULT NOW()                      | Last update                           |

**Indexes:**
- `idx_admin_users_user_id` (user_id)
- `idx_admin_users_role` (admin_role)

---

#### **12.2 Moderation Queue**

Content flagged for review.

```typescript
Table: moderation_queue
Purpose: Track content that needs moderation review
```

| Field                  | Type          | Constraints                        | Description                           |
|------------------------|---------------|------------------------------------|---------------------------------------|
| id                     | UUID          | PRIMARY KEY                        | Queue entry identifier                |
| entity_type            | VARCHAR(50)   | NOT NULL                           | Type of content (profile, job_role, etc.)|
| entity_id              | UUID          | NOT NULL                           | ID of flagged entity                  |
| reported_by_user_id    | UUID          | FK → users.id, NULLABLE            | User who reported (if user-reported)  |
| report_reason          | TEXT          | NULLABLE                           | Why it was flagged                    |
| flagged_by_system      | BOOLEAN       | DEFAULT FALSE                      | Auto-flagged by algorithm             |
| severity               | ENUM          | DEFAULT 'medium'                   | 'low', 'medium', 'high', 'critical'   |
| status                 | ENUM          | DEFAULT 'pending'                  | 'pending', 'reviewed', 'approved', 'removed'|
| reviewed_by_admin_id   | UUID          | FK → admin_users.id, NULLABLE      | Admin who reviewed                    |
| review_notes           | TEXT          | NULLABLE                           | Admin's review notes                  |
| action_taken           | VARCHAR(100)  | NULLABLE                           | Action taken (approved, removed, etc.)|
| reviewed_at            | TIMESTAMP     | NULLABLE                           | Review timestamp                      |
| created_at             | TIMESTAMP     | DEFAULT NOW()                      | Flag timestamp                        |

**Indexes:**
- `idx_moderation_queue_status` (status)
- `idx_moderation_queue_severity` (severity)
- `idx_moderation_queue_entity` (entity_type, entity_id)

---

### **13. RELATIONSHIPS SUMMARY**

Quick reference of all foreign key relationships:

```
users
  ├─→ professionals (1:1)
  ├─→ hr_partners (1:1)
  ├─→ user_sessions (1:many)
  ├─→ password_resets (1:many)
  ├─→ messages (1:many as sender)
  ├─→ messages (1:many as recipient)
  ├─→ notifications (1:many)
  └─→ user_activity_logs (1:many)

professionals
  ├─→ professional_work_history (1:many)
  ├─→ professional_education (1:many)
  ├─→ professional_skills (1:many)
  ├─→ professional_certifications (1:many)
  ├─→ professional_references (1:many)
  ├─→ introduction_requests (1:many as recipient)
  ├─→ saved_professionals (1:many)
  └─→ profile_views (1:many as viewed)

companies
  ├─→ hr_partners (1:many)
  ├─→ job_roles (1:many)
  ├─→ introduction_requests (1:many)
  ├─→ company_subscriptions (1:many)
  ├─→ invoices (1:many)
  └─→ payments (1:many)

hr_partners
  ├─→ job_roles (1:many as creator)
  ├─→ introduction_requests (1:many as sender)
  ├─→ saved_professionals (1:many)
  ├─→ search_queries (1:many)
  └─→ profile_views (1:many as viewer)

job_roles
  └─→ introduction_requests (1:many)

introduction_requests
  └─→ messages (1:many)

subscription_plans
  └─→ company_subscriptions (1:many)

company_subscriptions
  └─→ invoices (1:many)

invoices
  └─→ payments (1:many)

email_templates
  └─→ email_logs (1:many)

admin_users
  └─→ moderation_queue (1:many as reviewer)
```

---

### **14. DATABASE INDEXES SUMMARY**

Critical indexes for query performance:

**Most Important Indexes:**
1. User authentication: `users.email`, `users.phone`
2. Professional search: GIN index on `professionals` (name, title, skills)
3. Introduction workflow: `introduction_requests` (status, dates, foreign keys)
4. Analytics queries: timestamp fields across all tables
5. Foreign keys: All FK columns should have indexes

---

### **15. DATA RETENTION & ARCHIVAL POLICIES**

**Soft Deletes:**
- `users`: Use `deleted_at` timestamp
- `professionals`: Cascade soft delete from users
- `companies`: Soft delete with grace period
- `job_roles`: Soft delete when filled/closed

**Data Retention:**
- Active sessions: 30 days
- Password reset tokens: 15 minutes
- Expired introduction requests: Keep indefinitely for analytics
- Audit logs: 2 years minimum
- Email logs: 1 year
- Search queries: 90 days

**GDPR Compliance:**
- Right to be forgotten: Hard delete all user data on request
- Data export: Provide JSON export of all user data
- Consent tracking: Store in `user_activity_logs`

---

### **16. SECURITY CONSIDERATIONS**

**Sensitive Data Protection:**

```typescript
// Fields requiring encryption at rest
Encrypted Fields:
  - users.password_hash (bcrypt, not reversible)
  - professional_references.reference_email
  - professional_references.reference_phone
  - professional_references.verification_notes
  - hr_partners.* (contact details if confidential)
  - messages.message_body (optional, for high-security)

// PII (Personally Identifiable Information)
PII Fields - Audit all access:
  - users.email
  - users.phone
  - professionals.first_name, last_name
  - professionals.profile_photo_url
  - professionals.resume_url
  - all professional_* related tables
```

**Access Control:**
- Row-level security (RLS) for multi-tenant isolation
- Companies can only see their own data
- Professionals can only see their own profile (unless shared)
- HR partners limited to their company's data
- Admin access fully logged in `user_activity_logs`

**Rate Limiting:**
- Authentication attempts: 5 per 15 minutes per IP
- Introduction requests: Based on subscription tier
- Search queries: 100 per hour per HR partner
- API calls: Tier-based rate limiting

---

### **17. SAMPLE QUERIES & USE CASES**

**Use Case 1: Find Matching Professionals for a Job Role**

```sql
-- Find professionals matching job criteria
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.current_title,
  p.years_of_experience,
  p.location_city,
  p.verification_status
FROM professionals p
LEFT JOIN professional_skills ps ON p.id = ps.professional_id
WHERE 
  p.open_to_opportunities = TRUE
  AND p.verification_status IN ('full', 'premium')
  AND p.location_city = 'Lagos'
  AND p.years_of_experience >= 8
  AND ps.skill_name IN ('Project Management', 'Agile', 'Scrum')
  AND p.salary_expectation_min <= 15000000
  AND p.id NOT IN (
    -- Exclude professionals who already have pending intros for this role
    SELECT sent_to_professional_id 
    FROM introduction_requests 
    WHERE job_role_id = '{role_id}' 
    AND status = 'pending'
  )
GROUP BY p.id
HAVING COUNT(DISTINCT ps.skill_name) >= 2  -- At least 2 matching skills
ORDER BY p.verification_status DESC, p.years_of_experience DESC
LIMIT 20;
```

**Use Case 2: Calculate Introduction Acceptance Rate**

```sql
-- Calculate acceptance rate for last 30 days
SELECT 
  DATE(sent_at) as date,
  COUNT(*) as total_sent,
  SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted,
  SUM(CASE WHEN status = 'declined' THEN 1 ELSE 0 END) as declined,
  SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired,
  ROUND(
    SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END)::NUMERIC / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as acceptance_rate_percentage
FROM introduction_requests
WHERE sent_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(sent_at)
ORDER BY date DESC;
```

**Use Case 3: Professional Dashboard Stats**

```sql
-- Get stats for professional dashboard
SELECT 
  COUNT(*) FILTER (WHERE status = 'pending') as pending_introductions,
  COUNT(*) FILTER (WHERE status = 'accepted') as accepted_introductions,
  COUNT(*) FILTER (WHERE status = 'declined') as declined_introductions,
  COUNT(*) FILTER (WHERE interview_scheduled = TRUE) as interviews_scheduled,
  COUNT(*) FILTER (WHERE outcome = 'hired') as offers_received,
  AVG(
    EXTRACT(EPOCH FROM (response_date - sent_at)) / 3600
  )::INTEGER as avg_response_time_hours
FROM introduction_requests
WHERE sent_to_professional_id = '{professional_id}'
  AND sent_at >= CURRENT_DATE - INTERVAL '90 days';
```

**Use Case 4: HR Dashboard - Company Hiring Metrics**

```sql
-- Company hiring funnel metrics
SELECT 
  jr.role_title,
  jr.status as role_status,
  COUNT(ir.id) as total_introductions_sent,
  SUM(CASE WHEN ir.status = 'accepted' THEN 1 ELSE 0 END) as accepted,
  SUM(CASE WHEN ir.interview_scheduled = TRUE THEN 1 ELSE 0 END) as interviews,
  SUM(CASE WHEN ir.outcome = 'hired' THEN 1 ELSE 0 END) as hired,
  ROUND(
    AVG(EXTRACT(EPOCH FROM (ir.response_date - ir.sent_at)) / 3600), 
    1
  ) as avg_response_time_hours
FROM job_roles jr
LEFT JOIN introduction_requests ir ON jr.id = ir.job_role_id
WHERE jr.company_id = '{company_id}'
  AND jr.status IN ('active', 'filled')
  AND jr.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY jr.id, jr.role_title, jr.status
ORDER BY jr.created_at DESC;
```

**Use Case 5: Top Skills in Demand**

```sql
-- Most requested skills across active job roles
SELECT 
  skill_name,
  COUNT(DISTINCT jr.id) as roles_requiring,
  COUNT(DISTINCT jr.company_id) as companies_seeking,
  AVG(jr.salary_range_max) as avg_max_salary
FROM job_roles jr,
  jsonb_array_elements_text(jr.required_skills) as skill_name
WHERE jr.status = 'active'
GROUP BY skill_name
ORDER BY roles_requiring DESC
LIMIT 20;
```

**Use Case 6: Professional Profile Completeness**

```sql
-- Calculate profile completeness percentage
WITH profile_sections AS (
  SELECT 
    p.id,
    CASE WHEN p.profile_photo_url IS NOT NULL THEN 10 ELSE 0 END +
    CASE WHEN p.profile_summary IS NOT NULL THEN 15 ELSE 0 END +
    CASE WHEN p.resume_url IS NOT NULL THEN 10 ELSE 0 END +
    CASE WHEN p.linkedin_url IS NOT NULL THEN 5 ELSE 0 END +
    CASE WHEN COUNT(DISTINCT pwh.id) >= 2 THEN 20 ELSE COUNT(DISTINCT pwh.id) * 10 END +
    CASE WHEN COUNT(DISTINCT pe.id) >= 1 THEN 15 ELSE 0 END +
    CASE WHEN COUNT(DISTINCT ps.id) >= 5 THEN 15 ELSE COUNT(DISTINCT ps.id) * 3 END +
    CASE WHEN COUNT(DISTINCT pr.id) >= 2 THEN 10 ELSE COUNT(DISTINCT pr.id) * 5 END
    as completeness_score
  FROM professionals p
  LEFT JOIN professional_work_history pwh ON p.id = pwh.professional_id
  LEFT JOIN professional_education pe ON p.id = pe.professional_id
  LEFT JOIN professional_skills ps ON p.id = ps.professional_id
  LEFT JOIN professional_references pr ON p.id = pr.professional_id AND pr.permission_granted = TRUE
  WHERE p.id = '{professional_id}'
  GROUP BY p.id, p.profile_photo_url, p.profile_summary, p.resume_url, p.linkedin_url
)
UPDATE professionals
SET profile_completeness = (SELECT completeness_score FROM profile_sections)
WHERE id = '{professional_id}';
```

---

### **18. MIGRATION STRATEGY**

**Initial Setup Order:**

```sql
-- 1. Core infrastructure tables
CREATE TABLE users;
CREATE TABLE user_sessions;
CREATE TABLE password_resets;
CREATE TABLE admin_users;

-- 2. Reference/taxonomy tables
CREATE TABLE industries;
CREATE TABLE skills_taxonomy;
CREATE TABLE subscription_plans;
CREATE TABLE email_templates;
CREATE TABLE system_settings;

-- 3. Main entity tables
CREATE TABLE professionals;
CREATE TABLE companies;
CREATE TABLE hr_partners;

-- 4. Professional profile tables
CREATE TABLE professional_work_history;
CREATE TABLE professional_education;
CREATE TABLE professional_skills;
CREATE TABLE professional_certifications;
CREATE TABLE professional_references;

-- 5. Job and matching tables
CREATE TABLE job_roles;
CREATE TABLE introduction_requests;
CREATE TABLE saved_professionals;

-- 6. Communication tables
CREATE TABLE messages;
CREATE TABLE notifications;

-- 7. Analytics tables
CREATE TABLE search_queries;
CREATE TABLE profile_views;
CREATE TABLE platform_metrics;
CREATE TABLE user_activity_logs;

-- 8. Billing tables
CREATE TABLE company_subscriptions;
CREATE TABLE invoices;
CREATE TABLE payments;

-- 9. Email and moderation
CREATE TABLE email_logs;
CREATE TABLE moderation_queue;

-- 10. Create all indexes
-- 11. Create all foreign key constraints
-- 12. Set up triggers for updated_at timestamps
-- 13. Seed initial data (industries, skills, subscription plans)
```

---

### **19. TRIGGERS & STORED PROCEDURES**

**Auto-Update Timestamps:**

```sql
-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Repeat for all tables with updated_at column
```

**Calculate Profile Completeness on Update:**

```sql
-- Trigger to recalculate profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness()
RETURNS TRIGGER AS $
DECLARE
  completeness INTEGER := 0;
BEGIN
  -- Basic info (30 points)
  IF NEW.profile_photo_url IS NOT NULL THEN completeness := completeness + 10; END IF;
  IF NEW.profile_summary IS NOT NULL THEN completeness := completeness + 15; END IF;
  IF NEW.resume_url IS NOT NULL THEN completeness := completeness + 10; END IF;
  IF NEW.linkedin_url IS NOT NULL THEN completeness := completeness + 5; END IF;
  
  -- Work history (20 points) - checked separately
  -- Education (15 points) - checked separately  
  -- Skills (15 points) - checked separately
  -- References (10 points) - checked separately
  
  NEW.profile_completeness := completeness;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_professional_completeness
  BEFORE INSERT OR UPDATE ON professionals
  FOR EACH ROW
  EXECUTE FUNCTION calculate_profile_completeness();
```

**Auto-Expire Introduction Requests:**

```sql
-- Scheduled job to expire old requests
CREATE OR REPLACE FUNCTION expire_introduction_requests()
RETURNS void AS $
BEGIN
  UPDATE introduction_requests
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$ LANGUAGE plpgsql;

-- Run via cron or pg_cron extension every hour
```

**Increment View Counts:**

```sql
-- Trigger to increment job role view count
CREATE OR REPLACE FUNCTION increment_job_role_views()
RETURNS TRIGGER AS $
BEGIN
  UPDATE job_roles
  SET view_count = view_count + 1
  WHERE id = NEW.job_role_id;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER increment_role_views
  AFTER INSERT ON profile_views
  FOR EACH ROW
  WHEN (NEW.job_role_id IS NOT NULL)
  EXECUTE FUNCTION increment_job_role_views();
```

---

### **20. SEED DATA**

**Initial Industries:**

```sql
INSERT INTO industries (industry_name, industry_slug, sort_order) VALUES
  ('Financial Services', 'financial-services', 1),
  ('Technology', 'technology', 2),
  ('Oil & Gas', 'oil-gas', 3),
  ('Telecommunications', 'telecommunications', 4),
  ('Healthcare', 'healthcare', 5),
  ('Manufacturing', 'manufacturing', 6),
  ('Retail & E-commerce', 'retail-ecommerce', 7),
  ('Professional Services', 'professional-services', 8),
  ('Real Estate', 'real-estate', 9),
  ('Media & Entertainment', 'media-entertainment', 10),
  ('Education', 'education', 11),
  ('Agriculture', 'agriculture', 12),
  ('Transportation & Logistics', 'transportation-logistics', 13),
  ('Hospitality & Tourism', 'hospitality-tourism', 14),
  ('Energy & Utilities', 'energy-utilities', 15);
```

**Initial Subscription Plans:**

```sql
INSERT INTO subscription_plans (
  plan_name, 
  price_monthly_ngn, 
  price_annual_ngn, 
  introduction_credits_monthly, 
  max_hr_users, 
  max_active_roles,
  features
) VALUES
  (
    'Trial',
    0,
    0,
    5,
    1,
    2,
    '["basic_search", "email_support"]'
  ),
  (
    'Basic',
    50000,
    540000,
    20,
    3,
    5,
    '["basic_search", "advanced_filters", "email_support", "analytics_basic"]'
  ),
  (
    'Professional',
    150000,
    1620000,
    50,
    10,
    15,
    ["advanced_search", "ai_matching", "priority_support", "analytics_advanced", "confidential_roles", "bulk_introductions"]'
  ),
  (
    'Enterprise',
    NULL,
    NULL,
    999999,
    NULL,
    NULL,
    '["all_features", "dedicated_account_manager", "custom_integration", "api_access", "white_label"]'
  );
```

**Common Skills:**

```sql
INSERT INTO skills_taxonomy (skill_name, skill_slug, skill_category) VALUES
  -- Leadership
  ('Strategic Planning', 'strategic-planning', 'Leadership'),
  ('Change Management', 'change-management', 'Leadership'),
  ('Team Leadership', 'team-leadership', 'Leadership'),
  ('Project Management', 'project-management', 'Leadership'),
  
  -- Technical
  ('Data Analysis', 'data-analysis', 'Technical'),
  ('Python', 'python', 'Technical'),
  ('SQL', 'sql', 'Technical'),
  ('Cloud Computing', 'cloud-computing', 'Technical'),
  
  -- Business
  ('Financial Analysis', 'financial-analysis', 'Business'),
  ('Business Development', 'business-development', 'Business'),
  ('Sales Strategy', 'sales-strategy', 'Business'),
  ('Marketing Strategy', 'marketing-strategy', 'Business'),
  
  -- Domain
  ('Risk Management', 'risk-management', 'Domain'),
  ('Compliance', 'compliance', 'Domain'),
  ('Operations Management', 'operations-management', 'Domain'),
  ('Supply Chain', 'supply-chain', 'Domain');
```

**System Settings:**

```sql
INSERT INTO system_settings (setting_key, setting_value, value_type, description, is_public) VALUES
  ('introduction_expiry_days', '7', 'integer', 'Days before introduction request expires', true),
  ('max_pending_introductions_per_professional', '10', 'integer', 'Max pending requests a professional can have', false),
  ('trial_duration_days', '14', 'integer', 'Trial period length for new companies', true),
  ('min_salary_threshold_ngn', '3000000', 'integer', 'Minimum salary for senior roles', false),
  ('verification_turnaround_days', '3', 'integer', 'Target days to complete verification', false),
  ('platform_commission_percentage', '0', 'integer', 'Commission on successful hires (future)', false);
```

---

### **21. API ENDPOINTS MAPPING**

Quick reference of likely API endpoints and their data access:

**Authentication:**
- `POST /api/auth/register` → `users`, `professionals`/`hr_partners`
- `POST /api/auth/login` → `users`, `user_sessions`
- `POST /api/auth/logout` → `user_sessions`
- `POST /api/auth/reset-password` → `password_resets`

**Professionals:**
- `GET /api/professionals/me` → `professionals` + related tables
- `PUT /api/professionals/me` → `professionals`
- `GET /api/professionals/:id` → `professionals` (with privacy checks)
- `POST /api/professionals/work-history` → `professional_work_history`
- `POST /api/professionals/education` → `professional_education`
- `POST /api/professionals/skills` → `professional_skills`

**Companies & HR:**
- `GET /api/companies/me` → `companies`, `hr_partners`
- `POST /api/companies/team-members` → `hr_partners`
- `GET /api/companies/subscription` → `company_subscriptions`

**Job Roles:**
- `GET /api/job-roles` → `job_roles` (for HR's company)
- `POST /api/job-roles` → `job_roles`
- `PUT /api/job-roles/:id` → `job_roles`
- `DELETE /api/job-roles/:id` → `job_roles` (soft delete)

**Introduction Requests:**
- `POST /api/introductions/request` → `introduction_requests`
- `GET /api/introductions/sent` → `introduction_requests` (HR view)
- `GET /api/introductions/received` → `introduction_requests` (Professional view)
- `PUT /api/introductions/:id/accept` → `introduction_requests`
- `PUT /api/introductions/:id/decline` → `introduction_requests`

**Search & Discovery:**
- `POST /api/search/professionals` → `professionals`, `search_queries`
- `GET /api/search/saved` → `saved_professionals`
- `POST /api/search/save` → `saved_professionals`

**Messages:**
- `GET /api/messages/conversations` → `messages`
- `POST /api/messages` → `messages`
- `PUT /api/messages/:id/read` → `messages`

**Analytics:**
- `GET /api/analytics/dashboard` → Multiple tables
- `GET /api/analytics/profile-views` → `profile_views`
- `GET /api/analytics/metrics` → `platform_metrics`

**Billing:**
- `GET /api/billing/invoices` → `invoices`
- `POST /api/billing/payments` → `payments`
- `GET /api/billing/subscription` → `company_subscriptions`

---

### **22. PERFORMANCE OPTIMIZATION NOTES**

**Caching Strategy:**

```typescript
// Redis cache keys
Cache Keys:
  - `user:{user_id}:profile` (TTL: 15 minutes)
  - `professional:{id}:full` (TTL: 10 minutes)
  - `company:{id}:details` (TTL: 30 minutes)
  - `job_role:{id}:details` (TTL: 5 minutes)
  - `search:results:{hash}` (TTL: 2 minutes)
  - `stats:professional:{id}` (TTL: 1 hour)
  - `stats:company:{id}` (TTL: 1 hour)

// Invalidate on updates
Invalidation triggers:
  - Profile update → Clear user and professional caches
  - New introduction request → Clear stats caches
  - Job role update → Clear job role cache
```

**Database Partitioning:**

```sql
-- Partition large tables by date for better performance
-- Example: partition introduction_requests by month
CREATE TABLE introduction_requests_2025_10 PARTITION OF introduction_requests
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- Partition email_logs by month (auto-archive old data)
-- Partition user_activity_logs by month
```

**Query Optimization:**

```sql
-- Use materialized views for complex analytics
CREATE MATERIALIZED VIEW mv_company_metrics AS
SELECT 
  c.id as company_id,
  c.company_name,
  COUNT(DISTINCT jr.id) as total_roles,
  COUNT(DISTINCT ir.id) as total_introductions,
  SUM(CASE WHEN ir.status = 'accepted' THEN 1 ELSE 0 END) as accepted_count,
  AVG(EXTRACT(EPOCH FROM (ir.response_date - ir.sent_at)) / 3600) as avg_response_hours
FROM companies c
LEFT JOIN job_roles jr ON c.id = jr.company_id
LEFT JOIN introduction_requests ir ON jr.id = ir.job_role_id
GROUP BY c.id, c.company_name;

-- Refresh hourly via cron
REFRESH MATERIALIZED VIEW mv_company_metrics;
```

---

### **23. BACKUP & DISASTER RECOVERY**

**Backup Strategy:**
- **Full backup**: Daily at 2 AM WAT
- **Incremental backup**: Every 6 hours
- **Transaction log backup**: Every 30 minutes
- **Retention**: 30 days online, 1 year archive

**Critical Tables (Priority 1 - Most frequent backups):**
- `users`
- `professionals`
- `introduction_requests`
- `messages`
- `payments`

**Recovery Time Objective (RTO):** 4 hours  
**Recovery Point Objective (RPO):** 30 minutes

---

### **24. SCALABILITY CONSIDERATIONS**

**Read Replicas:**
- Primary database: All writes
- Read replica 1: HR dashboard queries
- Read replica 2: Professional dashboard queries
- Read replica 3: Analytics and reporting

**Sharding Strategy (Future):**
- Shard by `company_id` for companies with > 50 HR users
- Shard by geographic region (Lagos, Abuja, Port Harcourt)

**Connection Pooling:**
- Maximum connections: 100
- Minimum connections: 10
- Connection timeout: 30 seconds
- Idle timeout: 10 minutes

---

## **25. CONCLUSION**

This comprehensive data model supports theNexus platform's core features:

✅ **Verified professional profiles** with rich career data  
✅ **Company accounts** with team-based access  
✅ **Opt-in introduction workflow** (not mass applications)  
✅ **Privacy-first architecture** with confidential search  
✅ **Subscription billing** with multiple tiers  
✅ **Analytics and insights** for all stakeholders  
✅ **Scalable design** ready for growth  
✅ **Security-focused** with audit trails  

**Next Steps:**
1. Implement schema in PostgreSQL
2. Create Prisma/TypeORM models
3. Build API endpoints
4. Implement authentication system
5. Add full-text search (Algolia/Typesense)
6. Set up Redis caching layer
7. Deploy database with automated backups

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Maintainer:** theNexus Engineering Team  
**Contact:** info@jointhenexus.com