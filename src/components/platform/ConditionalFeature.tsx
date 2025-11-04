'use client';

import { useUser } from '@clerk/nextjs';
import { hasPermission, Permission } from '@/lib/auth/rbac';
import { useEffect, useState } from 'react';

export default function ConditionalFeature() {
    const { user } = useUser();
    const [canSendIntros, setCanSendIntros] = useState<boolean | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function checkPermission() {
            try {
                const permitted = await hasPermission(Permission.SEND_INTRODUCTION_REQUESTS);
                if (isMounted) {
                    setCanSendIntros(permitted);
                }
            } catch (error) {
                console.error('Failed to check permission:', error);
                if (isMounted) {
                    setCanSendIntros(false);
                }
            }
        }

        if (user) {
            checkPermission();
        }

        return () => {
            isMounted = false;
        };
    }, [user]);

    if (canSendIntros === null) {
        return <div>Loading...</div>; // Or a proper loading skeleton
    }

    return (
        <button
            type="button"
            className="btn-primary"
            onClick={() => {
                // TODO: Implement introduction request logic
            }}
            aria-label="Send introduction request"
        >
            Send Introduction Request
        </button>
    );
}