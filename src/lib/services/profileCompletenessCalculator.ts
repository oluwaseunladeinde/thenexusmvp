import { Professional, VerificationStatus } from '@prisma/client';

export interface CompletenessBreakdown {
    overall: number;
    categories: {
        basicInfo: {
            score: number;
            weight: number;
            completed: number;
            total: number;
            items: {
                firstName: boolean;
                lastName: boolean;
                profileHeadline: boolean;
                locationCity: boolean;
                locationState: boolean;
                currentIndustry: boolean;
            };
        };
        professionalDetails: {
            score: number;
            weight: number;
            completed: number;
            total: number;
            items: {
                currentTitle: boolean;
                currentCompany: boolean;
                yearsOfExperience: boolean;
                profileSummary: boolean;
            };
        };
        verification: {
            score: number;
            weight: number;
            completed: number;
            total: number;
            items: {
                adminVerified: boolean;
                phoneVerified: boolean;
            };
        };
        documents: {
            score: number;
            weight: number;
            completed: number;
            total: number;
            items: {
                resumeUrl: boolean;
                profilePhotoUrl: boolean;
            };
        };
        networkAndSkills: {
            score: number;
            weight: number;
            completed: number;
            total: number;
            items: {
                linkedinUrl: boolean;
                skillsCount: boolean;
                workHistoryCount: boolean;
            };
        };
        additional: {
            score: number;
            weight: number;
            completed: number;
            total: number;
            items: {
                portfolioUrl: boolean;
                educationCount: boolean;
                certificationsCount: boolean;
            };
        };
    };
}

/**
 * Calculates comprehensive profile completeness with weighted categories
 */
export function calculateProfileCompleteness(
    professional: Professional & {
        skills?: { skillName: string }[];
        workHistory?: any[];
        education?: any[];
        certifications?: any[];
        user?: { phoneVerified: boolean; emailVerified: boolean };
    }
): CompletenessBreakdown {
    // Basic Info (20% weight) - 6 items
    const basicInfoItems = {
        firstName: !!professional.firstName?.trim(),
        lastName: !!professional.lastName?.trim(),
        profileHeadline: !!professional.profileHeadline?.trim(),
        locationCity: !!professional.locationCity?.trim(),
        locationState: !!professional.locationState?.trim(),
        currentIndustry: !!professional.currentIndustry?.trim(),
    };
    const basicInfoCompleted = Object.values(basicInfoItems).filter(Boolean).length;
    const basicInfoScore = (basicInfoCompleted / 6) * 20;

    // Professional Details (25% weight) - 4 items
    const professionalDetailsItems = {
        currentTitle: !!professional.currentTitle?.trim(),
        currentCompany: !!professional.currentCompany?.trim(),
        yearsOfExperience: professional.yearsOfExperience >= 5, // Minimum 5 years
        profileSummary: !!professional.profileSummary?.trim() && professional.profileSummary.length >= 50,
    };
    const professionalDetailsCompleted = Object.values(professionalDetailsItems).filter(Boolean).length;
    const professionalDetailsScore = (professionalDetailsCompleted / 4) * 25;

    // Verification (20% weight) - 2 items
    const verificationItems = {
        adminVerified: professional.verificationStatus === VerificationStatus.FULL ||
            professional.verificationStatus === VerificationStatus.PREMIUM,
        phoneVerified: !!professional.user?.phoneVerified,
    };
    const verificationCompleted = Object.values(verificationItems).filter(Boolean).length;
    const verificationScore = (verificationCompleted / 2) * 20;

    // Documents (15% weight) - 2 items
    const documentsItems = {
        resumeUrl: !!professional.resumeUrl?.trim(),
        profilePhotoUrl: !!professional.profilePhotoUrl?.trim(),
    };
    const documentsCompleted = Object.values(documentsItems).filter(Boolean).length;
    const documentsScore = (documentsCompleted / 2) * 15;

    // Network & Skills (10% weight) - 3 items
    const networkAndSkillsItems = {
        linkedinUrl: !!professional.linkedinUrl?.trim(),
        skillsCount: (professional.skills?.length || 0) >= 3,
        workHistoryCount: (professional.workHistory?.length || 0) >= 1,
    };
    const networkAndSkillsCompleted = Object.values(networkAndSkillsItems).filter(Boolean).length;
    const networkAndSkillsScore = (networkAndSkillsCompleted / 3) * 10;

    // Additional (10% weight) - 3 items
    const additionalItems = {
        portfolioUrl: !!professional.portfolioUrl?.trim(),
        educationCount: (professional.education?.length || 0) >= 1,
        certificationsCount: (professional.certifications?.length || 0) >= 1,
    };
    const additionalCompleted = Object.values(additionalItems).filter(Boolean).length;
    const additionalScore = (additionalCompleted / 3) * 10;


    const overall = Math.round(
        basicInfoScore + professionalDetailsScore + verificationScore +
        documentsScore + networkAndSkillsScore + additionalScore
    );

    return {
        overall,
        categories: {
            basicInfo: {
                score: Math.round(basicInfoScore),
                weight: 20,
                completed: basicInfoCompleted,
                total: 6,
                items: basicInfoItems,
            },
            professionalDetails: {
                score: Math.round(professionalDetailsScore),
                weight: 25,
                completed: professionalDetailsCompleted,
                total: 4,
                items: professionalDetailsItems,
            },
            verification: {
                score: Math.round(verificationScore),
                weight: 20,
                completed: verificationCompleted,
                total: 2,
                items: verificationItems,
            },
            documents: {
                score: Math.round(documentsScore),
                weight: 15,
                completed: documentsCompleted,
                total: 2,
                items: documentsItems,
            },
            networkAndSkills: {
                score: Math.round(networkAndSkillsScore),
                weight: 10,
                completed: networkAndSkillsCompleted,
                total: 3,
                items: networkAndSkillsItems,
            },
            additional: {
                score: Math.round(additionalScore),
                weight: 10,
                completed: additionalCompleted,
                total: 3,
                items: additionalItems,
            },
        },
    };
}

/**
 * Gets completion status for a specific category
 */
export function getCategoryStatus(breakdown: CompletenessBreakdown, category: keyof CompletenessBreakdown['categories']) {
    const cat = breakdown.categories[category];
    return {
        isComplete: cat.completed === cat.total,
        progress: cat.completed / cat.total,
        score: cat.score,
        weight: cat.weight,
    };
}

/**
 * Gets recommendations for improving profile completeness
 */
export function getCompletenessRecommendations(breakdown: CompletenessBreakdown): string[] {
    const recommendations: string[] = [];

    // Basic Info recommendations
    if (!breakdown.categories.basicInfo.items.firstName || !breakdown.categories.basicInfo.items.lastName) {
        recommendations.push("Complete your full name");
    }
    if (!breakdown.categories.basicInfo.items.profileHeadline) {
        recommendations.push("Add a compelling professional headline");
    }
    if (!breakdown.categories.basicInfo.items.locationCity || !breakdown.categories.basicInfo.items.locationState) {
        recommendations.push("Add your location information");
    }
    if (!breakdown.categories.basicInfo.items.currentIndustry) {
        recommendations.push("Specify your current industry");
    }

    // Professional Details
    if (!breakdown.categories.professionalDetails.items.currentTitle) {
        recommendations.push("Add your current job title");
    }
    if (!breakdown.categories.professionalDetails.items.currentCompany) {
        recommendations.push("Add your current company");
    }
    if (!breakdown.categories.professionalDetails.items.yearsOfExperience) {
        recommendations.push("Add your years of experience (minimum 5 years)");
    }
    if (!breakdown.categories.professionalDetails.items.profileSummary) {
        recommendations.push("Write a detailed professional summary (at least 50 characters)");
    }

    // Verification
    if (!breakdown.categories.verification.items.phoneVerified) {
        recommendations.push("Verify your phone number");
    }
    if (!breakdown.categories.verification.items.adminVerified) {
        recommendations.push("Complete admin verification process");
    }

    // Documents
    if (!breakdown.categories.documents.items.resumeUrl) {
        recommendations.push("Upload your resume");
    }
    if (!breakdown.categories.documents.items.profilePhotoUrl) {
        recommendations.push("Add a professional profile picture");
    }

    // Network & Skills
    if (!breakdown.categories.networkAndSkills.items.linkedinUrl) {
        recommendations.push("Add your LinkedIn profile URL");
    }
    if (!breakdown.categories.networkAndSkills.items.skillsCount) {
        recommendations.push("Add at least 3 skills");
    }
    if (!breakdown.categories.networkAndSkills.items.workHistoryCount) {
        recommendations.push("Add at least one work experience entry");
    }

    // Additional
    if (!breakdown.categories.additional.items.portfolioUrl) {
        recommendations.push("Add your portfolio website URL");
    }
    if (!breakdown.categories.additional.items.educationCount) {
        recommendations.push("Add your educational background");
    }
    if (!breakdown.categories.additional.items.certificationsCount) {
        recommendations.push("Add professional certifications");
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
}
