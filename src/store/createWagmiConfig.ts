'use client';

import { createConfig, http } from 'wagmi';
import { optimismSepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

export function createWagmiConfig(rpcUrl: string, projectId?: string) {
  // Keep this till we fully deprecated RK inside the template
  if (projectId) {
    console.log('projectId:', projectId);
  }

  // BSC Testnet RPC URL
  const bscTestnetUrl = rpcUrl || 'https://sepolia.optimism.io';

  return createConfig({
    chains: [optimismSepolia],
    connectors: [
      metaMask(),
    ],
    ssr: true,
    transports: {
      [optimismSepolia.id]: http(bscTestnetUrl),
    },
  });
}