'use client';

import { GroupCrypto, GroupStatus } from '../../types';
import { Button } from '../buttons';
import { DateOutlineIcon, LockOutlineIcon, PeopleOutlineIcon, RenewOutlineIcon } from '../icons';

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
  status?: GroupStatus;
  onClick?: (groupId: string) => void;
}

export function GroupCard(props: Props) {
  
  const {
    name,
    amount,
    collateralAmount,
    period,
    totalMembers,
    slots,
    id,
    crypto,
    onClick,
    status,
  } = props;
  
  return (
    <div className="flex flex-col justify-between style-stand-out style-border px-5 pt-4 pb-6 rounded-lg gap-2">
      <div className="flex justify-between text-lg">
        <p className="text-2xl font-bold">{name}</p>
        {status && (
          <div className="flex gap-1 items-center">
            <div className={'style-border w-[20px] h-[20px] rounded-full ' + (status === GroupStatus.ACTIVE ? 'bg-success' : status === GroupStatus.PENDING ? 'bg-warning' : 'bg-opaque')} />
            <p className="capitalize">{status}</p>
          </div>
        )}
      </div>
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
      <Button
        label="View Details"
        className="w-full style-primary-button hover-effect"
        onClick={() => onClick?.(id)}
      />
    </div>
  );
}
