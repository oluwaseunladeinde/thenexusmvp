'use client'

import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface OnboardingLayoutProps {
    children: ReactNode
    currentStep: number
    totalSteps: number
    onNext: () => void
    onBack: () => void
    canGoNext: boolean
    canGoBack: boolean
    isSubmitting?: boolean
}

export function OnboardingLayout({
    children,
    currentStep,
    totalSteps,
    onNext,
    onBack,
    canGoNext,
    canGoBack,
    isSubmitting = false,
}: OnboardingLayoutProps) {
    const progress = (currentStep / totalSteps) * 100

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header with Progress */}
            <div className="bg-white border-b border-gray-200 px-4 py-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Professional Onboarding
                        </h1>
                        <span className="text-sm text-gray-500">
                            Step {currentStep} of {totalSteps}
                        </span>
                    </div>
                    <Progress value={progress} className="w-full" />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    {children}
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="bg-white border-t border-gray-200 px-4 py-6">
                <div className="max-w-2xl mx-auto flex justify-between">
                    <Button
                        variant="outline"
                        onClick={onBack}
                        disabled={!canGoBack || isSubmitting}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Button>

                    <Button
                        onClick={onNext}
                        disabled={!canGoNext || isSubmitting}
                        className="flex items-center gap-2"
                    >
                        {currentStep === totalSteps ? (
                            isSubmitting ? (
                                'Submitting...'
                            ) : (
                                'Complete Onboarding'
                            )
                        ) : (
                            <>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
