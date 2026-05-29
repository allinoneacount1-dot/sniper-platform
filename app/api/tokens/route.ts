// app/api/tokens/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getNewTokens, getPumpFunTokens } from '@/lib/gmgn/client';
import { prisma } from '@/lib/db/prisma';
import { analyzeRisk } from '@/lib/risk/engine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'new'; // new | pump | cached
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const minRisk = parseInt(searchParams.get('minRisk') || '0');
    const maxRisk = parseInt(searchParams.get('maxRisk') || '100');
    const minLiquidity = parseFloat(searchParams.get('minLiquidity') || '0');

    // Option 1: Return from cache (fast, for dashboard)
    if (type === 'cached') {
      const tokens = await prisma.tokenCache.findMany({
        where: {
          riskScore: { gte: minRisk, lte: maxRisk },
          liquidityUsd: { gte: minLiquidity },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return NextResponse.json({ source: 'cache', data: tokens, count: tokens.length });
    }

    // Option 2: Fetch fresh from GMGN
    const rawTokens = type === 'pump'
      ? await getPumpFunTokens(limit)
      : await getNewTokens(limit);

    // Enrich with risk scores (limit to first 10 to avoid timeout)
    const enriched = await Promise.all(
      rawTokens.slice(0, 10).map(async (t) => {
        try {
          const risk = await analyzeRisk(t.mint);

          // Cache in database
          await prisma.tokenCache.upsert({
            where: { mintAddress: t.mint },
            create: {
              mintAddress: t.mint,
              symbol: t.symbol,
              name: t.name,
              decimals: t.decimals,
              riskScore: risk.score,
              riskFactors: risk.factors as any,
              topHolderPct: risk.factors.topHolderPct,
              holderCount: risk.factors.holderCount,
              liquidityUsd: t.liquidity || risk.factors.liquidityUsd,
              volumeUsd24h: t.volume24hr || risk.factors.volumeUsd24h,
              priceUsd: t.price || risk.factors.priceUsd,
              marketCap: risk.factors.marketCap,
              isPumpFun: t.mint.endsWith('pump'),
            },
            update: {
              riskScore: risk.score,
              riskFactors: risk.factors as any,
              liquidityUsd: t.liquidity || risk.factors.liquidityUsd,
              volumeUsd24h: t.volume24hr || risk.factors.volumeUsd24h,
              priceUsd: t.price || risk.factors.priceUsd,
              updatedAt: new Date(),
            },
          });

          return { ...t, risk: risk.score, grade: risk.grade, warnings: risk.warnings.length };
        } catch {
          return { ...t, risk: null, grade: '?', warnings: 0 };
        }
      })
    );

    return NextResponse.json({ source: 'fresh', data: enriched, count: enriched.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}
