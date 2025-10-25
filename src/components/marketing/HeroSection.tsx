'use client'

import React from 'react'
import Link from 'next/link'

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2E8B57] via-[#3ABF7A] to-[#1F5F3F] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" aria-hidden="true">
                <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-white rounded-full"></div>
                <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute bottom-20 right-10 w-16 h-16 bg-white rounded-full"></div>
            </div>

            {/* Floating Cards Animation */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                        <div className="w-12 h-12 bg-white/30 rounded-full mb-2"></div>
                        <div className="w-16 h-2 bg-white/30 rounded mb-1"></div>
                        <div className="w-12 h-2 bg-white/30 rounded"></div>
                    </div>
                </div>
                <div className="absolute top-1/3 right-1/4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                        <div className="w-12 h-12 bg-white/30 rounded-full mb-2"></div>
                        <div className="w-16 h-2 bg-white/30 rounded mb-1"></div>
                        <div className="w-12 h-2 bg-white/30 rounded"></div>
                    </div>
                </div>
                <div className="absolute bottom-1/4 left-1/3 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                        <div className="w-12 h-12 bg-white/30 rounded-full mb-2"></div>
                        <div className="w-16 h-2 bg-white/30 rounded mb-1"></div>
                        <div className="w-12 h-2 bg-white/30 rounded"></div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    Turn Conversations Into
                    <span className="block text-[#CFAF50]">Careers</span>
                </h1>

                <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Connect with decision-makers through trusted, private introductions.
                    theNexus helps professionals and HR leaders build meaningful career connections.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/sign-up?type=professional"
                        className="bg-white text-[#2E8B57] hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        I'm a Professional
                    </Link>
                    <Link
                        href="/sign-up?type=hiring"
                        className="bg-[#CFAF50] text-[#0A2540] hover:bg-[#D4AF37] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        I'm Hiring
                    </Link>
                </div>

                <div className="mt-12 text-white/80">
                    <p className="text-sm">Trusted by professionals at</p>
                    <div className="flex justify-center items-center space-x-8 mt-4 opacity-60">
                        <div className="text-lg font-semibold">TechCorp</div>
                        <div className="text-lg font-semibold">InnovateLabs</div>
                        <div className="text-lg font-semibold">GlobalTech</div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
                <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    )
}

export default HeroSection
