'use client';

import { GroupViewPage } from '@/vaquita-ui-submodule/components';
import React from 'react';
import { useAccount } from 'wagmi';

const Page = () => {
  const { address } = useAccount();
  
  return <GroupViewPage address={address} />;
};

export default Page;
