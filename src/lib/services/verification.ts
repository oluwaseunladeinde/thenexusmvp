/**
 * verificationReminders.ts
 *
 * Service for sending verification reminders and notifications
 */

import { prisma } from '@/lib/database';
import { subDays } from 'date-fns';

export const approveProfessionalVerification = async (
  entityId: string,
  verificationStatus: 'BASIC' | 'FULL' | 'PREMIUM' | 'VERIFIED',
  notes: string | null,
  userId: string
) => {
  // Implementation for approving professional verification

}

export const approveCompanyVerification = async (
  entityId: string,
  verificationStatus: 'BASIC' | 'FULL' | 'PREMIUM' | 'VERIFIED',
  notes: string | null,
  userId: string
) => {
  // Implementation for approving company verification
}

export const rejectProfessionalVerification = async (
  entityId: string,
  reason: string | null,
  userId: string
) => {
  // Implementation for rejecting professional verification
}

export const rejectCompanyVerification = async (
  entityId: string,
  reason: string | null,
  userId: string
) => {
  // Implementation for rejecting company verification
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
          // Profile is not completed
          { onboardingCompleted: false },
          // Or not verified
          { verificationStatus: 'UNVERIFIED' },
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

    console.log(`Would send incomplete profile reminder to: ${professional.user.email}`);

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

    console.log(`Would send LinkedIn verification reminder to: ${professional.user.email}`);

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
    // 1. Send incomplete profile reminders
    const professionalsNeedingReminders = await findProfessionalsNeedingReminders();
    for (const professional of professionalsNeedingReminders) {
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
