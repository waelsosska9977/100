import React, { useState, useEffect, useMemo } from 'react';
import { CalculatorResult, CalculatorState, MarketTicker, SavedTrade, SignalType } from '../types';
import { formatTelegramSignal } from '../utils/telegramFormatter';
import { telegramService } from '../services/telegramService';
import {
  Send,
  Copy,
  BookmarkPlus,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  AlertCircle,
} from 'lucide-react';

interface OpportunityCalculatorProps {
  selectedTicker: MarketTicker | null;
  onSaveTrade: (trade: SavedTrade) => void;
}

export const OpportunityCalculator: React.FC<OpportunityCalculatorProps> = ({
  selectedTicker,
  onSaveTrade,
}) => {
  const [direction, setDirection] = useState<SignalType>('LONG');
  const [entryPrice, setEntryPrice] = useState<number>(94850);
  const [atr, setAtr] = useState<number>(1420);
  const [capital, setCapital] = useState<number>(() => {
    try {
      const val = localStorage.getItem('sosska_capital');
      return val ? parseFloat(val) : 1000;
    } catch {
      return 1000;
    }
  });
  const [riskPercent, setRiskPercent] = useState<number>(() => {
    try {
      const val = localStorage.getItem('sosska_risk_percent');
      return val ? parseFloat(val) : 2.0;
    } catch {
      return 2.0;
    }
  });

  const [copiedTelegram, setCopiedTelegram] = useState(false);
  const [sendingToBot, setSendingToBot] = useState(false);
  const [sentToBotSuccess, setSentToBotSuccess] = useState(false);
  const [botError, setBotError] = useState<string | null>(null);
  const [tradeSaved, setTradeSaved] = useState(false);

  useEffect(() => {
    if (selectedTicker) {
      setEntryPrice(selectedTicker.lastPrice);
      setAtr(selectedTicker.atr14);
      if (selectedTicker.trend15m === 'bull' && selectedTicker.trend1h === 'bull') {
        setDirection('LONG');
      } else if (selectedTicker.trend15m === 'bear' && selectedTicker.trend1h === 'bear') {
        setDirection('SHORT');
      }
    }
  }, [selectedTicker]);

  const handleCapitalChange = (val: number) => {
    setCapital(val);
    try {
      localStorage.setItem('sosska_capital', String(val));
    } catch {
      // ignore
    }
  };

  const handleRiskChange = (val: number) => {
    setRiskPercent(val);
    try {
      localStorage.setItem('sosska_risk_percent', String(val));
    } catch {
      // ignore
    }
  };

  const calcResult = useMemo<CalculatorResult>(() => {
    const entry = Math.max(0.0000001, entryPrice || 1);
    const currAtr = Math.max(0.0000001, atr || 0.01);
    const cap = Math.max(1, capital || 100);
    const risk = Math.max(0.1, Math.min(100, riskPercent || 1));

    const isLong = direction === 'LONG';
    const sl = isLong ? entry - 1.8 * currAtr : entry + 1.8 * currAtr;
    const tp1 = isLong ? entry + 2.5 * currAtr : entry - 2.5 * currAtr;
    const tp2 = isLong ? entry + 5.0 * currAtr : entry - 5.0 * currAtr;

    const slDistance = Math.abs(entry - sl);
    const slDistancePercent = (slDistance / entry) * 100;
    const tp1Distance = Math.abs(tp1 - entry);
    const tp1DistancePercent = (tp1Distance / entry) * 100;
    const tp2Distance = Math.abs(tp2 - entry);
    const tp2DistancePercent = (tp2Distance / entry) * 100;

    const riskAmountUsd = (cap * risk) / 100;
    const positionSizeUnits = slDistance > 0 ? riskAmountUsd / slDistance : 0;
    const positionSizeUsd = positionSizeUnits * entry;

    const rrTp1 = slDistance > 0 ? tp1Distance / slDistance : 0;
    const rrTp2 = slDistance > 0 ? tp2Distance / slDistance : 0;

    return {
      entryPrice: entry,
      sl: Math.max(0.0000001, sl),
      tp1: Math.max(0.0000001, tp1),
      tp2: Math.max(0.0000001, tp2),
      slDistancePercent,
      tp1DistancePercent,
      tp2DistancePercent,
      riskAmountUsd,
      positionSizeUsd,
      positionSizeUnits,
      rrTp1,
      rrTp2,
    };
  }, [entryPrice, atr, capital, riskPercent, direction]);

  const currentSymbol = selectedTicker ? selectedTicker.displaySymbol : 'BTC/USDT';

  const buildTelegramText = () => {
    const state: CalculatorState = {
      symbol: currentSymbol,
      direction,
      entryPrice,
      atr,
      capital,
      riskPercent,
    };

    return formatTelegramSignal(state, calcResult, {
      bankerDominance: selectedTicker?.mcdx.banker,
      mfi: selectedTicker?.mfi,
      volumeBurst: selectedTicker?.volumeBurst,
    });
  };

  const handleCopyTelegram = async () => {
    const text = buildTelegramText();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTelegram(true);
      setTimeout(() => setCopiedTelegram(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedTelegram(true);
      setTimeout(() => setCopiedTelegram(false), 2500);
    }
  };

  const handleSendToTelegramBot = async () => {
    if (sendingToBot) return;
    setSendingToBot(true);
    setBotError(null);
    const text = buildTelegramText();

    const response = await telegramService.sendMessage(text);
    setSendingToBot(false);

    if (response.ok) {
      setSentToBotSuccess(true);
      setTimeout(() => setSentToBotSuccess(false), 3000);
    } else {
      setBotError(response.error || 'تعذر الإرسال إلى بوت تليجرام');
      setTimeout(() => setBotError(null), 4000);
    }
  };

  const handleSaveToJournal = () => {
    const trade: SavedTrade = {
      id: `trade-${Date.now()}`,
      timestamp: Date.now(),
      symbol: currentSymbol,
      direction,
      entryPrice: calcResult.entryPrice,
      sl: calcResult.sl,
      tp1: calcResult.tp1,
      tp2: calcResult.tp2,
      positionSizeUsd: calcResult.positionSizeUsd,
      riskAmountUsd: calcResult.riskAmountUsd,
      capital,
      riskPercent,
    };

    onSaveTrade(trade);
    setTradeSaved(true);
    setTimeout(() => setTradeSaved(false), 2000);
  };

  const formatPrice = (p: number) => {
    if (p < 0.0001) return p.toFixed(7);
    if (p < 0.01) return p.toFixed(5);
    if (p < 1) return p.toFixed(4);
    if (p < 50) return p.toFixed(3);
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-[#121a2b] border border-[#1f2d47] rounded-xl p-4 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1f2d47] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#31d0a0] glow-emerald" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>مختبر الفرص وحاسبة المخاطر اللحظية</span>
              <span className="text-xs font-mono text-[#31d0a0]">{currentSymbol}</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              حساب فوري للأهداف (1.8 / 2.5 / 5.0 ATR) مع إرسال مباشر لبوت تليجرام
            </p>
          </div>
        </div>

        {/* Direction Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#0b1020] rounded-lg border border-[#1f2d47]">
          <button
            onClick={() => setDirection('LONG')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
              direction === 'LONG'
                ? 'bg-[#31d0a0] text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight size={13} />
            <span>شراء LONG</span>
          </button>
          <button
            onClick={() => setDirection('SHORT')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
              direction === 'SHORT'
                ? 'bg-[#ff7085] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownRight size={13} />
            <span>بيع SHORT</span>
          </button>
        </div>
      </div>

      {/* Inputs Form */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 text-xs">
        <div className="space-y-1">
          <label className="text-slate-300 font-sans flex justify-between">
            <span>سعر الدخول (Entry):</span>
            <span className="text-[10px] text-slate-500 font-mono">USDT</span>
          </label>
          <input
            type="number"
            step="any"
            value={entryPrice}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-2 bg-[#0b1020] border border-[#2e4166] focus:border-[#7da8ff] rounded-lg font-mono font-bold text-slate-100 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-sans flex justify-between">
            <span>قيمة ATR(14):</span>
            <button
              onClick={() => selectedTicker && setAtr(selectedTicker.atr14)}
              className="text-[10px] text-[#7da8ff] hover:underline font-sans"
              title="جلب قيمة ATR الحالية للعملة"
            >
              تحديث تلقائي
            </button>
          </label>
          <input
            type="number"
            step="any"
            value={atr}
            onChange={(e) => setAtr(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-2 bg-[#0b1020] border border-[#2e4166] focus:border-[#7da8ff] rounded-lg font-mono font-bold text-slate-100 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-sans flex justify-between">
            <span>رأس المال (Capital):</span>
            <span className="text-[10px] text-slate-500 font-mono">USDT</span>
          </label>
          <input
            type="number"
            step="10"
            value={capital}
            onChange={(e) => handleCapitalChange(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-2 bg-[#0b1020] border border-[#2e4166] focus:border-[#7da8ff] rounded-lg font-mono font-bold text-slate-100 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-slate-300 font-sans flex justify-between">
            <span>نسبة المخاطرة (Risk %):</span>
            <span className="text-[10px] text-slate-400 font-mono">
              ${calcResult.riskAmountUsd.toFixed(1)}
            </span>
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              step="0.5"
              min="0.2"
              max="10"
              value={riskPercent}
              onChange={(e) => handleRiskChange(parseFloat(e.target.value) || 0)}
              className="w-full px-2.5 py-2 bg-[#0b1020] border border-[#2e4166] focus:border-[#7da8ff] rounded-lg font-mono font-bold text-slate-100 outline-none"
            />
            <div className="flex gap-0.5">
              {[1, 2, 3].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRiskChange(r)}
                  className={`px-1.5 py-2 rounded text-[10px] font-mono border ${
                    riskPercent === r
                      ? 'bg-[#7da8ff]/20 text-[#7da8ff] border-[#7da8ff]/50'
                      : 'bg-[#18233a] text-slate-400 border-[#2e4166] hover:text-white'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calculated Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 font-mono">
        <div className="p-3 rounded-lg bg-[#0b1020] border border-[#ff7085]/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#ff7085] font-sans font-bold">🛑 وقف الخسارة (SL)</span>
            <span className="text-[10px] text-slate-400">1.8× ATR</span>
          </div>
          <div className="text-lg font-bold text-[#ff7085]">${formatPrice(calcResult.sl)}</div>
          <div className="text-[11px] text-slate-400 flex justify-between mt-1">
            <span>المسافة: {calcResult.slDistancePercent.toFixed(2)}%</span>
            <span>المخاطرة: ${calcResult.riskAmountUsd.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0b1020] border border-[#31d0a0]/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#31d0a0] font-sans font-bold">🎯 الهدف الأول (TP1)</span>
            <span className="text-[10px] text-slate-400">2.5× ATR</span>
          </div>
          <div className="text-lg font-bold text-[#31d0a0]">${formatPrice(calcResult.tp1)}</div>
          <div className="text-[11px] text-slate-400 flex justify-between mt-1">
            <span>الربح: +{calcResult.tp1DistancePercent.toFixed(2)}%</span>
            <span className="text-[#31d0a0] font-bold">R:R 1:{calcResult.rrTp1.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0b1020] border border-[#7da8ff]/30">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#7da8ff] font-sans font-bold">🚀 الهدف الثاني (TP2)</span>
            <span className="text-[10px] text-slate-400">5.0× ATR</span>
          </div>
          <div className="text-lg font-bold text-[#7da8ff]">${formatPrice(calcResult.tp2)}</div>
          <div className="text-[11px] text-slate-400 flex justify-between mt-1">
            <span>الربح: +{calcResult.tp2DistancePercent.toFixed(2)}%</span>
            <span className="text-[#7da8ff] font-bold">R:R 1:{calcResult.rrTp2.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {botError && (
        <div className="mb-3 p-2 rounded-lg bg-[#ff7085]/15 border border-[#ff7085]/40 text-[#ff7085] text-xs flex items-center gap-2">
          <AlertCircle size={14} />
          <span>{botError}</span>
        </div>
      )}

      {/* Position Sizing Box & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#1f2d47]">
        <div className="w-full sm:w-auto flex items-center gap-3 bg-[#0b1020] px-3.5 py-2 rounded-lg border border-[#2e4166]">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-sans">حجم المركز الدقيق (Position Size):</div>
            <div className="text-sm font-bold font-mono text-white">
              ${calcResult.positionSizeUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
              <span className="text-slate-400 text-xs mr-1 font-normal">
                ({calcResult.positionSizeUnits.toFixed(3)} عقد)
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleSaveToJournal}
            className="px-2.5 py-2 rounded-lg bg-[#18233a] hover:bg-[#1f2d47] border border-[#2e4166] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {tradeSaved ? <Check size={14} className="text-[#31d0a0]" /> : <BookmarkPlus size={14} className="text-[#7da8ff]" />}
            <span>{tradeSaved ? 'تم الحفظ!' : 'حفظ بالسجل'}</span>
          </button>

          <button
            onClick={handleCopyTelegram}
            className="px-2.5 py-2 rounded-lg bg-[#18233a] hover:bg-[#1f2d47] border border-[#2e4166] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="نسخ نص الصفقة"
          >
            {copiedTelegram ? <Check size={14} className="text-[#31d0a0]" /> : <Copy size={14} />}
            <span>{copiedTelegram ? 'تم النسخ!' : 'نسخ النص'}</span>
          </button>

          <button
            onClick={handleSendToTelegramBot}
            disabled={sendingToBot}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#2aabee] to-[#229ed9] hover:from-[#229ed9] hover:to-[#1b8bc2] disabled:opacity-60 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            title="إرسال مباشر عبر بوت تليجرام إلى حسابك"
          >
            {sentToBotSuccess ? <Check size={15} /> : <Send size={15} />}
            <span>
              {sendingToBot
                ? 'جاري الإرسال...'
                : sentToBotSuccess
                ? 'تم الإرسال لتليجرام!'
                : 'إرسال فوري لتليجرام'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
