'use client';

import { useUser } from '@clerk/nextjs';
import { hasPermission, Permission } from '@/lib/auth/rbac';
import { useEffect, useState } from 'react';

export default function ConditionalFeature() {
    const { user } = useUser();
    const [canSendIntros, setCanSendIntros] = useState(false);

    useEffect(() => {
        async function checkPermission() {
            const permitted = await hasPermission(Permission.SEND_INTRODUCTION_REQUESTS);
            setCanSendIntros(permitted);
        }
        checkPermission();
    }, [user]);

    if (!canSendIntros) {
        return null; // Hide feature if no permission
    }

    return (
        <button className="btn-primary">
            Send Introduction Request
        </button>
    );
}