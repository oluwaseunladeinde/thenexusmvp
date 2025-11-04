# theNexus - Nigeria's Premier Senior Professional Network

## 🎯 About
theNexus is Nigeria's premier network connecting verified senior professionals with forward-thinking companies through confidential, opt-in introductions. We're disrupting traditional recruitment by replacing mass job applications with curated, high-quality professional introductions.

## The Problem We Solve
### For Professionals:
- ❌ Hundreds of applications with no responses
- ❌ CVs disappearing into the void
- ❌ No feedback, no respect for time
- ❌ Confidentiality concerns while employed

### For Companies:
- ❌ Drowning in unqualified CVs
- ❌ Months to fill senior roles
- ❌ Expensive executive search fees
- ❌ Low response rates from candidates

## Our Solution
- ✅ Quality Introductions, Not Mass Applications
- ✅ 70%+ Response Rate (vs 10% traditional)
- ✅ 50% Faster Hiring (2-3 weeks vs 6-8 weeks)
- ✅ 60% Cost Savings vs executive search
- ✅ 100% Verified Professionals
- ✅ Complete Confidentiality for job seekers


# ✨ Key Features
## For Senior Professionals

- 🎯 Verified Profile Badge - Stand out with professional verification
- 📬 Quality Introductions - Receive relevant senior-level opportunities with smart filtering
- 🔒 Complete Confidentiality - Your job search remains private
- 💬 Direct Access - Speak with hiring managers, not recruiters
- 📊 Market Intelligence - Salary insights and industry trends
- 📈 Profile Completeness Tracker - Get detailed insights on profile completion with weighted categories and personalized recommendations
- 👥 Dual-Role Mode - HR professionals can also job search confidentially
- ⏰ Smart Expiry Tracking - See days remaining on introduction requests with automatic expiry management
- 🎨 Enhanced Request Cards - User-friendly card design with better visual hierarchy and readability
- 🔍 Advanced Search & Filtering - Search by role, company, industry, or location with real-time filtering
- 📱 Mobile-Optimized Interface - Fully responsive design with mobile-first approach
- 📄 Pagination System - Efficient browsing of large datasets with 5 items per page
- 🖼️ Profile Photo Management - Upload and display profile pictures across the platform
- 🔄 Smart Data Caching - Optimized user profile context to eliminate redundant API calls

## For Companies & HR Leaders

- ✅ Pre-Vetted Talent - Every professional is verified and referenced
- ⚡ 50% Faster Hiring - 2-3 weeks vs 6-8 weeks traditional
- 💰 60% Lower Cost - Fraction of executive search fees
- 🔒 Confidential Search - Hire senior roles discreetly
- 📈 Better Quality - 40% higher interview-to-offer conversion
- 🎯 Smart Matching - AI-powered candidate recommendations
- ⏳ Time-Sensitive Requests - Set expiry dates on introduction requests to create urgency

## Unique Privacy Firewall
Our **dual-role system** allows HR professionals to job search while employed, with a **privacy firewall** that ensures:

- Their company **cannot see** their professional profile
- Their company **cannot search** for them
- Their company **will not receive** any alerts
- This protection is automatic and permanent

# 🛠 Tech Stack
## Frontend
- Framework: [Next.js 14+ ](https://nextjs.org/) (App Router)
- Language: [TypeScript 5+](https://www.typescriptlang.org/)
- Styling: [Tailwind CSS 3+](https://tailwindcss.com/)
- UI Components: [ShadcnUI](https://ui.shadcn.com/) + Custom components + [Lucide Icons](https://lucide.dev/)
- Forms: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

## Backend
- API: Next.js API Routes (REST)
- Database: [PostgreSQL 15+](https://www.postgresql.org/)
- ORM: [Prisma 5+](https://www.prisma.io/)
- Authentication: [Clerk](https://clerk.com/)
- File Storage: AWS S3 / Cloudflare R2
- Email: [SendGrid](https://sendgrid.com) / [Resend](https://resend.com/)
- WhatsApp: [Twilio](https://www.twilio.com "Go to Twilio Website")

## DevOps
- Hosting: [Vercel (Frontend)](https://vercel.com/) + [Railway (Database)](https://railway.com/)
- CI/CD: [GitHub Actions](https://github.com/features/actions)
- Monitoring: [Sentry](https://sentry.io/) + Vercel Analytics
- Testing: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)


## 🚀 Getting Started
### Prerequisites

- **Node.js 22+** - [Download](https://nodejs.org/)
- **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/) or use [Railway](https://railway.com/)
- **Git** - [Download](https://git-scm.com/)
- **Clerk Account** - [Sign up](https://clerk.com/)

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

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit .env.local with your credentials ([see Environment Variables](https://claude.ai/chat/0d462027-3754-4217-b43a-7eedc9001b15#environment-variables))

4. Set up the database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with initial data
npx prisma db seed

```

5. Run the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Testing

**Note**: Not started.

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

## 📁 Run Dev Server

```bash

npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure
```
thenexusmvp/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (marketing)/              # Marketing pages
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── about/
│   │   │   └── contact/
│   │   ├── dashboard/                # HR Partner dashboard
│   │   │   ├── page.tsx
│   │   │   ├── search/
│   │   │   ├── roles/
│   │   │   └── introductions/
│   │   ├── professional/             # Professional dashboard
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── introductions/
│   │   ├── settings/                 # User settings
│   │   │   └── dual-role/
│   │   ├── api/                      # API routes
│   │   │   └── v1/                   # Version 1 API endpoints
│   │   │       ├── auth/
│   │   │       ├── professionals/
│   │   │       ├── companies/
│   │   │       ├── job-roles/
│   │   │       ├── introductions/
│   │   │       ├── dual-role/
│   │   │       └── webhooks/
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/                   # React components
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   ├── professional/
│   │   ├── settings/
│   │   ├── ui/                       # Reusable UI components
│   │   └── RoleSwitcher.tsx
│   ├── lib/                          # Utility libraries
│   │   ├── prisma.ts                 # Prisma client
│   │   ├── clerk.ts                  # Clerk configuration
│   │   ├── services/                 # Business logic
│   │   │   ├── privacyFirewall.ts
│   │   │   ├── dualRole.ts
│   │   │   ├── matching.ts
│   │   │   └── notifications.ts
│   │   ├── utils/
│   │   └── constants/
├── prisma/                       # Database
│   ├── schema.prisma             # Prisma schema
│   ├── migrations/               # Database migrations
│   └── seed.ts                   # Seed script
├── public/                       # Static assets
│   ├── logo.svg
│   └── images/
├── tests/                        # Tests
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/                         # Documentation
│   ├── api/
│   ├── deployment/
│   └── user-guides/
├── .env.example                  # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── README.md
└── LICENSE
```

## 🔐 Environment Variables
Update a .env.local file in the root directory:
```bash 
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://user:password@localhost:5432/thenexus"

# ============================================
# CLERK AUTHENTICATION
# ============================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/onboarding"

# Clerk Webhook Secret
CLERK_WEBHOOK_SECRET="whsec_..."

# ============================================
# AWS S3 (File Storage)
# ============================================
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="thenexus-uploads"

# Alternative: Cloudflare R2
# R2_ACCOUNT_ID="..."
# R2_ACCESS_KEY_ID="..."
# R2_SECRET_ACCESS_KEY="..."
# R2_BUCKET_NAME="thenexus-uploads"

# ============================================
# EMAIL (SendGrid)
# ============================================
SENDGRID_API_KEY="SG...."
SENDGRID_FROM_EMAIL="noreply@jointhenexus.com"
SENDGRID_FROM_NAME="theNexus"

# Alternative: Resend
# RESEND_API_KEY="re_..."

# ============================================
# WHATSAPP (Twilio)
# ============================================
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="whatsapp:+1234567890"

# ============================================
# ANALYTICS & MONITORING
# ============================================
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="..."
SENTRY_DSN="https://...@sentry.io/..."

# ============================================
# FEATURE FLAGS
# ============================================
NEXT_PUBLIC_DUAL_ROLE_ENABLED="true"
NEXT_PUBLIC_WHATSAPP_NOTIFICATIONS_ENABLED="true"

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"

# ============================================
# SECURITY
# ============================================
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl"
ENCRYPTION_KEY="your-encryption-key-32-characters"

# ============================================
# RATE LIMITING
# ============================================
REDIS_URL="redis://localhost:6379"

# ============================================
# DEVELOPMENT
# ============================================
NODE_ENV="development"
LOG_LEVEL="debug"
```

### Generating Secrets
```bash 
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY (32 characters)
openssl rand -hex 16
```

## 🗄 Database Schema
### Core Models
- **User** - Base authentication and user management
- **Professional** - Senior professional profiles
- **Company** - Company/organization accounts
- **HrPartner** - HR team members
- **JobRole** - Open positions
- **IntroductionRequest** - Core matching workflow
- **PrivacyFirewallLog** - Dual-role privacy audit trail

### Key Relationships
```bash 
User (1:1) → Professional
User (1:1) → HrPartner
Company (1:many) → HrPartner
Company (1:many) → JobRole
JobRole (1:many) → IntroductionRequest
Professional (1:many) → IntroductionRequest
HrPartner (1:1) → Professional (dual-role link)
```

## Privacy Firewall
The hideFromCompanyIds array on Professional ensures:

- HR partners' own companies cannot see their professional profiles
- Automatic filtering in all search queries
- Logged audit trail for compliance

See [Database Schema Documentation](https://claude.ai/chat/docs/database-schema.md) for full details.


# 📚 API Documentation
## Authentication
All API routes except public endpoints require authentication via Clerk.



## Key Endpoints
### Professional Endpoints
```bash
GET    /api/v1/professionals/me           # Get current user's professional profile (includes profile completeness)
PUT    /api/v1/professionals/me           # Update professional profile (auto-calculates completeness)
POST   /api/v1/professionals/work-history # Add work experience
POST   /api/v1/professionals/skills       # Add skills
GET    /api/v1/professionals/search       # Search professionals (HR only)
POST   /api/v1/professionals/upload       # Upload profile photo or resume (updates completeness)
```

### Job Role Endpoints
```bash 
GET    /api/v1/job-roles                  # List job roles (HR only)
POST   /api/v1/job-roles                  # Create job role (HR only)
GET    /api/v1/job-roles/:id              # Get job role details
PUT    /api/v1/job-roles/:id              # Update job role (HR only)
DELETE /api/v1/job-roles/:id              # Delete job role (HR only)
```

### Introduction Request Endpoints
```bash 
POST   /api/v1/introductions/request      # Send introduction request (HR only)
GET    /api/v1/introductions/sent         # List sent introductions (HR only)
GET    /api/v1/introductions/received     # List received introductions (Professional only)
PUT    /api/v1/introductions/:id/accept   # Accept introduction (Professional only)
PUT    /api/v1/introductions/:id/decline  # Decline introduction (Professional only)
```

### Dual-Role Endpoints
```bash 
POST   /api/v1/dual-role/activate         # Activate dual-role mode (HR only)
GET    /api/v1/dual-role/status           # Get dual-role status
POST   /api/v1/dual-role/deactivate       # Deactivate dual-role mode
POST   /api/v1/dual-role/block-list       # Add company to block list
DELETE /api/v1/dual-role/block-list       # Remove company from block list
```

See [API Documentation](https://claude.ai/chat/docs/api/README.md) for complete endpoint reference.

# 🚢 Deployment
## Vercel (Recommended)

1. **Push to GitHub**
```bash 
git push origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com/)
- Click "Import Project"
- Select your GitHub repository
- Configure environment variables
- Deploy

3. **Set up Database**
- Use Railway for PostgreSQL
- Copy database URL to Vercel environment variables
- Run migrations: npx prisma migrate deploy

## Docker
```bash 
# Build image
docker build -t thenexus .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..." \
  thenexus
```

## Manual Deployment
```bash 
# Build for production
npm run build

# Start production server
npm run start
```

# 🧪 Testing
## Unit Tests

```bash 
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Integration Tests
```bash 
npm run test:integration
```

## E2E Tests
```bash 
# Run Playwright tests
npm run test:e2e

# Run Playwright tests in UI mode
npm run test:e2e:ui
```

## Test Coverage Goals
- Unit Tests: >80% coverage
- Integration Tests: Critical API routes
- E2E Tests: Core user flows

## 🤝 Contributing (Next Stage)
We welcome contributions from the community! Please read our [Contributing Guide](https://claude.ai/chat/CONTRIBUTING.md) before submitting a pull request.

### Development Workflow
1. Fork the repository
2. Create a feature branch
```bash 
git checkout -b feature/amazing-feature
```
3. Make your changes
4. Run tests
```bash 
npm run test
npm run test:e2e
```
5. Commit your changes
```bash 
git commit -m "feat: add amazing feature"
```
6. Push to your fork
```bash 
git push origin feature/amazing-feature
```
7. **Open a Pull Request**

### Commit Convention
We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 🚀 Recent Updates (November 2024)

### Introduction Request Management System
- **Complete UI/UX overhaul** with enhanced job cards and detail modals
- **Advanced filtering system** with All, Pending, Accepted, Declined, and Expired status filters
- **Real-time search functionality** across role titles, companies, industries, and locations
- **Pagination system** for efficient browsing of large datasets (5 items per page)
- **Mobile-responsive design** with horizontal filter tabs and optimized layouts
- **Expiry tracking** with visual warnings and automatic status management

### Profile & User Experience
- **Profile photo integration** across dashboard, user button, and profile pages
- **Custom user button** with dropdown menu, profile navigation, and logout functionality
- **Smart data caching** with UserProfile context to eliminate redundant API calls
- **Profile completeness tracking** with progress indicators and recommendations
- **Introduction detail modal** with comprehensive job and company information

### Technical Improvements
- **API integration** replacing mock data with real backend endpoints
- **Build optimization** fixing Next.js compatibility issues and type errors
- **Performance enhancements** with efficient state management and caching
- **Mobile-first responsive design** ensuring excellent experience across all devices

### November 4, 2024 - Major Platform Enhancements
- **Introduction Detail Modal**: Full-screen mobile modal with comprehensive job information
- **Expired Request Management**: Automatic expiry detection and filtering system
- **Search & Pagination**: Real-time search with 5-item pagination for better performance
- **Mobile Optimization**: Horizontal filter tabs and responsive layouts for all screen sizes
- **Profile Photo System**: Consistent avatar display across all platform components
- **User Profile Context**: Centralized caching system eliminating redundant API calls
- **Custom User Button**: Professional dropdown with navigation and logout functionality
- **Build Fixes**: Resolved Next.js 15 compatibility issues and TypeScript errors

## 📋 Roadmap
### Phase 1: MVP (Current)
- ✅ Professional profiles with verification
- ✅ Company accounts with HR team management
- ✅ Job role creation and management
- ✅ Introduction request workflow with expiry tracking
- ✅ Dual-role system with privacy firewall
- ✅ Enhanced UI with user-friendly request cards
- ✅ Smart filtering system (All, Pending, Accepted, Declined, Expired)
- ✅ Real-time expiry warnings and status management
- ✅ Advanced search functionality with multi-field filtering
- ✅ Mobile-responsive design with touch-friendly interfaces
- ✅ Pagination system for efficient data browsing
- ✅ Profile photo management and display
- ✅ Custom user button with navigation and logout
- ✅ Introduction request detail modal with full information
- ✅ Smart data caching with UserProfile context
- ✅ Basic notifications (email + WhatsApp)

### Phase 2: Enhanced Features (Q2 2025)
- 🔄 Advanced search with AI matching
- 🔄 In-app messaging system
- 🔄 Skill endorsements
- 🔄 Professional references system
- 🔄 Saved searches and candidates
- 🔄 Calendar integration for interviews

### Phase 3: Scale & Optimize (Q3 2025)
- 🔄 Mobile app (React Native)
- 🔄 Advanced analytics dashboard
- 🔄 Video introductions
- 🔄 Salary benchmarking tool
- 🔄 API for third-party integrations
- 🔄 Multi-language support

### Phase 4: Enterprise Features (Q4 2025)
- 🔄 White-label solution
- 🔄 Custom workflows
- 🔄 Advanced reporting
- 🔄 Bulk operations
- 🔄 SSO integration
- 🔄 Dedicated account managers

## 🎨 Brand Guidelines
### Colors
- **Primary Green:** `#2E8B57` (Emerald Green)
- **Primary Light:** `#3ABF7A`
- **Primary Dark:** `#1F5F3F`
- **Secondary Navy:** `#0A2540`
- **Accent Gold:** `#CFAF50`

### Typography
- **Font Family:** Manrope (via Google Fonts)
- **Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)

### Logo
Download brand assets from [/public/brand/](./public/brand/)

# 📞 Contact
## Team

- **Founder & CEO**: Oluwaseun Ladeinde
- **Email**: info@jointhenexus.ng
- **Phone/WhatsApp**: +234 703 943 1793
- **Website**: jointhenexus.ng
- **LinkedIn**: @thenexus

## Support
- **Email**: support@jointhenexus.ng
- **Documentation**: docs.jointhenexus.com
- **Status Page**: status.jointhenexus.com

## Legal
- **Company**: Everstream Nexus Limited
- **Location**: Lagos, Nigeria
- **Privacy Policy**: jointhenexus.ng/privacy
- **Terms of Service**: jointhenexus.ng/terms

## 🙏 Acknowledgments

- Next.js - The React framework for production
- Clerk - Authentication and user management
- Prisma - Next-generation ORM
- Tailwind CSS - Utility-first CSS framework
- Vercel - Deployment and hosting
- Lucide - Beautiful icons
- Nigerian tech ecosystem for inspiration and support


## 🤝 Contributing

This is currently a private project in development. Contribution guidelines will be added when the project moves to collaborative development.

## 📄 License

Private project - All rights reserved.

---

**Built with ❤️ for the professional community in Nigeria 🇳🇬**