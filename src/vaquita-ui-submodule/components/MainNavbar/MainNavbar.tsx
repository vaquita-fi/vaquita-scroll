'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { ReactNode } from 'react';
import { Button } from '../buttons';
import { FindGroupsIcon, HomeIcon, MoreIcon, MyGroupsIcon } from '../icons';

export const MainNavbar = ({ walletButtons }: { walletButtons: ReactNode }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment);
  const mainPath = '/' + pathSegments[0];
  const myGroups = useSearchParams().get('myGroups');
  const router = useRouter();
  const getIconColor = (isActive: boolean) => 'currentColor';
  
  const links: {
    label: string;
    path: string;
    isActive: boolean;
    icon: (props: { isActive: boolean }) => ReactNode;
  }[] = [
    {
      label: 'Home',
      path: '/home',
      isActive: mainPath === '/home',
      icon: ({ isActive }) => <HomeIcon fill={getIconColor(isActive)} />,
    },
    {
      label: 'Find groups',
      path: '/groups',
      isActive: myGroups !== 'true' && mainPath === '/groups',
      icon: ({ isActive }) => <FindGroupsIcon fill={getIconColor(isActive)} />,
    },
    {
      label: 'My groups',
      path: '/my-groups',
      isActive: myGroups === 'true' || mainPath === '/my-groups',
      icon: ({ isActive }) => <MyGroupsIcon fill={getIconColor(isActive)} />,
    },
    // {
    //   label: 'On-ramp',
    //   path: '/on-ramp',
    //   isActive: mainPath === '/on-ramp',
    //   icon: ({ isActive }) => (
    //     <OnRampIcon fill={getIconColor(isActive)} />
    //   ),
    // },
    {
      label: 'More',
      path: '/more',
      isActive: mainPath === '/more',
      icon: ({ isActive }) => <MoreIcon fill={getIconColor(isActive)} />,
    },
  ];
  
  return (
    <nav className="bottom-0 w-full style-stand-out dark shadow-top-custom lg:rounded-full lg:shadow-bottom-custom lg:flex lg:items-center lg:gap-6 lg:px-4">
      <div className="flex items-center flex-1 gap-6">
        <Link className="hidden lg:flex gap-0.5" href={'/'}>
          <Image
            src="/favicon.ico"
            alt="Groups Active"
            width={30}
            height={15}
          />
          <span className="font-medium text-xl text-end flex justify-end items-end ">
            VAQUITA
          </span>
        </Link>
        <ul className="h-20 flex justify-around items-center pt-5 pb-3 flex-1 lg:gap-4 lg:justify-start">
          {links.map(({ label, path, isActive, icon }) => {
            return (
              <li
                key={label}
                className="text-center flex-1 lg:flex-initial lg:flex lg:h-full"
              >
                <Link
                  href={path}
                  className={`flex flex-col lg:flex-row lg:gap-1 items-center transition-colors duration-500 ${
                    // isActive ? 'c-accent' : 'c-text-lightest'
                    ''
                  }`}
                >
                  <div
                    className={
                      'flex flex-col items-center justify-center w-100 h-16  w-full rounded-xl text-xs' +
                      (isActive
                        ? ' bg-[#E8DFFC] border border-black border-b-2'
                        : '')
                    }
                  >
                    {icon({ isActive })}
                    <span>{label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="hidden lg:flex space-x-1 wallets-buttons">
        <Button
          label="Create Group"
          type="primary"
          size="small"
          className="mr-2"
          onClick={() => router.push('/my-groups/create')}
          icon="plus"
        />
        {walletButtons}
      </div>
    </nav>
  );
};
