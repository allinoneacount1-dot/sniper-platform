// app/page.tsx
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
              SP
            </div>
            <span className="text-lg font-bold">Sniper Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="success">Live on Solana</Badge>
            <Link href="/dashboard">
              <Button size="sm">Open Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          AI-Powered Token Screening
        </div>
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Screen Before You Snipe.<br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Never Get Rugged Again.
          </span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Real-time risk analysis for Solana tokens. Powered by on-chain data,
          AI scoring, and instant Telegram alerts. Built for degens, by degens.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              🚀 Launch Dashboard
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            📖 Documentation
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-6">
          <FeatureCard
            icon="🔍"
            title="Deep Scan"
            description="Mint authority, freeze authority, holder concentration, liquidity analysis — all in one click."
          />
          <FeatureCard
            icon="⚡"
            title="Real-Time Alerts"
            description="Telegram notifications for new tokens, whale movements, and risk changes."
          />
          <FeatureCard
            icon="🧠"
            title="AI Risk Score"
            description="Proprietary scoring model analyzes 10+ factors to grade tokens A through F."
          />
          <FeatureCard
            icon="🛡️"
            title="Honeypot Detection"
            description="Identify scam tokens before you buy. Detect common rug patterns."
          />
          <FeatureCard
            icon="📊"
            title="Live Dashboard"
            description="Browse new tokens sorted by risk, volume, liquidity, and age."
          />
          <FeatureCard
            icon="💰"
            title="Trade Ready"
            description="One-click snipe integration. Execute trades directly from the dashboard."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <p>© 2026 Sniper Platform. Built on Solana.</p>
          <p>DYOR — Not financial advice</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
