'use client';

import { createConfig, http } from 'wagmi';
import * as viemChains from 'viem/chains';
import { getChainByName } from '../web3/utils/crypto';
import { metaMask } from 'wagmi/connectors';

const network = getChainByName(viemChains, process.env.NEXT_PUBLIC_NETWORK!);

export function createWagmiConfig(rpcUrl: string, projectId?: string) {
  // Keep this till we fully deprecated RK inside the template
  if (projectId) {
    console.log('projectId:', projectId);
  }

  return createConfig({
    chains: [network],
    connectors: [
      metaMask(),
    ],
    ssr: true,
    transports: {
      [network.id]: http(rpcUrl),
    },
  });
}