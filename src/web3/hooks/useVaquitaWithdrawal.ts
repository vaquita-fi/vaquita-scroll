import { GroupResponseDTO } from '@/vaquita-ui-submodule/types';
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.info('withdrawalEarnedRound', { group });
      const groupId = BigInt(`0x${group.id}`);
      try {
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'withdrawTurn',
          args: [ groupId ],
          gas: 3000000n,
        });
        console.info({ hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5,
        });
        console.info({ receipt });
        return { tx: hash, error: null, success: receipt.status === "success" };
      } catch (error) {
        console.error({ error });
        return { tx: '', error, success: false };
      }
    }, []);
  
  const withdrawalCollateralAndEarnedInterest = useCallback(
    async (
      group: GroupResponseDTO,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.info('withdrawalCollateralAndEarnedInterest', { group });
      const groupId = BigInt(`0x${group.id}`);
      try {
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'withdrawFunds',
          args: [ groupId ],
          gas: 3000000n,
        });
        console.info({ hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5,
        });
        console.info({ receipt });
        return { tx: hash, error: null, success: receipt.status === "success" }
      } catch (error) {
        console.error({ error });
        return { tx: '', error, success: false };
      }
    }, []);
  
  return {
    withdrawalEarnedRound,
    withdrawalCollateralAndEarnedInterest,
  };
};
