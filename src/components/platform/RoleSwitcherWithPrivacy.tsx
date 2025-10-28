'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { Briefcase, Users, Shield, Info } from 'lucide-react';
import { switchActiveRole } from '@/app/actions/clerk-metadata';

type ActiveRole = 'hr' | 'professional';

interface PrivacyStatus {
    blockedCompaniesCount: number;
    lastFirewallEvent?: string;
}

export default function RoleSwitcherWithPrivacy() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [activeRole, setActiveRole] = useState<ActiveRole>('hr');
    const [loading, setLoading] = useState(false);
    const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
    const [privacyStatus, setPrivacyStatus] = useState<PrivacyStatus | null>(null);

    const hasDualRole = user?.publicMetadata?.hasDualRole as boolean;

    useEffect(() => {
        if (pathname.startsWith('/professional')) {
            setActiveRole('professional');
        } else if (pathname.startsWith('/hr') || pathname.startsWith('/dashboard')) {
            setActiveRole('hr');
        }

        const savedRole = user?.publicMetadata?.activeRole as ActiveRole;
        if (savedRole && savedRole !== activeRole) {
            setActiveRole(savedRole);
        }
    }, [pathname, user]);

    // Fetch privacy status when in professional mode
    useEffect(() => {
        if (activeRole === 'professional' && hasDualRole) {
            fetchPrivacyStatus();
        }
    }, [activeRole, hasDualRole]);

    const fetchPrivacyStatus = async () => {
        try {
            const response = await fetch('/api/dual-role/privacy-status');
            if (response.ok) {
                const data = await response.json();
                setPrivacyStatus(data);
            }
        } catch (error) {
            console.error('Error fetching privacy status:', error);
        }
    };

    const handleRoleSwitch = async (role: ActiveRole) => {
        if (role === activeRole || loading) return;

        setLoading(true);

        try {
            const stateOfMetadata = await switchActiveRole(activeRole);

            await fetch('/api/users/active-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activeRole: role }),
            });

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

    if (!isLoaded || !hasDualRole) {
        return null;
    }

    return (
        <div className="relative">
            {/* Main Toggle */}
            <div className="flex items-center gap-3 bg-white rounded-xl shadow-md border border-gray-200 p-1">
                {/* HR Mode Button */}
                <button
                    onClick={() => handleRoleSwitch('hr')}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${activeRole === 'hr'
                        ? 'bg-secondary text-white shadow-md'
                        : 'bg-transparent text-gray-600 hover:bg-gray-50'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <Users className="w-4 h-4" />
                    <div className="text-left">
                        <div className="font-semibold text-sm">HR Mode</div>
                        <div className="text-xs opacity-75">Hire talent</div>
                    </div>
                    {loading && activeRole === 'professional' && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    )}
                </button>

                {/* Professional Mode Button */}
                <button
                    onClick={() => handleRoleSwitch('professional')}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${activeRole === 'professional'
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-transparent text-gray-600 hover:bg-gray-50'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <Briefcase className="w-4 h-4" />
                    <div className="text-left">
                        <div className="font-semibold text-sm">Job Seeking</div>
                        <div className="text-xs opacity-75">Explore roles</div>
                    </div>
                    {loading && activeRole === 'hr' && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    )}
                </button>

                {/* Privacy Indicator (only show in professional mode) */}
                {activeRole === 'professional' && (
                    <button
                        onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition relative"
                        title="Privacy Status"
                    >
                        <Shield className="w-5 h-5 text-primary" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </button>
                )}
            </div>

            {/* Privacy Info Dropdown */}
            {showPrivacyInfo && activeRole === 'professional' && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowPrivacyInfo(false)}
                    ></div>

                    <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 w-80 p-4">
                        <div className="flex items-start gap-3 mb-3">
                            <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-secondary mb-1">
                                    Privacy Protected
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Your job search is completely confidential
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Blocked Companies</span>
                                <span className="font-semibold text-secondary">
                                    {privacyStatus?.blockedCompaniesCount || 0}
                                </span>
                            </div>
                            {privacyStatus?.lastFirewallEvent && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Last Protected</span>
                                    <span className="font-semibold text-primary">
                                        {new Date(privacyStatus.lastFirewallEvent).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                <p className="text-xs text-green-800">
                                    Your company cannot see your professional profile, search activity, or that
                                    you&apos;re exploring opportunities.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/settings/dual-role')}
                            className="w-full mt-3 text-sm text-primary font-semibold hover:text-[#1F5F3F] transition"
                        >
                            View Privacy Settings →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}