import { getRelativeTime } from '@/vaquita-ui-submodule/helpers';
import React from 'react';
import { GroupCrypto, GroupStatus } from '../../types';
import { Summary } from '../Summary';

export const GroupSummary = ({
  crypto,
  name,
  amount,
  totalMembers,
  period,
  startsOnTimestamp,
  status,
}: {
  crypto: GroupCrypto;
  name: string;
  amount: number;
  totalMembers: number;
  period: string;
  startsOnTimestamp: number;
  status?: GroupStatus;
}) => {
  console.log({ startsOnTimestamp });
  return (
    <Summary
      itemsSummary={[
        {
          title: 'Crypto',
          result: crypto,
        },
        {
          title: 'Group name',
          result: name,
        },
        {
          title: 'Amount',
          result: amount,
        },
        {
          title: 'Collateral',
          result: amount * totalMembers,
        },
        {
          title: 'Members',
          result: totalMembers,
        },
        {
          title: 'Payment period',
          result: period,
        },
        {
          title:
            !status || status === GroupStatus.PENDING ? 'Starts In' : 'Started',
          result: getRelativeTime(startsOnTimestamp),
        },
      ]}
    />
  );
};
