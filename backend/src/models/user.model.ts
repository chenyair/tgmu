import bcrypt from 'bcrypt';
import mongoose, { CallbackError } from 'mongoose';
import { validateAlphabet } from 'utils/validator';
import { IUser, IUserDetails } from 'shared-types';

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

// Must be use `function` syntax to use the `this` keyword
// This middleware ensures that the password that is saved is always hashed
userSchema.pre('save', async function userPreSave(next) {
  // isModified returns true both for new and modified document
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    return next();
  } catch (err) {
    return next(err as CallbackError);
  }
});

export default mongoose.model<IUser>('User', userSchema);
