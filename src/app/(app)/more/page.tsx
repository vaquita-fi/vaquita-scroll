'use client';

import LoginButton from '@/components/LoginButton';
import SignupButton from '@/components/SignupButton';
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
            <SignupButton />
            {!address && <LoginButton />}
          </>
        }
      />
      <MorePage />
    </>
  );
};

export default Page;
