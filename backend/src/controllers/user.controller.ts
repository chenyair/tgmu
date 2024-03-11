import UserModel from 'models/user.model';
import bcrypt from 'bcrypt';
import { IUser, IUserUpdatePayload } from 'shared-types';
import { BaseController } from './base.controller';
import { Response } from 'express';
import { AuthRequest } from 'common/auth.middleware';
import httpStatus from 'http-status';

class UserController extends BaseController<IUser> {
  constructor() {
    super(UserModel);
  }

  async putById(req: AuthRequest, res: Response) {
    if (req.params.id !== req.user?._id) {
      return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized to perform actions on other user');
    }
    const body = req.body as IUserUpdatePayload;

    // Check for password change
    if (body.changePassword?.currentPassword && body.changePassword?.newPassword) {
      const userDB = await UserModel.findById(req.user._id).select('+password');
      if (userDB === null) {
        return res.status(httpStatus.UNAUTHORIZED).send('invalid credentials');
      }

      const match = await bcrypt.compare(body.changePassword.currentPassword, userDB!.password || '');
      if (!match) {
        return res.status(httpStatus.UNAUTHORIZED).send('invalid credentials');
      }

      req.body.password = body.changePassword.newPassword;
    }

    if (body.image?.file) {
      // TODO: Save image to disk. add express static file serving
      // TODO: set imageUrl to the static file path
    }
    return super.putById(req, res);
  }

  async deleteById(req: AuthRequest, res: Response) {
    if (req.params.id !== req.user?._id) {
      return res.status(httpStatus.UNAUTHORIZED).send('Unauthorized to perform actions on other user');
    }

    return super.deleteById(req, res);
  }
}

export default new UserController();
