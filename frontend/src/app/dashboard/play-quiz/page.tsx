// app/quiz.tsx
"use client";
import { useEffect, useState } from "react";

import { Box, Text, VStack } from "@chakra-ui/react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your backend URL

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export default function PlayQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  useEffect(() => {
    socket.on("showQuestion", (question: Question) => {
      setCurrentQuestion(question);
    });

    return () => {
      socket.off("showQuestion");
    };
  }, []);

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
        <Text fontSize="3xl">Waiting for the quiz to start...</Text>
      )}
    </VStack>
  );
}
