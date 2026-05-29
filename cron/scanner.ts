// cron/scanner.ts
import { getNewTokens, getPumpFunTokens } from '@/lib/gmgn/client';
import { analyzeRisk } from '@/lib/risk/engine';
import { prisma } from '@/lib/db/prisma';

/**
 * Main token scanner job
 * Run every 30 seconds via cron
 */
export async function runTokenScanner() {
  console.log('[Scanner] Starting token scan...');
  const startTime = Date.now();

  try {
    // Fetch new tokens
    const [newTokens, pumpTokens] = await Promise.all([
      getNewTokens(50).catch(() => []),
      getPumpFunTokens(30).catch(() => []),
    ]);

    const allTokens = [...newTokens, ...pumpTokens];
    const uniqueMints = new Map();

    for (const token of allTokens) {
      const mint = token.mint;
      if (mint && !uniqueMints.has(mint)) {
        uniqueMints.set(mint, token);
      }
    }

    console.log(`[Scanner] Found ${uniqueMints.size} unique tokens`);

    // Screen each token (limit to 15 per run to avoid timeout)
    const mints = Array.from(uniqueMints.entries()).slice(0, 15);

    for (const [mint, tokenData] of mints) {
      try {
        // Check cache first
        const cached = await prisma.tokenCache.findUnique({
          where: { mintAddress: mint },
        });

        if (cached && Date.now() - cached.updatedAt.getTime() < 60000) {
          continue; // Skip if scanned < 1 min ago
        }

        // Run risk analysis
        const risk = await analyzeRisk(mint);

        // Upsert to cache
        await prisma.tokenCache.upsert({
          where: { mintAddress: mint },
          create: {
            mintAddress: mint,
            symbol: tokenData.symbol || null,
            name: tokenData.name || null,
            decimals: tokenData.decimals || 6,
            riskScore: risk.score,
            riskFactors: risk.factors as any,
            topHolderPct: risk.factors.topHolderPct,
            holderCount: risk.factors.holderCount,
            liquidityUsd: tokenData.liquidity || risk.factors.liquidityUsd,
            volumeUsd24h: tokenData.volume24hr || risk.factors.volumeUsd24h,
            priceUsd: tokenData.price || risk.factors.priceUsd,
            marketCap: risk.factors.marketCap,
            isPumpFun: mint.endsWith('pump'),
            creator: tokenData.creator,
          },
          update: {
            riskScore: risk.score,
            riskFactors: risk.factors as any,
            liquidityUsd: tokenData.liquidity || risk.factors.liquidityUsd,
            volumeUsd24h: tokenData.volume24hr || risk.factors.volumeUsd24h,
            updatedAt: new Date(),
          },
        });

        // Trigger alerts for high-risk tokens
        if (risk.score < 30) {
          await triggerAlerts(mint, risk);
        }
      } catch (err) {
        console.error(`[Scanner] Error scanning ${mint}:`, err);
      }
    }

    // Update system stats
    await prisma.systemStat.upsert({
      where: { key: 'last_scan' },
      create: { key: 'last_scan', value: { time: new Date(), duration: Date.now() - startTime, tokens: mints.length } },
      update: { value: { time: new Date(), duration: Date.now() - startTime, tokens: mints.length } },
    });

    console.log(`[Scanner] Completed in ${Date.now() - startTime}ms`);
  } catch (error) {
    console.error('[Scanner] Fatal error:', error);
  }
}

async function triggerAlerts(mint: string, risk: any) {
  const alerts = await prisma.alert.findMany({
    where: { type: 'RISK_ALERT', isActive: true },
    include: { user: true },
  });

  for (const alert of alerts) {
    // Could send Telegram notification here
    console.log(`[Alert] Would notify user ${alert.userId} about ${mint}`);
  }
}
