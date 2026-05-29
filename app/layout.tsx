import type { Metadata } from "next";
import "./globals.css";
import AnimatedLayout from "@/components/animated-layout";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Sniper Platform — AI-Powered Solana Token Risk Screener",
  description: "Real-time on-chain analysis, liquidity tracking, and rug detection for Solana tokens.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#06060c] text-white min-h-screen">
        <AnimatedLayout>
          <Navbar />
          {children}
        </AnimatedLayout>
      </body>
    </html>
  );
}
