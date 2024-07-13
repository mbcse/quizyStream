import { type FC, type ChangeEvent, type MouseEvent, useEffect, useState, useCallback } from "react";

import { Box, Button, Flex, Input, Select, Text, VStack, useToken } from "@chakra-ui/react";
import { ethers } from "ethers";
// import { useRouter } from "next/router";
// import { io } from 'socket.io-client';
// import { baseSepolia } from "viem/chains";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";

import LoadingScreen from "./LoadingScreen";
import { useNotify } from "@/hooks";
// import { useSignMessageHook, useNotify } from "@/hooks";
// import { getDefaultEthersSigner, getEthersSigner } from "@/utils/clientToEtherjsSigner";
// import { uploadFile, uploadJson } from "@/utils/ipfsHelper";
// import { createMetaData } from "@/utils/nftHelpers";
// import { convertToUnixTimestamp } from "@/utils/timeUtils";



// const socket = io("http://localhost:3005"); 

const Quiz3Landing: FC = () => {

  const account = useAccount()
  const chainId = useChainId()
  // const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [roomId, setRoomId] = useState("")
 
  
  const { notifyError, notifySuccess } = useNotify()

  // const handleJoinQuiz = () => {
  //   socket.emit('joinQuiz', "abc");
  //   router.push('/play-quiz');
  // };

  return (
    <Flex
    w={"100%"}
    display={"flex"}
    justifyContent={"space-around"}
    flexWrap={"wrap"}
    gap={5}>

      <LoadingScreen isLoading={isLoading} />

      <VStack w={"45%"} minWidth={"270px"} gap={2} textAlign="left">

        <VStack w={"45%"} minWidth={"270px"} gap={2} textAlign="left">
        <Text textAlign="left" fontWeight="bold">RoomId</Text>
        <Input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="textarea"
          placeholder="Room Id"
        />
      </VStack>
        
        <Button
          colorScheme='teal' variant='solid'
          onClick={()=> {}}
          isLoading={isLoading}
          className="custom-button"
        >
          Enter Playground
        </Button>
          
      </VStack>
    </Flex>
  );
};

export default Quiz3Landing;
