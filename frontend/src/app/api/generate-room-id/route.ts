import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const roomId = Math.floor(100000 + Math.random() * 900000).toString();
  return NextResponse.json({ roomId }, { status: 200 });
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: `Method Not Allowed` }, { status: 405 });
}
