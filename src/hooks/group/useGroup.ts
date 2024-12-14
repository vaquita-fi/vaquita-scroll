import { includeApi } from '@/helpers/api';
import {
  GroupCreateDTO,
  GroupCrypto,
  GroupDepositDTO,
  GroupPeriod,
  GroupResponseDTO,
  GroupStatus,
  GroupWithdrawalDTO,
  GroupWithdrawalType,
} from '@/types';
import { useCallback } from 'react';

export const useGroup = () => {
  const getGroups = useCallback(
    async ({
             orderBy,
             crypto,
             myGroups,
             publicKey,
             status,
             period,
             amount,
           }: {
      orderBy: string;
      crypto: string;
      myGroups?: true;
      publicKey?: `0x${string}` | undefined;
      status?: GroupStatus;
      period?: GroupPeriod;
      amount?: number;
    }): Promise<{ contents: GroupResponseDTO[] }> => {
      const response = await fetch(
        includeApi(
          '/group' +
          `?orderBy=${encodeURIComponent(orderBy)}` +
          `&crypto=${crypto}` +
          `${period !== GroupPeriod.ALL ? `&period=${period}` : ''}` +
          `${myGroups ? `&myGroups=true` : ''}` +
          `${amount ? `&amount=${amount}` : ''}` +
          `${publicKey ? `&customerPublicKey=${publicKey}` : ''}` +
          `${status ? `&status=${status}` : ''}`,
        ),
      );
      
      return await response.json();
    },
    [],
  );
  
  const createGroup = useCallback(
    async (
      name: string,
      amount: number,
      crypto: GroupCrypto,
      totalMembers: number,
      period: GroupPeriod,
      startsOnTimestamp: number,
      publicKey: `0x${string}`,
    ) => {
      const newGroupPayload: GroupCreateDTO = {
        name: name,
        amount: amount,
        crypto: crypto,
        totalMembers: totalMembers,
        period: period,
        startsOnTimestamp: startsOnTimestamp,
        customerPublicKey: publicKey,
      };
      const result = await fetch(includeApi('/group/create'), {
        method: 'POST',
        body: JSON.stringify(newGroupPayload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = await result.json();
      return body?.content as GroupResponseDTO;
    },
    [],
  );
  
  const deleteGroup = useCallback(async (groupId: string) => {
    return await fetch(includeApi(`/group/${groupId}`), {
      method: 'DELETE',
    });
  }, []);
  
  const getGroup = useCallback(
    async (
      groupId: string,
      publicKey?: `0x${string}`,
    ): Promise<{ content: GroupResponseDTO }> => {
      const result = await fetch(
        includeApi(
          `/group/${groupId}?customerPublicKey=${publicKey}`,
        ),
        { method: 'GET' },
      );
      return await result.json();
    },
    [],
  );
  
  const joinGroup = useCallback(
    async (
      groupId: string,
      publicKey: `0x${string}`,
    ): Promise<GroupResponseDTO> => {
      const payload = {
        customerPublicKey: publicKey,
      };
      const result = await fetch(includeApi(`/group/${groupId}/join`), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return (await result.json()).content;
    },
    [],
  );
  
  const disjoinGroup = useCallback(
    async (
      groupId: string,
      publicKey: `0x${string}`,
    ): Promise<GroupResponseDTO> => {
      const payload = {
        customerPublicKey: publicKey,
      };
      const result = await fetch(includeApi(`/group/${groupId}/disjoin`), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await result.json();
    },
    [],
  );
  
  const depositGroupCollateral = useCallback(
    async (
      groupId: string,
      publicKey: `0x${string}`,
      transactionSignature: string,
      amount: number,
    ) => {
      const payload: GroupDepositDTO = {
        customerPublicKey: publicKey,
        transactionSignature,
        round: 0,
        amount,
      };
      return await fetch(includeApi(`/group/${groupId}/deposit`), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    [],
  );
  
  const depositGroupPayment = useCallback(
    async (
      groupId: string,
      publicKey: `0x${string}`,
      transactionSignature: string,
      round: number,
      amount: number,
    ) => {
      const payload: GroupDepositDTO = {
        customerPublicKey: publicKey,
        transactionSignature,
        round,
        amount,
      };
      return await fetch(includeApi(`/group/${groupId}/deposit`), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    [],
  );
  
  const withdrawalGroupCollateral = useCallback(
    async (
      groupId: string,
      publicKey: `0x${string}`,
      transactionSignature: string,
      amount: number,
    ) => {
      const payload: GroupWithdrawalDTO = {
        customerPublicKey: publicKey,
        transactionSignature,
        type: GroupWithdrawalType.COLLATERAL,
        amount,
      };
      return await fetch(includeApi(`/group/${groupId}/withdrawal`), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    [],
  );
  
  const withdrawalGroupEarnedInterest = useCallback(
    async (
      groupId: string,
      publicKey: `0x${string}`,
      transactionSignature: string,
      amount: number,
    ) => {
      const payload: GroupWithdrawalDTO = {
        customerPublicKey: publicKey,
        transactionSignature,
        type: GroupWithdrawalType.INTEREST,
        amount,
      };
      return await fetch(includeApi(`/group/${groupId}/withdrawal`), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    [],
  );
  
  const withdrawalGroupEarnedRound = useCallback(
    async (
      groupId: string,
      publicKey: `0x${string}`,
      transactionSignature: string,
      amount: number,
    ) => {
      const payload: GroupWithdrawalDTO = {
        customerPublicKey: publicKey,
        transactionSignature,
        type: GroupWithdrawalType.ROUND,
        amount,
      };
      return await fetch(includeApi(`/group/${groupId}/withdrawal`), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    [],
  );
  
  return {
    getGroups,
    getGroup,
    createGroup,
    joinGroup,
    disjoinGroup,
    deleteGroup,
    depositGroupCollateral,
    depositGroupPayment,
    withdrawalGroupCollateral,
    withdrawalGroupEarnedRound,
    withdrawalGroupEarnedInterest,
  };
};
