import { NextRequest, NextResponse } from 'next/server';

import { getString, pushStringToRedis } from '@/redis';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const roomId = url.searchParams.get('roomId');
    const quizId = await getString(roomId);
    return NextResponse.json({ quizId }, { status: 200 });
}

export async function POST(req: NextRequest) {  
  return NextResponse.json({ error: `Method Not Allowed` }, { status: 405 });
}
