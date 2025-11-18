import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userRecord = await prisma.user.findUnique({
            where: { clerkUserId: user.id },
            include: { professional: true }
        });

        if (!userRecord || !userRecord.professional) {
            return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
        }

        const professional = userRecord.professional;

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Get recent introduction requests
        const recentIntroductions = await prisma.introductionRequest.findMany({
            where: {
                sentToProfessionalId: professional.id,
                sentAt: { gte: sevenDaysAgo }
            },
            include: {
                company: true,
                jobRole: true
            },
            orderBy: { sentAt: 'desc' },
            take: 10
        });

        // Get recent profile views
        const recentViews = await prisma.profileView.findMany({
            where: {
                viewedProfessionalId: professional.id,
                viewedAt: { gte: sevenDaysAgo }
            },
            include: {
                viewer: {
                    include: { company: true }
                }
            },
            orderBy: { viewedAt: 'desc' },
            take: 10
        });

        // Format activities
        const activities = [
            ...recentIntroductions.map(intro => ({
                id: intro.id,
                type: 'introduction_request' as const,
                title: intro.status === 'PENDING' ? 'New Introduction Request' :
                    intro.status === 'ACCEPTED' ? 'Introduction Accepted' : 'Introduction Declined',
                description: `${intro.company?.companyName ?? 'A company'} sent you an introduction request for ${intro.jobRole?.roleTitle ?? 'a position'}`,
                timestamp: intro.sentAt.toISOString(),
                actionUrl: '/professional/introductions',
                isNew: !intro.viewedByProfessional && intro.status === 'PENDING'
            })),
            ...recentViews.map(view => ({
                id: view.id,
                type: 'profile_view' as const,
                title: 'Profile Viewed',
                description: `Your profile was viewed by an HR partner${view.viewer?.company ? ` at ${view.viewer.company.companyName}` : ''}`,
                timestamp: view.viewedAt.toISOString(),
                isNew: false
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return NextResponse.json({ activities: activities.slice(0, 10) });

    } catch (error) {
        console.error('Error fetching activity:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
