import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

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
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Only PDF, JPEG, JPG, and PNG files are allowed'
            }, { status: 400 });
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'professionals');
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (error) {
            // Directory might already exist, continue
        }

        // Generate unique filename
        const fileExtension = file.name.split('.').pop();
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
