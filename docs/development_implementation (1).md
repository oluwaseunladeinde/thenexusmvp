# Development Implementation Blueprint

## Overview
theNexus: A platform enabling HR leaders/agencies to send verified, opt-in introductions to a curated pool of senior professionals. Features include verified portfolios, private intro requests, candidate consent, outcome tracking, and localized UX optimized for Nigerian business practices.

## Week 1: Foundation & Setup
- Set up dev environment (Node.js, PostgreSQL, Git repo, project structure, libraries)
- Configure hosting (Vercel for frontend, Railway for backend)
- Initialize database schema
- Build & deploy landing page (`jointhenexus.ng`)
- Set up environment variables
- Implement authentication (JWT, signup, email verification, password reset)
- Create DB tables: `users`, `professionals`, `hr_partners`
- Integrate email service (SendGrid)
- Build **professional signup form** (multi-step, file upload via Cloudinary, validation, save draft, confirmation email)
- Build **HR partner signup form** (business email validation, company verification)
- Start **admin panel** (authentication, user list, approve/reject users)
- Weekend: end-to-end testing, bug fixes, deploy, basic docs

## Week 2: Dashboards & Profiles
- **Professional dashboard**: profile completion, activity feed (placeholder), profile edit, privacy settings, verification status
- **HR partner dashboard**: metrics display, sidebar nav, quick actions, profile settings
- **Talent search**: keyword, filters (industry, experience, location, career level), profile cards, pagination
- **Professional profile view**: work samples, verification badge, resume download, contact details (conditional), “Request Introduction” button
- **Admin panel**: professional verification, document review, approve/reject, intro requests dashboard, metrics view
- Weekend: dashboard testing, bug fixes, DB optimization, deploy

## Week 3: Introduction Workflow
- **Intro request form**: role brief fields, message composer, confidentiality settings, validation, save draft
- **Send intro logic**: create DB record, send email, in-app notification, automated WhatsApp notification via Business API, dashboard update
- **Professional inbox**: list requests, detail modal, accept/decline buttons, request info option
- **Accept/Decline logic**: update status, exchange contact details, notify both parties, update dashboards
- **Notification system**: email templates (welcome, new intro, accepted, declined, verified), queue, preferences
- Weekend: full intro workflow test, bug fixes, optimize email delivery

## Week 4: Polish & Launch
- Fix bugs (medium/high priority)
- Optimize performance, mobile responsiveness, cross-browser compatibility
- Security audit
- **Admin tools**: manual status updates, user logs, error monitoring (Sentry), analytics, backup automation, monitoring dashboards
- Build FAQ page, help links, onboarding tooltips
- Final dry run of professional + HR partner journeys
- Final deployment: load test, SSL/DNS checks, backups
- Pilot launch monitoring and urgent fixes
