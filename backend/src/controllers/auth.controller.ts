import { Request, Response } from 'express';
import User, { IUser, IUserDetails, getUserDetails } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import httpStatus from 'http-status';
import { Document } from 'mongoose';
import createLogger from 'utils/logger';

const logger = createLogger('auth controller');

const client = new OAuth2Client();
const { JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID, JWT_SECRET, JWT_EXPIRATION } = process.env as Record<string, string>;

const generateTokens = (user: IUser) => {
  const payload = getUserDetails(user);
  return {
    accessToken: jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION }),
    refreshToken: jwt.sign(payload, JWT_REFRESH_SECRET),
  };
};

const createTokensForUser = async (user: Document & IUser) => {
  logger.debug(`creating tokens for user: ${user._id}`);
  const tokens = generateTokens(user);
  const currTokens = user.refreshTokens ?? [];
  await user.updateOne({
    refreshTokens: [...currTokens, tokens.refreshToken],
  });
  return tokens;
};

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (email === null) {
      return res.status(httpStatus.BAD_REQUEST).send('Invalid credentials or permissions');
    }

    logger.debug(`successful google signing: ${email}`);

    // Attempt to query existing user, otherwise create a new user
    const user =
      (await User.findOne({ email: email })) ??
      (await User.create({
        email: email,
        password: '0',
        imgUrl: payload?.picture,
      }));
    const tokens = await createTokensForUser(user);

    return res.status(200).send({
      _id: user._id,
      ...tokens,
    });
  } catch (err) {
    logger.error(err);
    return res.status(400).send((err as Error).message);
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, age, imgUrl }: IUser = req.body;
  logger.debug(`begin registration for email ${email}`);
  if (!email || !password) {
    return res.status(400).send('missing email or password');
  }
  const exists = await User.exists({ email: email });
  if (exists) {
    return res.status(406).send('a user with this email already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    email,
    firstName,
    lastName,
    age,
    imgUrl,
    password: encryptedPassword,
  });
  const tokens = await createTokensForUser(newUser);
  logger.debug(`successfully created user ${email}`);

  return res.status(201).send({
    _id: newUser._id,
    ...tokens,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  logger.debug(`attempting login with email ${email}`);
  if (!email || !password) {
    return res.status(400).send('missing email or password');
  }
  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(401).send('email or password incorrect');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('email or password incorrect');
    }

    const tokens = await createTokensForUser(user);
    logger.debug(`successfully logged in ${email}`);

    return res.status(200).send(tokens);
  } catch (err) {
    return res.status(400).send('missing email or password');
  }
};

export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (refreshToken == null) return res.sendStatus(401);
  try {
    const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as IUserDetails; // Cast to access _id prop;
    logger.debug(`attempting logout for user ${user._id} token ${refreshToken}`);
    const userDb = (await User.findById(user._id))!; // Assume return value is not null
    if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
      await userDb.updateOne({ refreshTokens: [] });
      return res.sendStatus(401);
    } else {
      await userDb.updateOne({ refreshTokens: userDb.refreshTokens.filter((t) => t !== refreshToken) });
      logger.debug(`successfully logged out user ${user._id} token ${refreshToken}`);
      return res.sendStatus(200);
    }
  } catch (err) {
    logger.error(err);
    return res.sendStatus(401).send((err as Error).message);
  }
};

export const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (refreshToken == null) return res.sendStatus(401);
  try {
    const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as IUserDetails;
    logger.debug(`attempting refresh for user ${user._id} token ${refreshToken}`);
    const userDb = (await User.findById(user._id))!;
    if (!userDb.refreshTokens || !userDb.refreshTokens.includes(refreshToken)) {
      await userDb.updateOne({ refreshTokens: [] });
      return res.sendStatus(401);
    }
    const tokens = generateTokens(userDb);
    await userDb.updateOne({
      refreshTokens: [...userDb.refreshTokens.filter((t) => t !== refreshToken), tokens.refreshToken],
    });
    logger.debug(`successfully refreshed token for user ${userDb._id}`);
    return res.status(200).send(tokens);
  } catch (err) {
    logger.error(err);
    return res.sendStatus(401).send((err as Error).message);
  }
};
