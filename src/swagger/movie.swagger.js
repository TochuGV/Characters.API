import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { movieSchema, movieQuerySchema } from '../schemas/movie.schema.js';
import { uuidSchema } from '../schemas/uuid.schema.js';

extendZodWithOpenApi(z);

const registerMoviePaths = (registry) => {
  
  registry.registerPath({
    method: 'get',
    path: '/movies',
    tags: ['Movies'],
    summary: 'List all movies',
    description: 'Retrieve a list of movies with pagination and sorting support.',
    request: {
      query: movieQuerySchema
    },
    responses: {
      200: {
        description: 'List of movies',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              data: z.array(movieSchema)
            })
          }
        }
      }
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/movies/{id}',
    tags: ['Movies'],
    summary: 'Get movie details',
    request: {
      params: uuidSchema
    },
    responses: {
      200: {
        description: 'Movie details',
        content: {
          'application/json': {
            schema: movieSchema
          }
        }
      },
      404: { description: 'Movie not found' }
    }
  });

  registry.registerPath({
    method: 'post',
    path: '/movies',
    tags: ['Movies'],
    summary: 'Create a movie',
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          'application/json': {
            schema: movieSchema
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Movie created successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean().openapi({ example: true }),
              data: z.object({
                id: z.string().uuid(),
                title: z.string()
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
    path: '/movies/{id}',
    tags: ['Movies'],
    summary: 'Update a movie',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema,
      body: {
        content: {
          'application/json': {
            schema: movieSchema
          }
        }
      }
    },
    responses: {
      200: { description: 'Movie updated successfully' },
      404: { description: 'Movie not found' }
    }
  });

  registry.registerPath({
    method: 'delete',
    path: '/movies/{id}',
    tags: ['Movies'],
    summary: 'Delete a movie',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema
    },
    responses: {
      200: { description: 'Movie deleted successfully' },
      404: { description: 'Movie not found' }
    }
  });
};

export default registerMoviePaths;