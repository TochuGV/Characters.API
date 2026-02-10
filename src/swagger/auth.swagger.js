import { loginSchema, registerSchema } from '../schemas/user.schema.js';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const registerAuthPaths = (registry) => {
  registry.registerPath({
    method: 'post',
    path: '/auth/register',
    tags: ['Auth'],
    summary: 'Register new user',
    request: {
      body: {
        content: {
          'application/json': {
            schema: registerSchema
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
              message: z.string().openapi({ example: 'User created successfully' }),
              data: z.object({
                id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
                email: z.string().email().openapi({ example: 'user@example.com' })
              })
            })
          }
        }
      },
      409: { description: 'Email already exists' }
    }
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: ['Auth'],
    summary: 'Login user',
    request: {
      body: {
        content: {
          'application/json': {
            schema: loginSchema
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Login successful',
        headers: {
          'Set-Cookie': {
            description: 'HttpOnly Cookie containing the Refresh Token',
            schema: { type: 'string', example: 'refresh_token=abc123...; HttpOnly; Path=/;' }
          }
        },
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Login successful' }),
              data: z.object({
                token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1Ni...' })
              })
            })
          }
        }
      },
      401: { description: 'Invalid credentials' }
    }
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/refresh',
    tags: ['Auth'],
    summary: 'Refresh Access Token',
    description: 'Uses the HttpOnly Cookie to obtain a new Access Token.',
    responses: {
      200: {
        description: 'Token refreshed successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              data: z.object({
                token: z.string().openapi({ example: 'eyJhbGciOiJIUz...' })
              })
            })
          }
        }
      },
      401: { description: 'Invalid or missing Refresh Token' }
    }
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/logout',
    tags: ['Auth'],
    summary: 'Logout user',
    description: 'Invalidates the session and clears the Refresh Token cookie.',
    responses: {
      200: {
        description: 'Logout successful',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              message: z.string().openapi({ example: 'Logged out successfully' })
            })
          }
        }
      }
    }
  });
};

export default registerAuthPaths;