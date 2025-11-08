

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
    '/',
    '/about',
    '/contact',
    '/setup',
    '/docs',
    '/how-it-works',
    '/pricing',
    '/admin(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks(.*)',
    '/api/docs',
    '/api/v1/docs',
    '/api-docs',
]);

const isIgnoredRoute = createRouteMatcher([
    '/api/v1/webhook/clerkjs',
    '/api/docs',
    '/api/v1/scripts/sync-clerk',
    '/final',
    '/setup',
    '/api/v1/docs',
    '/_next(.*)',
    '/favicon.ico',
]);

export default clerkMiddleware(async (auth, req) => {

    if (isIgnoredRoute(req)) {
        return NextResponse.next();
    }

    if (isPublicRoute(req)) {
        return NextResponse.next();
    }

    const { userId, sessionClaims } = await auth();

    // Not authenticated - redirect to sign-in
    if (!userId) {
        const signInUrl = new URL('/sign-in', req.url);
        return NextResponse.redirect(signInUrl);
    }

    // Type-safe access to metadata
    const metadata = sessionClaims?.metadata;
    let onboardingComplete = metadata?.onboardingComplete ?? false;
    let userType: 'professional' | 'hr-partner' | 'admin' | undefined = metadata?.userType;

    if (userType === undefined || onboardingComplete === undefined) {
        // Fetch user from Clerk to access publicMetadata
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);

        // onboardingComplete = user.unsafeMetadata?.onboardingComplete as boolean;
        // userType = user.unsafeMetadata?.userType as 'professional' | 'hr-partner' | 'admin' | undefined;

        const publicMetadata = user.publicMetadata as Record<string, unknown>;
        onboardingComplete = typeof publicMetadata?.onboardingComplete === 'boolean' ? publicMetadata.onboardingComplete : false;
        userType = ['professional', 'hr-partner', 'admin'].includes(publicMetadata?.userType as string) ? publicMetadata?.userType as 'professional' | 'hr-partner' | 'admin' : undefined;
    }

    // Redirect to onboarding if incomplete
    // if (!onboardingComplete && req.nextUrl.pathname !== '/onboarding') {
    //     console.log("Inside the middlware, routing to onboarding...", { onboardingComplete, userType });
    //     const onboardingUrl = new URL('/onboarding', req.url);
    //     return NextResponse.redirect(onboardingUrl);
    // }

    // Role-based route protection
    const pathname = req.nextUrl.pathname;

    // HR/Dashboard routes - require HR partner or admin
    if (pathname.startsWith('/hr') || pathname.startsWith('/dashboard')) {
        if (userType !== 'hr-partner' && userType !== 'admin') {
            const unauthorizedUrl = new URL('/unauthorized', req.url);
            return NextResponse.redirect(unauthorizedUrl);
        }
    }

    // Professional routes - require professional or admin
    if (pathname.startsWith('/professional')) {
        if (userType !== 'professional' && userType !== 'admin') {
            const unauthorizedUrl = new URL('/unauthorized', req.url);
            return NextResponse.redirect(unauthorizedUrl);
        }
    }

    // Admin routes - require admin only
    if (pathname.startsWith('/admin')) {
        if (userType !== 'admin') {
            const unauthorizedUrl = new URL('/unauthorized', req.url);
            return NextResponse.redirect(unauthorizedUrl);
        }
    }

    // Allow the request to proceed
    return NextResponse.next();
})


export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};