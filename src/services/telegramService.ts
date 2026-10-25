import { MarketTicker, SignalItem } from '../types';

export interface TelegramStatus {
  ok: boolean;
  botName?: string;
  botUsername?: string;
  chatId?: string;
  error?: string;
}

export interface TelegramSendResponse {
  ok: boolean;
  messageId?: number;
  chatId?: string;
  error?: string;
}

const SENT_SIGNALS_STORAGE_KEY = 'sosska_telegram_sent_signals';
const FALLBACK_BOT_TOKEN =
  (import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string | undefined) ||
  '8518568855:AAFnvXPAZ39OjsxIXyIlyfZQN_jgV1u7sS0';
const FALLBACK_CHAT_ID =
  (import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined) || '1076270331';

class TelegramService {
  private sentSignalIds: Set<string> = new Set();

  constructor() {
    try {
      const saved = localStorage.getItem(SENT_SIGNALS_STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) {
          this.sentSignalIds = new Set(arr.slice(-200));
        }
      }
    } catch {
      // ignore
    }
  }

  private saveSentIds() {
    try {
      const arr = Array.from(this.sentSignalIds).slice(-200);
      localStorage.setItem(SENT_SIGNALS_STORAGE_KEY, JSON.stringify(arr));
    } catch {
      // ignore
    }
  }

  public hasSentSignal(signalId: string): boolean {
    return this.sentSignalIds.has(signalId);
  }

  public markSignalSent(signalId: string) {
    this.sentSignalIds.add(signalId);
    this.saveSentIds();
  }

  public async checkStatus(): Promise<TelegramStatus> {
    // 1. Try Server / Vercel Serverless route (/api/telegram/status)
    try {
      const res = await fetch('/api/telegram/status');
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.ok) return data;
      }
    } catch {
      // fallback to direct Telegram API check
    }

    // 2. Direct Fallback for static hosting / Vercel edge
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${FALLBACK_BOT_TOKEN}/getMe`);
      const data = await tgRes.json();
      if (data && data.ok) {
        return {
          ok: true,
          botName: data.result?.first_name || 'SOSSKA1 Bot',
          botUsername: data.result?.username || '',
          chatId: FALLBACK_CHAT_ID,
        };
      }
      return {
        ok: false,
        chatId: FALLBACK_CHAT_ID,
        error: data?.description || 'Unable to verify bot',
      };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Unable to reach Telegram API',
      };
    }
  }

  public async sendMessage(message: string): Promise<TelegramSendResponse> {
    // 1. Try Server / Vercel Serverless route (/api/telegram/send)
    try {
      const res = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, parseMode: 'HTML' }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.ok) return data;
      }
    } catch {
      // fallback to direct call
    }

    // 2. Direct Fallback to Telegram Bot API (CORS supported by api.telegram.org)
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${FALLBACK_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: FALLBACK_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      const data = await tgRes.json();
      if (data && data.ok) {
        return {
          ok: true,
          messageId: data.result?.message_id,
          chatId: FALLBACK_CHAT_ID,
        };
      }
      return {
        ok: false,
        error: data?.description || 'Telegram API error',
      };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Network error while sending to Telegram',
      };
    }
  }

  public formatSignalForTelegram(signal: SignalItem): string {
    const isLong = signal.type === 'LONG';
    const dirEmoji = isLong ? '🟢 LONG (شراء مؤسسي)' : '🔴 SHORT (بيع / تصريف)';
    const formatPrice = (p: number) => {
      if (p < 0.0001) return p.toFixed(7);
      if (p < 0.01) return p.toFixed(5);
      if (p < 1) return p.toFixed(4);
      if (p < 50) return p.toFixed(3);
      return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const cairoTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(signal.timestamp));

    const slDist = (Math.abs(signal.entryPrice - signal.sl) / signal.entryPrice) * 100;
    const tp1Dist = (Math.abs(signal.tp1 - signal.entryPrice) / signal.entryPrice) * 100;
    const tp2Dist = (Math.abs(signal.tp2 - signal.entryPrice) / signal.entryPrice) * 100;

    const formatPointsMove = (pts: number) => {
      const sign = pts >= 0 ? '+' : '';
      const abs = Math.abs(pts);
      const formatted =
        abs < 0.0001
          ? pts.toFixed(7)
          : abs < 0.01
          ? pts.toFixed(5)
          : abs < 1
          ? pts.toFixed(4)
          : abs < 50
          ? pts.toFixed(3)
          : pts.toFixed(2);
      return `${sign}${formatted}$`;
    };

    const crossMoveLine = signal.crossoverMove
      ? `📏 <b>الحركة منذ التقاطع:</b> <code>${formatPointsMove(signal.crossoverMove.pointsMove)} (${signal.crossoverMove.pctMove >= 0 ? '+' : ''}${signal.crossoverMove.pctMove.toFixed(2)}%) | ${signal.crossoverMove.atrMove.toFixed(2)} ATR (منذ ${signal.crossoverMove.barsAgo} شمعة)</code> — <b>${signal.crossoverMove.entryStatusText}</b>`
      : null;

    return [
      `🚨 <b>تنبيه إشارة مؤسسية حية - SOSSKA1 Lab</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💎 <b>العملة:</b> <code>${signal.displaySymbol}</code>`,
      `📌 <b>الاتجاه:</b> ${dirEmoji}`,
      `⏱ <b>الفريم:</b> <code>${signal.timeframe}</code> | <b>التوقيت:</b> <code>${cairoTime} Cairo</code>`,
      `💡 <b>السبب الفني:</b> ${signal.title} — ${signal.reason}`,
      ...(crossMoveLine ? [crossMoveLine] : []),
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📥 <b>سعر الدخول (Entry):</b> <code>${formatPrice(signal.entryPrice)} USDT</code>`,
      `🛑 <b>وقف الخسارة (SL - 1.8 ATR):</b> <code>${formatPrice(signal.sl)} USDT</code> (-${slDist.toFixed(2)}%)`,
      `🎯 <b>الهدف الأول (TP1 - 2.5 ATR):</b> <code>${formatPrice(signal.tp1)} USDT</code> (+${tp1Dist.toFixed(2)}%)`,
      `🚀 <b>الهدف الثاني (TP2 - 5.0 ATR):</b> <code>${formatPrice(signal.tp2)} USDT</code> (+${tp2Dist.toFixed(2)}%)`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏦 <b>هيمنة الحيتان (MCDX+):</b> <code>${signal.bankerDominance.toFixed(1)}% Banker Flow</code>`,
      `🌊 <b>تدفق السيولة (MFI):</b> <code>${signal.mfiValue.toFixed(1)}</code>`,
      `⚡ <b>انفجار الفوليوم:</b> <code>${signal.volumeBurst.toFixed(1)}x Volume Burst</code>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🤖 <i>SOSSKA1 100-Coin Institutional Screener</i>`,
    ].join('\n');
  }

  public formatMarketPulseSummary(
    tickers: MarketTicker[],
    btcMacro: { status15m: string; status1h: string; price: number },
    topSignals: SignalItem[]
  ): string {
    const bull3 = tickers.filter((t) => t.alignmentScore === 3).length;
    const bear0 = tickers.filter((t) => t.alignmentScore === 0).length;
    const whaleAcc = tickers.filter((t) => t.mfi < 25).length;
    const instDist = tickers.filter((t) => t.mfi > 75).length;
    const highBanker = [...tickers].sort((a, b) => b.mcdx.banker - a.mcdx.banker).slice(0, 5);

    const cairoTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());

    const lines = [
      `📊 <b>تقرير المسح المؤسسي الشامل (100 عملة) - SOSSKA1</b>`,
      `⏰ <b>توقيت القاهرة:</b> <code>${cairoTime}</code>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `👑 <b>ماكرو البيتكوين (BTC):</b> <code>$${btcMacro.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}</code>`,
      `• فريم 15m: <b>${btcMacro.status15m === 'BULLISH' ? '🟢 صاعد (Bullish)' : '🔴 هابط (Bearish)'}</b>`,
      `• فريم 1h: <b>${btcMacro.status1h === 'BULLISH' ? '🟢 صاعد (Bullish)' : '🔴 هابط (Bearish)'}</b>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📈 <b>إحصائيات مسح الـ ${tickers.length} عملة:</b>`,
      `• توافق صاعد كامل (3/3 EMA50): <code>${bull3} عملة</code>`,
      `• توافق هابط كامل (0/3 EMA50): <code>${bear0} عملة</code>`,
      `• مناطق تجميع حيتان (MFI &lt; 25): <code>${whaleAcc} عملة</code>`,
      `• مناطق تصريف مؤسسي (MFI &gt; 75): <code>${instDist} عملة</code>`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏦 <b>أعلى 5 عملات في تدفق الحيتان (MCDX+ Banker):</b>`,
      ...highBanker.map(
        (t, idx) =>
          `${idx + 1}. <code>${t.displaySymbol}</code> — <b>${t.mcdx.banker.toFixed(1)}%</b> ($${t.lastPrice < 1 ? t.lastPrice.toFixed(4) : t.lastPrice.toFixed(2)})`
      ),
    ];

    if (topSignals.length > 0) {
      lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
      lines.push(`🎯 <b>أبرز الإشارات النشطة حالياً:</b>`);
      for (const s of topSignals.slice(0, 3)) {
        lines.push(
          `• <code>${s.displaySymbol}</code> [${s.type === 'LONG' ? '🟢 LONG' : '🔴 SHORT'}] — Entry: <code>$${s.entryPrice < 1 ? s.entryPrice.toFixed(4) : s.entryPrice.toFixed(2)}</code> | Vol: <code>${s.volumeBurst}x</code>`
        );
      }
    }

    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
    lines.push(`🤖 <i>SOSSKA1 Institutional Screener & Opportunity Lab</i>`);

    return lines.join('\n');
  }
}

export const telegramService = new TelegramService();
