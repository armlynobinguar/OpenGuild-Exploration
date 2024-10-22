"use client";
import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Import your relevant components
import { Toaster } from "sonner";

import dynamic from "next/dynamic";
const ContractProvider = dynamic(
  () =>
    import("@/components/ContractProvider").then(
      (module) => module.default
    ) as any,
  { ssr: false }
) as any;

type Props = {} & PropsWithChildren;
const queryClient = new QueryClient();

const NoteTakingProvider: React.FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContractProvider autoConnect>{children}</ContractProvider>
      <Toaster />
    </QueryClientProvider>
  );
};

export default NoteTakingProvider; // Updated export name
