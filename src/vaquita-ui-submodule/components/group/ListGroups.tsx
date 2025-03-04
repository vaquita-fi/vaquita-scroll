import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { AddressType, GroupResponseDTO } from '../../types';
import { VaquitaParachute } from '../icons';
import { LoadingSpinner } from '../loadingSpinner';
import { GroupCard } from './GroupCard';
import { GroupViewModal } from './GroupViewModal';

export const ListGroups = ({
                             loading,
                             groups,
                             myGroups,
                             address,
                           }: {
  loading: boolean;
  groups: GroupResponseDTO[];
  myGroups?: boolean;
  address?: AddressType,
}) => {
  const isEmpty = !loading && groups.length === 0;
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const groupId = searchParams.get('groupId');
  console.log({ groups, groupId });
  return (
    <>
      {groupId && address && (
        <GroupViewModal
          groupId={groupId}
          address={address}
          onClose={() => {
            const params = new URLSearchParams(searchParams);
            params.delete('groupId');
            router.push(`?${params.toString()}`);
          }}
        />
      )}
      {loading && <LoadingSpinner />}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-8 h-3/4">
          <VaquitaParachute />
          <p className="text-center">
            {myGroups ? (
              <>
                <span className="text-lg">{'You don\'t have a group'}</span>
                <br />
                <span className="c-text-light">Start one now!</span>
              </>
            ) : (
              <>
                <span className="text-lg">There are no groups yet</span>
                <br />
                <span className="c-text-light">Come back soon!</span>
              </>
            )}
          </p>
        </div>
      )}
      
      {!!groups.length && (
        <div className="flex flex-1 flex-col overflow-x-auto sm:overflow-visible gap-4 pt-1 pb-4">
          {!loading &&
            groups.map(
              ({
                 id,
                 startsOnTimestamp,
                 totalMembers,
                 amount,
                 crypto,
                 name,
                 period,
                 status,
                 slots,
                 collateralAmount,
               }) => (
                <div key={id}>
                  <GroupCard
                    id={id}
                    startsOnTimestamp={startsOnTimestamp}
                    totalMembers={totalMembers}
                    slots={slots}
                    amount={amount}
                    collateralAmount={collateralAmount}
                    crypto={crypto}
                    name={name}
                    period={period}
                    status={status}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('groupId', id);
                      router.push(`?${params.toString()}`);
                    }}
                  />
                </div>
              ),
            )}
        </div>
      )}
    </>
  );
};
