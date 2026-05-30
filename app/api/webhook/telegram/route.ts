// app/api/webhook/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleWebhookUpdate } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    await handleWebhookUpdate(update as unknown);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook endpoint active' });
}
