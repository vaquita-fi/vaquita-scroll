'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { RE_FETCH_INTERVAL } from '../../constants';
import { useGroup } from '../../hooks';
import {
  AddressType,
  GroupCrypto,
  GroupFilters,
  GroupPeriod,
  GroupStatus,
} from '../../types';
import { Tabs } from '../tabs';
import { GroupFiltersHead } from './GroupFiltersHead';
import { ListGroups } from './ListGroups';

enum MyGroupsTab {
  PENDING = GroupStatus.PENDING,
  ACTIVE = GroupStatus.ACTIVE,
  CONCLUDED = GroupStatus.CONCLUDED,
}

const tabs = [
  { label: 'Active', value: MyGroupsTab.ACTIVE },
  { label: 'Pending', value: MyGroupsTab.PENDING },
  { label: 'Concluded', value: MyGroupsTab.CONCLUDED },
];

export const MyGroupsPage = ({ address }: { address?: AddressType }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || MyGroupsTab.ACTIVE);
  const [filters, setFilters] = useState<GroupFilters>({
    period: GroupPeriod.ALL,
    orderBy: '+amount',
    crypto: GroupCrypto.USDC,
    amount: 0,
  });
  const { getGroups } = useGroup();
  const { isPending, isLoading, isFetching, data } = useQuery({
    refetchInterval: RE_FETCH_INTERVAL,
    enabled: !!address,
    queryKey: ['groups', currentTab, address, filters],
    queryFn: () =>
      getGroups({
        myGroups: true,
        publicKey: address,
        crypto: filters.crypto,
        orderBy: filters.orderBy,
        amount: filters.amount,
        period: filters.period,
        status: currentTab as GroupStatus,
      }),
  });

  if (!address) {
    return (
      <>
        <div className="flex-1 flex flex-col gap-4 justify-center items-center">
          <p className="text-accent-100">Please select a wallet</p>
        </div>
      </>
    );
  }

  const loading = isPending || isLoading; // || isFetching;

  return (
    <>
      <Tabs tabs={tabs} onTabClick={setCurrentTab} currentTab={currentTab} />
      <GroupFiltersHead filters={filters} setFilters={setFilters} />
      {!loading && (
        <div className="absolute w-full flex justify-center bottom-16 left-0 lg:hidden">
          <div onClick={() => router.push('/my-groups/create')}>
            <Image
              src="/icons/plus-filled-active.svg"
              alt="members"
              width={36}
              height={36}
            />
          </div>
        </div>
      )}
      {/* {!loading &&
        data?.contents?.length === 0 &&
        tab === MyGroupsTab.ACTIVE && (
          <div className="flex flex-1 justify-center items-center flex-col">
            <div className="text-accent-100">
              There are no groups available.
            </div>
            <div className="flex gap-2 my-4">
              <Button
                label="Create Group"
                type="primary"
                size="large"
                onClick={() => router.push('/my-groups/create')}
              />
            </div>
          </div>
        )} */}
      <ListGroups
        groups={data?.success ? data.contents : []}
        loading={loading}
        myGroups
      />
    </>
  );
};
