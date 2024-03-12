import { Express } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import createLogger from './utils/logger';
import initApp from 'app';
import http from 'http';
import https from 'https';
import fs from 'fs';

const logger = createLogger('Express');
const { NODE_ENV: ENV, LISTEN_ADDRESS, PORT } = process.env as Record<string, string>;

const SERVER_PROTOCOL = ENV === 'production' ? 'https' : 'http';

export const SERVER_URL = `${SERVER_PROTOCOL}://${LISTEN_ADDRESS}:${PORT}`;

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
      servers: [{ url: SERVER_URL }],
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

  const port = PORT || 8000;
  logger.debug(`The Ger Movie Universe API is running on ${SERVER_URL}`);
  if (ENV !== 'production') {
    http.createServer(app).listen(port);
  } else {
    const httpsConf = {
      key: fs.readFileSync('../client-key.pem'),
      cert: fs.readFileSync('../client-cert.pem'),
    };
    https.createServer(httpsConf, app).listen(port);
  }
});
