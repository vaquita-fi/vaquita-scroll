import { useCallback } from 'react';
import { authorizedRequest, cleanRequest, includeApi } from '../helpers';
import {
  ContentResponseType,
  ContentsResponseType,
  GroupCreateDTO,
  GroupCrypto,
  GroupDepositDTO,
  GroupPeriod,
  GroupResponseDTO,
  GroupStatus,
  GroupWithdrawalDTO,
  GroupWithdrawalType,
} from '../types';

type PublicKey = string;

export const useGroup = () => {
  const getGroups = useCallback(
    async ({
      name,
      orderBy,
      crypto,
      myGroups,
      publicKey,
      status,
      period,
      amount,
      minAmount,
      maxAmount,
    }: {
      name: string | null;
      orderBy: string;
      crypto: string | null;
      myGroups?: true;
      publicKey?: PublicKey | null;
      status: GroupStatus | null;
      period: GroupPeriod | null;
      amount: number | null;
      minAmount: number | null;
      maxAmount: number | null;
    }) => {
      return cleanRequest<ContentsResponseType<GroupResponseDTO>>(
        await authorizedRequest(
          includeApi(
            '/group' +
              `?orderBy=${encodeURIComponent(orderBy)}` +
              `&crypto=${crypto}` +
              `${name ? `&name=${name}` : ''}` +
              `${period ? `&period=${period}` : ''}` +
              `${myGroups ? `&myGroups=true` : ''}` +
              `${amount ? `&amount=${amount}` : ''}` +
              `${minAmount ? `&minAmount=${minAmount}` : ''}` +
              `${maxAmount ? `&maxAmount=${maxAmount}` : ''}` +
              `${publicKey ? `&customerPublicKey=${publicKey}` : ''}` +
              `${status ? `&status=${status}` : ''}`
          )
        )
      );
    },
    []
  );

  const createGroup = useCallback(
    async (
      name: string,
      amount: number,
      crypto: GroupCrypto,
      totalMembers: number,
      period: GroupPeriod,
      startsOnTimestamp: number,
      publicKey: PublicKey
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
      return cleanRequest<ContentResponseType<GroupResponseDTO>>(
        await result.text()
      );
    },
    []
  );

  const deleteGroup = useCallback(async (groupId: string) => {
    return await fetch(includeApi(`/group/${groupId}`), {
      method: 'DELETE',
    });
  }, []);

  const getGroup = useCallback(
    async (
      groupId: string,
      publicKey?: PublicKey
    ): Promise<{ content: GroupResponseDTO }> => {
      const result = await fetch(
        includeApi(`/group/${groupId}?customerPublicKey=${publicKey}`),
        { method: 'GET' }
      );
      return await result.json();
    },
    []
  );

  const joinGroup = useCallback(
    async (groupId: string, publicKey: PublicKey) => {
      const payload = {
        customerPublicKey: publicKey,
      };
      return cleanRequest<ContentResponseType<GroupResponseDTO>>(
        await authorizedRequest(includeApi(`/group/${groupId}/join`), {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
    },
    []
  );

  const disjoinGroup = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey
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
    []
  );

  const depositGroupCollateral = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey,
      transactionSignature: string,
      amount: number
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
    []
  );

  const depositGroupPayment = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey,
      transactionSignature: string,
      round: number,
      amount: number
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
    []
  );

  const withdrawalGroupFunds = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey,
      transactionSignature: string,
      amount: number
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
    []
  );

  const withdrawalGroupEarnedRound = useCallback(
    async (
      groupId: string,
      publicKey: PublicKey,
      transactionSignature: string,
      amount: number
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
    []
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
    withdrawalGroupFunds,
    withdrawalGroupEarnedRound,
  };
};
