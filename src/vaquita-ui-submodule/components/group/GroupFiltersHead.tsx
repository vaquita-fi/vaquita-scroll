import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { Dispatch, SetStateAction } from 'react';
import { GroupFilters, GroupPeriod } from '../../types';
import { Button } from '../buttons';
import { InputSelect, RangeSlider } from '../form';
import { BiSortDownOutlineIcon, BiSortOutlineIcon, BiSortUpOutlineIcon, FilterOutlineIcon } from '../icons';

const sortingOptions = [
  {
    text: 'Amount ↑',
    value: '+amount',
  },
  {
    text: 'Amount ↓',
    value: '-amount',
  },
  {
    text: 'Date ↑',
    value: '+date',
  },
  {
    text: 'Date ↓',
    value: '-date',
  },
  // {
  //   text: 'Slots ↑',
  //   value: '+slots',
  // },
  // {
  //   text: 'Slots ↓',
  //   value: '-slots',
  // },
  {
    text: 'Total Members ↑',
    value: '+totalMembers',
  },
  {
    text: 'Total Members ↓',
    value: '-totalMembers',
  },
];

const periodOptions = [
  {
    text: 'All Period',
    value: undefined,
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

const Check = () => (
  <svg
    width="10"
    height="8"
    viewBox="0 0 10 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.57994 7.57998C3.37994 7.57998 3.18994 7.49998 3.04994 7.35998L0.219941 4.52998C-0.0700586 4.23998 -0.0700586 3.75998 0.219941 3.46998C0.509941 3.17998 0.989941 3.17998 1.27994 3.46998L3.57994 5.76998L8.71994 0.629976C9.00994 0.339976 9.48994 0.339976 9.77994 0.629976C10.0699 0.919976 10.0699 1.39998 9.77994 1.68998L4.10994 7.35998C3.96994 7.49998 3.77994 7.57998 3.57994 7.57998Z"
      fill="black"
    />
  </svg>
);

const X = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.06011 3.99998L7.36011 1.69998C7.65011 1.40998 7.65011 0.929985 7.36011 0.639985C7.07011 0.349985 6.59011 0.349985 6.30011 0.639985L4.00011 2.93998L1.70011 0.639985C1.41011 0.349985 0.930107 0.349985 0.640107 0.639985C0.350107 0.929985 0.350107 1.40998 0.640107 1.69998L2.94011 3.99998L0.640107 6.29999C0.350107 6.58999 0.350107 7.06998 0.640107 7.35998C0.790107 7.50998 0.980107 7.57999 1.17011 7.57999C1.36011 7.57999 1.55011 7.50998 1.70011 7.35998L4.00011 5.05999L6.30011 7.35998C6.45011 7.50998 6.64011 7.57999 6.83011 7.57999C7.02011 7.57999 7.21011 7.50998 7.36011 7.35998C7.65011 7.06998 7.65011 6.58999 7.36011 6.29999L5.06011 3.99998Z"
      fill="black"
    />
  </svg>
);

export default function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-4 w-6 h-6 flex items-center justify-center rounded-full style-primary-button transition-all"
      style={{ borderBottomWidth: 1, fontWeight: 'normal' }}
    >
      <X />
    </button>
  );
}

interface GroupFiltersHeadProps {
  withStatus?: boolean;
  filters: GroupFilters;
  setFilters: Dispatch<SetStateAction<GroupFilters>>;
  withCreateGroupButton?: boolean;
}

export const GroupFiltersHead = ({ withStatus, filters, setFilters, withCreateGroupButton }: GroupFiltersHeadProps) => {
  
  const {
    isOpen: isOpenFilter,
    onOpen: onOpenFilter,
    onOpenChange: onOpenChangeFilter,
  } = useDisclosure();
  const router = useRouter();
  const {
    isOpen: isOpenSort,
    onOpen: onOpenSort,
    onOpenChange: onOpenChangeSort,
  } = useDisclosure();
  
  const toggleCheckbox = (key: keyof GroupFilters) => {
    setFilters((prev) => ({ ...prev, pending: false, active: false, completed: false, [key]: !prev[key] }));
  };
  
  return (
    <div className="flex gap-2 justify-center items-center py-2">
      {withCreateGroupButton ? (
        <Button
          className="w-full style-primary-button hover-effect"
          onClick={() => router.push('/my-groups/create')}
          label="Create New Group"
        />
      ) : (
        <input
          className="w-full h-[30px] px-4 border border-black rounded-xl bg-transparent text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          min={0}
          placeholder="Search by name"
          autoComplete="off"
          onChange={({ target }) =>
            setFilters((prevState) => ({ ...prevState, name: target.value }))
          }
        />
      )}
      <button className="block md:hidden text-xl" onClick={onOpenSort}>
        <BiSortOutlineIcon size={30} />
      </button>
      <button className="block md:hidden text-xl" onClick={onOpenFilter}>
        <FilterOutlineIcon size={30} />
      </button>
      <div className="hidden md:flex gap-2 w-1/4">
        <InputSelect<GroupPeriod | undefined>
          label="Filter by period"
          options={periodOptions}
          value={filters.period ?? undefined}
          onChange={(period) =>
            setFilters((prevState) => ({
              ...prevState,
              period: period ?? null,
            }))
          }
          size="small"
          className="flex-1 "
        />
      </div>
      <div className="hidden md:flex gap-2 w-1/4">
        <InputSelect
          label="Order by"
          options={sortingOptions}
          value={filters.orderBy ?? undefined}
          onChange={(orderBy) =>
            setFilters((prevState) => ({ ...prevState, orderBy }))
          }
          size="small"
          className="flex-1"
        />
      </div>
      <Modal
        isOpen={isOpenSort}
        placement="bottom"
        onOpenChange={onOpenChangeSort}
        backdrop="opaque"
        style={{
          marginBottom: '0px',
        }}
        className="rounded-none rounded-t-lg"
        classNames={{
          base: 'style-stand-out',
        }}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                Custom Sort
                <CloseButton onClick={onClose} />
              </ModalHeader>
              <ModalBody>
                {[
                  { label: 'Collateral amount', key: 'amount' },
                  { label: 'Period payment', key: 'period' },
                  { label: 'Number of participants', key: 'totalMembers' },
                ].map(({ label, key }) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm">{label}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            orderBy: `+${key}`,
                          }))
                        }
                        className={`w-6 h-6 flex items-center justify-center rounded-md border border-black ${
                          filters.orderBy === `+${key}`
                            ? 'style-primary-button'
                            : ''
                        }`}
                        style={{ borderBottomWidth: 1 }}
                      >
                        <BiSortUpOutlineIcon />
                      </button>
                      <button
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            orderBy: `-${key}`,
                          }))
                        }
                        className={`w-6 h-6 flex items-center justify-center rounded-md border border-black ${
                          filters.orderBy === `-${key}`
                            ? 'style-primary-button'
                            : ''
                        }`}
                        style={{ borderBottomWidth: 1 }}
                      >
                        <BiSortDownOutlineIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenFilter}
        placement="bottom"
        onOpenChange={onOpenChangeFilter}
        backdrop="opaque"
        style={{
          marginBottom: '0px',
        }}
        className="rounded-none rounded-t-lg"
        classNames={{
          base: 'style-stand-out',
        }}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center">
                Custom Filter
                <CloseButton onClick={onClose} />
              </ModalHeader>
              <ModalBody>
                <RangeSlider
                  min={10}
                  max={1000}
                  minValue={filters.minAmount ?? 10}
                  maxValue={filters.maxAmount ?? 1000}
                  step={10}
                  onChange={(minValue, maxValue) =>
                    setFilters((prevState) => ({
                      ...prevState,
                      minAmount: minValue,
                      maxAmount: maxValue,
                    }))
                  }
                />
                {(withStatus
                    ? [
                      { label: 'Pending rounds', key: 'pending' },
                      { label: 'Active rounds', key: 'active' },
                      { label: 'Completed rounds', key: 'completed' },
                    ]
                    : []
                ).map(({ label, key }) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm">{label}</span>
                    <button
                      onClick={() => toggleCheckbox(key as keyof GroupFilters)}
                      className={`w-6 h-6 flex items-center justify-center rounded-md border border-black ${
                        filters[key as keyof GroupFilters]
                          ? 'style-primary-button'
                          : 'bg-white'
                      }`}
                      style={{ borderBottomWidth: 1 }}
                    >
                      {filters[key as keyof GroupFilters] && <Check />}
                    </button>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
