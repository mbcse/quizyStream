// pages/app/control.tsx
"use client";
import { useEffect, useState } from 'react';

import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000"); // Replace with your backend URL

interface Player {
  id: string;
  name: string;
}

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface Quiz {
  _id: string;
  title: string;
  questions: Question[];
}

export default function ControlQuiz() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    // Fetch the quiz data based on the query parameter in the URL
    const fetchQuiz = async () => {
      const quizId = searchParams.get("id"); // Extract quiz ID from URL query params
      if (!quizId) return;

      const response = await fetch(`/api/get-quiz?id=${quizId}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
      } else {
        console.error("Failed to fetch quiz");
      }
    };

    fetchQuiz();

    // Listen for players joining the quiz
    socket.on("playerJoined", (player: Player) => {
      setPlayers((prevPlayers) => [...prevPlayers, player]);
    });

    return () => {
      socket.off("playerJoined");
    };
  }, [searchParams.get("id")]);

  const startQuiz = () => {
    if (quiz) {
      socket.emit("startQuiz", quiz._id);
    }
  };

  const showNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      socket.emit("showQuestion", quiz.questions[currentQuestionIndex + 1]);
    }
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Text fontSize="3xl">Quiz Control</Text>
      <Box>
        <Text fontSize="xl">Players Joined:</Text>
        {players.map((player) => (
          <Text key={player.id}>{player.name}</Text>
        ))}
      </Box>
      <Button colorScheme="green" onClick={startQuiz} disabled={!quiz}>
        Start Quiz
      </Button>
      <Button colorScheme="blue" onClick={showNextQuestion} disabled={!quiz || currentQuestionIndex >= quiz.questions.length - 1}>
        Next Question
      </Button>
    </VStack>
  );
}
