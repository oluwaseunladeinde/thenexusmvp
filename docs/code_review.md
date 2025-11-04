## Key areas requiring careful attention:
- Profile completeness calculator logic and weighted category scoring (src/lib/services/profileCompletenessCalculator.ts) — verify category weights and item conditions
- RBAC permission mappings and role-based route guards (src/lib/auth/rbac.ts, src/middleware.ts) — ensure all routes are correctly protected and no privilege escalation paths exist
- Clerk webhook handlers (src/app/api/v1/webhooks/clerk/route.ts) — validate user state transitions and metadata consistency across created/updated/deleted events
- Multi-step onboarding form state management and validation (src/components/onboarding/ProfessionalOnboardingForm.tsx, stores) — verify step progression, data persistence, and form validation work end-to-end
- File upload handling and URL generation (src/app/api/v1/professionals/upload/route.ts) — verify file size/type validation, disk safety, and completeness recalculation on upload
- API schemas and validation breadth (src/lib/schemas/api-schemas.ts) — ensure all request/response shapes are correctly defined and match implementations
- Professional metadata sync and onboarding complete flag handling across Clerk and Prisma