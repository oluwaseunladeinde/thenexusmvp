'use client'

import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'

const StatsSection = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                }
            },
            { threshold: 0.3 }
        )

        const element = document.getElementById('stats-section')
        if (element) {
            observer.observe(element)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    const stats = [
        {
            number: 50000,
            suffix: '+',
            label: 'Professionals Connected',
            description: 'Active users building their networks'
        },
        {
            number: 25000,
            suffix: '+',
            label: 'Successful Placements',
            description: 'Careers advanced through our platform'
        },
        {
            number: 98,
            suffix: '%',
            label: 'Satisfaction Rate',
            description: 'Users who found value in connections'
        },
        {
            number: 500,
            suffix: '+',
            label: 'Partner Companies',
            description: 'Trusted organizations using theNexus'
        }
    ]

    return (
        <section id="stats-section" className="py-20 bg-[#2E8B57] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Trusted by Professionals Worldwide
                    </h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Join thousands of professionals who have transformed their careers through meaningful connections
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl sm:text-5xl font-bold mb-2 text-[#CFAF50]">
                                {isVisible ? (
                                    <CountUp
                                        end={stat.number}
                                        duration={2.5}
                                        delay={index * 0.2}
                                        suffix={stat.suffix}
                                    />
                                ) : (
                                    '0'
                                )}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                {stat.label}
                            </h3>
                            <p className="text-white/80">
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Additional Trust Indicators */}
                <div className="mt-16 text-center">
                    <div className="flex flex-wrap justify-center items-center gap-8 text-white/70">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-[#CFAF50]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>GDPR Compliant</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-[#CFAF50]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>End-to-End Encrypted</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-[#CFAF50]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Verified Connections</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default StatsSection
