'use client';

import { GroupViewPage } from '@/vaquita-ui-submodule/components';
import { useParams } from 'next/navigation';
import React from 'react';
import { useAccount } from 'wagmi';

const Page = () => {
  const { address } = useAccount();
  const { groupId } = useParams();
  
  return <GroupViewPage address={address} groupId={groupId as string} />;
};

export default Page;
