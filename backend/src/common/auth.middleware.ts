import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IUserDetails } from 'shared-types';
import createLogger from 'utils/logger';

const logger = createLogger('auth middleware');

export interface AuthRequest extends Request {
  user?: IUserDetails;
}

const { JWT_SECRET } = process.env as Record<string, string>;

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (/\/docs.*/.test(req.originalUrl)) return next();

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
