/**
 * Standalone scanner — Hermes cron job
 * Uses DexScreener API for trending Solana tokens
 */

interface DexToken {
  tokenAddress: string;
}

interface DexPair {
  baseToken?: {
    address: string;
    symbol: string;
    name: string;
  };
  priceUsd?: string;
  priceChange?: { h24?: number };
  volume?: { h24?: string | number };
  liquidity?: { usd?: string | number };
  marketCap?: number;
  chainId?: string;
  url?: string;
}

interface TrendingToken {
  mint: string | undefined;
  symbol: string | undefined;
  name: string | undefined;
  price: number;
  priceFormatted: string | undefined;
  change24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  chain: string | undefined;
  url: string | undefined;
}

async function main() {
  try {
    // Fetch boosted/trending tokens from DexScreener
    const boostRes = await fetch("https://api.dexscreener.com/token-boosts/latest/v1", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const boosts = await boostRes.json();

    if (!Array.isArray(boosts) || boosts.length === 0) {
      console.log(JSON.stringify({ timestamp: new Date().toISOString(), trending: [], error: "No trending tokens found" }));
      return;
    }

    // Get unique token addresses (top 10)
    const seen = new Set<string>();
    const addresses: string[] = [];
    for (const b of boosts as DexToken[]) {
      if (!seen.has(b.tokenAddress)) {
        seen.add(b.tokenAddress);
        addresses.push(b.tokenAddress);
      }
      if (addresses.length >= 10) break;
    }

    // Fetch pair data
    const pairsRes = await fetch(
      `https://api.dexscreener.com/tokens/v1/solana/${addresses.join(",")}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const pairsData = await pairsRes.json();

    let trending: TrendingToken[] = [];
    if (Array.isArray(pairsData)) {
      // Sort by volume 24h descending
      const sorted = pairsData.sort((a: DexPair, b: DexPair) =>
        (Number(b?.volume?.h24) || 0) - (Number(a?.volume?.h24) || 0)
      );
      trending = sorted.slice(0, 10).map((p: DexPair) => ({
        mint: p.baseToken?.address,
        symbol: p.baseToken?.symbol,
        name: p.baseToken?.name,
        price: Number(p.priceUsd) || 0,
        priceFormatted: p.priceUsd,
        change24h: p.priceChange?.h24 || 0,
        volume24h: Number(p.volume?.h24) || 0,
        liquidity: Number(p.liquidity?.usd) || 0,
        marketCap: p.marketCap || 0,
        chain: p.chainId,
        url: p.url,
      }));
    }

    const output = {
      timestamp: new Date().toISOString(),
      trending,
    };
    console.log(JSON.stringify(output));
  } catch (err: unknown) {
    console.error("ERROR:", (err as Error).message);
    process.exit(1);
  }
}
main();
