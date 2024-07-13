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
import { io, Socket } from 'socket.io-client';

import { useNotify } from '@/hooks';

const socket: Socket = io('http://localhost:4000'); // Replace with your backend URL

interface Player {
  id: string;
  playerAddress: string;
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
  const [roomId, setRoomId] = useState('');
  const [showingQuestion, setShowingQuestion] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [quizInitiated, setQuizInitiated] = useState(false);
  const {notifySuccess} = useNotify()

  useEffect(() => {
    // Fetch the quiz data based on the query parameter in the URL

    const fetchQuiz = async () => {
      const quizId = searchParams.get('quizId'); // Extract quiz ID from URL query params
      if (!quizId) return;

      const roomId = searchParams.get('roomId');
      socket.emit('createRoom', roomId);
      setRoomId(roomId);

      const response = await fetch(`/api/get-quiz?id=${quizId}`);
      if (response.ok) {
        const data = await response.json();
        setQuiz(data.quiz);
      } else {
        console.error('Failed to fetch quiz');
      }
    };

    fetchQuiz();

    // Listen for players joining the quiz
    socket.on('playerJoined', (players: Player[]) => {
      console.log('Players joined:', players);
      setPlayers((prevPlayers) => {
        const uniquePlayers = [
          ...prevPlayers,
          ...players.filter(
            (player) => !prevPlayers.some((p) => p.id === player.id)
          ),
        ];
        return uniquePlayers;
      });
    });

    // Listen for quiz start
    socket.on('quizStarted', () => {
      console.log('Quiz started');
      setShowingQuestion(true);

    });

    socket.on("rewardStreamConnectedByPlayer", (playerAddress) => {
      notifySuccess({title: "Player Connected to Reward Stream", message:`Player ${playerAddress} successfully Connected to Reward Stream`})
    })

    // Listen for quiz question broadcast
    socket.on('showQuestion', (question: Question) => {
      console.log('Showing question:', question);
      setShowingQuestion(true);
    });

    return () => {
      socket.off('playerJoined');
      socket.off('quizStarted');
      socket.off('showQuestion');
    };
  }, [searchParams.get('quizId')]);


  const initiateQuiz = async () => {
    if (quiz) {


      const response = await fetch('/api/start-quiz-tx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ players, quizId: searchParams.get('quizId')  }),
      });

      if (response.ok) {
        // notifySuccess("Questions submitted successfully!");

        socket.emit('initiateQuiz', roomId);
        setQuizInitiated(true)
      } else {
        // notifyError("Failed to submit questions.");
      }
      
      
    }
  };

  const startQuiz = async () => {
    if (quiz) {


      const response = await fetch('/api/start-quiz-tx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ players, quizId: searchParams.get('quizId')  }),
      });

      if (response.ok) {
        // notifySuccess("Questions submitted successfully!");
      } else {
        // notifyError("Failed to submit questions.");
      }
      
      socket.emit('startQuiz', quiz._id);
      setShowingQuestion(true);
      socket.emit('showQuestion', roomId, quiz.questions[currentQuestionIndex]);
    }
  };




  const showNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      socket.emit('showQuestion', roomId, quiz.questions[currentQuestionIndex + 1]);
    }
  };

  const handleSelectOption = (selectedOption: string) => {
    // Logic to handle selected option (if needed)
    console.log('Selected option:', selectedOption);
  };

  return (
    <VStack spacing={4} align="center" justify="center" height="100vh">
      <Text fontSize="3xl">Quiz Control</Text>
      <Box>
        <Text fontSize="xl">Room Id: {roomId}</Text>
        <Text fontSize="xl">Players Joined:</Text>
        {players.map((player) => (
          <Text key={player.id}>{player.playerAddress}</Text>
        ))}
      </Box>
      {!showingQuestion && (

          quizInitiated ? (
            <Button colorScheme="green" onClick={startQuiz} disabled={!quiz}>
              Start Quiz
            </Button>
          ) :
          (
            <Button colorScheme="green" onClick={initiateQuiz} disabled={!quiz}>
              Initiate Quiz
            </Button>
          )
        
      )}
      {showingQuestion && quiz && (
        <Flex direction="column" align="center">
          <Text fontSize="2xl">Question {currentQuestionIndex + 1}</Text>
          <Box borderWidth="1px" borderRadius="lg" p={4} my={4}>
            <Text fontSize="xl">{quiz.questions[currentQuestionIndex].question}</Text>
            <VStack spacing={4} align="stretch" mt={4}>
              {quiz.questions[currentQuestionIndex].options.map((option, index) => (
                <Button key={index} onClick={() => handleSelectOption(option)}>
                  {option}
                </Button>
              ))}
            </VStack>
          </Box>
          {currentQuestionIndex < quiz.questions.length - 1 && (
            <Button colorScheme="blue" onClick={showNextQuestion}>
              Next Question
            </Button>
          )}
        </Flex>
      )}
    </VStack>
  );
}
