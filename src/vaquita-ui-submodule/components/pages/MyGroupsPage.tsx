'use client';

import { TitleLayout } from '@/vaquita-ui-submodule/components/layouts/TitleLayout';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { RE_FETCH_INTERVAL } from '../../constants';
import { useGroup } from '../../hooks';
import { AddressType, GroupCrypto, GroupFilters, GroupStatus } from '../../types';
import { GroupFiltersHead } from '../group/GroupFiltersHead';
import { ListGroups } from '../group/ListGroups';

export const MyGroupsPage = ({ address }: { address?: AddressType }) => {
  
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
  const searchParams = useSearchParams();
  
  const groupId = searchParams.get('groupId');
  
  const { getGroups } = useGroup();
  const { isPending, isLoading, data } = useQuery({
    refetchInterval: RE_FETCH_INTERVAL,
    enabled: !!address && !groupId,
    queryKey: [ 'groups', address, filters ],
    queryFn: () =>
      getGroups({
        myGroups: true,
        publicKey: address,
        name: filters.name,
        crypto: filters.crypto,
        orderBy: filters.orderBy,
        amount: filters.amount,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        period: filters.period,
        status: filters.pending
          ? GroupStatus.PENDING
          : filters.completed
            ? GroupStatus.CONCLUDED
            : filters.active
              ? GroupStatus.ACTIVE
              : null,
      }),
  });
  
  if (!address) {
    return (
      <TitleLayout>
        <p>Please select a wallet</p>
      </TitleLayout>
    );
  }
  
  const loading = isPending || isLoading; // || isFetching;
  
  return (
    <>
      <GroupFiltersHead filters={filters} setFilters={setFilters} withCreateGroupButton withStatus />
      <ListGroups
        groups={data?.success ? data.contents : []}
        loading={loading}
        address={address}
        myGroups
      />
    </>
  );
};
