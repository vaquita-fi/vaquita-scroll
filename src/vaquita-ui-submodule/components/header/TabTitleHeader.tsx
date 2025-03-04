import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export const TabTitleHeader = ({ text }: { text: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="text-primary-200 text-4xl text-center flex justify-between items-center h-20 min-h-20">
      {pathname.split('/').length > 2 && (
        <button onClick={handleBack}>
          <Image
            src="/icons/back-arrow.svg"
            alt="Groups Active"
            width={28}
            height={28}
          />
        </button>
      )}
      <p className="text-xl font-normal text-center">{text}</p>
      <div className="invisible">
        <Image
          src="/icons/back-arrow.svg"
          alt="Groups Active"
          width={28}
          height={28}
        />
      </div>
    </div>
  );
};
