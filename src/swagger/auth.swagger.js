import { loginSchema, registerSchema } from '../schemas/user.schema.js';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const registerAuthPaths = (registry) => {
  
  // POST /auth/register
  registry.registerPath({
    method: 'post',
    path: '/auth/register',
    tags: ['Auth'],
    summary: 'Register a new user',
    description: 'Register a new user account',
    request: {
      body: {
        content: {
          'application/json': {
            schema: registerSchema,
            example: {
              name: 'John Doe',
              email: 'user@example.com',
              password: '123456'
            }
          }
        }
      }
    },
    responses: {
      201: {
        description: 'User created successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                message: z.string().openapi({ example: 'User created successfully' }),
                user: z.object({
                  id: z.string().uuid().openapi({ example: '6BEDDBE1-F127-4DCF-BC3C-60076B656F15' }),
                  email: z.string().email().openapi({ example: 'user@example.com' }),
                  name: z.string().openapi({ example: 'John Doe' }),
                  role: z.enum(['USER', 'ADMIN']).openapi({ example: 'USER' })
                })
              })
            })
          }
        }
      },
      409: {
        description: 'Conflict - Email already exists',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Unique constraint violation: Data already exists' })
            })
          }
        }
      },
      422: {
        description: 'Validation Error - Invalid input data',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Invalid input data' }),
              details: z.array(z.object({
                field: z.string(),
                message: z.string()
              })).openapi({
                example: [
                  { field: 'email', message: 'Invalid email address' },
                  { field: 'password', message: 'Must be 6 or more characters long' }
                ]
              })
            })
          }
        }
      },
      503: {
        description: 'Database Error - Service temporarily unavailable',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('error'),
              message: z.string().openapi({ example: 'Database Error' })
            })
          }
        }
      }
    }
  });

  // POST /auth/login
  registry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: ['Auth'],
    summary: 'Login user',
    description: 'Login an existing user and receive access/refresh tokens',
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginSchema,
            example: {
              email: 'admin@gmail.com',
              password: '123456'
            }
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Login successful',
        headers: {
          'Set-Cookie': {
            description: 'HttpOnly signed cookie containing the refresh token (7 days expiration)',
            schema: { 
              type: 'string', 
              example: 'refreshToken=s%3AeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; Max-Age=604800' 
            }
          }
        },
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                message: z.string().openapi({ example: 'Login successful' }),
                user: z.object({
                  id: z.string().uuid().openapi({ example: '6BEDDBE1-F127-4DCF-BC3C-60076B656F15' }),
                  email: z.string().email().openapi({ example: 'admin@gmail.com' }),
                  name: z.string().openapi({ example: 'Administrador' }),
                  role: z.enum(['USER', 'ADMIN']).openapi({ example: 'ADMIN' })
                }),
                accessToken: z.string().openapi({ 
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZCRUREQkUxLUYxMjctNERDRi1CQzNDLTYwMDc2QjY1NkYxNSIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzM5MjAwMDAwLCJleHAiOjE3MzkyMDM2MDB9.signature' 
                })
              })
            })
          }
        }
      },
      401: {
        description: 'Unauthorized - Invalid credentials',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Invalid credentials' })
            })
          }
        }
      },
      422: {
        description: 'Validation Error - Invalid input data',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Invalid input data' }),
              details: z.array(z.object({
                field: z.string(),
                message: z.string()
              }))
            })
          }
        }
      },
      503: {
        description: 'Database Error - Service temporarily unavailable',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('error'),
              message: z.string().openapi({ example: 'Database Error' })
            })
          }
        }
      }
    }
  });

  // POST /auth/refresh
  registry.registerPath({
    method: 'post',
    path: '/auth/refresh',
    tags: ['Auth'],
    summary: 'Refresh access token',
    description: 'Request a new access token using a valid refresh token cookie',
    responses: {
      200: {
        description: 'Token refreshed successfully',
        headers: {
          'Set-Cookie': {
            description: 'New HttpOnly signed cookie with rotated refresh token',
            schema: { 
              type: 'string', 
              example: 'refreshToken=s%3AnewTokenHere...; Path=/; HttpOnly; Max-Age=604800' 
            }
          }
        },
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                accessToken: z.string().openapi({ 
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.newAccessToken...' 
                })
              })
            })
          }
        }
      },
      401: {
        description: 'Unauthorized - No refresh token provided',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'No refresh token provided' })
            })
          }
        }
      },
      403: {
        description: 'Forbidden - Invalid or expired refresh token, or token reuse detected',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Invalid session or token reuse detected' })
            })
          }
        }
      },
      503: {
        description: 'Database Error - Service temporarily unavailable',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('error'),
              message: z.string().openapi({ example: 'Database Error' })
            })
          }
        }
      }
    }
  });

  // POST /auth/logout
  registry.registerPath({
    method: 'post',
    path: '/auth/logout',
    tags: ['Auth'],
    summary: 'Logout user',
    description: 'Logout the current user revoking refresh token',
    responses: {
      200: {
        description: 'Logout successful',
        headers: {
          'Set-Cookie': {
            description: 'Cleared refresh token cookie',
            schema: { 
              type: 'string', 
              example: 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT' 
            }
          }
        },
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                message: z.string().openapi({ example: 'Logout successful' })
              })
            })
          }
        }
      }
    }
  });
};

export default registerAuthPaths;