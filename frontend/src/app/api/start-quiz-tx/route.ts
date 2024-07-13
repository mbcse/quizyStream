import { sep } from "path";

import { createId } from "@paralleldrive/cuid2";
import { JsonRpcApiProvider, Wallet, Contract, JsonRpcProvider } from "ethers";
import { NextResponse } from "next/server";

import { QuizyStreamABI } from "../../../config";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import { convertToUnixTimestamp } from "@/utils/timeUtils";

export async function POST(request: any) {
  try {

    await dbConnect();

    const body = await request.json();

    console.log(body);

    const quizId = body.quizId;

    const players = body.players;
    
    const sepolia_provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

    const wallet = new Wallet(process.env.ADMIN_PRIVATE_KEY, sepolia_provider);

    const quizy_stream_contract_address = process.env.QUIZY_STREAM_SEPOLIA_ADDRESS;

    const quizy_stream_contract_instance = new Contract(
      quizy_stream_contract_address,
      QuizyStreamABI,
      wallet,
    );

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ message: 'Quiz not found' }, { status: 404 });
    }

    const quizOwnerData = await User.findById(quiz.createdBy)


    const flowrate = 1;
    const admin = quizOwnerData?.userAddress;
    const id = quizId.toString();
    const start_time = convertToUnixTimestamp(new Date());
    const end_time = convertToUnixTimestamp(new Date()) + 600;
    const question_num = quiz.questions.length;
    const interval = 30;
    const playersAddresses = players.map((player: any) => {
      return player.playerAddress
    });

    console.log(playersAddresses)
    const hashes = ["0x7c82ed594c5737681efc28786904c727fa29fc417a33c91f824a22333d3f3de1"];

    console.log("Executing tx")
    const start_quiz_instance = await quizy_stream_contract_instance.start_new_quiz(
      flowrate,
      admin,
      id,
      start_time,
      end_time,
      question_num,
      interval,
      ["0x88a84d2ef2f676d25e246b871d51a6ec788b8e55"],
      hashes,
    );

    console.log("start quiz instance : ", start_quiz_instance);

    return new Response(
      JSON.stringify({
        message: "Quiz created successfully",
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating quiz:", error);
    return new Response(
      JSON.stringify({
        message: "Error creating quiz",
        error: error.message,
      }),
      { status: 500 },
    );
  }
}
