import { NextUIProvider } from '@nextui-org/react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { NEXT_PUBLIC_URL } from '../config';
import './commons.css';
import './global.css';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import { ReactQueryProvider } from './react-query-provider';
import 'react-datepicker/dist/react-datepicker.css';
import 'sweetalert2/src/sweetalert2.scss';

const OnchainProviders = dynamic(
  () => import('src/components/OnchainProviders'),
  {
    ssr: false,
  },
);

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: 'Onchain App Template',
  description: 'Built with OnchainKit',
  openGraph: {
    title: 'Onchain App Template',
    description: 'Built with OnchainKit',
    images: [ `${NEXT_PUBLIC_URL}/vibes/vibes-19.png` ],
  },
};
const links: { label: string; path: string }[] = [
  { label: 'Join Group', path: '/groups' },
  { label: 'My Groups', path: '/my-groups' },
  { label: 'Profile', path: '/profile' },
];

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body>
    <NextUIProvider className="h-full">
      <ReactQueryProvider>
        {/*<UiLayout links={links}>*/}
        <OnchainProviders>{children}</OnchainProviders>
        {/*</UiLayout>*/}
      </ReactQueryProvider>
    </NextUIProvider>
    </body>
    </html>
  );
}
