'use client';

import { createConfig, http } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { scrollSepolia, sepolia } from 'wagmi/chains';

export function createWagmiConfig(rpcUrl: string, projectId?: string) {
  // Keep this till we fully deprecated RK inside the template
  if (projectId) {
    console.log('projectId:', projectId);
  }

  return createConfig({
    chains: [scrollSepolia, sepolia],
    connectors: [
      metaMask(),
    ],
    ssr: true,
    transports: {
      [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
      [scrollSepolia.id]: http(`https://scroll-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    },
  });
}