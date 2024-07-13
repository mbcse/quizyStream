// app/api/get-quizzes/route.ts

import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import Quiz from '@/models/Quiz';

export async function GET() {
  try {
    await dbConnect();

    const quizzes = await Quiz.find().lean();
    console.log(quizzes[0].questions)
    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ message: 'Error fetching quizzes', error: error.message }, { status: 500 });
  }
}
