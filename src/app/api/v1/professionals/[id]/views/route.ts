import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: professionalId } = await params;

        // Get the HR partner viewing the profile
        const hrPartner = await prisma.hrPartner.findFirst({
            where: {
                user: {
                    clerkUserId: user.id
                }
            }
        });

        if (!hrPartner) {
            return NextResponse.json({ error: 'HR Partner not found' }, { status: 404 });
        }

        // Check if view already exists in last 24 hours (prevent duplicates)
        const existingView = await prisma.profileView.findFirst({
            where: {
                viewedProfessionalId: professionalId,
                viewerHrId: hrPartner.id,
                viewedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            }
        });

        if (existingView) {
            return NextResponse.json({ message: 'View already recorded' }, { status: 200 });
        }

        // Create new profile view
        await prisma.profileView.create({
            data: {
                viewedProfessionalId: professionalId,
                viewerHrId: hrPartner.id,
                viewSource: 'DIRECT',
                viewedAt: new Date()
            }
        });

        return NextResponse.json({ message: 'Profile view recorded' }, { status: 201 });

    } catch (error) {
        console.error('Error recording profile view:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: professionalId } = await params;

        // Get view stats for the professional
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [views7Days, views30Days, totalViews] = await Promise.all([
            prisma.profileView.count({
                where: {
                    viewedProfessionalId: professionalId,
                    viewedAt: { gte: sevenDaysAgo }
                }
            }),
            prisma.profileView.count({
                where: {
                    viewedProfessionalId: professionalId,
                    viewedAt: { gte: thirtyDaysAgo }
                }
            }),
            prisma.profileView.count({
                where: { viewedProfessionalId: professionalId }
            })
        ]);

        return NextResponse.json({
            views7Days,
            views30Days,
            totalViews,
            trend: views7Days > 0 ? 'up' : 'neutral'
        });

    } catch (error) {
        console.error('Error fetching profile views:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
