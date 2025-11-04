'use server';

import { v4 as uuid4 } from "uuid";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { v2 as cloudinary } from 'cloudinary';

// Configure AWS S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export interface UploadResult {
    success: boolean;
    url?: string;
    publicId?: string;
    error?: string;
}

export interface S3PresignedUrlResult {
    success: boolean;
    url?: string;
    fields?: Record<string, string>;
    error?: string;
}

/**
 * Generates a presigned URL for direct S3 upload
 */
export async function getS3PresignedUrl(
    fileName: string,
    fileType: string,
    fileSize: number = 0
): Promise<S3PresignedUrlResult> {
    try {
        console.log('S3 Upload attempt:', { fileName, fileType, fileSize });

        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(fileType)) {
            console.log('Invalid file type:', fileType);
            return { success: false, error: 'Invalid file type' };
        }

        // Validate file size (10MB max)
        if (fileSize > 10 * 1024 * 1024) {
            console.log('File too large:', fileSize);
            return { success: false, error: 'File size too large' };
        }

        const bucketName = process.env.AWS_S3_BUCKET_NAME!;

        const safeName = fileName.replace(/[^\w.\-]/g, "_");
        const key = `uploads/${new Date().toISOString().slice(0, 10)}/${uuid4()}-${safeName}`;
        //const key = `uploads/${Date.now()}-${fileName}`;

        console.log('Creating presigned POST for:', { bucketName, key });

        const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: bucketName,
            Key: key,
            Conditions: [
                ['content-length-range', 0, 10 * 1024 * 1024], // 10MB max
                ['starts-with', '$Content-Type', fileType.split('/')[0]]
            ],
            Fields: {
                'Content-Type': fileType
            },
            Expires: 3600 // 1 hour
        });

        console.log('Presigned POST created successfully');
        return {
            success: true,
            url,
            fields: { ...fields, key }
        };
    } catch (error) {
        console.error('Error generating S3 presigned URL:', error);
        return { success: false, error: 'Failed to generate upload URL' };
    }
}

/**
 * Handles Cloudinary fallback upload
 */
export async function handleCloudinaryFallback(
    fileBase64: string,
    fileType: string,
    fileName: string
): Promise<UploadResult> {
    try {
        // Validate file type
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(fileType)) {
            return {
                success: false,
                error: 'Invalid file type'
            };
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(fileBase64, {
            resource_type: fileType.startsWith('image/') ? 'image' : 'raw',
            public_id: `uploads/${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
            folder: 'thenexus-uploads',
        });

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return {
            success: false,
            error: 'Upload failed'
        };
    }
}

/**
 * Uploads file directly to S3 (server-side fallback)
 */
export async function uploadToS3(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string
): Promise<UploadResult> {
    try {
        const bucketName = process.env.AWS_S3_BUCKET_NAME!;
        const key = `uploads/${Date.now()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: fileBuffer,
            ContentType: fileType,
            ACL: 'private',
        });

        await s3Client.send(command);

        // Generate a signed URL for accessing the file
        const signedUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand({ Bucket: bucketName, Key: key }),
            { expiresIn: 3600 }
        );

        return {
            success: true,
            url: signedUrl,
        };
    } catch (error) {
        console.error('Error uploading to S3:', error);
        return {
            success: false,
            error: 'S3 upload failed'
        };
    }
}
