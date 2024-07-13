// models/Quiz.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IQuestion {
  question: string;
  options: string[];
  answer: string;
  timeLimit: number; // in seconds
}

interface IQuiz extends Document {
  title: string;
  questions: IQuestion[];
  prizeAmounts: {
    first: number;
    second: number;
    third: number;
  };
  distributionAmount: number; // amount for stream distribution for correct answers
  createdBy: mongoose.Types.ObjectId; // reference to the user who created the quiz
}

const QuestionSchema: Schema<IQuestion> = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  answer: {
    type: String,
    required: true,
  },
  timeLimit: {
    type: Number,
    required: true,
  },
});

const QuizSchema: Schema<IQuiz> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    questions: [QuestionSchema],
    prizeAmounts: {
      first: {
        type: Number,
        required: true,
      },
      second: {
        type: Number,
        required: true,
      },
      third: {
        type: Number,
        required: true,
      },
    },
    distributionAmount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Quiz: Model<IQuiz> = mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);

export default Quiz;
