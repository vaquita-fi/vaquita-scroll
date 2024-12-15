import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';

export const Home = ({
  walletButtons,
  isConnected,
  walletButton,
}: {
  walletButton: ReactNode;
  walletButtons: ReactNode;
  isConnected: boolean;
}) => {
  return (
    <div className="flex flex-col bg-bg-100">
      <Header walletButtons={walletButtons} />
      <HeroSection isConnected={isConnected} walletButton={walletButton} />
      <HowItWorks />
      {/* <TeamSection /> */}
      <Footer />
    </div>
  );
};
