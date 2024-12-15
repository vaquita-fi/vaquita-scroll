'use client';

import LoginButton from '@/components/LoginButton';
import SignupButton from '@/components/SignupButton';
import { MyGroupsPage } from '@/vaquita-ui-submodule/components/group/MyGroupsPage';
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
            <SignupButton />
            {!address && <LoginButton />}
          </>
        }
      />
      <MyGroupsPage address={address} />
    </>
  );
};

export default Page;
