
import type { ReactNode } from "react";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import "@/styles/globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "@rainbow-me/rainbowkit/styles.css";

import {Providers} from "./providers";

const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuizyStream",
  applicationName: "QuizyStream",
  description: "Quiz with streams",
  authors: {
    name: "Mohit",
    url: "",
  },
  icons: "favicon.svg",
  manifest: "site.webmanifest",
};

import {
  DynamicContextProvider,
  DynamicWagmiConnector,
  } from "../dynamic";



export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">


      <DynamicContextProvider
          settings={{
          environmentId: "b94d1a6a-5b03-4a35-afb6-cf1fccf82d3a",
          walletConnectors: [EthereumWalletConnectors],

          }}
      >

      <body className={open_sans.className}>
      
        <Providers>
        <DynamicWagmiConnector>

          {children}
        </DynamicWagmiConnector>
        </Providers>

      </body>

      </DynamicContextProvider>
    </html>
  );
}
