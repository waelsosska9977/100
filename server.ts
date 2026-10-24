import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Configured Telegram Credentials (from environment or user-provided defaults)
const DEFAULT_BOT_TOKEN = '8518568855:AAFnvXPAZ39OjsxIXyIlyfZQN_jgV1u7sS0';
const DEFAULT_CHAT_ID = '1076270331';

const getTelegramConfig = () => {
  return {
    botToken: process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN,
    chatId: process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID,
  };
};

// GET /api/telegram/status - Check bot status
app.get('/api/telegram/status', async (_req, res) => {
  const { botToken, chatId } = getTelegramConfig();
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await response.json();
    if (data && data.ok) {
      return res.json({
        ok: true,
        botName: data.result?.first_name || 'SOSSKA1 Bot',
        botUsername: data.result?.username || '',
        chatId,
      });
    }
    return res.json({
      ok: false,
      chatId,
      error: data?.description || 'Unable to verify bot',
    });
  } catch (err) {
    return res.json({
      ok: false,
      chatId,
      error: err instanceof Error ? err.message : 'Network error',
    });
  }
});

// POST /api/telegram/send - Send formatted message to Telegram
app.post('/api/telegram/send', async (req, res) => {
  const { message, parseMode = 'HTML' } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ ok: false, error: 'Missing message content' });
  }

  const { botToken, chatId } = getTelegramConfig();

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
      return res.json({
        ok: true,
        messageId: data.result?.message_id,
        chatId,
      });
    } else {
      return res.status(400).json({
        ok: false,
        error: data?.description || 'Telegram API rejected the message',
      });
    }
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Failed to connect to Telegram API',
    });
  }
});

// GET /api/binance/tickers - Server-side proxy for Binance 24hr tickers
let cachedTickers: unknown[] | null = null;
let lastCacheTime = 0;

app.get('/api/binance/tickers', async (_req, res) => {
  const now = Date.now();
  if (cachedTickers && now - lastCacheTime < 5000) {
    return res.json({ ok: true, source: 'cache', data: cachedTickers });
  }

  const endpoints = [
    'https://data-api.binance.vision/api/v3/ticker/24hr',
    'https://api.binance.com/api/v3/ticker/24hr',
    'https://api1.binance.com/api/v3/ticker/24hr',
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json)) {
          cachedTickers = json;
          lastCacheTime = Date.now();
          return res.json({ ok: true, source: url, data: json });
        }
      }
    } catch {
      // try next endpoint
    }
  }

  return res.status(502).json({ ok: false, error: 'All Binance endpoints unreachable' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SOSSKA1 Institutional Lab Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
