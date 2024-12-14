import type { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "../config";

import "./global.css";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";
import { UiLayout } from "src/components/layout/ui-layout";
import { NextUIProvider } from "@nextui-org/react";

const OnchainProviders = dynamic(
  () => import("src/components/OnchainProviders"),
  {
    ssr: false,
  }
);

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "Onchain App Template",
  description: "Built with OnchainKit",
  openGraph: {
    title: "Onchain App Template",
    description: "Built with OnchainKit",
    images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
  },
};
const links: { label: string; path: string }[] = [
  { label: "Join Group", path: "/groups" },
  { label: "My Groups", path: "/my-groups" },
  { label: "Profile", path: "/profile" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex items-center justify-center">
        <NextUIProvider className="h-full w-full">
          <UiLayout links={links}>
            <OnchainProviders>{children}</OnchainProviders>
          </UiLayout>
        </NextUIProvider>
      </body>
    </html>
  );
}
