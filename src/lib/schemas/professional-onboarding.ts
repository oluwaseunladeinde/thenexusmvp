import { z } from 'zod';

export const professionalOnboardingSchema = z.object({
    // Step 1: Basic Information
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
    profileHeadline: z.string().min(10, 'Headline must be at least 10 characters').max(200, 'Headline too long'),
    locationState: z.string().min(1, 'State is required'),
    locationCity: z.string().min(1, 'City is required'),

    // Step 2: Career Expectations
    yearsOfExperience: z.number().min(5, 'Minimum 5 years required').max(50, 'Please enter a realistic number'),
    currentTitle: z.string().min(1, 'Current title is required').max(100, 'Title too long'),
    currentCompany: z.string().min(1, 'Current company is required').max(100, 'Company name too long'),
    currentIndustry: z.string().min(1, 'Industry is required'),
    salaryExpectationMin: z.number().min(0, 'Salary must be positive').optional(),
    salaryExpectationMax: z.number().min(0, 'Salary must be positive').optional(),
    noticePeriod: z.enum(['immediate', '1_week', '2_weeks', '1_month', '2_months', '3_months', '6_months'], {
        message: 'Notice period is required',
    }),
    willingToRelocate: z.boolean().default(false),
    openToOpportunities: z.boolean().default(true),

    // Step 3: Skills & Links
    skills: z.array(z.string().min(1, 'Skill name is required')).min(1, 'At least one skill is required').max(10, 'Maximum 10 skills allowed'),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
}).refine(
    (data) => {
        if (data.salaryExpectationMin != null && data.salaryExpectationMax != null) {
            return data.salaryExpectationMax >= data.salaryExpectationMin;
        }
        return true;
    },
    {
        message: 'Maximum salary must be greater than or equal to minimum salary',
        path: ['salaryExpectationMax'],
    }
);

export type ProfessionalOnboardingData = z.infer<typeof professionalOnboardingSchema>;
