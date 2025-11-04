# API Documentation Fix Task

## Overview
Fix API documentation across all routes to ensure proper API return type guarantee and fulfill Swagger documentation requirements.

## Tasks

### 1. Define Response Schemas (lib/schemas/api-schemas.ts)
- [x] Add comprehensive response schemas for all API endpoints
- [x] Define Professional profile response schema
- [x] Define Introduction request response schema
- [x] Define File upload response schema
- [x] Define States/Cities response schemas
- [x] Define HR Partner response schemas

### 2. Add Missing Swagger Documentation
- [x] Add docs to `/api/v1/professionals/upload/route.ts`
- [x] Add docs to `/api/v1/introductions/received/route.ts`
- [x] Add docs to `/api/v1/introductions/[id]/accept/route.ts`
- [x] Add docs to `/api/v1/introductions/[id]/decline/route.ts`

### 3. Update OpenAPI Specification (public/openapi.json)
- [x] Remove outdated admin routes that don't exist
- [x] Add missing routes to the spec
- [x] Update schemas to match actual API responses
- [x] Ensure all endpoints have proper request/response definitions

### 4. Validation and Testing
- [x] Validate OpenAPI spec format
- [x] Test documentation generation
- [x] Ensure TypeScript types match schemas

## Files to Edit
- `src/lib/schemas/api-schemas.ts`
- `src/app/api/v1/professionals/upload/route.ts`
- `src/app/api/v1/introductions/received/route.ts`
- `src/app/api/v1/introductions/[id]/accept/route.ts`
- `src/app/api/v1/introductions/[id]/decline/route.ts`
- `public/openapi.json`

## Progress Tracking
- [x] Task 1: Define Response Schemas
- [x] Task 2: Add Missing Swagger Docs
- [x] Task 3: Update OpenAPI Spec
- [x] Task 4: Validation and Testing
