"use client";
import { WalletProvider } from "@/lib/wallet/context";
import Navbar from "@/components/navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <Navbar />
      <main className="pt-16">{children}</main>
    </WalletProvider>
  );
}
