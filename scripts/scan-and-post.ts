/**
 * Standalone scanner — Hermes cron job
 */
const HELIUS_API_KEY = "804ae9c7-3766-4d59-b93a-65ab76be19a6";

async function main() {
  try {
    const res = await fetch(`https://api.helius.xyz/v0/tokens/trending?api-key=${HELIUS_API_KEY}`);
    const data = await res.json();
    const output = {
      timestamp: new Date().toISOString(),
      trending: data?.slice(0, 10).map((t: any) => ({
        mint: t.mint || t.address,
        symbol: t.symbol,
        name: t.name,
        price: t.price,
        change24h: t.priceChange24h,
        volume24h: t.volume24h,
        liquidity: t.liquidity,
      }))
    };
    console.log(JSON.stringify(output));
  } catch (err: any) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}
main();
