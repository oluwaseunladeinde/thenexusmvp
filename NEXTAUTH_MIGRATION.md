# NextAuth.js Migration Strategy for theNexus

## 🎯 **Migration Overview**
Migrate from Clerk to NextAuth.js for better control and reliability while maintaining all existing functionality.

## 📋 **Phase 1: Setup & Installation (Day 1-2)**

### 1.1 Install Dependencies
```bash
pnpm add next-auth @auth/prisma-adapter
pnpm add @types/next-auth -D
```

### 1.2 Environment Variables Setup
```env
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth Providers (keep existing)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id" 
GITHUB_CLIENT_SECRET="your-github-client-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
```

### 1.3 Database Schema Updates
```prisma
// Add to schema.prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Update User model
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  phone         String?
  phoneVerified Boolean   @default(false)
  userType      UserType?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  professional  Professional?
  hrPartner     HrPartner?
}
```

## 📋 **Phase 2: NextAuth Configuration (Day 2-3)**

### 2.1 Create NextAuth Configuration
File: `src/lib/auth.ts`
```typescript
import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import LinkedInProvider from "next-auth/providers/linkedin"
import { prisma } from "@/lib/database"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.userType = user.userType
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Custom sign-in logic
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  session: {
    strategy: "database",
  },
}
```

### 2.2 API Route Setup
File: `src/app/api/auth/[...nextauth]/route.ts`
```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

## 📋 **Phase 3: Data Migration (Day 3-4)**

### 3.1 User Data Migration Script
File: `scripts/migrate-clerk-to-nextauth.ts`
```typescript
import { prisma } from '@/lib/database'
import { clerkClient } from '@clerk/nextjs/server'

async function migrateUsers() {
  // Get all users from Clerk
  const clerkUsers = await clerkClient.users.getUserList()
  
  for (const clerkUser of clerkUsers) {
    // Create user in NextAuth format
    await prisma.user.upsert({
      where: { email: clerkUser.emailAddresses[0].emailAddress },
      update: {},
      create: {
        id: clerkUser.id, // Keep same ID for data consistency
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`,
        emailVerified: clerkUser.emailAddresses[0].verification?.status === 'verified' ? new Date() : null,
        phone: clerkUser.phoneNumbers[0]?.phoneNumber,
        phoneVerified: clerkUser.phoneNumbers[0]?.verification?.status === 'verified',
        userType: clerkUser.unsafeMetadata?.userType as any,
      }
    })
  }
}
```

### 3.2 Run Migration
```bash
npx tsx scripts/migrate-clerk-to-nextauth.ts
```

## 📋 **Phase 4: Component Updates (Day 4-5)**

### 4.1 Replace Clerk Components
```typescript
// Before (Clerk)
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'

// After (NextAuth)
import { useSession, signIn, signOut } from 'next-auth/react'
import { Session } from 'next-auth'
```

### 4.2 Update Authentication Hooks
```typescript
// Custom hook for user data
export function useCurrentUser() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
  }
}
```

### 4.3 Update Middleware
File: `src/middleware.ts`
```typescript
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Middleware logic
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Authorization logic
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/professional/:path*', '/api/v1/:path*']
}
```

## 📋 **Phase 5: Testing & Rollout (Day 5-7)**

### 5.1 Testing Checklist
- [ ] OAuth sign-in (Google, GitHub, LinkedIn)
- [ ] User session management
- [ ] Protected routes
- [ ] API authentication
- [ ] User type detection (professional/hr-partner)
- [ ] Profile data access
- [ ] Sign out functionality

### 5.2 Gradual Rollout Strategy
1. **Feature Flag**: Add environment variable to switch between Clerk/NextAuth
2. **A/B Testing**: Route 10% of users to NextAuth initially
3. **Monitor**: Check for authentication errors
4. **Scale Up**: Gradually increase to 100%
5. **Remove Clerk**: After 1 week of stable operation

## 📋 **Phase 6: Cleanup (Day 7-8)**

### 6.1 Remove Clerk Dependencies
```bash
pnpm remove @clerk/nextjs
```

### 6.2 Clean Up Code
- Remove Clerk imports
- Delete Clerk configuration files
- Update environment variables
- Remove Clerk webhooks

## 🚨 **Risk Mitigation**

### Rollback Plan
1. Keep Clerk configuration for 2 weeks
2. Database backup before migration
3. Feature flag to switch back instantly
4. Monitor error rates closely

### Data Integrity
- Preserve user IDs during migration
- Maintain all user relationships
- Verify professional/hr-partner data

## 📊 **Success Metrics**
- [ ] 0% authentication failures
- [ ] All OAuth providers working
- [ ] User sessions persistent
- [ ] No data loss
- [ ] Performance maintained

## 🔧 **Implementation Priority**
1. **High**: Core authentication flow
2. **High**: User data migration
3. **Medium**: OAuth providers
4. **Medium**: Protected routes
5. **Low**: UI polish

---

**Estimated Timeline: 7-8 days**
**Risk Level: Medium (with proper testing)**
**Rollback Time: < 1 hour (with feature flag)**
