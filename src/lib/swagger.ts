import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'theNexus API',
      version: '1.0.0',
      description: 'Nigeria\'s Premier Senior Professional Network API',
      contact: {
        name: 'theNexus Support',
        email: 'support@jointhenexus.ng',
        url: 'https://jointhenexus.ng'
      },
      license: {
        name: 'Private',
        url: 'https://jointhenexus.ng/terms'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'API server'
      },
      {
        url: 'https://jointhenexus.ng',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Clerk JWT token'
        }
      },
      schemas: {
        ApiSuccess: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            message: {
              type: 'string',
              description: 'Success message (optional)'
            }
          }
        },
        ApiError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'object'
              },
              description: 'Detailed error information (optional)'
            }
          }
        },
        Professional: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            profileHeadline: { type: 'string' },
            currentTitle: { type: 'string' },
            currentCompany: { type: 'string' },
            currentIndustry: { type: 'string' },
            yearsOfExperience: { type: 'number' },
            locationCity: { type: 'string' },
            locationState: { type: 'string' },
            salaryExpectationMin: { type: 'number' },
            salaryExpectationMax: { type: 'number' },
            skills: {
              type: 'array',
              items: { type: 'string' }
            },
            isVerified: { type: 'boolean' },
            profileCompleteness: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        JobRole: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            companyId: { type: 'string' },
            createdByHrId: { type: 'string' },
            roleTitle: { type: 'string' },
            roleDescription: { type: 'string' },
            responsibilities: { type: 'string' },
            requirements: { type: 'string' },
            preferredQualifications: { type: 'string' },
            seniorityLevel: {
              type: 'string',
              enum: ['DIRECTOR', 'VP', 'C_SUITE', 'EXECUTIVE']
            },
            industry: { type: 'string' },
            department: { type: 'string' },
            locationCity: { type: 'string' },
            locationState: { type: 'string' },
            remoteOption: {
              type: 'string',
              enum: ['ON_SITE', 'HYBRID', 'REMOTE']
            },
            employmentType: {
              type: 'string',
              enum: ['FULL_TIME', 'CONTRACT', 'CONSULTING']
            },
            salaryRangeMin: { type: 'number' },
            salaryRangeMax: { type: 'number' },
            benefits: { type: 'string' },
            yearsExperienceMin: { type: 'number' },
            yearsExperienceMax: { type: 'number' },
            requiredSkills: {
              type: 'array',
              items: { type: 'string' }
            },
            preferredSkills: {
              type: 'array',
              items: { type: 'string' }
            },
            isConfidential: { type: 'boolean' },
            confidentialReason: { type: 'string' },
            status: {
              type: 'string',
              enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'FILLED', 'CLOSED']
            },
            applicationDeadline: { type: 'string', format: 'date' },
            expectedStartDate: { type: 'string', format: 'date' },
            introductionCount: { type: 'number' },
            viewCount: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            publishedAt: { type: 'string', format: 'date-time' },
            closedAt: { type: 'string', format: 'date-time' }
          }
        },
        IntroductionRequest: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            jobRoleId: { type: 'string' },
            companyId: { type: 'string' },
            sentByHrId: { type: 'string' },
            sentToProfessionalId: { type: 'string' },
            status: {
              type: 'string',
              enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED']
            },
            message: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' },
            respondedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'Professionals',
        description: 'Professional profile management'
      },
      {
        name: 'HR Partners',
        description: 'HR partner and company management'
      },
      {
        name: 'Job Roles',
        description: 'Job role creation and management'
      },
      {
        name: 'Introductions',
        description: 'Introduction request workflow'
      },
      {
        name: 'Dual Role',
        description: 'Dual-role privacy management'
      },
      {
        name: 'Utilities',
        description: 'Utility endpoints (states, cities, etc.)'
      }
    ]
  },
  apis: [
    './src/app/api/v1/**/*.ts',
    './src/app/api/v1/**/**/*.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(options);
