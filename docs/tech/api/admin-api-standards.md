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
    
    const adminUser = await prisma.adminUser.findUnique({
        where: { clerkId: userId }
    });
    
    if (!adminUser || !hasPermission(adminUser.role, requiredRole)) {
        throw new Error('Insufficient permissions');
    }
    
    return adminUser;
}
```

### Audit Logging
All admin actions must be logged:
```typescript
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
    const { action, userIds } = await request.json();
    
    const results = await Promise.allSettled(
        userIds.map(id => performUserAction(id, action))
    );
    
    return NextResponse.json({
        success: results.filter(r => r.status === 'fulfilled').length,
        failed: results.filter(r => r.status === 'rejected').length,
        results
    });
}
```
