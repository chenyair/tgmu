import bodyParser from 'body-parser';
import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import createLogger from './utils/logger';
import initDB from 'db';
import authRoute from 'routes/auth.route';
import userRoute from 'routes/user.route';
import movieRoute from 'routes/movie.route';
import experienceRoute from 'routes/experience.route';
import authMiddleware from 'common/auth.middleware';

const logger = createLogger('Express');

dotenv.config();

const initApp = async (): Promise<Express> => {
  const app: Express = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to The Ger Movie Universe API');
  });

  app.use('/auth', authRoute);

  app.use(authMiddleware);
  app.use('/users', userRoute);
  app.use('/movies', movieRoute);
  app.use('/experiences', experienceRoute);

  logger.debug('calling init DB');
  await initDB();

  return app;
};

export default initApp;
