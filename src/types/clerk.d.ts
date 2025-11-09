// Extend Clerk's types to include theNexus custom metadata

export { };

declare global {
    /**
     * Custom JWT Session Claims
     * These are automatically included in the session token
     * and available via auth().sessionClaims
     */
    interface CustomJwtSessionClaims {
        metadata: {
            // User type (required)
            userType: 'professional' | 'hr-partner' | 'admin';

            // Onboarding status
            onboardingComplete?: boolean;

            // Dual role feature (for HR partners who are also job seeking)
            hasDualRole?: boolean;
            activeRole?: 'hr' | 'professional';

            // Verification status
            verified?: boolean;
            verificationLevel?: 'basic' | 'full' | 'premium';

            // Company context (for HR partners)
            companyId?: string;
            companyName?: string;

            // Professional context
            professionalId?: string;
            hrPartnerId?: string;
        };
    }

    /**
     * Public Metadata
     * Visible to the frontend and included in User object
     */
    interface UserPublicMetadata {
        userType?: 'professional' | 'hr-partner' | 'admin';
        onboardingComplete?: boolean;
        hasDualRole?: boolean;
        activeRole?: 'hr' | 'professional';
        verified?: boolean;
        verificationLevel?: 'basic' | 'full' | 'premium';
    }

    /**
     * Private Metadata
     * Only accessible server-side
     */
    interface UserPrivateMetadata {
        prismaUserId?: string;
        professionalId?: string;
        hrPartnerId?: string;
        companyId?: string;
        internalNotes?: string;
        flaggedForReview?: boolean;
    }
}