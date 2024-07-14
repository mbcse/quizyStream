import { createId } from "@paralleldrive/cuid2";
import { JsonRpcApiProvider, Wallet, Contract, JsonRpcProvider } from "ethers";
import { NextResponse } from "next/server";

import { QuizyStreamABI } from "../../../config";
import dbConnect from "@/lib/dbConnect";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import { getMap, getString } from "@/redis";
import { convertToUnixTimestamp } from "@/utils/timeUtils";

export async function POST(request: any) {
  try {

    const body = await request.json();
    const {quizId, questionNumber} = body

    const sepolia_provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

    const wallet = new Wallet(process.env.ADMIN_PRIVATE_KEY, sepolia_provider);

    const quizy_stream_contract_address = process.env.QUIZY_STREAM_SEPOLIA_ADDRESS;

    const quizy_stream_contract_instance = new Contract(
      quizy_stream_contract_address,
      QuizyStreamABI,
      wallet,
    );

    const key = `playersAnswers-${quizId}-${questionNumber}`

    const playersData = JSON.parse(await getString(key))
    console.log(playersData);
  
    const answer : []= Object.keys(playersData).map((playerAddress)=> {
      return {
        answer: playersData[playerAddress].answer,
        question: playersData[playerAddress].question,
        timestamp: playersData[playerAddress].unixTimestamp,
        quiz_id: playersData[playerAddress].quizId,
        question_number: playersData[playerAddress].questionNumber,
        player: playerAddress,
        signature: playersData[playerAddress].signature
      }
    });


    const quiz = await Quiz.findById(quizId)


    const quiz_id = quizId.toString();
    const question_number = questionNumber;
    const questionsalt = 123;
    const correct_question = quiz?.questions[questionNumber -1].question;
    const correct_answer = quiz?.questions[questionNumber -1].answer;

    console.log(quiz_id)
    console.log(question_number)
    console.log(questionsalt)
    console.log(correct_question)
    console.log(correct_answer)
    console.log(answer)

    const aggregateTx = await quizy_stream_contract_instance.aggregate_answers(quiz_id,question_number,answer,questionsalt,correct_question,correct_answer);

    console.log(aggregateTx);

    return new Response(
      JSON.stringify({
        message: "Quiz Settlement Successfull",
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
