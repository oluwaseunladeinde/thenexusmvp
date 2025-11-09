import { describe, it, expect } from 'vitest';
import { ROLE_PERMISSIONS, Permission } from '@/lib/auth/rbac';

describe('RBAC System', () => {
    it('should assign correct permissions to professionals', () => {
        const permissions = ROLE_PERMISSIONS.professional;

        expect(permissions).toContain(Permission.VIEW_OWN_PROFILE);
        expect(permissions).toContain(Permission.ACCEPT_INTRODUCTIONS);
        expect(permissions).not.toContain(Permission.SEARCH_PROFESSIONALS);
    });

    it('should assign correct permissions to HR partners', () => {
        const permissions = ROLE_PERMISSIONS.hr-partner;

        expect(permissions).toContain(Permission.SEARCH_PROFESSIONALS);
        expect(permissions).toContain(Permission.SEND_INTRODUCTION_REQUESTS);
        expect(permissions).not.toContain(Permission.VERIFY_PROFESSIONALS);
    });

    it('should give admins all permissions', () => {
        const permissions = ROLE_PERMISSIONS.admin;
        const allPermissions = Object.values(Permission);

        allPermissions.forEach(permission => {
            expect(permissions).toContain(permission);
        });
    });
});