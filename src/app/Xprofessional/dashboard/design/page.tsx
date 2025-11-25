"use client";

import React, { useState } from 'react';
import { Bell, Search, Settings, ChevronDown, TrendingUp, Users, Briefcase, Eye, MessageSquare, CheckCircle, Clock, AlertCircle, ArrowRight, Shield, Star, MapPin, Calendar, DollarSign, Building } from 'lucide-react';

export default function ProfessionalDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedRequest, setSelectedRequest] = useState(null);

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

    const stats = {
        profileViews: 127,
        introductionRequests: 8,
        activeConversations: 3,
        responseRate: 75,
    };

    const introductionRequests = [
        {
            id: 1,
            company: "FinanceHub Ltd",
            companyLogo: "FH",
            role: "VP of Strategy",
            salary: "₦12-18M",
            location: "Lagos",
            postedDate: "2 days ago",
            status: "pending",
            matchScore: 95,
            description: "Leading strategy and operations for Nigeria's fastest-growing fintech",
            requirements: ["10+ years experience", "Strategic planning", "Team leadership"],
        },
        {
            id: 2,
            company: "Global Energy Corp",
            companyLogo: "GE",
            role: "Head of Operations",
            salary: "₦15-22M",
            location: "Port Harcourt",
            postedDate: "5 days ago",
            status: "pending",
            matchScore: 88,
            description: "Oversee operations across multiple facilities in the Niger Delta region",
            requirements: ["Oil & Gas experience", "Operations management", "P&L responsibility"],
        },
        {
            id: 3,
            company: "RetailPro Nigeria",
            companyLogo: "RP",
            role: "Director of Operations",
            salary: "₦10-14M",
            location: "Lagos",
            postedDate: "1 week ago",
            status: "pending",
            matchScore: 82,
            description: "Lead operational excellence across 50+ retail locations nationwide",
            requirements: ["Retail experience", "Multi-site management", "Process optimization"],
        },
    ];

    const recentActivity = [
        {
            id: 1,
            type: "view",
            company: "TechVentures Ltd",
            action: "viewed your profile",
            time: "2 hours ago",
            icon: Eye,
        },
        {
            id: 2,
            type: "message",
            company: "FinanceHub Ltd",
            action: "sent you a message",
            time: "5 hours ago",
            icon: MessageSquare,
        },
        {
            id: 3,
            type: "view",
            company: "Consulting Partners",
            action: "viewed your profile",
            time: "1 day ago",
            icon: Eye,
        },
    ];

    const marketInsights = [
        {
            title: "Average Salary for Directors",
            value: "₦12.5M",
            change: "+8% YoY",
            trend: "up",
        },
        {
            title: "Open Director Roles",
            value: "247",
            change: "+15% this month",
            trend: "up",
        },
        {
            title: "Your Profile Rank",
            value: "Top 10%",
            change: "in your field",
            trend: "neutral",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            {/* <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <h1 className="text-2xl font-bold text-primary">theNexus</h1>
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
                            <button className="p-2 text-gray-600 hover:text-primary relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <button className="p-2 text-gray-600 hover:text-primary">
                                <Settings className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="w-10 h-10 bg-linear-to-br from-primary to-[#3ABF7A] rounded-full flex items-center justify-center text-white font-bold">
                                    {professionalData.profilePhoto}
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </header> */}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Welcome Section */}
                        <div className="bg-linear-to-r from-primary to-[#1F5F3F] rounded-2xl p-8 text-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">
                                        Welcome back, {professionalData.name.split(' ')[0]}!
                                    </h2>
                                    <p className="text-white/90 text-lg mb-6">
                                        You have {introductionRequests.filter(r => r.status === 'pending').length} new introduction requests waiting for your review
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                                            <Shield className="w-4 h-4" />
                                            <span className="text-sm font-semibold">Verified Professional</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                                            <Star className="w-4 h-4" />
                                            <span className="text-sm font-semibold">{professionalData.profileCompleteness}% Complete</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-sm">
                                        {professionalData.profilePhoto}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Profile Views</p>
                                <p className="text-3xl font-bold text-secondary">{stats.profileViews}</p>
                                <p className="text-xs text-green-600 mt-1">+12% this week</p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-6 h-6 text-primary" />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Introduction Requests</p>
                                <p className="text-3xl font-bold text-secondary">{stats.introductionRequests}</p>
                                <p className="text-xs text-green-600 mt-1">+3 new today</p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <Clock className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Active Conversations</p>
                                <p className="text-3xl font-bold text-secondary">{stats.activeConversations}</p>
                                <p className="text-xs text-gray-600 mt-1">2 require response</p>
                            </div>

                            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="text-gray-600 text-sm mb-1">Response Rate</p>
                                <p className="text-3xl font-bold text-secondary">{stats.responseRate}%</p>
                                <p className="text-xs text-green-600 mt-1">Above average</p>
                            </div>
                        </div>

                        {/* Two Column Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Introduction Requests */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-secondary">
                                            Recent Introduction Requests
                                        </h3>
                                        <button className="text-primary text-sm font-semibold hover:text-[#1F5F3F]">
                                            View All →
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {introductionRequests.slice(0, 3).map((request: any) => (
                                            <div
                                                key={request.id}
                                                className="border border-gray-200 rounded-xl p-5 hover:border-primary hover:shadow-md transition cursor-pointer"
                                                onClick={() => setSelectedRequest(request)}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-linear-to-br from-primary to-[#3ABF7A] rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0">
                                                        {request.companyLogo}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-4 mb-2">
                                                            <div>
                                                                <h4 className="font-bold text-secondary text-lg">
                                                                    {request.role}
                                                                </h4>
                                                                <p className="text-gray-600 text-sm">
                                                                    {request.company}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                                <Star className="w-3 h-3" />
                                                                {request.matchScore}% Match
                                                            </div>
                                                        </div>

                                                        <p className="text-gray-700 text-sm mb-3">
                                                            {request.description}
                                                        </p>

                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                            <div className="flex items-center gap-1">
                                                                <DollarSign className="w-4 h-4" />
                                                                {request.salary}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {request.location}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-4 h-4" />
                                                                {request.postedDate}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <button className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1F5F3F] transition">
                                                                Accept Introduction
                                                            </button>
                                                            <button className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:border-gray-400 transition">
                                                                View Details
                                                            </button>
                                                            <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                                                                Decline
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Market Insights */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-secondary mb-4">
                                        Market Insights
                                    </h3>
                                    <div className="space-y-4">
                                        {marketInsights.map((insight, index) => (
                                            <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                                <p className="text-sm text-gray-600 mb-1">{insight.title}</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-2xl font-bold text-secondary">
                                                        {insight.value}
                                                    </p>
                                                    {insight.trend === 'up' && (
                                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-green-600 mt-1">{insight.change}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-secondary mb-4">
                                        Recent Activity
                                    </h3>
                                    <div className="space-y-3">
                                        {recentActivity.map((activity) => (
                                            <div key={activity.id} className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                                    <activity.icon className="w-4 h-4 text-gray-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-semibold">{activity.company}</span>
                                                        {' '}{activity.action}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Profile Completion */}
                                <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            {professionalData.profileCompleteness}%
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-secondary">Profile Completion</h3>
                                            <p className="text-sm text-gray-600">Almost there!</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-200 rounded-full h-2 mb-3">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${professionalData.profileCompleteness}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-700 mb-3">
                                        Complete your profile to increase visibility by 40%
                                    </p>
                                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                                        Complete Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'opportunities' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-secondary">
                                Introduction Requests ({introductionRequests.length})
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        placeholder="Search opportunities..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-primary transition">
                                    <span className="flex items-center gap-2">
                                        Filters
                                        <ChevronDown className="w-4 h-4" />
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {introductionRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary hover:shadow-lg transition"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 bg-linear-to-br from-primary to-[#3ABF7A] rounded-xl flex items-center justify-center text-white font-bold text-2xl shrink-0">
                                            {request.companyLogo}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-secondary mb-1">
                                                        {request.role}
                                                    </h3>
                                                    <p className="text-gray-600 mb-2">{request.company}</p>
                                                </div>
                                                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
                                                    <Star className="w-4 h-4" />
                                                    {request.matchScore}% Match
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-4">{request.description}</p>

                                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="font-semibold">{request.salary}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {request.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {request.postedDate}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {request.requirements.map((req, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                                    >
                                                        {req}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-[#1F5F3F] transition">
                                                    Accept Introduction
                                                </button>
                                                <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition">
                                                    View Full Details
                                                </button>
                                                <button className="px-6 py-2 text-gray-600 hover:text-gray-900">
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}