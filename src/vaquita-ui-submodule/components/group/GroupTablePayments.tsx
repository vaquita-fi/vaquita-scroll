import { useVaquitaDeposit } from '@/web3/hooks';
import React, { useState } from 'react';
import { getPaymentsTable, logError, showNotification } from '../../helpers';
import { useGroup } from '../../hooks';
import { Button } from '../buttons';
import { ErrorView } from '../error';
import { LoadingBackdropSpinner } from '../loadingSpinner';
import { GroupTablePaymentsProps } from './types';

export function GroupTablePayments({
                                     group,
                                     refetch,
                                     address,
                                   }: GroupTablePaymentsProps) {
  const [ isLoading, setIsLoading ] = useState(false);
  const { depositRoundPayment } = useVaquitaDeposit();
  const { depositGroupPayment } = useGroup();
  
  if (!address) {
    return <ErrorView />;
  }
  
  const { items } = getPaymentsTable(group);
  
  // const getStatusType = (status: string): string => {
  //   switch (status) {
  //     case 'Pay':
  //       return 'success';
  //     case 'Pending':
  //       return 'muted';
  //     default:
  //       return 'disabled';
  //   }
  // };
  
  const handleTurnPayment = async (round: number, turn: number) => {
    setIsLoading(true);
    try {
      const amount = group.amount;
      const { tx, error, success } = await depositRoundPayment(group, turn);
      if (!success) {
        logError('transaction error', error);
        throw new Error('transaction error');
      }
      await depositGroupPayment(group.id, address, tx, round, amount);
      await refetch();
      showNotification('Payment successful! You\'ve paid your turn.', 'success');
    } catch (error) {
      logError('Payment unsuccessful. Please check and try again.', error);
      showNotification(
        'Payment unsuccessful. Please check and try again.',
        'error',
      );
    }
    setIsLoading(false);
  };
  
  return (
    <div className="rounded-xl border border-black style-stand-out">
      {isLoading && <LoadingBackdropSpinner />}
      <div className="grid grid-cols-[1fr_2fr_2fr_2fr] py-2 px-1 text-sm font-semibold gap-2 bg-primary border-b-2 border-black rounded-xl">
        <span className="self-center">Nro</span>
        <span className="self-center">Amount</span>
        <span className="self-center">Payment Deadline</span>
        <span className="self-center">Status</span>
      </div>
      {items.map(({ round, amount, paymentDeadlineTimestamp, status }, i) => {
        return (
          <div
            className="grid grid-cols-[1fr_2fr_2fr_2fr] py-4 px-1 text-sm gap-2 transition-colors duration-300"
            key={round}
          >
            <div className="pl-3 self-center">{i + 1}</div>
            <div className="self-center">
              {amount} {group.crypto}
            </div>
            <div className="self-center">
              {round === group.myPosition
                ? '-'
                : new Date(paymentDeadlineTimestamp).toDateString()}
            </div>
            <div className="self-center">
              {status === 'Paid' ? (
                <span className="text-success-green">Paid</span>
              ) : round === group.myPosition ? (
                'It\'s your round'
              ) : (
                <Button
                  label={status}
                  onClick={() => handleTurnPayment(round, i)}
                  disabled={status !== 'Pay'}
                  className="style-primary-button bg-success"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
