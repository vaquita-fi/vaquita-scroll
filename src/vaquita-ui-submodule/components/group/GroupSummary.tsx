import React from 'react';
import { GroupCrypto, GroupStatus } from '../../types';
import { DateOutlineIcon, LockOutlineIcon, PeopleOutlineIcon, RenewOutlineIcon } from '../icons';

export const GroupSummary = ({
                               crypto,
                               amount,
                               totalMembers,
                               period,
                             }: {
  crypto: GroupCrypto;
  name: string;
  amount: number;
  totalMembers: number;
  period: string;
  startsOnTimestamp: number;
  status?: GroupStatus;
}) => {
  const collateralAmount = amount * totalMembers;
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <LockOutlineIcon />
          <p>Collateral</p>
        </div>
        <p className="text-lg">
          {+collateralAmount.toFixed(2)} <span className="">{crypto}</span>
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <RenewOutlineIcon />
          <p>Recurring Payment</p>
        </div>
        <p className="text-lg">
          {amount} <span className="">{crypto}</span>
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <DateOutlineIcon />
          <p>Payment period</p>
        </div>
        <p className="text-lg">
          <span className="">{period}</span>
        </p>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center">
          <PeopleOutlineIcon />
          <p>Members</p>
        </div>
        <p className="text-lg">{totalMembers} Participants</p>
      </div>
      {/* <Summary
        itemsSummary={[
          // {
          //   title: 'Crypto',
          //   result: crypto,
          // },
          {
            title: "Group name",
            result: name,
          },
          {
            title: "Collateral",
            result: amount * totalMembers,
          },
          {
            title: "Recurring Payment",
            result: amount,
          },
          {
            title: "Payment period",
            result: period,
          },
          {
            title: "Members",
            result: totalMembers,
          },
          // {
          //   title:
          //     !status || status === GroupStatus.PENDING ? "Starts In" : "Started",
          //   result: getRelativeTime(startsOnTimestamp),
          // },
        ]}
      /> */}
    </div>
  );
};
