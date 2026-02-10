import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { characterSchema, characterQuerySchema } from '../schemas/character.schema.js';
import { uuidSchema } from '../schemas/uuid.schema.js';

extendZodWithOpenApi(z);

const registerCharacterPaths = (registry) => {
  
  // GET /characters
  registry.registerPath({
    method: 'get',
    path: '/characters',
    tags: ['Characters'],
    summary: 'Get all characters',
    description: 'Get all characters. Supports filtering by: name, age, weight, movie, page, limit',
    security: [{ bearerAuth: [] }],
    request: {
      query: characterQuerySchema
    },
    responses: {
      200: {
        description: 'List of characters retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                characters: z.array(
                  z.object({
                    id: z.string().uuid().openapi({ example: '0F5EFD93-F3EC-EF11-90CE-D45D64461B62' }),
                    image: z.string().url().openapi({ example: 'https://ejemplo.com/woody.jpg' }),
                    name: z.string().openapi({ example: 'Woody' })
                  })
                ).openapi({
                  description: 'Array of character summaries (only id, image, name)'
                }),
                pagination: z.object({
                  total: z.number().int().openapi({ example: 33 }),
                  currentPage: z.number().int().openapi({ example: 1 }),
                  totalPages: z.number().int().openapi({ example: 4 }),
                  perPage: z.number().int().openapi({ example: 10 }),
                  hasNextPage: z.boolean().openapi({ example: true }),
                  hasPrevPage: z.boolean().openapi({ example: false }),
                  nextPage: z.number().int().nullable().openapi({ example: 2 }),
                  prevPage: z.number().int().nullable().openapi({ example: null })
                })
              })
            })
          }
        }
      },
      401: {
        description: 'Unauthorized - Invalid or missing authentication token',
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
        description: 'Validation Error - Invalid query parameters',
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
                  { field: 'age', message: 'Must be an integer' },
                  { field: 'page', message: 'Must be greater than 1' }
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

  // POST /characters
  registry.registerPath({
    method: 'post',
    path: '/characters',
    tags: ['Characters'],
    summary: 'Create a new character',
    description: 'Create a new character. Supports Idempotency',
    security: [{ bearerAuth: [] }],
    request: {
      headers: z.object({
        'Idempotency-Key': z.string().optional().openapi({
          description: 'Optional unique key to ensure idempotent creation (cached for 24 hours)',
          example: 'character-create-12345'
        })
      }),
      body: {
        content: {
          'application/json': {
            schema: characterSchema,
            example: {
              name: 'Stitch',
              image: 'https://ejemplo.com/stitch.jpg',
              age: 5,
              weight: 20.0,
              story: "También conocido como Experimento 626, es una criatura genética ilegal creada por Jumba Jookiba para causar caos y destrucción. Tras huir a la Tierra, es adoptado por Lilo, quien le enseña el significado de 'Ohana' (familia)."
            }
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Character created successfully',
        headers: {
          Location: {
            description: 'URI of the created character',
            schema: {
              type: 'string',
              example: '/characters/0F5EFD93-F3EC-EF11-90CE-D45D64461B62'
            }
          }
        },
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                id: z.string().uuid().openapi({ example: '0F5EFD93-F3EC-EF11-90CE-D45D64461B62' }),
                image: z.string().url().openapi({ example: 'https://ejemplo.com/stitch.jpg' }),
                name: z.string().openapi({ example: 'Stitch' }),
                age: z.number().int().optional().openapi({ example: 5 }),
                weight: z.number().optional().openapi({ example: 20.0 }),
                story: z.string().optional().openapi({ 
                  example: "También conocido como Experimento 626..." 
                })
              })
            })
          }
        }
      },
      401: {
        description: 'Unauthorized - Invalid or missing authentication token',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Invalid credentials' })
            })
          }
        }
      },
      403: {
        description: 'Forbidden - Insufficient permissions (ADMIN role required)',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Access denied' })
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
                  { field: 'name', message: 'Character name is required' },
                  { field: 'image', message: 'Invalid URL' }
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

  // GET /characters/:id
  registry.registerPath({
    method: 'get',
    path: '/characters/{id}',
    tags: ['Characters'],
    summary: 'Get character by ID',
    description: 'Get character by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema
    },
    responses: {
      200: {
        description: 'Character details retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                id: z.string().uuid().openapi({ example: '0F5EFD93-F3EC-EF11-90CE-D45D64461B62' }),
                image: z.string().url().openapi({ example: 'https://ejemplo.com/woody.jpg' }),
                name: z.string().openapi({ example: 'Woody' }),
                age: z.number().int().optional().openapi({ example: 50 }),
                weight: z.number().optional().openapi({ example: 0.5 }),
                story: z.string().optional().openapi({ 
                  example: "Sheriff Woody Pride es un vaquero de juguete vintage y el juguete favorito de Andy..." 
                }),
                movies: z.array(
                  z.object({
                    id: z.string().uuid().openapi({ example: '175EFD93-F3EC-EF11-90CE-D45D64461B62' }),
                    title: z.string().openapi({ example: 'Toy Story' }),
                    image: z.string().url().openapi({ example: 'https://ejemplo.com/toystory.jpg' }),
                    creationDate: z.string().datetime().openapi({ example: '1995-11-22T00:00:00.000Z' })
                  })
                ).openapi({
                  description: 'Movies featuring this character'
                })
              })
            })
          }
        }
      },
      401: {
        description: 'Unauthorized - Invalid or missing authentication token',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Invalid credentials' })
            })
          }
        }
      },
      404: {
        description: 'Character not found',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Character not found' })
            })
          }
        }
      },
      422: {
        description: 'Validation Error - Invalid UUID format',
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
                  { field: 'id', message: 'Invalid UUID format' }
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

  // PUT /characters/:id
  registry.registerPath({
    method: 'put',
    path: '/characters/{id}',
    tags: ['Characters'],
    summary: 'Update an existing character',
    description: 'Update an existing character',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema,
      body: {
        content: {
          'application/json': {
            schema: characterSchema,
            example: {
              name: 'Stitch',
              image: 'https://ejemplo.com/stitch.jpg',
              age: 6,
              weight: 20.5,
              story: "También conocido como Experimento 626, es una criatura genética creada por el científico alienígena Jumba Jookiba..."
            }
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Character updated successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                id: z.string().uuid(),
                image: z.string().url(),
                name: z.string(),
                age: z.number().int().optional(),
                weight: z.number().optional(),
                story: z.string().optional()
              })
            })
          }
        }
      },
      401: {
        description: 'Unauthorized - Invalid or missing authentication token',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Invalid credentials' })
            })
          }
        }
      },
      403: {
        description: 'Forbidden - Insufficient permissions (ADMIN role required)',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Access denied' })
            })
          }
        }
      },
      404: {
        description: 'Character not found',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Character not found' })
            })
          }
        }
      },
      422: {
        description: 'Validation Error - Invalid input data or UUID format',
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

  // DELETE /characters/:id
  registry.registerPath({
    method: 'delete',
    path: '/characters/{id}',
    tags: ['Characters'],
    summary: 'Delete a character',
    description: 'Delete a character',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema
    },
    responses: {
      204: {
        description: 'Character deleted successfully (no content)'
      },
      401: {
        description: 'Unauthorized - Invalid or missing authentication token',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Invalid credentials' })
            })
          }
        }
      },
      403: {
        description: 'Forbidden - Insufficient permissions (ADMIN role required)',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Access denied' })
            })
          }
        }
      },
      404: {
        description: 'Character not found',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Character not found' })
            })
          }
        }
      },
      422: {
        description: 'Validation Error - Invalid UUID format',
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
};

export default registerCharacterPaths;