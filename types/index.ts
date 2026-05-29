// types/index.ts
export interface TokenData {
  mint: string;
  symbol: string | null;
  name: string | null;
  decimals?: number;
  price: number;
  market_cap?: number;
  volume24hr: number;
  price_change_percent?: number;
  liquidity: number;
  holders?: number;
  isPumpFun: boolean;
  risk?: number;
  grade?: string;
  warnings?: number;
  bonding_curve?: string;
  creator?: string;
  created_timestamp?: number;
}

export interface RiskResult {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: {
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
  };
  warnings: string[];
  info: string[];
  recommendation: string;
  gradeColor?: string;
  gradeBg?: string;
}

export interface TokenCacheRow {
  mintAddress: string;
  symbol: string | null;
  name: string | null;
  riskScore: number;
  topHolderPct: number | null;
  liquidityUsd: number;
  volumeUsd24h: number;
  priceUsd: number | null;
  marketCap: number | null;
  isPumpFun: boolean;
  createdAt: string;
  updatedAt: string;
}
