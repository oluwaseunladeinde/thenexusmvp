import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, Permission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/database';

interface SaveProfessionalRequest {
    notes?: string;
}

/**
 * @swagger
 * /api/v1/professionals/{id}/save:
 *   post:
 *     summary: Save a professional to HR partner's saved list
 *     tags: [Professionals, Saved]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Professional ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *                 description: Optional notes about why this professional was saved
 *     responses:
 *       201:
 *         description: Professional saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 savedProfessional:
 *                   type: object
 *       400:
 *         description: Professional already saved
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Professional not found
 */

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const { id } = params;
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // RBAC Check: Require permission to save professionals
        await requirePermission(Permission.SEARCH_PROFESSIONALS);

        // Get HR partner
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!hrPartner) {
            return NextResponse.json(
                { error: 'HR Partner not found' },
                { status: 403 }
            );
        }

        const professionalId = id;
        const { notes }: SaveProfessionalRequest = await req.json();

        // Check if professional exists
        const professional = await prisma.professional.findUnique({
            where: { id: professionalId },
            select: { id: true, firstName: true, lastName: true },
        });

        if (!professional) {
            return NextResponse.json(
                { error: 'Professional not found' },
                { status: 404 }
            );
        }

        // Check if already saved
        const existingSave = await prisma.savedProfessional.findUnique({
            where: {
                hrPartnerId_professionalId: {
                    hrPartnerId: hrPartner.id,
                    professionalId: professionalId,
                },
            },
        });

        if (existingSave) {
            return NextResponse.json(
                { error: 'Professional already saved' },
                { status: 400 }
            );
        }

        // Save the professional
        const savedProfessional = await prisma.savedProfessional.create({
            data: {
                hrPartnerId: hrPartner.id,
                professionalId: professionalId,
                notes: notes || null,
            },
            include: {
                professional: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileHeadline: true,
                        currentTitle: true,
                        locationCity: true,
                        locationState: true,
                        verificationStatus: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                message: 'Professional saved successfully',
                savedProfessional,
            },
            { status: 201 }
        );

    } catch (err: any) {
        console.error('Save professional error:', err);

        if (err.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to save professional' },
            { status: 500 }
        );
    }
}

/**
 * @swagger
 * /api/v1/professionals/{id}/save:
 *   delete:
 *     summary: Remove a professional from HR partner's saved list
 *     tags: [Professionals, Saved]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Professional ID
 *     responses:
 *       200:
 *         description: Professional removed from saved list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: Saved professional not found
 */

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    const { id } = params;
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // RBAC Check: Require permission to save professionals
        await requirePermission(Permission.SEARCH_PROFESSIONALS);

        // Get HR partner
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!hrPartner) {
            return NextResponse.json(
                { error: 'HR Partner not found' },
                { status: 403 }
            );
        }

        const professionalId = id;

        // Check if saved professional exists
        const savedProfessional = await prisma.savedProfessional.findUnique({
            where: {
                hrPartnerId_professionalId: {
                    hrPartnerId: hrPartner.id,
                    professionalId: professionalId,
                },
            },
        });

        if (!savedProfessional) {
            return NextResponse.json(
                { error: 'Professional not in saved list' },
                { status: 404 }
            );
        }

        // Remove from saved list
        await prisma.savedProfessional.delete({
            where: {
                hrPartnerId_professionalId: {
                    hrPartnerId: hrPartner.id,
                    professionalId: professionalId,
                },
            },
        });

        return NextResponse.json(
            { message: 'Professional removed from saved list' },
            { status: 200 }
        );

    } catch (err: any) {
        console.error('Unsave professional error:', err);

        if (err.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to remove professional from saved list' },
            { status: 500 }
        );
    }
}
