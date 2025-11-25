'use client';

import { useUser } from '@clerk/nextjs';

export default function ProfileHeader() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) return <div>Loading...</div>;
    if (!user) return <div>Please sign in to view your profile.</div>;

    const userType = user?.publicMetadata?.userType as string | undefined;
    const hasDualRole = user?.publicMetadata?.hasDualRole as boolean | undefined;

    return (
        <div>
            <h2>Welcome, {user?.firstName}!</h2>
            <p>Role: {userType}</p>
            {hasDualRole && <span className="badge">Dual Role Active</span>}
        </div>
    );
}