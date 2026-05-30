import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AnimatedLayout from "@/components/animated-layout";
import Navbar from "@/components/navbar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SNIPER-PLATFORM // SYSTEM v2.0",
  description: "TERMINAL INTERFACE FOR SOLANA TOKEN RISK SCREENING",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.className} antialiased bg-[#050516] text-[rgb(82,255,120)] min-h-screen`}>
        <AnimatedLayout>
          <Navbar />
          {children}
        </AnimatedLayout>
      </body>
    </html>
  );
}
