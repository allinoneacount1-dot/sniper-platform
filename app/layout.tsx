import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/lib/wallet/context";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Sniper Platform — AI-Powered Solana Token Risk Screener",
  description: "Real-time on-chain analysis, liquidity tracking, and rug detection for Solana tokens. Snipe smarter, not harder.",
  keywords: ["solana", "token", "sniper", "risk", "scanner", "crypto", "defi"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0a0a0f] text-white min-h-screen">
        <WalletProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
