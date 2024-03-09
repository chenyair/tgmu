import { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import createLogger from './utils/logger';
import initApp from 'app';
import http from 'http';
import https from 'https';
import fs from 'fs';

const logger = createLogger('Express');
const ENV = process.env.NODE_ENV!;

initApp().then((app: Express) => {
  logger.debug(`Running in ${ENV}`);

  const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'TGMU Backend API',
        version: '1.0.0',
        description: 'TGMU REST API for serving any app related requests including JWT authentication',
      },
      servers: [{ url: 'http://localhost:3000' }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/routes/*.ts'],
  };

  logger.debug('Initializing Swagger...');
  const specs = swaggerJsDoc(swaggerOptions);
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
  logger.debug('Successfully Initialized Swagger at /docs');

  const port = process.env.PORT;
  if (ENV !== 'production') {
    http.createServer(app).listen(port || 8000);
  } else {
    const httpsConf = {
      key: fs.readFileSync('../client-key.pem'),
      cert: fs.readFileSync('../client-cert.pem'),
    };
    https.createServer(httpsConf, app).listen(port || 443);
  }
  logger.debug(`The Ger Movie Universe API is running on port ${port}`);
});
