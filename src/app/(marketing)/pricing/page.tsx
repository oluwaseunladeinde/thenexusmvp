import React from 'react'
import Header from '@/components/marketing/Header'
import Footer from '@/components/marketing/Footer'
import PricingSection from '@/components/marketing/PricingSection'

const PricingPage = () => {
    return (
        <div className="min-h-screen">
            <Header />
            <main>
                <PricingSection />
            </main>
            <Footer />
        </div>
    )
}

export default PricingPage
