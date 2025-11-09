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

        const professional = await prisma.professional.findUnique({
            where: { id: professionalId }
        });

        if (!professional) {
            return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
        }


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

        await prisma.$transaction(async (tx: any) => {
            const existingView = await tx.profileView.findFirst({
                where: {
                    viewedProfessionalId: professionalId,
                    viewerHrId: hrPartner.id,
                    viewedAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            });

            if (existingView) {
                return; // Handle duplicate
            }

            await tx.profileView.create({
                data: {
                    viewedProfessionalId: professionalId,
                    viewerHrId: hrPartner.id,
                    viewSource: 'DIRECT',
                    viewedAt: new Date()
                }
            });
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

        // Query previous 7 days for comparison
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const [views7Days, views30Days, totalViews, viewsPrevious7Days] = await Promise.all([
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
            }),
            prisma.profileView.count({
                where: {
                    viewedProfessionalId: professionalId,
                    viewedAt: {
                        gte: fourteenDaysAgo,
                        lt: sevenDaysAgo
                    }
                }
            })
        ]);

        const trend = views7Days > viewsPrevious7Days
            ? 'up'
            : views7Days < viewsPrevious7Days
                ? 'down'
                : 'neutral';

        return NextResponse.json({
            views7Days,
            views30Days,
            totalViews,
            trend,
        });

    } catch (error) {
        console.error('Error fetching profile views:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
