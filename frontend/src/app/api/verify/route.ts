import { type IVerifyResponse, verifyCloudProof } from '@worldcoin/idkit'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	const proof = req.body
    const app_id = process.env.APP_ID
    const action = process.env.ACTION_ID
	const verifyRes = (await verifyCloudProof(proof, app_id, action)) as IVerifyResponse

    return NextResponse.json(verifyRes, { status: 200 });
};
