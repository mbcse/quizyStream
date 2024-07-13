import { createId } from '@paralleldrive/cuid2';

import dbConnect from '@/lib/dbConnect';
import Quiz from '@/models/Quiz';
import User from '@/models/User';

export async function POST(request: any) {
  try {
    await dbConnect();

    const body = await request.json();
    console.log(body.questions.options);

    const Id = createId();
    const ownerAddress = body.owner;
    const quizData = {
      title: body.title,
      questions: body.questions.map((q: any) => ({
        ...q,
        options: q.options.map((opt: any) => opt.text), // Map to extract the text property
      })),
      prizeAmounts: body.prizes,
      distributionAmount: body.streamDistribution,
      createdBy: null,
    };

    // Find or create the user
    let user = await User.findOne({ userAddress: ownerAddress });
    if (!user) {
      user = new User({ userAddress: ownerAddress, createdQuizzes: [], participatedQuizzes: [] });
      await user.save();
    }

    // Create the quiz
    quizData.createdBy = user._id;
    const quiz = new Quiz(quizData);
    await quiz.save();

    // Update user's created quizzes
    user.createdQuizzes.push(quiz._id);
    await user.save();

    return new Response(
      JSON.stringify({
        message: "Quiz created successfully",
        id: Id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating quiz:', error);
    return new Response(
      JSON.stringify({
        message: "Error creating quiz",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
