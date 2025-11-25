# theNexus: Dual-Role User System - Complete Implementation Prompt

## Executive Summary

Build a comprehensive dual-role system that allows HR partners on theNexus platform to also maintain a completely separate, confidential professional profile for job seeking. This feature must implement robust privacy firewalls to ensure their employer never discovers their job search activity.

---

## Table of Contents

1. [Problem Statement](#problem-statement)
2. [Technical Requirements](#technical-requirements)
3. [Database Schema Changes](#database-schema-changes)
4. [Backend API Implementation](#backend-api-implementation)
5. [Privacy Firewall Logic](#privacy-firewall-logic)
6. [Frontend Components](#frontend-components)
7. [User Flows](#user-flows)
8. [Testing Requirements](#testing-requirements)
9. [Security & Compliance](#security-compliance)
10. [Edge Cases](#edge-cases)
11. [Success Criteria](#success-criteria)

---

## 1. Problem Statement

### Context
HR professionals in Nigeria often search for new opportunities while employed. They need maximum confidentiality because:
- They work in HR/talent acquisition roles
- Their company would see any job search activity on traditional platforms
- They need privacy more than any other professional category
- They have unique insights into both sides of the hiring process

### Solution
Implement a dual-role account system where a single user can operate as both:
1. **HR Partner** - Searching for candidates, sending introduction requests, hiring for their company
2. **Professional** - Receiving introduction requests, exploring opportunities, conducting confidential job search

### Critical Constraint
The two identities must be **completely firewalled** from each other. An HR partner's company must **NEVER**:
- See their professional profile in searches
- Receive alerts about their activity
- Be able to send them introduction requests
- View their profile even with direct links
- Discover they are job seeking in any way

---

## 2. Technical Requirements

### Technology Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript 5+
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Authentication:** Clerk
- **Styling:** Tailwind CSS
- **State Management:** React Context API / Zustand
- **API:** Next.js API Routes (REST)
- **Cache:** Redis (optional, for session management)

### Performance Requirements
- Firewall checks must execute in <50ms
- Search queries must filter blocked profiles efficiently
- Zero data leakage tolerance (privacy is CRITICAL)
- Audit logs for all firewall events

### Browser Support
- Chrome/Edge (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 3. Database Schema Changes

### 3.1 Update `users` Table

```prisma
model User {
  id                   String    @id @default(cuid())
  email                String    @unique
  phone                String?   @unique
  passwordHash         String    // Managed by Clerk
  userType             UserType
  status               UserStatus @default(PENDING)
  emailVerified        Boolean   @default(false)
  phoneVerified        Boolean   @default(false)
  
  // NEW: Dual-role support
  hasDualRole          Boolean   @default(false)
  dualRoleEnabledAt    DateTime?
  
  lastLoginAt          DateTime?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  deletedAt            DateTime?
  
  professional         Professional?
  hrPartner            HrPartner?
  sessions             UserSession[]
  activityLogs         UserActivityLog[]
  notifications        Notification[]
  
  @@index([email])
  @@index([userType])
  @@index([status])
}
```

### 3.2 Update `hrPartners` Table

```prisma
model HrPartner {
  id                   String    @id @default(cuid())
  userId               String    @unique
  companyId            String
  
  firstName            String
  lastName             String
  jobTitle             String
  department           String?
  profilePhotoUrl      String?
  linkedinUrl          String?
  
  roleInPlatform       HrRole    @default(MEMBER)
  canCreateRoles       Boolean   @default(true)
  canSendIntroductions Boolean   @default(true)
  canManageBilling     Boolean   @default(false)
  
  // NEW: Dual-role support
  alsoProfessional     Boolean   @default(false)
  professionalId       String?   @unique
  
  status               HrStatus  @default(ACTIVE)
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  lastActiveAt         DateTime  @default(now())
  
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  company              Company   @relation(fields: [companyId], references: [id])
  professional         Professional? @relation(fields: [professionalId], references: [id])
  
  sentIntroductions    IntroductionRequest[] @relation("SentByHr")
  createdRoles         JobRole[]
  savedProfessionals   SavedProfessional[]
  profileViews         ProfileView[]
  searchQueries        SearchQuery[]
  
  @@index([userId])
  @@index([companyId])
  @@index([professionalId])
  @@index([roleInPlatform])
}
```

### 3.3 Update `professionals` Table

```prisma
model Professional {
  id                   String    @id @default(cuid())
  userId               String    @unique
  
  firstName            String
  lastName             String
  preferredName        String?
  profileHeadline      String?
  profileSummary       String?   @db.Text
  profilePhotoUrl      String?
  
  yearsOfExperience    Int
  currentTitle         String?
  currentCompany       String?
  currentIndustry      String?
  
  locationCity         String
  locationState        String
  willingToRelocate    Boolean   @default(false)
  
  salaryExpectationMin Int?
  salaryExpectationMax Int?
  noticePeriodDays     Int       @default(30)
  
  openToOpportunities  Boolean   @default(true)
  confidentialSearch   Boolean   @default(true)
  profileVisibility    ProfileVisibility @default(PRIVATE)
  
  verificationStatus   VerificationStatus @default(UNVERIFIED)
  verificationDate     DateTime?
  
  linkedinUrl          String?
  portfolioUrl         String?
  resumeUrl            String?
  
  // NEW: Dual-role support
  isAlsoHrPartner      Boolean   @default(false)
  hideFromCompanyIds   String[]  // Array of company IDs that cannot see this profile
  
  onboardingCompleted  Boolean   @default(false)
  profileCompleteness  Int       @default(0) @db.SmallInt
  
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt
  lastActiveAt         DateTime  @default(now())
  
  user                 User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  workHistory          ProfessionalWorkHistory[]
  education            ProfessionalEducation[]
  skills               ProfessionalSkill[]
  certifications       ProfessionalCertification[]
  references           ProfessionalReference[]
  introductionRequests IntroductionRequest[] @relation("ReceivedByProfessional")
  savedBy              SavedProfessional[]
  profileViews         ProfileView[] @relation("ViewedProfessional")
  hrPartnerLink        HrPartner?
  
  @@index([userId])
  @@index([locationCity, locationState])
  @@index([verificationStatus])
  @@index([profileVisibility])
  @@index([hideFromCompanyIds], type: Gin)
}
```

### 3.4 Create New `privacyFirewallLogs` Table

```prisma
model PrivacyFirewallLog {
  id               String    @id @default(cuid())
  eventType        FirewallEventType
  
  hrPartnerId      String?
  companyId        String?
  professionalId   String?
  
  actionTaken      String
  metadata         Json?
  
  createdAt        DateTime  @default(now())
  
  hrPartner        HrPartner?     @relation(fields: [hrPartnerId], references: [id])
  company          Company?       @relation(fields: [companyId], references: [id])
  professional     Professional?  @relation(fields: [professionalId], references: [id])
  
  @@index([professionalId])
  @@index([companyId])
  @@index([eventType])
  @@index([createdAt])
}

enum FirewallEventType {
  SEARCH_FILTERED
  INTRODUCTION_BLOCKED
  VIEW_BLOCKED
  BYPASS_ATTEMPT
  COMPANY_ADDED
  COMPANY_REMOVED
}
```

### 3.5 Create Migration Script

```sql
-- migrations/YYYYMMDD_add_dual_role_support.sql

-- Add dual-role fields to users
ALTER TABLE users ADD COLUMN has_dual_role BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN dual_role_enabled_at TIMESTAMP NULL;

-- Add dual-role fields to hr_partners
ALTER TABLE hr_partners ADD COLUMN also_professional BOOLEAN DEFAULT FALSE;
ALTER TABLE hr_partners ADD COLUMN professional_id UUID NULL;

-- Add foreign key constraint
ALTER TABLE hr_partners 
ADD CONSTRAINT fk_hr_also_professional 
FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE SET NULL;

-- Add index for quick lookup
CREATE INDEX idx_hr_partners_professional_id ON hr_partners(professional_id);

-- Add dual-role fields to professionals
ALTER TABLE professionals ADD COLUMN is_also_hr_partner BOOLEAN DEFAULT FALSE;
ALTER TABLE professionals ADD COLUMN hide_from_company_ids TEXT[] DEFAULT '{}';

-- Add GIN index for efficient array searches
CREATE INDEX idx_professionals_hide_from_companies 
ON professionals USING GIN (hide_from_company_ids);

-- Create privacy firewall logs table
CREATE TABLE privacy_firewall_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    hr_partner_id UUID REFERENCES hr_partners(id),
    company_id UUID REFERENCES companies(id),
    professional_id UUID REFERENCES professionals(id),
    action_taken VARCHAR(200) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for firewall logs
CREATE INDEX idx_firewall_logs_professional ON privacy_firewall_logs(professional_id);
CREATE INDEX idx_firewall_logs_company ON privacy_firewall_logs(company_id);
CREATE INDEX idx_firewall_logs_event_type ON privacy_firewall_logs(event_type);
CREATE INDEX idx_firewall_logs_created_at ON privacy_firewall_logs(created_at);

-- Add comments for documentation
COMMENT ON COLUMN professionals.hide_from_company_ids IS 'Array of company IDs that should never see this professional profile';
COMMENT ON COLUMN hr_partners.also_professional IS 'Whether this HR partner also has a confidential professional profile';
COMMENT ON TABLE privacy_firewall_logs IS 'Audit trail for all privacy firewall events';
```

---

## 4. Backend API Implementation

### 4.1 Core Firewall Service

Create `lib/services/privacyFirewall.ts`:

```typescript
import { prisma } from '@/lib/prisma';
import { FirewallEventType } from '@prisma/client';

export class PrivacyFirewallService {
  /**
   * Check if a professional profile should be hidden from a company
   */
  static async isProfileHidden(
    professionalId: string,
    companyId: string
  ): Promise<boolean> {
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      select: {
        hideFromCompanyIds: true,
        isAlsoHrPartner: true,
      },
    });

    if (!professional) return false;

    // Check if company is in the blocked list
    if (professional.hideFromCompanyIds.includes(companyId)) {
      return true;
    }

    // Check if professional is an active HR partner at this company
    if (professional.isAlsoHrPartner) {
      const hrPartner = await prisma.hrPartner.findFirst({
        where: {
          professionalId,
          companyId,
          status: 'ACTIVE',
        },
      });

      if (hrPartner) {
        return true;
      }
    }

    return false;
  }

  /**
   * Filter search results to remove hidden profiles
   */
  static async filterSearchResults(
    professionalIds: string[],
    companyId: string
  ): Promise<string[]> {
    const visibleIds: string[] = [];

  static async filterSearchResults(
    professionalIds: string[],
    companyId: string
  ): Promise<string[]> {
    // Single batch query instead of looping
    const hiddenProfessionals = await prisma.professional.findMany({
      where: {
        id: { in: professionalIds },
        hideFromCompanyIds: {
          has: companyId,
        },
      },
      select: { id: true },
    });

    const hiddenIds = new Set(hiddenProfessionals.map(p => p.id));

    // Log all filtered events in batch
    const hiddenProfIds = professionalIds.filter(id => hiddenIds.has(id));
    if (hiddenProfIds.length > 0) {
      await prisma.privacyFirewallLog.createMany({
        data: hiddenProfIds.map(professionalId => ({
          eventType: 'SEARCH_FILTERED',
          professionalId,
          companyId,
          actionTaken: 'profile_hidden_from_search',
        })),
      });
    }

    return professionalIds.filter(id => !hiddenIds.has(id));
  }

    return visibleIds;
  }

  /**
   * Block introduction request if firewall violation
   */
  static async validateIntroductionRequest(
    hrPartnerId: string,
    professionalId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    const hrPartner = await prisma.hrPartner.findUnique({
      where: { id: hrPartnerId },
      select: { companyId: true },
    });

    if (!hrPartner) {
      return { allowed: false, reason: 'HR partner not found' };
    }

    const isHidden = await this.isProfileHidden(
      professionalId,
      hrPartner.companyId
    );

    if (isHidden) {
      // Log bypass attempt
      await this.logFirewallEvent({
        eventType: 'INTRODUCTION_BLOCKED',
        hrPartnerId,
        professionalId,
        companyId: hrPartner.companyId,
        actionTaken: 'introduction_request_blocked',
        metadata: {
          attemptedAt: new Date().toISOString(),
          severity: 'HIGH',
        },
      });

      return {
        allowed: false,
        reason: 'This professional is not visible to your company',
      };
    }

    return { allowed: true };
  }

  /**
   * Block profile view if firewall violation
   */
  static async validateProfileView(
    hrPartnerId: string,
    professionalId: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    const hrPartner = await prisma.hrPartner.findUnique({
      where: { id: hrPartnerId },
      select: { companyId: true },
    });

    if (!hrPartner) {
      return { allowed: false, reason: 'HR partner not found' };
    }

    const isHidden = await this.isProfileHidden(
      professionalId,
      hrPartner.companyId
    );

    if (isHidden) {
      // Log bypass attempt - this is serious
      await this.logFirewallEvent({
        eventType: 'BYPASS_ATTEMPT',
        hrPartnerId,
        professionalId,
        companyId: hrPartner.companyId,
        actionTaken: 'view_blocked',
        metadata: {
          attemptedAt: new Date().toISOString(),
          severity: 'CRITICAL',
          userAgent: 'tracked_separately',
        },
      });

      return {
        allowed: false,
        reason: 'Access denied',
      };
    }

    return { allowed: true };
  }

  /**
   * Log firewall event for audit trail
   */
  static async logFirewallEvent(data: {
    eventType: FirewallEventType;
    hrPartnerId?: string;
    professionalId?: string;
    companyId?: string;
    actionTaken: string;
    metadata?: Record<string, any>;
  }) {
    await prisma.privacyFirewallLog.create({
      data: {
        eventType: data.eventType,
        hrPartnerId: data.hrPartnerId,
        professionalId: data.professionalId,
        companyId: data.companyId,
        actionTaken: data.actionTaken,
        metadata: data.metadata,
      },
    });
  }

  /**
   * Get firewall logs for a professional (for their privacy dashboard)
   */
  static async getFirewallLogsForProfessional(
    professionalId: string,
    limit: number = 50
  ) {
    return await prisma.privacyFirewallLog.findMany({
      where: { professionalId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
          },
        },
      },
    });
  }

  /**
   * Add company to professional's block list
   */
  static async addCompanyToBlockList(
    professionalId: string,
    companyId: string
  ) {
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      select: { hideFromCompanyIds: true },
    });

    if (!professional) {
      throw new Error('Professional not found');
    }

    if (professional.hideFromCompanyIds.includes(companyId)) {
      return; // Already blocked
    }

    await prisma.professional.update({
      where: { id: professionalId },
      data: {
        hideFromCompanyIds: {
          push: companyId,
        },
      },
    });

    await this.logFirewallEvent({
      eventType: 'COMPANY_ADDED',
      professionalId,
      companyId,
      actionTaken: 'company_added_to_block_list',
    });
  }

  /**
   * Remove company from professional's block list
   */
  static async removeCompanyFromBlockList(
    professionalId: string,
    companyId: string
  ) {
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      select: { hideFromCompanyIds: true },
    });

    if (!professional) {
      throw new Error('Professional not found');
    }

    const updatedList = professional.hideFromCompanyIds.filter(
      (id) => id !== companyId
    );

    await prisma.professional.update({
      where: { id: professionalId },
      data: {
        hideFromCompanyIds: updatedList,
      },
    });

    await this.logFirewallEvent({
      eventType: 'COMPANY_REMOVED',
      professionalId,
      companyId,
      actionTaken: 'company_removed_from_block_list',
    });
  }
}
```

### 4.2 Dual-Role Service

Create `lib/services/dualRole.ts`:

```typescript
import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs';
import { PrivacyFirewallService } from './privacyFirewall';

export class DualRoleService {
  /**
   * Activate dual-role for an HR partner
   */
  static async activateDualRole(
    userId: string,
    professionalData: {
      firstName: string;
      lastName: string;
      profileHeadline: string;
      locationCity: string;
      locationState: string;
      yearsOfExperience: number;
      currentTitle: string;
      currentIndustry: string;
      salaryExpectationMin?: number;
      salaryExpectationMax?: number;
      linkedinUrl?: string;
    }
  ) {
    // Get HR partner record
    const hrPartner = await prisma.hrPartner.findUnique({
      where: { userId },
      include: { company: true },
    });

    if (!hrPartner) {
      throw new Error('HR Partner not found');
    }

    if (hrPartner.alsoProfessional) {
      throw new Error('Dual role already activated');
    }

    // Create professional profile
    const existingProfessional = await prisma.professional.findUnique({
      where: { userId },
    });

    if (existingProfessional) {
      // If professional profile already exists, update it instead
      return await prisma.professional.update({
       where: { id: existingProfessional.id },
       data: {
         isAlsoHrPartner: true,
         hideFromCompanyIds: {
           set: [...new Set([...existingProfessional.hideFromCompanyIds, hrPartner.companyId])],
         },
         confidentialSearch: true,
         profileVisibility: 'PRIVATE',
       },
      });
    }

    const professional = await prisma.professional.create({
      data: {
        userId,
        ...professionalData,
        isAlsoHrPartner: true,
        // CRITICAL: Validate company exists before blocking
        hideFromCompanyIds: hrPartner.companyId ? [hrPartner.companyId] : [],
        confidentialSearch: true, // Force confidential mode
        profileVisibility: 'PRIVATE', // Default to private
        openToOpportunities: true,
      },
    });

    if (!hrPartner.companyId) {
     throw new Error('HR partner has no associated company. Cannot activate dual role safely.');
    }

    // Link to HR partner
    await prisma.hrPartner.update({
      where: { id: hrPartner.id },
      data: {
        alsoProfessional: true,
        professionalId: professional.id,
      },
    });

    // Update user record
    await prisma.user.update({
      where: { id: userId },
      data: {
        hasDualRole: true,
        dualRoleEnabledAt: new Date(),
      },
    });

    // Update Clerk metadata
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        hasDualRole: true,
      },
    });

    // Log the activation
    await PrivacyFirewallService.logFirewallEvent({
      eventType: 'COMPANY_ADDED',
      professionalId: professional.id,
      companyId: hrPartner.companyId,
      actionTaken: 'dual_role_activated',
      metadata: {
        hrPartnerId: hrPartner.id,
        companyName: hrPartner.company.companyName,
      },
    });

    return professional;
  }

  /**
   * Deactivate dual-role (keep profile but mark inactive)
   */
  static async deactivateDualRole(userId: string) {
    const hrPartner = await prisma.hrPartner.findUnique({
      where: { userId },
    });

    if (!hrPartner || !hrPartner.alsoProfessional) {
      throw new Error('Dual role not active');
    }

    // Mark professional profile as not open to opportunities
    await prisma.professional.update({
      where: { id: hrPartner.professionalId! },
      data: {
        openToOpportunities: false,
        profileVisibility: 'PRIVATE',
      },
    });

    return { success: true };
  }

  /**
   * Handle HR partner leaving a company
   */
  static async handleCompanyDeparture(hrPartnerId: string) {
    const hrPartner = await prisma.hrPartner.findUnique({
      where: { id: hrPartnerId },
      include: { professional: true },
    });

    if (!hrPartner) {
      throw new Error('HR Partner not found');
    }

    // Mark HR partner as inactive
    await prisma.hrPartner.update({
      where: { id: hrPartnerId },
      data: { status: 'INACTIVE' },
    });

    // If they have a professional profile, remove old company from block list
    if (hrPartner.professional) {
      await PrivacyFirewallService.removeCompanyFromBlockList(
        hrPartner.professional.id,
        hrPartner.companyId
      );
    }
  }

  /**
   * Handle HR partner joining a new company
   */
  static async handleCompanyJoin(hrPartnerId: string, newCompanyId: string) {
    const hrPartner = await prisma.hrPartner.findUnique({
      where: { id: hrPartnerId },
      include: { professional: true },
    });

    if (!hrPartner) {
      throw new Error('HR Partner not found');
    }

    // Update company
    await prisma.hrPartner.update({
      where: { id: hrPartnerId },
      data: {
        companyId: newCompanyId,
        status: 'ACTIVE',
      },
    });

    // If they have a professional profile, add new company to block list
    if (hrPartner.professional) {
      await PrivacyFirewallService.addCompanyToBlockList(
        hrPartner.professional.id,
        newCompanyId
      );
    }
  }

  /**
   * Get dual-role status for a user
   */
  static async getDualRoleStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        hrPartner: {
          include: {
            company: true,
            professional: true,
          },
        },
        professional: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      hasDualRole: user.hasDualRole,
      dualRoleEnabledAt: user.dualRoleEnabledAt,
      hrPartner: user.hrPartner,
      professional: user.professional,
      blockedCompanies: user.professional?.hideFromCompanyIds || [],
    };
  }
}
```

### 4.3 API Routes

#### 4.3.1 Activate Dual Role

Create `app/api/dual-role/activate/route.ts`:

```typescript
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { DualRoleService } from '@/lib/services/dualRole';
import { z } from 'zod';

const activateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  profileHeadline: z.string().min(10).max(200),
  locationCity: z.string().min(1),
  locationState: z.string().min(1),
  yearsOfExperience: z.number().min(5),
  currentTitle: z.string().min(1),
  currentIndustry: z.string().min(1),
  salaryExpectationMin: z.number().optional(),
  salaryExpectationMax: z.number().optional(),
  linkedinUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = activateSchema.parse(body);

    const professional = await DualRoleService.activateDualRole(
      userId,
      validatedData
    );

    return NextResponse.json({
      success: true,
      professional,
      message: 'Dual role activated successfully',
    });
  } catch (error: any) {
    console.error('Error activating dual role:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to activate dual role' },
      { status: 500 }
    );
  }
}
```

#### 4.3.2 Get Dual Role Status

Create `app/api/dual-role/status/route.ts`:

```typescript
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { DualRoleService } from '@/lib/services/dualRole';
import { PrivacyFirewallService } from '@/lib/services/privacyFirewall';

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = await DualRoleService.getDualRoleStatus(userId);

    // Get recent firewall logs
    let firewallLogs = [];
    if (status.professional) {
      firewallLogs = await PrivacyFirewallService.getFirewallLogsForProfessional(
        status.professional.id,
        20
      );
    }

    return NextResponse.json({
      ...status,
      firewallLogs,
    });
  } catch (error: any) {
    console.error('Error getting dual role status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get status' },
      { status: 500 }
    );
  }
}
```

#### 4.3.3 Deactivate Dual Role

Create `app/api/dual-role/deactivate/route.ts`:

```typescript
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { DualRoleService } from '@/lib/services/dualRole';

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await DualRoleService.deactivateDualRole(userId);

    return NextResponse.json({
      success: true,
      message: 'Professional profile deactivated',
    });
  } catch (error: any) {
    console.error('Error deactivating dual role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to deactivate' },
      { status: 500 }
    );
  }
}
```

#### 4.3.4 Manage Block List

Create `app/api/dual-role/block-list/route.ts`:

```typescript
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { PrivacyFirewallService } from '@/lib/services/privacyFirewall';
import { prisma } from '@/lib/prisma';

// Add company to block list
export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId } = await req.json();

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 400 }
      );
    }

    // Get professional profile
    const professional = await prisma.professional.findUnique({
      where: { userId },
    });

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional profile not found' },
        { status: 404 }
      );
    }

    await PrivacyFirewallService.addCompanyToBlockList(
      professional.id,
      companyId
    );

    return NextResponse.json({
      success: true,
      message: 'Company added to block list',
    });
  } catch (error: any) {
    console.error('Error adding to block list:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add company' },
      { status: 500 }
    );
  }
}

// Remove company from block list
export async function DELETE(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID required' },
        { status: 400 }
      );
    }

    // Get professional profile
    const professional = await prisma.professional.findUnique({
      where: { userId },
    });

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional profile not found' },
        { status: 404 }
      );
    }

    await PrivacyFirewallService.removeCompanyFromBlockList(
      professional.id,
      companyId
    );

    return NextResponse.json({
      success: true,
      message: 'Company removed from block list',
    });
  } catch (error: any) {
    console.error('Error removing from block list:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove company' },
      { status: 500 }
    );
  }
}
```

#### 4.3.5 Update Search API to Use Firewall

Update `app/api/professionals/search/route.ts`:

```typescript
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivacyFirewallService } from '@/lib/services/privacyFirewall';

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get HR partner making the search
    const hrPartner = await prisma.hrPartner.findUnique({
      where: { userId },
      select: { companyId: true },
    });

    if (!hrPartner) {
      return NextResponse.json(
        { error: 'HR Partner not found' },
        { status: 403 }
      );
    }

    const searchCriteria = await req.json();

    // Perform search
    const professionals = await prisma.professional.findMany({
      where: {
        ...searchCriteria,
        openToOpportunities: true,
        // CRITICAL: Filter out professionals hiding from this company
        NOT: {
          hideFromCompanyIds: {
            has: hrPartner.companyId,
          },
        },
      },
      include: {
        skills: true,
        workHistory: {
          where: { isCurrent: true },
          take: 1,
        },
      },
    });

    // Additional firewall check (belt and suspenders approach)
    const professionalIds = professionals.map(p => p.id);
    const visibleIds = await PrivacyFirewallService.filterSearchResults(
      professionalIds,
      hrPartner.companyId
    );

    const filteredProfessionals = professionals.filter(p =>
      visibleIds.includes(p.id)
    );

    return NextResponse.json({
      professionals: filteredProfessionals,
      total: filteredProfessionals.length,
    });
  } catch (error: any) {
    console.error('Error searching professionals:', error);
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}
```

#### 4.3.6 Update Introduction Request API

Update `app/api/introductions/request/route.ts`:

```typescript
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivacyFirewallService } from '@/lib/services/privacyFirewall';

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hrPartner = await prisma.hrPartner.findUnique({
      where: { userId },
    });

    if (!hrPartner) {
      return NextResponse.json(
        { error: 'HR Partner not found' },
        { status: 403 }
      );
    }

    const { professionalId, jobRoleId, personalizedMessage } = await req.json();

    // CRITICAL: Validate against firewall
    const validation = await PrivacyFirewallService.validateIntroductionRequest(
      hrPartner.id,
      professionalId
    );

    if (!validation.allowed) {
      return NextResponse.json(
        { error: validation.reason || 'Introduction request blocked' },
        { status: 403 }
      );
    }

    // Check for existing pending request
    const existingRequest = await prisma.introductionRequest.findFirst({
      where: {
        jobRoleId,
        sentToProfessionalId: professionalId,
        status: 'PENDING',
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Introduction request already pending' },
        { status: 400 }
      );
    }

    // Create introduction request
    const introRequest = await prisma.introductionRequest.create({
      data: {
        jobRoleId,
        companyId: hrPartner.companyId,
        sentByHrId: hrPartner.id,
        sentToProfessionalId: professionalId,
        personalizedMessage,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        jobRole: true,
        company: true,
        professional: true,
      },
    });

    // Send notification to professional
    // ... notification logic ...

    return NextResponse.json({
      success: true,
      introductionRequest: introRequest,
    });
  } catch (error: any) {
    console.error('Error creating introduction request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send request' },
      { status: 500 }
    );
  }
}
```

#### 4.3.7 Update Profile View API

Create `app/api/professionals/[id]/view/route.ts`:

```typescript
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivacyFirewallService } from '@/lib/services/privacyFirewall';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const professionalId = params.id;

    // Get HR partner making the request
    const hrPartner = await prisma.hrPartner.findUnique({
      where: { userId },
    });

    if (!hrPartner) {
      return NextResponse.json(
        { error: 'HR Partner not found' },
        { status: 403 }
      );
    }

    // CRITICAL: Validate against firewall
    const validation = await PrivacyFirewallService.validateProfileView(
      hrPartner.id,
      professionalId
    );

    if (!validation.allowed) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get professional profile
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      include: {
        workHistory: {
          orderBy: { startDate: 'desc' },
        },
        education: {
          orderBy: { endYear: 'desc' },
        },
        skills: true,
        certifications: true,
      },
    });

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional not found' },
        { status: 404 }
      );
    }

    // Record profile view
    await prisma.profileView.create({
      data: {
        viewerHrId: hrPartner.id,
        viewedProfessionalId: professionalId,
        viewSource: 'DIRECT',
      },
    });

    return NextResponse.json({ professional });
  } catch (error: any) {
    console.error('Error viewing profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to view profile' },
      { status: 500 }
    );
  }
}
```

---

## 5. Privacy Firewall Logic

### 5.1 Firewall Rules Summary

Implement these rules **strictly and consistently**:

1. **Search Filter Rule**: HR searches automatically exclude professionals hiding from their company
2. **Introduction Block Rule**: System blocks introduction requests to hidden professionals
3. **View Block Rule**: Direct profile views are denied for hidden professionals
4. **Bypass Detection Rule**: Log all attempts to circumvent firewall
5. **Company Change Rule**: Automatically update block list when HR changes companies

### 5.2 Database Query Patterns

**Pattern 1: Safe Search Query**
```typescript
// Always use this pattern for professional searches
const professionals = await prisma.professional.findMany({
  where: {
    ...searchCriteria,
    NOT: {
      hideFromCompanyIds: {
        has: companyId, // PostgreSQL array contains operator
      },
    },
  },
});
```

**Pattern 2: Existence Check**
```typescript
// Check if professional is hiding from company
const isHidden = await prisma.professional.findFirst({
  where: {
    id: professionalId,
    hideFromCompanyIds: {
      has: companyId,
    },
  },
  select: { id: true },
});

if (isHidden) {
  throw new Error('ACCESS_DENIED');
}
```

**Pattern 3: Batch Filter**
```typescript
// Filter multiple professional IDs
const visibleProfessionals = await prisma.professional.findMany({
  where: {
    id: { in: professionalIds },
    NOT: {
      hideFromCompanyIds: {
        has: companyId,
      },
    },
  },
});
```

---

## 6. Frontend Components

### 6.1 Role Switcher Component

Create `components/RoleSwitcher.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';

type ActiveRole = 'hr' | 'professional';

export default function RoleSwitcher() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<ActiveRole>('hr');
  const [loading, setLoading] = useState(false);

  const hasDualRole = user?.publicMetadata?.hasDualRole as boolean;

  useEffect(() => {
    // Detect current role from pathname
    if (pathname.startsWith('/professional')) {
      setActiveRole('professional');
    } else if (pathname.startsWith('/hr') || pathname.startsWith('/dashboard')) {
      setActiveRole('hr');
    }
  }, [pathname]);

  const handleRoleSwitch = async (role: ActiveRole) => {
    if (role === activeRole) return;

    setLoading(true);

    try {
      // Store active role preference
      await fetch('/api/users/active-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeRole: role }),
      });

      // Navigate to appropriate dashboard
      if (role === 'hr') {
        router.push('/dashboard');
      } else {
        router.push('/professional/dashboard');
      }

      setActiveRole(role);
    } catch (error) {
      console.error('Error switching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasDualRole) return null;

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
      <button
        onClick={() => handleRoleSwitch('hr')}
        disabled={loading}
        className={`px-4 py-2 rounded-full transition-all duration-200 ${
          activeRole === 'hr'
            ? 'bg-[#0A2540] text-white shadow-md'
            : 'bg-transparent text-gray-600 hover:text-gray-900'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="flex items-center gap-2">
          <span>🏢</span>
          <span className="font-semibold">HR Mode</span>
        </span>
      </button>
      <button
        onClick={() => handleRoleSwitch('professional')}
        disabled={loading}
        className={`px-4 py-2 rounded-full transition-all duration-200 ${
          activeRole === 'professional'
            ? 'bg-[#2E8B57] text-white shadow-md'
            : 'bg-transparent text-gray-600 hover:text-gray-900'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="flex items-center gap-2">
          <span>👤</span>
          <span className="font-semibold">Job Seeking</span>
        </span>
      </button>
    </div>
  );
}
```

### 6.2 Dual Role Activation Component

Create `components/onboarding/DualRoleActivation.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DualRoleActivationProps {
  onComplete: () => void;
}

export default function DualRoleActivation({ onComplete }: DualRoleActivationProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [wantsToActivate, setWantsToActivate] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profileHeadline: '',
    locationCity: '',
    locationState: '',
    yearsOfExperience: 5,
    currentTitle: '',
    currentIndustry: '',
    salaryExpectationMin: '',
    salaryExpectationMax: '',
    linkedinUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wantsToActivate) {
      onComplete();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/dual-role/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          yearsOfExperience: parseInt(formData.yearsOfExperience as any),
          salaryExpectationMin: formData.salaryExpectationMin ? parseInt(formData.salaryExpectationMin) : undefined,
          salaryExpectationMax: formData.salaryExpectationMax ? parseInt(formData.salaryExpectationMax) : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to activate dual role');
      }

      // Success - redirect to professional dashboard
      router.push('/professional/dashboard?setup=complete');
    } catch (error: any) {
      console.error('Error activating dual role:', error);
      alert(error.message || 'Failed to activate dual role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#0A2540] mb-6">
        One More Thing...
      </h2>

      {/* Opt-in Question */}
      <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            id="dual-role-opt-in"
            checked={wantsToActivate}
            onChange={(e) => setWantsToActivate(e.target.checked)}
            className="mt-1 w-5 h-5 text-[#2E8B57] rounded focus:ring-[#2E8B57]"
          />
          <div className="flex-1">
            <label
              htmlFor="dual-role-opt-in"
              className="font-semibold text-[#0A2540] cursor-pointer text-lg"
            >
              I'm also open to exploring new opportunities
            </label>
            <p className="text-gray-600 mt-2">
              Activate a separate, confidential professional profile to receive introduction 
              requests from other companies.{' '}
              <strong className="text-[#2E8B57]">
                Your company will never see this profile.
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Conditional Form */}
      {wantsToActivate && (
        <form onSubmit={handleSubmit} className="space-y-6 mt-8 p-6 bg-green-50 border-2 border-[#2E8B57] rounded-lg">
          <h3 className="text-xl font-bold text-[#0A2540] mb-4">
            Set Up Your Confidential Job Search Profile
          </h3>

          {/* Privacy Guarantee Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">
                  🔒 Privacy Guarantee
                </h4>
                <p className="mt-1 text-sm text-blue-700">
                  Your professional profile is completely separate from your HR role. 
                  Your company <strong>cannot see it</strong>, search for it, or receive 
                  any alerts about it.
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0A2540] mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A2540] mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A2540] mb-2">
              Professional Headline *
            </label>
            <input
              type="text"
              name="profileHeadline"
              value={formData.profileHeadline}
              onChange={handleChange}
              placeholder="e.g., Senior HR Manager | 8+ Years Experience"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0A2540] mb-2">
                City *
              </label>
              <select
                name="locationCity"
                value={formData.locationCity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              >
                <option value="">Select city</option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Port Harcourt">Port Harcourt</option>
                <option value="Kano">Kano</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A2540] mb-2">
                State *
              </label>
              <select
                name="locationState"
                value={formData.locationState}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              >
                <option value="">Select state</option>
                <option value="Lagos">Lagos</option>
                <option value="FCT">FCT (Abuja)</option>
                <option value="Rivers">Rivers</option>
                <option value="Kano">Kano</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#0A2540] mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                min="5"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0A2540] mb-2">
                Current Title *
              </label>
              <input
                type="text"
                name="currentTitle"
                value={formData.currentTitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A2540] mb-2">
              Industry *
            </label>
            <select
              name="currentIndustry"
              value={formData.currentIndustry}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
            >
              <option value="">Select industry</option>
              <option value="Financial Services">Financial Services</option>
              <option value="Technology">Technology</option>
              <option value="Oil & Gas">Oil & Gas</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A2540] mb-2">
              Expected Salary Range (Annual, Naira)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="salaryExpectationMin"
                value={formData.salaryExpectationMin}
                onChange={handleChange}
                placeholder="Minimum (e.g., 8000000)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              />
              <input
                type="number"
                name="salaryExpectationMax"
                value={formData.salaryExpectationMax}
                onChange={handleChange}
                placeholder="Maximum (e.g., 15000000)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0A2540] mb-2">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E8B57] text-white py-3 rounded-lg font-semibold hover:bg-[#1F5F3F] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Activating...' : 'Activate Dual Role'}
          </button>
        </form>
      )}

      {/* Skip Button */}
      {!wantsToActivate && (
        <div className="text-center mt-6">
          <button
            onClick={onComplete}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Skip for now →
          </button>
        </div>
      )}
    </div>
  );
}
```

### 6.3 Privacy Dashboard Component

Create `components/professional/PrivacyDashboard.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Shield, Eye, Ban, AlertTriangle } from 'lucide-react';

interface FirewallLog {
  id: string;
  eventType: string;
  actionTaken: string;
  createdAt: string;
  company?: {
    companyName: string;
  };
}

interface PrivacyStatus {
  hasDualRole: boolean;
  blockedCompanies: Array<{ id: string; companyName: string }>;
  firewallLogs: FirewallLog[];
}

export default function PrivacyDashboard() {
  const [status, setStatus] = useState<PrivacyStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyStatus();
  }, []);

  const fetchPrivacyStatus = async () => {
    try {
      const response = await fetch('/api/dual-role/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching privacy status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading privacy dashboard...</div>;
  }

  if (!status?.hasDualRole) {
    return null;
  }

  const recentBlocks = status.firewallLogs.filter(
    log => log.eventType === 'SEARCH_FILTERED' || log.eventType === 'INTRODUCTION_BLOCKED'
  );

  const bypassAttempts = status.firewallLogs.filter(
    log => log.eventType === 'BYPASS_ATTEMPT'
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-[#2E8B57]" />
          <h2 className="text-xl font-bold text-[#0A2540]">
            Privacy Firewall Status
          </h2>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">
            🔒 Your Job Search is Protected
          </h3>
          <ul className="space-y-2 text-sm text-green-800">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              {recentBlocks.length} search results filtered in the last 7 days
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Automatic protection - no action required
            </li>
          </ul>
        </div>
      </div>

      {/* Blocked Companies */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Ban className="w-6 h-6 text-[#0A2540]" />
          <h2 className="text-xl font-bold text-[#0A2540]">
            Blocked Companies ({status.blockedCompanies.length})
          </h2>
        </div>

        <div className="space-y-3">
          {status.blockedCompanies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-semibold text-[#0A2540]">{company.companyName}</p>
                <p className="text-sm text-gray-600">Your current/former employer</p>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Protected
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-6 h-6 text-[#0A2540]" />
          <h2 className="text-xl font-bold text-[#0A2540]">
            Recent Firewall Activity
          </h2>
        </div>

        {recentBlocks.length === 0 ? (
          <p className="text-gray-600">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentBlocks.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0A2540]">
                    {log.actionTaken.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(log.createdAt).toLocaleString()} • {log.company?.companyName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bypass Attempts Warning */}
      {bypassAttempts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">
                Blocked Access Attempts Detected
              </h3>
              <p className="text-sm text-red-800 mb-3">
                We detected {bypassAttempts.length} attempt(s) to access your profile from 
                blocked companies. Your privacy was protected.
              </p>
              <button className="text-sm text-red-700 underline hover:text-red-900">
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 6.4 Dual Role Settings Page

Create `app/settings/dual-role/page.tsx`:

```typescript
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import PrivacyDashboard from '@/components/professional/PrivacyDashboard';
import DualRoleSettings from '@/components/settings/DualRoleSettings';

export default async function DualRoleSettingsPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const hasDualRole = user.publicMetadata?.hasDualRole as boolean;

  if (!hasDualRole) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#0A2540] mb-8">
          Dual Role Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <DualRoleSettings />
          </div>
          <div>
            <PrivacyDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
```

Create `components/settings/DualRoleSettings.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Switch } from '@headlessui/react';

export default function DualRoleSettings() {
  const [professionalProfileActive, setProfessionalProfileActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    
    try {
      const endpoint = professionalProfileActive 
        ? '/api/dual-role/deactivate' 
        : '/api/dual-role/activate';
      
      const response = await fetch(endpoint, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle profile');
      }

      setProfessionalProfileActive(!professionalProfileActive);
    } catch (error) {
      console.error('Error toggling profile:', error);
      alert('Failed to update profile status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Status Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[#0A2540]">
              Professional Profile
            </h2>
            <p className="text-sm text-gray-600">
              Your confidential job search profile
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            professionalProfileActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {professionalProfileActive ? 'Active' : 'Inactive'}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <p className="font-medium text-[#0A2540]">
              Accept Introduction Requests
            </p>
            <p className="text-sm text-gray-600">
              Allow companies to send you opportunities
            </p>
          </div>
          <Switch
            checked={professionalProfileActive}
            onChange={handleToggle}
            disabled={loading}
            className={`${
              professionalProfileActive ? 'bg-[#2E8B57]' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span
              className={`${
                professionalProfileActive ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            ℹ️ How it works
          </h3>
          <p className="text-sm text-blue-800">
            When active, companies outside your blocked list can discover your profile 
            and send introduction requests. You maintain full control over which 
            opportunities to explore.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">
            🔒 Privacy guaranteed
          </h3>
          <p className="text-sm text-green-800">
            Your current employer will never see your professional profile, search 
            activity, or that you're open to opportunities. This firewall is automatic 
            and permanent.
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow p-6 border-2 border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-4">
          Danger Zone
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 mb-3">
              Permanently delete your professional profile and all associated data. 
              This action cannot be undone.
            </p>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              onClick={() => {
                if (confirm('Are you sure? This cannot be undone.')) {
                  // Handle deletion
                }
              }}
            >
              Delete Professional Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 7. User Flows

### 7.1 HR Partner Onboarding with Dual Role Activation

**Flow Steps:**

1. **Step 1: Personal Information**
   - First name, last name
   - Job title, department
   - LinkedIn URL

2. **Step 2: Company Information**
   - Company name, industry, size
   - Company website, description
   - Headquarters location

3. **Step 3: Hiring Plans**
   - Timeline, roles planning
   - Team size

4. **Step 4: Dual Role Opt-In (NEW)**
   - Checkbox: "I'm also open to exploring new opportunities"
   - If checked, show professional profile form
   - If unchecked, complete onboarding normally

5. **Step 5: Professional Profile Setup (Conditional)**
   - Only shown if dual role activated
   - Basic info, salary expectations, skills
   - Privacy guarantee banner displayed prominently

6. **Completion**
   - If dual role: Redirect to role switcher tutorial
   - If single role: Redirect to HR dashboard

### 7.2 Searching for Candidates (HR Partner)

**Flow Steps:**

1. HR partner enters search criteria
2. Backend queries professionals table
3. **FIREWALL CHECK**: Exclude professionals with `hideFromCompanyIds` containing HR's company
4. Return filtered results
5. Log search event with count of filtered profiles
6. Display results to HR partner

**Error Cases:**
- If HR tries to view blocked profile directly: 403 Access Denied
- If HR tries to send introduction to blocked profile: 403 Request Blocked

### 7.3 Receiving Introduction Request (Professional with Dual Role)

**Flow Steps:**

1. Professional receives email/WhatsApp notification
2. Professional logs in (role switcher shows)
3. Switch to "Job Seeking Mode"
4. View introduction request details
5. Accept or decline with optional message
6. If accepted: Contact details exchanged
7. Continue conversation in messaging

### 7.4 Changing Companies (HR Partner)

**Flow Steps:**

1. HR partner leaves Company A
2. Admin/system marks HR partner status as INACTIVE at Company A
3. **FIREWALL UPDATE**: Remove Company A from professional's `hideFromCompanyIds`
4. Send notification to professional about firewall update
5. HR partner joins Company B
6. Admin/system creates new HR partner record or updates existing
7. **FIREWALL UPDATE**: Add Company B to professional's `hideFromCompanyIds`
8. Send notification to professional about new firewall rule

---

## 8. Testing Requirements

### 8.1 Unit Tests

Create `tests/services/privacyFirewall.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { afterEach } from 'vitest';
import { PrivacyFirewallService } from '@/lib/services/privacyFirewall';
import { prisma } from '@/lib/prisma';

describe('PrivacyFirewallService', () => {
  let testProfessionalId: string;
  let testCompanyId: string;
  let testHrPartnerId: string;
  let testUserId: string;

  beforeEach(async () => {
    // Setup test data
    const company = await prisma.company.create({
      data: {
        companyName: 'Test Company',
        industry: 'Technology',
        companySize: '51-200',
        headquartersLocation: 'Lagos',
      },
    });
    testCompanyId = company.id;

    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hash',
        userType: 'HR_PARTNER',
        hasDualRole: true,
      },
    });

    const professional = await prisma.professional.create({
      data: {
        userId: user.id,
        firstName: 'Test',
        lastName: 'Professional',
        locationCity: 'Lagos',
        locationState: 'Lagos',
        yearsOfExperience: 8,
        isAlsoHrPartner: true,
        hideFromCompanyIds: [testCompanyId],
      },
    });
    testProfessionalId = professional.id;

    const hrPartner = await prisma.hrPartner.create({
      data: {
        userId: user.id,
        companyId: testCompanyId,
        firstName: 'Test',
        lastName: 'HR',
        jobTitle: 'HR Manager',
        alsoProfessional: true,
        professionalId: professional.id,
      },
    });
    testUserId = user.id;
    testHrPartnerId = hrPartner.id;
  });

  afterEach(async () => {
    // Clean up in reverse dependency order
    await prisma.privacyFirewallLog.deleteMany({});
    await prisma.professional.deleteMany({});
    await prisma.hrPartner.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.company.deleteMany({});
  });

  describe('isProfileHidden', () => {
    it('should return true when company is in hideFromCompanyIds', async () => {
      const isHidden = await PrivacyFirewallService.isProfileHidden(
        testProfessionalId,
        testCompanyId
      );
      expect(isHidden).toBe(true);
    });

    it('should return false when company is not in hideFromCompanyIds', async () => {
      const otherCompanyId = 'other-company-id';
      const isHidden = await PrivacyFirewallService.isProfileHidden(
        testProfessionalId,
        otherCompanyId
      );
      expect(isHidden).toBe(false);
    });
  });

  describe('validateIntroductionRequest', () => {
    it('should block introduction request to hidden profile', async () => {
      const validation = await PrivacyFirewallService.validateIntroductionRequest(
        testHrPartnerId,
        testProfessionalId
      );
      
      expect(validation.allowed).toBe(false);
      expect(validation.reason).toContain('not visible');
    });

    it('should allow introduction request to visible profile', async () => {
      // Create another professional not hidden from company
      const user2 = await prisma.user.create({
        data: {
          email: 'test2@example.com',
          passwordHash: 'hash',
          userType: 'PROFESSIONAL',
        },
      });

      const professional2 = await prisma.professional.create({
        data: {
          userId: user2.id,
          firstName: 'Test2',
          lastName: 'Professional2',
          locationCity: 'Lagos',
          locationState: 'Lagos',
          yearsOfExperience: 10,
          hideFromCompanyIds: [], // Not hiding from any company
        },
      });

      const validation = await PrivacyFirewallService.validateIntroductionRequest(
        testHrPartnerId,
        professional2.id
      );
      
      expect(validation.allowed).toBe(true);
    });
  });

  describe('filterSearchResults', () => {
    it('should filter out hidden profiles from search results', async () => {
      const professionalIds = [testProfessionalId, 'other-id-1', 'other-id-2'];
      
      const visibleIds = await PrivacyFirewallService.filterSearchResults(
        professionalIds,
        testCompanyId
      );
      
      expect(visibleIds).not.toContain(testProfessionalId);
      expect(visibleIds.length).toBeLessThan(professionalIds.length);
    });
  });

  describe('logFirewallEvent', () => {
    it('should create a firewall log entry', async () => {
      await PrivacyFirewallService.logFirewallEvent({
        eventType: 'SEARCH_FILTERED',
        professionalId: testProfessionalId,
        companyId: testCompanyId,
        actionTaken: 'profile_hidden_from_search',
      });

      const logs = await prisma.privacyFirewallLog.findMany({
        where: {
          professionalId: testProfessionalId,
          eventType: 'SEARCH_FILTERED',
        },
      });

      expect(logs.length).toBeGreaterThan(0);
    });
  });
});
```

### 8.2 Integration Tests

Create `tests/api/dual-role.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { POST as activateDualRole } from '@/app/api/dual-role/activate/route';
import { GET as getDualRoleStatus } from '@/app/api/dual-role/status/route';

describe('Dual Role API', () => {
  it('should activate dual role successfully', async () => {
    const mockRequest = new Request('http://localhost/api/dual-role/activate', {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        profileHeadline: 'Senior HR Manager',
        locationCity: 'Lagos',
        locationState: 'Lagos',
        yearsOfExperience: 10,
        currentTitle: 'HR Manager',
        currentIndustry: 'Technology',
      }),
    });

    const response = await activateDualRole(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.professional).toBeDefined();
  });

  it('should return dual role status', async () => {
    const mockRequest = new Request('http://localhost/api/dual-role/status', {
      method: 'GET',
    });

    const response = await getDualRoleStatus(mockRequest);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.hasDualRole).toBeDefined();
  });
});
```

### 8.3 E2E Tests

Create `tests/e2e/dual-role.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Dual Role Flow', () => {
  test('HR partner can activate dual role during onboarding', async ({ page }) => {
    // Navigate to onboarding
    await page.goto('/onboarding');

    // Fill HR partner details (steps 1-3)
    // ... fill forms ...

    // Check dual role opt-in
    await page.click('input#dual-role-opt-in');

    // Fill professional profile form
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="profileHeadline"]', 'Senior HR Professional');
    
    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to professional dashboard
    await expect(page).toHaveURL(/\/professional\/dashboard/);
  });

  test('HR partner cannot see their own professional profile in search', async ({ page }) => {
    // Login as HR partner with dual role
    await page.goto('/sign-in');
    // ... login ...

    // Go to search page
    await page.goto('/hr/search');

    // Perform search
    await page.fill('input[name="search"]', 'HR Manager');
    await page.click('button[type="submit"]');

    // Check that own professional profile is not in results
    const results = await page.$('.professional-card');
    const names = await Promise.all(
      results.map(r => r.textContent())
    );

    expect(names).not.toContain('John Doe'); // Own name
  });

  test('HR partner can switch between roles', async ({ page }) => {
    await page.goto('/dashboard');

    // Check role switcher is visible
    await expect(page.locator('text=HR Mode')).toBeVisible();
    await expect(page.locator('text=Job Seeking')).toBeVisible();

    // Switch to professional mode
    await page.click('button:has-text("Job Seeking")');

    // Should navigate to professional dashboard
    await expect(page).toHaveURL(/\/professional\/dashboard/);

    // Switch back to HR mode
    await page.click('button:has-text("HR Mode")');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('privacy firewall logs bypass attempts', async ({ page, request }) => {
    // Try to bypass firewall by direct API call
    const response = await request.post('/api/introductions/request', {
      data: {
        professionalId: 'own-professional-id',
        jobRoleId: 'some-job-id',
        personalizedMessage: 'Test',
      },
    });

    expect(response.status()).toBe(403);

    // Check firewall logs
    await page.goto('/settings/dual-role');
    await expect(page.locator('text=Blocked Access Attempts')).toBeVisible();
  });
});
```

### 8.4 Security Tests

Create `tests/security/firewall.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Security: Firewall Bypass Prevention', () => {
  it('should prevent SQL injection in hideFromCompanyIds', async () => {
    const maliciousInput = "'; DROP TABLE professionals; --";
    
    await expect(async () => {
      await prisma.professional.create({
        data: {
          userId: 'test-user',
          firstName: 'Test',
          lastName: 'Test',
          locationCity: 'Lagos',
          locationState: 'Lagos',
          yearsOfExperience: 5,
          hideFromCompanyIds: [maliciousInput],
        },
      });
    }).rejects.toThrow();
  });

  it('should prevent direct database manipulation bypass', async () => {
    // Even if someone updates hideFromCompanyIds directly in DB
    // Application-level checks should still catch it
    
    const professional = await prisma.professional.create({
      data: {
        userId: 'test-user-2',
        firstName: 'Test',
        lastName: 'Test2',
        locationCity: 'Lagos',
        locationState: 'Lagos',
        yearsOfExperience: 5,
        hideFromCompanyIds: ['company-123'],
      },
    });

    // Try to query without firewall check (simulating bypass attempt)
    const result = await prisma.professional.findFirst({
      where: {
        id: professional.id,
        // Missing firewall check
      },
    });

    expect(result).toBeDefined();

    // Now with firewall check
    const resultWithFirewall = await prisma.professional.findFirst({
      where: {
        id: professional.id,
        NOT: {
          hideFromCompanyIds: {
            has: 'company-123',
          },
        },
      },
    });

    expect(resultWithFirewall).toBeNull();
  });

  it('should log all firewall events for audit trail', async () => {
    const beforeCount = await prisma.privacyFirewallLog.count();

    // Trigger firewall event
    // ... perform action that triggers firewall ...

    const afterCount = await prisma.privacyFirewallLog.count();
    expect(afterCount).toBeGreaterThan(beforeCount);
  });
});
```

---

## 9. Security & Compliance

### 9.1 Security Checklist

- [ ] All firewall checks use parameterized queries (no SQL injection)
- [ ] Rate limiting on API endpoints (prevent enumeration attacks)
- [ ] Audit logging for all privacy-related events
- [ ] HTTPS enforced for all connections
- [ ] Session tokens rotate on role switch
- [ ] No PII in logs or error messages
- [ ] CSRF protection on state-changing endpoints
- [ ] Input validation on all user-provided data
- [ ] Output encoding to prevent XSS
- [ ] Database backups encrypted at rest

### 9.2 Privacy Compliance

**GDPR/Data Protection Requirements:**

1. **Right to be Forgotten**
   - Implement hard delete functionality
   - Remove all firewall logs, profile data, and references
   - Cascade delete all related records

2. **Data Portability**
   - Provide JSON export of all user data
   - Include professional profile, firewall logs, and settings

3. **Consent Management**
   - Explicit opt-in for dual role activation
   - Clear privacy notices at every step
   - Ability to withdraw consent (deactivate dual role)

4. **Data Minimization**
   - Only collect necessary fields for professional profile
   - Automatic data retention policies

Create `lib/gdpr/dataExport.ts`:

```typescript
export async function exportUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      professional: {
        include: {
          workHistory: true,
          education: true,
          skills: true,
          certifications: true,
          references: true,
        },
      },
      hrPartner: {
        include: {
          company: true,
        },
      },
    },
  });

  const firewallLogs = await prisma.privacyFirewallLog.findMany({
    where: {
      OR: [
        { professional: { userId } },
        { hrPartner: { userId } },
      ],
    },
  });

  return {
    user: {
      email: user?.email,
      phone: user?.phone,
      userType: user?.userType,
      createdAt: user?.createdAt,
    },
    professional: user?.professional,
    hrPartner: user?.hrPartner,
    privacyFirewallLogs: firewallLogs,
    exportedAt: new Date().toISOString(),
  };
}
```

---

## 10. Edge Cases

### 10.1 Edge Case Handling

**Case 1: HR Partner Works for Multiple Companies (Consultant)**

```typescript
// Handle multiple company affiliations
async function handleMultipleCompanies(userId: string, companyIds: string[]) {
  const hrRoles = await prisma.hrPartner.findMany({
    where: { userId, status: 'ACTIVE' },
  });

  const professional = await prisma.professional.findUnique({
    where: { userId },
  });

  if (professional) {
    // Block ALL companies they work for
    await prisma.professional.update({
      where: { id: professional.id },
      data: {
        hideFromCompanyIds: companyIds,
      },
    });
  }
}
```

**Case 2: Company Acquisition/Merger**

```typescript
// When Company A acquires Company B
async function handleCompanyMerger(companyAId: string, companyBId: string) {
  // Find all professionals hiding from Company B
  const professionals = await prisma.professional.findMany({
    where: {
      hideFromCompanyIds: {
        has: companyBId,
      },
    },
  });

  // Add Company A to their block list
  for (const prof of professionals) {
    await PrivacyFirewallService.addCompanyToBlockList(
      prof.id,
      companyAId
    );
  }

  // Notify affected professionals
  // ... send notifications ...
}
```

**Case 3: HR Partner Becomes CEO (Higher Risk)**

```typescript
// Extra protection for C-suite professionals
async function handleCsuiteProtection(professionalId: string) {
  await prisma.professional.update({
    where: { id: professionalId },
    data: {
      confidentialSearch: true,
      profileVisibility: 'PRIVATE',
      // Add extra metadata flag
      metadata: {
        extraProtection: true,
        reason: 'c_suite_role',
      },
    },
  });

  // Send alert to admin for manual review
  await sendAdminAlert({
    type: 'HIGH_PROFILE_DUAL_ROLE',
    professionalId,
    message: 'C-suite professional activated dual role - review recommended',
  });
}
```

**Case 4: Accidental Profile Exposure**

```typescript
// Immediate lockdown if breach detected
async function emergencyFirewallLockdown(professionalId: string) {
  // Immediately hide profile from all companies
  await prisma.professional.update({
    where: { id: professionalId },
    data: {
      openToOpportunities: false,
      profileVisibility: 'PRIVATE',
    },
  });

  // Log the incident
  await prisma.privacyFirewallLog.create({
    data: {
      eventType: 'EMERGENCY_LOCKDOWN',
      professionalId,
      actionTaken: 'profile_hidden_emergency',
      metadata: {
        timestamp: new Date().toISOString(),
        reason: 'potential_breach_detected',
      },
    },
  });

  // Notify the professional immediately
  await sendUrgentNotification(professionalId, {
    type: 'PRIVACY_ALERT',
    message: 'We detected unusual activity and temporarily hid your profile for protection.',
  });
}
```

---

## 11. Success Criteria

### 11.1 Functional Requirements

- [ ] HR partner can activate dual role from settings page
- [ ] Professional profile automatically hidden from HR's company
- [ ] Search results exclude hidden professionals (100% accuracy)
- [ ] Introduction requests blocked for hidden professionals
- [ ] Profile view attempts logged and blocked
- [ ] Role switcher allows seamless transition between identities
- [ ] Privacy dashboard shows firewall activity
- [ ] Block list management (add/remove companies)
- [ ] Company change updates firewall automatically
- [ ] Dual role can be deactivated
- [ ] Firewall logs maintained for audit trail

### 11.2 Performance Requirements

- [ ] Firewall check completes in <50ms (p95)
- [ ] Search filtering adds <100ms overhead (p95)
- [ ] Role switching completes in <500ms
- [ ] Privacy dashboard loads in <2s
- [ ] Database queries use proper indexes (no full table scans)
- [ ] Firewall logs don't impact search performance

### 11.3 Security Requirements

- [ ] Zero false negatives (no hidden profiles leak through)
- [ ] All bypass attempts logged
- [ ] No PII exposed in error messages
- [ ] Rate limiting prevents enumeration attacks
- [ ] Firewall cannot be disabled by user
- [ ] Admin cannot override firewall without audit log
- [ ] SQL injection prevented via parameterized queries
- [ ] XSS prevented via output encoding

### 11.4 UX Requirements

- [ ] Privacy guarantee visible at all steps
- [ ] Clear explanation of how firewall works
- [ ] No confusing terminology
- [ ] Mobile-responsive design
- [ ] Accessible (WCAG AA compliant)
- [ ] Loading states for async operations
- [ ] Error messages are helpful and actionable
- [ ] Success confirmations for important actions

### 11.5 Testing Requirements

- [ ] 80%+ unit test coverage for firewall logic
- [ ] Integration tests for all API endpoints
- [ ] E2E tests for critical user flows
- [ ] Security tests for bypass prevention
- [ ] Performance tests for search filtering
- [ ] Manual QA for edge cases

---

## 12. Implementation Checklist

### Phase 1: Database & Backend (Week 1)

**Day 1-2: Database Setup**
- [ ] Create migration script for dual-role fields
- [ ] Add indexes for performance
- [ ] Run migration on dev environment
- [ ] Verify data integrity

**Day 3-4: Core Services**
- [ ] Implement `PrivacyFirewallService`
- [ ] Implement `DualRoleService`
- [ ] Write unit tests
- [ ] Test firewall logic thoroughly

**Day 5: API Endpoints**
- [ ] Create activation endpoint
- [ ] Create status endpoint
- [ ] Create deactivation endpoint
- [ ] Create block list management endpoints
- [ ] Add firewall checks to existing endpoints (search, intro, view)

### Phase 2: Frontend Components (Week 2)

**Day 1-2: Onboarding**
- [ ] Create `DualRoleActivation` component
- [ ] Integrate into HR onboarding flow
- [ ] Add privacy banners and warnings
- [ ] Test user flow

**Day 3: Role Switcher**
- [ ] Create `RoleSwitcher` component
- [ ] Add to navigation
- [ ] Implement session management
- [ ] Test role transitions

**Day 4: Privacy Dashboard**
- [ ] Create `PrivacyDashboard` component
- [ ] Display firewall logs
- [ ] Show blocked companies
- [ ] Add activity timeline

**Day 5: Settings Page**
- [ ] Create dual-role settings page
- [ ] Add toggle for activation/deactivation
- [ ] Add block list management UI
- [ ] Test all interactions

### Phase 3: Integration & Testing (Week 3)

**Day 1-2: Integration**
- [ ] Update all HR search flows
- [ ] Update introduction request flows
- [ ] Update profile view flows
- [ ] Test end-to-end flows

**Day 3-4: Testing**
- [ ] Run all unit tests
- [ ] Run integration tests
- [ ] Run E2E tests
- [ ] Security testing
- [ ] Performance testing

**Day 5: Bug Fixes**
- [ ] Fix any bugs discovered
- [ ] Optimize slow queries
- [ ] Improve error handling

### Phase 4: Documentation & Launch (Week 4)

**Day 1-2: Documentation**
- [ ] API documentation
- [ ] User guide for dual role
- [ ] Admin guide for support team
- [ ] Privacy policy updates

**Day 3: Staging Deploy**
- [ ] Deploy to staging
- [ ] Smoke tests
- [ ] UAT with internal team
- [ ] Final security review

**Day 4: Production Deploy**
- [ ] Deploy to production
- [ ] Monitor firewall logs
- [ ] Monitor error rates
- [ ] Monitor performance

**Day 5: Post-Launch**
- [ ] Gather user feedback
- [ ] Monitor support tickets
- [ ] Plan improvements

---

## 13. Monitoring & Observability

### 13.1 Key Metrics to Track

```typescript
// lib/monitoring/dualRoleMetrics.ts

export const metrics = {
  // Activation metrics
  dualRoleActivations: 'Number of dual role activations',
  dualRoleActivationRate: 'Percentage of HR partners who activate',
  
  // Firewall metrics
  searchesFiltered: 'Number of searches with hidden profiles',
  introductionsBlocked: 'Number of blocked introduction attempts',
  profileViewsBlocked: 'Number of blocked profile views',
  bypassAttempts: 'Number of bypass attempts detected',
  
  // Performance metrics
  firewallCheckDuration: 'Time to execute firewall check',
  searchFilteringOverhead: 'Additional time for filtering',
  
  // Usage metrics
  roleSwitches: 'Number of role switches',
  professionalDashboardVisits: 'Visits to professional dashboard by dual-role users',
  hrDashboardVisits: 'Visits to HR dashboard by dual-role users',
  
  // Privacy metrics
  blockedCompaniesAverage: 'Average number of blocked companies per user',
  firewallLogsGenerated: 'Number of firewall logs created',
};

// Example implementation with DataDog
import { StatsD } from 'node-statsd';

const statsd = new StatsD();

export function trackDualRoleActivation(userId: string) {
  statsd.increment('dual_role.activations');
  statsd.gauge('dual_role.active_users', 1);
}

export function trackFirewallBlock(eventType: string) {
  statsd.increment(`firewall.blocks.${eventType}`);
}

export function trackFirewallPerformance(duration: number) {
  statsd.timing('firewall.check_duration', duration);
}
```

### 13.2 Alerting Rules

```yaml
# alerting/dual-role-alerts.yml

alerts:
  - name: High Bypass Attempt Rate
    condition: bypassAttempts > 10 per hour
    severity: HIGH
    action: Alert security team
    
  - name: Firewall Check Slow
    condition: firewallCheckDuration p95 > 100ms
    severity: MEDIUM
    action: Alert engineering team
    
  - name: Zero Dual Role Activations
    condition: dualRoleActivations = 0 for 7 days
    severity: LOW
    action: Alert product team (feature adoption issue)
    
  - name: Profile Leak Detected
    condition: hiddenProfileAppearsInSearch > 0
    severity: CRITICAL
    action: Emergency page on-call, run incident response
```

### 13.3 Logging Strategy

```typescript
// lib/logging/firewallLogger.ts

import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'firewall-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'firewall-combined.log' }),
  ],
});

export function logFirewallEvent(event: {
  type: string;
  professionalId: string;
  companyId: string;
  action: string;
  metadata?: any;
}) {
  logger.info('Firewall event', {
    timestamp: new Date().toISOString(),
    eventType: event.type,
    professionalId: event.professionalId,
    companyId: event.companyId,
    action: event.action,
    metadata: event.metadata,
  });
}

export function logBypassAttempt(event: {
  hrPartnerId: string;
  professionalId: string;
  companyId: string;
  attemptType: string;
  ipAddress: string;
}) {
  logger.warn('Firewall bypass attempt', {
    timestamp: new Date().toISOString(),
    severity: 'HIGH',
    ...event,
  });
  
  // Also send to security monitoring system
  // ... send to SIEM ...
}
```

---

## 14. Rollout Strategy

### 14.1 Feature Flag Implementation

```typescript
// lib/featureFlags.ts

export async function isDualRoleEnabled(): Promise<boolean> {
  // Check feature flag from configuration
  const flags = await getFeatureFlags();
  return flags.dualRoleEnabled === true;
}

export async function isDualRoleEnabledForUser(userId: string): Promise<boolean> {
  // Check if user is in beta group
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  const globalEnabled = await isDualRoleEnabled();
  const isBetaUser = user?.metadata?.betaTester === true;
  
  return globalEnabled || isBetaUser;
}
```

### 14.2 Gradual Rollout Plan

**Week 1: Internal Testing (10 users)**
- Enable for theNexus team members only
- Monitor for bugs and performance issues
- Gather feedback on UX

**Week 2: Closed Beta (50 users)**
- Enable for invited beta testers
- Monitor firewall effectiveness
- Track activation rate and usage patterns

**Week 3: Open Beta (500 users)**
- Enable for all new HR partners
- Add opt-in for existing HR partners
- Monitor at scale

**Week 4: General Availability**
- Enable for all users
- Full marketing push
- Ongoing monitoring

---

## 15. Support & Documentation

### 15.1 User-Facing Documentation

Create `docs/dual-role-user-guide.md`:

```markdown
# Dual Role User Guide

## What is Dual Role?

Dual Role allows HR professionals to also maintain a confidential job search profile 
on theNexus. Your employer will never see your professional profile.

## How to Activate

1. Go to Settings > Dual Role
2. Check "I'm also open to exploring new opportunities"
3. Fill out your professional profile
4. Click "Activate Dual Role"

## Privacy Guarantee

- Your company **cannot see** your professional profile
- Your company **cannot search** for you
- Your company **will not receive** any alerts about your activity
- This firewall is **automatic and permanent**

## Switching Between Roles

Use the role switcher in the navigation bar:
- 🏢 **HR Mode**: Search for candidates, send introductions
- 👤 **Job Seeking Mode**: View opportunities, respond to requests

## Managing Privacy

Your privacy dashboard shows:
- Companies blocked from seeing your profile
- Recent firewall activity
- Any bypass attempts (we protect you automatically)

## FAQs

**Q: Can my manager find out I'm job searching?**
A: No. Your professional profile is completely hidden from your company.

**Q: What happens if I leave my company?**
A: We automatically remove your old company from the block list.

**Q: Can I block additional companies?**
A: Yes. Go to Settings > Dual Role > Block List to add companies.

**Q: Is my data secure?**
A: Yes. We use enterprise-grade encryption and strict access controls.
```

### 15.2 Admin/Support Documentation

Create `docs/dual-role-admin-guide.md`:

```markdown
# Dual Role Admin Guide

## Support Scenarios

### Scenario 1: User Reports Profile Leak

**Steps:**
1. Check firewall logs for the user
2. Verify hideFromCompanyIds is correct
3. Run manual firewall audit
4. If leak confirmed: Execute emergency lockdown
5. Investigate root cause
6. File incident report

### Scenario 2: User Can't Activate Dual Role

**Common Causes:**
- Already has professional profile
- Company verification pending
- Technical error

**Resolution:**
1. Check user's current role
2. Verify company status
3. Check error logs
4. Manual activation if needed

### Scenario 3: Bypass Attempt Alert

**Steps:**
1. Review firewall logs
2. Identify the HR user who attempted bypass
3. Verify if malicious or accidental
4. If malicious: Flag account, notify security team
5. If accidental: No action needed (firewall blocked it)

## Emergency Procedures

### Profile Leak Detected

```bash
# Run emergency lockdown
npm run emergency-lockdown <professional_id>

# Verify lockdown
npm run verify-firewall <professional_id>

# Notify user
npm run send-alert <user_id> --type=privacy_breach
```

### Firewall Malfunction

```bash
# Disable dual role feature globally
npm run feature-flag disable dual_role

# Run firewall audit
npm run audit-firewall

# Re-enable after fix
npm run feature-flag enable dual_role
```
```

---

## 16. Code Review Checklist

Before merging dual-role code, verify:

**Security:**
- [ ] All database queries use parameterized inputs
- [ ] Firewall checks cannot be bypassed
- [ ] Sensitive data not exposed in logs
- [ ] Rate limiting implemented
- [ ] CSRF protection enabled

**Performance:**
- [ ] Database indexes created
- [ ] Queries optimized (EXPLAIN ANALYZE run)
- [ ] Caching strategy implemented
- [ ] No N+1 query problems

**Testing:**
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Security tests pass
- [ ] Manual QA completed

**UX:**
- [ ] Privacy notices clear and prominent
- [ ] Error messages helpful
- [ ] Loading states present
- [ ] Mobile responsive
- [ ] Accessible (WCAG AA)

**Documentation:**
- [ ] API documented
- [ ] User guide written
- [ ] Admin guide written
- [ ] Code comments added
- [ ] README updated

---

## 17. Success Metrics (Post-Launch)

Track these metrics to measure success:

### Adoption Metrics
- **Target:** 30% of HR partners activate dual role within 3 months
- **Metric:** `dualRoleActivationRate`

### Firewall Effectiveness
- **Target:** Zero profile leaks
- **Metric:** `profileLeaksDetected = 0`

### User Satisfaction
- **Target:** >4.5/5 privacy confidence rating
- **Metric:** User survey results

### Performance
- **Target:** Firewall checks <50ms (p95)
- **Metric:** `firewallCheckDuration`

### Business Impact
- **Target:** 10% increase in HR partner signups
- **Metric:** Month-over-month growth rate

---

## 18. Future Enhancements

### Phase 2 Features (Post-MVP)

1. **Smart Block List Suggestions**
   - Automatically suggest companies to block based on network graph
   - "People who blocked Company A also blocked Company B"

2. **Temporary Profile Visibility**
   - Allow users to temporarily show profile to blocked company
   - Time-limited access for specific roles

3. **Enhanced Analytics**
   - Show HR partners which blocked profiles would have matched
   - "You missed X qualified candidates due to privacy settings"

4. **Multi-Factor Verification**
   - Require extra verification for sensitive profile changes
   - SMS/email confirmation for removing companies from block list

5. **Decoy Profiles**
   - Create fake profiles that log access attempts
   - Honeypot for detecting malicious behavior

---

## 19. Handoff Checklist

Before considering this feature complete:

- [ ] All code merged to main branch
- [ ] Database migrations run on production
- [ ] Feature flags configured
- [ ] Monitoring dashboards created
- [ ] Alerting rules configured
- [ ] Documentation published
- [ ] Team trained on support procedures
- [ ] Incident response plan documented
- [ ] Post-launch metrics tracking setup
- [ ] User communication sent (email, in-app)

---

## 20. Contact & Support

**Engineering Team:**
- Lead: [Engineer Name]
- Backend: [Engineer Name]
- Frontend: [Engineer Name]

**Product Team:**
- PM: [PM Name]
- Designer: [Designer Name]

**Security Team:**
- Security Lead: [Name]

**Support Team:**
- Support Manager: [Name]

**On-Call:**
- PagerDuty rotation: [Link]

---

## Conclusion

This comprehensive implementation guide covers all aspects of the dual-role feature from database schema to user interface. The implementation should prioritize:

1. **Privacy First**: Zero tolerance for profile leaks
2. **Performance**: Fast firewall checks that don't impact UX
3. **Security**: Defense in depth with multiple layers of protection
4. **Usability**: Clear communication and seamless role switching
5. **Auditability**: Complete logging for compliance and debugging

The dual-role system is a critical differentiator for theNexus in the Nigerian market, where HR professionals frequently explore new opportunities while employed. By guaranteeing complete confidentiality, we build trust and expand our addressable market significantly.

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-13  
**Status:** Ready for Implementation  
**Estimated Effort:** 4 weeks (1 senior backend, 1 senior frontend, 1 QA)
 role during onboarding
- [ ] HR partner can activate dual-600 rounded-full"></span>
              Your profile is hidden from {status.blockedCompanies.length} company/companies
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green