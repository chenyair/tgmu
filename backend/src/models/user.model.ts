import mongoose from 'mongoose';
import { validateAlphabet } from 'utils/validator';
import { IUser, IUserDetails } from 'shared-types';

export const getUserDetails = ({ _id, email, firstName, lastName, birthdate, imgUrl }: IUser): IUserDetails => ({
  _id,
  email,
  firstName,
  lastName,
  birthdate,
  imgUrl,
});

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    validate: validateAlphabet,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    validate: validateAlphabet,
  },
  birthdate: {
    type: Date,
    required: true,
    min: 0,
  },
  imgUrl: {
    type: String,
    required: false,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUser>('User', userSchema);
