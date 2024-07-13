"use client";
import { useEffect, useState } from "react";

import {
  Box,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation"; // Change import to next/navigation
import { useAccount } from "wagmi";

import { Footer, Header } from "@/components";
import LoadingScreen from "@/components/MainPane/components/LoadingScreen";
import { SideBar } from "@/components/Sidebar";
import { useNotify } from "@/hooks";

// Type definitions
interface Option {
  string;
}

interface Question {
  question: string;
  options: Option[];
  answer: string;
}

interface Quiz {
  _id: string; // Update to match Mongoose document ID
  title: string;
  questions: Question[];
}

export default function MyCreatedQuizzes() {
  const { notifyError } = useNotify();
  const account = useAccount();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    // Fetch quizzes from backend
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/get-quizzes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setQuizzes(data.quizzes);
        } else {
          notifyError("Failed to fetch quizzes.");
        }
      } catch (error) {
        notifyError("An error occurred while fetching quizzes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const viewQuizDetails = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    onOpen();
  };

  const startQuiz = async (quizId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/generate-room-id");
      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/start-quiz?quizId=${quizId}&roomId=${data.roomId}`);
      } else {
        notifyError({title: "Error", message:"Failed to generate roomid"});
      }
    } catch (error) {
      notifyError({title: "Error", message:"Error"});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex flexDirection="column" minHeight="100vh" bg="gray.50">
      <LoadingScreen isLoading={isLoading} />
      <Header />
      <Text align="center" fontSize="4xl" my={6} color="purple.700">
        My Created Quizzes
      </Text>
      <Flex>
        <SideBar />
        <Box as="main" flex={1} p={6} ml="250px">
          <TableContainer>
            <Table variant="striped" colorScheme="purple">
              <TableCaption>My Created Quizzes</TableCaption>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Title</Th>
                  <Th>Questions</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {quizzes.map((quiz, index) => (
                  <Tr key={index}>
                    <Td>{quiz._id}</Td>
                    <Td>{quiz.title}</Td>
                    <Td>{quiz.questions.length}</Td>
                    <Td>
                      <Button
                        colorScheme="blue"
                        onClick={() => viewQuizDetails(quiz)}
                      >
                        View
                      </Button>
                      <Button
                        colorScheme="green"
                        ml={3}
                        onClick={() => startQuiz(quiz._id)}
                      >
                        Start Quiz
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {selectedQuiz && (
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{selectedQuiz.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {selectedQuiz.questions.map((question, qIndex) => (
                    <Box key={qIndex} mb={4}>
                      <Text fontWeight="bold">Question {qIndex + 1}:</Text>
                      <Text>{question.question}</Text>
                      <Text fontWeight="bold">Options:</Text>
                      <ul>
                        {question.options.map((option, oIndex) => (
                          <li key={oIndex}>{option}</li>
                        ))}
                      </ul>
                      <Text fontWeight="bold">Answer:</Text>
                      <Text>{question.answer}</Text>
                    </Box>
                  ))}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
}
