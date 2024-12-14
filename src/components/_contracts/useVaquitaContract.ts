import { optimismSepolia } from 'viem/chains';
import { generateContractHook } from '../../hooks/contracts';
import { VAQUITA_CONTRACT_ADDRESS } from '../../../src/constants';
import VaquitaABI from './VaquitaABI';

/**
 * Returns contract data for the InstallmentLoan contract.
 */
export const useVaquitaContract = generateContractHook({
  abi: VaquitaABI,
  [optimismSepolia.id]: {
    chain: optimismSepolia,
    address: VAQUITA_CONTRACT_ADDRESS,
  },

  // ... more chains for this contract go here
});
