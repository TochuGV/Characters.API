import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { characterSchema, characterQuerySchema } from '../schemas/character.schema.js';
import { uuidSchema } from '../schemas/uuid.schema.js';

extendZodWithOpenApi(z);

const registerCharacterPaths = (registry) => {
  
  registry.registerPath({
    method: 'get',
    path: '/characters',
    tags: ['Characters'],
    summary: 'List all characters',
    description: 'Retrieve a list of characters with pagination support.',
    request: {
      query: characterQuerySchema
    },
    responses: {
      200: {
        description: 'List of characters',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              data: z.array(characterSchema)
            })
          }
        }
      }
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/characters/{id}',
    tags: ['Characters'],
    summary: 'Get character details',
    request: {
      params: uuidSchema
    },
    responses: {
      200: {
        description: 'Character details',
        content: {
          'application/json': {
            schema: characterSchema
          }
        }
      },
      404: { description: 'Character not found' }
    }
  });

  registry.registerPath({
    method: 'post',
    path: '/characters',
    tags: ['Characters'],
    summary: 'Create a character',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: characterSchema
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Character created successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              data: z.object({
                id: z.string().uuid(),
                name: z.string()
              })
            })
          }
        }
      },
      400: { description: 'Validation Error' },
      401: { description: 'Unauthorized' }
    }
  });

  registry.registerPath({
    method: 'put',
    path: '/characters/{id}',
    tags: ['Characters'],
    summary: 'Update a character',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema,
      body: {
        content: {
          'application/json': {
            schema: characterSchema
          }
        }
      }
    },
    responses: {
      200: { description: 'Character updated successfully' },
      404: { description: 'Character not found' }
    }
  });

  registry.registerPath({
    method: 'delete',
    path: '/characters/{id}',
    tags: ['Characters'],
    summary: 'Delete a character',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema
    },
    responses: {
      200: { description: 'Character deleted successfully' },
      404: { description: 'Character not found' }
    }
  });
};

export default registerCharacterPaths;