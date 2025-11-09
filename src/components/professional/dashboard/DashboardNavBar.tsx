"use client";

import UserButton from '@/components/platform/UserButton';
import {
    Briefcase, LayoutDashboard,
    MessageSquare, Sparkles, User,
    Users, Search,
    ChevronDown, Menu,
    Bell,
    Settings
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CustomUserButton from '@/components/platform/CustomUserButton';
import RoleSwitcherWithPrivacy from '@/components/platform/RoleSwitcherWithPrivacy';

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
        href: '/professional/introductions',
        label: 'Introductions',
        icon: Sparkles
    },
    {
        href: '/professional/conversations',
        label: 'Opportunities',
        icon: Sparkles
    },
];

const professionalMoreItems = [
    { href: '/professional/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/professional/dashboard/skills', label: 'Skills', icon: Sparkles },
    { href: '/professional/dashboard/experience', label: 'Experience', icon: Briefcase },
    { href: '/professional/dashboard/references', label: 'References', icon: Users }
];

const hrPartnersNavItems = [
    {
        href: '/dashboard/hr-partner',
        label: 'Dashboard',
        icon: LayoutDashboard
    },
    {
        href: '/dashboard/hr-partner/talents',
        label: 'Talents',
        icon: Search
    },
    {
        href: '/dashboard/hr-partner/roles',
        label: 'Roles',
        icon: Briefcase
    }
];

const hrPartnerMoreItems = [
    { href: '/dashboard/hr-partner/roles', label: 'Roles', icon: Briefcase },
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
            <SheetHeader className="border-b pb-4 dark:border-gray-700">
                <SheetTitle className="text-left text-2xl font-bold text-primary dark:text-primary">theNexus</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto py-4">
                {/* Search Bar */}
                <div className="px-4 mb-6">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search professionals, companies..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="space-y-2 px-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/professional/dashboard' && item.href !== '/dashboard/hr-partner' && pathname.startsWith(item.href + '/'));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-3 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ${isActive ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </Link>
                        );
                    })}

                    {/* More Items */}
                    <div className="pt-4 border-t z-50 dark:border-gray-700">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 dark:text-gray-400">More</h3>
                        {moreItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(item.href);
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ${isActive ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}`}
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
            <div className="border-t pt-4 px-4 dark:border-gray-700">
                <CustomUserButton />
            </div>
        </div>
    );

    return (
        <nav className="bg-white border-b sticky top-0 z-50 dark:bg-gray-800 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <h1 className="text-2xl font-bold text-primary dark:text-primary">theNexus</h1>

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
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search professionals, companies..."
                                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                            />
                        </div>

                        <div className="hidden md:flex gap-6">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href || (item.href !== '/dashboard/professional' && item.href !== '/dashboard/hr-partner' && pathname.startsWith(item.href));
                                return (
                                    <a
                                        key={item.href} href={item.href}
                                        className={`flex px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 ${isActive
                                            ? 'bg-green-50 hover:bg-green-50 dark:bg-green-900 dark:hover:bg-green-900'
                                            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <item.icon className={`w-5 h-5 mr-2 ${isActive ? 'text-green-700 hover:text-gray-600 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
                                            }`} />
                                        <span className="text-sm font-semibold">{item.label}</span>
                                    </a>
                                )
                            })}

                            {/* More Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMoreDropdown(!showMoreDropdown);
                                    }}
                                    className="flex items-center px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    {/* <MoreHorizontal className="w-5 h-5 mr-2" /> */}
                                    <span className="text-sm font-semibold">More</span>
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                </button>

                                {showMoreDropdown && (
                                    <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 dark:bg-gray-800 dark:border-gray-700">
                                        {moreItems.map((item) => {
                                            const isActive = pathname === item.href || pathname.startsWith(item.href);
                                            return (
                                                <a
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`flex items-center px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 ${isActive ? 'text-primary bg-green-50 dark:bg-green-900 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'
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
                    <div className="flex items-center gap-4">
                        <RoleSwitcherWithPrivacy />
                        <button className="p-2 text-gray-600 hover:text-primary relative dark:text-gray-400 dark:hover:text-primary">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                            <Settings className="w-5 h-5" />
                        </button>
                        <CustomUserButton />
                    </div>

                    {/* <UserButton /> */}
                </div>
            </div>
        </nav>
    )
}

export default DashboardNavBar;
