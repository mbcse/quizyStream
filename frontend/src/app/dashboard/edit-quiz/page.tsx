"use client";
import { useEffect, useState } from "react";

import { Box, Flex, Text, Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useAccount, useChainId } from "wagmi";

import { Footer, Header } from "@/components";
import LoadingScreen from "@/components/MainPane/components/LoadingScreen";
import {SideBar} from "@/components/Sidebar";
import { useNotify } from "@/hooks";
import { getDefaultEthersSigner } from "@/utils/clientToEtherjsSigner";
import { convertToUnixTimestamp, formatUnixTimestamp } from "@/utils/timeUtils";

export default function CreatedTreats() {
  const { notifyError, notifySuccess } = useNotify();

  const account = useAccount();
  const chainId = useChainId();

  const [isLoading, setIsLoading] = useState(false);


  return (
    <Flex flexDirection="column" minHeight="100vh" bg="gray.50">
      <LoadingScreen isLoading={isLoading} />
      <Header />
      <Flex>
        <SideBar />
        <Box as="main" flex={1} p={6} ml="250px">
          <Text fontSize="4xl" mb={6} color="purple.700">My Created Treats</Text>
          <TableContainer>
            <Table variant="striped" colorScheme="purple">
              <TableCaption>Edit Quiz</TableCaption>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Description</Th>
                  <Th>Amount</Th>
                  <Th>Issued To</Th>
                  <Th>Expiry</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
}