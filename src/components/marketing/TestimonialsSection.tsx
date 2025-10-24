'use client'

import React, { useState } from 'react'

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: 'Sarah Chen',
            role: 'Senior Software Engineer',
            company: 'TechCorp',
            image: '/api/placeholder/64/64',
            content: 'theNexus helped me connect with the right people at my dream company. Within two months of joining, I had meaningful conversations that led to my current role. The platform\'s focus on quality over quantity made all the difference.',
            rating: 5
        },
        {
            name: 'Michael Rodriguez',
            role: 'VP of Engineering',
            company: 'InnovateLabs',
            image: '/api/placeholder/64/64',
            content: 'As someone hiring top talent, theNexus has been invaluable. The candidates I\'ve connected with through the platform are not just qualified, but also culturally aligned with our company values. Highly recommended.',
            rating: 5
        },
        {
            name: 'Emily Johnson',
            role: 'Product Manager',
            company: 'GlobalTech',
            image: '/api/placeholder/64/64',
            content: 'The privacy-focused approach of theNexus gave me confidence to explore new opportunities without compromising my current position. The connections I made were genuine and led to exciting career developments.',
            rating: 5
        },
        {
            name: 'David Kim',
            role: 'CTO',
            company: 'StartupXYZ',
            image: '/api/placeholder/64/64',
            content: 'Finding the right technical leadership is challenging, but theNexus made it effortless. The platform\'s verification process ensures that every connection is legitimate and valuable.',
            rating: 5
        }
    ]

    const [currentIndex, setCurrentIndex] = useState(0)

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    }

    const goToTestimonial = (index: number) => {
        setCurrentIndex(index)
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <svg
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-[#CFAF50]' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))
    }

    return (
        <section id="testimonials" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[#0A2540] mb-4">
                        What Our Community Says
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Real stories from professionals who have transformed their careers through theNexus
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Main Testimonial Card */}
                    <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 bg-[#2E8B57] rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">
                                        {testimonials[currentIndex].name.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex justify-center md:justify-start mb-4">
                                    {renderStars(testimonials[currentIndex].rating)}
                                </div>

                                <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                                    "{testimonials[currentIndex].content}"
                                </blockquote>

                                <div>
                                    <div className="font-semibold text-[#0A2540]">
                                        {testimonials[currentIndex].name}
                                    </div>
                                    <div className="text-[#2E8B57] font-medium">
                                        {testimonials[currentIndex].role}
                                    </div>
                                    <div className="text-gray-500">
                                        {testimonials[currentIndex].company}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                            aria-label="Previous testimonial"
                        >
                            <svg className="w-6 h-6 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Dots */}
                        <div className="flex space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-[#2E8B57]' : 'bg-gray-300'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
                            aria-label="Next testimonial"
                        >
                            <svg className="w-6 h-6 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-16">
                    <p className="text-lg text-gray-600 mb-6">
                        Join thousands of professionals who trust theNexus
                    </p>
                    <a
                        href="/sign-up"
                        className="inline-block bg-[#2E8B57] hover:bg-[#1F5F3F] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300"
                    >
                        Start Building Connections
                    </a>
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
