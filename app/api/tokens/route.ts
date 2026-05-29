import { NextRequest, NextResponse } from 'next/server';
import { searchTokens, getTokenPairs, toTokenData, DexPair } from '@/lib/dexscreener/client';
import { analyzeRisk, gradeColor, gradeBgColor } from '@/lib/risk/engine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'solana';
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const mint = searchParams.get('mint');

    // Single token lookup
    if (mint) {
      const pairs = await getTokenPairs(mint);
      if (!pairs || pairs.length === 0) {
        return NextResponse.json({ error: 'Token not found' }, { status: 404 });
      }
      const token = toTokenData(pairs[0]);
      const risk = await analyzeRisk(mint);
      return NextResponse.json({
        token: {
          ...token,
          riskScore: risk.score,
          riskGrade: risk.grade,
          gradeColor: gradeColor(risk.grade),
          gradeBg: gradeBgColor(risk.grade),
          factors: risk.factors,
          warnings: risk.warnings,
          recommendation: risk.recommendation,
        },
      });
    }

    // Search solana memecoins / trending
    let pairs: DexPair[] = [];
    if (type === 'solana') {
      pairs = await searchTokens('solana');
    } else {
      pairs = await searchTokens(type);
    }

    const sliced = pairs.slice(0, limit);

    // Enrich top 5 with risk scores
    const enriched = await Promise.all(
      sliced.slice(0, 5).map(async (p) => {
        const token = toTokenData(p);
        try {
          const risk = await analyzeRisk(token.mint);
          return {
            ...token,
            riskScore: risk.score,
            riskGrade: risk.grade,
            gradeColor: gradeColor(risk.grade),
            gradeBg: gradeBgColor(risk.grade),
            warnings: risk.warnings,
          };
        } catch {
          return { ...token, riskScore: null, riskGrade: '?' };
        }
      })
    );

    // Remaining tokens without risk score (fast)
    const rest = sliced.slice(5).map(toTokenData);

    return NextResponse.json({
      source: 'dexscreener',
      data: [...enriched, ...rest],
      count: enriched.length + rest.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}
