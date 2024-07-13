"use client";
import { type FC } from "react";

import { Button, HStack, Heading } from "@chakra-ui/react";
import {
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";



import logo from "../../../public/img/logo_transparent.png";
import TokenTreat from "../../../public/img/TokenTreat.svg";
import { DarkModeButton } from "../DarkModeButton";
import { useWindowSize } from "@/hooks/useWindowSize";




const Header: FC = () => {
  let {address} = useAccount();
  const { isTablet } = useWindowSize();

  if(!address) {
    address = "0x0000000000000000000000000000000000000000" // 0 zero address
  }

  return (
    <HStack
      as="header"
      p={"1.5rem"}
      position="sticky"
      top={0}
      zIndex={10}
      justifyContent={"space-between"}
    >
      <HStack>
        <Image src={TokenTreat.src} alt="logo" width={45} height={45} />
        {!isTablet && (
          <Link href={"/"}>
          <Heading as="h1" fontSize={"1.5rem"} className="text-shadow">
            Quiz3
          </Heading>
          </Link>
        )}
      </HStack>

      <HStack>
        <Button colorScheme='green'><Link href="/dashboard"> Dashboard </Link></Button>
        <DynamicWidget />
        {/* <ConnectButton /> */}

        <DarkModeButton />
      </HStack>
    </HStack>
  );
};

export default Header;
