import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';
import { clerkClient } from '@clerk/nextjs/server';

/**
 * @swagger
 * /api/v1/webhooks/clerk:
 *   post:
 *     summary: Handle Clerk webhook events for user synchronization
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Clerk webhook payload with Svix headers
 *             properties:
 *               type:
 *                 type: string
 *                 description: Webhook event type
 *                 enum: [user.created, user.updated, user.deleted, session.created]
 *               data:
 *                 type: object
 *                 description: Event data payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Invalid webhook signature or missing headers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error: Verification failed"
 *       500:
 *         description: Webhook processing failed or configuration error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error: Database sync failed"
 */

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Missing CLERK_WEBHOOK_SECRET in environment variables');
    }

    // Get Svix headers for verification
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing svix headers', { status: 400 });
    }

    // Get request body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('❌ Webhook verification failed:', err);
        return new Response('Error: Verification failed', { status: 400 });
    }

    const eventType = evt.type;
    console.log(`📥 Received webhook: ${eventType}`);

    // ============================================
    // USER CREATED - Initial Sync to Prisma
    // ============================================
    if (eventType === 'user.created') {
        const { id, email_addresses, phone_numbers, unsafe_metadata } = evt.data;

        try {
            const userType = (unsafe_metadata?.userType as string) || 'professional';
            const email = email_addresses[0]?.email_address;
            const phone = phone_numbers[0]?.phone_number;

            console.log(`👤 Creating user in Prisma: ${email} (${userType})`);

            // Create user in Prisma
            await prisma.user.create({
                data: {
                    id, // Use Clerk ID as primary key
                    email,
                    phone: phone || null,
                    passwordHash: '', // Clerk manages passwords
                    userType: userType.toUpperCase() as 'PROFESSIONAL' | 'HR_PARTNER' | 'ADMIN',
                    status: 'PENDING',
                    emailVerified: email_addresses[0].verification?.status === 'verified',
                    phoneVerified: phone_numbers[0]?.verification?.status === 'verified',
                },
            });

            console.log(`✅ User created in Prisma: ${id}`);

            // Update Clerk with Prisma sync confirmation
            const clerk = await clerkClient()
            await clerk.users.updateUserMetadata(id, {
                privateMetadata: {
                    prismaUserId: id,
                    syncedAt: new Date().toISOString(),
                },
            });

            return new Response('User created successfully', { status: 200 });
        } catch (error) {
            console.error('❌ Error creating user in Prisma:', error);
            return new Response('Error: Database sync failed', { status: 500 });
        }
    }

    // ============================================
    // USER UPDATED - Update Prisma
    // ============================================
    if (eventType === 'user.updated') {
        const { id, email_addresses, phone_numbers, unsafe_metadata, public_metadata } = evt.data;

        try {
            const onboardingComplete = unsafe_metadata?.onboardingComplete as boolean | undefined;
            const email = email_addresses[0]?.email_address;
            const phone = phone_numbers[0]?.phone_number;

            console.log(`🔄 Updating user in Prisma: ${id}`);

            await prisma.user.update({
                where: { id },
                data: {
                    email,
                    phone: phone || null,
                    emailVerified: email_addresses[0].verification?.status === 'verified',
                    phoneVerified: phone_numbers[0]?.verification?.status === 'verified',
                    status: onboardingComplete ? 'ACTIVE' : 'PENDING',
                    hasDualRole: (public_metadata?.hasDualRole as boolean) || false,
                    dualRoleEnabledAt:
                        (public_metadata?.hasDualRole as boolean) && !(unsafe_metadata?.hasDualRole as boolean)
                            ? new Date()
                            : undefined,
                },
            });

            console.log(`✅ User updated in Prisma: ${id}`);
            return new Response('User updated successfully', { status: 200 });
        } catch (error) {
            console.error('❌ Error updating user in Prisma:', error);
            return new Response('Error: Database update failed', { status: 500 });
        }
    }

    // ============================================
    // USER DELETED - Soft Delete in Prisma
    // ============================================
    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        try {
            console.log(`🗑️ Soft-deleting user in Prisma: ${id}`);

            await prisma.user.update({
                where: { id: id! },
                data: {
                    status: 'DELETED',
                    deletedAt: new Date(),
                },
            });

            console.log(`✅ User soft-deleted in Prisma: ${id}`);
            return new Response('User deleted successfully', { status: 200 });
        } catch (error) {
            console.error('❌ Error deleting user in Prisma:', error);
            return new Response('Error: Database delete failed', { status: 500 });
        }
    }

    // ============================================
    // SESSION CREATED - Update Session Claims
    // ============================================
    if (eventType === 'session.created') {
        const { user_id } = evt.data;

        try {
            console.log(`🔐 Session created for user: ${user_id}`);

            // Fetch user from Clerk to get latest metadata
            const clerk = await clerkClient()
            const user = await clerk.users.getUser(user_id);

            // Update session claims with fresh metadata
            await clerk.users.updateUserMetadata(user_id, {
                publicMetadata: {
                    ...user.publicMetadata,
                    lastLoginAt: new Date().toISOString(),
                },
            });

            console.log(`✅ Session claims updated for user: ${user_id}`);
            return new Response('Session processed successfully', { status: 200 });
        } catch (error) {
            console.error('❌ Error processing session:', error);
            return new Response('Error: Session processing failed', { status: 500 });
        }
    }

    // Unhandled event type
    console.log(`⚠️ Unhandled webhook event: ${eventType}`);
    return new Response('Webhook received', { status: 200 });
}