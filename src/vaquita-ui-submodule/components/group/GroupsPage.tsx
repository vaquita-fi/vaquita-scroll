'use client';

import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { RE_FETCH_INTERVAL } from '../../constants';
import { useGroup } from '../../hooks';
import {
  AddressType,
  GroupCrypto,
  GroupFilters,
  GroupPeriod,
} from '../../types';
import { GroupFiltersHead } from './GroupFiltersHead';
import { ListGroups } from './ListGroups';

export const GroupsPage = ({ address }: { address?: AddressType }) => {
  const [filters, setFilters] = useState<GroupFilters>({
    period: GroupPeriod.ALL,
    orderBy: '+amount',
    crypto: GroupCrypto.USDC,
    amount: 0,
  });
  const { getGroups } = useGroup();
  const { isPending, isLoading, data } = useQuery({
    refetchInterval: RE_FETCH_INTERVAL,
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
  const groups = data?.success ? data?.contents : [];

  return (
    <>
      <GroupFiltersHead filters={filters} setFilters={setFilters} />
      <ListGroups groups={groups} loading={loading} />
    </>
  );
};
