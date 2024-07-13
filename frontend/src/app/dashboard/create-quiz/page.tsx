"use client";
import { useState } from "react";

import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
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
  Input,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Stack,
  IconButton,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";

import { Footer, Header } from "@/components";
import LoadingScreen from "@/components/MainPane/components/LoadingScreen";
import { SideBar } from "@/components/Sidebar";
import { useNotify } from "@/hooks";


// Type definitions
interface Option {
  text: string;
}

interface Question {
  question: string;
  options: Option[];
  answer: string;
  timeLimit: number; // Time limit in seconds
}

interface Prize {
  first: number;
  second: number;
  third: number;
}

export default function CreatedQuiz() {

  const account = useAccount();
  console.log(account)

  const { notifyError, notifySuccess } = useNotify();
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [currentOptions, setCurrentOptions] = useState<string[]>(["", "", "", ""]);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [currentTimeLimit, setCurrentTimeLimit] = useState<number>(30); // Default time limit
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [prizes, setPrizes] = useState<Prize>({ first: 0, second: 0, third: 0 });
  const [streamDistribution, setStreamDistribution] = useState<number>(0);

  // Handle input changes
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => setCurrentQuestion(e.target.value);
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setCurrentOptions(newOptions);
  };
  const handleAnswerChange = (value: string) => setCurrentAnswer(value);
  const handleTimeLimitChange = (value: string) => setCurrentTimeLimit(parseInt(value));
  const handlePrizeChange = (field: keyof Prize, value: string) => setPrizes({ ...prizes, [field]: parseInt(value) });
  const handleStreamDistributionChange = (value: string) => setStreamDistribution(parseInt(value));

  // Add or update question
  const addOrUpdateQuestion = () => {
    if (currentQuestion && currentOptions.every(opt => opt) && currentAnswer && currentTimeLimit > 0) {
      const newQuestion: Question = {
        question: currentQuestion,
        options: currentOptions.map(opt => ({ text: opt })),
        answer: currentAnswer,
        timeLimit: currentTimeLimit,
      };
      if (editIndex !== null) {
        const updatedQuestions = [...questions];
        updatedQuestions[editIndex] = newQuestion;
        setQuestions(updatedQuestions);
        setEditIndex(null);
      } else {
        setQuestions([...questions, newQuestion]);
      }
      setCurrentQuestion("");
      setCurrentOptions(["", "", "", ""]);
      setCurrentAnswer("");
      setCurrentTimeLimit(30); // Reset to default time limit
      notifySuccess({title: "Quiz Created", message: "Success!"});
    } else {
      notifyError({title: "Error", message: "Failed to create quiz" });
    }
  };

  // Edit question
  const editQuestion = (index: number) => {
    const questionToEdit = questions[index];
    setCurrentQuestion(questionToEdit.question);
    setCurrentOptions(questionToEdit.options.map(opt => opt.text));
    setCurrentAnswer(questionToEdit.answer);
    setCurrentTimeLimit(questionToEdit.timeLimit);
    setEditIndex(index);
  };

  // Delete question
  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    notifySuccess("Question deleted successfully!");
  };

  // Send questions to the backend
  const sendQuestionsToBackend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions, prizes, streamDistribution, owner: account.address, title: quizTitle }),
      });

      if (response.ok) {
        notifySuccess("Questions submitted successfully!");
      } else {
        notifyError("Failed to submit questions.");
      }
    } catch (error) {
      notifyError("An error occurred while submitting questions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex flexDirection="column" minHeight="100vh" bg="gray.50">
      <LoadingScreen isLoading={isLoading} />
      <Header />
      <Flex>
        <SideBar />
        <Box as="main" flex={1} p={6} ml="250px">
          <Text fontSize="4xl" mb={6} color="purple.700">Create Quiz</Text>
          <FormControl mb={4}>
              <FormLabel>Quiz Title</FormLabel>
              <Input value={quizTitle} onChange={(e)=>{
                setQuizTitle(e.target.value);
              }} placeholder="Enter Quiz Title" />
            </FormControl>
          <Box mb={6}>
            <FormControl mb={4}>
              <FormLabel>Question</FormLabel>
              <Input value={currentQuestion} onChange={handleQuestionChange} placeholder="Enter your question here" />
            </FormControl>

            {currentOptions.map((option, index) => (
              <FormControl key={index} mb={4}>
                <FormLabel>Option {index + 1}</FormLabel>
                <Input value={option} onChange={(e) => handleOptionChange(index, e.target.value)} placeholder={`Enter option ${index + 1}`} />
              </FormControl>
            ))}

            <FormControl mb={4}>
              <FormLabel>Correct Answer</FormLabel>
              <RadioGroup onChange={handleAnswerChange} value={currentAnswer}>
                <Stack direction="row">
                  {currentOptions.map((option, index) => (
                    <Radio key={index} value={option}>{`Option ${index + 1}`}</Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Time Limit (seconds)</FormLabel>
              <NumberInput value={currentTimeLimit} onChange={(valueString) => handleTimeLimitChange(valueString)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>

            <Button colorScheme="purple" onClick={addOrUpdateQuestion} mb={4}>
              {editIndex !== null ? "Update Question" : "Add Question"}
            </Button>
          </Box>

          <TableContainer>
            <Table variant="striped" colorScheme="purple">
              <TableCaption>Quiz Questions</TableCaption>
              <Thead>
                <Tr>
                  <Th>Question</Th>
                  <Th>Options</Th>
                  <Th>Correct Answer</Th>
                  <Th>Time Limit (s)</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {questions.map((q, index) => (
                  <Tr key={index}>
                    <Td>{q.question}</Td>
                    <Td>{q.options.map(opt => opt.text).join(", ")}</Td>
                    <Td>{q.answer}</Td>
                    <Td>{q.timeLimit}</Td>
                    <Td>
                      <IconButton
                        aria-label="Edit question"
                        icon={<EditIcon />}
                        mr={2}
                        onClick={() => editQuestion(index)}
                      />
                      <IconButton
                        aria-label="Delete question"
                        icon={<DeleteIcon />}
                        onClick={() => deleteQuestion(index)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <Box mt={6}>
            <FormControl mb={4}>
              <FormLabel>First Prize Amount (in crypto)</FormLabel>
              <NumberInput value={prizes.first} onChange={(valueString) => handlePrizeChange('first', valueString)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Second Prize Amount (in crypto)</FormLabel>
              <NumberInput value={prizes.second} onChange={(valueString) => handlePrizeChange('second', valueString)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Third Prize Amount (in crypto)</FormLabel>
              <NumberInput value={prizes.third} onChange={(valueString) => handlePrizeChange('third', valueString)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Stream Distribution Amount</FormLabel>
              <NumberInput value={streamDistribution} onChange={(valueString) => handleStreamDistributionChange(valueString)}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </Box>

          <Button colorScheme="green" onClick={sendQuestionsToBackend} mt={4}>Submit Quiz</Button>
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
}
