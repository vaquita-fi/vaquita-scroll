import { ReactNode } from 'react';

export const TitleLayout = ({ children }: { children: ReactNode }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-2xl">
    {children}
  </div>
);
