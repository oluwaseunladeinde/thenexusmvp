import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/database/prisma';

// ============================================
// Permission Definitions
// ============================================
export enum Permission {

    // Professional permissions
    VIEW_OWN_PROFILE = 'view_own_profile',
    EDIT_OWN_PROFILE = 'edit_own_profile',
    ACCEPT_INTRODUCTIONS = 'accept_introductions',
    VIEW_INTRODUCTION_REQUESTS = 'view_introduction_requests',

    // HR Partner permissions
    SEARCH_PROFESSIONALS = 'search_professionals',
    VIEW_PROFESSIONAL_PROFILES = 'view_professional_profiles',
    SEND_INTRODUCTION_REQUESTS = 'send_introduction_requests',
    CREATE_JOB_ROLES = 'create_job_roles',
    MANAGE_TEAM = 'manage_team',
    VIEW_COMPANY_ANALYTICS = 'view_company_analytics',

    // Admin permissions
    VERIFY_PROFESSIONALS = 'verify_professionals',
    VERIFY_COMPANIES = 'verify_companies',
    VIEW_ALL_USERS = 'view_all_users',
    MANAGE_SUBSCRIPTIONS = 'manage_subscriptions',
    ACCESS_ADMIN_DASHBOARD = 'access_admin_dashboard',
}


// ============================================
// Role to Permissions Mapping
// ============================================
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
    professional: [
        Permission.VIEW_OWN_PROFILE,
        Permission.EDIT_OWN_PROFILE,
        Permission.ACCEPT_INTRODUCTIONS,
        Permission.VIEW_INTRODUCTION_REQUESTS,
    ],

    hr_partner: [
        Permission.SEARCH_PROFESSIONALS,
        Permission.VIEW_PROFESSIONAL_PROFILES,
        Permission.SEND_INTRODUCTION_REQUESTS,
        Permission.CREATE_JOB_ROLES,
        Permission.VIEW_COMPANY_ANALYTICS,
        // Note: MANAGE_TEAM depends on role_in_platform
    ],

    admin: [
        ...Object.values(Permission), // Admins have all permissions
    ],
}

// ============================================
// Check if user has permission
// ============================================
export async function hasPermission(permission: Permission): Promise<boolean> {
    const user = await currentUser();

    if (!user) return false;

    const userType = user.unsafeMetadata?.userType as string;
    const permissions = ROLE_PERMISSIONS[userType] || [];

    return permissions.includes(permission);
}

// ============================================
// Require permission (throws error if not authorized)
// ============================================
export async function requirePermission(permission: Permission) {
    const authorized = await hasPermission(permission);

    if (!authorized) {
        redirect('/unauthorized');
    }
}

// ============================================
// Get user role and permissions
// ============================================
export async function getUserRole() {
    const user = await currentUser();

    if (!user) return null;

    const userType = user.unsafeMetadata?.userType as string;
    const permissions = ROLE_PERMISSIONS[userType] || [];

    return {
        userType,
        permissions,
        hasDualRole: user.unsafeMetadata?.hasDualRole as boolean,
    };
}

// ============================================
// Role-specific requirement helpers
// ============================================
export async function requireProfessional() {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const userType = user.unsafeMetadata?.userType;
    if (userType !== 'professional' && userType !== 'admin') {
        redirect('/unauthorized');
    }

    return user;
}

export async function requireHrPartner() {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const userType = user.publicMetadata?.userType;
    if (userType !== 'hr_partner' && userType !== 'admin') {
        redirect('/unauthorized');
    }

    return user;
}

export async function requireAdmin() {
    const user = await currentUser();

    if (!user) redirect('/sign-in');

    const userType = user.publicMetadata?.userType;
    if (userType !== 'admin') {
        redirect('/unauthorized');
    }

    return user;
}

// ============================================
// Company-level RBAC for HR Partners
// ============================================
export async function requireHrRole(
    minRole: 'OWNER' | 'ADMIN' | 'MEMBER'
) {
    const { userId } = await auth();

    if (!userId) redirect('/sign-in');

    const hrPartner = await prisma.hrPartner.findUnique({
        where: { userId },
    });

    if (!hrPartner) {
        redirect('/unauthorized');
    }

    const roleHierarchy = { OWNER: 3, ADMIN: 2, MEMBER: 1 };
    const userLevel = roleHierarchy[hrPartner.roleInPlatform as keyof typeof roleHierarchy];
    const requiredLevel = roleHierarchy[minRole];

    if (userLevel < requiredLevel) {
        redirect('/unauthorized');
    }

    return hrPartner;
}


