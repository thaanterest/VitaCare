"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { CartProvider } from "@/context/CartContext";
import { ConsentProvider } from "@/context/ConsentContext";
import CookieBanner from "@/components/pdpa/CookieBanner";

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={true}>
      <ConsentProvider>
        <CartProvider>
          {children}
          <CookieBanner />
        </CartProvider>
      </ConsentProvider>
    </SessionProvider>
  );
}
