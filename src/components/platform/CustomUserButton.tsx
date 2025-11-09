'use client';

import { ChevronDown, User, Settings, LogOut } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useUserProfile } from '@/contexts/UserProfileContext';

// Profile Avatar Component
const ProfileAvatar = ({ src, size = 'md', className = '' }: { src?: string; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-20 h-20'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-8 h-8'
    };

    if (src) {
        return (
            <img
                src={src}
                alt="Profile"
                className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
            />
        );
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#2E8B57] to-[#3ABF7A] flex items-center justify-center ${className}`}>
            <User className={`${iconSizes[size]} text-white`} />
        </div>
    );
};

const CustomUserButton = () => {
    const { user } = useUser();
    const { profile } = useUserProfile();
    const { signOut } = useClerk();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        setIsOpen(false);
        router.push('/professional/profile');
    };

    const handleSettingsClick = () => {
        setIsOpen(false);
        router.push('/settings');
    };

    const handleLogout = async () => {
        setIsOpen(false);
        await signOut();
        router.push('/');
    };

    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        return user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || 'U';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 transition-colors rounded-r-lg py-2 pr-2 dark:border-gray-700 dark:hover:bg-gray-800"
            >
                <ProfileAvatar src={profile?.profilePhotoUrl} size="md" />
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform dark:text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 dark:bg-gray-800 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-600">
                        <p className="font-medium text-gray-900 truncate dark:text-gray-100">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 truncate dark:text-gray-400">
                            {user?.emailAddresses[0]?.emailAddress}
                        </p>
                    </div>

                    <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <User className="w-4 h-4" />
                        Profile
                    </button>

                    <button
                        onClick={handleSettingsClick}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>

                    <hr className="my-2 border-gray-100 dark:border-gray-600" />

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-900"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomUserButton;
