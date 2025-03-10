'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

interface ITab<T> {
  label: string;
  value: T;
}

interface TabsComponentProps<T> {
  tabs: ITab<T>[];
}

export const Tabs = <T extends string = string>({
                                                  tabs,
                                                }: TabsComponentProps<T>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = tabs.find(({ value }) => value === searchParams.get('tab'))?.value;
  const firstTab = tabs[0]?.value;
  const createQueryString = useCallback(
    (name: string, value: T) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value as string);
      return params.toString();
    },
    [ searchParams ],
  );
  
  useEffect(() => {
    if (!currentTab && firstTab) {
      router.replace(`${pathname}?${createQueryString('tab', firstTab)}`);
    }
  }, [ searchParams, pathname, router, currentTab, firstTab, createQueryString ]);
  
  const handleTabClick = (tabValue: T) => {
    router.push(`${pathname}?${createQueryString('tab', tabValue)}`);
  };
  
  return (
    <div className="flex overflow-auto justify-around bg-opaque rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleTabClick(tab.value)}
          className={`relative w-full px-4 py-2 ${
            // currentTab === tab.value ? 'text-accent-100' : 'text-accent-200'
            ''
          }`}
        >
          {tab.label}
          {currentTab === tab.value && (
            <motion.div
              layoutId="undeline"
              className={`absolute bottom-0 left-0 style-primary-button rounded-xl`}
              style={{
                height: '100%',
                width: '100%',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {tab.label}
            </motion.div>
          )}
        </button>
      ))}
    </div>
  );
};
