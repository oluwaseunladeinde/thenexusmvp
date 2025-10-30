import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const createHrPartnerSchema = z.object({
    userId: z.string(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    jobTitle: z.string().min(1),
    department: z.string().optional(),
    linkedinUrl: z.string().url().optional(),
    company: z.object({
        companyName: z.string().min(1),
        industry: z.string().min(1),
        companySize: z.string().min(1),
        headquartersLocation: z.string().min(1),
        companyWebsite: z.string().url(),
        companyDescription: z.string().min(10),
    }),
    dualRole: z
        .object({
            profileHeadline: z.string().min(10),
            locationCity: z.string().min(1),
            locationState: z.string().min(1),
            yearsOfExperience: z.number().min(5),
            currentTitle: z.string().min(1),
            currentIndustry: z.string().min(1),
        })
        .nullable(),
});

/**
 * @swagger
 * /api/v1/hr-partners/create:
 *   post:
 *     summary: Create an HR partner profile during onboarding
 *     tags: [HR Partners]
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
 *               - jobTitle
 *               - company
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Clerk user ID
 *               firstName:
 *                 type: string
 *                 minLength: 1
 *                 description: HR partner's first name
 *               lastName:
 *                 type: string
 *                 minLength: 1
 *                 description: HR partner's last name
 *               jobTitle:
 *                 type: string
 *                 minLength: 1
 *                 description: Job title
 *               department:
 *                 type: string
 *                 description: Department name
 *               linkedinUrl:
 *                 type: string
 *                 format: uri
 *                 description: LinkedIn profile URL
 *               company:
 *                 type: object
 *                 required:
 *                   - companyName
 *                   - industry
 *                   - companySize
 *                   - headquartersLocation
 *                   - companyWebsite
 *                   - companyDescription
 *                 properties:
 *                   companyName:
 *                     type: string
 *                     minLength: 1
 *                     description: Company name
 *                   industry:
 *                     type: string
 *                     minLength: 1
 *                     description: Company industry
 *                   companySize:
 *                     type: string
 *                     minLength: 1
 *                     description: Company size category
 *                   headquartersLocation:
 *                     type: string
 *                     minLength: 1
 *                     description: Company headquarters location
 *                   companyWebsite:
 *                     type: string
 *                     format: uri
 *                     description: Company website URL
 *                   companyDescription:
 *                     type: string
 *                     minLength: 10
 *                     description: Company description
 *               dualRole:
 *                 type: object
 *                 nullable: true
 *                 required:
 *                   - profileHeadline
 *                   - locationCity
 *                   - locationState
 *                   - yearsOfExperience
 *                   - currentTitle
 *                   - currentIndustry
 *                 properties:
 *                   profileHeadline:
 *                     type: string
 *                     minLength: 10
 *                     description: Professional profile headline
 *                   locationCity:
 *                     type: string
 *                     minLength: 1
 *                     description: City location
 *                   locationState:
 *                     type: string
 *                     minLength: 1
 *                     description: State location
 *                   yearsOfExperience:
 *                     type: number
 *                     minimum: 5
 *                     description: Years of experience
 *                   currentTitle:
 *                     type: string
 *                     minLength: 1
 *                     description: Current job title
 *                   currentIndustry:
 *                     type: string
 *                     minLength: 1
 *                     description: Current industry
 *     responses:
 *       200:
 *         description: HR partner profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 hrPartner:
 *                   $ref: '#/components/schemas/HrPartner'
 *                 company:
 *                   $ref: '#/components/schemas/Company'
 *                 professional:
 *                   $ref: '#/components/schemas/Professional'
 *                 message:
 *                   type: string
 *                   example: "HR partner profile created successfully"
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
 */

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validatedData = createHrPartnerSchema.parse(body);

        // Check if user already has HR partner profile
        const existingHrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
        });

        if (existingHrPartner) {
            return NextResponse.json({ error: 'HR partner profile already exists' }, { status: 400 });
        }

        // Create company (or find existing)
        let company = await prisma.company.findFirst({
            where: { companyName: validatedData.company.companyName },
        });

        if (!company) {
            company = await prisma.company.create({
                data: {
                    companyName: validatedData.company.companyName,
                    industry: validatedData.company.industry,
                    companySize: validatedData.company.companySize as any,
                    headquartersLocation: validatedData.company.headquartersLocation,
                    companyWebsite: validatedData.company.companyWebsite,
                    companyDescription: validatedData.company.companyDescription,
                    domain: new URL(validatedData.company.companyWebsite).hostname,
                    verificationStatus: 'PENDING',
                    status: 'ACTIVE',
                    subscriptionTier: 'TRIAL',
                    introductionCredits: 5, // Trial credits
                },
            });
        }

        // Create professional profile if dual role requested
        let professional = null;
        if (validatedData.dualRole) {
            professional = await prisma.professional.create({
                data: {
                    userId,
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
                    profileHeadline: validatedData.dualRole.profileHeadline,
                    locationCity: validatedData.dualRole.locationCity,
                    locationState: validatedData.dualRole.locationState,
                    yearsOfExperience: validatedData.dualRole.yearsOfExperience,
                    currentTitle: validatedData.dualRole.currentTitle,
                    currentIndustry: validatedData.dualRole.currentIndustry,
                    isAlsoHrPartner: true,
                    hideFromCompanyIds: [company.id], // CRITICAL: Block current company
                    confidentialSearch: true,
                    profileVisibility: 'PRIVATE',
                    openToOpportunities: true,
                    verificationStatus: 'UNVERIFIED',
                    onboardingCompleted: true,
                },
            });
        }

        // Create HR partner
        const hrPartner = await prisma.hrPartner.create({
            data: {
                userId,
                companyId: company.id,
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                jobTitle: validatedData.jobTitle,
                department: validatedData.department,
                linkedinUrl: validatedData.linkedinUrl,
                roleInPlatform: 'OWNER', // First HR partner is owner
                canCreateRoles: true,
                canSendIntroductions: true,
                canManageBilling: true,
                alsoProfessional: !!professional,
                professionalId: professional?.id,
                status: 'ACTIVE',
            },
        });

        return NextResponse.json({
            success: true,
            hrPartner,
            company,
            professional,
            message: 'HR partner profile created successfully',
        });
    } catch (error: any) {
        console.error('Error creating HR partner:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to create HR partner profile' },
            { status: 500 }
        );
    }
}