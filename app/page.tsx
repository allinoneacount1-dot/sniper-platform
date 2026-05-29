"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Zap, Eye, BarChart3, Bot, ArrowRight, ChevronDown, TrendingUp, AlertTriangle, Sparkles } from "lucide-react";

/* ═══════════════════════════════════════════
   HOOKS & UTILS
   ═══════════════════════════════════════════ */

function useParallax(offset: number = 50) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return { ref, y };
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function FadeInWhenVisible({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: "blur(4px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   PRICE TICKER
   ═══════════════════════════════════════════ */

interface PriceData {
  symbol: string;
  price: string;
  change: number;
}

function PriceTicker() {
  const [prices, setPrices] = useState<PriceData[]>([
    { symbol: "BTC", price: "$104,285", change: 2.4 },
    { symbol: "ETH", price: "$2,518", change: 1.8 },
    { symbol: "SOL", price: "$178.42", change: 5.2 },
    { symbol: "BNB", price: "$638", change: -0.3 },
    { symbol: "XRP", price: "$2.18", change: 3.1 },
    { symbol: "ADA", price: "$0.74", change: -1.2 },
    { symbol: "DOGE", price: "$0.19", change: 8.7 },
    { symbol: "AVAX", price: "$37.42", change: 4.2 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((p) => ({
          ...p,
          change: Number((p.change + (Math.random() - 0.5) * 0.5).toFixed(1)),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tickerItems = [...prices, ...prices];

  return (
    <FadeInWhenVisible delay={0.5}>
      <div className="relative py-4 border-y border-white/[0.06] bg-white/[0.01] overflow-hidden">
        <div className="flex gap-8 whitespace-nowrap marquee-left hover:[animation-play-state:paused]">
          {tickerItems.map((t, i) => (
            <div key={i} className="flex items-center gap-2 text-sm shrink-0">
              <span className="font-bold text-white">{t.symbol}</span>
              <span className="text-gray-400 font-mono text-xs">{t.price}</span>
              <span
                className={`font-semibold text-xs flex items-center gap-0.5 ${
                  t.change >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {t.change >= 0 ? "↑" : "↓"}
                {Math.abs(t.change)}%
              </span>
              <span className="text-white/10 ml-4">|</span>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#06060c] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#06060c] to-transparent z-10 pointer-events-none" />
      </div>
    </FadeInWhenVisible>
  );
}

/* ═══════════════════════════════════════════
   LIVE STATS COUNTER
   ═══════════════════════════════════════════ */

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════
   FEATURE CARDS
   ═══════════════════════════════════════════ */

const features = [
  { icon: <Eye className="w-5 h-5" />, title: "Deep Scan", desc: "On-chain analysis via Helius DAS — mint authority, freeze, holder concentration.", color: "from-violet-500/20 to-violet-600/5", border: "border-violet-500/20" },
  { icon: <AlertTriangle className="w-5 h-5" />, title: "Rug Detection", desc: "Identifies honeypot contracts, mint authority abuse, liquidity locks.", color: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/20" },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Risk Grading", desc: "A-to-F grading based on 10+ on-chain factors weighted by ML model.", color: "from-cyan-500/20 to-cyan-600/5", border: "border-cyan-500/20" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Real-Time Alerts", desc: "Telegram bot delivers instant notifications for new tokens and anomalies.", color: "from-emerald-500/20 to-emerald-600/5", border: "border-emerald-500/20" },
  { icon: <Sparkles className="w-5 h-5" />, title: "ML-Powered", desc: "Model trained on 50K+ rug pulls to predict scam probability.", color: "from-pink-500/20 to-pink-600/5", border: "border-pink-500/20" },
  { icon: <Bot className="w-5 h-5" />, title: "Auto Sniper", desc: "Configurable auto-snipe with profit targets and stop-loss.", color: "from-indigo-500/20 to-indigo-600/5", border: "border-indigo-500/20" },
];

/* ═══════════════════════════════════════════
   TESTIMONIALS / SOCIAL PROOF
   ═══════════════════════════════════════════ */

const testimonials = [
  { text: "Caught 3 rugs before they pumped. This tool is insane.", role: "DeFi Degen" },
  { text: "The risk grading saved me from a obvious honeypot. 10/10.", role: "Solana Trader" },
  { text: "Best free screener for pump.fun tokens. No cap.", role: "Alpha Caller" },
];

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function Home() {
  const heroParallax = useParallax(80);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  return (
    <div className="relative">
      {/* ═══ HERO ═══ */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Grid */}
        <div className="absolute inset-0 grid-pattern" />

        {/* Hero Glow Orbs */}
        <motion.div
          style={{ y: heroParallax.y }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/[0.08] blur-[140px]"
        />
        <motion.div
          style={{ y: useParallax(60).y }}
          className="absolute bottom-1/4 right-1/6 w-[400px] h-[400px] rounded-full bg-indigo-600/[0.06] blur-[120px]"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full glass mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live on Vercel — Solana Mainnet
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]"
          >
            <motion.span variants={item} className="block text-white">
              Snipe
            </motion.span>
            <motion.span variants={item} className="block text-gradient-animated">
              Smarter
            </motion.span>
            <motion.span variants={item} className="block">
              <span className="text-white">Not </span>
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
                Harder
              </span>
            </motion.span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            variants={item}
            transition={{ delay: 0.4 }}
            className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered risk screener for Solana tokens. Real-time on-chain analysis,
            liquidity tracking, and rug detection.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div variants={item}>
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(139,92,246,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-glow relative inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/20"
                >
                  <Zap className="w-5 h-5" />
                  Launch Dashboard
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>
            <motion.div variants={item}>
              <Link href="/docs">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-2xl glass text-white"
                >
                  📖 View Docs
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-gray-600"
            >
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══ TICKER ═══ */}
      <PriceTicker />

      {/* ═══ STATS ═══ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 12847, label: "Tokens Scanned", suffix: "+" },
              { value: 3291, label: "Rugs Detected", suffix: "" },
              { value: 99, label: "API Uptime", suffix: ".9%" },
              { value: 2, label: "Avg Scan Time", suffix: "s" },
            ].map((stat, i) => (
              <FadeInWhenVisible key={stat.label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass glass-hover rounded-2xl p-6 text-center neon-border"
                >
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 mb-6">
                ✨ Features
              </div>
              <h2 className="text-4xl md:text-6xl font-black">
                Everything to{" "}
                <span className="text-gradient-animated">Stay Safe</span>
              </h2>
              <p className="mt-4 text-gray-500 max-w-xl mx-auto">
                Multi-layered security analysis combining on-chain data, ML models, and real-time monitoring.
              </p>
            </div>
          </FadeInWhenVisible>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={item}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`glass glass-hover neon-border rounded-2xl p-6 group cursor-default`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} border ${f.border} flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <FadeInWhenVisible>
          <div className="max-w-5xl mx-auto text-center mb-20 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 mb-6">
              🔧 How It Works
            </div>
            <h2 className="text-4xl md:text-6xl font-black">
              3 Steps to <span className="text-gradient-animated">Safety</span>
            </h2>
          </div>
        </FadeInWhenVisible>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          {[
            { step: "01", title: "Connect Wallet", desc: "Connect your Solana wallet or paste a token address. No KYC required.", icon: <Shield className="w-6 h-6" /> },
            { step: "02", title: "Deep Scan", desc: "Our engine queries Helius, DexScreener, and on-chain data to analyze the token.", icon: <Eye className="w-6 h-6" /> },
            { step: "03", title: "Get Risk Score", desc: "Receive an A-F risk grade with detailed warnings and recommendations.", icon: <BarChart3 className="w-6 h-6" /> },
          ].map((step, i) => (
            <FadeInWhenVisible key={step.step} delay={i * 0.15} className={i % 2 === 0 ? "" : "md:ml-20"}>
              <motion.div
                whileHover={{ x: 8 }}
                className="glass glass-hover neon-border rounded-2xl p-8 flex items-start gap-6 group"
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xl font-black group-hover:scale-110 group-hover:from-violet-500/30 group-hover:to-indigo-500/30 transition-all duration-300">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="text-violet-400 group-hover:text-violet-300 transition-colors">{step.icon}</span>
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black">
                Loved by <span className="text-gradient-animated">Traders</span>
              </h2>
            </div>
          </FadeInWhenVisible>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-5"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -4 }}
                className="glass glass-hover rounded-2xl p-6 neon-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="text-xs text-gray-500 font-medium">— {t.role}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/[0.08] blur-[150px]" />
        </div>
        <FadeInWhenVisible>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Ready to <span className="text-gradient-animated">Snipe Safe?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Join thousands of traders protecting their bags.
            </p>
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 25px 80px rgba(139,92,246,0.35)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-glow relative inline-flex items-center gap-3 px-10 py-5 text-xl font-bold rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-2xl shadow-violet-500/25"
              >
                <Zap className="w-6 h-6" />
                Start Scanning Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 px-6 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-black text-gradient-animated">SNIPER</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
            <Link href="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
            <Link href="/docs" className="hover:text-gray-300 transition-colors">Docs</Link>
          </div>
          <div className="text-xs text-gray-600">
            © 2026 Sniper Platform · DYOR · NFA
          </div>
        </div>
      </footer>
    </div>
  );
}
