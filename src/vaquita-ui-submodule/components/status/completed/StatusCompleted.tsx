import React from 'react';
import { StatusCompletedProps } from './StatusCompleted.types';

const StatusCompleted = ({ step, nameStatus }: StatusCompletedProps) => {
  return (
    <div className="flex justify-evenly w-full">
      <div className="flex items-center flex-col text-center">
        <div className="w-[34px] h-[34px] flex items-center justify-center border border-black border-b-2 rounded-full text-lg font-bold bg-white">
          {step}
        </div>
        <span className="text-sm">{nameStatus}</span>
      </div>
    </div>
  );
};

export default StatusCompleted;
