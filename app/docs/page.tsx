"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard, AnimatedButton, Badge } from "@/components/ui/animated";

const sections = [
  {
    id: "getting-started",
    title: "🚀 Getting Started",
    content: `## What is Sniper Platform?

Sniper Platform is an AI-powered Solana token risk screener that helps you identify potentially dangerous tokens before you invest.

## How It Works

1. **Data Aggregation** — We pull real-time data from DexScreener, Helius (Solana RPC), and CoinMarketCap
2. **On-Chain Analysis** — Each token is analyzed against 10+ risk factors including mint authority, freeze authority, holder concentration, and liquidity health
3. **Risk Grading** — Tokens are graded A (safest) to F (dangerous) with detailed explanations
4. **Real-Time Alerts** — Get notified via Telegram when new tokens match your criteria

## Quick Start

\`\`\`bash
# Dashboard
Visit /dashboard to see real-time token list

# API
GET /api/tokens?limit=20&type=trending
GET /api/scan?mint=<ADDRESS>
POST /api/scan { "mints": [...] }
\`\`\`

## Supported Chains

Currently focused on **Solana** with plans to support Ethereum, Base, and BSC.
`,
  },
  {
    id: "api-reference",
    title: "📡 API Reference",
    content: `## Base URL

\`https://sniper-platform.vercel.app\`

## Endpoints

### GET /api/tokens

Fetch list of tokens with risk data.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| type | string | trending | trending | boosted | profiles |
| limit | int | 50 | Max tokens (max 100) |
| mint | string | — | Single token lookup |

**Response:**
\`\`\`json
{
  "source": "dexscreener",
  "type": "trending",
  "data": [
    {
      "mint": "...",
      "symbol": "DOGEUS",
      "name": "Dogeus Maximus",
      "price": 0.00004254,
      "liquidity": 15767.11,
      "volume24h": 90974.96,
      "change24h": 12.5,
      "marketCap": 42540,
      "riskScore": 45,
      "riskGrade": "C",
      "warnings": ["Mint authority is ACTIVE"],
      "dexId": "pumpswap"
    }
  ],
  "count": 20
}
\`\`\`

### GET /api/scan

Scan a single token by mint address.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| mint | string | Yes | Token mint address |

### POST /api/scan

Batch scan multiple tokens.

**Body:**
\`\`\`json
{
  "mints": ["address1", "address2"]
}
\`\`\`

## Rate Limits

- 60 requests per minute per IP
- Each risk scan takes 2-5 seconds
- Batch scans limited to 20 tokens per request
`,
  },
  {
    id: "risk-factors",
    title: "⚠️ Risk Factors",
    content: `## Risk Scoring System

Each token is scored from **0-100** (higher = safer) based on:

### Critical Factors (-20 to -25 points)

- **Mint Authority Active** (-25 pts) — Team can mint unlimited new tokens
- **Freeze Authority Active** (-20 pts) — Team can freeze all transfers
- **Honeypot Contract** (-25 pts) — Buy but cannot sell

### High Risk Factors (-10 to -15 points)

- **Top Holder > 50%** (-20 pts) — Extreme concentration risk
- **Top Holder > 30%** (-10 pts) — High whale concentration
- **Non-Standard Program** (-15 pts) — Not standard SPL token
- **Liquidity < $1,000** (-10 pts) — Very easy to manipulate

### Moderate Risk Factors (-5 points each)

- **Top Holder > 15%** — Some concentration risk
- **Liquidity < $5,000** — Low liquidity risk
- **Volume < $500/day** — Low trading activity
- **Pump.fun Token** — Higher scam probability
- **No Metadata** — No name/symbol on-chain

### Grade Scale

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 80-100 | Relatively safe |
| B | 60-79 | Moderate risk |
| C | 40-59 | High risk |
| D | 20-39 | Very high risk |
| F | 0-19 | Likely scam |
`,
  },
  {
    id: "wallet",
    title: "👛 Wallet Integration",
    content: `## Connect Your Wallet

Sniper Platform supports leading Solana wallets:

### Supported Wallets

- **Phantom** — Most popular Solana wallet
- **Solflare** — Feature-rich alternative
- **Backpack** — xNFT compatible
- **Glow** — Browser extension
- **Coin98** — Multi-chain support

### How It Works

1. Click "Connect Wallet" in the top navigation
2. Select your wallet provider
3. Approve the connection in your wallet popup
4. Your wallet address is now connected!

### Security

- **We never store your private keys**
- **We never request transactions without your approval**
- **All connections are read-only by default**
- **You can disconnect at any time**

### Connected Features

- View your token balances
- Track your portfolio value
- Get personalized risk alerts for tokens you hold
- One-click scan for any token in your wallet
`,
  },
  {
    id: "telegram",
    title: "📱 Telegram Bot",
    content: `## Set Up Telegram Alerts

Get real-time token alerts delivered to your Telegram.

### Bot Commands

| Command | Description |
|---------|-------------|
| /start | Initialize bot and get welcome message |
| /scan <address> | Scan any Solana token |
| /trending | Get top trending tokens |
| /alerts | Configure alert preferences |
| /mytokens | Track your watched tokens |
| /help | Show all commands |

### Setup

1. Open Telegram and search for **@SniperPlatformBot**
2. Send \`/start\`
3. Set your risk threshold: \`/alerts min-grade B\`
4. You'll receive alerts for new tokens matching your criteria

### Alert Types

- 🚨 **Rug Alert** — High-risk token detected
- 🟢 **New Safe Token** — A/B grade token just launched
- 📊 **Market Alert** — Price/volume spike detected
`,
  },
];

export default function DocsPage() {
  const [active, setActive] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = searchQuery
    ? sections.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : sections;

  const activeSection = sections.find(s => s.id === active);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black mb-2">
            📖 <span className="gradient-text">Documentation</span>
          </h1>
          <p className="text-gray-500 text-sm">Everything you need to know about Sniper Platform</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <motion.div
            className="lg:w-64 shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-4 sticky top-6">
              <input
                type="text"
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/30 mb-3"
              />
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setActive(s.id); setSearchQuery(""); }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all cursor-pointer ${
                      active === s.id
                        ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-white/5">
                <Badge variant="info">API v1.0</Badge>
              </div>
            </GlassCard>
          </motion.div>

          {/* Content */}
          <motion.div
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {activeSection && (
                <motion.div
                  key={activeSection.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlassCard className="p-6 sm:p-8">
                    {/* Render markdown-like content */}
                    <div className="prose prose-invert prose-sm max-w-none">
                      {activeSection.content.split("\n").map((line, i) => {
                        if (line.startsWith("## ")) {
                          return <h2 key={i} className="text-xl sm:text-2xl font-bold text-white mt-6 mb-3">{line.replace("## ", "")}</h2>;
                        }
                        if (line.startsWith("### ")) {
                          return <h3 key={i} className="text-lg font-bold text-violet-300 mt-4 mb-2">{line.replace("### ", "")}</h3>;
                        }
                        if (line.startsWith("```")) {
                          return null; // handled by code block
                        }
                        if (line.startsWith("|")) {
                          return <div key={i} className="font-mono text-xs text-gray-300 bg-white/5 px-2 py-1 rounded">{line}</div>;
                        }
                        if (line.startsWith("- **")) {
                          const parts = line.replace("- **", "").split("**");
                          return (
                            <div key={i} className="flex items-start gap-2 ml-4 my-1">
                              <span className="text-violet-400 mt-1">•</span>
                              <span><strong className="text-white">{parts[0]}</strong>{parts[1]}</span>
                            </div>
                          );
                        }
                        if (line.startsWith("- ")) {
                          return (
                            <div key={i} className="flex items-start gap-2 ml-4 my-0.5">
                              <span className="text-violet-400 mt-1">•</span>
                              <span className="text-gray-300">{line.replace("- ", "")}</span>
                            </div>
                          );
                        }
                        if (line.trim() === "") return <div key={i} className="h-2" />;
                        return <p key={i} className="text-gray-300 text-sm leading-relaxed my-1">{line}</p>;
                      })}
                    </div>

                    {/* Code blocks */}
                    {activeSection.content.includes("```") && (
                      <div className="mt-6 space-y-3">
                        {activeSection.content.split("```").map((block, i) => {
                          if (i % 2 === 1) {
                            return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative"
                              >
                                <pre className="p-4 rounded-xl bg-black/40 border border-white/5 overflow-x-auto">
                                  <code className="text-xs sm:text-sm text-emerald-300 font-mono">{block.trim()}</code>
                                </pre>
                              </motion.div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
