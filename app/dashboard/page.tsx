"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import {
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  Activity,
  Droplets,
  BarChart3,
  ExternalLink,
  Zap,
  Filter,
  ChevronDown,
  ArrowUpRight,
  Clock,
} from "lucide-react";

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */

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

const gradeConfig: Record<string, { bg: string; text: string; glow: string }> = {
  A: { bg: "bg-emerald-500/20", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
  B: { bg: "bg-lime-500/20", text: "text-lime-400", glow: "shadow-lime-500/20" },
  C: { bg: "bg-yellow-500/20", text: "text-yellow-400", glow: "shadow-yellow-500/20" },
  D: { bg: "bg-orange-500/20", text: "text-orange-400", glow: "shadow-orange-500/20" },
  F: { bg: "bg-red-500/20", text: "text-red-400", glow: "shadow-red-500/20" },
  "?": { bg: "bg-gray-500/20", text: "text-gray-400", glow: "shadow-gray-500/20" },
};

/* ═══════════════════════════════════════════
   3D TILT CARD
   ═══════════════════════════════════════════ */

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 300, damping: 30 });

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.5);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════ */

function AnimCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(eased * value));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════
   RISK METER (SVG ANIMATED)
   ═══════════════════════════════════════════ */

function RiskMeter({ score, size = 120 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const radius = (size - 16) / 2;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#84cc16";
    if (s >= 40) return "#eab308";
    if (s >= 20) return "#f97316";
    return "#ef4444";
  };

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimatedScore(Math.floor(eased * score));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, score]);

  const color = getColor(animatedScore);

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size / 2 + 20 }}>
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`} className="overflow-visible">
        {/* Background arc */}
        <path
          d={`M 8 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2}`}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Active arc */}
        <motion.path
          d={`M 8 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 8} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
        {/* Glow dot at end */}
        {animatedScore > 0 && (
          <circle
            cx={size / 2 + radius * Math.cos(Math.PI - (animatedScore / 100) * Math.PI)}
            cy={size / 2 - radius * Math.sin(Math.PI - (animatedScore / 100) * Math.PI)}
            r="4"
            fill={color}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        )}
      </svg>
      <div className="absolute bottom-0 text-center">
        <div className="text-xl font-black" style={{ color }}>{animatedScore}</div>
        <div className="text-[9px] text-gray-500 uppercase tracking-wider">Risk</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOKEN ROW (EXPANDABLE)
   ═══════════════════════════════════════════ */

function TokenRow({ token, index }: { token: Token; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const gc = gradeConfig[token.riskGrade] || gradeConfig["?"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      layout
      className={`token-row glass rounded-xl overflow-hidden cursor-pointer ${expanded ? "neon-border" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
        {/* Grade Badge */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center font-black text-sm shrink-0 ${gc.bg} border-white/10 ${gc.text}`}
        >
          {token.riskGrade}
        </motion.div>

        {/* Name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white truncate text-sm sm:text-base">{token.symbol || "Unknown"}</span>
            {token.dexId && (
              <span className="text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded hidden sm:inline">
                {token.dexId}
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-500 truncate flex items-center gap-1">
            <span>{token.name}</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right hidden sm:block shrink-0 w-24">
          <div className="text-sm font-mono text-white">
            {token.price > 0
              ? `$${token.price < 0.01 ? token.price.toExponential(2) : token.price.toFixed(6)}`
              : "—"}
          </div>
          <div className={`text-xs font-medium flex items-center justify-end gap-0.5 ${token.change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {token.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {token.change24h > 0 ? "+" : ""}{token.change24h !== 0 ? `${token.change24h.toFixed(1)}%` : "—"}
          </div>
        </div>

        {/* Liquidity */}
        <div className="text-right hidden md:block shrink-0 w-20">
          <div className="text-xs text-gray-500 mb-0.5">Liq</div>
          <div className="text-sm font-mono text-gray-300">
            {token.liquidity > 0
              ? `$${token.liquidity > 1e6 ? `${(token.liquidity / 1e6).toFixed(1)}M` : `${(token.liquidity / 1e3).toFixed(0)}K`}`
              : "—"}
          </div>
        </div>

        {/* Volume */}
        <div className="text-right hidden lg:block shrink-0 w-20">
          <div className="text-xs text-gray-500 mb-0.5">Vol 24h</div>
          <div className="text-sm font-mono text-gray-300">
            {token.volume24h > 0
              ? `$${token.volume24h > 1e6 ? `${(token.volume24h / 1e6).toFixed(1)}M` : `${(token.volume24h / 1e3).toFixed(0)}K`}`
              : "—"}
          </div>
        </div>

        {/* Expand arrow */}
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          className="text-gray-600 shrink-0"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </div>

      {/* Expanded Detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.04] p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Risk Meter */}
              {token.riskScore !== null && (
                <div className="col-span-2 md:col-span-1 flex flex-col items-center py-2">
                  <RiskMeter score={token.riskScore} size={100} />
                  <div className={`text-xs font-medium mt-1 ${gc.text}`}>
                    {token.riskGrade === "A" ? "Low Risk" : token.riskGrade === "F" ? "High Risk" : "Moderate"}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <BarChart3 className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500">Market Cap</span>
                  <span className="text-white ml-auto">{token.marketCap > 0 ? `$${(token.marketCap / 1e6).toFixed(2)}M` : "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Droplets className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500">Liquidity</span>
                  <span className="text-white ml-auto">{token.liquidity > 0 ? `$${token.liquidity.toLocaleString()}` : "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Activity className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-gray-500">Volume 24h</span>
                  <span className="text-white ml-auto">{token.volume24h > 0 ? `$${token.volume24h.toLocaleString()}` : "—"}</span>
                </div>
              </div>

              {/* Warnings */}
              <div className="space-y-1">
                {token.warnings.length > 0 ? (
                  token.warnings.slice(0, 3).map((w, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-1.5 text-[11px] text-amber-400/80"
                    >
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {w}
                    </motion.div>
                  ))
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/80">
                    <Shield className="w-3 h-3 shrink-0" />
                    No warnings
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2">
                <Link
                  href={`/dashboard/${token.mint}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Full Analysis <ArrowUpRight className="w-3 h-3" />
                </Link>
                <a
                  href={`https://dexscreener.com/solana/${token.pairAddress || token.mint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                >
                  DexScreener <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://solscan.io/token/${token.mint}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Solscan <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════ */

export default function Dashboard() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState<"trending" | "boosted" | "profiles">("trending");
  const [lastUpdate, setLastUpdate] = useState("");
  const [error, setError] = useState("");

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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load tokens";
      setError(msg);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTokens(tab);
    const interval = setInterval(() => fetchTokens(tab), 60000);
    return () => clearInterval(interval);
  }, [tab, fetchTokens]);

  const filtered = filter === "all" ? tokens : tokens.filter((t) => t.riskGrade === filter);
  const highRisk = tokens.filter((t) => ["D", "F"].includes(t.riskGrade)).length;
  const safe = tokens.filter((t) => ["A", "B"].includes(t.riskGrade)).length;
  const totalLiq = tokens.reduce((s, t) => s + (t.liquidity || 0), 0);

  return (
    <div className="relative min-h-screen bg-[#06060c] text-white pt-20 pb-12">
      {/* BG */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/[0.04] blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* ═══ HEADER ═══ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3">
              <span className="text-gradient-animated">Dashboard</span>
            </h1>
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex">
                <motion.span
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-400"
                />
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lastUpdate ? `Updated ${lastUpdate}` : "Live"}
              </span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">Real-time Solana token risk analysis from DexScreener</p>
        </motion.div>

        {/* ═══ STAT CARDS ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
        >
          {[
            { label: "Tokens Tracked", value: tokens.length, icon: <BarChart3 className="w-5 h-5" />, color: "from-violet-500/20 to-violet-600/5", textColor: "text-violet-400" },
            { label: "High Risk", value: highRisk, icon: <AlertTriangle className="w-5 h-5" />, color: "from-red-500/20 to-red-600/5", textColor: "text-red-400" },
            { label: "Safe Tokens", value: safe, icon: <Shield className="w-5 h-5" />, color: "from-emerald-500/20 to-emerald-600/5", textColor: "text-emerald-400" },
            { label: "Total Liquidity", value: totalLiq, icon: <Droplets className="w-5 h-5" />, color: "from-cyan-500/20 to-cyan-600/5", textColor: "text-cyan-400", prefix: "$", suffix: "M" },
          ].map((s, i) => (
            <TiltCard key={s.label}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="stat-card glass neon-border rounded-2xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{s.label}</div>
                    <div className={`text-2xl sm:text-3xl font-black ${s.textColor}`}>
                      {s.prefix}
                      {typeof s.value === "number" && s.value > 1e6 && s.suffix === "M"
                        ? (s.value / 1e6).toFixed(1)
                        : s.value.toLocaleString()}
                      {s.suffix && s.value > 1e6 ? s.suffix : ""}
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} border border-white/10 flex items-center justify-center ${s.textColor}`}>
                    {s.icon}
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </motion.div>

        {/* ═══ CONTROLS ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass neon-border rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Source Tabs */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              {(["trending", "boosted", "profiles"] as const).map((t) => (
                <motion.button
                  key={t}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all capitalize ${
                    tab === t
                      ? "bg-violet-500/20 border-violet-500/30 text-violet-300 shadow-lg shadow-violet-500/10"
                      : "bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06]"
                  }`}
                >
                  {t}
                </motion.button>
              ))}
            </div>

            {/* Refresh */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => fetchTokens(tab)}
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/15 disabled:opacity-50 flex items-center gap-2"
            >
              <motion.div animate={loading ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              {loading ? "Scanning..." : "Refresh"}
            </motion.button>
          </div>
        </motion.div>

        {/* ═══ ERROR ═══ */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
              <button onClick={() => fetchTokens(tab)} className="underline ml-2">Retry</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ GRADE FILTERS ═══ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin"
        >
          {["all", "A", "B", "C", "D", "F", "?"].map((g) => {
            const gc = gradeConfig[g];
            return (
              <motion.button
                key={g}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(g)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filter === g
                    ? `${gc?.bg || "bg-white/10"} border-white/20 ${gc?.text || "text-white"} shadow-lg`
                    : "bg-white/[0.02] border-white/[0.06] text-gray-500 hover:bg-white/[0.05]"
                }`}
              >
                {g === "all" ? "All" : g}
                <span className="text-[10px] opacity-60">
                  ({g === "all" ? tokens.length : tokens.filter((t) => t.riskGrade === g).length})
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ═══ TOKEN LIST ═══ */}
        {loading ? (
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="h-16 rounded-xl shimmer"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">No tokens found. Try switching source or refreshing.</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((token, i) => (
                <TokenRow key={token.mint} token={token} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
