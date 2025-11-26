/**
 * verificationReminders.ts
 * Service for sending verification reminders and notifications
 */
import { prisma } from '@/lib/database';
import { subDays } from 'date-fns';
import { isValidLinkedInUrl } from "../validators/linkedinValidator";
import { checkUrlAccessible } from "../utils/checkUrlAccessible";
import { extractDomainFromUrl, extractDomainFromEmail, doDomainsMatch } from "../utils/extractDomain";
import logger from './logger';

export const verifyLinkedIn = async (linkedinUrl: string) => {
  if (!isValidLinkedInUrl(linkedinUrl)) {
    return { success: false, error: "Invalid LinkedIn URL format" };
  }

  const accessible = await checkUrlAccessible(linkedinUrl);
  if (!accessible) {
    return { success: false, error: "LinkedIn URL not reachable" };
  }

  return { success: true, error: null };
}

export const updateLinkedInVerificationStatus = async (userId: string, verifierId: string, notes?: string) => {
  try {
    const updated = await prisma.professional.update({
      where: { id: userId },
      data: {
        verificationStatus: "BASIC" as const,
        verificationDate: new Date(),
        verificationNotes: notes,
        verifiedBy: verifierId
      },
    });
    return { success: true, user: updated };
  } catch (error) {
    return { success: false, user: null };
  }
}

export const verifyCompanyDomain = async (websiteUrl: string, hrEmail: string) => {
  const siteDomain = extractDomainFromUrl(websiteUrl);
  const emailDomain = extractDomainFromEmail(hrEmail);
  if (!siteDomain || !emailDomain) {
    return {
      success: false,
      error: "Invalid domain or email format",
      status: "manual_review",
    };
  }

  const domainsMatch = doDomainsMatch(siteDomain, emailDomain);
  if (!domainsMatch) {
    return { success: false, error: "Email domain does not match website domain", status: "manual_review" };
  } else {
    // Domains match
    return { success: true, error: null, status: "company_verified" };
  }
}


export const approveProfessionalVerification = async (
  entityId: string,
  notes: string | null,
  userId: string
) => {

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const professional = await prisma.professional.findUnique({ where: { id: entityId } });
  if (!professional) {
    return { success: false, error: 'User not found' };
  }

  const professioanlLinkedInURL = professional.linkedinUrl;
  if (!professioanlLinkedInURL) {
    return { success: false, error: 'Professional does not have a LinkedIn URL' };
  }

  const verifyResult = await verifyLinkedIn(professioanlLinkedInURL);
  if (!verifyResult.success) {
    return { success: false, error: verifyResult.error };
  }

  // Update to requested verification status if higher than BASIC
  const update = await updateLinkedInVerificationStatus(entityId, userId, notes || '');
  if (!update.success) {
    return { success: false, error: 'Failed to update verification status' };
  }

  return { success: true, error: null };
}

export const approveCompanyVerification = async (
  entityId: string,
  userId: string
) => {

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  if (user.userType !== 'ADMIN') {
    return { success: false, error: 'Admin access required' };
  }

  const company = await prisma.company.findUnique({ where: { id: entityId } });
  if (!company || !company.companyWebsite) {
    return {
      success: false,
      error: "Company or company website not found",
      status: "UNVERIFIED",
    };
  }

  const websiteDomain = extractDomainFromUrl(company.companyWebsite);
  if (!websiteDomain) {
    return {
      success: false,
      error: "Invalid company website URL",
      status: "UNVERIFIED",
    };
  }

  // Find HR Partner with ADMIN role
  const adminHrPartner = await prisma.hrPartner.findFirst({
    where: {
      companyId: entityId,
      roleInPlatform: "ADMIN",
    },
    include: {
      user: true, // to access email
    },
  });

  if (!adminHrPartner) {
    return {
      success: false,
      error: "No HR Partner with ADMIN role found for this company",
      status: "UNVERIFIED",
    };
  }

  const hrEmail = adminHrPartner.user.email;
  const emailDomain = extractDomainFromEmail(hrEmail);

  if (!emailDomain) {
    return {
      success: false,
      error: "Invalid HR Partner email format",
      status: "UNVERIFIED",
    };
  }

  // 3. Compare domains
  const match = doDomainsMatch(websiteDomain, emailDomain);

  // 4. Compute final verification status
  const verificationStatus = match ? "VERIFIED" : "UNVERIFIED";

  // 5. Update company verification status
  let updatedCompany;
  try {
    updatedCompany = await prisma.company.update({
      where: { id: entityId },
      data: {
        verificationStatus: verificationStatus as 'VERIFIED' | 'PREMIUM',
        verificationDate: match ? new Date() : null,
        verifiedBy: match ? adminHrPartner.userId : null,
        verificationNotes: match
          ? "Auto-verified: domain matches HR admin email"
          : `Manual review: Domain mismatch. Website=${websiteDomain}, Email=${emailDomain}`,
      },
    });

    if (!updatedCompany) {
      return {
        success: false,
        error: "Failed to update company verification status",
        status: "UNVERIFIED",
      };
    }
  } catch (error) {
    return { success: false, error: 'Error updating company verification status' };
  }

  return {
    success: true,
    match,
    status: verificationStatus,
    company: updatedCompany,
  };
}

export const rejectProfessionalVerification = async (
  entityId: string,
  reason: string | null,
  userId: string
) => {
  // Implementation for rejecting professional verification
  throw new Error('Not implemented: rejectProfessionalVerification');
}

export const rejectCompanyVerification = async (
  entityId: string,
  reason: string | null,
  userId: string
) => {
  // Implementation for rejecting company verification
  throw new Error('Not implemented: rejectCompanyVerification');
}



interface ReminderConfig {
  incompleteProfileDays: number; // Days after profile creation to send reminder
  queueThreshold: number; // Queue size to trigger admin notification
}

const defaultConfig: ReminderConfig = {
  incompleteProfileDays: 3,
  queueThreshold: 10,
};

/**
 * Find professionals with incomplete profiles that need reminders
 */
export async function findProfessionalsNeedingReminders(
  daysThreshold: number = defaultConfig.incompleteProfileDays
) {
  const cutoffDate = subDays(new Date(), daysThreshold);

  try {
    const professionals = await prisma.professional.findMany({
      where: {
        AND: [
          {
            OR: [
              { onboardingCompleted: false },
              { verificationStatus: 'UNVERIFIED' },
            ],
          },
          // Profile created more than X days ago
          { createdAt: { lte: cutoffDate } },
          // Not deleted
          { deletedAt: null },
        ],
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    });

    return professionals;
  } catch (error) {
    console.error('Error finding professionals needing reminders:', error);
    return [];
  }
}

/**
 * Find professionals without LinkedIn URL for verification reminders
 */
export async function findProfessionalsWithoutLinkedIn() {
  try {
    const professionals = await prisma.professional.findMany({
      where: {
        AND: [
          // No LinkedIn URL
          { linkedinUrl: null },
          // Not verified
          { verificationStatus: 'UNVERIFIED' },
          // Not deleted
          { deletedAt: null },
        ],
      },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    });

    return professionals;
  } catch (error) {
    console.error('Error finding professionals without LinkedIn:', error);
    return [];
  }
}

/**
 * Check verification queue size and send admin notification if needed
 */
export async function checkVerificationQueueSize(
  threshold: number = defaultConfig.queueThreshold
) {
  try {
    // Count unverified professionals
    const unverifiedProfessionals = await prisma.professional.count({
      where: {
        verificationStatus: 'UNVERIFIED',
        deletedAt: null,
      },
    });

    // Count pending companies
    const pendingCompanies = await prisma.company.count({
      where: {
        verificationStatus: 'PENDING',
      },
    });

    const totalPending = unverifiedProfessionals + pendingCompanies;

    if (totalPending > threshold) {
      return {
        shouldNotify: true,
        totalPending,
        unverifiedProfessionals,
        pendingCompanies,
      };
    }

    return {
      shouldNotify: false,
      totalPending,
      unverifiedProfessionals,
      pendingCompanies,
    };
  } catch (error) {
    console.error('Error checking verification queue size:', error);
    return {
      shouldNotify: false,
      totalPending: 0,
      unverifiedProfessionals: 0,
      pendingCompanies: 0,
    };
  }
}

/**
 * Get all admin users for notifications
 */
export async function getAdminUsers() {
  try {
    const admins = await prisma.user.findMany({
      where: {
        userType: 'ADMIN',
        status: 'ACTIVE',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    return admins;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

/**
 * Send incomplete profile reminder email
 * This would integrate with your email service (SendGrid/Resend)
 */
export async function sendIncompleteProfileReminder(professionalId: string) {
  try {
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!professional) {
      return { success: false, message: 'Professional not found' };
    }

    // TODO: Implement actual email sending logic
    // Example:
    // await sendEmail({
    //   to: professional.user.email,
    //   subject: 'Complete your theNexus profile',
    //   template: 'incomplete-profile-reminder',
    //   data: {
    //     name: professional.firstName,
    //     profileCompleteness: professional.profileCompleteness,
    //   },
    // });

    logger.info(`Would send incomplete profile reminder to: ${professional.user.email}`);

    return {
      success: true,
      message: 'Reminder sent successfully',
    };
  } catch (error) {
    console.error('Error sending incomplete profile reminder:', error);
    return {
      success: false,
      message: 'Failed to send reminder',
    };
  }
}

/**
 * Send LinkedIn verification reminder email
 */
export async function sendLinkedInVerificationReminder(professionalId: string) {
  try {
    const professional = await prisma.professional.findUnique({
      where: { id: professionalId },
      include: {
        user: {
          select: {
            email: true,
            fullName: true,
          },
        },
      },
    });

    if (!professional) {
      return { success: false, message: 'Professional not found' };
    }

    // TODO: Implement actual email sending logic
    // await sendEmail({
    //   to: professional.user.email,
    //   subject: 'Verify your profile with LinkedIn',
    //   template: 'linkedin-verification-reminder',
    //   data: {
    //     name: professional.firstName,
    //   },
    // });

    logger.info(`Would send LinkedIn verification reminder to: ${professional.user.email}`);

    return {
      success: true,
      message: 'Reminder sent successfully',
    };
  } catch (error) {
    console.error('Error sending LinkedIn verification reminder:', error);
    return {
      success: false,
      message: 'Failed to send reminder',
    };
  }
}

/**
 * Send admin notification about verification queue size
 */
export async function sendAdminQueueNotification(queueData: {
  totalPending: number;
  unverifiedProfessionals: number;
  pendingCompanies: number;
}) {
  try {
    const admins = await getAdminUsers();

    if (admins.length === 0) {
      return { success: false, message: 'No admin users found' };
    }

    // TODO: Implement actual email sending logic
    // for (const admin of admins) {
    //   await sendEmail({
    //     to: admin.email,
    //     subject: 'Verification Queue Alert',
    //     template: 'admin-queue-notification',
    //     data: {
    //       name: admin.fullName,
    //       totalPending: queueData.totalPending,
    //       unverifiedProfessionals: queueData.unverifiedProfessionals,
    //       pendingCompanies: queueData.pendingCompanies,
    //     },
    //   });
    // }

    console.log(`Would send queue notification to ${admins.length} admin(s)`);
    console.log('Queue data:', queueData);

    return {
      success: true,
      message: `Notification sent to ${admins.length} admin(s)`,
    };
  } catch (error) {
    console.error('Error sending admin queue notification:', error);
    return {
      success: false,
      message: 'Failed to send notification',
    };
  }
}

/**
 * Run all verification reminders (should be called by a cron job)
 */
export async function runVerificationReminders() {
  const results = {
    incompleteProfileReminders: 0,
    linkedInReminders: 0,
    adminNotifications: 0,
    errors: [] as string[],
  };

  try {

    const processedIds = new Set<string>();

    // 1. Send incomplete profile reminders
    const professionalsNeedingReminders = await findProfessionalsNeedingReminders();
    for (const professional of professionalsNeedingReminders) {
      processedIds.add(professional.id);
      const result = await sendIncompleteProfileReminder(professional.id);
      if (result.success) {
        results.incompleteProfileReminders++;
      } else {
        results.errors.push(`Failed to send reminder to ${professional.id}`);
      }
    }

    // 2. Send LinkedIn verification reminders
    const professionalsWithoutLinkedIn = await findProfessionalsWithoutLinkedIn();
    for (const professional of professionalsWithoutLinkedIn) {
      if (processedIds.has(professional.id)) continue; // Skip if already reminded
      const result = await sendLinkedInVerificationReminder(professional.id);
      if (result.success) {
        results.linkedInReminders++;
      } else {
        results.errors.push(`Failed to send LinkedIn reminder to ${professional.id}`);
      }
    }

    // 3. Check queue size and send admin notification if needed
    const queueStatus = await checkVerificationQueueSize();
    if (queueStatus.shouldNotify) {
      const result = await sendAdminQueueNotification(queueStatus);
      if (result.success) {
        results.adminNotifications++;
      } else {
        results.errors.push('Failed to send admin notification');
      }
    }

    return results;
  } catch (error) {
    console.error('Error running verification reminders:', error);
    results.errors.push('Failed to run verification reminders');
    return results;
  }
}
