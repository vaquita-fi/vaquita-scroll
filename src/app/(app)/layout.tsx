'use client';

import '@/vaquita-ui-submodule/styles/commons.css';
import ConnectButton from '@/components/ConnectButton';
import { MainLayout } from '@/vaquita-ui-submodule/components';
import './styles.css';
import React from 'react';
import { useAccount } from 'wagmi';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  return (
    <MainLayout
      walletButtons={
        <>
          <ConnectButton />
        </>
      }
    >
      {children}
    </MainLayout>
  );
}
