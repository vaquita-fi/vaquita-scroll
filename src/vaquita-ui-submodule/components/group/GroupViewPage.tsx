'use client';

import { useVaquitaDeposit, useVaquitaWithdrawal } from '@/web3/hooks';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  getPaymentsTable,
  logError,
  showAlert,
  showNotification,
} from '../../helpers';
import { useGroup } from '../../hooks';
import { AddressType, GroupResponseDTO, GroupStatus } from '../../types';
import { Button, ShareButton } from '../buttons';
import { TabTitleHeader } from '../header';
import { LoadingSpinner } from '../loadingSpinner';
import { Message } from '../message';
import { BuildingStatus } from '../status';
import { SummaryAction } from '../summaryAction';
import { GroupSummary } from './GroupSummary';

export const GroupViewPage = ({ address }: { address?: AddressType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { groupId } = useParams();
  const { depositCollateralAndJoin } = useVaquitaDeposit();
  const {
    withdrawalEarnedRound,
    withdrawalEarnedInterest,
    withdrawalCollateral,
  } = useVaquitaWithdrawal();
  const {
    getGroup,
    joinGroup,
    disjoinGroup,
    depositGroupCollateral,
    withdrawalGroupCollateral,
    withdrawalGroupEarnedInterest,
    withdrawalGroupEarnedRound,
  } = useGroup();
  const {
    isPending: isPendingData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    data,
    refetch,
  } = useQuery<{
    content: GroupResponseDTO;
  }>({
    queryKey: ['group', address],
    queryFn: () => getGroup(groupId as string, address),
  });

  const loading = isPendingData || isLoadingData || isFetchingData;

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!data) {
    return <LoadingSpinner />;
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
      const response = await joinGroup(group.id, address);
      if (response.success) {
        const joinedGroup = response.content;
        const amount = joinedGroup.collateralAmount;
        const { tx, error, success } = await depositCollateralAndJoin(
          joinedGroup
        );
        if (!success) {
          logError('transaction error', error);
          throw new Error('transaction error');
        }
        await depositGroupCollateral(joinedGroup.id, address, tx, amount);
        await refetch();
        showNotification("You've successfully joined the group!", 'success');
      } else {
        showNotification(response.message, 'error');
      }
    } catch (error) {
      await disjoinGroup(group.id, address);
      logError('Failed to join the group', error);
      showNotification('Failed to join the group', 'error');
    }
    setIsLoading(false);
  };

  const handleWithdrawEarnedRound = async () => {
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
        "Withdrawal successful! You've earned your round.",
        'success'
      );
    } catch (error) {
      logError('Failed to withdraw your earned round.', error);
      showNotification('Failed to withdraw your earned round.', 'error');
    }
    setIsLoading(false);
  };

  const handleWithdrawEarnedInterest = async () => {
    setIsLoading(true);
    if (!address) {
      return;
    }
    try {
      const amount = 0;
      const { tx, error, success } = await withdrawalEarnedInterest(group);
      if (!success) {
        logError('transaction error', error);
        throw new Error('transaction error');
      }
      await withdrawalGroupEarnedInterest(group.id, address, tx, amount);
      await refetch();
      showNotification(
        'Withdrawal successful! Your earned interest has been withdrawn.',
        'success'
      );
    } catch (error) {
      logError('Failed to withdraw your earned interest.', error);
      showNotification('Failed to withdraw your earned interest.', 'error');
    }
    setIsLoading(false);
  };

  const handleWithdrawCollateral = async () => {
    setIsLoading(true);
    if (!address) {
      return;
    }
    try {
      const { tx, error, success } = await withdrawalCollateral(group);
      if (!success) {
        logError('transaction error', error);
        throw new Error('transaction error');
      }
      const amount = group.collateralAmount;
      await withdrawalGroupCollateral(group.id, address, tx, amount);
      await refetch();
      showNotification(
        'Withdrawal successful! Your collateral has been withdrawn.',
        'success'
      );
    } catch (error) {
      logError('Failed to withdraw your collateral."', error);
      showNotification('Failed to withdraw your collateral."', 'error');
    }
    setIsLoading(false);
  };

  const handleNavigateToPayments = () => {
    router.push(`/groups/${groupId}/payments?myGroups=true`);
  };

  const { items, firstUnpaidItemIndex } = getPaymentsTable(group);

  const totalPayments = Object.values(group.myDeposits).reduce(
    (sum, deposit) =>
      sum + (deposit.successfullyDeposited && deposit.round > 0 ? 1 : 0),
    0
  );
  const allPaymentsDone = totalPayments === group.totalMembers - 1;

  return (
    <>
      <TabTitleHeader text="Group Information" />
      {loading && <LoadingSpinner />}
      {!loading && data && (
        <div className="flex flex-col gap-2">
          {data && <GroupSummary {...group} />}
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
          {(isActive || isConcluded) && address && (
            <>
              <SummaryAction
                title="Payments"
                content={
                  allPaymentsDone ? (
                    <p className="text-success-green">All rounds are paid</p>
                  ) : (
                    <>
                      <p>
                        Paid {totalPayments} of {group.totalMembers - 1}
                      </p>
                      <p>
                        Payment Deadline:{' '}
                        {new Date(
                          items[firstUnpaidItemIndex]
                            ?.paymentDeadlineTimestamp || 0
                        ).toDateString()}
                      </p>
                    </>
                  )
                }
                actionLabel={allPaymentsDone ? 'View' : 'Pay'}
                type={allPaymentsDone ? 'info' : 'primary'}
                onAction={handleNavigateToPayments}
              />
              <SummaryAction
                title="Round earned"
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
                type={
                  group.myWithdrawals.round.enabled &&
                  !group.myWithdrawals.round.successfullyWithdrawn
                    ? 'info'
                    : 'disabled'
                }
                onAction={
                  group.myWithdrawals.round.enabled &&
                  !group.myWithdrawals.round.successfullyWithdrawn
                    ? handleWithdrawEarnedRound
                    : undefined
                }
              />
              <SummaryAction
                title="Intersed earned"
                content={
                  <p>
                    {(group.collateralAmount * 0.0003).toFixed(4)}{' '}
                    {group.crypto}
                  </p>
                }
                actionLabel={
                  group.myWithdrawals.interest.successfullyWithdrawn
                    ? 'Withdrawn'
                    : 'Withdraw'
                }
                type={
                  group.myWithdrawals.interest.enabled &&
                  !group.myWithdrawals.interest.successfullyWithdrawn
                    ? 'info'
                    : 'disabled'
                }
                onAction={
                  group.myWithdrawals.interest.enabled &&
                  !group.myWithdrawals.interest.successfullyWithdrawn
                    ? handleWithdrawEarnedInterest
                    : undefined
                }
              />
              <SummaryAction
                title="Claim Collateral"
                content={<p>{group.collateralAmount} USDC</p>}
                actionLabel={
                  group.myWithdrawals.collateral.successfullyWithdrawn
                    ? 'Withdrawn'
                    : 'Withdraw'
                }
                type={
                  group.myWithdrawals.collateral.enabled &&
                  !group.myWithdrawals.collateral.successfullyWithdrawn
                    ? 'info'
                    : 'disabled'
                }
                onAction={() => {
                  // if (group.status === GroupStatus.ACTIVE) {
                  //   showAlertWithConfirmation(
                  //     'Do you want to Pay?',
                  //     'Testing',
                  //     'info',
                  //     handleWithdrawCollateral,
                  //     'Pay Now Test'
                  //   );
                  // }
                  if (
                    group.myWithdrawals.collateral.enabled &&
                    !group.myWithdrawals.collateral.successfullyWithdrawn
                  ) {
                    void handleWithdrawCollateral();
                  } else {
                    showAlert(
                      'Ups',
                      'The collateral cannot be withdrawn if the Vaquita has not finished yet',
                      'warning',
                      'Understood'
                    );
                  }
                }}
              />
            </>
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
                "We are waiting for the group to be fully filled by the specified date. If the group isn't complete by then, the collateral you deposited will be returned."
              }
            />
          )}
          {group.status === GroupStatus.PENDING && step1 && step2 && !step3 && (
            <Message
              messageText={
                "The group is all set! We're just waiting for the start date to kick things off."
              }
            />
          )}
          <div className="flex flex-col gap-5 justify-between mb-4">
            {!step1 && !!group.slots && address && (
              <Button
                label="Join and deposit collateral"
                type="primary"
                size="large"
                onClick={handleDepositCollateral}
              />
            )}
            {group.status === GroupStatus.PENDING && step1 && !step2 && (
              <ShareButton groupName={'vaquita'} />
            )}
            {/* <ButtonComponent
              label="Back"
              type="secondary"
              size="large"
              onClick={() => {
                window.history.back();
              }}
            /> */}
          </div>
        </div>
      )}
    </>
  );
};
