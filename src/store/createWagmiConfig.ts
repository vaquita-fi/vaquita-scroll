'use client';

import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

export function createWagmiConfig(rpcUrl: string, projectId?: string) {
  // Keep this till we fully deprecated RK inside the template
  if (projectId) {
    console.log('projectId:', projectId);
  }

  // Base Testnet RPC URL
  const baseSepoliaUrl = rpcUrl || 'https://sepolia.base.org';

  return createConfig({
    chains: [baseSepolia],
    connectors: [
      metaMask(),
    ],
    ssr: true,
    transports: {
      [baseSepolia.id]: http(baseSepoliaUrl),
    },
  });
}