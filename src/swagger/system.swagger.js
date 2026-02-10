import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const registerSystemPaths = (registry) => {
  
  registry.registerPath({
    method: 'get',
    path: '/health',
    tags: ['System'],
    summary: 'API Health Check',
    description: 'Checks the status of the API and its dependencies (Database, Redis).',
    responses: {
      200: {
        description: 'System is healthy',
        content: {
          'application/json': {
            schema: z.object({
              status: z.string().openapi({ example: 'UP' }),
              timestamp: z.string().datetime(),
              services: z.object({
                database: z.object({
                  status: z.string().openapi({ example: 'UP' }),
                  responseTime: z.string().openapi({ example: '12ms' })
                }),
                redis: z.object({
                  status: z.string().openapi({ example: 'UP' })
                })
              })
            })
          }
        }
      },
      503: { description: 'System is degraded or down' }
    }
  });

  registry.registerPath({
    method: 'get',
    path: '/metrics',
    tags: ['System'],
    summary: 'Custom System Metrics',
    description: 'Exposes technical metrics like uptime, memory usage, and request counts.',
    responses: {
      200: {
        description: 'Current system metrics',
        content: {
          'application/json': {
            schema: z.object({
              uptime: z.number().openapi({ example: 3600.5 }),
              memory: z.object({
                rss: z.number(),
                heapTotal: z.number(),
                heapUsed: z.number()
              }),
              http: z.object({
                totalRequests: z.number(),
                activeConnections: z.number()
              })
            })
          }
        }
      }
    }
  });
};

export default registerSystemPaths;