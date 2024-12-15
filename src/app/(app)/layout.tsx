'use client';

import LoginButton from '@/components/LoginButton';
import SignupButton from '@/components/SignupButton';
import { MainLayout } from '@/vaquita-ui-submodule/components';
import React from 'react';
import { useAccount } from 'wagmi';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  return (
    <MainLayout
      walletButtons={
        <>
          <SignupButton />
          {!address && <LoginButton />}
        </>
      }
    >
      {children}
    </MainLayout>
  );
}
