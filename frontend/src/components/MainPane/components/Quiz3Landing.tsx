import { FC, useState } from "react";

import { Box, Button, Flex, Input, Text, VStack } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { useAccount, useChainId } from "wagmi";

import LoadingScreen from "./LoadingScreen";
import { useNotify } from "@/hooks";

const socket = io("http://localhost:4000"); 

const Quiz3Landing: FC = () => {
  const router = useRouter();
  const account = useAccount();
  const chainId = useChainId();
  const { notifyError, notifySuccess } = useNotify();

  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState("");

  const handleJoinQuiz = (id: string) => {
    socket.emit('joinQuiz', "Mohit");
    setIsLoading(true); // Set loading state before navigation
    router.push(`/dashboard/play-quiz?id=${id}`);
    // Note: No need to set isLoading(false) here as navigation will cause component unmount
  };

  return (
    <Flex
      w={"100%"}
      display={"flex"}
      justifyContent={"space-around"}
      flexWrap={"wrap"}
      gap={5}
    >
      <LoadingScreen isLoading={isLoading} />

      <VStack w={"45%"} minWidth={"270px"} gap={2} textAlign="left">
        <Text textAlign="left" fontWeight="bold">RoomId</Text>
        <Input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Room Id"
        />
        <Button
          onClick={() => handleJoinQuiz(roomId)}
          isLoading={isLoading}
          colorScheme="teal"
          variant="solid"
        >
          Enter Playground
        </Button>
      </VStack>
    </Flex>
  );
};

export default Quiz3Landing;
