'use client';

import { GroupCreatePage } from '@/vaquita-ui-submodule/components';
import React from 'react';
import { useAccount } from 'wagmi';

const Page = () => {
  const { address } = useAccount();
  
  return <GroupCreatePage address={address} />;
};

export default Page;
