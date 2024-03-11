import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IUserDetails } from 'shared-types';
import createLogger from 'utils/logger';

const logger = createLogger('auth middleware');

export interface AuthResquest extends Request {
  user?: IUserDetails;
}

const { JWT_SECRET } = process.env as Record<string, string>;

const authMiddleware = (req: AuthResquest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(httpStatus.UNAUTHORIZED).send('No token provided');

  try {
    const user = <IUserDetails>jwt.verify(token, JWT_SECRET);
    req.user = user;
    return next();
  } catch (err) {
    logger.error(err);
    return res.status(httpStatus.UNAUTHORIZED).send((err as Error).message);
  }
};

export default authMiddleware;
