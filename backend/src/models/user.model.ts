import mongoose from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  imgUrl?: string;
  _id?: string;
  refreshTokens?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
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
