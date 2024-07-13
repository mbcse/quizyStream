import { NextRequest, NextResponse } from 'next/server';

import { pushStringToRedis } from '@/redis';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const quizId = url.searchParams.get('quizId');
    const roomId = Math.floor(100000 + Math.random() * 900000).toString();

    await pushStringToRedis(roomId, quizId);
  return NextResponse.json({ roomId }, { status: 200 });
}

export async function POST(req: NextRequest) {  
  return NextResponse.json({ error: `Method Not Allowed` }, { status: 405 });
}
