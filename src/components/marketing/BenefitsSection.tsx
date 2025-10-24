import React from 'react'

const BenefitsSection = () => {
    const benefits = [
        {
            title: 'Verified Connections',
            description: 'Every connection is verified and trusted, ensuring quality interactions with decision-makers and HR professionals.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            color: 'text-[#2E8B57]'
        },
        {
            title: 'Privacy First',
            description: 'Your information stays private. We never share your data without permission, giving you control over your professional narrative.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
            color: 'text-[#3ABF7A]'
        },
        {
            title: 'AI-Powered Matching',
            description: 'Our advanced algorithms analyze your profile and preferences to connect you with the most relevant opportunities.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            color: 'text-[#1F5F3F]'
        },
        {
            title: 'Career Insights',
            description: 'Get valuable insights into industry trends, salary data, and career progression paths from our expert network.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            color: 'text-[#CFAF50]'
        },
        {
            title: '24/7 Support',
            description: 'Our dedicated support team is available around the clock to help you make the most of your theNexus experience.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'text-[#2E8B57]'
        },
        {
            title: 'Global Network',
            description: 'Connect with professionals and opportunities worldwide, breaking down geographical barriers to career advancement.',
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'text-[#3ABF7A]'
        }
    ]

    return (
        <section id="benefits" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] mb-4">
                        Why Choose theNexus?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the difference with our comprehensive platform designed to accelerate your career growth
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300">
                            <div className={`mb-4 ${benefit.color}`}>
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-[#0A2540] mb-3">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Additional CTA */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-[#2E8B57] to-[#3ABF7A] rounded-lg p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Ready to Transform Your Career?
                        </h3>
                        <p className="text-lg mb-6 opacity-90">
                            Join thousands of professionals who have found their next opportunity through theNexus
                        </p>
                        <a
                            href="/sign-up"
                            className="inline-block bg-white text-[#2E8B57] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                        >
                            Start Your Journey
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BenefitsSection
