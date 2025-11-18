"use client";

import React from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

const CTASection = () => {
    const { user, isLoaded } = useUser()

    // Determine user type from metadata
    const userType = user?.publicMetadata?.userType as string
    const isLoggedIn = isLoaded && !!user

    // Get dashboard URL based on user type
    const getDashboardUrl = () => {
        if (userType === 'professional') return '/professional/dashboard'
        if (userType === 'hr-partner') return '/dashboard/hr-partner'
        return '/dashboard' // fallback
    }

    return (
        <section className="py-20 bg-gradient-to-r from-[#2E8B57] to-[#3ABF7A] text-white">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                    Ready to Transform Your Career Network?
                </h2>

                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                    Join theNexus today and start building meaningful connections that lead to real career opportunities.
                    Your next big break could be just one conversation away.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    {isLoggedIn ? (
                        <Link
                            href={getDashboardUrl()}
                            className="bg-white text-[#2E8B57] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Go to Your Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/sign-up?type=professional"
                                className="bg-white text-[#2E8B57] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                I'm Looking for Opportunities
                            </Link>
                            <Link
                                href="/sign-up?type=hiring"
                                className="bg-[#CFAF50] text-[#0A2540] hover:bg-[#D4AF37] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                I'm Hiring Talent
                            </Link>
                        </>
                    )}
                </div>

                <div className="text-sm opacity-75">
                    <p>No credit card required • 14-day free trial • Cancel anytime</p>
                </div>

                {/* Trust indicators */}
                <div className="mt-12 pt-8 border-t border-white/20">
                    <div className="flex flex-wrap justify-center items-center gap-8 text-sm opacity-75">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-[#CFAF50]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Free to start</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-[#CFAF50]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Verified connections</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-[#CFAF50]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Privacy protected</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTASection
