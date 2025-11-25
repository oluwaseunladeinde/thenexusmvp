import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

interface AnalyticsQuery {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
}

interface PopularQuery {
    query: string;
    count: bigint;
}

/**
 * @swagger
 * /api/v1/analytics/search:
 *   get:
 *     summary: Get search analytics data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *     responses:
 *       200:
 *         description: Search analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 searchQueries:
 *                   type: array
 *                 filterUsage:
 *                   type: object
 *                 popularQueries:
 *                   type: array
 *                 conversionRates:
 *                   type: object
 */
export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        const { searchParams } = new URL(req.url);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get HR partner and check permissions
        const hrPartner = await prisma.hrPartner.findUnique({
            where: { userId },
            select: { id: true, companyId: true, roleInPlatform: true },
        });

        if (!hrPartner) {
            return NextResponse.json({ error: 'HR Partner not found' }, { status: 403 });
        }

        const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = searchParams.get('endDate') || new Date().toISOString();
        const groupByParam = searchParams.get('groupBy') || 'day';
        const allowedGroupBy = ['day', 'week', 'month'];
        if (!allowedGroupBy.includes(groupByParam)) {
            return NextResponse.json({ error: 'Invalid groupBy value' }, { status: 400 });
        }

        const groupBy = groupByParam as 'day' | 'week' | 'month';

        // Get search queries analytics
        const searchQueries = await prisma.userActivityLog.findMany({
            where: {
                userId,
                actionType: 'SEARCH_PROFESSIONALS',
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            select: {
                searchQuery: true,
                filtersUsed: true,
                resultsCount: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        // Get filter usage statistics
        const filterUsage = await prisma.userActivityLog.groupBy({
            by: ['actionType'],
            where: {
                userId,
                actionType: { in: ['SEARCH_FILTER_CHANGE', 'SEARCH_PROFESSIONALS'] },
                createdAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            _count: { id: true },
        });

        // Get popular search terms
        const popularQueriesRaw = await prisma.$queryRaw<PopularQuery[]>`
            SELECT
                "searchQuery" as query,
                COUNT(*) as count
            FROM "user_activity_logs"
            WHERE "userId" = ${userId}
                AND "actionType" = 'SEARCH_PROFESSIONALS'
                AND "searchQuery" IS NOT NULL
                AND "createdAt" >= ${new Date(startDate)}
                AND "createdAt" <= ${new Date(endDate)}
            GROUP BY "searchQuery"
            ORDER BY count DESC
            LIMIT 10
        `;

        const popularQueries = popularQueriesRaw.map(q => ({
            query: q.query,
            count: Number(q.count),
        }));

        // Get profile view analytics
        const profileViews = await prisma.profileView.findMany({
            where: {
                viewerHrId: hrPartner.id,
                viewedAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            select: {
                viewedProfessionalId: true,
                viewSource: true,
                viewedAt: true,
            },
        });

        // Get introduction requests for conversion tracking
        const introductions = await prisma.introductionRequest.findMany({
            where: {
                sentByHrId: hrPartner.id,
                sentAt: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            select: {
                sentToProfessionalId: true,
                sentAt: true,
                status: true,
            },
        });

        // Calculate conversion rates
        const totalSearches = searchQueries.length;
        const totalProfileViews = profileViews.length;
        const totalIntroductions = introductions.length;
        const acceptedIntroductions = introductions.filter(i => i.status === 'ACCEPTED').length;

        const conversionRates = {
            searchToView: totalSearches > 0 ? (totalProfileViews / totalSearches) * 100 : 0,
            viewToIntroduction: totalProfileViews > 0 ? (totalIntroductions / totalProfileViews) * 100 : 0,
            introductionToAcceptance: totalIntroductions > 0 ? (acceptedIntroductions / totalIntroductions) * 100 : 0,
        };

        // Group data by time period
        const timeSeriesData = await generateTimeSeriesData(userId, hrPartner.id, startDate, endDate, groupBy);

        return NextResponse.json({
            summary: {
                totalSearches,
                totalProfileViews,
                totalIntroductions,
                acceptedIntroductions,
                conversionRates,
            },
            searchQueries: searchQueries.slice(0, 50), // Limit for performance
            popularQueries,
            filterUsage,
            profileViews: profileViews.slice(0, 100), // Limit for performance
            timeSeriesData,
        });

    } catch (error) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}

async function generateTimeSeriesData(
    userId: string,
    hrPartnerId: string,
    startDate: string,
    endDate: string,
    groupBy: 'day' | 'week' | 'month'
) {

    const dateFormat = groupBy === 'day' ? 'YYYY-MM-DD' :
        groupBy === 'week' ? 'YYYY-WW' : 'YYYY-MM';

    // Map to PostgreSQL DATE_TRUNC values (whitelist)
    const dateTruncMap = {
        'day': 'day',
        'week': 'week',
        'month': 'month'
    } as const;
    const truncValue = dateTruncMap[groupBy];


    const searches = await prisma.$queryRaw<Array<{ period: Date, searches: bigint, avg_results: number | null }>>`
        SELECT
            DATE_TRUNC(${truncValue}, "createdAt") as period,
            COUNT(*) as searches,
            AVG("resultsCount") as avg_results
        FROM "user_activity_logs"
        WHERE "userId" = ${userId}
            AND "actionType" = 'SEARCH_PROFESSIONALS'
            AND "createdAt" >= ${new Date(startDate)}
            AND "createdAt" <= ${new Date(endDate)}
        GROUP BY period
        ORDER BY period
    `;

    const views = await prisma.$queryRaw<Array<{ period: Date, views: bigint }>>`
        SELECT
            DATE_TRUNC(${truncValue}, "viewedAt") as period,
            COUNT(*) as views
        FROM "profile_views"
        WHERE "viewerHrId" = ${hrPartnerId}
            AND "viewedAt" >= ${new Date(startDate)}
            AND "viewedAt" <= ${new Date(endDate)}
        GROUP BY period
        ORDER BY period
    `;

    return {
        searches: searches.map(s => ({
            period: s.period,
            searches: Number(s.searches),
            avg_results: s.avg_results
        })),
        views: views.map(v => ({
            period: v.period,
            views: Number(v.views)
        })),
    };
}
