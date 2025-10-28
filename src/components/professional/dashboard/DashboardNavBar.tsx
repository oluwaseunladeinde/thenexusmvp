"use client";

import UserButton from '@/components/platform/UserButton';
import {
    Briefcase, LayoutDashboard,
    MessageSquare, Sparkles, User,
    Users, Search,
    ChevronDown, Menu
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface DashboardNavBarProps {
    userType: string;
}

const professionalNavItems = [
    {
        href: '/professional/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard
    },
    {
        href: '/professional/dashboard/introductions',
        label: 'Introductions',
        icon: Sparkles
    },
    {
        href: '/professional/dashboard/profile',
        label: 'Profile',
        icon: User
    },
    {
        href: '/professional/dashboard/messages',
        label: 'Messages',
        icon: MessageSquare
    }
];

const hrPartnersNavItems = [
    {
        href: '/dashboard/hr-partner',
        label: 'Dashboard',
        icon: LayoutDashboard
    },
    {
        href: '/dashboard/hr-partner/browse',
        label: 'Browse Talent',
        icon: Search
    },
    {
        href: '/dashboard/hr-partner/introductions',
        label: 'Introductions',
        icon: MessageSquare
    }
];

const professionalMoreItems = [
    { href: '/dashboard/professional/skills', label: 'Skills', icon: Sparkles },
    { href: '/dashboard/professional/experience', label: 'Experience', icon: Briefcase },
    { href: '/dashboard/professional/references', label: 'References', icon: Users }
];

const hrPartnerMoreItems = [
    {
        href: '/dashboard/hr-partner/jobs',
        label: 'Jobs',
        icon: Briefcase
    },
    { href: '/dashboard/hr-partner/pipeline', label: 'Pipeline', icon: Users },
    { href: '/dashboard/hr-partner/team', label: 'Team', icon: Users },
    { href: '/dashboard/hr-partner/analytics', label: 'Analytics', icon: LayoutDashboard }
];

const DashboardNavBar = ({ userType }: DashboardNavBarProps) => {
    const pathname = usePathname();
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isMobile = useIsMobile();
    const navItems = (userType === 'professional' || userType === 'PROFESSIONAL') ? professionalNavItems : hrPartnersNavItems;
    const moreItems = (userType === 'professional' || userType === 'PROFESSIONAL') ? professionalMoreItems : hrPartnerMoreItems;

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setShowMoreDropdown(false);
        if (showMoreDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showMoreDropdown]);
    const MobileNavContent = () => (
        <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-left text-2xl font-bold text-primary">theNexus</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto py-4">
                {/* Search Bar */}
                <div className="px-4 mb-6">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search professionals, companies..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="space-y-2 px-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard/professional' && item.href !== '/dashboard/hr-partner' && pathname.startsWith(item.href));
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-3 rounded-md text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-green-50 text-green-700' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </a>
                        );
                    })}

                    {/* More Items */}
                    <div className="pt-4 border-t">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">More</h3>
                        {moreItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href);
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-green-50 text-green-700' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <item.icon className="w-4 h-4 mr-3" />
                                    <span className="text-sm">{item.label}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* User Button at bottom */}
            <div className="border-t pt-4 px-4">
                <UserButton />
            </div>
        </div>
    );

    return (
        <nav className="bg-white border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold text-primary">theNexus</h1>

                        {/* Mobile Menu Button */}
                        {isMobile && (
                            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden">
                                        <Menu className="h-5 w-5" />
                                        <span className="sr-only">Open menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80 p-0">
                                    <MobileNavContent />
                                </SheetContent>
                            </Sheet>
                        )}

                        {/* Search Bar */}
                        <div className="relative hidden md:block">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search professionals, companies..."
                                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="hidden md:flex gap-6">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/dashboard/professional' && item.href !== '/dashboard/hr-partner' && pathname.startsWith(item.href));
                                return (
                                    <a
                                        key={item.href} href={item.href}
                                        className={`flex px-3 py-2 rounded-md text-gray-700 ${isActive
                                            ? 'bg-green-50 hover:bg-green-50'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 mr-2 ${isActive ? 'text-green-700 hover:text-gray-600' : 'text-gray-700'
                                            }`} />
                                        <span className="text-sm font-semibold">{item.label}</span>
                                    </a>
                                )
                            })}

                            {/* More Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                                    className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                                >
                                    {/* <MoreHorizontal className="w-5 h-5 mr-2" /> */}
                                    <span className="text-sm font-semibold">More</span>
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                </button>

                                {showMoreDropdown && (
                                    <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                                        {moreItems.map((item) => {
                                            const isActive = pathname === item.href || pathname.startsWith(item.href);
                                            return (
                                                <a
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`flex items-center px-4 py-2 text-sm hover:bg-gray-50 ${isActive ? 'text-primary bg-green-50' : 'text-gray-700'
                                                        }`}
                                                    onClick={() => setShowMoreDropdown(false)}
                                                >
                                                    <item.icon className="w-4 h-4 mr-3" />
                                                    {item.label}
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <UserButton />
                </div>
            </div>
        </nav>
    )
}

export default DashboardNavBar