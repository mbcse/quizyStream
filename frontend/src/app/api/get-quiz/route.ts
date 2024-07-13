// pages/api/get-quiz.ts
import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import Quiz from '@/models/Quiz';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Quiz ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }
    return NextResponse.json({ quiz }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
