'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
        setIsMenuOpen(false)
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">N</span>
                        </div>
                        <span className="text-secondary font-bold text-xl">theNexus</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <button
                            onClick={() => scrollToSection('how-it-works')}
                            className="text-secondary hover:text-primary transition-colors font-medium"
                        >
                            How It Works
                        </button>
                        <button
                            onClick={() => scrollToSection('benefits')}
                            className="text-secondary hover:text-primary transition-colors font-medium"
                        >
                            Benefits
                        </button>
                        <button
                            onClick={() => scrollToSection('testimonials')}
                            className="text-secondary hover:text-primary transition-colors font-medium"
                        >
                            Testimonials
                        </button>
                        <Link
                            href="/about"
                            className="text-secondary hover:text-primary transition-colors font-medium"
                        >
                            About
                        </Link>
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/sign-in"
                            className="text-secondary hover:text-primary transition-colors font-medium"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/sign-up"
                            className="bg-primary hover:bg-[#1F5F3F] text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <nav className="flex flex-col space-y-4">
                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-left text-secondary hover:text-primary transition-colors font-medium"
                            >
                                How It Works
                            </button>
                            <button
                                onClick={() => scrollToSection('benefits')}
                                className="text-left text-secondary hover:text-primary transition-colors font-medium"
                            >
                                Benefits
                            </button>
                            <button
                                onClick={() => scrollToSection('testimonials')}
                                className="text-left text-secondary hover:text-primary transition-colors font-medium"
                            >
                                Testimonials
                            </button>
                            <Link
                                href="/about"
                                className="text-left text-secondary hover:text-primary transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                                <Link
                                    href="/sign-in"
                                    className="text-secondary hover:text-primary transition-colors font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/sign-up"
                                    className="bg-primary hover:bg-[#1F5F3F] text-white px-6 py-2 rounded-lg font-semibold transition-colors text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header
