'use client';

import Link from 'next/link';
import { GroupCrypto, GroupStatus } from '../../types';
import { Button } from '../buttons';
import {
  DateOutlineIcon,
  LockOutlineIcon,
  PeopleOutlineIcon,
  RenewOutlineIcon,
} from '../icons';

interface Props {
  id: string;
  crypto: GroupCrypto;
  name: string;
  amount: number;
  collateralAmount: number;
  totalMembers: number;
  slots: number;
  period: 'monthly' | 'weekly' | 'all';
  startsOnTimestamp: number;
  status: GroupStatus;
}

export function GroupCard({
  name,
  amount,
  collateralAmount,
  startsOnTimestamp,
  period,
  totalMembers,
  slots,
  id,
  crypto,
  status,
}: Props) {
  return (
    <div className="flex flex-col justify-between style-stand-out style-border px-5 pt-4 pb-6 rounded-lg gap-2">
      <p className="text-2xl font-bold">{name}</p>
      <div className="flex flex-col">
        <div className="flex justify-between text-lg">
          <div className="flex items-center gap-1">
            <RenewOutlineIcon />
            <p>
              {amount} <span className="">{crypto}</span>
            </p>
          </div>
          <div className="flex items-center gap-1">
            <LockOutlineIcon />
            <p>
              {+collateralAmount.toFixed(2)} <span className="">{crypto}</span>
            </p>
          </div>
        </div>
        <div className="flex justify-between color-secondary text-sm">
          <div className="flex items-center gap-1">
            <DateOutlineIcon />
            <p>
              {amount} <span className="">{period}</span>
            </p>
          </div>
        </div>
        <div className="flex justify-between color-secondary text-sm">
          <div className="flex items-center gap-1">
            <PeopleOutlineIcon />
            <p>
              {totalMembers - slots} / {totalMembers} Participants
            </p>
          </div>
        </div>
      </div>
      <Link
        href={`/groups/${id}?myGroups=true`}
        passHref
        style={{ display: 'contents' }}
      >
        <Button
          label="View Details"
          type="outline-primary"
          className="w-full style-primary-button hover-effect"
        />
      </Link>
    </div>
  );
}
