import Link from 'next/link';
import React, { ReactNode } from 'react';
import { VaquitaOutlineIcon } from '../icons';

export const MainHeader = ({ walletButtons }: { walletButtons: ReactNode }) => {
  return (
    <div className="text-center flex justify-around items-center gap-2 pt-3 pb-2 lg:hidden">
      <div className="flex flex-1 flex-wrap justify-between items-center">
        <Link className="flex gap-0.5" href={'/web/public'}>
          <VaquitaOutlineIcon />
          <span className="text-2xl text-center flex align-center items-center sm:text-xl font-bold">
            Vaquita
          </span>
        </Link>
        <div className="flex-none space-x-1 flex wallets-buttons">
          {walletButtons}
        </div>
      </div>
    </div>
  );
};
