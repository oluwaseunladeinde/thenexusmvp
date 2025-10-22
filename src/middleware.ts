

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

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

    // Allow all authenticated users to access any route
    return NextResponse.next();
})


export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};