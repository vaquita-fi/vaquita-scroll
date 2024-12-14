import { GroupResponseDTO } from "@/types";
import { useCallback } from "react";
import { useWriteContract } from "wagmi";
import { useVaquitaContract } from "../../components/_contracts/useVaquitaContract";
import { useWagmiConfig } from "@/wagmi";
import { getPublicClient } from '@wagmi/core';
import {
  OP_SEPOLIA_USDC,
  USDC_DECIMALS,
  VAQUITA_CONTRACT_ADDRESS,
} from "../../constants";

export const useVaquinhaWithdrawal = () => {
  const { writeContractAsync } = useWriteContract();
  const contract = useVaquitaContract();
  const wagmiConfig = useWagmiConfig();
  const client = getPublicClient(wagmiConfig);

  const withdrawalCollateral = useCallback(
    async (
      group: GroupResponseDTO
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.log({ group });
      const tx = "test";
      let error; // = false;
      try {
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: "withdrawCollateral",
          args: [group.id],
        });
        console.log({hash});
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5
        });
        console.log({receipt});
        return { tx: hash, error: null, success: true };
      } catch (error) {
        console.log({ error });
        error = true;
        return { tx: "", error, success: false };
      }
    },
    []
  );

  const withdrawalEarnedRound = useCallback(
    async (
      group: GroupResponseDTO
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.log({ group });
      const tx = "test";
      let error; // = false;
      try {
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: "withdrawTurn",
          args: [group.id],
        });
        console.log({hash});
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5
        });
        console.log({receipt});
        return { tx: hash, error: null, success: true };
      } catch (error) {
        console.log({ error });
        error = true;
        return { tx: "", error, success: false };
      }
    },
    []
  );

  const withdrawalEarnedInterest = useCallback(
    async (
      group: GroupResponseDTO,
      amount: number
    ): Promise<{ tx: string; error: any; success: boolean }> => {
      console.log({ group });
      const tx = "test";
      let error; // = false;
      try {
        const hash = await writeContractAsync({
          address: VAQUITA_CONTRACT_ADDRESS,
          abi: contract.abi,
          functionName: "withdrawInterest",
          args: [group.id],
        });
        console.log({hash});
        const receipt = await client.waitForTransactionReceipt({
          hash,
          confirmations: 5
        });
        console.log({receipt});
        return { tx: hash, error: null, success: true };
      } catch (error) {
        console.log({ error });
        error = true;
        return { tx: "", error, success: false };
      }
    },
    []
  );

  return {
    withdrawalEarnedRound,
    withdrawalCollateral,
    withdrawalEarnedInterest,
  };
};
