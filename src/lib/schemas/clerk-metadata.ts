// Public Metadata (visible to client)
export interface ClerkPublicMetadata {
    userType: 'professional' | 'hr-partner' | 'admin';
    onboardingComplete: boolean;
    hasDualRole?: boolean;
    activeRole?: 'hr-partner' | 'professional'; // For dual-role users
}

// Private Metadata (server-only)
export interface ClerkPrivateMetadata {
    prismaUserId: string;
    professionalId?: string;
    hrPartnerId?: string;
    companyId?: string;
    verificationStatus?: string;
}
