import UserModel from 'models/user.model';
import { IUser } from 'shared-types';
import { BaseController } from './base.controller';

const UserController = new BaseController<IUser>(UserModel);

export default UserController;
