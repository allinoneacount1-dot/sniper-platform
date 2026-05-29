// lib/dexscreener/client.ts
const DEXSCREENER_BASE = 'https://api.dexscreener.com';

export interface DexPair {
  chainId: string;
  dexId: string;
  pairAddress: string;
  url: string;
  quoteToken: { address: string; symbol: string };
  priceUsd: string;
  liquidity: { usd: number };
  volume: { h24: number };
  priceChange: { h24: number };
  marketCap: number;
  fdv: number;
  info?: { imageUrl?: string };
  baseToken: { address: string; name: string; symbol: string };
  createdAt?: number;
}

export interface BoostedToken {
  chainId: string;
  tokenAddress: string;
  description: string;
  icon: string;
}

export interface TokenProfile {
  chainId: string;
  tokenAddress: string;
  icon: string;
  header: string;
  cto: boolean;
}

// Fetch boosted tokens from DexScreener
export async function getBoostedTokens(): Promise<BoostedToken[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/token-boosts/latest/v1`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((t: unknown) => t.chainId === 'solana')
      .map((t: unknown) => ({
        chainId: t.chainId,
        tokenAddress: t.tokenAddress,
        description: t.description || '',
        icon: t.icon || '',
      }));
  } catch {
    return [];
  }
}

// Fetch token profiles (new tokens)
export async function getTokenProfiles(): Promise<TokenProfile[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/token-profiles/latest/v1`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((t: unknown) => t.chainId === 'solana')
      .map((t: unknown) => ({
        chainId: t.chainId,
        tokenAddress: t.tokenAddress,
        icon: t.icon || '',
        header: t.header || '',
        cto: t.cto || false,
      }));
  } catch {
    return [];
  }
}

// Get token pairs by mint address
export async function getTokenPairs(mintAddress: string): Promise<DexPair[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/tokens/${mintAddress}`);
    const data = await res.json();
    if (data?.pairs && Array.isArray(data.pairs)) {
      return data.pairs.filter((p: DexPair) => p.chainId === 'solana');
    }
    return [];
  } catch {
    return [];
  }
}

// Get multiple token pairs at once
export async function getMultipleTokenPairs(addresses: string[]): Promise<DexPair[]> {
  const results = await Promise.all(
    addresses.slice(0, 15).map(addr => getTokenPairs(addr))
  );
  return results.filter(pairs => pairs.length > 0).map(pairs => pairs[0]);
}

// Search tokens by keyword
export async function searchTokens(query: string): Promise<DexPair[]> {
  try {
    const res = await fetch(`${DEXSCREENER_BASE}/latest/dex/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data?.pairs && Array.isArray(data.pairs)) {
      return data.pairs.filter((p: DexPair) => p.chainId === 'solana');
    }
    return [];
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
    marketCap: pair.marketCap || pair.fdv || 0,
    pairAddress: pair.pairAddress,
    dexId: pair.dexId,
    imageUrl: pair.info?.imageUrl,
    url: pair.url,
    createdAt: pair.createdAt,
  };
}
