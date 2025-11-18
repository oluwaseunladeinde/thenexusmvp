import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * @swagger
 * /api/v1/job-roles/{id}/applicants:
 *   get:
 *     summary: Get all applicants for a job role
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
 *         description: Applicants retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Introduction request ID
 *                       status:
 *                         type: string
 *                         enum: [PENDING, ACCEPTED, DECLINED, WITHDRAWN]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       introductionMessage:
 *                         type: string
 *                         description: Professional's introduction message
 *                       professional:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           professional:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                               currentTitle:
 *                                 type: string
 *                               currentCompany:
 *                                 type: string
 *                               yearsOfExperience:
 *                                 type: integer
 *                               user:
 *                                 type: object
 *                                 properties:
 *                                   email:
 *                                     type: string
 *                           currentTitle:
 *                             type: string
 *                           currentCompany:
 *                             type: string
 *                           yearsOfExperience:
 *                             type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job role not found
 *       500:
 *         description: Internal server error
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

        // Verify the job role belongs to the HR partner's company
        const jobRole = await prisma.jobRole.findFirst({
            where: {
                id: id,
                companyId: hrPartner.companyId
            }
        });

        if (!jobRole) {
            return NextResponse.json({ error: 'Job role not found' }, { status: 404 });
        }

        // Fetch introduction requests with professional details
        const applicants = await prisma.introductionRequest.findMany({
            where: {
                jobRoleId: id
            },
            include: {
                professional: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        currentTitle: true,
                        currentCompany: true,
                        yearsOfExperience: true,
                        user: {
                            select: {
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, data: applicants });
    } catch (error) {
        console.error('Error fetching applicants:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
