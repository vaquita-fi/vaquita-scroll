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
  title: 'Vaquita.fi',
  description: 'El poder de Ahorrar en comunidad',
  openGraph: {
    title: 'Vaquita.fi',
    description: 'El poder de Ahorrar en comunidad',
    images: [ `${NEXT_PUBLIC_URL}/vibes/vibes-19.png` ],
  },
};

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
        <OnchainProviders>{children}</OnchainProviders>
      </ReactQueryProvider>
    </NextUIProvider>
    </body>
    </html>
  );
}
