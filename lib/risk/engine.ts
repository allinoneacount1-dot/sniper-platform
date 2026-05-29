// lib/risk/engine.ts
import { Connection, PublicKey } from '@solana/web3.js';
import { heliusRpc } from '@/lib/solana/connection';

const SPL_TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const TOKEN_2022_PROGRAM = 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
const PUMP_FUN_PROGRAM = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';

export interface RiskFactors {
  mintAuthority: boolean;
  freezeAuthority: boolean;
  isSPLStandard: boolean;
  isToken2022: boolean;
  topHolderPct: number;
  holderCount: number;
  liquidityUsd: number;
  volumeUsd24h: number;
  priceUsd: number;
  marketCap: number;
  hasMetadata: boolean;
  isPumpFun: boolean;
  creatorHoldsHigh: boolean;
}

export interface RiskResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: RiskFactors;
  warnings: string[];
  info: string[];
  recommendation: string;
}

export async function analyzeRisk(mintAddress: string): Promise<RiskResult> {
  const warnings: string[] = [];
  const info: string[] = [];
  const connection = new Connection(
    `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`,
    'confirmed'
  );

  let mintAuthority = false;
  let freezeAuthority = false;
  let isSPLStandard = false;
  let isToken2022 = false;
  let topHolderPct = 0;
  let holderCount = 0;
  let liquidityUsd = 0;
  let volumeUsd24h = 0;
  let priceUsd = 0;
  let marketCap = 0;
  let hasMetadata = false;
  let isPumpFun = mintAddress.endsWith('pump');
  let creatorHoldsHigh = false;

  // 1. On-chain account info
  try {
    const acctInfo = await connection.getAccountInfo(new PublicKey(mintAddress));
    if (acctInfo) {
      const owner = acctInfo.owner.toBase58();
      isSPLStandard = owner === SPL_TOKEN_PROGRAM;
      isToken2022 = owner === TOKEN_2022_PROGRAM;

      if (isToken2022) {
        info.push('Uses Token-2022 program (extended features)');
      } else if (!isSPLStandard) {
        warnings.push(`Non-standard token program: ${owner.slice(0, 16)}...`);
      }
    }
  } catch { /* ignore */ }

  // 2. DAS getAsset for metadata + authorities
  try {
    const assetData = await heliusRpc('getAsset', [{ id: mintAddress }]);
    if (assetData?.content?.metadata) {
      const meta = assetData.content.metadata;
      hasMetadata = !!(meta.name && meta.symbol);
      if (!hasMetadata) warnings.push('No on-chain metadata (name/symbol not set)');
    }
    if (assetData?.mint?.freezeAuthority) {
      freezeAuthority = true;
      warnings.push('Freeze authority is ACTIVE — team can freeze transfers');
    }
    if (assetData?.mint?.mintAuthority) {
      mintAuthority = true;
      warnings.push('Mint authority is ACTIVE — team can inflate supply');
    }
  } catch { /* ignore */ }

  // 3. Top holders
  try {
    const largestAccounts = await heliusRpc('getTokenLargestAccounts', [mintAddress]);
    if (largestAccounts?.value?.length > 0) {
      const accounts = largestAccounts.value;
      const total = accounts.reduce((sum: number, a: any) => sum + Number(a.amount), 0);
      if (total > 0) {
        topHolderPct = (Number(accounts[0].amount) / total) * 100;
        holderCount = accounts.length;

        if (topHolderPct > 50) {
          warnings.push(`Extreme concentration: top holder owns ${topHolderPct.toFixed(1)}%`);
          creatorHoldsHigh = true;
        } else if (topHolderPct > 30) {
          warnings.push(`High concentration: top holder owns ${topHolderPct.toFixed(1)}%`);
        }
      }
    }
  } catch { /* ignore */ }

  // 4. DexScreener market data
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`, {
      headers: { 'Accept': 'application/json' },
    });
    const data = await res.json();
    if (data.pairs?.length > 0) {
      const pair = data.pairs[0];
      liquidityUsd = pair.liquidity?.usd || 0;
      volumeUsd24h = pair.volume?.h24 || 0;
      priceUsd = parseFloat(pair.priceUsd || '0');
      marketCap = pair.marketCap || pair.fdv || 0;

      if (liquidityUsd < 1000) warnings.push(`Low liquidity: $${liquidityUsd.toFixed(0)}`);
      if (volumeUsd24h < 500) warnings.push(`Low volume: $${volumeUsd24h.toFixed(0)}/24h`);
    }
  } catch { /* ignore */ }

  // 5. Calculate score (0-100, higher = safer)
  let score = 100;
  if (mintAuthority) score -= 25;
  if (freezeAuthority) score -= 20;
  if (!isSPLStandard && !isToken2022) score -= 15;
  if (topHolderPct > 50) score -= 20;
  else if (topHolderPct > 30) score -= 10;
  else if (topHolderPct > 15) score -= 5;
  if (!hasMetadata) score -= 5;
  if (liquidityUsd < 1000) score -= 10;
  else if (liquidityUsd < 5000) score -= 5;
  if (volumeUsd24h < 500) score -= 5;
  if (isPumpFun) score -= 5;
  score = Math.max(0, Math.min(100, score));

  // 6. Grade
  let grade: RiskResult['grade'];
  if (score >= 80) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 40) grade = 'C';
  else if (score >= 20) grade = 'D';
  else grade = 'F';

  // 7. Recommendation
  let recommendation: string;
  if (score >= 80) recommendation = 'Relatively safe. Still DYOR before investing.';
  else if (score >= 60) recommendation = 'Moderate risk. Check team and community.';
  else if (score >= 40) recommendation = 'High risk. Small position only if at all.';
  else if (score >= 20) recommendation = 'Very high risk. Likely rug or honeypot.';
  else recommendation = 'Extreme risk. Almost certainly a scam. Avoid.';

  const factors: RiskFactors = {
    mintAuthority,
    freezeAuthority,
    isSPLStandard,
    isToken2022,
    topHolderPct,
    holderCount,
    liquidityUsd,
    volumeUsd24h,
    priceUsd,
    marketCap,
    hasMetadata,
    isPumpFun,
    creatorHoldsHigh,
  };

  return { score, grade, factors, warnings, info, recommendation };
}

export function gradeColor(grade: RiskResult['grade']): string {
  switch (grade) {
    case 'A': return 'text-green-400';
    case 'B': return 'text-lime-400';
    case 'C': return 'text-yellow-400';
    case 'D': return 'text-orange-400';
    case 'F': return 'text-red-400';
  }
}

export function gradeBgColor(grade: RiskResult['grade']): string {
  switch (grade) {
    case 'A': return 'bg-green-500/20 border-green-500/30';
    case 'B': return 'bg-lime-500/20 border-lime-500/30';
    case 'C': return 'bg-yellow-500/20 border-yellow-500/30';
    case 'D': return 'bg-orange-500/20 border-orange-500/30';
    case 'F': return 'bg-red-500/20 border-red-500/30';
  }
}
