'use client';

import LoginButton from '@/components/LoginButton';
import SignupButton from '@/components/SignupButton';
import { Statistics } from '@/vaquita-ui-submodule/components/dashboard/Statistics';
import { MainHeader } from '@/vaquita-ui-submodule/components/header/MainHeader';
import React from 'react';
import { useAccount } from 'wagmi';

const Page = () => {
  const { address } = useAccount();
  
  if (!address) {
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
        <div className="flex-1 flex flex-col gap-4 justify-center items-center">
          <p className="text-accent-100">Please select a wallet</p>
        </div>
      </>
    );
  }
  
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
      <div className="flex flex-col gap-6 mt-2">
        {/* <div>
          <h1 className="text-lg font-medium">My wallet balance</h1>
          <MyWalletCard />
        </div> */}
        <Statistics />
        {/*<Activity />*/}
      </div>
    </>
  );
};

export default Page;
