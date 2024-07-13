// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IUser extends Document {
  userAddress: string;
  createdQuizzes: mongoose.Types.ObjectId[];
  participatedQuizzes: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    userAddress: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    createdQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
      },
    ],
    participatedQuizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
