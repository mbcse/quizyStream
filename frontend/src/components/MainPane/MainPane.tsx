// components/MainPane.tsx
import { type FC } from "react";

import { Box, Divider, Flex, Heading, Text, useColorMode } from "@chakra-ui/react";
import { useAccount } from "wagmi";


import {
  Address,
} from "./components";
import Quiz3Landing from "./components/Quiz3Landing";
import styles from "@/styles/mainPane.module.css";

const MainPane: FC = () => {
  const { isConnected } = useAccount();
  const { colorMode } = useColorMode();

  return (
    <Box
      className={styles.container}
      border={colorMode === "light" ? "none" : "1px solid rgba(152, 161, 192, 0.24)"}
    >
      <Heading as="h2" fontSize={"2rem"} mb={1} className="text-shadow">
        Quiz3
      </Heading>

      <Heading as="h6" fontSize={"1rem"} mb={10} className="text-shadow">
        <Text color="orange.500">Onchain Gamified Learning for Web3</Text>
      </Heading>

      

      <Flex className={styles.content}>
        {/* <Status /> */}

        {isConnected? (
          <>
            <Address />

            <Divider mb={5} />

            <Flex
              w={"100%"}
              display={"flex"}
              justifyContent={"space-around"}
              flexWrap={"wrap"}
              gap={5}
            >
              {/* <SignMessage />
              <TransferNative /> */}

              <Quiz3Landing />
            </Flex>
          </>
        ): (
          <Text>Connect to a wallet to quizzzzzz!</Text>
        )
        
        }
      </Flex>
    </Box>
  );
};

export default MainPane;
