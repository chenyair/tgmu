import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import cors from 'cors';
import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import createLogger from 'utils/logger';
import initDB from 'db';
import authRoute from 'routes/auth.route';
import userRoute from 'routes/user.route';
import movieRoute from 'routes/movie.route';
import experienceRoute from 'routes/experience.route';
import authMiddleware from 'common/auth.middleware';
import errorMiddleware from 'common/error.middleware';
import 'express-async-errors';

const logger = createLogger('Express');

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
      servers: [{ url: 'http://localhost:8000' }],
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

  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to The Ger Movie Universe API');
  });

  app.use('/auth', authRoute);

  app.use('/public', express.static('public'));

  app.use(authMiddleware);
  app.use('/users', userRoute);
  app.use('/movies', movieRoute);
  app.use('/experiences', authMiddleware, experienceRoute);

  app.use(errorMiddleware);

  logger.debug('calling init DB');
  await initDB();

  return app;
};

export default initApp;
