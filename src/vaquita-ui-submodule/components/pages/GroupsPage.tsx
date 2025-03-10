'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { RE_FETCH_INTERVAL } from '../../constants';
import { useGroup } from '../../hooks';
import { AddressType, GroupCrypto, GroupFilters, GroupStatus } from '../../types';
import { GroupFiltersHead } from '../group/GroupFiltersHead';
import { ListGroups } from '../group/ListGroups';

export const GroupsPage = ({ address }: { address?: AddressType }) => {
  const [ filters, setFilters ] = useState<GroupFilters>({
    name: null,
    period: null,
    orderBy: '+amount',
    crypto: GroupCrypto.USDC,
    amount: null,
    minAmount: null,
    maxAmount: null,
    pending: false,
    active: false,
    completed: false,
  });
  const { getGroups } = useGroup();
  const searchParams = useSearchParams();
  
  const groupId = searchParams.get('groupId');
  const { isPending, isLoading, data } = useQuery({
    refetchInterval: RE_FETCH_INTERVAL,
    enabled: !groupId,
    queryKey: [ 'groups', filters, address ],
    queryFn: () =>
      getGroups({
        publicKey: address,
        name: filters.name,
        crypto: filters.crypto,
        orderBy: filters.orderBy,
        amount: filters.amount,
        period: filters.period,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        status: filters.pending
          ? GroupStatus.PENDING
          : filters.completed
            ? GroupStatus.CONCLUDED
            : filters.active
              ? GroupStatus.ACTIVE
              : null,
      }),
  });
  
  const loading = isPending || isLoading; // || isFetching;
  const groups = data?.success ? data?.contents : [];
  
  return (
    <>
      <GroupFiltersHead filters={filters} setFilters={setFilters} />
      <ListGroups groups={groups} loading={loading} address={address} />
    </>
  );
};
