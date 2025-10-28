import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OnboardingData {
    // Step 1: Basic Info
    firstName: string
    lastName: string
    profileHeadline: string
    state: string
    city: string
    yearsOfExperience: number
    currentTitle: string
    currentCompany: string
    industry: string

    // Step 2: Career Expectations
    minSalary: number
    maxSalary: number
    noticePeriod: string
    willingToRelocate: boolean
    openToOpportunities: boolean

    // Step 3: Skills & Links
    skills: string[]
    linkedinUrl: string
    portfolioUrl: string
    resumeUrl?: string
}

interface OnboardingState extends OnboardingData {
    currentStep: number
    isSubmitting: boolean
    setCurrentStep: (step: number) => void
    updateBasicInfo: (data: Partial<Pick<OnboardingData, 'firstName' | 'lastName' | 'profileHeadline' | 'state' | 'city' | 'yearsOfExperience' | 'currentTitle' | 'currentCompany' | 'industry'>>) => void
    updateCareerExpectations: (data: Partial<Pick<OnboardingData, 'minSalary' | 'maxSalary' | 'noticePeriod' | 'willingToRelocate' | 'openToOpportunities'>>) => void
    updateSkillsAndLinks: (data: Partial<Pick<OnboardingData, 'skills' | 'linkedinUrl' | 'portfolioUrl' | 'resumeUrl'>>) => void
    setIsSubmitting: (isSubmitting: boolean) => void
    reset: () => void
}

const initialState: OnboardingData & { currentStep: number; isSubmitting: boolean } = {
    currentStep: 1,
    isSubmitting: false,
    firstName: '',
    lastName: '',
    profileHeadline: '',
    state: '',
    city: '',
    yearsOfExperience: 0,
    currentTitle: '',
    currentCompany: '',
    industry: '',
    minSalary: 0,
    maxSalary: 0,
    noticePeriod: '',
    willingToRelocate: false,
    openToOpportunities: false,
    skills: [],
    linkedinUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            ...initialState,

            setCurrentStep: (step) => set({ currentStep: step }),

            updateBasicInfo: (data) => set((state) => ({
                ...state,
                ...data,
            })),

            updateCareerExpectations: (data) => set((state) => ({
                ...state,
                ...data,
            })),

            updateSkillsAndLinks: (data) => set((state) => ({
                ...state,
                ...data,
            })),

            setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

            reset: () => set(initialState),
        }),
        {
            name: 'onboarding-storage',
            partialize: (state) => ({
                ...state,
                currentStep: state.currentStep,
                isSubmitting: false, // Don't persist submitting state
            }),
        }
    )
)
