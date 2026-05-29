"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Shield, AlertTriangle, TrendingUp, TrendingDown, Droplets,
  Activity, BarChart3, ExternalLink, ArrowLeft, Zap, Clock,
  CheckCircle, XCircle, Info,
} from "lucide-react";

interface TokenDetail {
  token: {
    mint: string;
    symbol: string;
    name: string;
    riskScore: number;
    riskGrade: string;
    gradeColor: string;
    gradeBg: string;
    factors: Record<string, unknown>;
    warnings: string[];
    info: string[];
    recommendation: string;
    price?: number;
    liquidity?: number;
    volume24h?: number;
    marketCap?: number;
    pairAddress?: string;
  } | null;
  error?: string;
  loading: boolean;
}

const gradeConfig: Record<string, { bg: string; text: string; border: string; icon: typeof Shield }> = {
  A: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30", icon: Shield },
  B: { bg: "bg-lime-500/20", text: "text-lime-400", border: "border-lime-500/30", icon: CheckCircle },
  C: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", icon: Info },
  D: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", icon: AlertTriangle },
  F: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", icon: XCircle },
};

function AnimatedRing({ score, size = 160 }: { score: number; size?: number }) {
  const [animated, setAnimated] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#84cc16";
    if (s >= 40) return "#eab308";
    if (s >= 20) return "#f97316";
    return "#ef4444";
  };

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / 2000, 1);
      setAnimated(Math.floor((1 - Math.pow(1 - p, 3)) * score));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, score]);

  const color = getColor(animated);

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 10px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={animated}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-black"
          style={{ color }}
        >
          {animated}
        </motion.span>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Risk Score</span>
      </div>
    </div>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 300, damping: 30 });

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function TokenDetail() {
  const params = useParams();
  const mint = params.mint as string;
  const [data, setData] = useState<TokenDetail>({ token: null, loading: true });
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchToken = async () => {
    setData({ token: null, loading: true });
    try {
      const res = await fetch(`/api/tokens?mint=${mint}`);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const result = await res.json();
      setData({ token: result.token, loading: false });
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e: unknown) {
      setData({ token: null, loading: false, error: e instanceof Error ? e.message : "Failed" });
    }
  };

  useEffect(() => { fetchToken(); }, [mint]);

  if (data.loading) {
    return (
      <div className="min-h-screen bg-[#06060c] flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-2 border-violet-500/30 border-t-violet-500 mx-auto mb-4"
          />
          <p className="text-gray-500">Scanning token...</p>
        </motion.div>
      </div>
    );
  }

  if (data.error || !data.token) {
    return (
      <div className="min-h-screen bg-[#06060c] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-gray-400 mb-4">{data.error || "Token not found"}</p>
          <Link href="/dashboard" className="text-violet-400 hover:text-violet-300">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const t = data.token;
  const gc = gradeConfig[t.riskGrade] || gradeConfig["C"];
  const GradeIcon = gc.icon;

  return (
    <div className="min-h-screen bg-[#06060c] text-white pt-20 pb-12">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-2xl font-black ${gc.bg} ${gc.border} ${gc.text}`}
              >
                {t.riskGrade}
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
                  <span className="text-gradient-animated">{t.symbol || "Unknown"}</span>
                </h1>
                <p className="text-gray-500 mt-1">{t.name}</p>
                <p className="text-xs text-gray-600 font-mono mt-1 break-all">{t.mint}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {lastUpdated}
            </div>
          </div>
        </motion.div>

        {/* Main Score + Grid */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {/* Risk Score Card */}
          <TiltCard>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              className="glass neon-border rounded-2xl p-8 flex flex-col items-center justify-center stat-card">
              <AnimatedRing score={t.riskScore} size={160} />
              <div className={`mt-4 text-lg font-bold ${gc.text} flex items-center gap-2`}>
                <GradeIcon className="w-5 h-5" />
                Grade {t.riskGrade}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center max-w-[200px]">{t.recommendation}</p>
            </motion.div>
          </TiltCard>

          {/* Quick Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass neon-border rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Market Data</h3>
            {[
              { icon: <BarChart3 className="w-4 h-4" />, label: "Price", value: t.price ? `$${t.price < 0.01 ? t.price.toExponential(2) : t.price.toFixed(6)}` : "—" },
              { icon: <Droplets className="w-4 h-4" />, label: "Liquidity", value: t.liquidity ? `$${t.liquidity.toLocaleString()}` : "—" },
              { icon: <Activity className="w-4 h-4" />, label: "Volume 24h", value: t.volume24h ? `$${t.volume24h.toLocaleString()}` : "—" },
              { icon: <TrendingUp className="w-4 h-4" />, label: "Market Cap", value: t.marketCap ? `$${(t.marketCap / 1e6).toFixed(2)}M` : "—" },
            ].map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 text-sm">{s.icon} {s.label}</div>
                <div className="text-sm font-mono text-white">{s.value}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Warnings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="glass neon-border rounded-2xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Analysis</h3>
            {t.warnings.length > 0 ? (
              <div className="space-y-2">
                {t.warnings.map((w, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="flex items-start gap-2 text-xs text-amber-400/80 bg-amber-500/5 rounded-lg p-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    {w}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <Shield className="w-5 h-5" /> No warnings found
              </div>
            )}
            {t.info.length > 0 && (
              <div className="space-y-1.5 mt-4">
                {t.info.map((inf, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <Info className="w-3 h-3 shrink-0" />{inf}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* External Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-3">
          <a href={`https://dexscreener.com/solana/${t.pairAddress || t.mint}`} target="_blank" rel="noopener noreferrer"
            className="glass glass-hover rounded-xl px-5 py-3 text-sm text-gray-300 hover:text-white neon-border inline-flex items-center gap-2">
            DexScreener <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a href={`https://solscan.io/token/${t.mint}`} target="_blank" rel="noopener noreferrer"
            className="glass glass-hover rounded-xl px-5 py-3 text-sm text-gray-300 hover:text-white neon-border inline-flex items-center gap-2">
            Solscan <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a href={`https://photon-sol.tinyastro.io/en/lp/${t.mint}`} target="_blank" rel="noopener noreferrer"
            className="glass glass-hover rounded-xl px-5 py-3 text-sm text-gray-300 hover:text-white neon-border inline-flex items-center gap-2">
            Photon <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
