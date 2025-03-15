'use client';

import ConnectButton from '@/components/ConnectButton';
import { GroupsPage, MainHeader } from '@/vaquita-ui-submodule/components';
import React from 'react';
import { useAccount } from 'wagmi';

const Page = () => {
  
  const { address } = useAccount();
  
  return (
    <>
      <MainHeader
        walletButtons={
          <>
            <ConnectButton />
          </>
        }
      />
      <GroupsPage address={address} />
    </>
  );
};

export default Page;
