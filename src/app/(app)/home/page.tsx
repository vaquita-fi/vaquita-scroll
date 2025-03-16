'use client';

import LoginButton from '@/components/LoginButton';
import SignupButton from '@/components/SignupButton';
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
            <SignupButton />
            {!address && <LoginButton />}
          </>
        }
      />
      <Home address={address} />
      {/* <GroupsPage address={address} /> */}
    </>
  );
};

export default Page;
