// app/dashboard/[mint]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatNumber, formatPrice, truncateAddress } from '@/lib/utils';
import { RiskResult, TokenData } from '@/types';
import Link from 'next/link';

export default function TokenDetailPage() {
  const { mint } = useParams<{ mint: string }>();
  const [token, setToken] = useState<TokenData | null>(null);
  const [risk, setRisk] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const scanToken = async () => {
    setScanning(true);
    try {
      const res = await fetch(`/api/scan?mint=${mint}`);
      const data = await res.json();
      setRisk(data);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    // Fetch from cache first
    fetch(`/api/tokens?type=cached&limit=100`)
      .then(res => res.json())
      .then(data => {
        const found = data.data?.find((t: any) => t.mintAddress === mint);
        if (found) {
          setToken({
            mint: found.mintAddress,
            symbol: found.symbol,
            name: found.name,
            price: found.priceUsd || 0,
            liquidity: found.liquidityUsd || 0,
            volume24hr: found.volumeUsd24h || 0,
            isPumpFun: found.isPumpFun,
            risk: found.riskScore,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Always run fresh scan
    scanToken();
  }, [mint]);

  if (loading && !risk) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Analyzing token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
            ← Back to Dashboard
          </Link>
          <Button onClick={scanToken} disabled={scanning} size="sm">
            {scanning ? '⟳ Scanning...' : '↻ Re-Scan'}
          </Button>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto p-6 space-y-6">
        {/* Token Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold">
            {token?.symbol?.[0] || '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{token?.symbol || 'Unknown Token'}</h1>
            <p className="text-sm text-gray-400 font-mono">{mint}</p>
          </div>
          {token?.isPumpFun && <Badge variant="purple">Pump.fun</Badge>}
        </div>

        {risk && (
          <>
            {/* Risk Score */}
            <div className="grid grid-cols-3 gap-6">
              <Card className={`border ${
                risk.score >= 80 ? 'border-green-500/30' :
                risk.score >= 60 ? 'border-lime-500/30' :
                risk.score >= 40 ? 'border-yellow-500/30' :
                risk.score >= 20 ? 'border-orange-500/30' :
                'border-red-500/30'
              }`}>
                <CardContent className="py-6 text-center">
                  <p className="text-sm text-gray-400 mb-2">Risk Score</p>
                  <p className={`text-5xl font-bold ${
                    risk.score >= 80 ? 'text-green-400' :
                    risk.score >= 60 ? 'text-lime-400' :
                    risk.score >= 40 ? 'text-yellow-400' :
                    risk.score >= 20 ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    {risk.score}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Grade: {risk.grade}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <p className="text-sm text-gray-400 mb-4">Market Data</p>
                  <div className="space-y-3">
                    <DataRow label="Price" value={formatPrice(risk.factors.priceUsd)} />
                    <DataRow label="Liquidity" value={formatNumber(risk.factors.liquidityUsd)} />
                    <DataRow label="Volume 24h" value={formatNumber(risk.factors.volumeUsd24h)} />
                    <DataRow label="Market Cap" value={formatNumber(risk.factors.marketCap)} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="py-6">
                  <p className="text-sm text-gray-400 mb-4">Security Checks</p>
                  <div className="space-y-2">
                    <CheckItem label="Mint Authority" ok={!risk.factors.mintAuthority} />
                    <CheckItem label="Freeze Authority" ok={!risk.factors.freezeAuthority} />
                    <CheckItem label="Token Standard" ok={risk.factors.isSPLStandard || risk.factors.isToken2022} />
                    <CheckItem label="Has Metadata" ok={risk.factors.hasMetadata} />
                    <CheckItem label="Holder Concentration" ok={risk.factors.topHolderPct < 30} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Warnings */}
            {risk.warnings.length > 0 && (
              <Card className="border-red-500/30 bg-red-500/5">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    ⚠️ Warnings ({risk.warnings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {risk.warnings.map((w, i) => (
                      <li key={i} className="text-red-300 text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Info */}
            {risk.info.length > 0 && (
              <Card className="border-blue-500/30 bg-blue-500/5">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    ℹ️ Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {risk.info.map((info, i) => (
                      <li key={i} className="text-blue-300 text-sm flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        {info}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendation */}
            <Card>
              <CardContent className="py-4">
                <p className="text-sm text-gray-400 mb-1">Recommendation</p>
                <p className="text-white font-medium">{risk.recommendation}</p>
              </CardContent>
            </Card>

            {/* On-chain Details */}
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>On-Chain Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <DataRow label="Holder Count" value={risk.factors.holderCount.toString()} />
                    <DataRow label="Top Holder %" value={`${risk.factors.topHolderPct.toFixed(1)}%`} />
                    <DataRow label="Token Program" value={
                      risk.factors.isSPLStandard ? 'SPL Token' :
                      risk.factors.isToken2022 ? 'Token-2022' :
                      'Unknown'
                    } />
                    <DataRow label="Creator Holds High" value={risk.factors.creatorHoldsHigh ? 'YES ⚠️' : 'No'} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <FactorBar label="Supply Risk" value={risk.factors.mintAuthority ? 90 : 10} />
                    <FactorBar label="Freeze Risk" value={risk.factors.freezeAuthority ? 80 : 5} />
                    <FactorBar label="Concentration" value={Math.min(risk.factors.topHolderPct * 1.5, 100)} />
                    <FactorBar label="Liquidity" value={risk.factors.liquidityUsd < 1000 ? 80 : risk.factors.liquidityUsd < 5000 ? 40 : 10} />
                    <FactorBar label="Volume" value={risk.factors.volumeUsd24h < 500 ? 70 : 15} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function CheckItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={ok ? 'text-green-400' : 'text-red-400'}>
        {ok ? '✓' : '✗'}
      </span>
      <span className={ok ? 'text-gray-300' : 'text-red-300'}>{label}</span>
    </div>
  );
}

function FactorBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-gray-500">{value.toFixed(0)}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            value > 60 ? 'bg-red-500' : value > 30 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
