import { baseSepolia } from 'viem/chains';
import { generateContractHook } from '../../hooks/contracts';
import { VAQUITA_CONTRACT_ADDRESS } from '../../../src/constants';
import VaquitaABI from './VaquitaABI';

/**
 * Returns contract data for the InstallmentLoan contract.
 */
export const useVaquitaContract = generateContractHook({
  abi: VaquitaABI,
  [baseSepolia.id]: {
    chain: baseSepolia,
    address: VAQUITA_CONTRACT_ADDRESS,
  },

  // ... more chains for this contract go here
});
