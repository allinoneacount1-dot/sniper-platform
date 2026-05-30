"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Zap, Code, Play, Copy, Check,
  BookOpen, ArrowRight,
} from "lucide-react";
import Link from "next/link";

function FadeIn(props: { children: React.ReactNode; delay?: number; className?: string }) {
  const { children, delay = 0, className = "" } = props;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const codeExamples: Record<string, string> = {
  scan: "curl -s \"https://sniper-platform.vercel.app/api/scan?mint=HausrAQNm12gRBoYkJYpCALEi6gxobZnG6NWk8pvpump\" | jq .",
  batch: "curl -X POST \"https://sniper-platform.vercel.app/api/scan\" -H \"Content-Type: application/json\" -d '{\"mints\": [\"MINT1...\"]}'",
  tokens: "curl -s \"https://sniper-platform.vercel.app/api/tokens?type=trending&limit=10\" | jq .data[0]",
  single: "curl -s \"https://sniper-platform.vercel.app/api/tokens?mint=ADDRESS\" | jq .token.riskGrade",
};

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("scan");
  const [copied, setCopied] = useState(false);
  const [scanMint, setScanMint] = useState("");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanLoading, setScanLoading] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tryScan = async () => {
    if (!scanMint.trim()) return;
    setScanLoading(true);
    try {
      const res = await fetch(`/api/scan?mint=${scanMint.trim()}`);
      const data = await res.json();
      setScanResult(JSON.stringify(data, null, 2));
    } catch {
      setScanResult("{\"error\": \"Scan failed\"}");
    }
    setScanLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#06060c] text-white pt-20 pb-16">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/[0.05] blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 mb-6">
              <BookOpen className="w-3.5 h-3.5" /> Documentation
            </div>
            <h1 className="text-4xl md:text-6xl font-black">
              API <span className="text-gradient-animated">Reference</span>
            </h1>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Integrate Sniper Platform into your trading bot, Telegram bot, or custom app.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="glass neon-border rounded-2xl p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-violet-400" /> Quick Start
            </h2>
            <div className="space-y-4 text-sm text-gray-400">
              <p>All API endpoints are <span className="text-white font-mono">GET</span> or <span className="text-white font-mono">POST</span> and return <span className="text-white font-mono">JSON</span>.</p>
              <div className="bg-white/[0.03] rounded-xl p-4 font-mono text-xs overflow-x-auto text-violet-400">
                https://sniper-platform.vercel.app
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
        </FadeIn>

        <div className="space-y-4 mb-12">
          {[
            { method: "GET", path: "/api/scan?mint={address}", desc: "Deep scan a single token. Returns risk score, grade, factors, warnings.", color: "bg-emerald-500/20 text-emerald-400" },
            { method: "POST", path: "/api/scan", desc: "Batch scan up to 20 tokens. Body: { mints: string[] }.", color: "bg-blue-500/20 text-blue-400" },
            { method: "GET", path: "/api/tokens?type=trending", desc: "List tokens (trending | boosted | profiles). Optional limit.", color: "bg-violet-500/20 text-violet-400" },
            { method: "GET", path: "/api/tokens?mint={address}", desc: "Get detailed data for a single token.", color: "bg-cyan-500/20 text-cyan-400" },
          ].map((ep, i) => (
            <FadeIn key={ep.path} delay={0.25 + i * 0.05}>
              <motion.div whileHover={{ x: 4 }} className="glass neon-border rounded-xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border shrink-0 ${ep.color}`}>{ep.method}</span>
                  <code className="text-sm text-gray-300 font-mono break-all">{ep.path}</code>
                </div>
                <p className="text-xs text-gray-500 mt-2">{ep.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <h2 className="text-2xl font-bold mb-6">Try It</h2>
          <div className="glass neon-border rounded-2xl p-6 mb-12">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input type="text" value={scanMint} onChange={(e) => setScanMint(e.target.value)}
                placeholder="Paste token mint address..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/40 transition-colors font-mono" />
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={tryScan} disabled={scanLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm flex items-center gap-2 shrink-0 disabled:opacity-50">
                {scanLoading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Zap className="w-4 h-4" /></motion.div> : <Play className="w-4 h-4" />}
                Scan
              </motion.button>
            </div>
            <AnimatePresence>
              {scanResult && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <pre className="bg-black/40 rounded-xl p-4 text-xs font-mono text-gray-300 overflow-x-auto max-h-80 overflow-y-auto border border-white/[0.04]">{scanResult}</pre>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3 overflow-x-auto">
                {Object.keys(codeExamples).map((key) => (
                  <button key={key} onClick={() => setActiveTab(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === key ? "bg-violet-500/20 text-violet-300 border border-violet-500/20" : "text-gray-500 hover:text-gray-300 border border-transparent"}`}>
                    {key}
                  </button>
                ))}
              </div>
              <div className="relative bg-black/40 rounded-xl p-4 border border-white/[0.04]">
                <pre className="text-xs font-mono text-gray-300 overflow-x-auto">{codeExamples[activeTab]}</pre>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(codeExamples[activeTab])}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                </motion.button>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <h2 className="text-2xl font-bold mb-6">Response Format</h2>
          <div className="glass neon-border rounded-2xl p-6 mb-12">
            <pre className="text-xs font-mono text-gray-300 overflow-x-auto">
{`{
  "score": 75, "grade": "B",
  "factors": {
    "mintAuthority": false,
    "freezeAuthority": false,
    "isSPLStandard": true,
    "topHolderPct": 12.5,
    "liquidityUsd": 45000,
    "volumeUsd24h": 120000
  },
  "warnings": [],
  "recommendation": "Moderate risk."
}`}
            </pre>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass neon-border rounded-2xl p-6">
            <span className="text-gray-500 text-sm">Need help?</span>
            <div className="flex items-center gap-3">
              <a href="https://github.com/allinoneacount1-dot/sniper-platform" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl glass glass-hover text-gray-300 hover:text-white transition-colors">
                <Code className="w-4 h-4" /> GitHub
              </a>
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
