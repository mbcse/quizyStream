import { sep } from "path";

import { createId } from "@paralleldrive/cuid2";
import { JsonRpcApiProvider, Wallet, Contract, JsonRpcProvider } from "ethers";
import { NextResponse } from "next/server";

import { QuizyStreamABI } from "../../../config";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import { convertToUnixTimestamp } from "@/utils/timeUtils";

export async function GET(request: any) {
  try {

    const sepolia_provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

    const wallet = new Wallet(process.env.ADMIN_PRIVATE_KEY, sepolia_provider);

    const quizy_stream_contract_address = process.env.QUIZY_STREAM_SEPOLIA_ADDRESS;

    const quizy_stream_contract_instance = new Contract(
      quizy_stream_contract_address,
      QuizyStreamABI,
      wallet,
    );

    let quiz_id = "";
    let question_number = "";
    let answer :[]= [];
    let questionsalt = 123;
    let correct_question = ;
    let correct_answer = ;

    let aggregate = await quizy_stream_contract_instance.aggregate_answers(quiz_id,question_number,answer,questionsalt,correct_question,correct_answer);




   

  

 

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
