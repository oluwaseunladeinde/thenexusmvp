import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const createJobRoleSchema = z.object({
  roleTitle: z.string().min(1),
  roleDescription: z.string().min(1),
  responsibilities: z.string().optional(),
  requirements: z.string().min(1),
  preferredQualifications: z.string().optional(),
  seniorityLevel: z.enum(['SENIOR', 'DIRECTOR', 'VP', 'C_SUITE', 'EXECUTIVE']),
  industry: z.string().min(1),
  department: z.string().optional(),
  locationCity: z.string().min(1),
  locationState: z.string().min(1),
  remoteOption: z.enum(['ON_SITE', 'HYBRID', 'REMOTE']).default('ON_SITE'),
  employmentType: z.enum(['FULL_TIME', 'CONTRACT', 'CONSULTING']).default('FULL_TIME'),
  salaryRangeMin: z.number().min(0),
  salaryRangeMax: z.number().min(0),
  benefits: z.string().optional(),
  yearsExperienceMin: z.number().min(0).default(5),
  yearsExperienceMax: z.number().optional(),
  requiredSkills: z.array(z.string()).optional(),
  preferredSkills: z.array(z.string()).optional(),
  isConfidential: z.boolean().default(false),
  confidentialReason: z.string().optional(),
  applicationDeadline: z.string().optional(),
  expectedStartDate: z.string().optional(),
});

/**
 * @swagger
 * /api/v1/job-roles:
 *   post:
 *     summary: Create a new job role
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleTitle
 *               - roleDescription
 *               - requirements
 *               - seniorityLevel
 *               - industry
 *               - locationCity
 *               - locationState
 *               - salaryRangeMin
 *               - salaryRangeMax
 *             properties:
 *               roleTitle:
 *                 type: string
 *                 minLength: 1
 *                 description: Job role title
 *                 example: "Senior Software Engineer"
 *               roleDescription:
 *                 type: string
 *                 minLength: 1
 *                 description: Detailed job description
 *               responsibilities:
 *                 type: string
 *                 description: Key responsibilities (optional)
 *               requirements:
 *                 type: string
 *                 minLength: 1
 *                 description: Required qualifications and experience
 *               preferredQualifications:
 *                 type: string
 *                 description: Preferred qualifications (optional)
 *               seniorityLevel:
 *                 type: string
 *                 enum: [DIRECTOR, VP, C_SUITE, EXECUTIVE]
 *                 description: Required seniority level
 *               industry:
 *                 type: string
 *                 minLength: 1
 *                 description: Industry sector
 *                 example: "Technology"
 *               department:
 *                 type: string
 *                 description: Department (optional)
 *                 example: "Engineering"
 *               locationCity:
 *                 type: string
 *                 minLength: 1
 *                 description: Job location city
 *                 example: "Lagos"
 *               locationState:
 *                 type: string
 *                 minLength: 1
 *                 description: Job location state
 *                 example: "Lagos"
 *               remoteOption:
 *                 type: string
 *                 enum: [ON_SITE, HYBRID, REMOTE]
 *                 default: ON_SITE
 *                 description: Remote work option
 *               employmentType:
 *                 type: string
 *                 enum: [FULL_TIME, CONTRACT, CONSULTING]
 *                 default: FULL_TIME
 *                 description: Employment type
 *               salaryRangeMin:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum salary in Naira
 *                 example: 5000000
 *               salaryRangeMax:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum salary in Naira
 *                 example: 8000000
 *               benefits:
 *                 type: string
 *                 description: Benefits and perks (optional)
 *               yearsExperienceMin:
 *                 type: number
 *                 minimum: 0
 *                 default: 5
 *                 description: Minimum years of experience required
 *               yearsExperienceMax:
 *                 type: number
 *                 description: Maximum years of experience (optional)
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required skills (optional)
 *                 example: ["JavaScript", "React", "Node.js"]
 *               preferredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Preferred skills (optional)
 *                 example: ["TypeScript", "AWS"]
 *               isConfidential:
 *                 type: boolean
 *                 default: false
 *                 description: Whether this is a confidential search
 *               confidentialReason:
 *                 type: string
 *                 description: Reason for confidentiality (required if isConfidential is true)
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *                 description: Application deadline (optional)
 *               expectedStartDate:
 *                 type: string
 *                 format: date
 *                 description: Expected start date (optional)
 *     responses:
 *       201:
 *         description: Job role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccess'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: HR partner not found
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
 *   get:
 *     summary: Get job roles for HR partner's company
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, ACTIVE, PAUSED, FILLED, CLOSED]
 *         description: Filter by job role status
 *     responses:
 *       200:
 *         description: Job roles retrieved successfully
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
 *         description: HR partner not found
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
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hrPartner = await prisma.hrPartner.findUnique({
      where: { userId }
    });

    if (!hrPartner) {
      return NextResponse.json({ error: 'HR partner not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = createJobRoleSchema.parse(body);

    const jobRole = await prisma.jobRole.create({
      data: {
        ...validatedData,
        companyId: hrPartner.companyId,
        createdByHrId: hrPartner.id,
        requiredSkills: validatedData.requiredSkills || [],
        preferredSkills: validatedData.preferredSkills || [],
        applicationDeadline: validatedData.applicationDeadline ? new Date(validatedData.applicationDeadline) : null,
        expectedStartDate: validatedData.expectedStartDate ? new Date(validatedData.expectedStartDate) : null,
      },
      include: {
        company: { select: { companyName: true } },
        createdBy: { select: { firstName: true, lastName: true } }
      }
    });

    return NextResponse.json({ success: true, data: jobRole }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error creating job role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hrPartner = await prisma.hrPartner.findUnique({
      where: { userId }
    });

    if (!hrPartner) {
      return NextResponse.json({ error: 'HR partner not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const jobRoles = await prisma.jobRole.findMany({
      where: {
        companyId: hrPartner.companyId,
        ...(status && { status: status as any })
      },
      include: {
        _count: { select: { introductionRequests: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: jobRoles });
  } catch (error) {
    console.error('Error fetching job roles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
