import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

/**
 * @swagger
 * /api/v1/professionals/upload:
 *   post:
 *     summary: Upload a file for professional profile
 *     tags: [Professionals, Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - type
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: File to upload (PDF, JPEG, PNG)
 *               type:
 *                 type: string
 *                 enum: [profile, resume]
 *                 description: Type of file being uploaded
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     fileUrl:
 *                       type: string
 *                       description: Public URL of the uploaded file
 *                       example: "/uploads/professionals/user123_profile_abc123.jpg"
 *                     fileName:
 *                       type: string
 *                       description: Original filename
 *                       example: "profile_photo.jpg"
 *                     fileSize:
 *                       type: number
 *                       description: File size in bytes
 *                       example: 2048576
 *                     fileType:
 *                       type: string
 *                       description: MIME type of the file
 *                       example: "image/jpeg"
 *                     profileCompleteness:
 *                       type: number
 *                       description: Updated profile completeness percentage
 *                       example: 85
 *       400:
 *         description: Invalid file or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No file provided"
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
 *         description: Forbidden - professional access required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Forbidden: Professional access required"
 *       413:
 *         description: File too large
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "File size too large. Maximum 5MB allowed"
 *       422:
 *         description: Invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid file type. Only PDF, JPEG, JPG, and PNG files are allowed"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to upload file"
 */

export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userType = user.unsafeMetadata?.userType as string;
        if (!userType || userType !== 'professional') {
            return NextResponse.json({ error: 'Forbidden: Professional access required' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!['profile', 'resume'].includes(type)) {
            return NextResponse.json({ error: 'Invalid file type. Must be profile or resume' }, { status: 400 });
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size too large. Maximum 5MB allowed' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Only PDF, JPEG, JPG, and PNG files are allowed'
            }, { status: 400 });
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'professionals');

        // Create uploads directory if it doesn't exist
        await mkdir(uploadsDir, { recursive: true });


        //const fileName = `${user.id}_${type}_${randomUUID()}.${fileExtension}`;
        // Generate unique filename - derive extension from validated MIME type
        const mimeToExt: Record<string, string> = {
            'application/pdf': 'pdf',
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png'
        };
        const fileExtension = mimeToExt[file.type];
        if (!fileExtension) {
            return NextResponse.json({ error: 'Unable to determine file extension' }, { status: 400 });
        }
        const fileName = `${user.id}_${type}_${randomUUID()}.${fileExtension}`;
        const filePath = join(uploadsDir, fileName);

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Generate public URL
        const fileUrl = `/uploads/professionals/${fileName}`;

        // Update professional profile
        const updateData = type === 'profile'
            ? { profilePhotoUrl: fileUrl }
            : { resumeUrl: fileUrl };

        await prisma.professional.update({
            where: { userId: user.id },
            data: updateData
        });

        // Recalculate profile completeness
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

        let profileCompleteness = 0;
        if (professionalWithRelations) {
            const { calculateProfileCompleteness } = await import('@/lib/services/profileCompletenessCalculator');
            const completenessBreakdown = calculateProfileCompleteness(professionalWithRelations);
            profileCompleteness = completenessBreakdown.overall;

            await prisma.professional.update({
                where: { userId: user.id },
                data: { profileCompleteness }
            });
        }

        return NextResponse.json({
            message: 'File uploaded successfully',
            data: {
                fileUrl,
                fileName,
                fileSize: file.size,
                fileType: file.type,
                profileCompleteness
            }
        }, { status: 200 });

    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
