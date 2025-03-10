'use client';

import { GroupHeader } from '@/vaquita-ui-submodule/components/group/GroupHeader';
import { TitleLayout } from '@/vaquita-ui-submodule/components/layouts/TitleLayout';
import { SummaryAction } from '@/vaquita-ui-submodule/components/summaryAction';
import { Tabs } from '@/vaquita-ui-submodule/components/tabs';
import { useVaquitaDeposit, useVaquitaWithdrawal } from '@/web3/hooks';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { logError, showAlert, showNotification } from '../../helpers';
import { useGroup } from '../../hooks';
import { AddressType, GroupStatus } from '../../types';
import { Button } from '../buttons';
import { GroupTablePayments } from '../group/GroupTablePayments';
import { LoadingBackdropSpinner } from '../loadingSpinner';
import { Message } from '../message';
import { BuildingStatus } from '../status';

export const GroupViewPage = ({
                                groupId,
                                address,
                                onExit,
                              }: {
  groupId: string;
  onExit: () => void;
  address?: AddressType;
}) => {
  const router = useRouter();
  const [ isLoading, setIsLoading ] = useState(false);
  const { depositCollateralAndJoin } = useVaquitaDeposit();
  const { withdrawalEarnedRound, withdrawalCollateralAndEarnedInterest } =
    useVaquitaWithdrawal();
  const {
    getGroup,
    joinGroup,
    disjoinGroup,
    depositGroupCollateral,
    withdrawalGroupFunds,
    withdrawalGroupEarnedRound,
  } = useGroup();
  const {
    isPending: isPendingData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    data,
    refetch,
  } = useQuery({
    queryKey: [ 'group', address ],
    queryFn: () => getGroup(groupId, address),
  });
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  
  const loading = isPendingData || isLoadingData || isFetchingData;
  
  useEffect(() => {
    if ((!loading && !data?.success) || !address) {
      setTimeout(() => {
        router.push('/');
      }, 3000);
    }
  }, [ loading, data?.success, address ]);
  
  if (!address) {
    return (
      <TitleLayout>
        <p>Please select a wallet</p>
        <p>redirecting to home...</p>
      </TitleLayout>
    );
  }
  
  if (!data) {
    return <LoadingBackdropSpinner />;
  }
  
  if (!data.success) {
    return (
      <TitleLayout>
        <p>group not found</p>
        <p>redirecting to home...</p>
      </TitleLayout>
    );
  }
  
  const group = data.content;
  
  const isActive = group.status === GroupStatus.ACTIVE;
  const isConcluded = group.status === GroupStatus.CONCLUDED;
  const step1 = !!group.myDeposits[0]?.successfullyDeposited;
  const step2 = step1 && group.slots === 0;
  const step3 = step1 && step2 && isActive;
  
  const handleDepositCollateral = async () => {
    setIsLoading(true);
    if (!address) {
      return;
    }
    
    try {
      // const response = await joinGroup(group.id, address);
      // if (response.success) {
      const joinedGroup = group;
      const amount = joinedGroup.collateralAmount;
      const { tx, receipt, error, success } = await depositCollateralAndJoin(joinedGroup);
      if (!success) {
        logError('transaction error', error);
        throw new Error('transaction error');
      }
      const playerAddedDataLog = receipt?.logs?.[9]?.data ?? '';
      await joinGroup(group.id, address, playerAddedDataLog);
      await depositGroupCollateral(joinedGroup.id, address, tx, amount);
      await refetch();
      showNotification('You\'ve successfully joined the group!', 'success');
      // } else {
      //   showNotification(response.message, 'error');
      // }
    } catch (error) {
      await disjoinGroup(group.id, address);
      logError('Failed to join the group', error);
      showNotification('Failed to join the group', 'error');
    }
    setIsLoading(false);
  };
  
  const handleWithdrawTurn = async () => {
    setIsLoading(true);
    if (!address) {
      return;
    }
    try {
      const amount = group.amount;
      const { tx, error, success } = await withdrawalEarnedRound(group);
      if (!success) {
        logError('transaction error', error);
        throw new Error('transaction error');
      }
      await withdrawalGroupEarnedRound(group.id, address, tx, amount);
      await refetch();
      showNotification(
        'Withdrawal successful! You\'ve earned your round.',
        'success',
      );
    } catch (error) {
      logError('Failed to withdraw your earned round.', error);
      showNotification('Failed to withdraw your earned round.', 'error');
    }
    setIsLoading(false);
  };
  
  const handleWithdrawFunds = async () => {
    setIsLoading(true);
    if (!address) {
      return;
    }
    try {
      const { tx, error, success } =
        await withdrawalCollateralAndEarnedInterest(group);
      if (!success) {
        logError('transaction error', error);
        throw new Error('transaction error');
      }
      const amount = group.collateralAmount;
      await withdrawalGroupFunds(group.id, address, tx, amount);
      await refetch();
      showNotification(
        'Withdrawal successful! Your funds has been withdrawn.',
        'success',
      );
    } catch (error) {
      logError('Failed to withdraw your funds.', error);
      showNotification('Failed to withdraw your funds.', 'error');
    }
    setIsLoading(false);
  };
  
  // const handleNavigateToPayments = () => {
  //   router.push(`/groups/${groupId}/payments?myGroups=true`);
  // };
  //
  // const { items, firstUnpaidItemIndex } = getPaymentsTable(group);
  //
  // const totalPayments = Object.values(group.myDeposits).reduce(
  //   (sum, deposit) =>
  //     sum + (deposit.successfullyDeposited && deposit.round > 0 ? 1 : 0),
  //   0
  // );
  // const allPaymentsDone = totalPayments === group.totalMembers - 1;
  
  return (
    <>
      {(loading || isLoading) && <LoadingBackdropSpinner />}
      {group && (
        <div className="flex flex-col gap-2">
          <GroupHeader {...group} onBack={onExit} />
          {!isActive && !isConcluded && group.slots > 0 && (
            <BuildingStatus
              value1={step1}
              label1={step1 ? 'Collateral Deposited' : 'Deposit Collateral'}
              value2={step2}
              label2={
                group.slots
                  ? `Pending members`
                  : `Completed members (${group.totalMembers})`
              }
              value3={step3}
              label3="Awaiting Start"
            />
          )}
          {group.status === GroupStatus.PENDING &&
            !step1 &&
            group.slots > 0 && (
              <Message
                messageText={
                  'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately.'
                }
              />
            )}
          {group.status === GroupStatus.PENDING && step1 && !step2 && (
            <Message
              messageText={
                'We are waiting for the group to be fully filled by the specified date. If the group isn\'t complete by then, the collateral you deposited will be returned.'
              }
            />
          )}
          {group.status === GroupStatus.PENDING && step1 && step2 && !step3 && (
            <Message
              messageText={
                'The group is all set! We\'re just waiting for the start date to kick things off.'
              }
            />
          )}
          <div className="flex flex-col gap-5 justify-between mb-4">
            {!step1 && !!group.slots && address && (
              <Button
                label="Join and deposit collateral"
                size="large"
                onClick={handleDepositCollateral}
              />
            )}
          </div>
          {group.status !== GroupStatus.PENDING && (
            <Tabs
              tabs={[
                { label: 'Deposit', value: 'deposit' },
                { label: 'Withdraw', value: 'withdraw' },
              ]}
            />
          )}
          {group.status !== GroupStatus.PENDING && group && tab === 'deposit' && (
            <GroupTablePayments
              address={address}
              group={group}
              refetch={refetch}
            />
          )}
          {group.status !== GroupStatus.PENDING && group && tab === 'withdraw' && (
            <>
              <SummaryAction
                title="Claim Vaquita"
                content={
                  <>
                    {isActive ? (
                      <p>Current position: {group.currentPosition}</p>
                    ) : (
                      <p></p>
                    )}
                    <p>Your Position: {group.myPosition}</p>
                  </>
                }
                actionLabel={
                  group.myWithdrawals.round.successfullyWithdrawn
                    ? 'Withdrawn'
                    : 'Withdraw'
                }
                disabled={
                  !(
                    group.myWithdrawals.round.enabled &&
                    !group.myWithdrawals.round.successfullyWithdrawn
                  )
                }
                onAction={
                  group.myWithdrawals.round.enabled &&
                  !group.myWithdrawals.round.successfullyWithdrawn
                    ? handleWithdrawTurn
                    : undefined
                }
              />
              <SummaryAction
                title="Finish Vaquita"
                content={
                  <>
                    <p>+{group.collateralAmount} USDC (Collateral)</p>
                    {/*<p>+1.5 USDC (Interested earned)</p>*/}
                  </>
                }
                actionLabel={
                  group.myWithdrawals.collateral.successfullyWithdrawn
                    ? 'Withdrawn'
                    : 'Withdraw'
                }
                disabled={
                  !(
                    group.myWithdrawals.collateral.enabled &&
                    !group.myWithdrawals.collateral.successfullyWithdrawn
                  )
                }
                onAction={() => {
                  if (
                    group.myWithdrawals.collateral.enabled &&
                    !group.myWithdrawals.collateral.successfullyWithdrawn
                  ) {
                    void handleWithdrawFunds();
                  } else {
                    showAlert(
                      'Ups',
                      'The funds cannot be withdrawn if the Vaquita has not finished yet',
                      'warning',
                      'Understood',
                    );
                  }
                }}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
