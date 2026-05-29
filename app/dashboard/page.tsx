"use client";
import { useState, useEffect, useCallback } from "react";

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

const gradeBg: Record<string, string> = {
  A: "bg-emerald-500/20 border-emerald-500/30",
  B: "bg-lime-500/20 border-lime-500/30",
  C: "bg-yellow-500/20 border-yellow-500/30",
  D: "bg-orange-500/20 border-orange-500/30",
  F: "bg-red-500/20 border-red-500/30",
  "?": "bg-gray-500/20 border-gray-500/30",
};

const gradeText: Record<string, string> = {
  A: "text-emerald-400",
  B: "text-lime-400",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
  "?": "text-gray-400",
};

function TokenRow({ token }: { token: Token }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex items-center gap-3 sm:gap-4">
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg border flex items-center justify-center font-black text-xs sm:text-sm shrink-0 ${gradeBg[token.riskGrade] || gradeBg["?"]}`}>
          {token.riskGrade}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white truncate text-sm sm:text-base">{token.symbol || "Unknown"}</span>
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
        <div className="text-gray-500 shrink-0 text-xs">{expanded ? "▼" : "▶"}</div>
      </div>

      {expanded && (
        <div className="border-t border-white/5 p-4">
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
          {token.riskScore !== null && (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400">Risk Score</span>
                <span className="text-[10px] font-bold">{token.riskScore}/100</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${token.riskScore >= 80 ? "bg-emerald-500" : token.riskScore >= 60 ? "bg-lime-500" : token.riskScore >= 40 ? "bg-yellow-500" : token.riskScore >= 20 ? "bg-orange-500" : "bg-red-500"}`}
                  style={{ width: `${token.riskScore}%` }}
                />
              </div>
            </div>
          )}
          {token.warnings.length > 0 && (
            <div className="space-y-1 mb-3">
              {token.warnings.map((w, i) => (
                <div key={i} className="text-[11px] text-yellow-400/80">⚠ {w}</div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <a
              href={`https://dexscreener.com/solana/${token.pairAddress || token.mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              DexScreener ↗
            </a>
            <a
              href={`https://solscan.io/token/${token.mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              Solscan ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState<"trending" | "boosted" | "profiles">("trending");
  const [lastUpdate, setLastUpdate] = useState("");
  const [error, setError] = useState("");
  const [expandedTokens, setExpandedTokens] = useState<Set<string>>(new Set());

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
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black">Dashboard</h1>
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping" />
              </span>
              <span className="text-xs text-gray-400">{lastUpdate ? `Updated ${lastUpdate}` : "Live"}</span>
            </span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">Real-time Solana token risk analysis from DexScreener</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Tokens Tracked", value: tokens.length.toString(), icon: "📊" },
            { label: "High Risk (D/F)", value: tokens.filter((t) => ["D", "F"].includes(t.riskGrade)).length.toString(), icon: "🚨" },
            { label: "Safe (A/B)", value: tokens.filter((t) => ["A", "B"].includes(t.riskGrade)).length.toString(), icon: "🛡️" },
            { label: "Total Liquidity", value: `$${(tokens.reduce((s, t) => s + (t.liquidity || 0), 0) / 1e6).toFixed(1)}M`, icon: "💰" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] sm:text-xs text-gray-500 mb-1">{s.label}</div>
                  <div className="text-lg sm:text-2xl font-bold text-white">{s.value}</div>
                </div>
                <div className="text-xl sm:text-2xl">{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Source tabs */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 mb-6">
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
        </div>

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
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 sm:h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-4xl mb-4">🔍</div>
            <p>No tokens found. Try switching source or refreshing.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((token) => (
              <TokenRow key={token.mint} token={token} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
