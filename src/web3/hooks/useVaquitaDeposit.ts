import { useVaquitaContract } from '@/components/_contracts/useVaquitaContract';
import { GroupResponseDTO } from '@/types';
import { useWagmiConfig } from '@/wagmi';
import { getPublicClient } from '@wagmi/core';
import { useCallback } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { BASE_SEPOLIA_USDC, USDC_DECIMALS, VAQUITA_CONTRACT_ADDRESS } from '../../constants';
import erc20Abi from '../ERC20ABI';

const convertFrequencyToTimestamp: any = (period: any): bigint => {
  const SECONDS_PER_DAY = 86400; // 24 hours * 60 minutes * 60 seconds
  const frequencyInDays = period === 'weekly' ? 7 : 30;
  const frequencyInSeconds = frequencyInDays * SECONDS_PER_DAY;
  return BigInt(frequencyInSeconds);
};

export const useVaquitaDeposit = () => {
  const { address } = useAccount();
  const { writeContract, writeContractAsync } = useWriteContract();
  const contract = useVaquitaContract();
  
  const wagmiConfig = useWagmiConfig();
  const client = getPublicClient(wagmiConfig);
  
  const approveTokens = useCallback(async (amount: bigint) => {
    if (!address) {
      throw new Error('No account connected');
    }
    
    try {
      const hash = await writeContractAsync({
        address: BASE_SEPOLIA_USDC,
        abi: erc20Abi,
        functionName: 'approve',
        args: [ VAQUITA_CONTRACT_ADDRESS, amount ],
      });
      console.log({ hash });
      const receipt = await client.waitForTransactionReceipt({
        hash,
        confirmations: 5,
      });
      console.log({ receipt });
      return true;
    } catch (error) {
      console.error('Error approving tokens:', error);
      return false;
    }
  }, [ writeContractAsync, address ]);
  
  const depositCollateralAndCreate = useCallback(
    async (
      group: GroupResponseDTO,
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.log({ group });
      const paymentAmount = BigInt(group.amount * USDC_DECIMALS);
      const numberOfPlayers = group.totalMembers;
      const frequencyOfTurns = convertFrequencyToTimestamp(group.period);
      const tokenMintAddress = BASE_SEPOLIA_USDC;
      
      try {
        const approved = await approveTokens(paymentAmount * BigInt(group.totalMembers));
        if (!approved) {
          throw new Error('Token approval failed');
        }
        
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'initializeRound',
          args: [
            group.id,
            paymentAmount,
            tokenMintAddress,
            numberOfPlayers,
            frequencyOfTurns,
            group.myPosition - 1,
          ],
        });
        console.log({ hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5,
        });
        console.log({ receipt });
        return { tx: hash, error: null, success: true };
      } catch (error) {
        console.error('Error in depositCollateralAndCreate:', error);
        return { tx: '', error, success: false };
      }
    },
    [ approveTokens, writeContractAsync, contract.abi ],
  );
  
  const depositCollateralAndJoin = useCallback(
    async (
      group: GroupResponseDTO,
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.log({ group });
      const paymentAmount = BigInt(group.amount * USDC_DECIMALS);
      
      try {
        const approved = await approveTokens(paymentAmount * BigInt(group.totalMembers));
        if (!approved) {
          throw new Error('Token approval failed');
        }
        
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'addPlayer',
          args: [ group.id, group.myPosition - 1 ],
        });
        console.log({ hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5,
        });
        console.log({ receipt });
        return { tx: hash, error: null, success: true };
      } catch (error) {
        console.error('Error in depositCollateralAndJoin:', error);
        return { tx: '', error, success: false };
      }
    },
    [ approveTokens, writeContractAsync, contract.abi ],
  );
  
  const depositRoundPayment = useCallback(
    async (
      group: GroupResponseDTO,
      turn: number,
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.log({ group, turn });
      const paymentAmount = BigInt(group.amount * USDC_DECIMALS);
      
      try {
        // First, approve the contract to spend tokens
        const approved = await approveTokens(paymentAmount);
        if (!approved) {
          throw new Error('Token approval failed');
        }
        
        // Then, call the contract function
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: 'payTurn',
          args: [ group.id, turn ],
        });
        console.log({ hash });
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5,
        });
        console.log({ receipt });
        return { tx: hash, error: null, success: true };
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
