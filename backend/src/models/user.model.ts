import mongoose from 'mongoose';
import { validateAlphabet } from 'utils/validator';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  age: number;
  imgUrl?: string;
  refreshTokens?: string[];
}
export type IUserDetails = Pick<IUser, '_id' | 'age' | 'email' | 'firstName' | 'lastName'>;

export const getUserDetails = ({ _id, email, firstName, lastName, age }: IUser): IUserDetails => ({
  _id,
  email,
  firstName,
  lastName,
  age,
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
  age: {
    type: Number,
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
