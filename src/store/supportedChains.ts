import * as viemChains from 'viem/chains';
import { Environment, getCurrentEnvironment } from './environment';
import { getChainByName } from '../web3/utils/crypto';

const network = getChainByName(viemChains, process.env.NEXT_PUBLIC_NETWORK!);

// The list of supported Chains for a given environment
export const SUPPORTED_CHAINS: Record<Environment, [viemChains.Chain, ...viemChains.Chain[]]> = {
  [Environment.localhost]: [network],
  [Environment.development]: [network],
  [Environment.staging]: [network],
  [Environment.production]: [network],
};

/**
 * Gets the list of supported chains for a given environment.
 * Defaults to the current environment.
 * @param env
 */
export function getChainsForEnvironment(env?: Environment) {
  if (!env) {
    env = getCurrentEnvironment();
  }
  return SUPPORTED_CHAINS[env];
}

export function getChainById(chainId: string) {
  const chains = getChainsForEnvironment();
  return chains?.find((c: viemChains.Chain) => c.id === Number(chainId)) ?? null;
}
