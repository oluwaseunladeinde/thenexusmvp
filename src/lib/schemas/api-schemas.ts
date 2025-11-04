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
}).refine((data) => {
    if (data.salaryExpectationMin && data.salaryExpectationMax) {
        return data.salaryExpectationMax >= data.salaryExpectationMin;
    }
    return true;
}, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryExpectationMax"]
});;

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
    phone: z.string().regex(/^\+234[0-9]{10}$/, "Invalid Nigerian phone number. Format: +234XXXXXXXXXX"),
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
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    portfolioUrl: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
    profilePhotoUrl: z.string().url("Invalid profile photo URL").optional().or(z.literal("")),
    resumeUrl: z.string().url("Invalid resume URL").optional().or(z.literal("")),
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

// ============================================
// RESPONSE SCHEMAS FOR API DOCUMENTATION
// ============================================

// Base Response Schemas
export const apiSuccessResponseSchema = z.object({
    message: z.string(),
    data: z.any(),
});

export const apiErrorResponseSchema = z.object({
    error: z.string(),
    details: z.array(z.object({
        field: z.string(),
        message: z.string(),
    })).optional(),
});

// Professional Response Schemas
export const professionalProfileResponseSchema = z.object({
    id: z.string(),
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    preferredName: z.string().nullable(),
    profileHeadline: z.string(),
    profileSummary: z.string().nullable(),
    locationCity: z.string().nullable(),
    locationState: z.string().nullable(),
    yearsOfExperience: z.number(),
    currentTitle: z.string(),
    currentCompany: z.string().nullable(),
    currentIndustry: z.string(),
    salaryExpectationMin: z.number().nullable(),
    salaryExpectationMax: z.number().nullable(),
    noticePeriodDays: z.number().nullable(),
    willingToRelocate: z.boolean(),
    openToOpportunities: z.boolean(),
    confidentialSearch: z.boolean(),
    linkedinUrl: z.string().nullable(),
    portfolioUrl: z.string().nullable(),
    profilePhotoUrl: z.string().nullable(),
    resumeUrl: z.string().nullable(),
    profileCompleteness: z.number(),
    skills: z.array(z.object({
        id: z.string(),
        skillName: z.string(),
        proficiencyLevel: z.string(),
        isPrimarySkill: z.boolean(),
    })),
    workHistory: z.array(z.object({
        id: z.string(),
        jobTitle: z.string(),
        companyName: z.string(),
        startDate: z.string(),
        endDate: z.string().nullable(),
        description: z.string().nullable(),
    })).optional(),
    education: z.array(z.object({
        id: z.string(),
        institution: z.string(),
        degree: z.string(),
        fieldOfStudy: z.string(),
        startYear: z.number(),
        endYear: z.number().nullable(),
    })).optional(),
    certifications: z.array(z.object({
        id: z.string(),
        name: z.string(),
        issuer: z.string(),
        issueDate: z.string(),
        expiryDate: z.string().nullable(),
    })).optional(),
    introductionRequests: z.array(z.object({
        id: z.string(),
        status: z.string(),
        sentAt: z.string(),
        jobRole: z.object({
            id: z.string(),
            roleTitle: z.string(),
            company: z.object({
                companyName: z.string(),
            }),
        }),
    })).optional(),
    user: z.object({
        email: z.string(),
        phone: z.string().nullable(),
        phoneVerified: z.boolean(),
        emailVerified: z.boolean(),
    }),
    stats: z.object({
        pending: z.number(),
        accepted: z.number(),
        declined: z.number(),
        profileViews: z.number(),
    }).optional(),
    completeness: z.object({
        overall: z.number(),
        sections: z.object({
            basicInfo: z.number(),
            experience: z.number(),
            skills: z.number(),
            education: z.number(),
            documents: z.number(),
        }),
    }).optional(),
});

// Introduction Response Schemas
export const introductionRequestResponseSchema = z.object({
    id: z.string(),
    sentToProfessionalId: z.string(),
    sentById: z.string(),
    jobRoleId: z.string(),
    status: z.enum(['PENDING', 'ACCEPTED', 'DECLINED']),
    message: z.string(),
    professionalResponse: z.string().nullable(),
    sentAt: z.string(),
    responseDate: z.string().nullable(),
    expiresAt: z.string(),
    viewedByProfessional: z.boolean(),
    viewedAt: z.string().nullable(),
    jobRole: z.object({
        id: z.string(),
        roleTitle: z.string(),
        roleDescription: z.string(),
        seniorityLevel: z.string(),
        locationCity: z.string().nullable(),
        locationState: z.string().nullable(),
        salaryRangeMin: z.number().nullable(),
        salaryRangeMax: z.number().nullable(),
        remoteOption: z.string(),
        employmentType: z.string(),
        responsibilities: z.string().nullable(),
        requirements: z.string().nullable(),
        preferredQualifications: z.string().nullable(),
        benefits: z.string().nullable(),
        isConfidential: z.boolean(),
        confidentialReason: z.string().nullable(),
    }),
    company: z.object({
        id: z.string(),
        companyName: z.string(),
        companyLogoUrl: z.string().nullable(),
        industry: z.string(),
        companySize: z.string(),
        headquartersLocation: z.string(),
        companyWebsite: z.string().nullable(),
        companyDescription: z.string(),
    }),
    sentBy: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        jobTitle: z.string(),
        profilePhotoUrl: z.string().nullable(),
        linkedinUrl: z.string().nullable(),
    }),
});

export const introductionListResponseSchema = z.object({
    introductions: z.array(introductionRequestResponseSchema),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
        hasNext: z.boolean(),
        hasPrev: z.boolean(),
    }),
});

// File Upload Response Schema
export const fileUploadResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        fileUrl: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
        fileType: z.string(),
        profileCompleteness: z.number(),
    }),
});

// States/Cities Response Schemas
export const stateResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
});

export const cityResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
});

// HR Partner Response Schemas
export const hrPartnerProfileResponseSchema = z.object({
    id: z.string(),
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    jobTitle: z.string(),
    department: z.string().nullable(),
    linkedinUrl: z.string().nullable(),
    companyId: z.string(),
    roleInPlatform: z.string(),
    canCreateRoles: z.boolean(),
    canSendIntroductions: z.boolean(),
    canManageBilling: z.boolean(),
    alsoProfessional: z.boolean(),
    professionalId: z.string().nullable(),
    status: z.string(),
    company: z.object({
        id: z.string(),
        companyName: z.string(),
        industry: z.string(),
        companySize: z.string(),
        headquartersLocation: z.string(),
        companyWebsite: z.string(),
        companyDescription: z.string(),
    }),
});

// Privacy Status Response Schema
export const privacyStatusResponseSchema = z.object({
    blockedCompaniesCount: z.number(),
    lastFirewallEvent: z.string().nullable(),
    lastEventType: z.string().nullable(),
});

// User Response Schema
export const userResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    createdAt: z.string(),
});

// Professional Create Response Schema
export const professionalCreateResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.object({
        professionalId: z.string(),
        onboardingCompleted: z.boolean(),
    }),
});

// HR Partner Create Response Schema
export const hrPartnerCreateResponseSchema = z.object({
    success: z.boolean(),
    hrPartner: hrPartnerProfileResponseSchema,
    company: z.object({
        id: z.string(),
        companyName: z.string(),
        industry: z.string(),
        companySize: z.string(),
        headquartersLocation: z.string(),
        companyWebsite: z.string(),
        companyDescription: z.string(),
    }),
    professional: professionalProfileResponseSchema.nullable(),
    message: z.string(),
});

// Introduction Accept/Decline Response Schema
export const introductionActionResponseSchema = z.object({
    message: z.string(),
    data: z.object({
        introduction: introductionRequestResponseSchema,
        contactDetailsUnlocked: z.boolean().optional(),
    }),
});

// Type exports
export type ProfessionalCreateData = z.infer<typeof professionalCreateSchema>;
export type HrPartnerCreateData = z.infer<typeof hrPartnerCreateSchema>;
export type IntroductionRequestData = z.infer<typeof introductionRequestSchema>;
export type PhoneSendCodeData = z.infer<typeof phoneSendCodeSchema>;
export type PhoneVerifyCodeData = z.infer<typeof phoneVerifyCodeSchema>;
export type FileUploadData = z.infer<typeof fileUploadSchema>;
export type ProfessionalUpdateData = z.infer<typeof professionalUpdateSchema>;
export type PortfolioFileData = z.infer<typeof portfolioFileSchema>;

// Response Type Exports
export type ApiSuccessResponse = z.infer<typeof apiSuccessResponseSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
export type ProfessionalProfileResponse = z.infer<typeof professionalProfileResponseSchema>;
export type IntroductionRequestResponse = z.infer<typeof introductionRequestResponseSchema>;
export type IntroductionListResponse = z.infer<typeof introductionListResponseSchema>;
export type FileUploadResponse = z.infer<typeof fileUploadResponseSchema>;
export type StateResponse = z.infer<typeof stateResponseSchema>;
export type CityResponse = z.infer<typeof cityResponseSchema>;
export type HrPartnerProfileResponse = z.infer<typeof hrPartnerProfileResponseSchema>;
export type PrivacyStatusResponse = z.infer<typeof privacyStatusResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ProfessionalCreateResponse = z.infer<typeof professionalCreateResponseSchema>;
export type HrPartnerCreateResponse = z.infer<typeof hrPartnerCreateResponseSchema>;
export type IntroductionActionResponse = z.infer<typeof introductionActionResponseSchema>;

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
    salaryExpectationMin: z.coerce.number().int().positive().optional(),
    salaryExpectationMax: z.coerce.number().int().positive().optional(),
    yearsOfExperienceMin: z.coerce.number().int().min(0).optional(),
    openToOpportunities: z.coerce.boolean().optional(),
    skills: z.string().transform((val) => val.split(',')).pipe(z.array(z.string())).optional(),
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
}).refine((data) => {
    if (data.salaryMin && data.salaryMax) {
        return data.salaryMax >= data.salaryMin;
    }
    return true;
}, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["salaryMax"]
});;

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
