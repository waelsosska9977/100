import React, { useEffect, useState } from 'react';
import {
  RefreshCw,
  Volume2,
  VolumeX,
  BookOpen,
  Clock,
  Activity,
  ShieldCheck,
  Send,
  Check,
} from 'lucide-react';
import { soundService } from '../services/soundService';

interface HeaderProps {
  btcMacro: {
    status15m: 'BULLISH' | 'BEARISH';
    status1h: 'BULLISH' | 'BEARISH';
    price: number;
    ema100_15m: number;
    ema100_1h: number;
  };
  isLive: boolean;
  isRefreshing: boolean;
  countdown: number;
  onRefreshManual: () => void;
  onOpenJournal: () => void;
  onOpenGuide: () => void;
  journalCount: number;
  onSendPulseReportToTelegram: () => Promise<boolean>;
  telegramBotConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  btcMacro,
  isLive,
  isRefreshing,
  countdown,
  onRefreshManual,
  onOpenJournal,
  onOpenGuide,
  journalCount,
  onSendPulseReportToTelegram,
  telegramBotConnected,
}) => {
  const [cairoTime, setCairoTime] = useState<string>('');
  const [candle15mCountdown, setCandle15mCountdown] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundService.isEnabled());
  const [sendingReport, setSendingReport] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();

      const formattedCairo = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
        timeZone: 'Africa/Cairo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setCairoTime(formattedCairo);

      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const remMinutes = 14 - (minutes % 15);
      const remSeconds = 59 - seconds;
      const pad = (n: number) => n.toString().padStart(2, '0');
      setCandle15mCountdown(`${pad(remMinutes)}:${pad(remSeconds)}`);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const nextState = soundService.toggle();
    setSoundEnabled(nextState);
  };

  const handleSendReport = async () => {
    if (sendingReport) return;
    setSendingReport(true);
    const ok = await onSendPulseReportToTelegram();
    setSendingReport(false);
    if (ok) {
      setReportSent(true);
      setTimeout(() => setReportSent(false), 3000);
    }
  };

  const isBtc15mBull = btcMacro.status15m === 'BULLISH';
  const isBtc1hBull = btcMacro.status1h === 'BULLISH';

  return (
    <header className="sticky top-0 z-40 bg-[#0b1020]/95 backdrop-blur-md border-b border-[#1f2d47] px-4 lg:px-6 py-2.5">
      <div className="max-w-[1720px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
        {/* Zone 1: Brand & Terminal Title */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7da8ff]/20 to-[#31d0a0]/20 border border-[#7da8ff]/40 flex items-center justify-center text-[#7da8ff] font-mono font-bold text-base shadow-sm">
              S1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white font-mono">
                  SOSSKA1
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#18233a] text-[#7da8ff] border border-[#2e4166]">
                  100-COIN SCREENER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                ماسح الـ 100 عملة ومختبر السيولة المؤسسية المربوط بتليجرام
              </p>
            </div>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="flex lg:hidden items-center gap-1.5">
            <button
              onClick={handleSendReport}
              disabled={sendingReport}
              className="p-1.5 rounded bg-[#2aabee]/20 border border-[#2aabee]/50 text-[#2aabee]"
              title="إرسال ملخص السوق لتليجرام"
            >
              {reportSent ? <Check size={16} className="text-[#31d0a0]" /> : <Send size={16} />}
            </button>
            <button
              onClick={handleToggleSound}
              className="p-1.5 rounded bg-[#121a2b] border border-[#1f2d47] text-slate-300 hover:text-white"
              title="تفعيل/تعطيل الصوت"
            >
              {soundEnabled ? (
                <Volume2 size={16} className="text-[#31d0a0]" />
              ) : (
                <VolumeX size={16} className="text-slate-500" />
              )}
            </button>
            <button
              onClick={onRefreshManual}
              disabled={isRefreshing}
              className="p-1.5 rounded bg-[#121a2b] border border-[#1f2d47] text-slate-300 hover:text-[#7da8ff]"
              title="تحديث الأسعار"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-[#7da8ff]' : ''} />
            </button>
          </div>
        </div>

        {/* Zone 2: Market Pulse Telemetry & Cairo Clock */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono w-full lg:w-auto">
          {/* BTC Macro Trend Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#121a2b] border border-[#1f2d47]">
            <span className="text-slate-400 font-sans text-xs flex items-center gap-1">
              <Activity size={13} className="text-[#7da8ff]" />
              ماكرو BTC:
            </span>
            <div className="flex items-center gap-1">
              <span
                className={`inline-flex items-center gap-1 font-semibold text-[11px] px-1.5 py-0.5 rounded ${
                  isBtc15mBull
                    ? 'bg-[#31d0a0]/15 text-[#31d0a0] border border-[#31d0a0]/30'
                    : 'bg-[#ff7085]/15 text-[#ff7085] border border-[#ff7085]/30'
                }`}
              >
                15m {isBtc15mBull ? '▲' : '▼'}
              </span>
              <span
                className={`inline-flex items-center gap-1 font-semibold text-[11px] px-1.5 py-0.5 rounded ${
                  isBtc1hBull
                    ? 'bg-[#31d0a0]/15 text-[#31d0a0] border border-[#31d0a0]/30'
                    : 'bg-[#ff7085]/15 text-[#ff7085] border border-[#ff7085]/30'
                }`}
              >
                1h {isBtc1hBull ? '▲' : '▼'}
              </span>
            </div>
            <span className="text-slate-300 text-[11px] font-mono hidden md:inline">
              ${btcMacro.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Cairo Realtime Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#121a2b] border border-[#1f2d47]">
            <Clock size={13} className="text-[#ffc66d]" />
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 font-sans">القاهرة:</span>
              <span className="text-[#ffc66d] font-bold tracking-wider">{cairoTime || '--:--:--'}</span>
            </div>
          </div>

          {/* 15m Candle Closing Timer */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#121a2b] border border-[#1f2d47]">
            <span className="text-slate-400 font-sans text-[11px]">إغلاق 15m:</span>
            <span className="text-[#7da8ff] font-bold font-mono tracking-wider">
              {candle15mCountdown || '00:00'}
            </span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#121a2b] border border-[#1f2d47]">
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#31d0a0] animate-pulse' : 'bg-[#ffc66d]'}`} />
            <span className="text-slate-300 text-[11px]">100 Coins</span>
            <span className="text-[10px] text-slate-500 font-mono">({countdown}s)</span>
          </div>
        </div>

        {/* Zone 3: Actions & Telegram Report */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            onClick={handleSendReport}
            disabled={sendingReport}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#2aabee]/20 to-[#229ed9]/20 hover:from-[#2aabee]/30 hover:to-[#229ed9]/30 border border-[#2aabee]/50 text-[#2aabee] text-xs font-bold flex items-center gap-1.5 transition-all"
            title="إرسال تقرير المسح الشامل للـ 100 عملة إلى تليجرام الآن"
          >
            {reportSent ? <Check size={14} className="text-[#31d0a0]" /> : <Send size={14} />}
            <span>
              {sendingReport
                ? 'يرسل لتليجرام...'
                : reportSent
                ? 'تم إرسال التقرير!'
                : 'تقرير تليجرام (100 عملة)'}
            </span>
            {telegramBotConnected && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#31d0a0]" title="بوت تليجرام متصل" />
            )}
          </button>

          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium ${
              soundEnabled
                ? 'bg-[#121a2b] border-[#31d0a0]/40 text-[#31d0a0]'
                : 'bg-[#121a2b] border-[#1f2d47] text-slate-400 hover:text-slate-200'
            }`}
            title="تفعيل أو كتم تنبيهات الفرص المؤسسية"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          <button
            onClick={onRefreshManual}
            disabled={isRefreshing}
            className="px-2.5 py-2 rounded-lg bg-[#121a2b] border border-[#1f2d47] hover:border-[#7da8ff]/50 text-slate-200 hover:text-[#7da8ff] text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
            title="تحديث البيانات الفورية"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-[#7da8ff]' : ''} />
            <span>تحديث</span>
          </button>

          <button
            onClick={onOpenJournal}
            className="px-2.5 py-2 rounded-lg bg-[#121a2b] border border-[#1f2d47] hover:border-[#7da8ff]/50 text-slate-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck size={14} className="text-[#7da8ff]" />
            <span>السجل</span>
            {journalCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#7da8ff]/20 text-[#7da8ff] text-[10px] font-mono">
                {journalCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenGuide}
            className="px-2.5 py-2 rounded-lg bg-[#7da8ff]/15 border border-[#7da8ff]/40 hover:bg-[#7da8ff]/25 text-[#7da8ff] text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <BookOpen size={14} />
            <span>الدليل</span>
          </button>
        </div>
      </div>
    </header>
  );
};
