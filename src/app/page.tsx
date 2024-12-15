'use client';

import LoginButton from '@/components/LoginButton';
import SignupButton from '@/components/SignupButton';
import { Home } from '@/vaquita-ui-submodule/components';
import React from 'react';
import { useAccount } from 'wagmi';

export default function Page() {
  const { address, isConnected } = useAccount();
  
  return (
    <Home
      walletButton={<SignupButton />}
      walletButtons={
        <>
          <SignupButton />
          {!address && <LoginButton />}
        </>
      }
      isConnected={isConnected}
    />
  );
}
