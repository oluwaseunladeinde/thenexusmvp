'use client'

import React from 'react'

const HowItWorksSection = () => {
    const steps = [
        {
            step: '01',
            title: 'Create Your Profile',
            description: 'Build a comprehensive profile highlighting your skills, experience, and career goals. Our AI-powered system analyzes your background to match you with relevant opportunities.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        },
        {
            step: '02',
            title: 'Get Matched',
            description: 'Our algorithm connects you with decision-makers and HR professionals who are actively looking for talent like yours. All connections are verified and trusted.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            )
        },
        {
            step: '03',
            title: 'Connect Privately',
            description: 'Engage in meaningful conversations through our secure platform. Build relationships that lead to career opportunities, all while maintaining your privacy.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            )
        },
        {
            step: '04',
            title: 'Land Your Dream Role',
            description: 'Turn connections into opportunities. Our success stories show how theNexus has helped professionals advance their careers through trusted introductions.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ]

    return (
        <section id="how-it-works" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Four simple steps to transform your career connections into meaningful opportunities
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-[#2E8B57] transform -translate-x-1/2 z-0"></div>
                            )}

                            <div className="relative z-10 bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                                <div className="flex items-center justify-center w-16 h-16 bg-[#2E8B57] text-white rounded-full mb-4 mx-auto">
                                    {step.icon}
                                </div>

                                <div className="text-center">
                                    <div className="text-sm font-semibold text-[#2E8B57] mb-2">
                                        STEP {step.step}
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#0A2540] mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <p className="text-lg text-gray-600 mb-6">
                        Ready to start your journey?
                    </p>
                    <a
                        href="/sign-up"
                        className="inline-block bg-[#2E8B57] hover:bg-[#1F5F3F] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                    >
                        Get Started Today
                    </a>
                </div>
            </div>
        </section>
    )
}

export default HowItWorksSection
