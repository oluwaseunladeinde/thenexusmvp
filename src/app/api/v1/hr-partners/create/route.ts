import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';
import { clerkClient } from '@clerk/nextjs/server';

const createHrPartnerSchema = z.object({
    userId: z.string(),
    userEmail: z.string().email(),
    // Step 1: Personal Info
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    jobTitle: z.string().min(2, 'Job title is required'),
    department: z.string().min(2, 'Department is required'),
    linkedinUrl: z.string().url().optional().or(z.literal('')),

    // Step 2: Company Info
    companyName: z.string().min(2, 'Company name is required'),
    industry: z.string().min(1, 'Industry is required'),
    companySize: z.string().min(1, 'Company size is required'),
    companyWebsite: z.string().url().optional().or(z.literal('')),
    companyDescription: z.string().min(10, 'Company description is required'),
    headquartersLocation: z.string().min(2, 'Headquarters location is required'),
    companyLogoUrl: z.string().optional(),

    // Step 3: Hiring Plans
    hiringTimeline: z.string().min(1, 'Hiring timeline is required'),
    numberOfRoles: z.string().min(1, 'Number of roles is required'),
    teamSize: z.string().min(1, 'Team size is required'),
});

// Helper function to map company size strings to enum values
function mapCompanySize(sizeString: string) {
    const sizeMap: Record<string, string> = {
        '1-10 employees': 'SMALL_1_10',
        '11-50 employees': 'MEDIUM_11_50',
        '51-200 employees': 'LARGE_51_200',
        '201-500 employees': 'XLARGE_201_500',
        '501-1000 employees': 'ENTERPRISE_500_PLUS',
        '1001-5000 employees': 'ENTERPRISE_500_PLUS',
        '5000+ employees': 'ENTERPRISE_500_PLUS'
    };

    return sizeMap[sizeString] || 'MEDIUM_11_50'; // Default fallback
}

/**
 * @swagger
 * /api/v1/hr-partners/create:
 *   post:
 *     summary: Create HR partner and company profile during onboarding
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
 *               - userEmail
 *               - firstName
 *               - lastName
 *               - jobTitle
 *               - department
 *               - companyName
 *               - industry
 *               - companySize
 *               - companyDescription
 *               - headquartersLocation
 *               - hiringTimeline
 *               - numberOfRoles
 *               - teamSize
 *     responses:
 *       201:
 *         description: HR partner and company created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: HR partner already exists
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate request data
        const validatedData = createHrPartnerSchema.parse(body);

        // Check if user already has an HR partner profile
        const existingHrPartner = await prisma.hrPartner.findUnique({
            where: { userId: userId }
        });

        if (existingHrPartner) {
            return NextResponse.json(
                { error: 'HR partner profile already exists' },
                { status: 409 }
            );
        }

        // Start transaction to create company and HR partner
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create company first
            const company = await tx.company.create({
                data: {
                    companyName: validatedData.companyName,
                    industry: validatedData.industry,
                    companySize: mapCompanySize(validatedData.companySize) as any,
                    companyWebsite: validatedData.companyWebsite || null,
                    companyDescription: validatedData.companyDescription,
                    headquartersLocation: validatedData.headquartersLocation,
                    // Generate domain from website or company name
                    domain: validatedData.companyWebsite
                        ? new URL(validatedData.companyWebsite).hostname
                        : validatedData.companyName.toLowerCase().replace(/\s+/g, '-') + '.com',
                    // Default values for required fields
                    companyLogoUrl: validatedData.companyLogoUrl || null,
                    foundedYear: null,
                    // Trial settings
                    subscriptionTier: 'TRIAL',
                    subscriptionExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
                    introductionCredits: 5,
                }
            });

            // 2. Create HR partner linked to company
            const hrPartner = await tx.hrPartner.create({
                data: {
                    userId: userId,
                    firstName: validatedData.firstName,
                    lastName: validatedData.lastName,
                    jobTitle: validatedData.jobTitle,
                    department: validatedData.department,
                    linkedinUrl: validatedData.linkedinUrl || null,
                    companyId: company.id,
                    roleInPlatform: 'OWNER', // First HR partner is owner
                    canCreateRoles: true,
                    canSendIntroductions: true,
                    canManageBilling: true,
                }
            });

            return { company, hrPartner };
        });

        // 3. Update Clerk user metadata
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(userId, {
            publicMetadata: {
                userType: 'hr-partner',
                onboardingComplete: true,
                companyId: result.company.id,
                hrPartnerId: result.hrPartner.id,
            },
            privateMetadata: {
                trialEndDate: result.company.subscriptionExpiresAt,
                introductionCredits: result.company.introductionCredits,
                hiringTimeline: validatedData.hiringTimeline,
                numberOfRoles: validatedData.numberOfRoles,
                teamSize: validatedData.teamSize,
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                hrPartner: {
                    id: result.hrPartner.id,
                    firstName: result.hrPartner.firstName,
                    lastName: result.hrPartner.lastName,
                    jobTitle: result.hrPartner.jobTitle,
                    department: result.hrPartner.department,
                    companyId: result.hrPartner.companyId,
                },
                company: {
                    id: result.company.id,
                    companyName: result.company.companyName,
                    industry: result.company.industry,
                    companySize: result.company.companySize,
                },
                trial: {
                    expiresAt: result.company.subscriptionExpiresAt,
                    introductionCredits: result.company.introductionCredits,
                }
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating HR partner:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Invalid request data',
                    details: error.issues
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
