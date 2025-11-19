'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface UserProfile {
    profilePhotoUrl?: string;
    firstName?: string;
    lastName?: string;
    profileHeadline?: string;
    completenessPercentage?: number;
}

interface UserProfileContextType {
    profile: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        if (!user) return;

        // Access publicMetadata
        const metadata = user.publicMetadata;
        const isProfessional = metadata?.userType === 'professional';
        const isHrPartner = metadata?.userType === 'hr-partner';
        const isAdmin = metadata?.userType === 'admin';

        try {
            if (isProfessional) {
                const response = await fetch('/api/v1/professionals/me');
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } else if (isHrPartner) {
                const response = await fetch('/api/v1/hr-partners/me');
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            } else if (isAdmin) {
                const response = await fetch('/api/v1/admins/me');
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchProfile();
        } else if (isLoaded && !user) {
            setProfile(null);
            setLoading(false);
        }
    }, [user, isLoaded]);

    const refreshProfile = async () => {
        setLoading(true);
        await fetchProfile();
    };

    return (
        <UserProfileContext.Provider value={{ profile, loading, refreshProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
}
