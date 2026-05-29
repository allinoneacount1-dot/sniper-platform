"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/8 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 mb-8">
            🚀 Now Live on Vercel
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
            <span className="text-white">Snipe</span>{" "}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Smarter</span>
            <br />
            <span className="text-white">Not </span>
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Harder</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI-powered risk screener for Solana tokens. Real-time on-chain analysis, liquidity tracking, and rug detection.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all">
              <span className="absolute inset-0 bg-gradient-to-r from-violet-400/30 to-indigo-400/30 blur-xl opacity-50" />
              <span className="relative z-10">⚡ Launch Dashboard</span>
            </Link>
            <Link href="/docs" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-[1.03] active:scale-[0.97] transition-all">
              📖 View Docs →
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Tokens Scanned", value: "12,847" },
              { label: "Rugs Detected", value: "3,291" },
              { label: "API Uptime", value: "99.9%" },
              { label: "Avg Scan Time", value: "<2s" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/20 transition-colors">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="relative py-6 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap animate-marquee">
          {[
            { symbol: "BTC", price: "$104,285", change: "+2.4%", up: true },
            { symbol: "ETH", price: "$2,518", change: "+1.8%", up: true },
            { symbol: "SOL", price: "$178.42", change: "+5.2%", up: true },
            { symbol: "BNB", price: "$638", change: "-0.3%", up: false },
          ].flatMap((t, i) => [
            <div key={`${i}-a`} className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-white">{t.symbol}</span>
              <span className="text-gray-300">{t.price}</span>
              <span className={t.up ? "text-emerald-400" : "text-red-400"}>{t.change}</span>
            </div>,
            <div key={`${i}-b`} className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-white">{t.symbol}</span>
              <span className="text-gray-300">{t.price}</span>
              <span className={t.up ? "text-emerald-400" : "text-red-400"}>{t.change}</span>
            </div>,
            <div key={`${i}-c`} className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-white">{t.symbol}</span>
              <span className="text-gray-300">{t.price}</span>
              <span className={t.up ? "text-emerald-400" : "text-red-400"}>{t.change}</span>
            </div>,
          ])}
        </div>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10" />
      </div>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 mb-4">
              ✨ Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Stay Safe</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🔍", title: "Deep Scan", desc: "On-chain analysis via Helius DAS — mint authority, freeze, holder concentration." },
              { icon: "⚡", title: "Real-Time Alerts", desc: "Telegram bot delivers instant notifications for new tokens." },
              { icon: "📊", title: "Risk Grading", desc: "A-to-F grading system based on 10+ on-chain factors." },
              { icon: "🛡️", title: "Rug Detection", desc: "Identifies honeypot contracts, mint authority abuse, liquidity locks." },
              { icon: "🔗", title: "Multi-Source", desc: "Aggregates data from DexScreener, Helius, CoinMarketCap." },
              { icon: "🤖", title: "AI Insights", desc: "ML model trained on 50K+ rug pulls to predict scam probability." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-violet-500/20 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(139,92,246,0.15)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center text-2xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-3">SNIPER</div>
          <p className="text-sm text-gray-500 mb-8">AI-powered Solana token risk screener. Stay safe out there.</p>
          <div className="text-sm text-gray-600">© 2026 Sniper Platform. DYOR — Not financial advice.</div>
        </div>
      </footer>
    </div>
  );
}
