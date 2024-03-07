import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import createLogger from './utils/logger';

const logger = createLogger('Express');

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

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
      securitySchemas: {
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

const specs = swaggerJsDoc(swaggerOptions);

logger.debug('Initializing Swagger...');
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
logger.debug('Successfully Initialized Swagger at /docs');
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to The Ger Movie Universe API');
});

app.listen(port, () => {
  logger.debug(`The Ger Movie Universe API is running on port ${port}`);
});
