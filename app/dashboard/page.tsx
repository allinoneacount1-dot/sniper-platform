"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, Shimmer, Badge, PulseDot } from "@/components/ui/animated";
import { RiskMeter } from "@/components/ui/risk-meter";

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

const gradeBg: Record<string, string> = {
  A: "bg-emerald-500/20 border-emerald-500/30",
  B: "bg-lime-500/20 border-lime-500/30",
  C: "bg-yellow-500/20 border-yellow-500/30",
  D: "bg-orange-500/20 border-orange-500/30",
  F: "bg-red-500/20 border-red-500/30",
  "?": "bg-gray-500/20 border-gray-500/30",
};

function TokenRow({ token, index }: { token: Token; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
    >
      <div
        className="group relative border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 p-4 flex items-center gap-3 sm:gap-4">
          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center font-black text-xs sm:text-sm shrink-0 ${gradeBg[token.riskGrade] || gradeBg["?"]}`}>
            {token.riskGrade}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white truncate text-sm sm:text-base">{token.symbol || "Unknown"}</span>
              {token.warnings.length > 0 && <Badge variant="warning">⚠</Badge>}
              {token.dexId && <span className="text-[10px] text-gray-600 hidden sm:inline">{token.dexId}</span>}
            </div>
            <div className="text-[11px] text-gray-500 truncate">{token.name} • {token.mint.slice(0, 12)}...</div>
          </div>
          <div className="text-right hidden sm:block shrink-0">
            <div className="text-sm font-mono text-white">
              {token.price > 0 ? `$${token.price < 0.01 ? token.price.toExponential(2) : token.price.toFixed(6)}` : "—"}
            </div>
            <div className={`text-xs font-medium ${token.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {token.change24h > 0 ? "+" : ""}{token.change24h !== 0 ? `${token.change24h.toFixed(1)}%` : ""}
            </div>
          </div>
          <div className="text-right hidden md:block shrink-0 w-20">
            <div className="text-sm font-mono text-gray-300">
              {token.liquidity > 0 ? `$${token.liquidity > 1e6 ? `${(token.liquidity / 1e6).toFixed(1)}M` : `${(token.liquidity / 1e3).toFixed(0)}K`}` : "—"}
            </div>
          </div>
          <div className="text-right hidden lg:block shrink-0 w-20">
            <div className="text-sm font-mono text-gray-300">
              {token.volume24h > 0 ? `$${token.volume24h > 1e6 ? `${(token.volume24h / 1e6).toFixed(1)}M` : `${(token.volume24h / 1e3).toFixed(0)}K`}` : "—"}
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }} className="text-gray-500 shrink-0 text-xs">▶</motion.div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 border-t border-white/5 overflow-hidden"
            >
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">DEX</div>
                    <div className="text-xs text-white capitalize">{token.dexId || "—"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Market Cap</div>
                    <div className="text-xs text-white">{token.marketCap > 0 ? `$${(token.marketCap / 1e6).toFixed(2)}M` : "—"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Liquidity</div>
                    <div className="text-xs text-white">{token.liquidity > 0 ? `$${token.liquidity.toLocaleString()}` : "—"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 mb-0.5">Volume 24h</div>
                    <div className="text-xs text-white">{token.volume24h > 0 ? `$${token.volume24h.toLocaleString()}` : "—"}</div>
                  </div>
                </div>
                {token.riskScore !== null && <RiskMeter score={token.riskScore} grade={token.riskGrade} size="sm" />}
                {token.warnings.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {token.warnings.map((w, i) => (
                      <div key={i} className="text-[11px] text-yellow-400/80">⚠ {w}</div>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  {token.mint && (
                    <a
                      href={`https://dexscreener.com/solana/${token.pairAddress || token.mint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      DexScreener ↗
                    </a>
                  )}
                  {token.mint && (
                    <a
                      href={`https://solscan.io/token/${token.mint}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Solscan ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatsCard({ label, value, icon, delay }: { label: string; value: string; icon: string; delay: number }) {
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
        </div>
        <div className="text-xl sm:text-2xl">{icon}</div>
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
  const [error, setError] = useState<string>("");

  const fetchTokens = useCallback(async (type: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/tokens?type=${type}&limit=30`);
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const data = await res.json();
      if (data.data && Array.isArray(data.data)) {
        setTokens(data.data);
        setLastUpdate(new Date().toLocaleTimeString());
      } else {
        setTokens([]);
      }
    } catch (e: any) {
      console.error("Failed to fetch tokens:", e);
      setError(e.message || "Failed to load tokens");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTokens(tab);
    const interval = setInterval(() => fetchTokens(tab), 60000);
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
        <motion.div className="mb-6 sm:mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black">Dashboard</h1>
            <PulseDot color="green" size="md" label={lastUpdate ? `Updated ${lastUpdate}` : "Live"} />
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">Real-time Solana token risk analysis from DexScreener</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatsCard label="Tokens Tracked" value={tokens.length.toString()} icon="📊" delay={0} />
          <StatsCard label="High Risk (D/F)" value={tokens.filter((t) => ["D", "F"].includes(t.riskGrade)).length.toString()} icon="🚨" delay={0.1} />
          <StatsCard label="Safe (A/B)" value={tokens.filter((t) => ["A", "B"].includes(t.riskGrade)).length.toString()} icon="🛡️" delay={0.2} />
          <StatsCard label="Total Liquidity" value={`$${(tokens.reduce((s, t) => s + (t.liquidity || 0), 0) / 1e6).toFixed(1)}M`} icon="💰" delay={0.3} />
        </div>

        {/* Source tabs + scan */}
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
            <button
              onClick={() => fetchTokens(tab)}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {loading ? "⏳ Loading..." : "🔄 Refresh"}
            </button>
          </div>
        </GlassCard>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            ⚠ {error} — <button onClick={() => fetchTokens(tab)} className="underline cursor-pointer">Retry</button>
          </div>
        )}

        {/* Grade filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          {["all", "A", "B", "C", "D", "F"].map((g) => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                filter === g ? "bg-violet-500/20 border-violet-500/30 text-violet-300" : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {g === "all" ? `All (${tokens.length})` : `${g} (${tokens.filter((t) => t.riskGrade === g).length})`}
            </button>
          ))}
        </div>

        {/* Token list */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[...Array(8)].map((_, i) => <Shimmer key={i} className="h-14 sm:h-16" />)}
            </motion.div>
          ) : (
            <motion.div key="list" className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>No tokens found. Try switching source or refreshing.</p>
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
