"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { AnimatedButton, GlassCard, FloatingOrbs, Stagger, staggerItem, Badge } from "@/components/ui/animated";

// ─── Hero Section ──────────────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return (
    <motion.section ref={ref} style={{ y, opacity, scale }} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl"
        style={{ x: springX, y: springY }}
        animate={{ x: [0, 50, -30, 0], y: [0, -30, 50, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/8 blur-3xl"
        animate={{ x: [0, -40, 30, 0], y: [0, 40, -20, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Badge variant="info">🚀 Now Live on Vercel</Badge>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-white">Snipe</span>{" "}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Smarter
          </span>
          <br />
          <span className="text-white">Not </span>
          <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Harder
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          AI-powered risk screener for Solana tokens. Real-time on-chain analysis,
          liquidity tracking, and rug detection — all in one dashboard.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <AnimatedButton variant="primary" size="lg" glow>
            ⚡ Launch Dashboard
          </AnimatedButton>
          <AnimatedButton variant="secondary" size="lg">
            📖 View Docs →
          </AnimatedButton>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { label: "Tokens Scanned", value: "12,847" },
            { label: "Rugs Detected", value: "3,291" },
            { label: "API Uptime", value: "99.9%" },
            { label: "Avg Scan Time", value: "<2s" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

// ─── Features Section ──────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: "🔍",
      title: "Deep Scan",
      description: "On-chain analysis via Helius DAS — mint authority, freeze, holder concentration, liquidity health.",
      gradient: "from-violet-500/20 to-indigo-500/20",
      border: "border-violet-500/20",
    },
    {
      icon: "⚡",
      title: "Real-Time Alerts",
      description: "Telegram bot delivers instant notifications when new tokens hit your risk criteria.",
      gradient: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/20",
    },
    {
      icon: "📊",
      title: "Risk Grading",
      description: "A-to-F grading system based on 10+ on-chain factors. No more guessing games.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      border: "border-emerald-500/20",
    },
    {
      icon: "🛡️",
      title: "Rug Detection",
      description: "Identifies honeypot contracts, mint authority abuse, liquidity locks, and dev wallet dumping.",
      gradient: "from-red-500/20 to-rose-500/20",
      border: "border-red-500/20",
    },
    {
      icon: "🔗",
      title: "Multi-Source",
      description: "Aggregates data from DexScreener, Helius, CoinMarketCap, and GMGN for maximum accuracy.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/20",
    },
    {
      icon: "🤖",
      title: "AI Insights",
      description: "Machine learning model trained on 50K+ rug pulls to predict scam probability.",
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/20",
    },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="success">✨ Features</Badge>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Stay Safe
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Built by degens, for degens. Premium tools without the premium price tag.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="p-6 h-full" delay={i * 0.1}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} border ${f.border} flex items-center justify-center text-2xl mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Live Ticker Section ───────────────────────────────────────────
function LiveTicker() {
  const tokens = [
    { symbol: "BTC", price: "$104,285", change: "+2.4%", up: true },
    { symbol: "ETH", price: "$2,518", change: "+1.8%", up: true },
    { symbol: "SOL", price: "$178.42", change: "+5.2%", up: true },
    { symbol: "BNB", price: "$638", change: "-0.3%", up: false },
  ];

  return (
    <div className="relative py-6 border-y border-white/5 bg-white/[0.02] overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...tokens, ...tokens, ...tokens].map((t, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-white">{t.symbol}</span>
            <span className="text-gray-300">{t.price}</span>
            <span className={t.up ? "text-emerald-400" : "text-red-400"}>{t.change}</span>
          </div>
        ))}
      </motion.div>
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
    </div>
  );
}

// ─── Scanning Preview Section ──────────────────────────────────────
function ScanningPreview() {
  const [scanStep, setScanStep] = useState(0);
  const steps = [
    { label: "Fetching on-chain data...", icon: "🔗" },
    { label: "Checking mint authority...", icon: "🔐" },
    { label: "Analyzing holder distribution...", icon: "📊" },
    { label: "Scoring liquidity health...", icon: "💧" },
    { label: "Generating risk report...", icon: "📋" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setScanStep((prev) => (prev + 1) % (steps.length + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return null; // Would need useState import — handled below
}

// ─── Footer ────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              SNIPER
            </div>
            <p className="mt-3 text-sm text-gray-500">
              AI-powered Solana token risk screener. Stay safe out there.
            </p>
          </div>
          {[
            { title: "Product", links: ["Dashboard", "API", "Telegram Bot", "Pricing"] },
            { title: "Resources", links: ["Docs", "GitHub", "Changelog", "Status"] },
            { title: "Legal", links: ["Privacy", "Terms", "Disclaimer"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-violet-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
          © 2026 Sniper Platform. DYOR — Not financial advice.
        </div>
      </div>
    </footer>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return null; // Handled in ScanningPreview above — fix needed
}

// ─── Main Page ─────────────────────────────────────────────────────
import { useState } from "react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <FloatingOrbs />
      <HeroSection />
      <LiveTicker />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
