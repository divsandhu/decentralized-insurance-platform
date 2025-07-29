const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Decentralized Insurance Platform API',
            version: '1.0.0',
            description: 'A comprehensive API for managing decentralized insurance policies and claims on the blockchain',
            contact: {
                name: 'API Support',
                email: 'support@decentralized-insurance.com',
                url: 'https://decentralized-insurance.com/support'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production' 
                    ? 'https://api.decentralized-insurance.com'
                    : `http://localhost:${process.env.PORT || 5000}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                apiKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64a7b8c9d1e2f3a4b5c6d7e8' },
                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                        profile: {
                            type: 'object',
                            properties: {
                                firstName: { type: 'string', example: 'John' },
                                lastName: { type: 'string', example: 'Doe' },
                                phone: { type: 'string', example: '+1234567890' }
                            }
                        },
                        walletAddress: { type: 'string', example: '0x742d35Cc6636C0532925a3b8D0C6964b5c2b5C8D' },
                        role: { type: 'string', enum: ['user', 'adjuster', 'admin', 'super_admin'], example: 'user' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Policy: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64a7b8c9d1e2f3a4b5c6d7e8' },
                        blockchainId: { type: 'number', example: 1 },
                        holder: { type: 'string', example: '0x742d35Cc6636C0532925a3b8D0C6964b5c2b5C8D' },
                        policyType: { type: 'string', enum: ['Life', 'Health', 'Auto', 'Property', 'Travel'], example: 'Auto' },
                        premium: { type: 'string', example: '1000000000000000000' },
                        coverage: { type: 'string', example: '10000000000000000000000' },
                        startDate: { type: 'string', format: 'date-time' },
                        endDate: { type: 'string', format: 'date-time' },
                        status: { type: 'string', enum: ['Active', 'Expired', 'Cancelled', 'Suspended'], example: 'Active' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Claim: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64a7b8c9d1e2f3a4b5c6d7e8' },
                        blockchainId: { type: 'number', example: 1 },
                        policyId: { type: 'number', example: 1 },
                        claimant: { type: 'string', example: '0x742d35Cc6636C0532925a3b8D0C6964b5c2b5C8D' },
                        amount: { type: 'string', example: '5000000000000000000000' },
                        description: { type: 'string', example: 'Car accident on highway' },
                        status: { type: 'string', enum: ['Pending', 'UnderReview', 'Approved', 'Rejected', 'Paid'], example: 'Pending' },
                        filedDate: { type: 'string', format: 'date-time' },
                        processedDate: { type: 'string', format: 'date-time' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error message' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operation successful' },
                        data: { type: 'object' }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Authentication information is missing or invalid',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'Insufficient permissions',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                NotFoundError: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                ValidationError: {
                    description: 'Invalid input data',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                },
                ServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Error' }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication and authorization'
            },
            {
                name: 'Users',
                description: 'User management operations'
            },
            {
                name: 'Policies',
                description: 'Insurance policy management'
            },
            {
                name: 'Claims',
                description: 'Insurance claim management'
            },
            {
                name: 'Blockchain',
                description: 'Blockchain integration operations'
            },
            {
                name: 'Admin',
                description: 'Administrative operations'
            },
            {
                name: 'Analytics',
                description: 'Analytics and reporting'
            }
        ]
    },
    apis: [
        './routes/*.js',
        './middleware/*.js',
        './models/*.js'
    ]
};

const specs = swaggerJsdoc(options);

const swaggerSetup = (app) => {
    // Swagger UI options
    const swaggerOptions = {
        explorer: true,
        customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .info .title { color: #2563eb }
        `,
        customSiteTitle: 'Decentralized Insurance API Documentation',
        customfavIcon: '/favicon.ico'
    };

    // Serve Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
    
    // Serve raw OpenAPI specification
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(specs);
    });
    
    console.log(`📚 API Documentation available at: http://localhost:${process.env.PORT || 5000}/api-docs`);
};

module.exports = swaggerSetup;