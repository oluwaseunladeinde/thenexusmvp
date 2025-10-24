-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('PROFESSIONAL', 'HR_PARTNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PRIVATE', 'NETWORK', 'PUBLIC');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'BASIC', 'FULL', 'PREMIUM');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'CONTRACT', 'CONSULTING');

-- CreateEnum
CREATE TYPE "DegreeType" AS ENUM ('BACHELOR', 'MASTER', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProficiencyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'EXPERT');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SMALL_1_10', 'MEDIUM_11_50', 'LARGE_51_200', 'XLARGE_201_500', 'ENTERPRISE_500_PLUS');

-- CreateEnum
CREATE TYPE "CompanyVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'PREMIUM');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('TRIAL', 'BASIC', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "HrRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "HrStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SeniorityLevel" AS ENUM ('DIRECTOR', 'VP', 'C_SUITE', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "RemoteOption" AS ENUM ('ON_SITE', 'HYBRID', 'REMOTE');

-- CreateEnum
CREATE TYPE "JobRoleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'FILLED', 'CLOSED');

-- CreateEnum
CREATE TYPE "IntroductionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "IntroductionOutcome" AS ENUM ('HIRED', 'REJECTED', 'WITHDREW', 'NO_RESPONSE');

-- CreateEnum
CREATE TYPE "ViewSource" AS ENUM ('SEARCH', 'SAVED', 'RECOMMENDATION', 'DIRECT');

-- CreateEnum
CREATE TYPE "FirewallEventType" AS ENUM ('SEARCH_FILTERED', 'INTRODUCTION_BLOCKED', 'VIEW_BLOCKED', 'BYPASS_ATTEMPT', 'COMPANY_ADDED', 'COMPANY_REMOVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INTRO_REQUEST', 'INTRO_ACCEPTED', 'INTRO_DECLINED', 'MESSAGE', 'PROFILE_VIEWED', 'VERIFICATION_COMPLETE', 'SUBSCRIPTION_EXPIRING', 'SYSTEM_ALERT');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'WHATSAPP', 'SMS');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED');

-- CreateEnum
CREATE TYPE "SettingValueType" AS ENUM ('STRING', 'INTEGER', 'BOOLEAN', 'JSON');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "hasDualRole" BOOLEAN NOT NULL DEFAULT false,
    "dualRoleEnabledAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professionals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "preferredName" TEXT,
    "profileHeadline" VARCHAR(200),
    "profileSummary" TEXT,
    "profilePhotoUrl" TEXT,
    "yearsOfExperience" SMALLINT NOT NULL,
    "currentTitle" TEXT,
    "currentCompany" TEXT,
    "currentIndustry" TEXT,
    "locationCity" TEXT NOT NULL,
    "locationState" TEXT NOT NULL,
    "willingToRelocate" BOOLEAN NOT NULL DEFAULT false,
    "salaryExpectationMin" INTEGER,
    "salaryExpectationMax" INTEGER,
    "noticePeriodDays" INTEGER NOT NULL DEFAULT 30,
    "openToOpportunities" BOOLEAN NOT NULL DEFAULT true,
    "confidentialSearch" BOOLEAN NOT NULL DEFAULT true,
    "profileVisibility" "ProfileVisibility" NOT NULL DEFAULT 'PRIVATE',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationDate" TIMESTAMP(3),
    "linkedinUrl" TEXT,
    "portfolioUrl" TEXT,
    "resumeUrl" TEXT,
    "isAlsoHrPartner" BOOLEAN NOT NULL DEFAULT false,
    "hideFromCompanyIds" TEXT[],
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "profileCompleteness" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professionals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_work_histories" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "industry" TEXT,
    "location" TEXT,
    "employmentType" "EmploymentType" NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "achievements" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_work_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_educations" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "degreeType" "DegreeType" NOT NULL,
    "fieldOfStudy" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,
    "grade" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_skills" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "skillName" VARCHAR(100) NOT NULL,
    "proficiencyLevel" "ProficiencyLevel" NOT NULL DEFAULT 'INTERMEDIATE',
    "yearsOfExperience" INTEGER,
    "isPrimarySkill" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professional_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_certifications" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "certificationName" TEXT NOT NULL,
    "issuingOrganization" TEXT NOT NULL,
    "issueDate" DATE NOT NULL,
    "expiryDate" DATE,
    "credentialId" TEXT,
    "credentialUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLogoUrl" TEXT,
    "industry" TEXT NOT NULL,
    "companySize" "CompanySize" NOT NULL,
    "headquartersLocation" TEXT NOT NULL,
    "companyWebsite" TEXT,
    "companyDescription" TEXT,
    "linkedinUrl" TEXT,
    "verificationStatus" "CompanyVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verificationDate" TIMESTAMP(3),
    "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'TRIAL',
    "subscriptionExpiresAt" TIMESTAMP(3),
    "introductionCredits" INTEGER NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hr_partners" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "department" TEXT,
    "profilePhotoUrl" TEXT,
    "linkedinUrl" TEXT,
    "roleInPlatform" "HrRole" NOT NULL DEFAULT 'MEMBER',
    "canCreateRoles" BOOLEAN NOT NULL DEFAULT true,
    "canSendIntroductions" BOOLEAN NOT NULL DEFAULT true,
    "canManageBilling" BOOLEAN NOT NULL DEFAULT false,
    "alsoProfessional" BOOLEAN NOT NULL DEFAULT false,
    "professionalId" TEXT,
    "status" "HrStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hr_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_roles" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdByHrId" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "roleDescription" TEXT NOT NULL,
    "responsibilities" TEXT,
    "requirements" TEXT NOT NULL,
    "preferredQualifications" TEXT,
    "seniorityLevel" "SeniorityLevel" NOT NULL,
    "industry" TEXT NOT NULL,
    "department" TEXT,
    "locationCity" TEXT NOT NULL,
    "locationState" TEXT NOT NULL,
    "remoteOption" "RemoteOption" NOT NULL DEFAULT 'ON_SITE',
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "salaryRangeMin" INTEGER NOT NULL,
    "salaryRangeMax" INTEGER NOT NULL,
    "benefits" TEXT,
    "yearsExperienceMin" INTEGER NOT NULL DEFAULT 5,
    "yearsExperienceMax" INTEGER,
    "requiredSkills" JSONB,
    "preferredSkills" JSONB,
    "isConfidential" BOOLEAN NOT NULL DEFAULT false,
    "confidentialReason" TEXT,
    "status" "JobRoleStatus" NOT NULL DEFAULT 'DRAFT',
    "applicationDeadline" DATE,
    "expectedStartDate" DATE,
    "introductionCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "job_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "introduction_requests" (
    "id" TEXT NOT NULL,
    "jobRoleId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "sentByHrId" TEXT NOT NULL,
    "sentToProfessionalId" TEXT NOT NULL,
    "personalizedMessage" TEXT,
    "status" "IntroductionStatus" NOT NULL DEFAULT 'PENDING',
    "professionalResponse" TEXT,
    "responseDate" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "viewedByProfessional" BOOLEAN NOT NULL DEFAULT false,
    "viewedAt" TIMESTAMP(3),
    "conversationStarted" BOOLEAN NOT NULL DEFAULT false,
    "interviewScheduled" BOOLEAN NOT NULL DEFAULT false,
    "outcome" "IntroductionOutcome",
    "outcomeDate" TIMESTAMP(3),
    "outcomeNotes" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "introduction_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_views" (
    "id" TEXT NOT NULL,
    "viewerHrId" TEXT NOT NULL,
    "viewedProfessionalId" TEXT NOT NULL,
    "viewSource" "ViewSource" NOT NULL,
    "jobRoleId" TEXT,
    "viewDurationSeconds" INTEGER,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "privacy_firewall_logs" (
    "id" TEXT NOT NULL,
    "eventType" "FirewallEventType" NOT NULL,
    "hrPartnerId" TEXT,
    "companyId" TEXT,
    "professionalId" TEXT,
    "actionTaken" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "privacy_firewall_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationType" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "actionUrl" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "actionType" VARCHAR(100) NOT NULL,
    "entityType" VARCHAR(50),
    "entityId" TEXT,
    "description" TEXT,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industries" (
    "id" TEXT NOT NULL,
    "industryName" TEXT NOT NULL,
    "industrySlug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_taxonomies" (
    "id" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "skillSlug" TEXT NOT NULL,
    "skillCategory" VARCHAR(50),
    "synonyms" JSONB,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_taxonomies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "settingKey" TEXT NOT NULL,
    "settingValue" TEXT NOT NULL,
    "valueType" "SettingValueType" NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_userType_idx" ON "users"("userType");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "professionals_userId_key" ON "professionals"("userId");

-- CreateIndex
CREATE INDEX "professionals_userId_idx" ON "professionals"("userId");

-- CreateIndex
CREATE INDEX "professionals_locationCity_locationState_idx" ON "professionals"("locationCity", "locationState");

-- CreateIndex
CREATE INDEX "professionals_verificationStatus_idx" ON "professionals"("verificationStatus");

-- CreateIndex
CREATE INDEX "professionals_profileVisibility_idx" ON "professionals"("profileVisibility");

-- CreateIndex
CREATE INDEX "professionals_hideFromCompanyIds_idx" ON "professionals" USING GIN ("hideFromCompanyIds");

-- CreateIndex
CREATE INDEX "professionals_openToOpportunities_idx" ON "professionals"("openToOpportunities");

-- CreateIndex
CREATE INDEX "professional_work_histories_professionalId_idx" ON "professional_work_histories"("professionalId");

-- CreateIndex
CREATE INDEX "professional_work_histories_isCurrent_idx" ON "professional_work_histories"("isCurrent");

-- CreateIndex
CREATE INDEX "professional_educations_professionalId_idx" ON "professional_educations"("professionalId");

-- CreateIndex
CREATE INDEX "professional_skills_professionalId_idx" ON "professional_skills"("professionalId");

-- CreateIndex
CREATE INDEX "professional_skills_skillName_idx" ON "professional_skills"("skillName");

-- CreateIndex
CREATE INDEX "professional_skills_isPrimarySkill_idx" ON "professional_skills"("isPrimarySkill");

-- CreateIndex
CREATE INDEX "professional_certifications_professionalId_idx" ON "professional_certifications"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "companies_companyName_key" ON "companies"("companyName");

-- CreateIndex
CREATE INDEX "companies_companyName_idx" ON "companies"("companyName");

-- CreateIndex
CREATE INDEX "companies_industry_idx" ON "companies"("industry");

-- CreateIndex
CREATE INDEX "companies_verificationStatus_idx" ON "companies"("verificationStatus");

-- CreateIndex
CREATE INDEX "companies_subscriptionTier_idx" ON "companies"("subscriptionTier");

-- CreateIndex
CREATE UNIQUE INDEX "hr_partners_userId_key" ON "hr_partners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "hr_partners_professionalId_key" ON "hr_partners"("professionalId");

-- CreateIndex
CREATE INDEX "hr_partners_userId_idx" ON "hr_partners"("userId");

-- CreateIndex
CREATE INDEX "hr_partners_companyId_idx" ON "hr_partners"("companyId");

-- CreateIndex
CREATE INDEX "hr_partners_professionalId_idx" ON "hr_partners"("professionalId");

-- CreateIndex
CREATE INDEX "hr_partners_roleInPlatform_idx" ON "hr_partners"("roleInPlatform");

-- CreateIndex
CREATE INDEX "job_roles_companyId_idx" ON "job_roles"("companyId");

-- CreateIndex
CREATE INDEX "job_roles_status_idx" ON "job_roles"("status");

-- CreateIndex
CREATE INDEX "job_roles_seniorityLevel_idx" ON "job_roles"("seniorityLevel");

-- CreateIndex
CREATE INDEX "job_roles_locationCity_locationState_idx" ON "job_roles"("locationCity", "locationState");

-- CreateIndex
CREATE INDEX "job_roles_createdByHrId_idx" ON "job_roles"("createdByHrId");

-- CreateIndex
CREATE INDEX "introduction_requests_jobRoleId_idx" ON "introduction_requests"("jobRoleId");

-- CreateIndex
CREATE INDEX "introduction_requests_companyId_idx" ON "introduction_requests"("companyId");

-- CreateIndex
CREATE INDEX "introduction_requests_sentByHrId_idx" ON "introduction_requests"("sentByHrId");

-- CreateIndex
CREATE INDEX "introduction_requests_sentToProfessionalId_idx" ON "introduction_requests"("sentToProfessionalId");

-- CreateIndex
CREATE INDEX "introduction_requests_status_idx" ON "introduction_requests"("status");

-- CreateIndex
CREATE INDEX "introduction_requests_outcome_idx" ON "introduction_requests"("outcome");

-- CreateIndex
CREATE INDEX "introduction_requests_sentAt_idx" ON "introduction_requests"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "introduction_requests_jobRoleId_sentToProfessionalId_key" ON "introduction_requests"("jobRoleId", "sentToProfessionalId");

-- CreateIndex
CREATE INDEX "profile_views_viewerHrId_idx" ON "profile_views"("viewerHrId");

-- CreateIndex
CREATE INDEX "profile_views_viewedProfessionalId_idx" ON "profile_views"("viewedProfessionalId");

-- CreateIndex
CREATE INDEX "profile_views_viewedAt_idx" ON "profile_views"("viewedAt");

-- CreateIndex
CREATE INDEX "privacy_firewall_logs_professionalId_idx" ON "privacy_firewall_logs"("professionalId");

-- CreateIndex
CREATE INDEX "privacy_firewall_logs_companyId_idx" ON "privacy_firewall_logs"("companyId");

-- CreateIndex
CREATE INDEX "privacy_firewall_logs_eventType_idx" ON "privacy_firewall_logs"("eventType");

-- CreateIndex
CREATE INDEX "privacy_firewall_logs_createdAt_idx" ON "privacy_firewall_logs"("createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_notificationType_idx" ON "notifications"("notificationType");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "user_activity_logs_userId_idx" ON "user_activity_logs"("userId");

-- CreateIndex
CREATE INDEX "user_activity_logs_actionType_idx" ON "user_activity_logs"("actionType");

-- CreateIndex
CREATE INDEX "user_activity_logs_createdAt_idx" ON "user_activity_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "industries_industryName_key" ON "industries"("industryName");

-- CreateIndex
CREATE UNIQUE INDEX "industries_industrySlug_key" ON "industries"("industrySlug");

-- CreateIndex
CREATE INDEX "industries_industrySlug_idx" ON "industries"("industrySlug");

-- CreateIndex
CREATE UNIQUE INDEX "skill_taxonomies_skillName_key" ON "skill_taxonomies"("skillName");

-- CreateIndex
CREATE UNIQUE INDEX "skill_taxonomies_skillSlug_key" ON "skill_taxonomies"("skillSlug");

-- CreateIndex
CREATE INDEX "skill_taxonomies_skillSlug_idx" ON "skill_taxonomies"("skillSlug");

-- CreateIndex
CREATE INDEX "skill_taxonomies_skillCategory_idx" ON "skill_taxonomies"("skillCategory");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_settingKey_key" ON "system_settings"("settingKey");

-- CreateIndex
CREATE INDEX "system_settings_settingKey_idx" ON "system_settings"("settingKey");

-- AddForeignKey
ALTER TABLE "professionals" ADD CONSTRAINT "professionals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_work_histories" ADD CONSTRAINT "professional_work_histories_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_educations" ADD CONSTRAINT "professional_educations_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_skills" ADD CONSTRAINT "professional_skills_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_certifications" ADD CONSTRAINT "professional_certifications_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_partners" ADD CONSTRAINT "hr_partners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_partners" ADD CONSTRAINT "hr_partners_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hr_partners" ADD CONSTRAINT "hr_partners_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_roles" ADD CONSTRAINT "job_roles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_roles" ADD CONSTRAINT "job_roles_createdByHrId_fkey" FOREIGN KEY ("createdByHrId") REFERENCES "hr_partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "introduction_requests" ADD CONSTRAINT "introduction_requests_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "job_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "introduction_requests" ADD CONSTRAINT "introduction_requests_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "introduction_requests" ADD CONSTRAINT "introduction_requests_sentByHrId_fkey" FOREIGN KEY ("sentByHrId") REFERENCES "hr_partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "introduction_requests" ADD CONSTRAINT "introduction_requests_sentToProfessionalId_fkey" FOREIGN KEY ("sentToProfessionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_viewerHrId_fkey" FOREIGN KEY ("viewerHrId") REFERENCES "hr_partners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_viewedProfessionalId_fkey" FOREIGN KEY ("viewedProfessionalId") REFERENCES "professionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_firewall_logs" ADD CONSTRAINT "privacy_firewall_logs_hrPartnerId_fkey" FOREIGN KEY ("hrPartnerId") REFERENCES "hr_partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_firewall_logs" ADD CONSTRAINT "privacy_firewall_logs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "privacy_firewall_logs" ADD CONSTRAINT "privacy_firewall_logs_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activity_logs" ADD CONSTRAINT "user_activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
