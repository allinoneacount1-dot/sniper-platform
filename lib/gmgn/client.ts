// lib/gmgn/client.ts
const GMGN_BASE = 'https://gmgn.ai/defi/quotation/v1';

const headers = {
  'Authorization': `Bearer ${process.env.GMGN_API_KEY}`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Referer': 'https://gmgn.ai',
  'Origin': 'https://gmgn.ai',
  'Accept': 'application/json',
};

export interface GmgnToken {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  market_cap: number;
  volume24hr: number;
  price_change_percent: number;
  liquidity: number;
  holders: number;
  created_timestamp?: number;
  pool_address?: string;
  bonding_curve?: string;
  creator?: string;
  top_holder_pct?: number;
}

export async function getNewTokens(limit: number = 50): Promise<GmgnToken[]> {
  const res = await fetch(
    `${GMGN_BASE}/tokens/sol/new?limit=${limit}&orderby=created_timestamp&direction=desc`,
    { headers }
  );
  const data = await res.json();
  return (data.data || []).map(normalizeToken);
}

export async function getPumpFunTokens(limit: number = 50): Promise<GmgnToken[]> {
  const res = await fetch(
    `${GMGN_BASE}/tokens/sol/pump?limit=${limit}&orderby=volume24hr&direction=desc`,
    { headers }
  );
  const data = await res.json();
  return (data.data || []).map(normalizeToken);
}

export async function getTokenInfo(mintAddress: string): Promise<GmgnToken | null> {
  try {
    const res = await fetch(`${GMGN_BASE}/tokens/sol/${mintAddress}`, { headers });
    const data = await res.json();
    return data.data ? normalizeToken(data.data) : null;
  } catch {
    return null;
  }
}

export async function getTokenTrades(mintAddress: string, limit: number = 20): Promise<any[]> {
  try {
    const res = await fetch(
      `${GMGN_BASE}/tokens/sol/${mintAddress}/trades?limit=${limit}`,
      { headers }
    );
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

function normalizeToken(t: any): GmgnToken {
  return {
    mint: t.mint || t.address || t.token_address,
    symbol: t.symbol || t.token_symbol || null,
    name: t.name || t.token_name || null,
    decimals: t.decimals ?? 6,
    price: parseFloat(t.price || t.current_price || '0'),
    market_cap: parseFloat(t.market_cap || t.usd_market_cap || '0'),
    volume24hr: parseFloat(t.volume24hr || t.volume_24h || '0'),
    price_change_percent: parseFloat(t.price_change_percent || t.price_change_24h || '0'),
    liquidity: parseFloat(t.liquidity || '0'),
    holders: parseInt(t.holders || t.holder_count || '0'),
    created_timestamp: t.created_timestamp,
    pool_address: t.pool_address,
    bonding_curve: t.bonding_curve,
    creator: t.creator,
    top_holder_pct: t.top_holder_pct ? parseFloat(t.top_holder_pct) : undefined,
  };
}
