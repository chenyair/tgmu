import mongoose from 'mongoose';
import { IExperience, IComment } from 'shared-types';

const CommentSchema = new mongoose.Schema<IComment>(
  {
    text: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const ExperienceSchema = new mongoose.Schema<IExperience>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    comments: {
      type: [CommentSchema],
      default: [],
      required: true,
    },
    likedUsers: {
      type: [String],
      default: [],
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
