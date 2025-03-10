import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "../buttons";

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
export const TabTitleHeader = ({ text }: { text: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="text-primary-200 text-4xl text-center flex justify-between items-center h-20 min-h-20">
      <Button
        label={<Left />}
        className="style-primary-button"
        style={{ borderRadius: "50%", width: 34, height: 34 }}
        onClick={handleBack}
      />
      <p className="text-2xl font-bold flex-1 text-center text-black">{text}</p>
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
