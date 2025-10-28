import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const createProfessionalSchema = z.object({
    userId: z.string(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    profileHeadline: z.string().min(10).max(200),
    locationCity: z.string().min(1),
    locationState: z.string().min(1),
    yearsOfExperience: z.number().min(5),
    currentTitle: z.string().min(1),
    currentCompany: z.string().optional(),
    currentIndustry: z.string().min(1),
    salaryExpectationMin: z.number().optional(),
    salaryExpectationMax: z.number().optional(),
    linkedinUrl: z.string().url().optional(),
});

/**
 * @swagger
 * /api/v1/professionals:
 *   post:
 *     summary: Create a new professional profile
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
 *               - userId
 *               - firstName
 *               - lastName
 *               - profileHeadline
 *               - locationCity
 *               - locationState
 *               - yearsOfExperience
 *               - currentTitle
 *               - currentIndustry
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Clerk user ID
 *               firstName:
 *                 type: string
 *                 minLength: 1
 *               lastName:
 *                 type: string
 *                 minLength: 1
 *               profileHeadline:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 200
 *               locationCity:
 *                 type: string
 *                 minLength: 1
 *               locationState:
 *                 type: string
 *                 minLength: 1
 *               yearsOfExperience:
 *                 type: number
 *                 minimum: 5
 *               currentTitle:
 *                 type: string
 *                 minLength: 1
 *               currentCompany:
 *                 type: string
 *               currentIndustry:
 *                 type: string
 *                 minLength: 1
 *               salaryExpectationMin:
 *                 type: number
 *               salaryExpectationMax:
 *                 type: number
 *               linkedinUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Professional profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 professional:
 *                   $ref: '#/components/schemas/Professional'
 *                 message:
 *                   type: string
 *                   example: "Your professional profile has been created successfully"
 *       400:
 *         description: Invalid input data or profile already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: object
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *   get:
 *     summary: Get professionals (admin only)
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Professionals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 companyId:
 *                   type: string
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
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = createProfessionalSchema.parse(body);

        // Check if user already has a professional profile
        const existingProfessional = await prisma.professional.findUnique({
            where: { userId },
        });

        if (existingProfessional) {
            return NextResponse.json(
                { error: 'Professional profile already exists' },
                { status: 400 }
            );
        }

        // Create professional profile
        const professional = await prisma.professional.create({
            data: {
                userId: validatedData.userId,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                profileHeadline: validatedData.profileHeadline,
                locationCity: validatedData.locationCity,
                locationState: validatedData.locationState,
                yearsOfExperience: validatedData.yearsOfExperience,
                currentTitle: validatedData.currentTitle,
                currentCompany: validatedData.currentCompany,
                currentIndustry: validatedData.currentIndustry,
                salaryExpectationMin: validatedData.salaryExpectationMin,
                salaryExpectationMax: validatedData.salaryExpectationMax,
                linkedinUrl: validatedData.linkedinUrl,
                openToOpportunities: true,
                confidentialSearch: true,
                profileVisibility: 'PRIVATE',
                verificationStatus: 'UNVERIFIED',
                onboardingCompleted: true,
            },
        });

        return NextResponse.json({
            success: true,
            professional,
            message: 'Your professional profile has been created successfully',
        });

    } catch (error: any) {
        console.error('Error creating professional:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to create professional profile' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Type-safe metadata access
    const userType = sessionClaims?.metadata?.userType;
    const companyId = sessionClaims?.metadata?.companyId;

    if (userType !== 'professional' && userType !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Proceed with HProfessional-specific logic
    return NextResponse.json({ success: true, companyId });
}