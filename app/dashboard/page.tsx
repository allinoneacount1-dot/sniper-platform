"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { RefreshCw, Shield, AlertTriangle, ChevronDown, ArrowUpRight, ExternalLink } from "lucide-react";

// Sample token data
const SAMPLE_TOKENS = [
  {
    mint: "9wT82fK5M3Z6L9Q2xN7yP4R8sT1uV3wX5yZ7aB9cD1eF3gH5jK7",
    symbol: "SOLAR",
    name: "Solar Protocol",
    price: 0.0045,
    liquidity: 1250000,
    volume24h: 450000,
    change24h: 12.5,
    marketCap: 4500000,
    riskScore: 85,
    riskGrade: "A",
    warnings: [],
  },
  {
    mint: "8K2fL9Q3xZ7M6N5yP4R8sT1uV3wX5yZ7aB9cD1eF3gH5jK7m",
    symbol: "MOON",
    name: "MoonShot",
    price: 0.00012,
    liquidity: 50000,
    volume24h: 120000,
    change24h: -5.2,
    marketCap: 120000,
    riskScore: 35,
    riskGrade: "D",
    warnings: ["Mint authority not revoked", "Low liquidity"],
  },
  {
    mint: "7J3fK8Q2wZ6L5M4yP3R7sT0uV2wX4yZ6aB8cD0eF2gH4jK6m",
    symbol: "PUMP",
    name: "PumpFun Token",
    price: 0.00085,
    liquidity: 250000,
    volume24h: 890000,
    change24h: 45.3,
    marketCap: 850000,
    riskScore: 62,
    riskGrade: "B",
    warnings: ["High volatility detected"],
  },
  {
    mint: "6H4gJ7P1eY5K4L3zR2Q6sT9uV1wX3yZ5aB7cD9eF1gH3jK5m",
    symbol: "RUGG",
    name: "VerySafeToken",
    price: 0.00003,
    liquidity: 5000,
    volume24h: 2000,
    change24h: -80.0,
    marketCap: 30000,
    riskScore: 12,
    riskGrade: "F",
    warnings: ["Mint authority active", "Freeze authority active", "Extreme concentration"],
  },
];

const GRADE_COLORS: Record<string, string> = {
  A: "rgb(16, 185, 129)",
  B: "rgb(132, 204, 22)",
  C: "rgb(234, 179, 8)",
  D: "rgb(249, 115, 22)",
  F: "rgb(239, 68, 68)",
  "?": "rgb(156, 163, 175)",
};

export default function Dashboard() {
  const [tokens] = useState(SAMPLE_TOKENS);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"all" | "safe" | "risky">("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredTokens = tokens.filter((token) => {
    if (selectedTab === "safe") return ["A", "B"].includes(token.riskGrade);
    if (selectedTab === "risky") return ["D", "F"].includes(token.riskGrade);
    return true;
  });

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[rgb(82,255,120)]">
              [TOKEN SCANNER]
            </h1>
            <p className="text-sm text-[rgba(82,255,120,0.6)] mt-1">
              Real-time Solana token risk analysis
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-[rgba(82,255,120,0.5)] text-[rgb(82,255,120)] hover:bg-[rgba(82,255,120,0.1)] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "[SCANNING...]" : "[REFRESH]"}
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[rgba(82,255,120,0.2)]">
          {(["all", "safe", "risky"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                selectedTab === tab
                  ? "border-[rgb(82,255,120)] text-[rgb(82,255,120)]"
                  : "border-transparent text-[rgba(82,255,120,0.5)] hover:text-[rgb(82,255,120)]"
              }`}
            >
              {`[${tab.toUpperCase()}]`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: "TOTAL SCANS", value: "12,847", color: "rgb(82,255,120)" },
          { label: "SAFE TOKENS", value: "8,231", color: "rgb(16,185,129)" },
          { label: "RISKY TOKENS", value: "1,247", color: "rgb(239,68,68)" },
          { label: "AVG GRADE", value: "B", color: "rgb(132,204,22)" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-[rgba(10,10,26,0.95)] border border-[rgba(82,255,120,0.2)]"
          >
            <div className="text-xs text-[rgba(82,255,120,0.5)] mb-1">{stat.label}</div>
            <div className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Token List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {loading ? (
          // Loading State
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-[rgba(10,10,26,0.95)] border border-[rgba(82,255,120,0.2)]"
            >
              <div className="h-4 bg-[rgba(82,255,120,0.1)] w-1/3 mb-2 animate-pulse" />
              <div className="h-3 bg-[rgba(82,255,120,0.1)] w-1/2 animate-pulse" />
            </div>
          ))
        ) : filteredTokens.length === 0 ? (
          <div className="text-center py-12 text-[rgba(82,255,120,0.5)]">
            No tokens found in this category
          </div>
        ) : (
          filteredTokens.map((token, i) => (
            <motion.div
              key={token.mint}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[rgba(10,10,26,0.95)] border border-[rgba(82,255,120,0.2)]"
            >
              {/* Token Header */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              >
                <div className="flex items-center gap-4">
                  {/* Risk Grade Badge */}
                  <div
                    className="w-12 h-12 flex items-center justify-center border-2 font-black text-lg"
                    style={{
                      borderColor: GRADE_COLORS[token.riskGrade],
                      color: GRADE_COLORS[token.riskGrade],
                    }}
                  >
                    {token.riskGrade}
                  </div>
                  <div>
                    <div className="font-bold text-[rgb(82,255,120)]">
                      {token.symbol}
                    </div>
                    <div className="text-xs text-[rgba(82,255,120,0.5)]">
                      {token.name}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-mono text-[rgb(82,255,120)]">
                      ${token.price.toFixed(6)}
                    </div>
                    <div className={`text-xs ${token.change24h >= 0 ? "text-[rgb(16,185,129)]" : "text-[rgb(239,68,68)]"}`}>
                      {token.change24h >= 0 ? "+" : ""}{token.change24h.toFixed(1)}%
                    </div>
                  </div>
                  <div className="text-right hidden md:block">
                    <div className="text-xs text-[rgba(82,255,120,0.5)]">LIQ</div>
                    <div className="text-sm font-mono text-[rgb(82,255,120)]">
                      ${(token.liquidity / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[rgba(82,255,120,0.6)] transition-transform ${
                      expandedIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[rgba(82,255,120,0.2)]"
                  >
                    <div className="p-4 grid sm:grid-cols-2 gap-6">
                      {/* Risk Details */}
                      <div>
                        <h3 className="text-sm font-bold text-[rgb(82,255,120)] mb-3">
                          [RISK ANALYSIS]
                        </h3>
                        {token.warnings.length > 0 ? (
                          <div className="space-y-2">
                            {token.warnings.map((warning, j) => (
                              <div
                                key={j}
                                className="flex items-start gap-2 text-xs text-[rgba(239,68,68,0.9)]"
                              >
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {warning}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-[rgba(16,185,129,0.9)]">
                            <Shield className="w-4 h-4" />
                            No warnings detected
                          </div>
                        )}
                      </div>

                      {/* Market Data */}
                      <div>
                        <h3 className="text-sm font-bold text-[rgb(82,255,120)] mb-3">
                          [MARKET DATA]
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[rgba(82,255,120,0.5)]">VOLUME: </span>
                            <span className="text-[rgb(82,255,120)] font-mono">
                              ${(token.volume24h / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <div>
                            <span className="text-[rgba(82,255,120,0.5)]">MCAP: </span>
                            <span className="text-[rgb(82,255,120)] font-mono">
                              ${(token.marketCap / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <div>
                            <span className="text-[rgba(82,255,120,0.5)]">SCORE: </span>
                            <span style={{ color: GRADE_COLORS[token.riskGrade] }} className="font-bold">
                              {token.riskScore}/100
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2">
                          <Link href={`/dashboard/${token.mint}`}>
                            <button className="px-3 py-1 text-xs border border-[rgba(82,255,120,0.5)] text-[rgb(82,255,120)] hover:bg-[rgba(82,255,120,0.1)] flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3" />
                              FULL SCAN
                            </button>
                          </Link>
                          <a
                            href={`https://dexscreener.com/solana/${token.mint}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 text-xs border border-[rgba(99,102,241,0.5)] text-[rgb(99,102,241)] hover:bg-[rgba(99,102,241,0.1)] flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            DEXSCREENER
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
