import * as viemChains from 'viem/chains';
import { getChainByName } from '../../web3/utils/crypto';
import { generateContractHook } from '../../hooks/contracts';
import VaquitaABI from './VaquitaABI';

const VAQUITA_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VAQUITA_CONTRACT_ADDRESS as `0x${string}`;
const network = getChainByName(viemChains, process.env.NEXT_PUBLIC_NETWORK!);

/**
 * Returns contract data for the Vaquita contract.
 */
export const useVaquitaContract = generateContractHook({
  abi: VaquitaABI,
  [network.id]: {
    chain: network,
    address: VAQUITA_CONTRACT_ADDRESS,
  },

  // ... more chains for this contract go here
});
