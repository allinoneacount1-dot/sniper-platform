// lib/dexscreener/client.ts
const DEXSCREENER_BASE = 'https://api.dexscreener.com';

export interface DexPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  quoteToken: { address: string; symbol: string };
  priceUsd: string;
  liquidity: { usd: number };
  volume: { h24: number };
  priceChange: { h24: number };
  marketCap: number;
  info?: { imageUrl?: string };
  baseToken: { address: string; name: string; symbol: string };
}

export interface TrendingToken {
  address: string;
  symbol: string;
  name: string;
  priceUsd: string;
  liquidityUsd: number;
  volume24h: number;
  change24h: number;
  chainId: string;
}

// Search tokens by keyword
export async function searchTokens(query: string): Promise<DexPair[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=${encodeURIComponent(query)}`);
    const pairs = await res.json();
    return (pairs?.pairs || []).filter((p: DexPair) => p.chainId === 'solana');
  } catch {
    return [];
  }
}

// Get token pairs by mint address
export async function getTokenPairs(mintAddress: string): Promise<DexPair[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/tokens/${mintAddress}`);
    return res.json() || [];
  } catch {
    return [];
  }
}

// Convert DexPair to our TokenData format
export function toTokenData(pair: DexPair) {
  return {
    mint: pair.baseToken.address,
    symbol: pair.baseToken.symbol,
    name: pair.baseToken.name,
    price: parseFloat(pair.priceUsd || '0'),
    liquidity: pair.liquidity?.usd || 0,
    volume24h: pair.volume?.h24 || 0,
    change24h: pair.priceChange?.h24 || 0,
    marketCap: pair.marketCap || 0,
    pairAddress: pair.pairAddress,
    dexId: pair.dexId,
    imageUrl: pair.info?.imageUrl,
  };
}
