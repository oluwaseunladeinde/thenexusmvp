'use client';

import { UserButton as ClerkUserButton } from '@clerk/nextjs';

export default function UserButton() {
    return (
        <ClerkUserButton
            appearance={{
                elements: {
                    avatarBox: 'w-10 h-10',
                    userButtonPopoverCard: 'shadow-xl',
                    userButtonPopoverActionButton:
                        'hover:bg-[#2E8B57] hover:text-white',
                },
            }}
        >
            <ClerkUserButton.MenuItems>
                <ClerkUserButton.Link
                    label="Dashboard"
                    labelIcon={<span>📊</span>}
                    href="/dashboard"
                />
                <ClerkUserButton.Link
                    label="Settings"
                    labelIcon={<span>⚙️</span>}
                    href="/settings"
                />
                <ClerkUserButton.Action label="manageAccount" />
                <ClerkUserButton.Action label="signOut" />
            </ClerkUserButton.MenuItems>
        </ClerkUserButton>
    );
}