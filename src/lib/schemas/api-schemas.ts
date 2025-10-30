import { z } from 'zod';

// ============================================
// API REQUEST/RESPONSE SCHEMAS
// ============================================

// Professional Create API Schema
export const professionalCreateSchema = z.object({
    preferredName: z.string().optional(),
    profileHeadline: z.string().min(1, "Profile headline is required"),
    profileSummary: z.string().optional(),
    locationCity: z.string().min(1, "City is required"),
    locationState: z.string().min(1, "State is required"),
    yearsOfExperience: z.number().int().min(0, "Experience cannot be negative"),
    currentTitle: z.string().min(1, "Current title is required"),
    currentCompany: z.string().optional(),
    currentIndustry: z.string().min(1, "Industry is required"),
    salaryExpectationMin: z.number().int().positive("Minimum salary must be positive").optional(),
    salaryExpectationMax: z.number().int().positive("Maximum salary must be positive").optional(),
    noticePeriodDays: z.number().int().min(0, "Notice period cannot be negative").default(30),
    willingToRelocate: z.boolean().default(false),
    openToOpportunities: z.boolean().default(true),
    confidentialSearch: z.boolean().default(true),
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    portfolioUrl: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
    skills: z.array(z.string().min(1)).min(1, "At least one skill is required").max(10, "Maximum 10 skills allowed"),
});

// HR Partner Create API Schema
export const hrPartnerCreateSchema = z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    department: z.string().optional(),
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    companyName: z.string().min(1, "Company name is required"),
    industry: z.string().min(1, "Industry is required"),
    companySize: z.string().min(1, "Company size is required"),
    headquartersLocation: z.string().min(1, "Headquarters location is required"),
    companyWebsite: z.string().url("Invalid company website URL").optional().or(z.literal("")),
    companyDescription: z.string().min(1, "Company description is required"),
});

// Introduction Request API Schema
export const introductionRequestSchema = z.object({
    professionalId: z.string().min(1, "Professional ID is required"),
    jobRoleId: z.string().min(1, "Job role ID is required"),
    message: z.string().min(1, "Message is required").max(1000, "Message too long"),
    urgency: z.enum(['low', 'normal', 'high']).default('normal'),
});

// Phone Send Code API Schema
export const phoneSendCodeSchema = z.object({
    phone: z.string().regex(/^234[0-9]{10}$/, "Invalid Nigerian phone number. Format: +234XXXXXXXXXX"),
});

// Phone Verify Code API Schema
export const phoneVerifyCodeSchema = z.object({
    phone: z.string().regex(/^234[0-9]{10}$/, "Invalid Nigerian phone number"),
    code: z.string().length(6, "Verification code must be 6 digits"),
});

// File Upload API Schema
export const fileUploadSchema = z.object({
    file: z.any(), // File object validation handled separately
    type: z.enum(['profile', 'portfolio', 'resume', 'other']),
});

// Portfolio File API Schema
export const portfolioFileSchema = z.object({
    fileName: z.string().min(1),
    fileUrl: z.string().url(),
    fileKey: z.string().min(1),
    fileType: z.enum(['resume', 'portfolio', 'certificate', 'cover_letter', 'other']),
    fileSize: z.number().positive(),
    mimeType: z.string().min(1),
    description: z.string().optional(),
});

// Professional Update API Schema (allows partial updates)
export const professionalUpdateSchema = z.object({
    preferredName: z.string().optional(),
    profileHeadline: z.string().optional(),
    profileSummary: z.string().optional(),
    locationCity: z.string().optional(),
    locationState: z.string().optional(),
    yearsOfExperience: z.number().int().min(0, "Experience cannot be negative").optional(),
    currentTitle: z.string().optional(),
    currentCompany: z.string().optional(),
    currentIndustry: z.string().optional(),
    salaryExpectationMin: z.number().int().positive("Minimum salary must be positive").optional(),
    salaryExpectationMax: z.number().int().positive("Maximum salary must be positive").optional(),
    noticePeriodDays: z.number().int().min(0, "Notice period cannot be negative").optional(),
    willingToRelocate: z.boolean().optional(),
    openToOpportunities: z.boolean().optional(),
    confidentialSearch: z.boolean().optional(),
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")).optional(),
    portfolioUrl: z.string().url("Invalid portfolio URL").optional().or(z.literal("")).optional(),
    skills: z.array(z.string().min(1)).min(1, "At least one skill is required").max(10, "Maximum 10 skills allowed").optional(),
    workHistory: z.array(z.object({
        jobTitle: z.string().min(1, "Job title is required"),
        companyName: z.string().min(1, "Company name is required"),
        industry: z.string().optional(),
        location: z.string().optional(),
        employmentType: z.enum(['full_time', 'contract', 'consulting']).default('full_time'),
        startDate: z.string().min(1, "Start date is required").transform((date) => new Date(date)),
        endDate: z.string().optional().transform((date) => date ? new Date(date) : null),
        isCurrent: z.boolean().default(false),
        description: z.string().optional()
    }).refine((data) => {
        // If isCurrent is true, endDate should not be required
        if (data.isCurrent) {
            return true;
        }
        // If isCurrent is false, endDate is required
        return data.endDate; //&& data.endDate.trim() !== '';
    }, {
        message: "End date is required unless this is your current position",
        path: ["endDate"]
    })).optional(),
}).refine((data) => {
    // Ensure at least one field is being updated
    const keys = Object.keys(data);
    return keys.length > 0 && keys.some(key => data[key as keyof typeof data] !== undefined);
}, {
    message: "At least one field must be provided for update"
});

// Response Schemas
export const apiSuccessResponseSchema = z.object({
    message: z.string(),
    data: z.any(),
});

export const apiErrorResponseSchema = z.object({
    error: z.string(),
});

// Type exports
export type ProfessionalCreateData = z.infer<typeof professionalCreateSchema>;
export type HrPartnerCreateData = z.infer<typeof hrPartnerCreateSchema>;
export type IntroductionRequestData = z.infer<typeof introductionRequestSchema>;
export type PhoneSendCodeData = z.infer<typeof phoneSendCodeSchema>;
export type PhoneVerifyCodeData = z.infer<typeof phoneVerifyCodeSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type ProfessionalUpdateData = z.infer<typeof professionalUpdateSchema>;

// Pagination Query Schema for list endpoints
export const paginationQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Professional Browse Query Schema
export const professionalBrowseQuerySchema = paginationQuerySchema.extend({
    search: z.string().optional(),
    industry: z.string().optional(),
    locationCity: z.string().optional(),
    locationState: z.string().optional(),
    salaryExpectationMin: z.number().int().positive().optional(),
    salaryExpectationMax: z.number().int().positive().optional(),
    yearsOfExperienceMin: z.number().int().min(0).optional(),
    openToOpportunities: z.boolean().optional(),
    skills: z.array(z.string()).optional(),
    sortBy: z.enum(['relevance', 'experience', 'recent']).default('relevance'),
});

// Introduction Respond Schema
export const introductionRespondSchema = z.object({
    introductionId: z.string().min(1, "Introduction ID is required"),
    status: z.enum(['accepted', 'declined']),
    reason: z.string().max(500, "Reason too long").optional(),
});

// Job Role Schema
export const jobRoleSchema = z.object({
    title: z.string().min(1, "Job title is required"),
    description: z.string().min(1, "Description is required"),
    requirements: z.array(z.string()).min(1, "At least one requirement"),
    salaryMin: z.number().int().positive().optional(),
    salaryMax: z.number().int().positive().optional(),
    companyId: z.string().min(1, "Company ID is required"),
    status: z.enum(['draft', 'active', 'closed']).default('draft'),
});

// Experience Schema
export const experienceSchema = z.object({
    title: z.string().min(1),
    company: z.string().min(1),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    description: z.string().optional(),
    isCurrent: z.boolean().default(false),
});

// Skill Schema
export const skillSchema = z.object({
    name: z.string().min(1, "Skill name required"),
    isPrimary: z.boolean().default(false),
});

// Reference Schema
export const referenceSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    relationship: z.string().min(1),
    message: z.string().optional(),
});

// Admin User Query Schema
export const adminUserQuerySchema = paginationQuerySchema.extend({
    search: z.string().optional(),
    role: z.enum(['professional', 'hr_partner', 'admin']).optional(),
    status: z.enum(['pending', 'active', 'suspended']).optional(),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type ProfessionalBrowseQuery = z.infer<typeof professionalBrowseQuerySchema>;
export type IntroductionRespondData = z.infer<typeof introductionRespondSchema>;
export type JobRoleData = z.infer<typeof jobRoleSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type SkillData = z.infer<typeof skillSchema>;
export type ReferenceData = z.infer<typeof referenceSchema>;
export type AdminUserQuery = z.infer<typeof adminUserQuerySchema>;
