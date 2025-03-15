'use client';

import ConnectButton from '@/components/ConnectButton';
import { MainHeader, MorePage } from '@/vaquita-ui-submodule/components';
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
      <MorePage />
    </>
  );
};

export default Page;
