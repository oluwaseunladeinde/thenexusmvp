# theNexus - Nigeria's Premier Senior Professional Network

**Turn Conversations Into Careers**

theNexus is Nigeria's most trusted network connecting verified senior professionals (Director-level and above) with forward-thinking companies through curated, opt-in introductions. We focus on quality over quantity, ensuring meaningful connections that drive real career advancement and successful hiring.

## 🎯 Our Mission
To create Nigeria's most trusted professional network where senior talent meets visionary companies through verified, confidential introductions that respect privacy and deliver results.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd theNexus
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Testing

**Note**: Automated testing suite not yet implemented. Manual testing completed for core user flows.

**Planned Test Commands** (when implemented):
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode for development
npm run test:coverage # Generate coverage report
```

### Performance Monitoring

Monitor application performance and run optimization tests:

```bash
npm run performance:test  # Run performance test script
```

**Performance Features:**
- Redis caching for search suggestions and user data
- React.memo optimization for component re-renders
- Lazy loading for routes (Next.js App Router)
- Query performance logging and monitoring
- Bundle size optimization with dynamic imports

### Database Seeding

To populate the database with sample data for development:

```bash
npm run db:seed
```

This will create:
- Sample professional and HR leader users
- Companies and skills
- Professional profiles with work experience and education
- Realistic user data for testing

**Sample Users Created:**
- **Professionals**: john.doe@example.com, sarah.wilson@example.com, mike.chen@example.com
- **HR Leaders**: lisa.martinez@techcorp.com, david.brown@innovatelabs.com
- All users have password-less authentication via email/OAuth

## 📁 Project Structure

```
theNexus/
├── prisma/
│   └── schema.prisma             # Database schema and models
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (landing)/           # Landing page routes
│   │   ├── about/               # About Us page
│   │   ├── admin/               # Admin dashboard
│   │   ├── api/                 # API routes
│   │   ├── dashboard/           # User dashboards (professional/HR)
│   │   ├── onboarding/          # User onboarding flows
│   │   ├── pricing/             # Pricing page
│   │   ├── sign-in/             # Authentication pages
│   │   ├── sign-up/             # Registration pages
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Home page
│   ├── components/              # Reusable UI components
│   │   ├── admin/               # Admin-specific components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── onboarding/          # Onboarding components
│   │   ├── ui/                  # Base UI components (Radix/Shadcn)
│   │   ├── IntroductionRequestModal.tsx
│   │   ├── PhoneVerification.tsx
│   │   ├── UserButton.tsx
│   │   └── logo.tsx             # Brand components
│   ├── constants/               # App constants and configuration
│   ├── docs/                    # Documentation and data models
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries and services
│   │   ├── data/                # Data processing utilities
│   │   ├── mqtt/                # MQTT/WebSocket services
│   │   ├── validations/         # Form validation schemas
│   │   ├── auth.ts              # Authentication utilities
│   │   ├── clerk-utils.ts       # Clerk-specific utilities
│   │   ├── prisma.ts            # Database client
│   │   ├── s3.ts                # AWS S3 utilities
│   │   ├── sms.ts               # SMS service integration
│   │   ├── upload.ts            # File upload utilities
│   │   └── utils.ts             # Common utilities
│   ├── types/                   # TypeScript type definitions
│   │   └── index.d.ts           # Global type definitions
│   ├── utils/                   # Additional utilities
│   └── web/                     # Web-specific utilities
├── public/                      # Static assets
├── components.json              # Shadcn/ui configuration
├── middleware.ts                # Next.js middleware
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: `#2E8B57` (theNexus Green)
- **Secondary**: `#0A2540` (theNexus Navy)
- **Background**: `#ffffff` (White)
- **Text**: `#0A2540` (theNexus Navy)
- **Text Secondary**: `#666666` (Gray)
- **Accent**: `#F8F9FA` (Light Gray)

### Typography
- **Font Family**: Manrope (Google Fonts)
- **Weights**: 400 (Regular), 600 (Semibold), 700 (Bold), 800 (Extrabold)

## 💼 Business Model

### Professional Tiers
- **Free**: Basic access with limited introductions
- **Professional (₦12k/month)**: Unlimited browsing, priority search, networking
- **Executive (₦25k/month)**: Market intelligence, salary data, dedicated support

### Organization Tiers
- **Starter (₦50k/month)**: 25 credits, 3 users, 5 job posts
- **Professional (₦150k/month)**: 100 credits, 10 users, 20 job posts
- **Enterprise**: Custom pricing, unlimited usage, dedicated account management

### Nigerian Market Focus
- Local currency pricing (₦)
- WhatsApp integration for communication
- Understanding of local business culture
- Mobile-first design for connectivity challenges


### RBAC Design Recommendations

#### 1. Role-Based Access Control Structure
```typescript
// Define permissions as granular actions
enum Permission {
  // User Management
  USER_VIEW = 'user.view',
  USER_EDIT = 'user.edit',
  USER_SUSPEND = 'user.suspend',
  USER_DELETE = 'user.delete',
  USER_CHANGE_TYPE = 'user.change_type',

  // Bulk Operations
  USER_BULK_EDIT = 'user.bulk_edit',
  USER_BULK_SUSPEND = 'user.bulk_suspend',
  USER_BULK_DELETE = 'user.bulk_delete',

  // System Administration
  SYSTEM_VIEW_LOGS = 'system.view_logs',
  SYSTEM_MANAGE_SETTINGS = 'system.manage_settings',
  SYSTEM_SEND_ALERTS = 'system.send_alerts',

  // Analytics
  ANALYTICS_VIEW = 'analytics.view',
  ANALYTICS_EXPORT = 'analytics.export',
}

// Define roles with associated permissions
const ROLE_PERMISSIONS: Record<UserType, Permission[]> = {
  PROFESSIONAL: [],
  HR_LEADER: [],
  ADMIN: [
    Permission.USER_VIEW,
    Permission.USER_EDIT,
    Permission.USER_SUSPEND,
    Permission.USER_BULK_EDIT,
    Permission.USER_BULK_SUSPEND,
    Permission.SYSTEM_VIEW_LOGS,
    Permission.ANALYTICS_VIEW,
  ],
  SUPER_ADMIN: [
    // All permissions
    ...Object.values(Permission),
  ],
};
```



## 🔧 API Documentation

The API is organized into versioned endpoints under `/api/v1/` for production use. All endpoints require authentication via Bearer token (Clerk JWT) unless specified otherwise.

### Authentication & Authorization
- **Method**: Bearer Token (Clerk JWT)
- **Header**: `Authorization: Bearer <token>`
- **Admin Access**: Requires `ADMIN` or `SUPER_ADMIN` user type
- **Rate Limiting**: 100 requests/minute per user, 1000/minute for admins

### Core API Endpoints

#### Professionals API
**Base Path**: `/api/professionals/`

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/me` | Get current professional profile with stats | ✓ | ✗ |
| PUT | `/me` | Update professional profile | ✓ | ✗ |
| POST | `/create` | Create professional profile | ✓ | ✗ |
| GET | `/browse` | Browse/search professionals (HR only) | ✓ | ✗ |
| GET | `/introductions` | Get professional's introduction requests | ✓ | ✗ |
| GET | `/experience` | Get professional's work experience | ✓ | ✗ |
| POST | `/experience` | Add work experience | ✓ | ✗ |
| PUT | `/experience/:id` | Update work experience | ✓ | ✗ |
| DELETE | `/experience/:id` | Delete work experience | ✓ | ✗ |
| GET | `/skills` | Get professional's skills | ✓ | ✗ |
| POST | `/skills` | Add skill | ✓ | ✗ |
| PUT | `/skills/:id` | Update skill | ✓ | ✗ |
| DELETE | `/skills/:id` | Delete skill | ✓ | ✗ |
| GET | `/references` | Get professional's references | ✓ | ✗ |
| POST | `/references` | Add reference | ✓ | ✗ |
| PUT | `/references/:id` | Update reference | ✓ | ✗ |
| DELETE | `/references/:id` | Delete reference | ✓ | ✗ |
| GET | `/portfolio` | Get portfolio items | ✓ | ✗ |
| POST | `/portfolio` | Add portfolio item | ✓ | ✗ |
| PUT | `/portfolio/:id` | Update portfolio item | ✓ | ✗ |
| DELETE | `/portfolio/:id` | Delete portfolio item | ✓ | ✗ |

#### HR Partners API
**Base Path**: `/api/hr-partners/`

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/me` | Get current HR partner profile | ✓ | ✗ |
| POST | `/create` | Create HR partner profile | ✓ | ✗ |
| GET | `/talent` | Browse talent pool | ✓ | ✗ |
| GET | `/introductions` | Get sent introduction requests | ✓ | ✗ |
| GET | `/pipeline` | Get recruitment pipeline | ✓ | ✗ |
| GET | `/pipeline/:id` | Get pipeline details | ✓ | ✗ |
| PUT | `/pipeline/:id` | Update pipeline status | ✓ | ✗ |
| GET | `/job-roles` | Get job roles | ✓ | ✗ |
| POST | `/job-roles` | Create job role | ✓ | ✗ |
| PUT | `/job-roles/:id` | Update job role | ✓ | ✗ |
| DELETE | `/job-roles/:id` | Delete job role | ✓ | ✗ |

#### Introductions API
**Base Path**: `/api/introductions/`

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/request` | Send introduction request | ✓ | ✗ |
| PUT | `/respond` | Accept/decline introduction request | ✓ | ✗ |

#### Admin API
**Base Path**: `/api/admin/`

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/users` | List all users with filtering | ✓ | ✓ |
| GET | `/users/:id` | Get user details | ✓ | ✓ |
| PUT | `/users/:id` | Update user status/type | ✓ | ✓ |
| POST | `/users/bulk` | Bulk user operations | ✓ | ✓ |
| GET | `/analytics` | Get platform analytics | ✓ | ✓ |
| GET | `/analytics/revenue` | Get revenue analytics | ✓ | ✓ |
| GET | `/analytics/export` | Export analytics data | ✓ | ✓ |
| GET | `/content` | List content items | ✓ | ✓ |
| GET | `/content/:id` | Get content details | ✓ | ✓ |
| PUT | `/content/:id` | Update content | ✓ | ✓ |
| GET | `/content/moderation` | Get content moderation queue | ✓ | ✓ |
| GET | `/content/stats` | Get content statistics | ✓ | ✓ |
| GET | `/settings` | Get system settings | ✓ | ✓ |
| PUT | `/settings` | Update system settings | ✓ | ✓ |
| GET | `/settings/system-status` | Get system health status | ✓ | ✓ |
| POST | `/auth/login` | Admin login | ✓ | ✓ |
| GET | `/auth/me` | Get admin profile | ✓ | ✓ |

#### Utility API
**Base Path**: `/api/`

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| POST | `/upload` | Upload file to S3 | ✓ | ✗ |
| POST | `/phone/send-code` | Send SMS verification code | ✓ | ✗ |
| POST | `/phone/verify-code` | Verify SMS code | ✓ | ✗ |
| POST | `/webhooks/clerk` | Clerk webhook handler | ✗ | ✗ |
| GET | `/docs` | API documentation (Swagger) | ✗ | ✗ |
| GET | `/v1/docs` | V1 API documentation | ✗ | ✗ |

#### Client API
**Base Path**: `/api/client/`

| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/customer-device-map` | Get customer device mapping | ✓ | ✗ |

### Request/Response Examples

#### Get Professional Profile
```http
GET /api/professionals/me
Authorization: Bearer <jwt_token>
```

**Response (200):**
```json
{
  "message": "Professional profile retrieved successfully",
  "data": {
    "professional": {
      "id": "prof_123",
      "userId": "user_456",
      "profileHeadline": "Senior Product Manager",
      "currentTitle": "VP of Product",
      "currentCompany": "TechCorp",
      "profileCompleteness": 85,
      "skills": [...],
      "workHistory": [...],
      "education": [...]
    },
    "stats": {
      "pending": 2,
      "accepted": 5,
      "declined": 1,
      "profileViews": 24
    }
  }
}
```

#### Send Introduction Request
```http
POST /api/introductions/request
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "professionalId": "prof_123",
  "jobRoleId": "role_456",
  "message": "We'd love to discuss the Senior PM role with you",
  "urgency": "high"
}
```

**Response (200):**
```json
{
  "message": "Introduction request sent successfully",
  "data": {
    "id": "intro_789",
    "status": "pending",
    "sentAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-02-14T10:30:00Z"
  }
}
```

#### Admin Get Users
```http
GET /api/admin/users?page=1&limit=10&userType=PROFESSIONAL&status=ACTIVE
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user_123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "userType": "PROFESSIONAL",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z",
      "professional": {
        "currentJobTitle": "Senior Developer",
        "currentCompany": "TechCorp"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "pages": 15
  }
}
```

### Error Responses

All endpoints return standardized error responses:

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

### Rate Limiting
- **Standard Users**: 100 requests/minute
- **Admin Users**: 1000 requests/minute
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### File Upload
Files are uploaded to AWS S3 with the following constraints:
- **Max Size**: 10MB per file
- **Allowed Types**: PDF, DOC, DOCX, JPG, PNG
- **Storage**: Secure, temporary URLs generated for access

### Webhooks
Clerk webhooks are handled at `/api/webhooks/clerk` for user lifecycle events.

### API Versioning
- **Current**: `/api/v1/` (recommended for new integrations)
- **Legacy**: `/api/` (deprecated, will be removed in future versions)

For complete OpenAPI specification, visit `/api/docs` or `/api/v1/docs` in your running application.

## 🚀 Deployment

### Environment Setup
1. **Database**: PostgreSQL database (production)
2. **Redis**: Redis instance for caching and queues
3. **AWS S3**: File storage bucket
4. **Clerk**: Authentication service
5. **Vercel**: Hosting platform

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=...
AWS_REGION=...

# Redis
REDIS_URL=redis://...

# Email (Optional)
RESEND_API_KEY=...

# WhatsApp/SMS (Optional)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check database connectivity
npx prisma db push

# Reset database
npx prisma migrate reset
```

**Authentication Problems**
- Verify Clerk configuration in environment variables
- Check middleware.ts for proper route protection
- Ensure user roles are correctly assigned

**File Upload Issues**
- Verify AWS S3 credentials and bucket permissions
- Check file size limits in upload configuration
- Ensure proper CORS settings for S3 bucket

**Performance Issues**
- Check Redis connectivity for caching
- Monitor database query performance
- Review rate limiting configuration

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check system health
curl http://localhost:3000/api/admin/health
```

## 📈 Performance Metrics

### Current Performance Benchmarks
- **Page Load Time**: < 2 seconds (Nigeria, 4G)
- **Search Response**: < 500ms for typical queries
- **API Response Time**: < 200ms average
- **Database Query Time**: < 100ms average

### Monitoring
- Real-time performance monitoring via Vercel Analytics
- Database performance tracking with Prisma
- Redis cache hit rates monitoring
- Error tracking and alerting

## 🤝 Contributing

This is currently a private project in development. Contribution guidelines will be added when the project moves to collaborative development.

## 📄 License

Private project - All rights reserved.

---

**Built with ❤️ for the professional community**
