import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

interface TrackEventRequest {
    eventType: 'SEARCH_FILTER_CHANGE' | 'SEARCH_RESULT_CLICK' | 'PROFILE_VIEW' | 'INTRODUCTION_REQUEST';
    sessionId?: string;
    data: {
        professionalId?: string;
        source?: string;
        filters?: any;
        query?: string;
        page?: number;
        timestamp: string;
        [key: string]: any;
    };
}

/**
 * @swagger
 * /api/v1/analytics/track:
 *   post:
 *     summary: Track user analytics events
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventType:
 *                 type: string
 *                 enum: [SEARCH_FILTER_CHANGE, SEARCH_RESULT_CLICK, PROFILE_VIEW, INTRODUCTION_REQUEST]
 *               sessionId:
 *                 type: string
 *               data:
 *                 type: object
 *     responses:
 *       200:
 *         description: Event tracked successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { eventType, sessionId, data }: TrackEventRequest = await req.json();

        // Validate required fields and event type
        if (!eventType || !data || !data.timestamp) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const validEventTypes = ['SEARCH_FILTER_CHANGE', 'SEARCH_RESULT_CLICK', 'PROFILE_VIEW', 'INTRODUCTION_REQUEST'];
        if (!validEventTypes.includes(eventType)) {
            return NextResponse.json(
                { error: 'Invalid event type' },
                { status: 400 }
            );
        }

        // Get HR partner info for context
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: { id: true, companyId: true },
        });

        if (!hrPartner) {
            return NextResponse.json({ error: 'HR Partner not found' }, { status: 403 });
        }

        // Map event types to activity log actions
        const actionTypeMap = {
            SEARCH_FILTER_CHANGE: 'SEARCH_FILTER_CHANGE',
            SEARCH_RESULT_CLICK: 'SEARCH_RESULT_CLICK',
            PROFILE_VIEW: 'PROFILE_VIEW',
            INTRODUCTION_REQUEST: 'INTRODUCTION_REQUEST',
        };

        const actionType = actionTypeMap[eventType] || eventType;

        // Determine entity type based on event type and data
        let entityType: string;
        let entityId: string | null;

        if (eventType === 'SEARCH_RESULT_CLICK' && data.professionalId) {
            entityType = 'PROFESSIONAL';
            entityId = data.professionalId
        } else if (eventType === 'INTRODUCTION_REQUEST' && data.professionalId) {
            entityType = 'PROFESSIONAL';
            entityId = data.professionalId;
        } else if (eventType === 'PROFILE_VIEW' && data.professionalId) {
            entityType = 'PROFESSIONAL';
            entityId = data.professionalId;
        } else {
            entityType = 'SEARCH';
            entityId = null;
        }

        // Create activity log entry
        await prisma.userActivityLog.create({
            data: {
                userId,
                actionType,
                entityType,
                entityId,
                description: `${eventType.replaceAll('_', ' ').toLowerCase()} event`,
                metadata: {
                    eventType,
                    sessionId,
                    hrPartnerId: hrPartner.id,
                    companyId: hrPartner.companyId,
                    ...data,
                },
                searchSessionId: sessionId || null,
            },
        });

        // Handle specific event types
        if (eventType === 'PROFILE_VIEW' && data.professionalId) {

            // Validate viewSource - adjust valid values based on your Prisma schema
            const validViewSources = ['DIRECT', 'SEARCH', 'RECOMMENDATION'];
            const viewSource = data.source && validViewSources.includes(data.source)
                ? data.source
                : 'DIRECT';

            // Update or create profile view record
            await prisma.profileView.upsert({
                where: {
                    viewerHrId_viewedProfessionalId: {
                        viewerHrId: hrPartner.id,
                        viewedProfessionalId: data.professionalId,
                    },
                },
                update: {
                    viewedAt: new Date(),
                    viewSource: (data.source as any) || 'DIRECT',
                    // viewSource: data.source && validViewSources.includes(data.source)
                    //     ? data.source
                    //     : 'DIRECT'
                },
                create: {
                    viewerHrId: hrPartner.id,
                    viewedProfessionalId: data.professionalId,
                    viewSource: (data.source as any) || 'DIRECT',
                    viewedAt: new Date(),
                },
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json(
            { error: 'Failed to track event' },
            { status: 500 }
        );
    }
}
