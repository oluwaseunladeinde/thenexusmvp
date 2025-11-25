# Admin API Standards - Addendum

## Admin-Specific API Patterns

### Route Structure
```
src/app/api/admin/
├── auth/
│   ├── login/route.ts
│   └── logout/route.ts
├── users/
│   ├── route.ts                    # List/create users
│   ├── [id]/route.ts              # User operations
│   ├── [id]/suspend/route.ts      # User actions
│   └── bulk/route.ts              # Bulk operations
├── content/
│   ├── moderation/route.ts        # Moderation queue
│   └── [id]/approve/route.ts      # Content actions
└── analytics/
    └── route.ts                   # Analytics data
```

### Admin Authentication
```typescript
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function validateAdminAccess(requiredRole: 'ADMIN' | 'SUPER_ADMIN' = 'ADMIN') {
    const { userId } = await auth();
    
    if (!userId) {
        throw new Error('Unauthorized');
    }

    function isRoleSufficient(userRole: string, required: string): boolean {
        const roleHierarchy = { 'ADMIN': 0, 'SUPER_ADMIN': 1 };
        return (roleHierarchy[userRole] ?? -1) >= (roleHierarchy[required] ?? 0);
    }
    
    const adminUser = await prisma.adminUser.findUnique({
        where: { clerkId: userId }
    });
    
    if (!adminUser || !isRoleSufficient(adminUser.role, requiredRole)) {
        throw new Error('Insufficient permissions');
    }
    
    return adminUser;
}
```

### Audit Logging
All admin actions must be logged:
```typescript
async function logAdminAction(
    adminId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    details?: Record<string, any>
) {
    try {
        await prisma.adminAuditLog.create({
            data: {
                adminId,
                action,
                resourceType,
                resourceId,
                details: sanitizeDetails(details),
                timestamp: new Date()
            }
        });
    } catch (error) {
        // Log to error tracking (e.g., Sentry) but don't block the admin action
        console.error('Failed to create audit log:', error);
    }
}

function sanitizeDetails(details?: Record<string, any>): Record<string, any> {
    if (!details) return {};
    // Remove sensitive fields like emails, passwords, tokens
    const { password, token, email, ...safe } = details;
    return safe;
}
await prisma.adminAuditLog.create({
    data: {
        adminId: adminUser.id,
        action: 'USER_SUSPENDED',
        resourceType: 'USER',
        resourceId: targetUserId,
        details: { reason: 'Policy violation' }
    }
});
```

### Bulk Operations Pattern
```typescript
export async function POST(request: NextRequest) {
    const adminUser = await validateAdminAccess();
    const body = await request.json();
    const { action, userIds } = body;

    // Validate action
    const ALLOWED_ACTIONS = ['SUSPEND', 'UNSUSPEND', 'DELETE', 'VERIFY'];
    if (!ALLOWED_ACTIONS.includes(action)) {
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Validate userIds
    if (!Array.isArray(userIds) || userIds.length === 0 || userIds.length > 1000) {
        return NextResponse.json(
            { error: 'userIds must be a non-empty array with max 1000 items' },
            { status: 400 }
        );
    }

    if (!userIds.every(id => typeof id === 'string')) {
        return NextResponse.json({ error: 'All userIds must be strings' }, { status: 400 });
    }
    
    const results = await Promise.allSettled(
        userIds.map(id => performAdminUserAction(id, action, adminUser.id))
    );
    
    return NextResponse.json({
        success: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
        results: results.map(r => ({
            status: r.status,
            ...(r.status === 'fulfilled' ? { data: r.value } : { error: r.reason?.message })
        }))
    });
}
```
