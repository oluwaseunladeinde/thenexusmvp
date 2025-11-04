"use client";

import React, { useState } from 'react';
import {
    X, Star, Building, MapPin, DollarSign,
    Clock, Calendar, Briefcase, Users, CheckCircle,
    XCircle, AlertCircle, Mail, Phone, Linkedin,
    MessageSquare, ChevronDown, Filter, Search,
    TrendingUp, Award, Shield
} from 'lucide-react';


const IntriductionRequestDesignPage = () => {

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseType, setResponseType] = useState<string | null>(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    // Mock data for introduction requests
    const introductionRequests = [
        {
            id: 1,
            status: 'pending',
            company: {
                name: 'FinanceHub Ltd',
                logo: 'FH',
                industry: 'Fintech',
                size: '201-500',
                location: 'Lagos, Nigeria',
                description: 'Leading digital banking platform transforming financial services across West Africa',
                verified: true,
            },
            role: {
                title: 'VP of Strategy',
                department: 'Executive',
                type: 'Full-time',
                seniority: 'Executive',
                salary: '₦12,000,000 - ₦18,000,000',
                location: 'Lagos',
                remote: 'Hybrid',
                description: 'Lead strategic initiatives and drive business transformation across our fintech platform. You will work directly with the CEO and board to shape the future of digital banking in Nigeria.',
                responsibilities: [
                    'Develop and execute strategic plans aligned with company vision',
                    'Lead cross-functional teams on strategic initiatives',
                    'Analyze market trends and competitive landscape',
                    'Present strategic recommendations to executive leadership',
                    'Drive operational excellence and performance metrics',
                ],
                requirements: [
                    '10+ years of strategy and operations experience',
                    'Experience in fintech or financial services',
                    'Proven track record of strategic planning',
                    'Strong analytical and leadership skills',
                    'MBA from top-tier institution preferred',
                ],
                benefits: [
                    'Competitive salary with performance bonuses',
                    'Stock options in fast-growing company',
                    'Health insurance for family',
                    'Professional development budget',
                    'Flexible working arrangements',
                ],
            },
            hrContact: {
                name: 'Chioma Adeleke',
                title: 'Head of Talent Acquisition',
                photo: 'CA',
                email: 'chioma@financehub.com',
                phone: '+234 801 234 5678',
                linkedin: 'linkedin.com/in/chioma-adeleke',
            },
            matchScore: 95,
            personalizedMessage: 'Hi Adebayo, I came across your profile and was impressed by your extensive operations experience at TechCorp. Your background in scaling operations and strategic planning aligns perfectly with what we need for our VP of Strategy role. We are growing rapidly and need someone who can help us navigate our next phase of growth. Would love to discuss this opportunity with you.',
            sentDate: '2024-01-10T14:30:00Z',
            expiresDate: '2024-01-17T14:30:00Z',
            viewed: true,
            viewedDate: '2024-01-11T09:15:00Z',
        },
        {
            id: 2,
            status: 'pending',
            company: {
                name: 'Global Energy Corp',
                logo: 'GE',
                industry: 'Oil & Gas',
                size: '500+',
                location: 'Port Harcourt, Nigeria',
                description: 'International energy company with operations across Nigeria and West Africa',
                verified: true,
            },
            role: {
                title: 'Head of Operations',
                department: 'Operations',
                type: 'Full-time',
                seniority: 'Senior',
                salary: '₦15,000,000 - ₦22,000,000',
                location: 'Port Harcourt',
                remote: 'On-site',
                description: 'Oversee all operational activities across our Niger Delta facilities. This is a critical leadership role requiring someone who can manage complex operations, ensure safety compliance, and drive efficiency improvements.',
                responsibilities: [
                    'Manage day-to-day operations across multiple facilities',
                    'Ensure HSE compliance and safety standards',
                    'Optimize operational efficiency and reduce costs',
                    'Lead team of 200+ operations staff',
                    'Report to Chief Operating Officer',
                ],
                requirements: [
                    '12+ years in oil & gas operations',
                    'Strong HSE background',
                    'Experience with multi-site management',
                    'P&L responsibility',
                    'Engineering degree required',
                ],
                benefits: [
                    'Housing allowance',
                    'Vehicle and driver',
                    'Annual performance bonus',
                    'International training opportunities',
                    'Pension contribution',
                ],
            },
            hrContact: {
                name: 'David Okafor',
                title: 'Senior HR Business Partner',
                photo: 'DO',
                email: 'david.okafor@globalenergy.com',
                phone: '+234 803 456 7890',
                linkedin: 'linkedin.com/in/david-okafor',
            },
            matchScore: 88,
            personalizedMessage: 'Your operations background and leadership experience make you an ideal candidate for this role. We need someone who understands the complexities of managing operations at scale.',
            sentDate: '2024-01-08T10:20:00Z',
            expiresDate: '2024-01-15T10:20:00Z',
            viewed: true,
            viewedDate: '2024-01-09T16:45:00Z',
        },
        {
            id: 3,
            status: 'pending',
            company: {
                name: 'RetailPro Nigeria',
                logo: 'RP',
                industry: 'Retail',
                size: '51-200',
                location: 'Lagos, Nigeria',
                description: 'Fast-growing retail chain with 50+ locations across Nigeria',
                verified: false,
            },
            role: {
                title: 'Director of Operations',
                department: 'Operations',
                type: 'Full-time',
                seniority: 'Director',
                salary: '₦10,000,000 - ₦14,000,000',
                location: 'Lagos',
                remote: 'Hybrid',
                description: 'Lead operational excellence across our retail network. Drive process improvements and ensure consistent customer experience.',
                responsibilities: [
                    'Oversee 50+ retail locations',
                    'Implement operational best practices',
                    'Manage regional operations managers',
                    'Drive inventory optimization',
                    'Improve customer satisfaction metrics',
                ],
                requirements: [
                    '8+ years retail operations experience',
                    'Multi-site management',
                    'Process improvement expertise',
                    'Strong people management',
                    'Data-driven decision making',
                ],
                benefits: [
                    'Performance bonuses',
                    'Staff discounts',
                    'Health insurance',
                    'Career growth opportunities',
                ],
            },
            hrContact: {
                name: 'Funmi Hassan',
                title: 'HR Manager',
                photo: 'FH',
                email: 'funmi@retailpro.ng',
                phone: '+234 805 678 9012',
                linkedin: 'linkedin.com/in/funmi-hassan',
            },
            matchScore: 82,
            personalizedMessage: 'We are expanding rapidly and need experienced operations leaders. Your profile caught our attention.',
            sentDate: '2024-01-05T11:00:00Z',
            expiresDate: '2024-01-12T11:00:00Z',
            viewed: false,
            viewedDate: null,
        },
        {
            id: 4,
            status: 'accepted',
            company: {
                name: 'TechVentures Ltd',
                logo: 'TV',
                industry: 'Technology',
                size: '11-50',
                location: 'Lagos, Nigeria',
                description: 'Innovative tech startup building solutions for African markets',
                verified: true,
            },
            role: {
                title: 'COO',
                department: 'Executive',
                type: 'Full-time',
                seniority: 'C-Suite',
                salary: '₦18,000,000 - ₦25,000,000',
                location: 'Lagos',
                remote: 'Flexible',
            },
            hrContact: {
                name: 'Emeka Nwosu',
                title: 'CEO',
                photo: 'EN',
            },
            matchScore: 92,
            personalizedMessage: 'We need a strong operations leader to help us scale.',
            sentDate: '2024-01-03T09:00:00Z',
            expiresDate: '2024-01-10T09:00:00Z',
            viewed: true,
            viewedDate: '2024-01-03T14:20:00Z',
            respondedDate: '2024-01-04T10:30:00Z',
            responseMessage: 'Thank you for reaching out! I am very interested in this opportunity and would love to learn more about your vision for the role.',
        },
        {
            id: 5,
            status: 'declined',
            company: {
                name: 'Manufacturing Corp',
                logo: 'MC',
                industry: 'Manufacturing',
                size: '201-500',
                location: 'Kano, Nigeria',
                description: 'Leading manufacturing company in Northern Nigeria',
                verified: true,
            },
            role: {
                title: 'Operations Director',
                department: 'Operations',
                type: 'Full-time',
                seniority: 'Director',
                salary: '₦9,000,000 - ₦13,000,000',
                location: 'Kano',
                remote: 'On-site',
            },
            hrContact: {
                name: 'Ibrahim Yusuf',
                title: 'HR Director',
                photo: 'IY',
            },
            matchScore: 75,
            personalizedMessage: 'Your experience in operations would be valuable to our team.',
            sentDate: '2024-01-01T08:00:00Z',
            expiresDate: '2024-01-08T08:00:00Z',
            viewed: true,
            viewedDate: '2024-01-02T11:00:00Z',
            respondedDate: '2024-01-02T15:45:00Z',
            responseMessage: 'Thank you for considering me, but I am not looking to relocate at this time.',
        },
        {
            id: 6,
            status: 'expired',
            company: {
                name: 'Consulting Partners',
                logo: 'CP',
                industry: 'Consulting',
                size: '51-200',
                location: 'Abuja, Nigeria',
                description: 'Strategy consulting firm serving Fortune 500 clients',
                verified: true,
            },
            role: {
                title: 'Senior Partner',
                department: 'Consulting',
                type: 'Full-time',
                seniority: 'Partner',
                salary: '₦20,000,000 - ₦30,000,000',
                location: 'Abuja',
                remote: 'Hybrid',
            },
            hrContact: {
                name: 'Sarah Okon',
                title: 'Managing Partner',
                photo: 'SO',
            },
            matchScore: 85,
            personalizedMessage: 'We are looking for experienced leaders to join our partnership.',
            sentDate: '2023-12-20T10:00:00Z',
            expiresDate: '2023-12-27T10:00:00Z',
            viewed: false,
            viewedDate: null,
        },
    ];

    // Filter and sort logic
    const filteredRequests = introductionRequests
        .filter(req => {
            // Filter by active tab
            if (activeTab !== 'all' && req.status !== activeTab) return false;

            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    req.company.name.toLowerCase().includes(query) ||
                    req.role.title.toLowerCase().includes(query) ||
                    req.company.industry.toLowerCase().includes(query)
                );
            }

            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.sentDate) - new Date(a.sentDate);
            } else if (sortBy === 'oldest') {
                return new Date(a.sentDate) - new Date(b.sentDate);
            } else if (sortBy === 'match') {
                return b.matchScore - a.matchScore;
            } else if (sortBy === 'expiring') {
                return new Date(a.expiresDate) - new Date(b.expiresDate);
            }
            return 0;
        });

    // Count by status
    const statusCounts = {
        all: introductionRequests.length,
        pending: introductionRequests.filter(r => r.status === 'pending').length,
        accepted: introductionRequests.filter(r => r.status === 'accepted').length,
        declined: introductionRequests.filter(r => r.status === 'declined').length,
        expired: introductionRequests.filter(r => r.status === 'expired').length,
    };

    // Helper functions
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const getDaysUntilExpiry = (expiryDate: string) => {
        const now = new Date();
        const expiry = new Date(expiryDate);
        const diffMs = expiry - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleAccept = () => {
        setResponseType('accept');
        setShowResponseModal(true);
    };

    const handleDecline = () => {
        setResponseType('decline');
        setShowResponseModal(true);
    };

    const handleSubmitResponse = () => {
        console.log('Submitting response:', {
            requestId: selectedRequest.id || null,
            type: responseType,
            message: responseMessage,
        });
        // API call would go here
        setShowResponseModal(false);
        setSelectedRequest(null);
        setResponseMessage('');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'accepted':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'declined':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'expired':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return Clock;
            case 'accepted':
                return CheckCircle;
            case 'declined':
                return XCircle;
            case 'expired':
                return AlertCircle;
            default:
                return Clock;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary mb-2">
                                Introduction Requests
                            </h1>
                            <p className="text-gray-600">
                                Companies interested in connecting with you
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search companies or roles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="match">Best Match</option>
                                <option value="expiring">Expiring Soon</option>
                            </select>
                        </div>
                    </div>

                    {/* Status Tabs */}
                    <div className="flex items-center gap-4 mt-6 border-b border-gray-200">
                        {['all', 'pending', 'accepted', 'declined', 'expired'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setActiveTab(status)}
                                className={`pb-3 px-2 font-semibold text-sm transition relative ${activeTab === status
                                    ? 'text-[#2E8B57] border-b-2 border-[#2E8B57]'
                                    : 'text-gray-600 hover:text-[#2E8B57]'
                                    }`}
                            >
                                <span className="capitalize">{status}</span>
                                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs">
                                    {statusCounts[status]}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {filteredRequests.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0A2540] mb-2">
                            No introduction requests found
                        </h3>
                        <p className="text-gray-600">
                            {searchQuery
                                ? "Try adjusting your search criteria"
                                : "New opportunities will appear here when companies show interest"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRequests.map((request) => {
                            const StatusIcon = getStatusIcon(request.status);
                            const daysUntilExpiry = getDaysUntilExpiry(request.expiresDate);
                            const isExpiring = daysUntilExpiry <= 2 && request.status === 'pending';
                            const isExpired = request.status === 'expired';

                            return (
                                <div
                                    key={request.id}
                                    className={`bg-white border rounded-xl p-6 transition cursor-pointer ${isExpired
                                        ? 'border-gray-200 opacity-60'
                                        : 'border-gray-200 hover:border-[#2E8B57] hover:shadow-lg'
                                        }`}
                                    onClick={() => setSelectedRequest(request)}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Company Logo */}
                                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 ${isExpired
                                            ? 'bg-gray-400'
                                            : 'bg-gradient-to-br from-[#2E8B57] to-[#3ABF7A]'
                                            }`}>
                                            {request.company.logo}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-xl font-bold text-[#0A2540]">
                                                            {request.role.title}
                                                        </h3>
                                                        {request.company.verified && (
                                                            <Shield className="w-5 h-5 text-blue-600" />
                                                        )}
                                                        {!request.viewed && request.status === 'pending' && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">
                                                                NEW
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                        <Building className="w-4 h-4" />
                                                        <span className="font-semibold">{request.company.name}</span>
                                                        <span>•</span>
                                                        <span className="text-sm">{request.company.industry}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(request.status)}`}>
                                                        <StatusIcon className="w-4 h-4" />
                                                        <span className="capitalize">{request.status}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                                        <Star className="w-4 h-4" />
                                                        {request.matchScore}% Match
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Personalized Message Preview */}
                                            <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 rounded">
                                                <p className="text-sm text-gray-700 line-clamp-2">
                                                    <span className="font-semibold text-blue-900">Message from {request.hrContact.name}: </span>
                                                    {request.personalizedMessage}
                                                </p>
                                            </div>

                                            {/* Job Details */}
                                            <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4" />
                                                    <span className="font-semibold">{request.role.salary}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {request.role.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="w-4 h-4" />
                                                    {request.role.type}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Sent {getTimeAgo(request.sentDate)}
                                                </div>
                                            </div>

                                            {/* Expiry Warning */}
                                            {isExpiring && (
                                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                                    <div className="flex items-center gap-2 text-orange-800">
                                                        <AlertCircle className="w-5 h-5" />
                                                        <span className="font-semibold text-sm">
                                                            Expires in {daysUntilExpiry} {daysUntilExpiry === 1 ? 'day' : 'days'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {isExpired && (
                                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <AlertCircle className="w-5 h-5" />
                                                        <span className="font-semibold text-sm">
                                                            Expired on {formatDate(request.expiresDate)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Response Info (for accepted/declined) */}
                                            {(request.status === 'accepted' || request.status === 'declined') && (
                                                <div className={`border rounded-lg p-3 mb-4 ${request.status === 'accepted'
                                                    ? 'bg-green-50 border-green-200'
                                                    : 'bg-red-50 border-red-200'
                                                    }`}>
                                                    <div className="flex items-start gap-2">
                                                        <StatusIcon className={`w-5 h-5 mt-0.5 ${request.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                                                            }`} />
                                                        <div>
                                                            <p className={`font-semibold text-sm mb-1 ${request.status === 'accepted' ? 'text-green-900' : 'text-red-900'
                                                                }`}>
                                                                You {request.status} this on {formatDate(request.respondedDate)}
                                                            </p>
                                                            {request.responseMessage && (
                                                                <p className="text-sm text-gray-700">
                                                                    "{request.responseMessage}"
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-3">
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedRequest(request);
                                                                handleAccept();
                                                            }}
                                                            className="px-5 py-2 bg-[#2E8B57] text-white rounded-lg font-semibold hover:bg-[#1F5F3F] transition"
                                                        >
                                                            Accept Introduction
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedRequest(request);
                                                            }}
                                                            className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition"
                                                        >
                                                            View Full Details
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedRequest(request);
                                                                handleDecline();
                                                            }}
                                                            className="px-5 py-2 text-gray-600 hover:text-gray-900 font-semibold"
                                                        >
                                                            Decline
                                                        </button>
                                                    </>
                                                )}
                                                {request.status === 'accepted' && (
                                                    <button className="px-5 py-2 bg-[#2E8B57] text-white rounded-lg font-semibold hover:bg-[#1F5F3F] transition">
                                                        Continue Conversation
                                                    </button>
                                                )}
                                                {(request.status === 'declined' || request.status === 'expired') && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedRequest(request);
                                                        }}
                                                        className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition"
                                                    >
                                                        View Details
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default IntriductionRequestDesignPage