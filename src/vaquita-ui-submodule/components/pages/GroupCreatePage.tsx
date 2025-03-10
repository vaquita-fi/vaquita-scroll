'use client';

import { TitleLayout } from '@/vaquita-ui-submodule/components/layouts/TitleLayout';
import { useVaquitaDeposit } from '@/web3/hooks';
import { Input, Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ONE_DAY } from '../../constants';
import { logError, showNotification } from '../../helpers';
import { useGroup } from '../../hooks';
import { AddressType, GroupCreateDTO, GroupCrypto, GroupPeriod } from '../../types';
import { Button } from '../buttons';
import { Option } from '../form';
import { GroupSummary } from '../group/GroupSummary';
import { TabTitleHeader } from '../header';
import { LoadingBackdropSpinner } from '../loadingSpinner';
import { Message } from '../message';

// const optionsCrypto: Option<GroupCrypto>[] = [
//   {
//     text: "USDC",
//     value: GroupCrypto.USDC,
//   },
//   // {
//   //   text: 'SOL',
//   //   value: GroupCrypto.SOL,
//   // },
// ];

const optionsPeriod: Option<GroupPeriod>[] = [
  {
    text: 'Daily',
    value: GroupPeriod.DAILY,
  },
  {
    text: 'Monthly',
    value: GroupPeriod.MONTHLY,
  },
  {
    text: 'Weekly',
    value: GroupPeriod.WEEKLY,
  },
];

const optionsMembers: Option<number>[] = [
  {
    text: '2',
    value: 2,
  },
  {
    text: '3',
    value: 3,
  },
  {
    text: '4',
    value: 4,
  },
  {
    text: '5',
    value: 5,
  },
  {
    text: '6',
    value: 6,
  },
  {
    text: '8',
    value: 8,
  },
  {
    text: '10',
    value: 10,
  },
  {
    text: '12',
    value: 12,
  },
];

const messageText =
  'It is necessary to deposit the collateral to ensure that each person can participate in the group, and to guarantee that everyone will pay appropriately';

export const GroupCreatePage = ({ address }: { address?: AddressType }) => {
  const now = new Date();
  const [ newGroup, setNewGroup ] = useState<
    Omit<GroupCreateDTO, 'customerPublicKey' | 'transactionSignature'>
  >({
    name: '',
    amount: 0,
    crypto: GroupCrypto.USDC,
    totalMembers: 2,
    period: GroupPeriod.MONTHLY,
    startsOnTimestamp: now.getTime() + ONE_DAY,
  });
  const [ loading, setLoading ] = useState(false);
  const router = useRouter();
  const { depositCollateralAndCreate } = useVaquitaDeposit();
  const { createGroup, depositGroupCollateral, deleteGroup, joinGroup } =
    useGroup();
  useEffect(() => {
    if (!address) {
      router.push('/groups');
    }
  }, [ router, address ]);
  
  if (!address) {
    return (
      <TitleLayout>
        <p>Please select a wallet</p>
      </TitleLayout>
    );
  }
  
  const onSave = async () => {
    setLoading(true);
    try {
      console.info({ newGroup });
      const response = await createGroup(
        newGroup.name,
        newGroup.amount,
        newGroup.crypto,
        newGroup.totalMembers,
        newGroup.period,
        newGroup.startsOnTimestamp,
        address,
      );
      if (!response.success) {
        console.error(response);
        throw new Error('group not created');
      }
      const group = response.content;
      console.info({ newGroupCreated: group });
      const amount = group.collateralAmount;
      const { tx, receipt, error, success } =
        await depositCollateralAndCreate(group);
      if (!success) {
        await deleteGroup(group.id);
        logError('transaction error', error);
        throw new Error('transaction error');
      }
      const playerAddedDataLog = receipt?.logs?.[10]?.data ?? '';
      await joinGroup(group.id, address, playerAddedDataLog);
      await depositGroupCollateral(group.id, address, tx, amount);
      router.push('/my-groups?tab=pending');
      showNotification('Group created successfully!', 'success');
    } catch (error) {
      logError('Failed to create group.', error);
      showNotification('Failed to create group.', 'error');
    }
    setLoading(false);
  };
  
  // const filterDateTime = (time: Date) => {
  //   const selectedDate = new Date(time);
  //   return (
  //     selectedDate.getTime() >= now.getTime() &&
  //     selectedDate.getTime() - ONE_DAY * 7 <= now.getTime()
  //   );
  // };
  
  return (
    <div>
      {loading && <LoadingBackdropSpinner />}
      <div className="flex flex-col justify-between style-stand-out style-border px-5 pt-4 pb-6 rounded-lg gap-2 my-4">
        <TabTitleHeader text="Create Group" />
        <div className="flex flex-col justify-center gap-2">
          <Input
            isRequired
            label="Group Name"
            placeholder="e.g. Vaquita"
            type="text"
            value={newGroup.name}
            onChange={(e) =>
              setNewGroup((prevState) => ({
                ...prevState,
                name: e.target.value,
              }))
            }
          />
          <div className="flex gap-2 w-full">
            {/* <div className="w-1/2">
              <label className="text-sm mb-0.5 text-accent-100">Amount *</label>
              <InputText<number>
                label="Amount"
                type="number"
                value={newGroup.amount}
                placeHolder="e.g. 300"
                onChange={(amount) => {
                  const updatedAmount = amount === undefined ? 0 : amount;

                  setNewGroup((prevState) => ({
                    ...prevState,
                    amount: Math.round(updatedAmount),
                  }));
                }}
              />
            </div> */}
            {/* <div className="w-1/2">
              <label className="text-sm mb-0.5 text-accent-100">Crypto</label>
              <InputSelect
                label="Crypto"
                options={optionsCrypto}
                defaultValue={optionsCrypto[0].value}
                value={newGroup.crypto}
                onChange={(crypto) =>
                  setNewGroup((prevState) => ({ ...prevState, crypto }))
                }
              />
            </div> */}
            <Input
              isRequired
              label="Amount Payment USDC"
              placeholder="e.g. 10"
              type="number"
              value={newGroup.amount.toString()}
              max={100_000}
              min={1}
              onChange={(e) => {
                const updatedAmount =
                  e.target.value === undefined ? 0 : e.target.value;
                setNewGroup((prevState) => ({
                  ...prevState,
                  amount: Math.round(Number(updatedAmount)),
                }));
              }}
            />
          </div>
          <div className="flex gap-2 w-full">
            {/* <div className="w-1/2">
              <label className="text-sm mb-0.5 text-accent-100">
                Payment period
              </label>
              <InputSelect
                label="Payment period"
                options={[
                  {
                    text: "Monthly",
                    value: GroupPeriod.MONTHLY,
                  },
                  {
                    text: "Weekly",
                    value: GroupPeriod.WEEKLY,
                  },
                ]}
                value={newGroup.period}
                onChange={(period) =>
                  setNewGroup((prevState) => ({ ...prevState, period }))
                }
              />
            </div> */}
            <Select
              isRequired
              className="w-1/2"
              items={optionsPeriod}
              label="Payment period"
              selectedKeys={[ newGroup.period ]}
              onChange={(e) => {
                const period = e.target.value as GroupPeriod;
                setNewGroup((prevState) => ({ ...prevState, period: period }));
              }}
            >
              {optionsPeriod.map((item) => {
                return <SelectItem key={item.value}>{item.text}</SelectItem>;
              })}
            </Select>
            {/* <div className="w-1/2">
            <label className="text-sm mb-0.5 text-accent-100">Starts in</label>
            <InputDate
              label="Starts in"
              value={new Date(newGroup.startsOnTimestamp)}
              onChange={(date) =>
                setNewGroup((prevState) => ({
                  ...prevState,
                  startsOnTimestamp: date.getTime(),
                }))
              }
              filterTime={filterDateTime}
              filterDate={filterDateTime}
            />
          </div> */}
            {/* <div className="w-1/2">
              <label className="text-sm mb-0.5 text-accent-100">Members</label>
              <InputSelect<number>
                label="Members"
                options={optionsMembers}
                value={newGroup.totalMembers}
                onChange={(totalMembers) =>
                  setNewGroup((prevState) => ({
                    ...prevState,
                    totalMembers: +totalMembers,
                  }))
                }
              />
            </div> */}
            <Select
              isRequired
              className="w-1/2"
              items={optionsMembers}
              label="Members"
              value={newGroup.totalMembers}
              onChange={(e) => {
                const totalMembers = e.target.value;
                setNewGroup((prevState) => ({
                  ...prevState,
                  totalMembers: +totalMembers,
                }));
              }}
            >
              {optionsMembers.map((item) => {
                return <SelectItem key={item.value}>{item.text}</SelectItem>;
              })}
            </Select>
          </div>
          {/* <div className="flex justify-center text-2xl text-accent-100">
          Group Information
          </div> */}
        </div>
        <div className="mb-1">
          <p className="text-2xl py-4 flex-1 text-center text-black">
            Group Information
          </p>
          <GroupSummary {...newGroup} />
        </div>
      </div>
      <Message messageText={messageText} />
      <div className="flex flex-col gap-2 mb-4 justify-between mt-4">
        <Button
          label="Create and deposit collateral"
          size="large"
          className="style-primary-button"
          onClick={onSave}
          disabled={!(newGroup.name.length > 2 && newGroup.amount > 0)}
        />
      </div>
    </div>
  );
};
