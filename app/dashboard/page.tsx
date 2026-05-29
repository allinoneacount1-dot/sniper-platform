"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedButton, GlassCard, Shimmer, Badge, RiskMeter, PulseDot } from "@/components/ui/animated";

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
  imageUrl?: string;
  url?: string;
}

function TokenRow({ token, index }: { token: Token; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const gradeBg: Record<string, string> = {
    A: "bg-emerald-500/20 border-emerald-500/30",
    B: "bg-lime-500/20 border-lime-500/30",
    C: "bg-yellow-500/20 border-yellow-500/30",
    D: "bg-orange-500/20 border-orange-500/30",
    F: "bg-red-500/20 border-red-500/30",
    "?": "bg-gray-500/20 border-gray-500/30",
  };

  const handleScan = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setScanning(true);
    setScanResult(null);
    try {
      const res = await fetch(`/api/tokens?mint=${token.mint}`);
      const data = await res.json();
      if (data.token) {
        setScanResult(data.token);
      }
    } catch {
      // ignore
    }
    setScanning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.5) }}
    >
      <motion.div
        className="group relative border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ scale: 1.003, borderColor: "rgba(139,92,246,0.15)" }}
        layout
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 p-4 flex items-center gap-3 sm:gap-4">
          {/* Grade */}
          <motion.div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center font-black text-xs sm:text-sm shrink-0 ${gradeBg[token.riskGrade] || gradeBg["?"]}`}
            whileHover={{ scale: 1.1, rotate: 3 }}
          >
            {token.riskGrade}
          </motion.div>

          {/* Token info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {token.imageUrl && (
                <img src={token.imageUrl} alt="" className="w-5 h-5 rounded-full shrink-0" />
              )}
              <span className="font-semibold text-white truncate text-sm sm:text-base">{token.symbol || "Unknown"}</span>
              {token.warnings.length > 0 && (
                <Badge variant="warning">⚠</Badge>
              )}
              {token.dexId && (
                <span className="text-[10px] text-gray-600 hidden sm:inline">{token.dexId}</span>
              )}
            </div>
            <div className="text-[11px] text-gray-500 truncate">{token.mint.slice(0, 16)}...{token.mint.slice(-4)}</div>
          </div>

          {/* Price */}
          <div className="text-right hidden sm:block shrink-0">
            <div className="text-sm font-mono text-white">
              {token.price > 0 ? `$${token.price.toLocaleString(undefined, { maximumFractionDigits: token.price < 1 ? 8 : 2 })}` : "—"}
            </div>
            <div className={`text-xs font-medium ${token.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {token.change24h > 0 ? "+" : ""}{token.change24h !== 0 ? `${token.change24h.toFixed(1)}%` : ""}
            </div>
          </div>

          {/* Liquidity */}
          <div className="text-right hidden md:block shrink-0 w-24">
            <div className="text-sm font-mono text-gray-300">
              {token.liquidity > 0 ? `$${token.liquidity > 1e6 ? `${(token.liquidity / 1e6).toFixed(1)}M` : `${(token.liquidity / 1e3).toFixed(1)}K`}` : "—"}
            </div>
            <div className="text-[10px] text-gray-500">Liquidity</div>
          </div>

          {/* Volume */}
          <div className="text-right hidden lg:block shrink-0 w-24">
            <div className="text-sm font-mono text-gray-300">
              {token.volume24h > 0 ? `$${token.volume24h > 1e6 ? `${(token.volume24h / 1e6).toFixed(1)}M` : `${(token.volume24h / 1e3).toFixed(1)}K`}` : "—"}
            </div>
            <div className="text-[10px] text-gray-500">Vol 24h</div>
          </div>

          {/* Scan button */}
          <motion.button
            onClick={handleScan}
            className="px-3 py-1.5 text-xs rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 transition-colors shrink-0 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {scanning ? "⏳" : "🔍"}
          </motion.button>

          {/* Expand */}
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }} className="text-gray-500 shrink-0">
            ▶
          </motion.div>
        </div>

        {/* Expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 border-t border-white/5 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">DEX</div>
                    <div className="text-xs text-white capitalize">{token.dexId || "—"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Market Cap</div>
                    <div className="text-xs text-white">{token.marketCap > 0 ? `$${(token.marketCap / 1e6).toFixed(2)}M` : "—"}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] text-gray-500 mb-0.5">Contract</div>
                    <div className="text-[11px] text-gray-400 font-mono truncate">{token.mint}</div>
                  </div>
                </div>

                {/* Fresh scan result */}
                {scanResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-white/5 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-white">Scan Result</span>
                      <span className={`text-xs font-bold ${scanResult.riskScore >= 70 ? "text-emerald-400" : scanResult.riskScore >= 40 ? "text-yellow-400" : "text-red-400"}`}>
                        {scanResult.riskGrade} — {scanResult.riskScore}/100
                      </span>
                    </div>
                    <RiskMeter score={scanResult.riskScore} grade={scanResult.riskGrade} size="sm" />
                    {scanResult.warnings?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {scanResult.warnings.slice(0, 3).map((w: string, i: number) => (
                          <div key={i} className="text-[11px] text-yellow-400/70">⚠ {w}</div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {token.warnings.length > 0 && !scanResult && (
                  <div className="space-y-1">
                    {token.warnings.map((w, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="text-[11px] text-yellow-400/80">
                        ⚠ {w}
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <AnimatedButton variant="secondary" size="sm">View on DexScreener ↗</AnimatedButton>
                  <AnimatedButton variant="ghost" size="sm">Copy Address</AnimatedButton>
                </div>
              </div>
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
    <GlassCard className="p-4 sm:p-5" delay={delay}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] sm:text-xs text-gray-500 mb-1">{label}</div>
          <motion.div
            className="text-lg sm:text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" as const, stiffness: 300, damping: 20, delay: delay + 0.1 }}
          >
            {value}
          </motion.div>
          {change && (
            <motion.div className={`text-[10px] sm:text-xs mt-1 font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.3 }}>
              {change}
            </motion.div>
          )}
        </div>
        <motion.div className="text-xl sm:text-2xl" initial={{ opacity: 0, rotate: -20 }} animate={{ opacity: 1, rotate: 0 }} transition={{ type: "spring" as const, stiffness: 300, damping: 20, delay: delay + 0.2 }}>
          {icon}
        </motion.div>
      </div>
    </GlassCard>
  );
}

export default function Dashboard() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState<"trending" | "boosted" | "profiles">("trending");
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchTokens = useCallback(async (type: string = "trending") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tokens?type=${type}&limit=30`);
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        setTokens(data.data);
        setLastUpdate(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error("Failed to fetch tokens:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTokens(tab);
    const interval = setInterval(() => fetchTokens(tab), 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [tab, fetchTokens]);

  const handleTabChange = (newTab: "trending" | "boosted" | "profiles") => {
    setTab(newTab);
    fetchTokens(newTab);
  };

  const filtered = filter === "all" ? tokens : tokens.filter((t) => t.riskGrade === filter);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <motion.div className="mb-6 sm:mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-1">
            <motion.h1 className="text-2xl sm:text-3xl font-black" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              Dashboard
            </motion.h1>
            <PulseDot color="green" size="md" label={lastUpdate ? `Updated ${lastUpdate}` : "Live"} />
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">Real-time Solana token risk analysis from DexScreener</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatsCard label="Tokens Tracked" value={tokens.length.toString()} icon="📊" delay={0} />
          <StatsCard label="High Risk (D/F)" value={tokens.filter((t) => ["D", "F"].includes(t.riskGrade)).length.toString()} change="⚠️ caution" icon="🚨" delay={0.1} />
          <StatsCard label="Safe (A/B)" value={tokens.filter((t) => ["A", "B"].includes(t.riskGrade)).length.toString()} change="✅ verified" icon="🛡️" delay={0.2} />
          <StatsCard label="Total Liquidity" value={`$${(tokens.reduce((s, t) => s + t.liquidity, 0) / 1e6).toFixed(1)}M`} icon="💰" delay={0.3} />
        </div>

        {/* Source tabs + scan bar */}
        <GlassCard className="p-4 mb-6" delay={0.1}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Source:</span>
              {(["trending", "boosted", "profiles"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleTabChange(t)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer capitalize ${
                    tab === t ? "bg-violet-500/20 border-violet-500/30 text-violet-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:hidden" />
              <AnimatedButton variant="primary" size="sm" onClick={() => fetchTokens(tab)}>
                🔄 Refresh
              </AnimatedButton>
            </div>
          </div>
        </GlassCard>

        {/* Grade filters */}
        <motion.div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {["all", "A", "B", "C", "D", "F"].map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                filter === g ? "bg-violet-500/20 border-violet-500/30 text-violet-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {g === "all" ? `All (${tokens.length})` : `Grade ${g} (${tokens.filter((t) => t.riskGrade === g).length})`}
            </button>
          ))}
        </motion.div>

        {/* Token list */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[...Array(8)].map((_, i) => (
                <Shimmer key={i} className="h-14 sm:h-16" />
              ))}
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>No tokens found. Try switching source tab or refreshing.</p>
                </div>
              ) : (
                filtered.map((token, i) => <TokenRow key={token.mint} token={token} index={i} />)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
