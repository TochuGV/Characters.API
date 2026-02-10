import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { movieSchema, movieQuerySchema } from '../schemas/movie.schema.js';
import { uuidSchema } from '../schemas/uuid.schema.js';

extendZodWithOpenApi(z);

const registerMoviePaths = (registry) => {
  
  // GET /movies
  registry.registerPath({
    method: 'get',
    path: '/movies',
    tags: ['Movies'],
    summary: 'Get all movies',
    description: 'Get all movies. Supports filtering by: title, order, page, limit',
    security: [{ bearerAuth: [] }],
    request: {
      query: movieQuerySchema
    },
    responses: {
      200: {
        description: 'List of movies retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                movies: z.array(
                  z.object({
                    id: z.string().uuid().openapi({ example: '175EFD93-F3EC-EF11-90CE-D45D64461B62' }),
                    image: z.string().url().openapi({ example: 'https://ejemplo.com/toystory.jpg' }),
                    title: z.string().openapi({ example: 'Toy Story' }),
                    creationDate: z.string().datetime().openapi({ example: '1995-11-22T00:00:00.000Z' })
                  })
                ).openapi({
                  description: 'Array of movie summaries (only id, image, title, creationDate)'
                }),
                pagination: z.object({
                  total: z.number().int().openapi({ example: 42 }),
                  currentPage: z.number().int().openapi({ example: 1 }),
                  totalPages: z.number().int().openapi({ example: 5 }),
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
                  { field: 'order', message: 'Must be ASC or DESC' }
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

  // POST /movies
  registry.registerPath({
    method: 'post',
    path: '/movies',
    tags: ['Movies'],
    summary: 'Create a new movie',
    description: 'Create a new movie. Supports Idempotency',
    security: [{ bearerAuth: [] }],
    request: {
      headers: z.object({
        'Idempotency-Key': z.string().optional().openapi({
          description: 'Optional unique key to ensure idempotent creation (cached for 24 hours)',
          example: 'movie-create-67890'
        })
      }),
      body: {
        content: {
          'application/json': {
            schema: movieSchema,
            example: {
              title: 'Lilo & Stitch',
              image: 'https://ejemplo.com/lilostitch.jpg',
              creationDate: '2002-06-21',
              rating: 5
            }
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Movie created successfully',
        headers: {
          Location: {
            description: 'URI of the created movie',
            schema: {
              type: 'string',
              example: '/movies/175EFD93-F3EC-EF11-90CE-D45D64461B62'
            }
          }
        },
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                id: z.string().uuid().openapi({ example: '175EFD93-F3EC-EF11-90CE-D45D64461B62' }),
                image: z.string().url().openapi({ example: 'https://ejemplo.com/lilostitch.jpg' }),
                title: z.string().openapi({ example: 'Lilo & Stitch' }),
                creationDate: z.string().datetime().openapi({ example: '2002-06-21T00:00:00.000Z' }),
                rating: z.number().int().optional().openapi({ example: 5 })
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
                  { field: 'title', message: 'Movie title is required' },
                  { field: 'rating', message: 'Must be between 1 and 5' }
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

  // GET /movies/:id
  registry.registerPath({
    method: 'get',
    path: '/movies/{id}',
    tags: ['Movies'],
    summary: 'Get movie by ID',
    description: 'Get movie by ID',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema
    },
    responses: {
      200: {
        description: 'Movie details retrieved successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                id: z.string().uuid().openapi({ example: '175EFD93-F3EC-EF11-90CE-D45D64461B62' }),
                image: z.string().url().openapi({ example: 'https://ejemplo.com/toystory.jpg' }),
                title: z.string().openapi({ example: 'Toy Story' }),
                creationDate: z.string().datetime().openapi({ example: '1995-11-22T00:00:00.000Z' }),
                rating: z.number().int().optional().openapi({ example: 5 }),
                characters: z.array(
                  z.object({
                    id: z.string().uuid().openapi({ example: '0F5EFD93-F3EC-EF11-90CE-D45D64461B62' }),
                    name: z.string().openapi({ example: 'Woody' }),
                    image: z.string().url().openapi({ example: 'https://ejemplo.com/woody.jpg' })
                  })
                ).openapi({
                  description: 'Characters appearing in this movie'
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
        description: 'Movie not found',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Movie not found' })
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

  // PUT /movies/:id
  registry.registerPath({
    method: 'put',
    path: '/movies/{id}',
    tags: ['Movies'],
    summary: 'Update an existing movie',
    description: 'Update an existing movie',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema,
      body: {
        content: {
          'application/json': {
            schema: movieSchema,
            example: {
              title: 'Lilo & Stitch',
              image: 'https://ejemplo.com/lilostitch.jpg',
              creationDate: '2002-06-21',
              rating: 4
            }
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Movie updated successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                id: z.string().uuid(),
                image: z.string().url(),
                title: z.string(),
                creationDate: z.string().datetime(),
                rating: z.number().int().optional()
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
        description: 'Movie not found',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Movie not found' })
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

  // DELETE /movies/:id
  registry.registerPath({
    method: 'delete',
    path: '/movies/{id}',
    tags: ['Movies'],
    summary: 'Delete a movie',
    description: 'Delete a movie',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema
    },
    responses: {
      204: {
        description: 'Movie deleted successfully (no content)'
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
        description: 'Movie not found',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Movie not found' })
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

  // POST /movies/:id/characters
  registry.registerPath({
    method: 'post',
    path: '/movies/{id}/characters',
    tags: ['Movies'],
    summary: 'Add character to movie',
    description: 'Associate a character to a movie. Supports Idempotency',
    security: [{ bearerAuth: [] }],
    request: {
      params: uuidSchema,
      headers: z.object({
        'Idempotency-Key': z.string().optional().openapi({
          description: 'Optional unique key to ensure idempotent association (cached for 24 hours)',
          example: 'movie-character-add-123'
        })
      }),
      body: {
        content: {
          'application/json': {
            schema: z.object({
              characterId: z.string().uuid().openapi({
                description: 'ID of the character to associate',
                example: '0F5EFD93-F3EC-EF11-90CE-D45D64461B62'
              })
            }),
            example: {
              characterId: '0F5EFD93-F3EC-EF11-90CE-D45D64461B62'
            }
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Character added to movie successfully - Returns complete movie with all characters',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                id: z.string().uuid().openapi({ example: '175EFD93-F3EC-EF11-90CE-D45D64461B62' }),
                image: z.string().url().openapi({ example: 'https://ejemplo.com/toystory.jpg' }),
                title: z.string().openapi({ example: 'Toy Story' }),
                creationDate: z.string().datetime().openapi({ example: '1995-11-22T00:00:00.000Z' }),
                rating: z.number().int().optional().openapi({ example: 5 }),
                characters: z.array(
                  z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    image: z.string().url()
                  })
                ).openapi({
                  description: 'All characters in this movie (including the newly added one)'
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
      404: {
        description: 'Movie or Character not found',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Foreign key constraint failed: Related record not found' })
            })
          }
        }
      },
      409: {
        description: 'Conflict - Character already associated with this movie',
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

  // DELETE /movies/:id/characters/:characterId
  registry.registerPath({
    method: 'delete',
    path: '/movies/{id}/characters/{characterId}',
    tags: ['Movies'],
    summary: 'Remove character from movie',
    description: 'Remove a character from a movie',
    security: [{ bearerAuth: [] }],
    request: {
      params: z.object({
        id: z.string().uuid().openapi({
          description: 'Movie ID',
          example: '175EFD93-F3EC-EF11-90CE-D45D64461B62'
        }),
        characterId: z.string().uuid().openapi({
          description: 'Character ID',
          example: '0F5EFD93-F3EC-EF11-90CE-D45D64461B62'
        })
      })
    },
    responses: {
      200: {
        description: 'Character removed from movie successfully - Returns complete movie with remaining characters',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                id: z.string().uuid(),
                image: z.string().url(),
                title: z.string(),
                creationDate: z.string().datetime(),
                rating: z.number().int().optional(),
                characters: z.array(
                  z.object({
                    id: z.string().uuid(),
                    name: z.string(),
                    image: z.string().url()
                  })
                ).openapi({
                  description: 'Remaining characters in this movie'
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
      404: {
        description: 'Movie, Character, or association not found',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('fail'),
              message: z.string().openapi({ example: 'Record not found to perform the operation' })
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

export default registerMoviePaths;