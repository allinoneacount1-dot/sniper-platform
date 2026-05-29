"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedButton, GlassCard, Shimmer, Stagger, staggerItem, Badge, RiskMeter, PulseDot } from "@/components/ui/animated";

interface Token {
  mint: string;
  symbol: string;
  name: string;
  price: number;
  liquidity: number;
  volume24h: number;
  change24h: number;
  marketCap: number;
  riskScore: number | null;
  riskGrade: string;
  warnings: string[];
  pairAddress?: string;
  dexId?: string;
}

function TokenRow({ token, index }: { token: Token; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const gradeColor: Record<string, string> = {
    A: "text-emerald-400", B: "text-lime-400", C: "text-yellow-400", D: "text-orange-400", F: "text-red-400", "?": "text-gray-400",
  };
  const gradeBg: Record<string, string> = {
    A: "bg-emerald-500/20 border-emerald-500/30",
    B: "bg-lime-500/20 border-lime-500/30",
    C: "bg-yellow-500/20 border-yellow-500/30",
    D: "bg-orange-500/20 border-orange-500/30",
    F: "bg-red-500/20 border-red-500/30",
    "?": "bg-gray-500/20 border-gray-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <motion.div
        className="group relative border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.005, borderColor: "rgba(139,92,246,0.2)" }}
        layout
      >
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 p-4 flex items-center gap-4">
          {/* Grade badge */}
          <motion.div
            className={`w-10 h-10 rounded-lg border flex items-center justify-center font-black text-sm ${gradeBg[token.riskGrade] || gradeBg["?"]}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {token.riskGrade}
          </motion.div>

          {/* Token info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white truncate">{token.symbol || "Unknown"}</span>
              {token.warnings.length > 0 && (
                <Badge variant="warning">⚠ {token.warnings.length}</Badge>
              )}
            </div>
            <div className="text-xs text-gray-500 truncate">{token.mint.slice(0, 20)}...</div>
          </div>

          {/* Price */}
          <div className="text-right hidden sm:block">
            <div className="text-sm font-mono text-white">
              ${token.price > 0 ? token.price.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "—"}
            </div>
            <div className={`text-xs font-medium ${token.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {token.change24h > 0 ? "+" : ""}{token.change24h.toFixed(1)}%
            </div>
          </div>

          {/* Liquidity */}
          <div className="text-right hidden md:block">
            <div className="text-sm font-mono text-gray-300">
              ${token.liquidity > 0 ? (token.liquidity > 1e6 ? `${(token.liquidity / 1e6).toFixed(1)}M` : `${(token.liquidity / 1e3).toFixed(1)}K`) : "—"}
            </div>
            <div className="text-xs text-gray-500">Liquidity</div>
          </div>

          {/* Volume */}
          <div className="text-right hidden lg:block">
            <div className="text-sm font-mono text-gray-300">
              ${token.volume24h > 0 ? (token.volume24h > 1e6 ? `${(token.volume24h / 1e6).toFixed(1)}M` : `${(token.volume24h / 1e3).toFixed(1)}K`) : "—"}
            </div>
            <div className="text-xs text-gray-500">Volume 24h</div>
          </div>

          {/* Risk bar mini */}
          <div className="w-20 hidden md:block">
            {token.riskScore !== null && <RiskMeter score={token.riskScore} grade={token.riskGrade} size="sm" />}
          </div>

          {/* Expand arrow */}
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-500"
          >
            ▶
          </motion.div>
        </div>

        {/* Expanded details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 border-t border-white/5 overflow-hidden"
            >
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">DEX</div>
                  <div className="text-sm text-white capitalize">{token.dexId || "—"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Market Cap</div>
                  <div className="text-sm text-white">
                    {token.marketCap > 0 ? `$${(token.marketCap / 1e6).toFixed(2)}M` : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Full Address</div>
                  <div className="text-xs text-gray-400 font-mono truncate">{token.mint}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Risk Meter</div>
                  {token.riskScore !== null && <RiskMeter score={token.riskScore} grade={token.riskGrade} size="sm" />}
                </div>
              </div>
              {token.warnings.length > 0 && (
                <div className="px-4 pb-4">
                  <div className="text-xs text-gray-500 mb-2">Warnings</div>
                  {token.warnings.map((w, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-xs text-yellow-400/80 py-1"
                    >
                      ⚠ {w}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function StatsCard({ label, value, change, icon, delay }: { label: string; value: string; change?: string; icon: string; delay: number }) {
  const isPositive = change && !change.startsWith("-");
  return (
    <GlassCard className="p-5" delay={delay}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1">{label}</div>
          <motion.div
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20, delay: delay + 0.1 }}
          >
            {value}
          </motion.div>
          {change && (
            <motion.div
              className={`text-xs mt-1 font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.3 }}
            >
              {change}
            </motion.div>
          )}
        </div>
        <motion.div
          className="text-2xl"
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 20, delay: delay + 0.2 }}
        >
          {icon}
        </motion.div>
      </div>
    </GlassCard>
  );
}

function ScanBar({ onScan }: { onScan: () => void }) {
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    setScanning(true);
    onScan();
    setTimeout(() => setScanning(false), 3000);
  };

  return (
    <GlassCard className="p-4 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-2">
            <PulseDot color={scanning ? "yellow" : "green"} size="md" />
            <span className="text-sm text-gray-300">
              {scanning ? "Scanning new Solana tokens..." : "Scanner active — checking every 10 minutes"}
            </span>
          </div>
          {scanning && (
            <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <AnimatedButton variant="secondary" size="sm">
            🔍 Custom Scan
          </AnimatedButton>
          <AnimatedButton variant="primary" size="sm" onClick={handleScan} loading={scanning}>
            ⚡ Quick Scan
          </AnimatedButton>
        </div>
      </div>
    </GlassCard>
  );
}

export default function Dashboard() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tokens?limit=20");
      const data = await res.json();
      if (data.data) {
        setTokens(data.data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const filtered = filter === "all" ? tokens : tokens.filter((t) => t.riskGrade === filter);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.h1
              className="text-3xl font-black"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Dashboard
            </motion.h1>
            <Badge variant="success">LIVE</Badge>
          </div>
          <p className="text-gray-500 text-sm">Real-time Solana token risk analysis</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Tokens Tracked" value={tokens.length.toString()} icon="📊" delay={0} />
          <StatsCard label="High Risk (D/F)" value={tokens.filter((t) => ["D", "F"].includes(t.riskGrade)).length.toString()} change="⚠️ caution" icon="🚨" delay={0.1} />
          <StatsCard label="Safe (A/B)" value={tokens.filter((t) => ["A", "B"].includes(t.riskGrade)).length.toString()} change="✅ verified" icon="🛡️" delay={0.2} />
          <StatsCard label="Total Liquidity" value={`$${(tokens.reduce((s, t) => s + t.liquidity, 0) / 1e6).toFixed(1)}M`} icon="💰" delay={0.3} />
        </div>

        {/* Scan bar */}
        <ScanBar onScan={fetchTokens} />

        {/* Filters */}
        <motion.div
          className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {["all", "A", "B", "C", "D", "F"].map((g) => (
            <motion.button
              key={g}
              onClick={() => setFilter(g)}
              className={`px-4 py-2 text-sm rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                filter === g
                  ? "bg-violet-500/20 border-violet-500/30 text-violet-300"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {g === "all" ? "All Tokens" : `Grade ${g}`}
              {g !== "all" && (
                <span className="ml-2 text-xs opacity-60">
                  {tokens.filter((t) => t.riskGrade === g).length}
                </span>
              )}
              {g === "all" && (
                <span className="ml-2 text-xs opacity-60">{tokens.length}</span>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Token list */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <Shimmer key={i} className="h-16" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>No tokens found for this filter</p>
                </div>
              ) : (
                filtered.map((token, i) => (
                  <TokenRow key={token.mint} token={token} index={i} />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
