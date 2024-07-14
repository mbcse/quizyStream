"use client";
import { useEffect, useState } from "react";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useSearchParams } from 'next/navigation';
import { io } from "socket.io-client";
import { useAccount } from "wagmi";

import {QuizyStreamABI, QuezyStreamAddress} from '../../../config'
import FlowingBalance from "@/components/MainPane/components/FlowingBalance";
import { getDefaultEthersSigner } from "@/utils/clientToEtherjsSigner";
import { convertToUnixTimestamp } from "@/utils/timeUtils";


const socket = io("http://localhost:4000"); // Replace with your backend URL

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function PlayQuiz() {

  const account = useAccount()
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");

  const [quizInitialized, setQuizInitialized] = useState(false)

  const [connectToStream, setConnectedToStream] = useState(false)

  const [quizId, setQuizId] = useState("")

  const [selectedAnswer, setSelectedAnswer]  = useState("")

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0)

  const [startingBalance, setStartingBalance] = useState<bigint>(BigInt(0))
  const [startingDate, setStartingDate] = useState(new Date())
  const [flowRate, setFlowRate] = useState<bigint>(BigInt(0))


  setInterval(async ()=>{
    try {
      const signer = await getDefaultEthersSigner()
   
       const quizyStreamContract = new ethers.Contract(QuezyStreamAddress, QuizyStreamABI, signer);
  
       const currentFlowRate = await quizyStreamContract.get_member_flow_rate(quizId, account.address)
  
       setFlowRate(currentFlowRate)
  
       console.log(currentFlowRate)
    } catch (error) {
      console.log(error)
    }
  }, 5000)



  useEffect(() => {
    if (!roomId) return;

    console.log("joining Room")
    socket.emit("joinRoom", roomId, account.address);

  }, []);


  const handleConnectRewardStream = async () => {
   try {
     const signer = await getDefaultEthersSigner()
 
     const quizyStreamContract = new ethers.Contract(QuezyStreamAddress, QuizyStreamABI, signer);
 
     const quizIdResponse = await fetch(`/api/get-quizid-from-roomId?roomId=${roomId}`)
 
     const data = await quizIdResponse.json();
 
     const quizId = data.quizId

     setQuizId(quizId)
 
     const tx = await quizyStreamContract.connectPool(quizId)

     console.log(tx)
     socket.emit("connectedToRewardStream", roomId, account.address)
     setConnectedToStream(true)
   } catch (error) {
    console.log(error)
   }
  }


  socket.on("showQuestion", (question: Question) => {
    setCurrentQuestion(question);
    setCurrentQuestionNumber(currentQuestionNumber+1)
  });

  socket.on("QuizInitialized", () => {
    setQuizInitialized(true);
  })

  const getMessageHash = (
    answer: string,
    timestamp: number,
    quiz_id: string,
    question_number: number,
    player: string
  ) => {
    return ethers.solidityPackedKeccak256(
      ['string', 'uint256', 'string', 'uint256', 'address'],
      [answer, timestamp, quiz_id, question_number, player]
    );
  };


  const getEthSignedMessageHash = (messageHash: string) => {
    const messageBytes = ethers.getBytes(messageHash);
    const prefix = ethers.toUtf8Bytes(`\x19Ethereum Signed Message:\n${messageBytes.length}`);
    return ethers.keccak256(ethers.concat([prefix, messageBytes]));
  };


  const handleSelectOption = async (selectedOption: string, question: string, questionNumber: number) => {
    // Logic to handle selected option (if needed)
    console.log('Selected option:', selectedOption);
    const signer = await getDefaultEthersSigner();
    const unixtimestamp = convertToUnixTimestamp(new Date())
    const messageHash = getMessageHash(selectedOption, unixtimestamp, quizId, questionNumber, account.address);
    const ethSignedMessageHash = getEthSignedMessageHash(messageHash);
    const signature = await signer.signMessage(ethers.getBytes(ethSignedMessageHash));

    const resp = await fetch("/api/submit-answer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer : selectedOption, questionNumber, unixTimestamp:unixtimestamp, quizId, roomId, playerAddress: account.address, signature}),
    } )

    setSelectedAnswer(selectedOption)

  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">

      <FlowingBalance
      startingBalance={startingBalance}
      startingBalanceDate={startingDate}
      flowRate={flowRate}
      ></FlowingBalance>
      {currentQuestion ? (
        <>
          <Text fontSize="3xl">{currentQuestion.question}</Text>
          {currentQuestion.options.map((option, index) => (
            <Button key={index} onClick={() => handleSelectOption(option, currentQuestion.question, currentQuestionNumber)}>
            {option}
          </Button>
          ))}
        </>
      ) : (
        <Text fontSize="3xl">
          
          {
            quizInitialized ? (

            connectToStream ? ("Wait or Quiz to Start"): (
              <Button
                onClick={()=>{
                  handleConnectRewardStream()
                }}
              >
                Connect Reward Stream
              </Button>
            )
           ) :
            ("Waiting for the quiz to start...")
          }
          
          </Text>
      )}
    </VStack>
  );
}
