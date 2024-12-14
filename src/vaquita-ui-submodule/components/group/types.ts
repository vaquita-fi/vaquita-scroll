import { QueryObserverBaseResult } from '@tanstack/react-query';
import { AddressType, GroupResponseDTO } from '../../types';

export interface GroupTablePaymentItem {
  round: number;
  amount: number;
  paymentDeadlineTimestamp: number;
  status: 'Paid' | 'Pay' | 'Pending';
}

export interface GroupTablePaymentsProps {
  group: GroupResponseDTO;
  refetch: QueryObserverBaseResult['refetch'];
  address: AddressType;
}
