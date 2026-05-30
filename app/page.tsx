"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Terminal, Zap, ExternalLink } from "lucide-react";

const SYSTEM_LOGS = [
  "[SYSTEM] Initializing Sniper Platform v2.0...",
  "[OK] Neural network loaded",
  "[OK] Solana RPC connected",
  "[OK] Risk engine calibrated",
  "[OK] DexScreener API connected",
  "[SYSTEM] Ready to scan tokens.",
];

const TOKEN_SCAN = [
  "> Loading token data...",
  "> Analyzing on-chain authority...",
  "> Checking liquidity pool...",
  "> Calculating risk factors...",
  "> Generating security report...",
];

// Precompute random values for deterministic animations
const MATRIX_ANIMATIONS = Array.from({ length: 20 }).map((_, i) => ({
  duration: 3 + (i * 0.3) % 4, // Deterministic value based on index
  delay: (i * 0.1) % 2,
  characters: Array.from({ length: 30 }).map((_, j) =>
    (i + j) % 2 === 0 ? "1" : "0"
  ),
}));

export default function Home() {
  const [logIndex, setLogIndex] = useState(0);
  const [showScan, setShowScan] = useState(false);
  const [scanIndex, setScanIndex] = useState(0);
  const [blinking, setBlinking] = useState(true);
  const [blockNumber] = useState(250000000); // Fixed initial value

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setBlinking(b => !b), 500);
    return () => clearInterval(interval);
  }, []);

  // System boot sequence
  useEffect(() => {
    if (logIndex < SYSTEM_LOGS.length) {
      const timer = setTimeout(() => setLogIndex(i => i + 1), 400);
      return () => clearTimeout(timer);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowScan(true);
    }
  }, [logIndex]);

  // Token scan animation
  useEffect(() => {
    if (showScan && scanIndex < TOKEN_SCAN.length) {
      const timer = setTimeout(() => setScanIndex(i => i + 1), 500);
      return () => clearTimeout(timer);
    }
  }, [showScan, scanIndex]);

  return (
    <div className="relative min-h-screen pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Matrix Rain Background (Simple Version) */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
        {MATRIX_ANIMATIONS.map((anim, i) => (
          <motion.div
            key={i}
            className="absolute w-1 text-[rgb(82,255,120)] text-xs"
            style={{
              left: `${i * 5}%`,
              top: -50,
            }}
            animate={{
              y: ["0vh", "100vh"],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: anim.duration,
              repeat: Infinity,
              ease: "linear",
              delay: anim.delay,
            }}
          >
            {anim.characters.map((char, j) => (
              <div key={j} className="opacity-50">
                {char}
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Terminal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10"
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-[rgba(10,10,26,0.95)] border border-[rgba(82,255,120,0.2)] rounded-t-lg">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[rgb(255,82,82)]" />
            <div className="w-3 h-3 rounded-full bg-[rgb(255,180,76)]" />
            <div className="w-3 h-3 rounded-full bg-[rgb(82,255,120)]" />
          </div>
          <div className="flex-1 text-center text-xs text-[rgba(82,255,120,0.6)] font-bold">
            [SNIPER-PLATFORM] — /home/sniper/terminal
          </div>
          <Terminal className="w-4 h-4 text-[rgba(82,255,120,0.6)]" />
        </div>

        {/* Terminal Body */}
        <div className="bg-[rgba(5,5,16,0.98)] border border-t-0 border-[rgba(82,255,120,0.2)] rounded-b-lg p-6 min-h-[500px]">
          {/* Welcome ASCII Art */}
          <pre className="text-xs sm:text-sm text-[rgb(82,255,120)] mb-6 opacity-80">
{` ███████╗███╗   ██╗██╗██████╗ ███████╗██████╗ 
 ██╔════╝████╗  ██║██║██╔══██╗██╔════╝██╔══██╗
 ███████╗██╔██╗ ██║██║██████╔╝█████╗  ██████╔╝
 ╚════██║██║╚██╗██║██║██╔═══╝ ██╔══╝  ██╔══██╗
 ███████║██║ ╚████║██║██║     ███████╗██║  ██║
 ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝`}
          </pre>

          {/* System Boot Logs */}
          <div className="mb-8">
            {SYSTEM_LOGS.slice(0, logIndex).map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm mb-2"
              >
                {log}
              </motion.div>
            ))}
          </div>

          {/* Token Scan Animation */}
          {showScan && (
            <div className="mb-8 pl-4 border-l-2 border-[rgba(82,255,120,0.3)]">
              {TOKEN_SCAN.slice(0, scanIndex).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm mb-2 text-[rgba(255,82,176,0.9)]"
                >
                  {line}
                </motion.div>
              ))}
              {scanIndex === TOKEN_SCAN.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-4 border border-[rgba(82,255,120,0.3)] rounded bg-[rgba(10,10,26,0.8)]"
                >
                  <div className="text-[rgb(82,255,120)] font-bold mb-2">✓ SCAN COMPLETE</div>
                  <div className="text-xs text-[rgba(82,255,120,0.7)] grid grid-cols-2 gap-2">
                    <div>RISK GRADE: <span className="text-[rgb(16,185,129)] font-bold">A</span></div>
                    <div>LIQUIDITY: <span className="text-[rgb(82,255,120)] font-bold">$1.2M</span></div>
                    <div>VOLUME 24H: <span className="text-[rgb(82,255,120)] font-bold">$450K</span></div>
                    <div>HOLDERS: <span className="text-[rgb(82,255,120)] font-bold">1,247</span></div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Command Line */}
          <div className="flex items-center gap-2">
            <span className="text-[rgb(255,82,176)] font-bold">sniper@platform:~$</span>
            <span className="text-[rgb(82,255,120)]">{scanIndex === TOKEN_SCAN.length ? " ready" : ""}</span>
            <motion.span
              animate={{ opacity: blinking ? 1 : 0 }}
              className="w-3 h-5 bg-[rgb(82,255,120)] ml-1"
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Action Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="mt-12 grid sm:grid-cols-3 gap-4"
      >
        <Link href="/dashboard">
          <motion.div
            whileHover={{ scale: 1.02, borderColor: "rgba(82,255,120,0.5)" }}
            className="p-6 bg-[rgba(10,10,26,0.95)] border border-[rgba(82,255,120,0.2)] rounded-lg cursor-pointer group"
          >
            <Zap className="w-8 h-8 text-[rgb(82,255,120)] mb-3 group-hover:animate-pulse" />
            <h3 className="text-lg font-bold text-[rgb(82,255,120)] mb-1">[LAUNCH DASHBOARD]</h3>
            <p className="text-sm text-[rgba(82,255,120,0.6)]">Access real-time token scanning</p>
          </motion.div>
        </Link>

        <Link href="/docs">
          <motion.div
            whileHover={{ scale: 1.02, borderColor: "rgba(255,82,176,0.5)" }}
            className="p-6 bg-[rgba(10,10,26,0.95)] border border-[rgba(255,82,176,0.2)] rounded-lg cursor-pointer group"
          >
            <Terminal className="w-8 h-8 text-[rgb(255,82,176)] mb-3 group-hover:animate-pulse" />
            <h3 className="text-lg font-bold text-[rgb(255,82,176)] mb-1">[API DOCS]</h3>
            <p className="text-sm text-[rgba(255,82,176,0.6)]">Integrate with your bot</p>
          </motion.div>
        </Link>

        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <motion.div
            whileHover={{ scale: 1.02, borderColor: "rgba(99,102,241,0.5)" }}
            className="p-6 bg-[rgba(10,10,26,0.95)] border border-[rgba(99,102,241,0.2)] rounded-lg cursor-pointer group"
          >
            <ExternalLink className="w-8 h-8 text-[rgb(99,102,241)] mb-3 group-hover:animate-pulse" />
            <h3 className="text-lg font-bold text-[rgb(99,102,241)] mb-1">[SOURCE CODE]</h3>
            <p className="text-sm text-[rgba(99,102,241,0.6)]">View on GitHub</p>
          </motion.div>
        </a>
      </motion.div>

      {/* Footer Status Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="fixed bottom-0 left-0 right-0 bg-[rgba(5,5,16,0.98)] border-t border-[rgba(82,255,120,0.2)] py-2 px-4 z-20"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[rgb(82,255,120)] animate-pulse" />
              <span className="text-[rgba(82,255,120,0.8)]">ONLINE</span>
            </div>
            <div className="text-[rgba(82,255,120,0.6)]">SOL: MAINNET</div>
            <div className="text-[rgba(82,255,120,0.6)]">BLOCK: {blockNumber}</div>
          </div>
          <div className="text-[rgba(82,255,120,0.6)]">
            UPTIME: 99.9% | SCANS: 12,847
          </div>
        </div>
      </motion.div>
    </div>
  );
}
