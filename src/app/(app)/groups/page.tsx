'use client';

import LoginButton from '@/components/LoginButton';
import SignupButton from '@/components/SignupButton';
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
            <SignupButton />
            {!address && <LoginButton />}
          </>
        }
      />
      <GroupsPage address={address} />
    </>
  );
};

export default Page;
