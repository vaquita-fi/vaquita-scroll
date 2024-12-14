'use client';

import MainTabsHeader from '@/components/global/Header/MainTabsHeader';
import { GroupFiltersHead } from '@/components/group/GroupFiltersHead/GroupFiltersHead';
import { ListGroups } from '@/components/group/ListGroups/ListGroups';
import { REFETCH_INTERVAL } from '@/config/constants';
import { useGroup } from '@/hooks';
import { GroupCrypto, GroupFilters, GroupPeriod } from '@/types';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

const GroupPage = () => {
  const [filters, setFilters] = useState<GroupFilters>({
    period: GroupPeriod.ALL,
    orderBy: '+amount',
    crypto: GroupCrypto.USDC,
    amount: 0,
  });
  const { address } = useAccount();
  const { getGroups } = useGroup();
  const { isPending, isLoading, data } = useQuery({
    refetchInterval: REFETCH_INTERVAL,
    queryKey: ['groups', filters, address],
    queryFn: () =>
      getGroups({
        publicKey: address,
        crypto: filters.crypto,
        orderBy: filters.orderBy,
        amount: filters.amount,
        period: filters.period,
      }),
  });

  const loading = isPending || isLoading; // || isFetching;
  const groups = data?.contents || [];

  return (
    <>
      <MainTabsHeader />
      <GroupFiltersHead filters={filters} setFilters={setFilters} />
      <ListGroups groups={groups} loading={loading} />
    </>
  );
};

export default GroupPage;
