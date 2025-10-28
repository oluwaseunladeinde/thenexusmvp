import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { professionalUpdateSchema } from '@/lib/schemas/api-schemas';
import { ZodError } from 'zod';
import logger from "@/lib/services/logger";
import { calculateProfileCompleteness } from '@/lib/services/profileCompletenessCalculator';

/**
 * Helper function to fetch city and state names based on IDs
 */
async function getLocationNames(cityId: string | null, stateId: string | null) {
    const [city, state] = await Promise.all([
        cityId ? prisma.city.findUnique({ where: { id: cityId }, select: { name: true } }) : null,
        stateId ? prisma.state.findUnique({ where: { id: stateId }, select: { name: true } }) : null,
    ]);

    return {
        cityName: city?.name || null,
        stateName: state?.name || null,
    };
}

/**
 * @swagger
 * /api/v1/professionals/me:
 *   get:
 *     summary: Get current professional profile
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Professional profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Professional profile not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *   put:
 *     summary: Update current professional profile
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfessionalUpdateData'
 *     responses:
 *       200:
 *         description: Professional profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */

export async function PUT(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userType = user.unsafeMetadata?.userType as string;
        console.log("professional onboarding ", { userType });
        if (!userType || userType !== 'professional') {
            return NextResponse.json({ error: 'Forbidden: Professional access required' }, { status: 403 });
        }

        const body = await request.json();

        const validatedBody = professionalUpdateSchema.parse(body);

        // Build update data dynamically from validated body
        const updateData: any = {
            updatedAt: new Date()
        };

        // Only include fields that are provided in the request
        if (validatedBody.preferredName !== undefined) updateData.preferredName = validatedBody.preferredName || null;
        if (validatedBody.profileHeadline !== undefined) updateData.profileHeadline = validatedBody.profileHeadline;
        if (validatedBody.profileSummary !== undefined) updateData.profileSummary = validatedBody.profileSummary || null;
        if (validatedBody.currentTitle !== undefined) updateData.currentTitle = validatedBody.currentTitle;
        if (validatedBody.currentCompany !== undefined) updateData.currentCompany = validatedBody.currentCompany;
        if (validatedBody.currentIndustry !== undefined) updateData.currentIndustry = validatedBody.currentIndustry;
        if (validatedBody.locationCity !== undefined) updateData.locationCity = validatedBody.locationCity;
        if (validatedBody.locationState !== undefined) updateData.locationState = validatedBody.locationState;
        if (validatedBody.willingToRelocate !== undefined) updateData.willingToRelocate = validatedBody.willingToRelocate;
        if (validatedBody.salaryExpectationMin !== undefined) updateData.salaryExpectationMin = validatedBody.salaryExpectationMin;
        if (validatedBody.salaryExpectationMax !== undefined) updateData.salaryExpectationMax = validatedBody.salaryExpectationMax;
        if (validatedBody.noticePeriodDays !== undefined) updateData.noticePeriodDays = validatedBody.noticePeriodDays;
        if (validatedBody.openToOpportunities !== undefined) updateData.openToOpportunities = validatedBody.openToOpportunities;
        if (validatedBody.confidentialSearch !== undefined) updateData.confidentialSearch = validatedBody.confidentialSearch;
        if (validatedBody.linkedinUrl !== undefined) updateData.linkedinUrl = validatedBody.linkedinUrl || null;
        if (validatedBody.portfolioUrl !== undefined) updateData.portfolioUrl = validatedBody.portfolioUrl || null;
        if (validatedBody.workHistory !== undefined) updateData.workHistory = {
            deleteMany: {},
            create: validatedBody.workHistory
        };

        // Update professional profile
        const updatedProfessional = await prisma.professional.update({
            where: { userId: user.id },
            data: updateData
        });

        // Calculate comprehensive profile completeness
        const professionalWithRelations = await prisma.professional.findUnique({
            where: { userId: user.id },
            include: {
                skills: true,
                workHistory: true,
                education: true,
                certifications: true,
                user: {
                    select: {
                        phoneVerified: true,
                        emailVerified: true,
                    },
                },
            },
        });

        if (!professionalWithRelations) {
            return NextResponse.json({ error: 'Professional data not found' }, { status: 400 });
        }

        // Calculate profile completeness
        const completenessBreakdown = calculateProfileCompleteness(professionalWithRelations);

        // Update profile completeness
        await prisma.professional.update({
            where: { userId: user.id },
            data: { profileCompleteness: completenessBreakdown.overall }
        });

        return NextResponse.json({
            message: 'Profile updated successfully',
            data: {
                professional: updatedProfessional,
                profileCompleteness: completenessBreakdown?.overall || 0,
                completenessBreakdown
            }
        }, { status: 200 });

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.issues
            }, { status: 422 });
        }

        logger.error('Update professional profile error:', error); // Keep for debugging, remove in prod
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { userId, sessionClaims } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log({ userId });

        const professional = await prisma.professional.findUnique({
            where: { userId },
            include: {
                skills: {
                    orderBy: { isPrimarySkill: 'desc' },
                },
                workHistory: {
                    orderBy: { startDate: 'desc' },
                    take: 3,
                },
                education: {
                    orderBy: { endYear: 'desc' },
                    take: 2,
                },
                certifications: {
                    orderBy: { issueDate: 'desc' },
                    take: 2,
                },
                introductionRequests: {
                    where: {
                        status: 'PENDING',
                    },
                    include: {
                        jobRole: {
                            include: {
                                company: true,
                            },
                        },
                    },
                    orderBy: { sentAt: 'desc' },
                    take: 5,
                },
                user: {
                    select: {
                        email: true,
                        phone: true,
                        phoneVerified: true,
                        emailVerified: true,
                    },
                }
            },
        });

        // Fetch location names
        const locationNames = await getLocationNames(professional?.locationCity || null, professional?.locationState || null);

        if (!professional) {
            return NextResponse.json(
                { error: 'Professional profile not found' },
                { status: 404 }
            );
        }

        // Get stats
        const stats = await prisma.introductionRequest.groupBy({
            by: ['status'],
            where: {
                sentToProfessionalId: professional.id,
            },
            _count: true,
        });

        const profileViews = await prisma.profileView.count({
            where: {
                viewedProfessionalId: professional.id,
                viewedAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
            },
        });

        // Calculate comprehensive profile completeness
        const completenessBreakdown = calculateProfileCompleteness(professional);

        return NextResponse.json({
            message: 'Professional profile retrieved successfully',
            data: {
                professional: {
                    ...professional,
                    ...locationNames,
                },
                stats: {
                    pending: stats.find((s: { status: string; _count: number }) => s.status === 'pending')?._count || 0,
                    accepted: stats.find((s: { status: string; _count: number }) => s.status === 'accepted')?._count || 0,
                    declined: stats.find((s: { status: string; _count: number }) => s.status === 'declined')?._count || 0,
                    profileViews,
                },
                completeness: completenessBreakdown,
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Fetch professional profile error:', error); // Keep for debugging, remove in prod
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
