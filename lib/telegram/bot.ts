// lib/telegram/bot.ts
import { prisma } from '@/lib/db/prisma';
import { analyzeRisk } from '@/lib/risk/engine';

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function sendTelegramMessage(chatId: string, text: string, options?: unknown) {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_preview: true,
      ...options,
    }),
  });
  return res.json();
}

export async function handleWebhookUpdate(update: unknown) {
  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id.toString();
  const text = message.text || '';

  // Handle commands
  if (text.startsWith('/start')) {
    await sendTelegramMessage(chatId,
      `🔍 <b>Sniper Platform Bot</b>\n\n` +
      `Commands:\n` +
      `/scan &lt;mint&gt; — Scan a token\n` +
      `/new — Show new tokens\n` +
      `/pump — Show pump.fun tokens\n` +
      `/alerts — Manage alerts\n` +
      `/help — Show help`
    );
    return;
  }

  if (text.startsWith('/scan ')) {
    const mint = text.replace('/scan ', '').trim();
    if (!mint || mint.length < 30) {
      await sendTelegramMessage(chatId, '❌ Invalid mint address');
      return;
    }

    await sendTelegramMessage(chatId, '🔍 Scanning token...');

    try {
      const risk = await analyzeRisk(mint);
      const gradeEmoji = {
        A: '🟢', B: '🟢', C: '🟡', D: '🟠', F: '🔴',
      }[risk.grade];

      let msg = `${gradeEmoji} <b>Risk Score: ${risk.score}/100 (Grade ${risk.grade})</b>\n\n`;

      if (risk.warnings.length > 0) {
        msg += `⚠️ <b>Warnings:</b>\n`;
        risk.warnings.slice(0, 5).forEach(w => {
          msg += `• ${w}\n`;
        });
        msg += '\n';
      }

      msg += `💰 Liquidity: $${risk.factors.liquidityUsd.toLocaleString()}\n`;
      msg += `📊 Volume 24h: $${risk.factors.volumeUsd24h.toLocaleString()}\n`;
      msg += `👥 Holders: ${risk.factors.holderCount}\n`;
      msg += `🐋 Top Holder: ${risk.factors.topHolderPct.toFixed(1)}%\n\n`;
      msg += `💡 ${risk.recommendation}\n\n`;
      msg += `🔗 <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${mint}">View on Dashboard</a>`;

      await sendTelegramMessage(chatId, msg);
    } catch (error: unknown) {
      await sendTelegramMessage(chatId, `❌ Scan failed: ${error.message}`);
    }
    return;
  }

  if (text.startsWith('/new')) {
    const tokens = await prisma.tokenCache.findMany({
      where: { isPumpFun: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (tokens.length === 0) {
      await sendTelegramMessage(chatId, 'No new tokens found.');
      return;
    }

    let msg = '🆕 <b>New Tokens</b>\n\n';
    tokens.forEach((t, i) => {
      const grade = t.riskScore >= 80 ? 'A' : t.riskScore >= 60 ? 'B' : t.riskScore >= 40 ? 'C' : t.riskScore >= 20 ? 'D' : 'F';
      msg += `${i + 1}. ${t.symbol || '?'} — Grade ${grade} (${t.riskScore}/100)\n`;
    });

    await sendTelegramMessage(chatId, msg);
    return;
  }

  if (text.startsWith('/help')) {
    await sendTelegramMessage(chatId,
      `<b>Sniper Platform Bot</b>\n\n` +
      `This bot provides real-time token risk screening on Solana.\n\n` +
      `<b>Commands:</b>\n` +
      `/scan &lt;mint_address&gt; — Get risk analysis for a token\n` +
      `/new — List newest tokens\n` +
      `/pump — List pump.fun tokens\n` +
      `/alerts — Set up alerts\n` +
      `/status — System status\n\n` +
      `<b>Links:</b>\n` +
      `🌐 Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}\n` +
      `📱 @DexMultichain`
    );
    return;
  }

  // Default: try to scan as mint address
  if (text.length >= 30 && text.length <= 50) {
    await handleWebhookUpdate({
      message: { ...message, text: `/scan ${text}` },
    });
    return;
  }

  await sendTelegramMessage(chatId, 'Unknown command. Type /help for available commands.');
}

export async function setWebhook(url: string) {
  const res = await fetch(`${TELEGRAM_API}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  return res.json();
}
