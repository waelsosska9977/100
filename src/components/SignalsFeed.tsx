import React, { useState } from 'react';
import { SignalItem } from '../types';
import { telegramService } from '../services/telegramService';
import {
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Clock,
  ShieldCheck,
  Send,
  Check,
  Radio,
} from 'lucide-react';

interface SignalsFeedProps {
  signals: SignalItem[];
  onLoadSignal: (signal: SignalItem) => void;
  autoTelegramEnabled: boolean;
  onToggleAutoTelegram: () => void;
}

export const SignalsFeed: React.FC<SignalsFeedProps> = ({
  signals,
  onLoadSignal,
  autoTelegramEnabled,
  onToggleAutoTelegram,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'LONG' | 'SHORT'>('ALL');
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentIds, setSentIds] = useState<Record<string, boolean>>({});

  const filteredSignals = signals.filter((s) => {
    if (filter === 'ALL') return true;
    return s.type === filter;
  });

  const formatPrice = (p: number) => {
    if (p < 0.0001) return p.toFixed(7);
    if (p < 0.01) return p.toFixed(5);
    if (p < 1) return p.toFixed(4);
    if (p < 50) return p.toFixed(3);
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatTime = (ts: number) => {
    return new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
      timeZone: 'Africa/Cairo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(ts));
  };

  const handleSendSignal = async (signal: SignalItem) => {
    if (sendingId) return;
    setSendingId(signal.id);
    const msg = telegramService.formatSignalForTelegram(signal);
    const res = await telegramService.sendMessage(msg);
    setSendingId(null);
    if (res.ok) {
      telegramService.markSignalSent(signal.id);
      setSentIds((prev) => ({ ...prev, [signal.id]: true }));
    }
  };

  return (
    <div className="bg-[#121a2b] border border-[#1f2d47] rounded-xl p-4 shadow-lg flex flex-col h-full">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-2.5 border-b border-[#1f2d47] pb-3 mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff7085] glow-rose" />
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>سجل التنبيهات الحية (100 عملة)</span>
                <span className="text-xs font-mono text-[#ff7085]">Signals Feed</span>
              </h2>
            </div>
          </div>

          {/* Auto-Send to Telegram Toggle */}
          <button
            onClick={onToggleAutoTelegram}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
              autoTelegramEnabled
                ? 'bg-[#2aabee]/20 border-[#2aabee] text-[#2aabee] glow-blue'
                : 'bg-[#0b1020] border-[#2e4166] text-slate-400 hover:text-white'
            }`}
            title="إرسال تلقائي لأي إشارة مؤسسية جديدة إلى بوت تليجرام"
          >
            <Radio size={13} className={autoTelegramEnabled ? 'animate-pulse text-[#2aabee]' : ''} />
            <span>{autoTelegramEnabled ? 'إرسال تلقائي لتليجرام: مفعل' : 'تفعيل الإرسال التلقائي لتليجرام'}</span>
          </button>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-400">
            فرص مقتنصة تلقائياً من مسح الـ 100 عملة
          </p>
          <div className="flex items-center gap-1 p-1 bg-[#0b1020] rounded-lg border border-[#1f2d47]">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                filter === 'ALL'
                  ? 'bg-[#18233a] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الكل ({signals.length})
            </button>
            <button
              onClick={() => setFilter('LONG')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-0.5 ${
                filter === 'LONG'
                  ? 'bg-[#31d0a0]/20 text-[#31d0a0] border border-[#31d0a0]/40'
                  : 'text-slate-400 hover:text-[#31d0a0]'
              }`}
            >
              <ArrowUpRight size={11} />
              شراء ({signals.filter((s) => s.type === 'LONG').length})
            </button>
            <button
              onClick={() => setFilter('SHORT')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-0.5 ${
                filter === 'SHORT'
                  ? 'bg-[#ff7085]/20 text-[#ff7085] border border-[#ff7085]/40'
                  : 'text-slate-400 hover:text-[#ff7085]'
              }`}
            >
              <ArrowDownRight size={11} />
              بيع ({signals.filter((s) => s.type === 'SHORT').length})
            </button>
          </div>
        </div>
      </div>

      {/* Signals List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[460px] pr-1">
        {filteredSignals.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            لا توجد إشارات نشطة تطابق التصفية حالياً. جاري مسح الـ 100 عملة...
          </div>
        ) : (
          filteredSignals.map((signal) => {
            const isLong = signal.type === 'LONG';
            const isSent = sentIds[signal.id] || telegramService.hasSentSignal(signal.id);
            const isSending = sendingId === signal.id;

            return (
              <div
                key={signal.id}
                className={`p-3 rounded-lg border transition-all hover:border-[#7da8ff]/60 bg-[#0f1626] ${
                  isLong ? 'border-[#31d0a0]/30' : 'border-[#ff7085]/30'
                }`}
              >
                {/* Top Row: Symbol, Type, Time */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">
                      {signal.displaySymbol}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        isLong
                          ? 'bg-[#31d0a0]/15 text-[#31d0a0] border border-[#31d0a0]/30 glow-emerald'
                          : 'bg-[#ff7085]/15 text-[#ff7085] border border-[#ff7085]/30 glow-rose'
                      }`}
                    >
                      {isLong ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {signal.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-[#18233a]">
                      {signal.timeframe}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Clock size={12} className="text-[#ffc66d]" />
                    <span>{formatTime(signal.timestamp)}</span>
                  </div>
                </div>

                {/* Reason Prose */}
                <div className="text-xs text-slate-300 mb-2 font-sans">
                  {signal.title}: <span className="text-slate-400">{signal.reason}</span>
                </div>

                {/* Metrics Badges: Volume Burst, Banker Flow & Crossover Move */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono mb-2.5">
                  <span className="px-2 py-0.5 rounded bg-[#18233a] border border-[#2e4166] text-[#7da8ff] flex items-center gap-1">
                    <ShieldCheck size={12} />
                    تدفق حيتان: {signal.bankerDominance.toFixed(0)}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#18233a] border border-[#2e4166] text-[#ffc66d] flex items-center gap-1">
                    <Zap size={12} />
                    فوليوم: {signal.volumeBurst}x Burst
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#18233a] border border-[#2e4166] text-slate-300">
                    MFI: {signal.mfiValue.toFixed(0)}
                  </span>
                  {signal.crossoverMove && (
                    <span
                      className={`px-2 py-0.5 rounded border font-sans font-bold ${
                        signal.crossoverMove.entryStatus === 'OPTIMAL'
                          ? 'bg-[#31d0a0]/15 text-[#31d0a0] border-[#31d0a0]/40'
                          : signal.crossoverMove.entryStatus === 'CONTINUATION'
                          ? 'bg-[#ffc66d]/15 text-[#ffc66d] border-[#ffc66d]/40'
                          : signal.crossoverMove.entryStatus === 'LATE'
                          ? 'bg-[#ff7085]/15 text-[#ff7085] border-[#ff7085]/40'
                          : 'bg-[#7da8ff]/15 text-[#7da8ff] border-[#7da8ff]/40'
                      }`}
                    >
                      📏 {signal.crossoverMove.atrMove.toFixed(1)} ATR (منذ {signal.crossoverMove.barsAgo} شمعة) · {signal.crossoverMove.entryStatusText}
                    </span>
                  )}
                </div>

                {/* Targets Grid */}
                <div className="grid grid-cols-4 gap-1.5 p-2 rounded bg-[#0b1020] border border-[#1f2d47] text-center font-mono text-[11px] mb-2.5">
                  <div>
                    <div className="text-[10px] text-slate-400 font-sans">دخول</div>
                    <div className="font-bold text-slate-200">${formatPrice(signal.entryPrice)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#ff7085] font-sans">وقف (1.8 ATR)</div>
                    <div className="font-bold text-[#ff7085]">${formatPrice(signal.sl)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#31d0a0] font-sans">هدف 1 (2.5 ATR)</div>
                    <div className="font-bold text-[#31d0a0]">${formatPrice(signal.tp1)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7da8ff] font-sans">هدف 2 (5.0 ATR)</div>
                    <div className="font-bold text-[#7da8ff]">${formatPrice(signal.tp2)}</div>
                  </div>
                </div>

                {/* Actions: Load into Calculator + Send to Telegram */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onLoadSignal(signal)}
                    className="py-1.5 px-2 rounded-lg bg-[#18233a] hover:bg-[#1f2d47] border border-[#2e4166] hover:border-[#7da8ff] text-slate-200 hover:text-[#7da8ff] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ArrowRightLeft size={13} />
                    <span>تعبئة بالحاسبة</span>
                  </button>

                  <button
                    onClick={() => handleSendSignal(signal)}
                    disabled={isSending}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isSent
                        ? 'bg-[#31d0a0]/20 border-[#31d0a0]/50 text-[#31d0a0]'
                        : 'bg-[#2aabee]/20 hover:bg-[#2aabee]/30 border-[#2aabee]/50 text-[#2aabee]'
                    }`}
                  >
                    {isSent ? <Check size={13} /> : <Send size={13} />}
                    <span>
                      {isSending
                        ? 'جاري الإرسال...'
                        : isSent
                        ? 'تم الإرسال لتليجرام'
                        : 'إرسال لتليجرام'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
