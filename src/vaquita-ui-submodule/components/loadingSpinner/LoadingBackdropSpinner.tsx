import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoadingSpinnerProps {
  size?: number;
  title?: string;
}

export const LoadingBackdropSpinner = ({ size = 64, title = '' }: LoadingSpinnerProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm shadow-lg z-50">
      <FaSpinner className="animate-spin text-primary-200" size={size} />
      <p className="text-xl">{title}</p>
    </div>
  );
};
