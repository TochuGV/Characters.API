import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import swaggerUi from 'swagger-ui-express';
import registerAuthPaths from '../swagger/auth.swagger.js';
import registerCharacterPaths from '../swagger/character.swagger.js';
import registerMoviePaths from '../swagger/movie.swagger.js';
import registerSystemPaths from '../swagger/system.swagger.js';

export const registry = new OpenAPIRegistry();

registerCharacterPaths(registry);
registerMoviePaths(registry);
registerAuthPaths(registry);
registerSystemPaths(registry);

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: "Enter your Access Token here (without 'Bearer ' prefix)."
});

registry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'refreshToken',
  description: "Refresh Token (HttpOnly Cookie)"
});

const generateSwaggerDocs = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Characters.API',
      version: '1.0.0',
      description: 'API Documentation automatically generated from Zod Schemas 🚀',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local Server' }
    ],
  });
};

const swaggerDocs = generateSwaggerDocs();

export default [swaggerUi.serve, swaggerUi.setup(swaggerDocs)];