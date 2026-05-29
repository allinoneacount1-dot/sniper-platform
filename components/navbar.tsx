"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@/lib/wallet/context";
import { AnimatedButton } from "@/components/ui/animated";
import Link from "next/link";

export default function Navbar() {
  const { connected, address, connecting, connect, disconnect, balance, walletName } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  const shortAddr = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";
  const walletIcon = walletName === "phantom" ? "👻" : walletName === "solflare" ? "☀️" : walletName === "backpack" ? "🎒" : "👛";

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Glass background */}
        <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm"
                whileHover={{ rotate: 15, scale: 1.1 }}
              >
                S
              </motion.div>
              <span className="text-lg font-black">
                <span className="text-white">Sniper</span>
                <span className="text-violet-400">Platform</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/docs", label: "Docs" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Wallet button */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <span className="text-xs">🟣</span>
                <span className="text-xs text-gray-400">SOL</span>
                <span className="text-xs text-white font-mono">$178.42</span>
              </div>

              {connected && address ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm">{walletIcon}</span>
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-mono text-white">{shortAddr}</div>
                      <div className="text-[10px] text-gray-500">{balance.toFixed(3)} SOL</div>
                    </div>
                  </motion.button>

                  {/* Wallet dropdown */}
                  <AnimatePresence>
                    {walletMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#12121a] border border-white/10 shadow-2xl overflow-hidden z-50"
                      >
                        <div className="p-3 border-b border-white/5">
                          <div className="text-xs text-gray-500 mb-1">Connected Wallet</div>
                          <div className="flex items-center gap-2">
                            <span>{walletIcon}</span>
                            <span className="text-sm font-mono text-white">{shortAddr}</span>
                          </div>
                          <div className="text-xs text-violet-400 mt-1">{balance.toFixed(4)} SOL</div>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(address);
                              setWalletMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all cursor-pointer"
                          >
                            📋 Copy Address
                          </button>
                          <Link
                            href={`https://solscan.io/account/${address}`}
                            target="_blank"
                            className="block w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            onClick={() => setWalletMenuOpen(false)}
                          >
                            🔍 View on Solscan
                          </Link>
                          <button
                            onClick={() => {
                              disconnect();
                              setWalletMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          >
                            🔌 Disconnect
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <AnimatedButton variant="primary" size="sm" onClick={connect} loading={connecting}>
                  {connecting ? "" : "👛"} Connect Wallet
                </AnimatedButton>
              )}

              {/* Mobile menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white cursor-pointer"
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {[
                  { href: "/dashboard", label: "📊 Dashboard" },
                  { href: "/docs", label: "📖 Documentation" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-3 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Click outside to close wallet menu */}
      {walletMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setWalletMenuOpen(false)} />
      )}
    </>
  );
}
