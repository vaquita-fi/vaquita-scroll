'use client';

import { GroupPaymentsPage } from '@/vaquita-ui-submodule/components/group';
import React from 'react';
import { useAccount } from 'wagmi';

const PaymentsPage = () => {
  const { address } = useAccount();
  
  return <GroupPaymentsPage address={address} />;
};

export default PaymentsPage;
