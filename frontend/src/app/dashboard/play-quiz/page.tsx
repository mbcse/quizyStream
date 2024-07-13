"use client";
import { useEffect, useState } from "react";

import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useSearchParams } from 'next/navigation';
import { io } from "socket.io-client";
import { useAccount } from "wagmi";

import {QuizyStreamABI, QuezyStreamAddress} from '../../../config'
import { getDefaultEthersSigner } from "@/utils/clientToEtherjsSigner";


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
  });

  socket.on("QuizInitialized", () => {
    setQuizInitialized(true);
  })

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      {currentQuestion ? (
        <>
          <Text fontSize="3xl">{currentQuestion.question}</Text>
          {currentQuestion.options.map((option, index) => (
            <Box key={index} bg="gray.200" p={4} borderRadius="md">
              <Text>{option}</Text>
            </Box>
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
