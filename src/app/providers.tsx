"use client"

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { useState, type ReactNode } from 'react'
// import { WagmiProvider } from 'wagmi'

// import { config } from '@/wagmi'

// export function Providers(props: { children: ReactNode }) {
//   const [queryClient] = useState(() => new QueryClient())

//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         {props.children}
//       </QueryClientProvider>
//     </WagmiProvider>
//   )
// }


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { config } from "@/wagmi";

export const Providers = (props: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          {props.children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
