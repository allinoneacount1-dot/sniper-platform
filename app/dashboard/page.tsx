// app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatNumber, formatPrice, formatPercent, formatTimeAgo, truncateAddress } from '@/lib/utils';
import { TokenData } from '@/types';

export default function DashboardPage() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'new' | 'pump'>('new');
  const [riskFilter, setRiskFilter] = useState<'all' | 'safe' | 'risky'>('all');

  const fetchTokens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tokens?type=${type}&limit=50`);
      const data = await res.json();
      if (data.data) {
        setTokens(data.data);
      }
    } catch (err) {
      console.error('Fetch tokens error:', err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
  }, [fetchTokens]);

  const filteredTokens = tokens.filter(t => {
    if (riskFilter === 'safe') return (t.risk ?? 50) >= 60;
    if (riskFilter === 'risky') return (t.risk ?? 50) < 40;
    return true;
  });

  const stats = {
    total: tokens.length,
    safe: tokens.filter(t => (t.risk ?? 50) >= 60).length,
    risky: tokens.filter(t => (t.risk ?? 50) < 40).length,
    pumpFun: tokens.filter(t => t.isPumpFun).length,
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">
              SP
            </div>
            <div>
              <h1 className="text-xl font-bold">Sniper Platform</h1>
              <p className="text-xs text-gray-500">AI-Powered Token Screener</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Solana Mainnet
            </div>
            <Badge variant="purple">v0.1.0</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-gray-400">Total Screened</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-gray-400">Safe (A-B)</p>
              <p className="text-2xl font-bold mt-1 text-green-400">{stats.safe}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-gray-400">Risky (D-F)</p>
              <p className="text-2xl font-bold mt-1 text-red-400">{stats.risky}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-gray-400">Pump.fun</p>
              <p className="text-2xl font-bold mt-1 text-purple-400">{stats.pumpFun}</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant={type === 'new' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setType('new')}
            >
              New Tokens
            </Button>
            <Button
              variant={type === 'pump' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setType('pump')}
            >
              Pump.fun
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={riskFilter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRiskFilter('all')}
            >
              All
            </Button>
            <Button
              variant={riskFilter === 'safe' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRiskFilter('safe')}
            >
              Safe
            </Button>
            <Button
              variant={riskFilter === 'risky' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRiskFilter('risky')}
            >
              Risky
            </Button>
            <Button variant="secondary" size="sm" onClick={fetchTokens} disabled={loading}>
              {loading ? '⟳' : '↻'} Refresh
            </Button>
          </div>
        </div>

        {/* Token Table */}
        <Card>
          <CardHeader className="py-3">
            <div className="grid grid-cols-12 gap-4 text-xs text-gray-500 font-medium px-2">
              <div className="col-span-3">Token</div>
              <div className="col-span-1">Risk</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Liquidity</div>
              <div className="col-span-2">Volume 24h</div>
              <div className="col-span-2">Age</div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-3" />
                <p>Scanning new tokens...</p>
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No tokens found. Try changing filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filteredTokens.map((token) => (
                  <TokenRow key={token.mint} token={token} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function TokenRow({ token }: { token: TokenData }) {
  const risk = token.risk ?? 50;
  const grade = token.grade ?? '?';

  return (
    <a
      href={`/dashboard/${token.mint}`}
      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-pointer"
    >
      {/* Token */}
      <div className="col-span-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-sm font-bold">
          {token.symbol?.[0] || '?'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{token.symbol || 'Unknown'}</span>
            {token.isPumpFun && (
              <Badge variant="purple" className="text-[10px] px-1.5 py-0">pump</Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">{truncateAddress(token.mint)}</p>
        </div>
      </div>

      {/* Risk */}
      <div className="col-span-1 flex items-center">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
          risk >= 80 ? 'bg-green-500/20 text-green-400' :
          risk >= 60 ? 'bg-lime-500/20 text-lime-400' :
          risk >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
          risk >= 20 ? 'bg-orange-500/20 text-orange-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {grade}
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2 flex items-center text-sm">
        {formatPrice(token.price)}
      </div>

      {/* Liquidity */}
      <div className="col-span-2 flex items-center text-sm">
        {formatNumber(token.liquidity)}
      </div>

      {/* Volume */}
      <div className="col-span-2 flex items-center text-sm">
        {formatNumber(token.volume24hr)}
      </div>

      {/* Age */}
      <div className="col-span-2 flex items-center text-xs text-gray-400">
        {token.created_timestamp
          ? formatTimeAgo(new Date(token.created_timestamp * 1000))
          : '—'
        }
      </div>
    </a>
  );
}
