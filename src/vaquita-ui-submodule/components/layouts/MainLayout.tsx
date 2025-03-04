import { ReactNode } from 'react';
import { MainNavbar } from '../MainNavbar';
import '../../styles/index.css';

export function MainLayout({
  children,
  walletButtons,
}: {
  children: ReactNode;
  walletButtons: ReactNode;
}) {
  return (
    <div className="h-full flex justify-center" style={{ cursor: 'pointer' }}>
      <div className="w-full h-full flex flex-col bg-gradient-to-r from-blue-100 to-purple-200">
        <div
          className="hidden lg:block z-10 my-6 rounded-full px-6 xl:px-36"
          // style={{ maxHeight: 'calc(100vh - 5rem)' }}
        >
          <MainNavbar walletButtons={walletButtons} />
        </div>
        <div
          className="flex flex-col flex-1 overflow-y-auto px-4 sm:px-20 md:px-28 lg:px-32 xl:px-36 "
          // style={{ maxHeight: 'calc(100vh - 5rem)' }}
        >
          {children}
        </div>
        <div className="block lg:hidden">
          <MainNavbar walletButtons={walletButtons} />
        </div>
      </div>
    </div>
  );
}
