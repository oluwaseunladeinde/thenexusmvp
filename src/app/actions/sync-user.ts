'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

/**
 * Sync a Clerk user to the app database if they don't exist.
 * This is a fallback for when the Clerk webhook fails after signup.
 */
export async function syncUserToDatabase() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized: No user ID found');
    }

    try {
        // Check if user already exists in Prisma
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (existingUser) {
            console.log(`✅ User already exists in Prisma: ${userId}`);
            return { success: true, message: 'User already synced' };
        }

        // Fetch user data from Clerk
        const clerk = await clerkClient();
        const clerkUser = await clerk.users.getUser(userId);

        if (!clerkUser) {
            throw new Error('User not found in Clerk');
        }

        const { emailAddresses, phoneNumbers, unsafeMetadata } = clerkUser;

        const userType = (unsafeMetadata?.userType as string) || 'professional';
        const email = emailAddresses[0]?.emailAddress;
        const phone = phoneNumbers[0]?.phoneNumber;

        if (!email) {
            throw new Error('No email address found for user');
        }

        console.log(`👤 Syncing user to Prisma: ${email} (${userType})`);

        // Create user in Prisma
        const newDBUser = await prisma.user.create({
            data: {
                id: userId, // Use Clerk ID as primary key
                clerkUserId: userId, // Set clerkUserId for consistency
                email,
                phone: phone || null,
                passwordHash: '', // Clerk manages passwords
                userType: userType.toUpperCase() as 'PROFESSIONAL' | 'HR_PARTNER' | 'ADMIN',
                status: 'PENDING',
                emailVerified: emailAddresses[0].verification?.status === 'verified',
                phoneVerified: phoneNumbers[0]?.verification?.status === 'verified',
            },
        });

        console.log(`✅ User synced to Prisma: ${userId}`);

        // Update Clerk with Prisma sync confirmation
        await clerk.users.updateUserMetadata(userId, {
            privateMetadata: {
                prismaUserId: userId,
                syncedAt: new Date().toISOString(),
            },
        });

        return { success: true, message: 'User synced successfully', user: newDBUser };
    } catch (error: any) {
        console.error('❌ Error syncing user to database:', error);
        throw new Error(error.message || 'Failed to sync user');
    }
}
