import { NextRequest, NextResponse } from 'next/server';

import { pushStringToRedis, pushMapToRedis, getMap, getString} from '@/redis';
import { convertToUnixTimestamp } from '@/utils/timeUtils';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { quizId, roomId, questionNumber,  question, answer, playerAddress, unixTimestamp, signature} = body;

    const key = `playersAnswers-${quizId}-${questionNumber}`
    let playersAnswersData = await getString(key)




    if(playersAnswersData) {
        playersAnswersData = JSON.parse(playersAnswersData)
        playersAnswersData[playerAddress] =  {
            answer,
            question,
            unixTimestamp,
            quizId,
            questionNumber,
            playerAddress,
            signature,
        }
        await pushStringToRedis(key, JSON.stringify(playersAnswersData))
    }else{

        playersAnswersData = {}
        playersAnswersData[playerAddress] =  {
            answer,
            question,
            unixTimestamp,
            quizId,
            questionNumber,
            playerAddress,
            signature,
        }
        await pushStringToRedis(key, JSON.stringify(playersAnswersData))
    }

   

    const playersAnswersDatanew = await getString(key)

    console.log(playersAnswersDatanew)
 
  return NextResponse.json({ quizId }, { status: 200 });
}