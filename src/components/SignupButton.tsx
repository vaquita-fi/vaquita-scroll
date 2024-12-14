"use client";
import React from "react";
import WalletWrapper from "./WalletWrapper";

export default function SignupButton() {
  return (
    <WalletWrapper
      className="ockConnectWallet_Container min-w-[90px] shrink bg-bg-200 text-white hover:bg-bg-300"
      text="Sign up"
    />
  );
}
