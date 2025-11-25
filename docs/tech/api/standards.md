# API Standards and Guidelines

This document outlines the standards and best practices for developing APIs in The Nexus platform. These guidelines ensure consistency, maintainability, and scalability across all API endpoints. API documentation is automatically generated at every build using OpenAPI/Swagger specifications.

## Table of Contents

1. [API Structure and Organization](#api-structure-and-organization)
2. [HTTP Methods and RESTful Conventions](#http-methods-and-restful-conventions)
3. [Authentication and Authorization](#authentication-and-authorization)
4. [Request/Response Formats](#requestresponse-formats)
5. [Error Handling](#error-handling)
6. [Validation](#validation)
7. [Database Operations](#database-operations)
8. [Pagination and Filtering](#pagination-and-filtering)
9. [Rate Limiting](#rate-limiting)
10. [Security](#security)
11. [Documentation](#documentation)
12. [Testing](#testing)
13. [Naming Conventions](#naming-conventions)
14. [Performance Considerations](#performance-considerations)

## API Structure and Organization

### File Structure

All API routes follow the Next.js App Router convention:

```
src/app/api/
├── v1/                            # API version namespace
│   ├── [resource]/
│   │   ├── route.ts               # Main resource operations
│   │   ├── [id]/
│   │   │   └── route.ts          # Individual resource operations
│   │   └── [action]/
│   │       └── route.ts          # Specific actions (e.g., search, bulk)
│   └── [resource]/
src/app/api/
├── [resource]/                    # Legacy routes (redirect to v1)
```

Examples:
- `src/app/api/v1/professionals/me/route.ts` - Current user's professional profile
- `src/app/api/v1/hr-partners/job-roles/route.ts` - Job roles management
- `src/app/api/v1/introductions/request/route.ts` - Introduction requests

### API Versioning

APIs are versioned using URL path versioning:

- Current version: `v1`
- Version format: `/api/v1/[resource]`
- Legacy routes without version redirect to current version
- Breaking changes require new version
- Deprecation notices provided 6 months before removal

Versioning Strategy:
- **PATCH**: Backward compatible bug fixes
- **MINOR**: Backward compatible new features
- **MAJOR**: Breaking changes (new version)

### Migration Guide

When introducing API versioning or migrating existing endpoints:

1. **Assess Current State**:
   - List all existing API routes under `/api/`
   - Identify dependencies (frontend calls, middleware, external integrations)
   - Document breaking changes if any

2. **Create Versioned Structure**:
   - Create `/api/v1/` directory mirroring current structure
   - Copy existing route files to corresponding v1 paths (e.g., `/api/professionals/me/route.ts` → `/api/v1/professionals/me/route.ts`)
   - Update route paths in JSDoc comments to reflect `/api/v1/...`

3. **Update Middleware**:
   - Modify `src/middleware.ts` to route `/api/v1/*` to versioned handlers
   - For legacy `/api/*` paths, implement 301 redirects to `/api/v1/*` or return deprecation warnings (e.g., 410 Gone after grace period)
   - Example:
     ```typescript
     if (req.nextUrl.pathname.startsWith('/api/') && !req.nextUrl.pathname.startsWith('/api/v1/')) {
       const newPath = req.nextUrl.pathname.replace('/api/', '/api/v1/');
       return NextResponse.redirect(new URL(newPath, req.url));
     }
     ```

4. **Update Frontend and Clients**:
   - Replace all API calls from `/api/` to `/api/v1/`
   - Handle new response wrappers `{ message, data }` in frontend code
   - Update error handling for standardized formats
   - Test all affected components (e.g., dashboard, forms, lists)

5. **Update Documentation**:
   - Add `@swagger` comments with `/api/v1/` paths
   - Update OpenAPI spec in `public/openapi.json`
   - Run `npm run docs:generate` to regenerate docs
   - Document deprecation timeline for old paths (6 months notice)

6. **Testing and Deployment**:
   - Unit test new versioned endpoints
   - Integration test redirects and new paths
   - Load test for performance impact
   - Deploy with feature flags if needed
   - Monitor logs for 301 redirects and errors
   - After migration, remove legacy routes and update middleware

7. **Post-Migration**:
   - Announce completion in changelog
   - Update client SDKs if applicable
   - Archive old route files in a `legacy/` folder
   - Plan for next version if major changes anticipated

### Route Organization

- Use nested routes for hierarchical resources
- Group related operations under logical resource paths
- Keep route files focused on a single responsibility
- Use dynamic segments `[id]` for resource-specific operations

## HTTP Methods and RESTful Conventions

### Standard HTTP Methods

- **GET**: Retrieve resources (safe, idempotent)
- **POST**: Create new resources
- **PUT**: Update entire resources (idempotent)
- **PATCH**: Partial resource updates
- **DELETE**: Remove resources (idempotent)

### Method Usage Guidelines

- Use GET for read operations
- Use POST for creating resources that don't have a predictable URL
- Use PUT for full resource updates when the client knows the resource URL
- Use PATCH for partial updates
- Use DELETE for resource removal

## Authentication and Authorization

### Authentication

All API endpoints must implement authentication using Clerk:

```typescript
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // ... rest of the handler
}
```

### Authorization

- Check user permissions based on their role (professional, hr-partner, admin)
- Validate resource ownership before allowing modifications
- Use database-level constraints for additional security

## Request/Response Formats

### Request Format

- All requests use JSON content type
- Request bodies are parsed using `await request.json()`
- Query parameters for filtering, sorting, and pagination

### Response Format

#### Success Responses

```typescript
// Standardized response helper
export const ApiResponse = {
    success: (data: any, meta?: any) => NextResponse.json({
        success: true,
        data,
        ...(meta && { meta })
    }),
    
    created: (data: any, message = 'Resource created successfully') => NextResponse.json({
        success: true,
        message,
        data
    }, { status: 201 }),
    
    updated: (data?: any, message = 'Resource updated successfully') => NextResponse.json({
        success: true,
        message,
        ...(data && { data })
    }),
    
    deleted: (message = 'Resource deleted successfully') => NextResponse.json({
        success: true,
        message
    }),
    
    error: (message: string, status = 500, details?: any) => NextResponse.json({
        success: false,
        error: message,
        ...(details && { details })
    }, { status })
};

// Usage examples
return ApiResponse.success(professionals, { total: count, page, limit });
return ApiResponse.created(newUser);
return ApiResponse.error('User not found', 404);
```

#### Error Responses

```typescript
return NextResponse.json({
    error: 'Error message'
}, { status: appropriateStatusCode });
```

## Error Handling

### Standard Error Codes

- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict (e.g., duplicate creation)
- **422 Unprocessable Entity**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server errors

### Error Handling Pattern

```typescript
// Enhanced error handling with proper logging
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // ... operation logic
        
    } catch (error) {
        // Log error with context
        console.error('API Error:', {
            endpoint: request.url,
            method: request.method,
            userId: userId || 'anonymous',
            error: error.message,
            stack: error.stack
        });

        // Handle specific error types
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            }, { status: 422 });
        }

        if (error.code === 'P2002') { // Prisma unique constraint
            return NextResponse.json({
                error: 'Resource already exists'
            }, { status: 409 });
        }

        // Generic server error
        return NextResponse.json({
            error: 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && { details: error.message })
        }, { status: 500 });
    }
}
```

## Validation

### Schema Validation

Use Zod schemas for request validation:

```typescript
import { z } from 'zod';

const createProfessionalSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    // ... other fields
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validatedData = createProfessionalSchema.parse(body);
    // ... use validatedData
}
```

### Validation Rules

- Validate all required fields
- Sanitize input data
- Check data types and formats
- Validate business rules (e.g., date ranges, enum values)
- Return detailed validation errors

## Database Operations

### Prisma Usage

- Use Prisma Client for all database operations
- Include related data using `include` option
- Use transactions for multi-step operations
- Implement proper error handling for database constraints

```typescript
const professional = await prisma.professional.findUnique({
    where: { userId },
    include: {
        skills: true,
        workHistory: {
            orderBy: { startDate: 'desc' }
        }
    }
});
```

### Query Optimization

- Use `select` to limit returned fields
- Implement pagination for large datasets
- Use appropriate indexes (defined in schema.prisma)
- Avoid N+1 queries with proper includes

## Pagination and Filtering

### Pagination

Implement cursor-based or offset-based pagination:

```typescript
// Offset-based
const { page = 1, limit = 10 } = request.nextUrl.searchParams;
const skip = (page - 1) * limit;

const professionals = await prisma.professional.findMany({
    skip,
    take: limit,
    // ... other options
});

return NextResponse.json({
    data: professionals,
    meta: {
        page,
        limit,
        total: await prisma.professional.count()
    }
});
```

### Filtering

Support query parameters for filtering:

```typescript
const { industry, location, minSalary } = request.nextUrl.searchParams;

const where = {
    ...(industry && { currentIndustry: industry }),
    ...(location && { locationCity: location }),
    ...(minSalary && { salaryExpectationMin: { gte: parseInt(minSalary) } })
};

const professionals = await prisma.professional.findMany({ where });
```

## Rate Limiting

### Implementation

- Implement rate limiting using middleware or external services
- Define limits based on endpoint sensitivity
- Return 429 status with retry-after header

### Limits

- Public endpoints: 100 requests per minute
- Authenticated endpoints: 1000 requests per minute
- Sensitive operations: 10 requests per minute

## Security

### Input Sanitization

- Validate and sanitize all user inputs
- Use parameterized queries (handled by Prisma)
- Escape output data

### Data Protection

- Never expose sensitive data in responses
- Use appropriate data types for sensitive fields
- Implement proper access controls

### HTTPS

- All API endpoints must use HTTPS in production
- Implement secure headers (CSP, HSTS, etc.)

## Documentation

### OpenAPI Specification

All endpoints must include OpenAPI annotations:

```typescript
/**
 * @swagger
 * /api/professionals:
 *   get:
 *     summary: Get professionals
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of professionals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Professional'
 */
export async function GET() {
    // ... implementation
}
```

### Documentation Requirements

- Describe all endpoints with summary and description
- Document request/response schemas
- Include authentication requirements
- Document error responses
- Update documentation with code changes

### Documentation Generation

API documentation is automatically generated using OpenAPI 3.0 specifications:

1. **Annotations**: Use JSDoc comments with OpenAPI tags in route files
2. **Build Process**: Documentation generated during build via `next-swagger-doc`
3. **Access**: Available at `/api/docs` in development and staging
4. **Export**: JSON spec available at `/api/docs/swagger.json`

Example annotation:

```typescript
/**
 * @swagger
 * /api/v1/professionals:
 *   get:
 *     summary: Get professionals
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of professionals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Professional'
 */
```

### Setting Up Documentation

1. Install dependencies:
```bash
npm install next-swagger-doc swagger-ui-react
```

import path from 'path';
import { createSwaggerSpec } from 'next-swagger-doc';

const apiDirectory = path.join(process.cwd(), 'src/app/api');
const spec = createSwaggerSpec({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'The Nexus API',
      version: '1.0.0',
      description: 'API for The Nexus platform',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apiFolder: apiDirectory,
});

export default spec;

3. Create docs page at `src/app/api/docs/route.ts`

## Testing

### Unit Tests

- Test individual functions and utilities
- Mock external dependencies (database, auth)
- Test error conditions

### Integration Tests

- Test complete API workflows
- Use test database
- Verify authentication and authorization

### Test Structure

```
src/__tests__/
├── api/
│   ├── professionals.test.ts
│   └── hr-partners.test.ts
└── lib/
    └── validations.test.ts
```

## Naming Conventions

### Files and Directories

- Use kebab-case for directories: `job-roles`, `hr-partners`
- Use camelCase for file names: `route.ts`, `utils.ts`
- Use descriptive names that reflect functionality

### Variables and Functions

- Use camelCase for variables and functions
- Use PascalCase for types and interfaces
- Use UPPER_SNAKE_CASE for constants

### API Endpoints

- Use plural nouns for resource names: `/professionals`, `/companies`
- Use lowercase with hyphens: `/job-roles`, `/hr-partners`
- Use nested paths for relationships: `/professionals/{id}/skills`

## Performance Considerations

### Optimization Techniques

- Implement caching where appropriate
- Use database indexes effectively
- Minimize database queries
- Compress responses
- Implement lazy loading for large datasets

### Monitoring

- Log performance metrics
- Monitor response times
- Track error rates
- Set up alerts for performance degradation

---

This document will be updated as the platform evolves. All developers must adhere to these standards to ensure API consistency and maintainability.
