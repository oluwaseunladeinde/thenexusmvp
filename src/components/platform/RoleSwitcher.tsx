'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { Briefcase, Users, ChevronDown } from 'lucide-react';
import { switchActiveRole } from '@/app/actions/clerk-metadata';

type ActiveRole = 'hr' | 'professional';

export default function RoleSwitcher() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [activeRole, setActiveRole] = useState<ActiveRole>('hr');
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    let hasDualRole = user?.publicMetadata?.hasDualRole as boolean;
    if (!hasDualRole) {
        hasDualRole = user?.unsafeMetadata?.hasDualRole as boolean;
    }

    if (!hasDualRole) {
        return null;
    }

    useEffect(() => {
        // Prefer saved role from metadata, fallback to pathname detection
        const savedRole = user?.publicMetadata?.activeRole as ActiveRole;

        if (pathname.startsWith('/professional')) {
            setActiveRole(savedRole || 'professional');
        } else if (pathname.startsWith('/hr') || pathname.startsWith('/dashboard')) {
            setActiveRole(savedRole || 'hr');
        }

    }, [pathname, user]);

    const handleRoleSwitch = async (role: ActiveRole) => {
        if (role === activeRole || loading) return;

        setLoading(true);
        setShowDropdown(false);

        try {
            // Update active role in Clerk metadata
            const stateOfMetadata = await switchActiveRole(role);

            // Store preference in API
            await fetch('/api/users/active-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activeRole: role }),
            });

            // Navigate to appropriate dashboard
            if (role === 'hr') {
                router.push('/dashboard');
            } else {
                router.push('/professional/dashboard');
            }

            setActiveRole(role);
        } catch (error) {
            console.error('Error switching roles:', error);
            alert('Failed to switch roles. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Don't show if user doesn't have dual role
    if (!isLoaded || !hasDualRole) {
        return null;
    }

    return (
        <div className="relative">
            {/* Desktop Version - Toggle Switch */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full p-1">
                <button
                    onClick={() => handleRoleSwitch('hr')}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${activeRole === 'hr'
                        ? 'bg-secondary text-white shadow-md'
                        : 'bg-transparent text-gray-600 hover:text-gray-900'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <Users className="w-4 h-4" />
                    <span className="font-semibold text-sm">HR Mode</span>
                    {loading && activeRole === 'professional' && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                </button>

                <button
                    onClick={() => handleRoleSwitch('professional')}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${activeRole === 'professional'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-transparent text-gray-600 hover:text-gray-900'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <Briefcase className="w-4 h-4" />
                    <span className="font-semibold text-sm">Job Seeking</span>
                    {loading && activeRole === 'hr' && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                </button>
            </div>

            {/* Mobile Version - Dropdown */}
            <div className="md:hidden relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md ${activeRole === 'hr'
                        ? 'bg-secondary text-white'
                        : 'bg-primary text-white'
                        }`}
                >
                    {activeRole === 'hr' ? (
                        <>
                            <Users className="w-5 h-5" />
                            <span className="font-semibold">HR Mode</span>
                        </>
                    ) : (
                        <>
                            <Briefcase className="w-5 h-5" />
                            <span className="font-semibold">Job Seeking</span>
                        </>
                    )}
                    <ChevronDown className="w-4 h-4" />
                </button>

                {showDropdown && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowDropdown(false)}
                        ></div>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[200px]">
                            <button
                                onClick={() => handleRoleSwitch('hr')}
                                disabled={loading || activeRole === 'hr'}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${activeRole === 'hr' ? 'bg-gray-100' : ''
                                    } ${loading ? 'opacity-50' : ''}`}
                            >
                                <Users className="w-5 h-5 text-secondary" />
                                <div className="text-left flex-1">
                                    <div className="font-semibold text-secondary">HR Mode</div>
                                    <div className="text-xs text-gray-500">Search & hire talent</div>
                                </div>
                                {activeRole === 'hr' && (
                                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                )}
                            </button>

                            <div className="border-t border-gray-200"></div>

                            <button
                                onClick={() => handleRoleSwitch('professional')}
                                disabled={loading || activeRole === 'professional'}
                                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${activeRole === 'professional' ? 'bg-gray-100' : ''
                                    } ${loading ? 'opacity-50' : ''}`}
                            >
                                <Briefcase className="w-5 h-5 text-primary" />
                                <div className="text-left flex-1">
                                    <div className="font-semibold text-primary">Job Seeking</div>
                                    <div className="text-xs text-gray-500">Explore opportunities</div>
                                </div>
                                {activeRole === 'professional' && (
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}