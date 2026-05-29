import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
  if (!HELIUS_API_KEY) {
    return NextResponse.json({ balance: 0 });
  }

  try {
    const res = await fetch("https://mainnet.helius-rpc.com/?api-key=" + HELIUS_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '1',
        method: 'getBalance',
        params: [address],
      }),
    });

    const data = await res.json();
    if (data.result !== undefined) {
      return NextResponse.json({ balance: data.result / 1e9 });
    }
    return NextResponse.json({ balance: 0 });
  } catch {
    return NextResponse.json({ balance: 0 });
  }
}
