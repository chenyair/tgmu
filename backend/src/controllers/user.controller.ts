import UserModel from 'models/user.model';
import { IUser } from 'shared-types';
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
      res.status(httpStatus.UNAUTHORIZED).send('Unauthorized to perform actions on other user');
    } else {
      super.putById(req, res);
    }
  }

  async deleteById(req: AuthRequest, res: Response) {
    if (req.params.id !== req.user?._id) {
      res.status(httpStatus.UNAUTHORIZED).send('Unauthorized to perform actions on other user');
    } else {
      super.deleteById(req, res);
    }
  }
}

export default new UserController();
