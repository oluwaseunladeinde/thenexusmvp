import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/webhook/clerkjs:
 *   post:
 *     summary: Handle Clerk webhook events
 *     tags: [Webhooks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Clerk webhook payload
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook signature or missing headers
 *       500:
 *         description: Webhook processing failed or configuration error
 */
export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Webhook instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    // Verify the webhook
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', {
            status: 400,
        });
    }

    // Handle the webhook events
    const eventType = evt.type;

    // ============================================
    // USER CREATED - Sync to Prisma
    // ============================================
    if (eventType === 'user.created') {

        const validUserTypes = ['PROFESSIONAL', 'HR_PARTNER', 'ADMIN'] as const;
        const { id, email_addresses, phone_numbers, unsafe_metadata, public_metadata } = evt.data;

        try {
            const userType = validUserTypes.includes(unsafe_metadata?.userType as any)
                ? (public_metadata.userType as 'PROFESSIONAL' | 'HR_PARTNER' | 'ADMIN')
                : 'PROFESSIONAL'; // or throw an error if userType is required

            const email = email_addresses[0]?.email_address;
            if (!email) {
                console.error('User created without email address:', id);
                return new Response('User must have an email address', { status: 400 });
            }

            await prisma.user.create({
                data: {
                    id, // Use Clerk user ID as primary key
                    email,
                    phone: phone_numbers[0]?.phone_number || null,
                    passwordHash: '', // Clerk manages passwords
                    userType: userType.toUpperCase() as any,
                    status: 'PENDING',
                    emailVerified: email_addresses[0].verification?.status === 'verified',
                    phoneVerified: phone_numbers[0]?.verification?.status === 'verified',
                },
            });
            console.log(`✅ User synced to Prisma: ${id}`);

        } catch (error) {
            console.error('Error creating user:', error);
            return new Response('Error creating user', { status: 500 });
        }
    }

    // ============================================
    // USER UPDATED - Update Prisma
    // ============================================
    if (eventType === 'user.updated') {

        const { id, email_addresses, first_name, last_name, phone_numbers, unsafe_metadata } = evt.data;
        const email = email_addresses[0]?.email_address;
        if (!email) {
            console.error('User update without email address:', id);
            return new Response('User must have an email address', { status: 400 });
        }

        try {

            const onboardingComplete = unsafe_metadata?.onboardingComplete as boolean;

            await prisma.user.update({
                where: { clerkUserId: id },
                data: {
                    email,
                    phone: phone_numbers[0]?.phone_number || null,
                    emailVerified: email_addresses[0].verification?.status === 'verified',
                    phoneVerified: phone_numbers[0]?.verification?.status === 'verified',
                    status: onboardingComplete ? 'ACTIVE' : 'PENDING',
                },
            });

            console.log(`✅ User updated in Prisma: ${id}`);
        } catch (error) {
            console.error('Error updating user:', error);
            return new Response('Error updating user', { status: 500 });
        }
    }

    // ============================================
    // USER DELETED - Soft Delete in Prisma
    // ============================================
    if (eventType === 'user.deleted') {
        const { id } = evt.data;

        try {
            await prisma.user.update({
                where: { clerkUserId: id },
                data: {
                    status: 'DELETED',
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            return new Response('Error deleting user', { status: 500 });
        }
    }

    return new Response('Webhook processed', { status: 200 });
}
