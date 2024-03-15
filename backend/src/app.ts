import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import createLogger from './utils/logger';
import initDB from './db';
import authRoute from './routes/auth.route';
import errorMiddleware from './common/error.middleware';
import apiRoute from './routes/api.route';
import 'express-async-errors';

const logger = createLogger('app');

dotenv.config();

const initApp = async (): Promise<Express> => {
  const app: Express = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  const swaggerOptions: swaggerJsDoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'TGMU Backend API',
        version: '1.0.0',
        description: 'TGMU REST API for serving any app related requests including JWT authentication',
      },
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

  app.use('/public', express.static('public'));

  app.use(express.static(`${__dirname}/ui`));

  logger.debug('Initializing Swagger...');
  const specs = swaggerJsDoc(swaggerOptions);
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
  logger.debug('Successfully Initialized Swagger at /docs');

  app.use('/auth', authRoute);

  app.use('/api', apiRoute);

  if (process.env.NODE_ENV === 'production') {
    app.get('*', (_, res) => {
      res.sendFile(`${__dirname}/ui/index.html`);
    });
  }

  app.use(errorMiddleware);

  logger.debug('calling init DB');
  await initDB();

  return app;
};

export default initApp;
