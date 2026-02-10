import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const registerSystemPaths = (registry) => {
  
  // GET /health
  registry.registerPath({
    method: 'get',
    path: '/health',
    tags: ['System'],
    summary: 'API Health Check',
    description: 'Check the health status of the API and its dependencies (Database, Cache)',
    responses: {
      200: {
        description: 'System is healthy or degraded (cache down but database up)',
        content: {
          'application/json': {
            schema: z.object({
              status: z.enum(['UP', 'DEGRADED']).openapi({
                description: 'UP: all services healthy. DEGRADED: cache down but database functional',
                example: 'UP'
              }),
              timestamp: z.string().datetime().openapi({
                example: '2026-02-10T18:30:00.000Z'
              }),
              uptime: z.number().int().nonnegative().openapi({
                description: 'Server uptime in seconds',
                example: 3600
              }),
              services: z.object({
                database: z.object({
                  status: z.enum(['UP', 'DOWN']).openapi({ example: 'UP' }),
                  latency: z.string().nullable().openapi({
                    description: 'Response time in milliseconds',
                    example: '12ms'
                  })
                }),
                cache: z.object({
                  status: z.enum(['UP', 'DOWN']).openapi({ example: 'UP' }),
                  latency: z.string().nullable().openapi({
                    description: 'Response time in milliseconds',
                    example: '5ms'
                  }),
                  strategy: z.enum(['Redis', 'Local Memory']).openapi({
                    description: 'Current caching strategy being used',
                    example: 'Redis'
                  })
                })
              })
            })
          }
        }
      },
      503: {
        description: 'System is down - Database unavailable',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('DOWN'),
              timestamp: z.string().datetime(),
              uptime: z.number().int(),
              services: z.object({
                database: z.object({
                  status: z.literal('DOWN'),
                  latency: z.null()
                }),
                cache: z.object({
                  status: z.enum(['UP', 'DOWN']),
                  latency: z.string().nullable(),
                  strategy: z.enum(['Redis', 'Local Memory'])
                })
              })
            })
          }
        }
      }
    }
  });

  // GET /metrics
  registry.registerPath({
    method: 'get',
    path: '/metrics',
    tags: ['System'],
    summary: 'Custom System Metrics',
    description: 'Exposes technical metrics like uptime, memory usage, and HTTP request statistics',
    responses: {
      200: {
        description: 'Current system metrics',
        content: {
          'application/json': {
            schema: z.object({
              status: z.literal('success'),
              data: z.object({
                timestamp: z.string().datetime().openapi({
                  example: '2026-02-10T18:30:00.000Z'
                }),
                uptime: z.number().int().nonnegative().openapi({
                  description: 'Server uptime in seconds',
                  example: 3600
                }),
                process: z.object({
                  memoryUsageMB: z.number().int().nonnegative().openapi({
                    description: 'Total memory used by the process (RSS) in MB',
                    example: 150
                  }),
                  heapUsedMB: z.number().int().nonnegative().openapi({
                    description: 'Heap memory used in MB',
                    example: 80
                  })
                }),
                http: z.object({
                  totalRequests: z.number().int().nonnegative().openapi({
                    description: 'Total HTTP requests since server start',
                    example: 1234
                  }),
                  requestsByMethod: z.record(z.number().int()).openapi({
                    description: 'Breakdown of requests by HTTP method',
                    example: {
                      GET: 800,
                      POST: 250,
                      PUT: 100,
                      DELETE: 84
                    }
                  }),
                  requestsByStatus: z.record(z.number().int()).openapi({
                    description: 'Breakdown of requests by status code range',
                    example: {
                      '2xx': 1000,
                      '4xx': 200,
                      '5xx': 34
                    }
                  }),
                  averageResponseTimeMs: z.number().openapi({
                    description: 'Average response time in milliseconds',
                    example: 45.67
                  })
                })
              })
            })
          }
        }
      }
    }
  });
};

export default registerSystemPaths;