import { AxiosError } from 'axios';
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { MongooseError } from 'mongoose';
import createLogger from 'utils/logger';

const logger = createLogger('error middleware');

const errorMiddleware = (err: Error & MongooseError & AxiosError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack || err);
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message || 'Something went wrong' });

  return next();
};

export default errorMiddleware;
