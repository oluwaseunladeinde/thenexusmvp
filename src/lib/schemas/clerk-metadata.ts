// Public Metadata (visible to client)
export interface ClerkPublicMetadata {
    userType: 'professional' | 'hr_partner' | 'admin';
    onboardingComplete: boolean;
    hasDualRole?: boolean;
    activeRole?: 'hr_partner' | 'professional'; // For dual-role users
}

// Private Metadata (server-only)
export interface ClerkPrivateMetadata {
    prismaUserId: string;
    professionalId?: string;
    hrPartnerId?: string;
    companyId?: string;
    verificationStatus?: string;
}
