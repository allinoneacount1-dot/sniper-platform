// app/api/scan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { analyzeRisk, gradeColor, gradeBgColor } from '@/lib/risk/engine';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get('mint');

  if (!mint) {
    return NextResponse.json({ error: 'Missing mint address' }, { status: 400 });
  }

  try {
    const result = await analyzeRisk(mint);

    // Log scan (non-blocking, don't fail if DB unavailable)
    try {
      await prisma.scanLog.create({
        data: {
          mintAddress: mint,
          riskScore: result.score,
          riskFactors: result.factors,
          warningsCount: result.warnings.length,
          source: 'api',
        },
      });
    } catch {
      // DB not connected — skip logging
    }

    return NextResponse.json({
      ...result,
      gradeColor: gradeColor(result.grade),
      gradeBg: gradeBgColor(result.grade),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || 'Scan failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mints } = body as { mints: string[] };

    if (!Array.isArray(mints) || mints.length === 0) {
      return NextResponse.json({ error: 'Provide array of mint addresses' }, { status: 400 });
    }

    const results = await Promise.all(
      mints.slice(0, 20).map(async (mint: string) => {
        try {
          const result = await analyzeRisk(mint);
          return { mint, ...result, error: null };
        } catch (e: unknown) {
          return { mint, score: 0, grade: 'F' as const, error: (e as Error).message };
        }
      })
    );

    return NextResponse.json({ results, count: results.length });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || 'Batch scan failed' },
      { status: 500 }
    );
  }
}
