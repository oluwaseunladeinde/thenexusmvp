"use client";

import { Bell, ChevronDown, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const HeaderNav = () => {

    const [activeTab, setActiveTab] = useState('overview');


    // Mock data
    const professionalData = {
        name: "Adebayo Okonkwo",
        title: "Director of Operations",
        company: "TechCorp Nigeria",
        location: "Lagos, Nigeria",
        experience: 12,
        verificationStatus: "verified",
        profileCompleteness: 85,
        profilePhoto: "AO",
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-linear-to-br from-primary to-[#3ABF7A] rounded-sm flex items-center text-xl justify-center text-white font-bold">N</div>
                            <h1 className="text-2xl font-bold text-primary">theNexus</h1>
                        </Link>
                        <nav className="hidden md:flex gap-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`text-sm font-medium transition ${activeTab === 'overview'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-600 hover:text-primary'
                                    } pb-1`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('opportunities')}
                                className={`text-sm font-medium transition ${activeTab === 'opportunities'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-600 hover:text-primary'
                                    } pb-1`}
                            >
                                Opportunities
                            </button>
                            <button
                                onClick={() => setActiveTab('messages')}
                                className={`text-sm font-medium transition ${activeTab === 'messages'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-600 hover:text-primary'
                                    } pb-1`}
                            >
                                Messages
                            </button>
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`text-sm font-medium transition ${activeTab === 'profile'
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-600 hover:text-primary'
                                    } pb-1`}
                            >
                                Profile
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 text-gray-600 hover:text-primary relative"
                            aria-label="Notifications"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-label="You have unread notifications"></span>
                        </button>
                        <button className="p-2 text-gray-600 hover:text-primary" aria-label="Settings">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button
                            className="flex items-center gap-3 pl-4 border-l border-gray-200"
                            aria-label="Profile menu"
                        >
                            <div className="w-10 h-10 bg-linear-to-br from-primary to-[#3ABF7A] rounded-full flex items-center justify-center text-white font-bold">
                                {professionalData.profilePhoto}
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HeaderNav