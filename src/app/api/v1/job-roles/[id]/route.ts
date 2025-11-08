import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { z } from 'zod';

const updateJobRoleSchema = z.object({
  roleTitle: z.string().min(1).optional(),
  roleDescription: z.string().min(1).optional(),
  responsibilities: z.string().optional(),
  requirements: z.string().min(1).optional(),
  preferredQualifications: z.string().optional(),
  seniorityLevel: z.enum(['DIRECTOR', 'VP', 'C_SUITE', 'EXECUTIVE']).optional(),
  industry: z.string().min(1).optional(),
  department: z.string().optional(),
  locationCity: z.string().min(1).optional(),
  locationState: z.string().min(1).optional(),
  remoteOption: z.enum(['ON_SITE', 'HYBRID', 'REMOTE']).optional(),
  employmentType: z.enum(['FULL_TIME', 'CONTRACT', 'CONSULTING']).optional(),
  salaryRangeMin: z.number().min(0).optional(),
  salaryRangeMax: z.number().min(0).optional(),
  benefits: z.string().optional(),
  yearsExperienceMin: z.number().min(0).optional(),
  yearsExperienceMax: z.number().optional(),
  requiredSkills: z.array(z.string()).optional(),
  preferredSkills: z.array(z.string()).optional(),
  isConfidential: z.boolean().optional(),
  confidentialReason: z.string().optional(),
  applicationDeadline: z.string().optional(),
  expectedStartDate: z.string().optional(),
});

/**
 * @swagger
 * /api/v1/job-roles/{id}:
 *   get:
 *     summary: Get a specific job role by ID
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job role ID
 *     responses:
 *       200:
 *         description: Job role retrieved successfully
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
 *         description: Job role or HR partner not found
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
 *     summary: Update a job role
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleTitle:
 *                 type: string
 *                 minLength: 1
 *                 description: Job role title
 *               roleDescription:
 *                 type: string
 *                 minLength: 1
 *                 description: Detailed job description
 *               responsibilities:
 *                 type: string
 *                 description: Key responsibilities
 *               requirements:
 *                 type: string
 *                 minLength: 1
 *                 description: Required qualifications and experience
 *               preferredQualifications:
 *                 type: string
 *                 description: Preferred qualifications
 *               seniorityLevel:
 *                 type: string
 *                 enum: [DIRECTOR, VP, C_SUITE, EXECUTIVE]
 *                 description: Required seniority level
 *               industry:
 *                 type: string
 *                 minLength: 1
 *                 description: Industry sector
 *               department:
 *                 type: string
 *                 description: Department
 *               locationCity:
 *                 type: string
 *                 minLength: 1
 *                 description: Job location city
 *               locationState:
 *                 type: string
 *                 minLength: 1
 *                 description: Job location state
 *               remoteOption:
 *                 type: string
 *                 enum: [ON_SITE, HYBRID, REMOTE]
 *                 description: Remote work option
 *               employmentType:
 *                 type: string
 *                 enum: [FULL_TIME, CONTRACT, CONSULTING]
 *                 description: Employment type
 *               salaryRangeMin:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum salary in Naira
 *               salaryRangeMax:
 *                 type: number
 *                 minimum: 0
 *                 description: Maximum salary in Naira
 *               benefits:
 *                 type: string
 *                 description: Benefits and perks
 *               yearsExperienceMin:
 *                 type: number
 *                 minimum: 0
 *                 description: Minimum years of experience required
 *               yearsExperienceMax:
 *                 type: number
 *                 description: Maximum years of experience
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Required skills
 *               preferredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Preferred skills
 *               isConfidential:
 *                 type: boolean
 *                 description: Whether this is a confidential search
 *               confidentialReason:
 *                 type: string
 *                 description: Reason for confidentiality
 *               applicationDeadline:
 *                 type: string
 *                 format: date
 *                 description: Application deadline
 *               expectedStartDate:
 *                 type: string
 *                 format: date
 *                 description: Expected start date
 *     responses:
 *       200:
 *         description: Job role updated successfully
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
 *         description: Job role or HR partner not found
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
 *   delete:
 *     summary: Delete a job role (soft delete)
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job role ID
 *     responses:
 *       200:
 *         description: Job role deleted successfully
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
 *         description: Job role or HR partner not found
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
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    const jobRole = await prisma.jobRole.findFirst({
      where: {
        id: id,
        companyId: hrPartner.companyId
      },
      include: {
        company: { select: { companyName: true } },
        createdBy: { select: { firstName: true, lastName: true } },
        _count: { select: { introductionRequests: true } }
      }
    });

    if (!jobRole) {
      return NextResponse.json({ error: 'Job role not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: jobRole });
  } catch (error) {
    console.error('Error fetching job role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    const existingJobRole = await prisma.jobRole.findFirst({
      where: {
        id: id,
        companyId: hrPartner.companyId
      }
    });

    if (!existingJobRole) {
      return NextResponse.json({ error: 'Job role not found' }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = updateJobRoleSchema.parse(body);

    const updatedJobRole = await prisma.jobRole.update({
      where: { id: id },
      data: {
        ...validatedData,
        applicationDeadline: validatedData.applicationDeadline ? new Date(validatedData.applicationDeadline) : undefined,
        expectedStartDate: validatedData.expectedStartDate ? new Date(validatedData.expectedStartDate) : undefined,
      },
      include: {
        company: { select: { companyName: true } },
        createdBy: { select: { firstName: true, lastName: true } }
      }
    });

    return NextResponse.json({ success: true, data: updatedJobRole });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Error updating job role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    const existingJobRole = await prisma.jobRole.findFirst({
      where: {
        id: id,
        companyId: hrPartner.companyId
      }
    });

    if (!existingJobRole) {
      return NextResponse.json({ error: 'Job role not found' }, { status: 404 });
    }

    // Soft delete by updating status to CLOSED
    const deletedJobRole = await prisma.jobRole.update({
      where: { id: id },
      data: {
        status: 'CLOSED',
        closedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, message: 'Job role deleted successfully' });
  } catch (error) {
    console.error('Error deleting job role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
