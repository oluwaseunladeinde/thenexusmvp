'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, FileText, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getS3PresignedUrl, handleCloudinaryFallback } from '@/app/actions/upload';

interface FileUploaderProps {
    onUploadSuccess?: (url: string, publicId?: string) => void;
    onUploadError?: (error: string) => void;
    acceptedTypes?: string[];
    maxSize?: number;
    type: 'profile' | 'resume';
    currentFileUrl?: string;
    currentFileName?: string;
    className?: string;
}

interface UploadState {
    status: 'idle' | 'uploading' | 'success' | 'error';
    progress: number;
    error?: string;
}

// Empty State Component
const RenderEmptyState = ({ type, onFileSelect, getFileIcon, getAcceptedTypesString, maxFileSize }: any) => (
    <div className="space-y-4 text-center py-8">
        {getFileIcon()}
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900">
                {type === 'profile' ? 'Upload profile photo' : 'Upload resume'}
            </h3>
            <p className="text-xs text-gray-500">
                Drag and drop or click to select
            </p>
            <p className="text-xs text-gray-400">
                {getAcceptedTypesString()} • Max {Math.round(maxFileSize / (1024 * 1024))}MB
            </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onFileSelect}>
            <Upload className="w-4 h-4 mr-2" />
            Choose File
        </Button>
    </div>
);

// Uploading State Component
const RenderUploadingState = ({ progress }: { progress: number }) => (
    <div className="space-y-4 text-center py-8">
        <div className="relative">
            <RefreshCw className="w-8 h-8 text-primary mx-auto animate-spin" />
        </div>
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Uploading...</p>
            <Progress value={progress} className="w-full max-w-xs mx-auto" />
            <p className="text-xs text-gray-500">{progress}% complete</p>
        </div>
    </div>
);

// Success State Component
const RenderSuccessState = ({ onReset }: { onReset: () => void }) => (
    <div className="space-y-4 text-center py-8">
        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
        <div className="space-y-2">
            <p className="text-sm font-medium text-green-700">Upload successful!</p>
            <p className="text-xs text-gray-500">Your file has been uploaded successfully</p>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
            Upload Another
        </Button>
    </div>
);

// Error State Component
const RenderErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="space-y-4 text-center py-8">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <div className="space-y-2">
            <p className="text-sm font-medium text-red-700">Upload failed</p>
            <p className="text-xs text-red-600">{error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onRetry}>
            Try Again
        </Button>
    </div>
);

// Uploaded State Component (when file already exists)
const RenderUploadedState = ({ type, currentFileUrl, currentFileName, onReplace, onView }: any) => (
    <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-700">
                {type === 'profile' ? 'Profile photo uploaded' : 'Resume uploaded'}
            </p>
            {currentFileName && (
                <p className="text-xs text-green-600 truncate">{currentFileName}</p>
            )}
        </div>
        <div className="flex items-center gap-2">
            {type === 'profile' && currentFileUrl && (
                <img
                    src={currentFileUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                />
            )}
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onView}>
                    View
                </Button>
                <Button variant="outline" size="sm" onClick={onReplace}>
                    Replace
                </Button>
            </div>
        </div>
    </div>
);

export function FileUploader({
    onUploadSuccess,
    onUploadError,
    acceptedTypes,
    maxSize,
    type,
    currentFileUrl,
    currentFileName,
    className = '',
}: FileUploaderProps) {
    const [uploadState, setUploadState] = useState<UploadState>({
        status: 'idle',
        progress: 0,
    });
    const [dragActive, setDragActive] = useState(false);
    const [showUploadArea, setShowUploadArea] = useState(!currentFileUrl);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultAcceptedTypes = type === 'profile'
        ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    const acceptedTypesList = acceptedTypes || defaultAcceptedTypes;
    const maxFileSize = maxSize || (type === 'profile' ? 5 * 1024 * 1024 : 10 * 1024 * 1024);

    const validateFile = (file: File): string | null => {
        if (!acceptedTypesList.includes(file.type)) {
            return `Invalid file type. Please upload ${type === 'profile' ? 'an image' : 'a PDF or Word document'}.`;
        }
        if (file.size > maxFileSize) {
            return `File size must be less than ${Math.round(maxFileSize / (1024 * 1024))}MB.`;
        }
        return null;
    };

    const uploadFile = async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setUploadState({ status: 'error', progress: 0, error: validationError });
            onUploadError?.(validationError);
            return;
        }

        setUploadState({ status: 'uploading', progress: 10 });

        try {
            const s3Result = await getS3PresignedUrl(file.name, file.type, file.size);

            if (s3Result.success && s3Result.url) {
                setUploadState({ status: 'uploading', progress: 30 });

                const formData = new FormData();
                Object.entries(s3Result.fields || {}).forEach(([key, value]) => {
                    formData.append(key, value);
                });
                formData.append('file', file);

                const uploadResponse = await fetch(s3Result.url, {
                    method: 'POST',
                    body: formData,
                });

                if (uploadResponse.ok) {
                    setUploadState({ status: 'uploading', progress: 90 });
                    const accessUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}/${s3Result.fields?.key}`;

                    setUploadState({ status: 'success', progress: 100 });
                    onUploadSuccess?.(accessUrl);

                    // Hide upload area and show uploaded state after success
                    setTimeout(() => {
                        setShowUploadArea(false);
                        setUploadState({ status: 'idle', progress: 0 });
                    }, 2000);
                    return;
                }
            }

            // Fallback to Cloudinary
            setUploadState({ status: 'uploading', progress: 50 });
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;
                const cloudinaryResult = await handleCloudinaryFallback(base64, file.type, file.name);

                if (cloudinaryResult.success && cloudinaryResult.url) {
                    setUploadState({ status: 'success', progress: 100 });
                    onUploadSuccess?.(cloudinaryResult.url, cloudinaryResult.publicId);

                    setTimeout(() => {
                        setShowUploadArea(false);
                        setUploadState({ status: 'idle', progress: 0 });
                    }, 2000);
                } else {
                    throw new Error(cloudinaryResult.error || 'Upload failed');
                }
            };
            reader.readAsDataURL(file);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            setUploadState({ status: 'error', progress: 0, error: errorMessage });
            onUploadError?.(errorMessage);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            uploadFile(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const resetUpload = () => {
        setUploadState({ status: 'idle', progress: 0 });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleReplace = () => {
        setShowUploadArea(true);
        resetUpload();
    };

    const handleView = () => {
        if (currentFileUrl) {
            window.open(currentFileUrl, '_blank');
        }
    };

    const getFileIcon = () => {
        if (type === 'profile') {
            return <ImageIcon className="w-8 h-8 text-gray-400" />;
        }
        return <FileText className="w-8 h-8 text-gray-400" />;
    };

    const getAcceptedTypesString = () => {
        if (type === 'profile') {
            return 'PNG, JPG, GIF, WebP';
        }
        return 'PDF, DOC, DOCX';
    };

    // Show uploaded state if file exists and upload area is hidden
    if (currentFileUrl && !showUploadArea) {
        return (
            <div className={className}>
                <RenderUploadedState
                    type={type}
                    currentFileUrl={currentFileUrl}
                    currentFileName={currentFileName}
                    onReplace={handleReplace}
                    onView={handleView}
                />
            </div>
        );
    }

    return (
        <div className={className}>
            <div
                className={`relative border-2 border-dashed rounded-lg transition-colors ${dragActive
                    ? 'border-primary bg-primary/5'
                    : uploadState.status === 'error'
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={uploadState.status === 'idle' ? handleClick : undefined}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypesList.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploadState.status === 'uploading'}
                />

                {uploadState.status === 'idle' && (
                    <RenderEmptyState
                        type={type}
                        onFileSelect={handleClick}
                        getFileIcon={getFileIcon}
                        getAcceptedTypesString={getAcceptedTypesString}
                        maxFileSize={maxFileSize}
                    />
                )}

                {uploadState.status === 'uploading' && (
                    <RenderUploadingState progress={uploadState.progress} />
                )}

                {uploadState.status === 'success' && (
                    <RenderSuccessState onReset={resetUpload} />
                )}

                {uploadState.status === 'error' && (
                    <RenderErrorState error={uploadState.error || 'Unknown error'} onRetry={resetUpload} />
                )}
            </div>
        </div>
    );
}
