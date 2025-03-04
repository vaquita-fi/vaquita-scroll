import { VaquitaParachute } from '@/vaquita-ui-submodule/components/icons';
import React from 'react';
import { GroupResponseDTO } from '../../types';
import { LoadingSpinner } from '../loadingSpinner';
import { GroupCard } from './GroupCard';

export const ListGroups = ({
  loading,
  groups,
  myGroups,
}: {
  loading: boolean;
  groups: GroupResponseDTO[];
  myGroups?: boolean;
}) => {
  const isEmpty = !loading && groups.length === 0;
  console.log({ groups });
  return (
    <>
      {loading && <LoadingSpinner />}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-8 h-3/4">
          <VaquitaParachute />
          <p className="text-center">
            {myGroups ? (
              <>
                <span className="text-lg">{"You don't have a group"}</span>
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
                  />
                </div>
              )
            )}
        </div>
      )}
    </>
  );
};
