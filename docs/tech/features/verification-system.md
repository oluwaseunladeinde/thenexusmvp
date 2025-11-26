# Verification System Documentation

## Overview
The verification system enables theNexus to verify professional and company profiles, building trust and credibility on the platform. The system includes automated LinkedIn verification, manual admin verification, company domain verification, and automated reminder notifications.

## Features Implemented

### ✅ P0 - Critical Features
1. **LinkedIn Verification Logic**
   - Validates LinkedIn URL format
   - Checks URL accessibility via HEAD request
   - Auto-assigns 'BASIC' verification status for valid LinkedIn profiles
   - Location: `src/lib/services/verification.ts`

2. **Admin Verification Queue API**
   - `GET /api/v1/admin/verification/queue` - Fetch pending verifications
   - `POST /api/v1/admin/verification/approve` - Approve verification
   - `POST /api/v1/admin/verification/reject` - Reject verification with reason
   - Location: `src/app/api/v1/admin/verification/`

3. **Verification Badge Component**
   - Displays verification status with visual badges
   - Supports BASIC, FULL, PREMIUM, VERIFIED status levels
   - Includes tooltips with verification details
   - Responsive sizing (sm, md, lg)
   - Location: `src/components/verification/VerificationBadge.tsx`

### ✅ P1 - Important Features
4. **Admin Verification Page**
   - Full-screen admin interface at `/admin/verification`
   - Tabbed view for Professionals and Companies
   - Detailed profile information display
   - Approve/reject workflow with notes
   - Real-time queue statistics
   - Location: `src/app/admin/verification/page.tsx`

5. **Company Domain Verification**
   - Extracts domain from company website
   - Extracts domain from HR email
   - Auto-verifies companies when domains match
   - Flags mismatches for manual review
   - Location: `src/lib/services/verification.ts`

### ✅ P2 - Nice to Have
6. **Verification Reminders**
   - Email reminders for incomplete profiles (after 3 days)
   - LinkedIn verification reminders
   - Admin notifications when queue exceeds 10 items
   - Configurable thresholds
   - Location: `src/lib/services/verificationReminders.ts`

## Database Schema Changes

### Professional Model
```prisma
model Professional {
  // Existing fields...
  verificationStatus   VerificationStatus @default(UNVERIFIED)
  verificationDate     DateTime?
  verificationNotes    String?            @db.Text  // NEW
  verifiedBy           String?                      // NEW
  linkedinUrl          String?
}

enum VerificationStatus {
  UNVERIFIED
  BASIC      // LinkedIn verified
  FULL       // Fully verified with references
  PREMIUM    // Premium verified
}
```

### Company Model
```prisma
model Company {
  // Existing fields...
  verificationStatus CompanyVerificationStatus @default(PENDING)
  verificationDate   DateTime?
  verificationNotes  String?                    @db.Text  // NEW
  verifiedBy         String?                              // NEW
}

enum CompanyVerificationStatus {
  PENDING
  VERIFIED
  PREMIUM
}
```

## API Endpoints

### GET /api/v1/admin/verification/queue
Returns list of unverified professionals and pending companies.

**Authentication:** Admin only

**Response:**
```json
{
  "success": true,
  "data": {
    "professionals": [...],
    "companies": [...],
    "total": 15
  }
}
```

### POST /api/v1/admin/verification/approve
Approve a professional or company verification.

**Authentication:** Admin only

**Request Body:**
```json
{
  "entityType": "professional" | "company",
  "entityId": "string",
  "verificationStatus": "BASIC" | "FULL" | "PREMIUM" | "VERIFIED",
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Professional verification approved"
}
```

### POST /api/v1/admin/verification/reject
Reject a professional or company verification.

**Authentication:** Admin only

**Request Body:**
```json
{
  "entityType": "professional" | "company",
  "entityId": "string",
  "reason": "Reason for rejection"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Professional verification rejected"
}
```

## Component Usage

### VerificationBadge
Display verification status on profiles and search results.

```tsx
import { VerificationBadge } from '@/components/verification/VerificationBadge';

<VerificationBadge 
  status={professional.verificationStatus}
  entityType="professional"
  showTooltip={true}
  size="md"
/>
```

**Props:**
- `status`: VerificationStatus | CompanyVerificationStatus | null
- `entityType`: 'professional' | 'company' (default: 'professional')
- `showTooltip`: boolean (default: true)
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

### VerificationIcon
Compact verification icon for tight spaces.

```tsx
import { VerificationIcon } from '@/components/verification/VerificationBadge';

<VerificationIcon 
  status={professional.verificationStatus}
  showTooltip={true}
  className="ml-2"
/>
```

## Service Functions

### LinkedIn Verification

```typescript
import { verifyLinkedInProfile, autoVerifyProfessionalLinkedIn } from '@/lib/services/verification';

// Check LinkedIn URL validity and accessibility
const result = await verifyLinkedInProfile(linkedinUrl);
// Returns: { isValid, isAccessible, verificationStatus, message }

// Auto-verify professional
const result = await autoVerifyProfessionalLinkedIn(professionalId);
// Returns: { success, verificationStatus, message }
```

### Company Domain Verification

```typescript
import { verifyCompanyDomain, autoVerifyCompanyDomain } from '@/lib/services/verification';

// Check domain matching
const result = await verifyCompanyDomain(companyWebsite, hrEmail);
// Returns: { websiteDomain, emailDomain, domainsMatch, autoVerified, message }

// Auto-verify company
const result = await autoVerifyCompanyDomain(companyId, hrEmail);
// Returns: { success, verificationStatus, message }
```

### Verification Queue Management

```typescript
import {
  getVerificationQueue,
  approveProfessionalVerification,
  rejectProfessionalVerification,
  approveCompanyVerification,
  rejectCompanyVerification
} from '@/lib/services/verification';

// Get queue
const queue = await getVerificationQueue();
// Returns: { professionals, companies, total }

// Approve professional
await approveProfessionalVerification(
  professionalId,
  'FULL',
  'Verified with references',
  adminUserId
);

// Reject professional
await rejectProfessionalVerification(
  professionalId,
  'LinkedIn URL not accessible',
  adminUserId
);
```

### Verification Reminders

```typescript
import {
  runVerificationReminders,
  findProfessionalsNeedingReminders,
  checkVerificationQueueSize
} from '@/lib/services/verificationReminders';

// Run all reminders (call from cron job)
const results = await runVerificationReminders();
// Returns: { incompleteProfileReminders, linkedInReminders, adminNotifications, errors }

// Find professionals needing reminders
const professionals = await findProfessionalsNeedingReminders(3); // 3 days threshold

// Check queue size
const status = await checkVerificationQueueSize(10); // threshold of 10
```

## Workflow

### Professional Verification Flow
1. Professional creates profile
2. Professional adds LinkedIn URL (optional)
3. System automatically verifies LinkedIn URL if provided
   - Validates URL format
   - Checks accessibility
   - Assigns BASIC verification if valid
4. If no LinkedIn or verification fails, profile remains UNVERIFIED
5. Admin reviews unverified profiles in queue
6. Admin approves with BASIC, FULL, or PREMIUM status
7. Professional receives verification badge on profile
8. Notifications sent on verification decision

### Company Verification Flow
1. Company registers with HR partner
2. System extracts domain from company website
3. System extracts domain from HR email
4. If domains match → Auto-verify as VERIFIED
5. If domains don't match → Flag for manual review
6. Admin reviews pending companies in queue
7. Admin approves as VERIFIED or PREMIUM, or rejects
8. Company receives verification status
9. HR partners notified of decision

### Reminder Flow (Automated)
1. Cron job runs daily (recommended)
2. System finds professionals with incomplete profiles (3+ days old)
3. Sends reminder emails to complete profile and add LinkedIn
4. System checks verification queue size
5. If queue > 10 items → Sends notification to all admins
6. Admins can configure thresholds in service file

## Configuration

### Reminder Configuration
Edit `src/lib/services/verificationReminders.ts`:

```typescript
const defaultConfig: ReminderConfig = {
  incompleteProfileDays: 3,  // Days before sending reminder
  queueThreshold: 10,         // Queue size for admin alert
};
```

## Integration Points

### Integrating Verification Badge
Add the verification badge to any component displaying professional or company information:

1. **Professional Profile Page**
   ```tsx
   <div className="flex items-center gap-2">
     <h1>{professional.firstName} {professional.lastName}</h1>
     <VerificationBadge status={professional.verificationStatus} />
   </div>
   ```

2. **Search Results Card**
   ```tsx
   <CardTitle className="flex items-center gap-2">
     {professional.firstName} {professional.lastName}
     <VerificationIcon status={professional.verificationStatus} />
   </CardTitle>
   ```

3. **Introduction Requests**
   ```tsx
   <div className="flex items-center gap-2">
     <Avatar src={professional.profilePhotoUrl} />
     <div>
       <div className="flex items-center gap-2">
         {professional.firstName}
         <VerificationBadge status={professional.verificationStatus} size="sm" />
       </div>
     </div>
   </div>
   ```

### Auto-Verification Integration
Add auto-verification hooks to profile update endpoints:

```typescript
// In professional profile update endpoint
import { autoVerifyProfessionalLinkedIn } from '@/lib/services/verification';

// After updating LinkedIn URL
if (linkedinUrl && linkedinUrl !== existingLinkedInUrl) {
  await autoVerifyProfessionalLinkedIn(professionalId);
}

// In HR partner creation endpoint
import { autoVerifyCompanyDomain } from '@/lib/services/verification';

// After creating HR partner
const hrEmail = user.email;
await autoVerifyCompanyDomain(companyId, hrEmail);
```

## Cron Job Setup

To automate verification reminders, set up a cron job or scheduled task:

### Option 1: Vercel Cron Jobs
Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/verification-reminders",
    "schedule": "0 9 * * *"
  }]
}
```

Create endpoint `src/app/api/cron/verification-reminders/route.ts`:
```typescript
import { NextResponse } from 'next/server';
import { runVerificationReminders } from '@/lib/services/verificationReminders';

export async function GET() {
  const results = await runVerificationReminders();
  return NextResponse.json(results);
}
```

### Option 2: External Cron Service
Use services like:
- Cron-job.org
- EasyCron
- GitHub Actions

Point to: `https://your-domain.com/api/cron/verification-reminders`

## Future Enhancements

### Potential Improvements
1. **Enhanced LinkedIn Verification**
   - Scrape LinkedIn profile data for additional validation
   - Verify job history matches profile
   - Check endorsements and recommendations

2. **Multi-Factor Verification**
   - Email verification
   - Phone number verification
   - Document upload (ID, certificates)

3. **Verification Expiry**
   - Set expiry dates for verifications
   - Automatic re-verification reminders
   - Downgrade to lower verification tier after expiry

4. **Verification Analytics**
   - Track verification completion rates
   - Monitor time-to-verification metrics
   - Identify bottlenecks in verification process

5. **Batch Verification**
   - Bulk approve/reject capabilities
   - CSV import for pre-verified users
   - Integration with third-party verification services

## Testing

### Manual Testing Checklist
- [ ] Professional can add LinkedIn URL
- [ ] System validates LinkedIn URL format
- [ ] System checks LinkedIn URL accessibility
- [ ] BASIC verification assigned on valid LinkedIn
- [ ] Admin can view verification queue
- [ ] Admin can approve professional verification
- [ ] Admin can reject professional verification
- [ ] Admin can approve company verification
- [ ] Admin can reject company verification
- [ ] Verification badge displays correctly
- [ ] Tooltip shows on badge hover
- [ ] Company domain auto-verification works
- [ ] Reminder system identifies candidates
- [ ] Notifications are logged correctly

### Unit Testing (To be implemented)
```typescript
// Example test structure
describe('LinkedIn Verification', () => {
  it('should validate correct LinkedIn URL format', async () => {
    const result = await verifyLinkedInProfile('https://www.linkedin.com/in/user');
    expect(result.isValid).toBe(true);
  });

  it('should reject invalid LinkedIn URL', async () => {
    const result = await verifyLinkedInProfile('https://example.com/profile');
    expect(result.isValid).toBe(false);
  });
});
```

## Support

For issues or questions about the verification system:
1. Check this documentation first
2. Review the source code in `src/lib/services/verification.ts`
3. Check API endpoint responses for error details
4. Contact the development team

## Migration Guide

### Migrating Existing Data
Run Prisma migration:
```bash
npx prisma migrate dev --name add_verification_fields
```

This will add:
- `verificationNotes` field to Professional table
- `verifiedBy` field to Professional table
- `verificationNotes` field to Company table
- `verifiedBy` field to Company table

Existing records will have these fields set to `null`.

### Updating Existing Components
1. Import VerificationBadge component
2. Add badge next to professional/company names
3. Pass verification status from data
4. Ensure tooltip is enabled for better UX

## Changelog

### v1.0.0 (Initial Release)
- ✅ LinkedIn verification logic
- ✅ Admin verification queue API
- ✅ Verification badge component
- ✅ Admin verification page UI
- ✅ Company domain verification
- ✅ Verification reminders system
- ✅ Database schema updates
- ✅ Complete documentation