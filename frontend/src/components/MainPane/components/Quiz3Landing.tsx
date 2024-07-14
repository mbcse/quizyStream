'use client' // for Next.js app router
import { FC, useState } from "react";
import { IDKitWidget, VerificationLevel, ISuccessResult } from '@worldcoin/idkit';
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

    setIsLoading(true); // Set loading state before navigation

    

    // Note: No need to set isLoading(false) here as navigation will cause component unmount
  };

  

  const onSuccess = () => {
   
    router.push(`/dashboard/play-quiz?roomId=${id}`);
};

  const handleVerify = async (proof: ISuccessResult) => {
    const res = await fetch("/api/verify", { // route to your backend will depend on implementation
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(proof),
    })
    if (!res.ok) {
        throw new Error("Verification failed."); // IDKit will display the error message to the user in the modal
    }
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
      <IDKitWidget
	app_id="your app id" // obtained from the Developer Portal
	action="your action id" // obtained from the Developer Portal
	onSuccess={onSuccess} // callback when the modal is closed
	handleVerify={handleVerify} // callback when the proof is received
	verification_level={VerificationLevel.Orb}
>
	{({ open }) => 
        // This is the button that will open the IDKit modal
        <button onClick={open}>Verify with World ID</button>
    }
</IDKitWidget>

      <VStack w={"45%"} minWidth={"270px"} gap={2} textAlign="left">
        <Text textAlign="left" fontWeight="bold">RoomId</Text>
        <Input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
          placeholder="Room Id"
        />
        <Button
          onClick={() => open()}
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
