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
  status: GroupStatus;
  onBack: () => void;
}

const Share = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 0L10.1381 4.04499L9.19527 4.96657L6.66667 2.49487V8.74164H5.33333V2.49487L2.80474 4.96657L1.86193 4.04499L6 0ZM0 10.045V7.4383H1.33333V10.045C1.33333 10.4049 1.63181 10.6967 2 10.6967H10C10.3682 10.6967 10.6667 10.4049 10.6667 10.045V7.4383H12V10.045C12 11.1247 11.1046 12 10 12H2C0.895433 12 0 11.1247 0 10.045Z"
      fill="black"
    />
  </svg>
);

const Left = () => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.51067 6.99829L7.47551 2.03736C7.8427 1.67017 7.8427 1.07642 7.47551 0.713137C7.10832 0.345949 6.51457 0.349855 6.14738 0.713137L0.522384 6.33423C0.166916 6.6897 0.159103 7.26001 0.495041 7.6272L6.14348 13.2874C6.32707 13.4709 6.56926 13.5608 6.80754 13.5608C7.04582 13.5608 7.28801 13.4709 7.4716 13.2874C7.83879 12.9202 7.83879 12.3264 7.4716 11.9631L2.51067 6.99829Z"
      fill="black"
    />
  </svg>
);

export function GroupHeader(props: Props) {
  const {
    name,
    amount,
    collateralAmount,
    period,
    totalMembers,
    crypto,
    onBack,
  } = props;
  
  return (
    <div className="flex flex-col justify-between style-stand-out style-border px-5 pt-4 pb-6 rounded-lg gap-2">
      <div className="flex ">
        <Button
          label={<Left />}
          className="style-primary-button"
          style={{ borderRadius: '50%', width: 34, height: 34 }}
          onClick={onBack}
        />
        <p className="text-2xl font-bold flex-1 text-center">{name}</p>
        <Button
          label={<Share />}
          className="style-primary-button"
          style={{ borderRadius: '50%', width: 34, height: 34 }}
          onClick={() => {
            const url = window.location.href;
            const message = `It’s time to save with Vaquita! Join the ${name} group. ${url}`;
            
            if (navigator.share) {
              navigator
                .share({
                  title: 'Vaquita Group',
                  text: message,
                  url,
                })
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Error sharing: ', error));
            } else {
              const fallbackUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
              window.open(fallbackUrl, '_blank');
            }
          }}
        />
      </div>
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
    </div>
  );
}
