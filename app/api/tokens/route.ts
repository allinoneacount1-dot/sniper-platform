import { NextRequest, NextResponse } from 'next/server';
import { getBoostedTokens, getTokenProfiles, getMultipleTokenPairs, getTokenPairs, toTokenData, DexPair } from '@/lib/dexscreener/client';
import { analyzeRisk, gradeColor, gradeBgColor } from '@/lib/risk/engine';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'trending'; // trending | boosted | profiles | search
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const mint = searchParams.get('mint');

    // Single token lookup
    if (mint) {
      const pairs = await getTokenPairs(mint);
      if (!pairs || pairs.length === 0) {
        return NextResponse.json({ error: 'Token not found on DexScreener' }, { status: 404 });
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
          info: risk.info,
          recommendation: risk.recommendation,
        },
      });
    }

    // Get token addresses from boosts + profiles, then fetch pair data
    let pairs: DexPair[] = [];

    if (type === 'boosted') {
      const boosted = await getBoostedTokens();
      const addresses = boosted.slice(0, limit).map(b => b.tokenAddress);
      pairs = await getMultipleTokenPairs(addresses);
    } else if (type === 'profiles') {
      const profiles = await getTokenProfiles();
      const addresses = profiles.slice(0, limit).map(p => p.tokenAddress);
      pairs = await getMultipleTokenPairs(addresses);
    } else {
      // trending: combine boosts + profiles
      const [boosted, profiles] = await Promise.all([
        getBoostedTokens(),
        getTokenProfiles(),
      ]);
      const addresses = [
        ...boosted.slice(0, 10).map(b => b.tokenAddress),
        ...profiles.slice(0, 10).map(p => p.tokenAddress),
      ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate
      pairs = await getMultipleTokenPairs(addresses.slice(0, limit));
    }

    if (pairs.length === 0) {
      return NextResponse.json({
        source: 'dexscreener',
        data: [],
        count: 0,
      });
    }

    // Enrich with risk scores (limit to first 5 to avoid timeout)
    const enriched = await Promise.all(
      pairs.slice(0, 5).map(async (p) => {
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
    const rest = pairs.slice(5).map(toTokenData);

    return NextResponse.json({
      source: 'dexscreener',
      type,
      data: [...enriched, ...rest],
      count: enriched.length + rest.length,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}
