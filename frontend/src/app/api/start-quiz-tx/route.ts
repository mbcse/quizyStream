import { createId } from "@paralleldrive/cuid2";

import dbConnect from "@/lib/dbConnect";
import Quiz from "@/models/Quiz";
import User from "@/models/User";
import { JsonRpcApiProvider, Wallet, Contract, JsonRpcProvider } from "ethers";
import { QuizyStreamABI } from "../../../config";
import { sep } from "path";

export async function GET(request: any) {
  try {
    let sepolia_provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    console.log("sepolia rpc url", process.env.SEPOLIA_RPC_URL);
    // console.log("sepolia provider", sepolia_provider);

    let block_num = await sepolia_provider.getBlockNumber();
    console.log("block_num", block_num);
    let wallet = new Wallet(process.env.ADMIN_PRIVATE_KEY, sepolia_provider);
    // console.log("wallet", wallet);

    let quizy_stream_contract_address = process.env.QUIZY_STREAM_SEPOLIA_ADDRESS;

    let quizy_stream_contract_instance = new Contract(
      quizy_stream_contract_address,
      QuizyStreamABI,
      wallet,
    );
    console.log("quizy_stream_contract_instance", quizy_stream_contract_instance);

    let flowrate = 1;
    let admin = wallet.address;
    let id = "test";
    let start_time = 3432;
    let end_time = 423423423;
    let question_num = 1;
    let interval = 5;
    let players = ["0x1b37B1EC6B7faaCbB9AddCCA4043824F36Fb88D8"];
    let hashes = ["0x7c82ed594c5737681efc28786904c727fa29fc417a33c91f824a22333d3f3de1"];

    let start_quiz_instance = await quizy_stream_contract_instance.start_new_quiz(
      flowrate,
      admin,
      id,
      start_time,
      end_time,
      question_num,
      interval,
      players,
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
