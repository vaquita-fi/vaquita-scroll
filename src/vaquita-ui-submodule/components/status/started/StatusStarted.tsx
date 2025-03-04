import React from 'react';
import { StatusStartedProps } from './Started.types';

const StatusStarted = ({ step, nameStatus }: StatusStartedProps) => {
  return (
    <div className="flex justify-evenly w-full">
      <div className="flex items-center flex-col text-center">
        <div className="w-[34px] h-[34px] flex items-center justify-center border border-black border-b-2 rounded-full text-lg font-bold">
          {step}
        </div>
        <span className="text-sm">{nameStatus}</span> {}
      </div>
    </div>
  );
};

export default StatusStarted;
