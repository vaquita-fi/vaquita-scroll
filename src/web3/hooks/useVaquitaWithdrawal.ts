import { GroupResponseDTO } from '@/types';
import { useWagmiConfig } from '@/wagmi';
import { getPublicClient } from '@wagmi/core';
import { useCallback } from 'react';
import { useWriteContract } from 'wagmi';
import { useVaquitaContract } from '../../components/_contracts/useVaquitaContract';

const VAQUITA_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VAQUITA_CONTRACT_ADDRESS as `0x${string}`;

export const useVaquitaWithdrawal = () => {
  const { writeContractAsync } = useWriteContract();
  const contract = useVaquitaContract();
  const wagmiConfig = useWagmiConfig();
  const client = getPublicClient(wagmiConfig);
  
  const withdrawalEarnedRound = useCallback(
    async (
      group: GroupResponseDTO,
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.log({ group });
      const tx = 'test';
      let error; // = false;
      try {
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'withdrawTurn',
          args: [ group.id ],
        });
        console.log({ hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5,
        });
        console.log({ receipt });
        return { tx: hash, error: null, success: true };
      } catch (error) {
        console.log({ error });
        error = true;
        return { tx: '', error, success: false };
      }
    },
    [],
  );
  
  const withdrawalCollateralAndEarnedInterest = useCallback(
    async (
      group: GroupResponseDTO,
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.log({ group });
      const tx = 'test';
      let error; // = false;
      try {
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'withdrawFunds',
          args: [ group.id ],
        });
        console.log({ hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5,
        });
        console.log({ receipt });
        return { tx: hash, error: null, success: true };
      } catch (error) {
        console.log({ error });
        error = true;
        return { tx: '', error, success: false };
      }
    },
    [],
  );
  
  return {
    withdrawalTurn: withdrawalEarnedRound,
    withdrawalFunds: withdrawalCollateralAndEarnedInterest,
  };
};
