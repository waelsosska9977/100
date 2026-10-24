// Vercel Serverless Function: GET /api/telegram/status
const DEFAULT_BOT_TOKEN = '8518568855:AAFnvXPAZ39OjsxIXyIlyfZQN_jgV1u7sS0';
const DEFAULT_CHAT_ID = '1076270331';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(_req: any, res: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || DEFAULT_CHAT_ID;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await response.json();
    if (data && data.ok) {
      return res.status(200).json({
        ok: true,
        botName: data.result?.first_name || 'SOSSKA1 Bot',
        botUsername: data.result?.username || '',
        chatId,
      });
    }
    return res.status(200).json({
      ok: false,
      chatId,
      error: data?.description || 'Unable to verify bot',
    });
  } catch (err) {
    return res.status(200).json({
      ok: false,
      chatId,
      error: err instanceof Error ? err.message : 'Network error',
    });
  }
}
