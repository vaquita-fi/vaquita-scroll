'use client';

import ConnectButton from '@/components/ConnectButton';
import { MainHeader } from '@/vaquita-ui-submodule/components';
import Home from '@/vaquita-ui-submodule/components/home/Home';
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
      <Home />
      {/* <GroupsPage address={address} /> */}
    </>
  );
};

export default Page;
