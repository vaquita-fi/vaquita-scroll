import { useVaquitaContract } from '@/components/_contracts/useVaquitaContract';
import { GroupResponseDTO } from '@/vaquita-ui-submodule/types';
import { useWagmiConfig } from '@/wagmi';
import { getPublicClient } from '@wagmi/core';
import { useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import erc20Abi from '../ERC20ABI';

const USDC_DECIMALS = Number(process.env.NEXT_PUBLIC_USDC_DECIMALS);
const USDC_CONTRACT = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS as `0x${string}`;
const VAQUITA_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_VAQUITA_CONTRACT_ADDRESS as `0x${string}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertFrequencyToTimestamp: any = (period: any): bigint => {
  const SECONDS_PER_DAY = 86400; // 24 hours * 60 minutes * 60 seconds
  const frequencyInDays = period === 'weekly' ? 7 : 30;
  const frequencyInSeconds = frequencyInDays * SECONDS_PER_DAY;
  return BigInt(frequencyInSeconds);
};

export const useVaquitaDeposit = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const contract = useVaquitaContract();
  
  const wagmiConfig = useWagmiConfig();
  const client = getPublicClient(wagmiConfig);
  
  const approveTokens = useCallback(async (amount: bigint) => {
    if (!address) {
      throw new Error('No account connected');
    }
    console.info('approveTokens', { amount });
    
    try {
      const hash = await writeContractAsync({
        address: USDC_CONTRACT,
        abi: erc20Abi,
        functionName: 'approve',
        args: [ VAQUITA_CONTRACT_ADDRESS, amount ],
      });
      console.info('approveTokens', { hash });
      const receipt = await client.waitForTransactionReceipt({
        hash,
        confirmations: 1,
      });
      console.info('approveTokens', { receipt });
      return true;
    } catch (error) {
      console.error('Error approving tokens:', error);
      return false;
    }
  }, [ writeContractAsync, address ]);
  
  const depositCollateralAndCreate = useCallback(
    async (
      group: GroupResponseDTO,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<{ tx: string; error: any; success: boolean; receipt: any; }> => {
      console.info('depositCollateralAndCreate', { group });
      const groupId = BigInt(`0x${group.id}`);
      const paymentAmount = BigInt(group.amount * USDC_DECIMALS);
      const numberOfPlayers = BigInt(group.totalMembers);
      const frequencyOfTurns = convertFrequencyToTimestamp(group.period);
      const tokenMintAddress = USDC_CONTRACT;
      const collateralAmount = paymentAmount * (numberOfPlayers - BigInt(1));
      
      try {
        const approved = await approveTokens(collateralAmount);
        if (!approved) {
          throw new Error('Token approval failed');
        }
        
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'initializeRound',
          args: [
            groupId,
            paymentAmount,
            tokenMintAddress,
            numberOfPlayers,
            frequencyOfTurns,
          ],
        });
        console.info('depositCollateralAndCreate', { hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        });
        console.info('depositCollateralAndCreate', { receipt });
        return { tx: hash, receipt, error: null, success: receipt.status === "success" };
      } catch (error) {
        console.error('Error in depositCollateralAndCreate:', error);
        return { tx: '', receipt: null, error, success: false };
      }
    },
    [ approveTokens, writeContractAsync, contract.abi ],
  );
  
  const depositCollateralAndJoin = useCallback(
    async (
      group: GroupResponseDTO,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<{ tx: string; receipt: any; error: any; success: boolean }> => {
      console.info('depositCollateralAndJoin', { group });
      const groupId = BigInt(`0x${group.id}`);
      const paymentAmount = BigInt(group.amount * USDC_DECIMALS);
      const collateralAmount = paymentAmount * (BigInt(group.totalMembers) - BigInt(1));
      
      try {
        const approved = await approveTokens(collateralAmount);
        if (!approved) {
          throw new Error('Token approval failed');
        }
        
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'addPlayer',
          args: [ groupId ],
        });
        console.info('depositCollateralAndJoin', { hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        });
        console.info('depositCollateralAndJoin', { receipt });
        return { tx: hash, receipt, error: null, success: receipt.status === "success" };
      } catch (error) {
        console.error('Error in depositCollateralAndJoin:', error);
        return { tx: '', receipt: null, error, success: false };
      }
    },
    [ approveTokens, writeContractAsync, contract.abi ],
  );
  
  const depositRoundPayment = useCallback(
    async (
      group: GroupResponseDTO,
      turn: number,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.info('depositRoundPayment', { group, turn });
      const groupId = BigInt(`0x${group.id}`);
      const paymentAmount = BigInt(group.amount * USDC_DECIMALS);
      const collateralAmount = paymentAmount * (BigInt(group.totalMembers) - BigInt(1));
      
      try {
        // First, approve the contract to spend tokens
        const approved = await approveTokens(collateralAmount);
        if (!approved) {
          throw new Error('Token approval failed');
        }
        
        // Then, call the contract function
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'payTurn',
          args: [ groupId ],
        });
        console.info('depositRoundPayment', { hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 1,
        });
        console.info('depositRoundPayment', { receipt });
        return { tx: hash, error: null, success: receipt.status === "success" };
      } catch (error) {
        console.error('Error in depositRoundPayment:', error);
        return { tx: '', error, success: false };
      }
    },
    [ approveTokens, writeContractAsync, contract.abi ],
  );
  
  return {
    depositCollateralAndCreate,
    depositCollateralAndJoin,
    depositRoundPayment,
  };
};
