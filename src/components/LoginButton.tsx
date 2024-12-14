"use client";
import React from "react";
import WalletWrapper from "./WalletWrapper";

export default function LoginButton() {
  return (
    <WalletWrapper
      className="min-w-[90px] bg-primary-200 hover:bg-primary-100"
      text="Log in"
      withWalletAggregator={true}
    />
  );
}
