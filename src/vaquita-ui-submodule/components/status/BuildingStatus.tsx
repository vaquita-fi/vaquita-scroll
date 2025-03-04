import React from 'react';
import StatusCompleted from './completed/StatusCompleted';
import Divider from './Divider/Divider';
import StatusStarted from './started/StatusStarted';

interface BuildingStatusProps {
  value1: boolean;
  label1: string;
  value2: boolean;
  label2: string;
  value3: boolean;
  label3: string;
}

export const BuildingStatus = ({
                                 value1,
                                 label1,
                                 value2,
                                 label2,
                                 value3,
                                 label3,
                               }: BuildingStatusProps) => {
  return (
    <div className="flex my-4 ">
      {value1 ? (
        <>
          <StatusCompleted nameStatus={label1} step="1" />
        </>
      ) : (
        <>
          <StatusStarted nameStatus={label1} step="1" />
        </>
      )}
      {/*<Divider className={value1 ? 'border-primary-200' : ''} />*/}
      <Divider className="border-black" />
      {value2 ? (
        <>
          <StatusCompleted nameStatus={label2} step="2" />
        </>
      ) : (
        <>
          <StatusStarted nameStatus={label2} step="2" />
        </>
      )}
      {/*<Divider className={value2 ? 'border-primary-200' : ''} />*/}
      <Divider className="border-black" />
      {value3 ? (
        <>
          <StatusCompleted nameStatus={label3} step="3" />
        </>
      ) : (
        <>
          <StatusStarted nameStatus={label3} step="3" />
        </>
      )}
    </div>
  );
};
