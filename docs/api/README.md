# theNexus API Documentation

## Overview

theNexus API is a RESTful API that powers Nigeria's Premier Senior Professional Network. It provides endpoints for managing professional profiles, job roles, introduction requests, and HR partner operations.

## Base URL

```
Production: https://jointhenexus.ng/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All API endpoints require authentication using Clerk JWT tokens passed as Bearer tokens in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Documentation

Interactive API documentation is available at:
- **Development**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- **Production**: [https://jointhenexus.ng/api/docs](https://jointhenexus.ng/api/docs)

## API Endpoints Overview

### 🔐 Authentication
- Handled by Clerk - JWT tokens required for all endpoints

### 👨‍💼 Professionals
- `GET /api/v1/professionals/me` - Get current professional profile
- `PUT /api/v1/professionals/me` - Update professional profile
- `POST /api/v1/professionals/create` - Create professional profile (onboarding)
- `GET /api/v1/professionals/search` - Search professionals (HR only)
- `POST /api/v1/professionals/upload` - Upload profile photo/resume

### 🏢 HR Partners
- `GET /api/v1/hr-partners/profile` - Get HR partner profile
- `PUT /api/v1/hr-partners/profile` - Update HR partner profile
- `POST /api/v1/hr-partners/create` - Create HR partner profile
- `GET /api/v1/hr-partners/stats` - Get HR partner statistics
- `GET /api/v1/hr-partners/matches` - Get candidate matches

### 💼 Job Roles
- `POST /api/v1/job-roles` - Create new job role
- `GET /api/v1/job-roles` - List company job roles
- `GET /api/v1/job-roles/:id` - Get specific job role
- `PUT /api/v1/job-roles/:id` - Update job role
- `DELETE /api/v1/job-roles/:id` - Delete job role (soft delete)
- `PATCH /api/v1/job-roles/:id/status` - Update job role status

### 🤝 Introduction Requests
- `POST /api/v1/introductions/request` - Send introduction request (HR only)
- `GET /api/v1/introductions/received` - List received introductions (Professional)
- `GET /api/v1/introductions/sent` - List sent introductions (HR only)
- `PUT /api/v1/introductions/:id/accept` - Accept introduction (Professional)
- `PUT /api/v1/introductions/:id/decline` - Decline introduction (Professional)

### 🔄 Dual Role Management
- `POST /api/v1/dual-role/activate` - Activate dual-role mode (HR only)
- `GET /api/v1/dual-role/status` - Get dual-role status
- `POST /api/v1/dual-role/deactivate` - Deactivate dual-role mode
- `GET /api/v1/dual-role/privacy-status` - Get privacy firewall status

### 🌍 Utilities
- `GET /api/v1/states` - List Nigerian states
- `GET /api/v1/states/:id/cities` - List cities in a state
- `GET /api/v1/users` - Get current user info

## Data Models

### Professional Profile
```json
{
  "id": "string",
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "profileHeadline": "string",
  "currentTitle": "string",
  "currentCompany": "string",
  "currentIndustry": "string",
  "yearsOfExperience": "number",
  "locationCity": "string",
  "locationState": "string",
  "salaryExpectationMin": "number",
  "salaryExpectationMax": "number",
  "skills": ["string"],
  "isVerified": "boolean",
  "profileCompleteness": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Job Role
```json
{
  "id": "string",
  "companyId": "string",
  "roleTitle": "string",
  "roleDescription": "string",
  "requirements": "string",
  "seniorityLevel": "DIRECTOR|VP|C_SUITE|EXECUTIVE",
  "industry": "string",
  "locationCity": "string",
  "locationState": "string",
  "remoteOption": "ON_SITE|HYBRID|REMOTE",
  "employmentType": "FULL_TIME|CONTRACT|CONSULTING",
  "salaryRangeMin": "number",
  "salaryRangeMax": "number",
  "requiredSkills": ["string"],
  "preferredSkills": ["string"],
  "status": "DRAFT|ACTIVE|PAUSED|FILLED|CLOSED",
  "isConfidential": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Introduction Request
```json
{
  "id": "string",
  "jobRoleId": "string",
  "companyId": "string",
  "sentByHrId": "string",
  "sentToProfessionalId": "string",
  "status": "PENDING|ACCEPTED|DECLINED|EXPIRED",
  "message": "string",
  "expiresAt": "datetime",
  "respondedAt": "datetime",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Error Response Format

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

## Success Response Format

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Optional success message"
}
```

## Rate Limiting

- **Rate Limit**: 1000 requests per hour per user
- **Headers**: Rate limit info included in response headers
- **Exceeded**: Returns 429 status with retry information

## Privacy & Security

### Privacy Firewall
- HR professionals can job search while employed
- Automatic protection prevents their company from seeing their profile
- Privacy firewall logs maintained for audit trails

### Data Protection
- All data encrypted in transit (HTTPS)
- Sensitive data encrypted at rest
- GDPR compliant data handling
- Regular security audits

## SDKs & Libraries

Currently, we provide REST API endpoints. SDKs for popular languages are planned:

- [ ] JavaScript/TypeScript SDK
- [ ] Python SDK
- [ ] PHP SDK
- [ ] Mobile SDKs (React Native, Flutter)

## Support

- **Email**: api-support@jointhenexus.ng
- **Documentation**: [https://jointhenexus.ng/api/docs](https://jointhenexus.ng/api/docs)
- **Status Page**: [https://status.jointhenexus.ng](https://status.jointhenexus.ng)

## Changelog

### v1.0.0 (Current)
- Initial API release
- Professional profile management
- HR partner operations
- Job role posting and management
- Introduction request workflow
- Dual-role privacy system
- Authentication via Clerk
- Comprehensive Swagger documentation

---

**© 2024 theNexus - Nigeria's Premier Senior Professional Network**
