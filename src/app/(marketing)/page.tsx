import React from 'react'
import Header from '@/components/marketing/Header'
import Footer from '@/components/marketing/Footer'
import HeroSection from '@/components/marketing/HeroSection'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import StatsSection from '@/components/marketing/StatsSection'
import BenefitsSection from '@/components/marketing/BenefitsSection'
import TestimonialsSection from '@/components/marketing/TestimonialsSection'
import CTASection from '@/components/marketing/CTASection'

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <HeroSection />
                <HowItWorksSection />
                <StatsSection />
                <BenefitsSection />
                <TestimonialsSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}

export default LandingPage
