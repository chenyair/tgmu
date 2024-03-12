import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import createLogger from 'utils/logger';

const logger = createLogger('error middleware');

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ errors: [{ message: 'Something went wrong' }] });

  return next();
};

export default errorMiddleware;
