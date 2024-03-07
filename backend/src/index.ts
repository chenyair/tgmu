import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import initDB from './db';

dotenv.config();

(async () => {
  await initDB();

  const app: Application = express();

  const port = process.env.PORT || 8000;

  app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to The Ger Movie Universe API');
  });

  app.listen(port, () => {
    console.log(`The Ger Movie Universe API is running on port ${port}`);
  });
})();
