'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useGroup } from '../../hooks';
import { AddressType } from '../../types';
import { Button } from '../buttons';
import { ErrorView } from '../error';
import { TabTitleHeader } from '../header';
import { LoadingBackdropSpinner } from '../loadingSpinner';
import { GroupTablePayments } from './GroupTablePayments';

export const GroupPaymentsPage = ({ address }: { address?: AddressType }) => {
  const router = useRouter();
  const { groupId } = useParams();
  const { getGroup } = useGroup();
  const {
    isPending: isPendingData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    data,
    error,
    refetch,
  } = useQuery({
    enabled: !!address,
    queryKey: [ 'group', address ],
    queryFn: () => getGroup(groupId as string, address!),
  });
  
  const loading = isPendingData || isLoadingData || isFetchingData;
  
  if (loading) {
    return <LoadingBackdropSpinner />;
  }
  if (!data) {
    return <LoadingBackdropSpinner />;
  }
  if (!address || !data?.success) {
    return <ErrorView />;
  }
  
  return (
    <>
      <TabTitleHeader text="Group Information" />
      {loading && <LoadingBackdropSpinner />}
      {error && !loading && !data && <ErrorView />}
      {!loading && data && (
        <GroupTablePayments
          address={address}
          group={data?.content}
          refetch={refetch}
        />
      )}
      {!loading && (
        <div className="flex flex-col gap-5 my-5 justify-between">
          <Button
            label="Back"
            size="large"
            onClick={() => router.back()}
          />
        </div>
      )}
    </>
  );
};
