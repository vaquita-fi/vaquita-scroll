'use client';

import ConnectButton from '@/components/ConnectButton';
import { MyGroupsPage } from '@/vaquita-ui-submodule/components';
import { MainHeader } from '@/vaquita-ui-submodule/components/header';
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
      <MyGroupsPage address={address} />
    </>
  );
};

export default Page;
