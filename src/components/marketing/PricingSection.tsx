"use client";

import React, { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Check, X, Crown } from 'lucide-react'

interface ProfessionalTier {
    name: string;
    price: number;
    originalPrice?: number | null;
    description: string;
    features: string[];
    limitations: string[];
    cta: string;
    popular: boolean;
}

interface OrganizationTier {
    name: string;
    price: number | null;
    originalPrice?: number | null;
    description: string;
    credits: number | string;
    jobPosts: number | string;
    teamMembers: number | string;
    features: string[];
    limitations: string[];
    cta: string;
    popular: boolean;
}

const PricingSection = () => {
    const [userType, setUserType] = useState<'professional' | 'organization'>('professional')
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

    const { user, isLoaded } = useUser()

    // Determine user type from metadata
    const authUserType = user?.publicMetadata?.userType as string
    const isLoggedIn = isLoaded && !!user

    // Get dashboard URL based on user type
    const getDashboardUrl = () => {
        if (authUserType === 'professional') return '/professional/dashboard'
        if (authUserType === 'hr-partner') return '/dashboard/hr-partner'
        return '/dashboard' // fallback
    }

    const professionalTiers: ProfessionalTier[] = [
        {
            name: 'Free',
            price: 0,
            description: 'Get started with basic access',
            features: [
                'Basic profile creation',
                'Limited talent browsing (5 views/month)',
                'Receive introduction requests',
                'Basic verification',
                'Community access'
            ],
            limitations: [
                'Limited monthly views',
                'No priority matching',
                'Basic support only'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Professional',
            price: billingCycle === 'monthly' ? 12000 : 9600,
            originalPrice: billingCycle === 'monthly' ? null : 12000,
            description: 'Full access for active professionals',
            features: [
                'Unlimited talent browsing',
                'Priority search & matching',
                'Send unlimited introductions',
                'Advanced verification',
                'Networking tools',
                'Profile analytics',
                'Priority support'
            ],
            limitations: [],
            cta: 'Start Professional',
            popular: true
        },
        {
            name: 'Executive',
            price: billingCycle === 'monthly' ? 25000 : 20000,
            originalPrice: billingCycle === 'monthly' ? null : 25000,
            description: 'Strategic tools for senior executives',
            features: [
                'Everything in Professional',
                'Market intelligence & salary data',
                'Industry insights & trends',
                'Executive networking events',
                'Dedicated career advisor',
                'Custom profile optimization',
                'VIP support'
            ],
            limitations: [],
            cta: 'Go Executive',
            popular: false
        }
    ]

    const organizationTiers: OrganizationTier[] = [
        {
            name: 'Starter',
            price: billingCycle === 'monthly' ? 50000 : 40000,
            originalPrice: billingCycle === 'monthly' ? null : 50000,
            description: 'Perfect for small teams',
            credits: 25,
            jobPosts: 5,
            teamMembers: 3,
            features: [
                '25 introduction credits',
                '5 job postings/month',
                'Up to 3 team members',
                'Basic candidate search',
                'Standard support'
            ],
            limitations: [],
            cta: 'Start Starter',
            popular: false
        },
        {
            name: 'Professional',
            price: billingCycle === 'monthly' ? 150000 : 120000,
            originalPrice: billingCycle === 'monthly' ? null : 150000,
            description: 'For growing companies',
            credits: 100,
            jobPosts: 20,
            teamMembers: 10,
            features: [
                '100 introduction credits',
                '20 job postings/month',
                'Up to 10 team members',
                'Advanced candidate search',
                'Priority matching',
                'Analytics dashboard',
                'Priority support'
            ],
            limitations: [],
            cta: 'Go Professional',
            popular: true
        },
        {
            name: 'Enterprise',
            price: null,
            description: 'Custom solutions for large organizations',
            credits: 'Unlimited',
            jobPosts: 'Unlimited',
            teamMembers: 'Unlimited',
            features: [
                'Unlimited introduction credits',
                'Unlimited job postings',
                'Unlimited team members',
                'Custom integrations',
                'Dedicated account manager',
                'Advanced analytics',
                '24/7 premium support',
                'Custom SLAs'
            ],
            limitations: [],
            cta: 'Contact Sales',
            popular: false
        }
    ]

    const currentTiers = userType === 'professional' ? professionalTiers : organizationTiers
    const savings = billingCycle === 'annual' ? (userType === 'professional' ? 'Save up to ₦60k annually (20% off)' : 'Save up to ₦360k annually (20% off)') : null

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-secondary dark:text-white mb-4">
                        Choose Your Plan
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Select the perfect plan for your professional journey or organization's hiring needs
                    </p>
                </div>

                {/* Toggles */}
                <div className="flex flex-col items-center gap-8 mb-12">
                    {/* User Type Toggle */}
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <button
                            onClick={() => setUserType('professional')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${userType === 'professional'
                                ? 'bg-primary text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            For Professionals
                        </button>
                        <button
                            onClick={() => setUserType('organization')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${userType === 'organization'
                                ? 'bg-primary text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            For Organizations
                        </button>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex items-center gap-4">
                        <span className={`font-medium ${billingCycle === 'monthly' ? 'text-secondary dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            Monthly
                        </span>
                        <Switch
                            checked={billingCycle === 'annual'}
                            onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
                            className="data-[state=checked]:bg-primary"
                        />
                        <span className={`font-medium ${billingCycle === 'annual' ? 'text-secondary dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                            Annual
                        </span>
                        {savings && (
                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                {savings}
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {currentTiers.map((tier, index) => (
                        <Card
                            key={tier.name}
                            className={`relative bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${tier.popular ? 'border-primary shadow-lg scale-105' : ''
                                }`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-primary text-white px-4 py-1 flex items-center gap-1">
                                        <Crown className="w-4 h-4" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-2xl font-bold text-secondary dark:text-white">
                                    {tier.name}
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300">
                                    {tier.description}
                                </CardDescription>

                                <div className="mt-4">
                                    {tier.price !== null ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-4xl font-bold text-primary">
                                                ₦{tier.price.toLocaleString()}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400">/month</span>
                                            {tier.originalPrice && (
                                                <span className="text-sm text-gray-500 dark:text-gray-500 line-through">
                                                    ₦{tier.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-2xl font-bold text-primary">
                                            Custom Pricing
                                        </div>
                                    )}
                                </div>

                                {userType === 'organization' && (tier as OrganizationTier).credits && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                        {(tier as OrganizationTier).credits} credits • {(tier as OrganizationTier).jobPosts} job posts • {(tier as OrganizationTier).teamMembers} team members
                                    </div>
                                )}
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {tier.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                                    </div>
                                ))}

                                {tier.limitations.map((limitation, limitationIndex) => (
                                    <div key={limitationIndex} className="flex items-start gap-3">
                                        <X className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 shrink-0" />
                                        <span className="text-sm text-gray-500 dark:text-gray-500">{limitation}</span>
                                    </div>
                                ))}
                            </CardContent>

                            <CardFooter>
                                <Button
                                    asChild
                                    className={`w-full ${tier.popular
                                        ? 'bg-primary hover:bg-[#1F5F3F] text-white'
                                        : tier.name === 'Free'
                                            ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                                            : 'bg-primary hover:bg-[#1F5F3F] text-white'
                                        }`}
                                    variant={tier.name === 'Free' ? 'outline' : 'default'}
                                >
                                    <Link href={isLoggedIn ? getDashboardUrl() : (tier.cta === 'Contact Sales' ? '/contact-sales' : '/sign-up')}>
                                        {isLoggedIn ? "Go to Dashboard" : tier.cta}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Bottom Note */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 dark:text-gray-400">
                        All plans include our premium verification process and 30-day money-back guarantee.
                        {userType === 'professional' && ' Free tier requires application approval.'}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default PricingSection
