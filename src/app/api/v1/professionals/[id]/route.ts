import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { requirePermission, Permission } from '@/lib/auth/rbac';
import { prisma } from '@/lib/database';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await requirePermission(Permission.SEARCH_PROFESSIONALS);

        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: { id: true, companyId: true },
        });

        if (!hrPartner) {
            return NextResponse.json({ error: 'HR Partner not found' }, { status: 403 });
        }

        const professional = await prisma.professional.findFirst({
            where: {
                id: id,
                openToOpportunities: true,
                NOT: {
                    hideFromCompanyIds: {
                        has: hrPartner.companyId,
                    },
                },
            },
            include: {
                user: {
                    select: {
                        email: true,
                    },
                },
                workHistory: {
                    orderBy: { startDate: 'desc' },
                },
                education: {
                    orderBy: { startYear: 'desc' },
                },
                skills: {
                    orderBy: { proficiencyLevel: 'desc' },
                },
                certifications: {
                    orderBy: { issueDate: 'desc' },
                },
                introductionRequests: {
                    where: { sentByHrId: hrPartner.id },
                    select: { id: true, status: true },
                },
            },
        });

        if (!professional) {
            return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
        }
        // Log profile view (non-blocking)
        try {
            await prisma.profileView.create({
                data: {
                    viewedProfessionalId: professional.id,
                    viewerHrId: hrPartner.id,
                    viewSource: 'DIRECT',
                },
            });
        } catch (viewError) {
            console.error('Failed to log profile view:', viewError);
            // Continue with response even if logging fails
        }

        const acceptedIntroduction = professional.introductionRequests.find(
            req => req.status === 'ACCEPTED'
        );

        const activeIntroduction = professional.introductionRequests.find(
            req => req.status === 'PENDING' || req.status === 'ACCEPTED'
        );

        const profileData = {
            id: professional.id,
            name: professional.confidentialSearch
                ? `${professional.firstName} ${professional.lastName.charAt(0)}.`
                : `${professional.firstName} ${professional.lastName}`,
            profileHeadline: professional.profileHeadline,
            profileSummary: professional.profileSummary,
            profilePhotoUrl: professional.profilePhotoUrl,
            yearsOfExperience: professional.yearsOfExperience,
            currentTitle: professional.currentTitle,
            currentCompany: professional.confidentialSearch ? 'Confidential' : professional.currentCompany,
            currentIndustry: professional.currentIndustry,
            location: `${professional.locationCity}, ${professional.locationState}`,
            willingToRelocate: professional.willingToRelocate,
            salaryRange: professional.salaryExpectationMin && professional.salaryExpectationMax
                ? `₦${professional.salaryExpectationMin.toLocaleString()} - ₦${professional.salaryExpectationMax.toLocaleString()}`
                : null,
            noticePeriodDays: professional.noticePeriodDays,
            verificationStatus: professional.verificationStatus,
            isVerified: professional.verificationStatus !== 'UNVERIFIED',
            linkedinUrl: (!professional.confidentialSearch || acceptedIntroduction) ? professional.linkedinUrl : null,
            portfolioUrl: (!professional.confidentialSearch || acceptedIntroduction) ? professional.portfolioUrl : null,
            email: acceptedIntroduction ? professional.user.email : null,
            workHistory: professional.workHistory.map(work => ({
                ...work,
                company: professional.confidentialSearch && !acceptedIntroduction ? 'Confidential' : work.companyName,
            })),
            education: professional.education,
            skills: professional.skills,
            certifications: professional.certifications,
            //hasActiveIntroduction: professional.introductionRequests.length > 0,
            //introductionStatus: professional.introductionRequests[0]?.status || null,
            //canRequestIntroduction: professional.introductionRequests.length === 0,
            hasActiveIntroduction: !!activeIntroduction,
            introductionStatus: activeIntroduction?.status || null,
            canRequestIntroduction: !activeIntroduction,
            canViewContactInfo: !!acceptedIntroduction,
        };

        return NextResponse.json({ professional: profileData });

    } catch (err: any) {
        console.error('Profile view error:', err);

        if (err.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        return NextResponse.json({ error: 'Failed to load professional profile' }, { status: 500 });
    }
}
