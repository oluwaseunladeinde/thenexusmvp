import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { requirePermission, Permission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/database';

interface SearchFilters {
    query?: string;
    location?: {
        city?: string;
        state?: string;
    };
    experienceRange?: {
        min?: number;
        max?: number;
    };
    industry?: string;
    skills?: string[];
    salaryRange?: {
        min?: number;
        max?: number;
    };
    verificationStatus?: 'VERIFIED' | 'BASIC' | 'UNVERIFIED';
    page?: number;
    limit?: number;
}

/**
 * @swagger
 * /api/v1/professionals/search:
 *   post:
 *     summary: Search for professionals (HR Partners only)
 *     tags: [Professionals, Search]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: Full-text search query
 *               location:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *               experienceRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *               industry:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               salaryRange:
 *                 type: object
 *                 properties:
 *                   min:
 *                     type: number
 *                   max:
 *                     type: number
 *               verificationStatus:
 *                 type: string
 *                 enum: [VERIFIED, BASIC, UNVERIFIED]
 *               page:
 *                 type: number
 *                 default: 1
 *               limit:
 *                 type: number
 *                 default: 20
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 professionals:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     totalPages:
 *                       type: number
 */

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // RBAC Check: Require permission to search professionals
        await requirePermission(Permission.SEARCH_PROFESSIONALS);

        // Get HR partner making the search
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: { id: true, companyId: true },
        });

        if (!hrPartner) {
            return NextResponse.json(
                { error: 'HR Partner not found' },
                { status: 403 }
            );
        }

        const filters: SearchFilters = await req.json();
        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 20, 50); // Max 50 per page
        const skip = (page - 1) * limit;

        // Generate search session ID for tracking
        const searchSessionId = `search_${hrPartner.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Log search activity
        await prisma.userActivityLog.create({
            data: {
                userId: userId,
                actionType: 'SEARCH_PROFESSIONALS',
                entityType: 'SEARCH',
                description: `HR Partner searched for professionals`,
                metadata: {
                    searchSessionId,
                    filters: JSON.parse(JSON.stringify(filters)) as any,
                    timestamp: new Date().toISOString(),
                },
                searchQuery: filters.query || null,
                filtersUsed: JSON.parse(JSON.stringify(filters)) as any,
                searchSessionId,
            },
        });

        // Build base where clause
        const whereClause: any = {
            openToOpportunities: true,
            NOT: {
                hideFromCompanyIds: {
                    has: hrPartner.companyId,
                },
            },
        };

        // Log privacy firewall activity for audit trail
        const hiddenProfessionals = await prisma.professional.count({
            where: {
                openToOpportunities: true,
                hideFromCompanyIds: {
                    has: hrPartner.companyId,
                },
            },
        });

        if (hiddenProfessionals > 0) {
            await prisma.privacyFirewallLog.create({
                data: {
                    eventType: 'SEARCH_FILTERED',
                    hrPartnerId: hrPartner.id,
                    companyId: hrPartner.companyId,
                    actionTaken: 'Filtered search results due to privacy firewall',
                    metadata: {
                        hiddenCount: hiddenProfessionals,
                        searchFilters: JSON.parse(JSON.stringify(filters)) as any,
                        timestamp: new Date().toISOString(),
                    },
                },
            });
        }

        // Full-text search on title, headline, summary
        if (filters.query) {
            const searchTerms = filters.query.trim().split(/\s+/);
            whereClause.OR = [
                {
                    currentTitle: {
                        contains: filters.query,
                        mode: 'insensitive',
                    },
                },
                {
                    profileHeadline: {
                        contains: filters.query,
                        mode: 'insensitive',
                    },
                },
                {
                    profileSummary: {
                        contains: filters.query,
                        mode: 'insensitive',
                    },
                },
                // Search in skills
                {
                    skills: {
                        some: {
                            skillName: {
                                contain: searchTerms,
                                //contains: filters.query,
                                mode: 'insensitive',
                            },
                        },
                    },
                },
            ];
        }

        // Location filters
        if (filters.location?.city) {
            whereClause.locationCity = {
                contains: filters.location.city,
                mode: 'insensitive',
            };
        }
        if (filters.location?.state) {
            whereClause.locationState = filters.location.state;
        }

        // Experience range
        if (filters.experienceRange?.min !== undefined) {
            whereClause.yearsOfExperience = {
                ...whereClause.yearsOfExperience,
                gte: filters.experienceRange.min,
            };
        }
        if (filters.experienceRange?.max !== undefined) {
            whereClause.yearsOfExperience = {
                ...whereClause.yearsOfExperience,
                lte: filters.experienceRange.max,
            };
        }

        // Industry filter
        if (filters.industry) {
            whereClause.currentIndustry = filters.industry;
        }

        // Skills filter
        if (filters.skills && filters.skills.length > 0) {
            whereClause.skills = {
                some: {
                    skillName: {
                        in: filters.skills,
                        mode: 'insensitive',
                    },
                },
            };
        }

        // Salary range overlap
        if (filters.salaryRange?.min !== undefined || filters.salaryRange?.max !== undefined) {
            const salaryConditions: any = {};

            if (filters.salaryRange.min !== undefined) {
                salaryConditions.salaryExpectationMax = {
                    gte: filters.salaryRange.min,
                };
            }

            if (filters.salaryRange.max !== undefined) {
                salaryConditions.salaryExpectationMin = {
                    lte: filters.salaryRange.max,
                };
            }

            Object.assign(whereClause, salaryConditions);
        }

        // Verification status
        if (filters.verificationStatus) {
            whereClause.verificationStatus = filters.verificationStatus;
        }

        // Get total count for pagination
        const total = await prisma.professional.count({
            where: whereClause,
        });

        // Search professionals with pagination
        const professionals = await prisma.professional.findMany({
            where: whereClause,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                profileHeadline: true,
                profilePhotoUrl: true,
                locationCity: true,
                locationState: true,
                yearsOfExperience: true,
                currentTitle: true,
                currentCompany: true,
                currentIndustry: true,
                salaryExpectationMin: true,
                salaryExpectationMax: true,
                verificationStatus: true,
                verificationDate: true,
                confidentialSearch: true,
                skills: {
                    select: {
                        skillName: true,
                        proficiencyLevel: true,
                    },
                    take: 3, // Top 3 skills
                    orderBy: {
                        proficiencyLevel: 'desc',
                    },
                },
                _count: {
                    select: {
                        profileViews: true,
                    },
                },
            },
            skip,
            take: limit,
            orderBy: [
                // Relevance scoring - verified profiles first
                { verificationStatus: 'desc' },
                // Then by profile completeness (if available)
                { profileCompleteness: 'desc' },
                // Then by recent activity
                { lastActiveAt: 'desc' },
                // Finally by creation date
                { createdAt: 'desc' },
            ],
        });

        // Log search results
        await prisma.userActivityLog.create({
            data: {
                userId: userId,
                actionType: 'SEARCH_RESULTS_VIEWED',
                entityType: 'SEARCH',
                description: `HR Partner viewed ${professionals.length} search results`,
                metadata: {
                    searchSessionId,
                    resultsCount: professionals.length,
                    totalResults: total,
                    page,
                    limit,
                    timestamp: new Date().toISOString(),
                },
                resultsCount: professionals.length,
                searchSessionId,
            },
        });

        // Transform results for frontend
        const transformedProfessionals = professionals.map(prof => ({
            id: prof.id,
            name: prof.confidentialSearch
                ? `${prof.firstName} ${prof.lastName?.[0] ?? ''}.`
                : `${prof.firstName} ${prof.lastName}`,
            initials: `${prof.firstName?.[0] ?? ''}${prof.lastName?.[0] ?? ''}`,
            profileHeadline: prof.profileHeadline,
            profilePhotoUrl: prof.profilePhotoUrl,
            location: [prof.locationCity, prof.locationState].filter(Boolean).join(', '),
            experience: prof.yearsOfExperience,
            currentTitle: prof.currentTitle,
            currentCompany: prof.confidentialSearch ? 'Confidential' : prof.currentCompany,
            industry: prof.currentIndustry,
            salaryRange: prof.salaryExpectationMin && prof.salaryExpectationMax
                ? `₦${prof.salaryExpectationMin.toLocaleString()} - ₦${prof.salaryExpectationMax.toLocaleString()}`
                : null,
            verificationStatus: prof.verificationStatus,
            isVerified: prof.verificationStatus !== 'UNVERIFIED',
            topSkills: prof.skills.map(skill => skill.skillName),
            profileViews: prof._count.profileViews,
            isConfidential: prof.confidentialSearch,
        }));

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            professionals: transformedProfessionals,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });

    } catch (err: any) {
        console.error('Search error:', err);

        if (err.message === 'Unauthorized') {
            return NextResponse.json(
                { error: 'Insufficient permissions' },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: 'Search failed' },
            { status: 500 }
        );
    }
}