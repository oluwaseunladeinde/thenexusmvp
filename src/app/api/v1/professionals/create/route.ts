import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { prisma } from '@/lib/database/prisma'

const createProfessionalSchema = z.object({
    // Basic Info
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    profileHeadline: z.string().min(1, 'Profile headline is required').max(200),
    locationState: z.string().min(1, 'State is required'),
    locationCity: z.string().min(1, 'City is required'),
    yearsOfExperience: z.number().min(0).max(50),
    currentTitle: z.string().min(1, 'Current title is required'),
    currentCompany: z.string().min(1, 'Current company is required'),
    currentIndustry: z.string().min(1, 'Industry is required'),

    // Career Expectations
    salaryExpectationMax: z.number().min(0),
    salaryExpectationMin: z.number().min(0),
    noticePeriod: z.string().min(1, 'Notice period is required'),
    willingToRelocate: z.boolean(),
    openToOpportunities: z.boolean(),

    // Skills & Links
    skills: z.array(z.string().min(1)).min(1, 'At least one skill is required').max(10),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    portfolioUrl: z.string().url().optional().or(z.literal('')),
    resumeUrl: z.string().url().optional().or(z.literal('')),
}).refine(data => data.salaryExpectationMin <= data.salaryExpectationMax, {
    message: 'Minimum salary cannot exceed maximum salary',
    path: ['salaryExpectationMin'],
})

/**
 * @swagger
 * /api/v1/professionals/create:
 *   post:
 *     summary: Create a professional profile during onboarding
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - profileHeadline
 *               - locationState
 *               - locationCity
 *               - yearsOfExperience
 *               - currentTitle
 *               - currentCompany
 *               - currentIndustry
 *               - salaryExpectationMax
 *               - salaryExpectationMin
 *               - noticePeriod
 *               - willingToRelocate
 *               - openToOpportunities
 *               - skills
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 1
 *                 description: Professional's first name
 *               lastName:
 *                 type: string
 *                 minLength: 1
 *                 description: Professional's last name
 *               profileHeadline:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 200
 *                 description: Professional headline
 *               locationState:
 *                 type: string
 *                 minLength: 1
 *                 description: State location
 *               locationCity:
 *                 type: string
 *                 minLength: 1
 *                 description: City location
 *               yearsOfExperience:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 50
 *                 description: Years of professional experience
 *               currentTitle:
 *                 type: string
 *                 minLength: 1
 *                 description: Current job title
 *               currentCompany:
 *                 type: string
 *                 minLength: 1
 *                 description: Current company name
 *               currentIndustry:
 *                 type: string
 *                 minLength: 1
 *                 description: Current industry
 *               salaryExpectationMax:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum salary expectation
 *               salaryExpectationMin:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum salary expectation
 *               noticePeriod:
 *                 type: string
 *                 minLength: 1
 *                 description: Notice period for job change
 *               willingToRelocate:
 *                 type: boolean
 *                 description: Willingness to relocate
 *               openToOpportunities:
 *                 type: boolean
 *                 description: Open to new opportunities
 *               skills:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 10
 *                 items:
 *                   type: string
 *                   minLength: 1
 *                 description: Professional skills
 *               linkedinUrl:
 *                 type: string
 *                 format: uri
 *                 description: LinkedIn profile URL
 *               portfolioUrl:
 *                 type: string
 *                 format: uri
 *                 description: Portfolio website URL
 *               resumeUrl:
 *                 type: string
 *                 format: uri
 *                 description: Resume/CV URL
 *     responses:
 *       201:
 *         description: Professional profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Professional profile created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     professionalId:
 *                       type: string
 *                     onboardingCompleted:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation failed"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found. Please complete registration first."
 *       409:
 *         description: Professional profile already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Professional profile already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const { userId: clerkUserId } = await auth()

        if (!clerkUserId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Parse and validate request body
        const body = await request.json()
        const validatedData = createProfessionalSchema.parse(body)

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { clerkUserId },
            include: { professional: true },
        })

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found. Please complete registration first.' },
                { status: 404 }
            )
        }

        if (existingUser.professional) {
            return NextResponse.json(
                { error: 'Professional profile already exists' },
                { status: 409 }
            )
        }

        // Convert notice period to days
        const noticePeriodDays = getNoticePeriodDays(validatedData.noticePeriod)

        // Update Clerk metadata first (fail fast if Clerk is unavailable)
        try {
            const clerk = await clerkClient();
            await clerk.users.updateUserMetadata(clerkUserId, {
                publicMetadata: {
                    userType: 'professional',
                    onboardingComplete: true,
                }
            });
        } catch (clerkError) {
            return NextResponse.json(
                { error: 'Failed to update user metadata. Please try again.' },
                { status: 500 }
            );
        }

        // Create professional profile and skills in a transaction
        const professional = await prisma.$transaction(async (tx) => {
            const newProfessional = await tx.professional.create({
                data: {
                    userId: existingUser.id,
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
                    profileHeadline: validatedData.profileHeadline,
                    locationState: validatedData.locationState,
                    locationCity: validatedData.locationCity,
                    yearsOfExperience: validatedData.yearsOfExperience,
                    currentTitle: validatedData.currentTitle,
                    currentCompany: validatedData.currentCompany,
                    currentIndustry: validatedData.currentIndustry,
                    salaryExpectationMin: validatedData.salaryExpectationMin,
                    salaryExpectationMax: validatedData.salaryExpectationMax,
                    noticePeriodDays,
                    willingToRelocate: validatedData.willingToRelocate,
                    openToOpportunities: validatedData.openToOpportunities,
                    linkedinUrl: validatedData.linkedinUrl || null,
                    portfolioUrl: validatedData.portfolioUrl || null,
                    resumeUrl: validatedData.resumeUrl || null,
                    onboardingCompleted: true,
                    profileCompleteness: 100, // Full profile
                },
            });

            if (validatedData.skills.length > 0) {
                await tx.professionalSkill.createMany({
                    data: validatedData.skills.map((skillName, index) => ({
                        professionalId: newProfessional.id,
                        skillName,
                        proficiencyLevel: 'INTERMEDIATE' as const,
                        isPrimarySkill: index < 3,
                    })),
                });
            }

            return newProfessional;
        });

        // Update Clerk metadata after successful DB transaction
        try {
            const clerk = await clerkClient();
            await clerk.users.updateUserMetadata(clerkUserId, {
                publicMetadata: {
                    userType: 'professional',
                    onboardingComplete: true,
                    professionalId: professional.id,
                }
            });
        } catch (clerkError) {
            // Log error but don't rollback since DB transaction succeeded
            console.error('Failed to update professionalId in Clerk metadata:', clerkError);
            // Professional profile was created successfully, so we can continue
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Professional profile created successfully',
                data: {
                    professionalId: professional.id,
                    onboardingCompleted: true,
                },
            },
            { status: 201 }
        )

    } catch (error) {
        console.error('Error creating professional profile:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: error.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Helper function to convert notice period string to days
function getNoticePeriodDays(noticePeriod: string): number {
    const mapping: Record<string, number> = {
        'immediate': 0,
        '1_week': 7,
        '2_weeks': 14,
        '1_month': 30,
        '2_months': 60,
        '3_months': 90,
        '6_months': 180,
    }

    return mapping[noticePeriod] ?? 30 // Default to 30 days
}
