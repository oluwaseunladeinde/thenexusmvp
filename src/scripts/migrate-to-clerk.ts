import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

async function migrateUsersToClerk() {
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
        try {
            // Create Clerk user
            const clerk = await clerkClient()
            const clerkUser = await clerk.users.createUser({
                emailAddress: [user.email],
                phoneNumber: user.phone ? [user.phone] : undefined,
                password: 'temporary-password-123', // Force password reset
                publicMetadata: {
                    userType: user.userType.toLowerCase() as 'professional' | 'hr_partner' | 'admin',
                    onboardingComplete: true,
                },
            });

            // Update Prisma user with Clerk ID
            await prisma.user.update({
                where: { id: user.id },
                data: { id: clerkUser.id },
            });

            console.log(`✅ Migrated user: ${user.email}`);
        } catch (error) {
            console.error(`❌ Failed to migrate ${user.email}:`, error);
        }
    }

    console.log('Migration complete!');
}

migrateUsersToClerk();