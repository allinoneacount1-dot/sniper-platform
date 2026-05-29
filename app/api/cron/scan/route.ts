// app/api/cron/scan/route.ts
import { NextResponse } from 'next/server';
import { runTokenScanner } from '@/cron/scanner';

export const dynamic = 'force-dynamic';

// Verify cron secret
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: Request) {
  // Verify authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await runTokenScanner();
    return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Scan failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'cron-scan' });
}
