// Vercel Serverless Function: POST /api/telegram/send
const DEFAULT_BOT_TOKEN = '8518568855:AAFnvXPAZ39OjsxIXyIlyfZQN_jgV1u7sS0';
const DEFAULT_CHAT_ID = '1076270331';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  let body: Record<string, unknown> = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    body = {};
  }

  const message = body.message;
  const parseMode = typeof body.parseMode === 'string' ? body.parseMode : 'HTML';

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ ok: false, error: 'Missing message content' });
  }

  const botToken =
    process.env.TELEGRAM_BOT_TOKEN ||
    process.env.VITE_TELEGRAM_BOT_TOKEN ||
    DEFAULT_BOT_TOKEN;
  const chatId =
    process.env.TELEGRAM_CHAT_ID ||
    process.env.VITE_TELEGRAM_CHAT_ID ||
    DEFAULT_CHAT_ID;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    });

    const data = await tgRes.json();
    if (data && data.ok) {
      return res.status(200).json({
        ok: true,
        messageId: data.result?.message_id,
        chatId,
      });
    }
    return res.status(400).json({
      ok: false,
      error: data?.description || 'Telegram API rejected the message',
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Failed to connect to Telegram API',
    });
  }
}

