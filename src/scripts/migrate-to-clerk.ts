import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

/**
 * Migrate users from Prisma to Clerk.
 * @param {boolean} isDryRun - If true, do not make any changes to the database.
 * @returns {Promise<void>} - Resolves when the migration is complete.
 */
async function migrateUsersToClerk(isDryRun?: boolean) {

    if (isDryRun) {
        console.log('🔍 DRY RUN MODE - No changes will be made');
        return;
    }

    const failedUsers = []
    const users = await prisma.user.findMany({
        where: {
            // Users not yet synced to Clerk
            id: {
                not: {
                    startsWith: 'user_', // Clerk IDs start with 'user_'
                },
            },
        },
    });

    for (const user of users) {

        const clerk = await clerkClient();
        const existingClerkUsers = await clerk.users.getUserList({
            emailAddress: [user.email],
        });

        if (existingClerkUsers.data.length > 0) {
            console.log(`⏭️  User ${user.email} already exists in Clerk`);
            // Update Prisma with existing Clerk ID if needed
            continue;
        }

        // Wrap in transaction-like logic
        try {
            const clerkUser = await clerk.users.createUser({
                emailAddress: [user.email],
                phoneNumber: user.phone ? [user.phone] : undefined,
                password: 'temporary-password-123', // Force password reset
                skipPasswordRequirement: true, // User will set password on first login
                skipPasswordChecks: true,
                publicMetadata: {
                    userType: user.userType.toLowerCase() as 'professional' | 'hr-partner' | 'admin',
                    onboardingComplete: true,
                },
            });

            try {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { id: clerkUser.id },
                });
            } catch (prismaError) {
                // Rollback: delete the Clerk user
                await clerk.users.deleteUser(clerkUser.id);
                throw prismaError;
            }
        } catch (error) {
            // Track failed users for retry
            failedUsers.push({ email: user.email, error });
            continue;
        }
    }

    console.log('Migration complete!');
    console.log('Failed users:', failedUsers);
}

//migrateUsersToClerk();

async function main() {
    // Environment check
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ Cannot run migration in production without explicit flag');
        process.exit(1);
    }

    // Dry run option
    const isDryRun = process.argv.includes('--dry-run');
    if (isDryRun) {
        console.log('🔍 DRY RUN MODE - No changes will be made');
    }

    await migrateUsersToClerk(isDryRun);
    console.log('✅ Script completed successfully');
}

main().catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
});

