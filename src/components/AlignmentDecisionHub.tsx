import React, { useState } from 'react';
import { MarketTicker } from '../types';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ShieldCheck,
  Send,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Scale,
} from 'lucide-react';

interface AlignmentDecisionHubProps {
  tickers: MarketTicker[];
  selectedTicker: MarketTicker | null;
  onSelectTicker: (ticker: MarketTicker) => void;
  onSendCoinAlertToTelegram: (ticker: MarketTicker) => Promise<boolean>;
}

export const AlignmentDecisionHub: React.FC<AlignmentDecisionHubProps> = ({
  tickers,
  selectedTicker,
  onSelectTicker,
  onSendCoinAlertToTelegram,
}) => {
  const [sendingSymbol, setSendingSymbol] = useState<string | null>(null);
  const [sentSymbol, setSentSymbol] = useState<string | null>(null);

  const formatPrice = (p: number) => {
    if (p < 0.0001) return p.toFixed(7);
    if (p < 0.01) return p.toFixed(5);
    if (p < 1) return p.toFixed(4);
    if (p < 10) return p.toFixed(3);
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Top Bullish Aligned Coins (sorted by bullishConfluence desc)
  const bullishCoins = [...tickers]
    .filter((t) => t.alignmentScore >= 2 && t.bullishConfluence >= 62)
    .sort((a, b) => b.bullishConfluence - a.bullishConfluence)
    .slice(0, 8);

  // Top Bearish Aligned Coins (sorted by bearishConfluence desc)
  const bearishCoins = [...tickers]
    .filter((t) => t.alignmentScore <= 1 && t.bearishConfluence >= 62)
    .sort((a, b) => b.bearishConfluence - a.bearishConfluence)
    .slice(0, 8);

  const handleQuickTelegram = async (e: React.MouseEvent, coin: MarketTicker) => {
    e.stopPropagation();
    if (sendingSymbol) return;
    setSendingSymbol(coin.symbol);
    const ok = await onSendCoinAlertToTelegram(coin);
    setSendingSymbol(null);
    if (ok) {
      setSentSymbol(coin.symbol);
      setTimeout(() => setSentSymbol(null), 2500);
    }
  };

  const activeCoin = selectedTicker || tickers[0];

  const isEnterLong =
    activeCoin && (activeCoin.verdict === 'STRONG_LONG' || activeCoin.verdict === 'MODERATE_LONG');
  const isEnterShort =
    activeCoin && (activeCoin.verdict === 'STRONG_SHORT' || activeCoin.verdict === 'MODERATE_SHORT');

  return (
    <div className="space-y-5">
      {/* 1. Selected Coin Decision Advisor: "هل أدخل الصفقة أم لا؟" */}
      {activeCoin && (
        <div
          className={`rounded-xl p-4 sm:p-5 border shadow-lg transition-all ${
            isEnterLong
              ? 'bg-gradient-to-l from-[#121a2b] via-[#122629] to-[#121a2b] border-[#31d0a0]/50 glow-emerald'
              : isEnterShort
              ? 'bg-gradient-to-l from-[#121a2b] via-[#281524] to-[#121a2b] border-[#ff7085]/50 glow-rose'
              : 'bg-[#121a2b] border-[#2e4166]'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-[#1f2d47] pb-4 mb-4">
            {/* Coin Title & Question */}
            <div className="flex items-start sm:items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-base shrink-0 border ${
                  isEnterLong
                    ? 'bg-[#31d0a0]/20 border-[#31d0a0] text-[#31d0a0]'
                    : isEnterShort
                    ? 'bg-[#ff7085]/20 border-[#ff7085] text-[#ff7085]'
                    : 'bg-[#ffc66d]/15 border-[#ffc66d]/50 text-[#ffc66d]'
                }`}
              >
                {activeCoin.confluencePercent}%
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-[#7da8ff]">
                    مستشار القرار الفوري (هل أدخل الصفقة أم لا؟):
                  </span>
                  <span className="font-mono font-bold text-base text-white">
                    {activeCoin.displaySymbol}
                  </span>
                  <span className="font-mono text-sm text-slate-300">
                    (${formatPrice(activeCoin.lastPrice)})
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{activeCoin.verdictReason}</p>
              </div>
            </div>

            {/* Final Verdict Badge & Quick Action */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 border ${
                  isEnterLong
                    ? 'bg-[#31d0a0] text-slate-950 border-[#31d0a0] shadow-md'
                    : isEnterShort
                    ? 'bg-[#ff7085] text-white border-[#ff7085] shadow-md'
                    : 'bg-[#0b1020] text-[#ffc66d] border-[#ffc66d]/50'
                }`}
              >
                {isEnterLong ? (
                  <CheckCircle2 size={18} />
                ) : isEnterShort ? (
                  <TrendingDown size={18} />
                ) : (
                  <AlertOctagon size={18} />
                )}
                <span>القرار: {activeCoin.verdictText}</span>
              </div>

              <button
                onClick={(e) => handleQuickTelegram(e, activeCoin)}
                className="px-3 py-2.5 rounded-xl bg-[#2aabee]/20 hover:bg-[#2aabee]/30 border border-[#2aabee]/50 text-[#2aabee] text-xs font-bold flex items-center gap-1.5 transition-colors"
                title="إرسال قرار وتحليل هذه العملة إلى تليجرام"
              >
                {sentSymbol === activeCoin.symbol ? <Check size={15} /> : <Send size={15} />}
                <span>
                  {sentSymbol === activeCoin.symbol ? 'تم الإرسال!' : 'إرسال القرار لتليجرام'}
                </span>
              </button>
            </div>
          </div>

          {/* Bullish vs Bearish Tug-of-War Meter + 5-Pillar Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Tug of War Meter (5 cols) */}
            <div className="lg:col-span-5 bg-[#0b1020] p-3.5 rounded-xl border border-[#1f2d47] space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#31d0a0] flex items-center gap-1">
                  <TrendingUp size={14} />
                  نسبة التوافق الصاعد: {activeCoin.bullishConfluence}%
                </span>
                <Scale size={14} className="text-slate-400" />
                <span className="text-[#ff7085] flex items-center gap-1">
                  نسبة التوافق الهابط: {activeCoin.bearishConfluence}%
                  <TrendingDown size={14} />
                </span>
              </div>

              <div className="h-3.5 w-full bg-[#18233a] rounded-full overflow-hidden flex p-0.5 gap-1">
                <div
                  style={{ width: `${activeCoin.bullishConfluence}%` }}
                  className="h-full bg-gradient-to-l from-[#31d0a0] to-[#1f9d76] rounded-r-full transition-all duration-500"
                />
                <div
                  style={{ width: `${activeCoin.bearishConfluence}%` }}
                  className="h-full bg-gradient-to-r from-[#ff7085] to-[#d9485f] rounded-l-full transition-all duration-500"
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                <span>يشترط ≥ 66% للدخول الآمن</span>
                <span className="font-mono text-slate-300">
                  الاتجاه المهيمن:{' '}
                  <strong
                    className={
                      activeCoin.dominantDirection === 'LONG'
                        ? 'text-[#31d0a0]'
                        : activeCoin.dominantDirection === 'SHORT'
                        ? 'text-[#ff7085]'
                        : 'text-[#ffc66d]'
                    }
                  >
                    {activeCoin.dominantDirection === 'LONG'
                      ? 'صاعد (شراء)'
                      : activeCoin.dominantDirection === 'SHORT'
                      ? 'هابط (بيع)'
                      : 'متعادل / متذبذب'}
                  </strong>
                </span>
              </div>
            </div>

            {/* 5-Pillar Analysis Checklist (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2">
              {activeCoin.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-right flex flex-col justify-between ${
                    item.passed
                      ? 'bg-[#31d0a0]/10 border-[#31d0a0]/35'
                      : 'bg-[#0b1020] border-[#1f2d47] opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    {item.passed ? (
                      <CheckCircle2 size={14} className="text-[#31d0a0] shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-[#ff7085] shrink-0" />
                    )}
                    <span className="text-[10px] font-mono text-slate-400">وزن {item.weight}%</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-100 leading-snug mb-1">
                    {item.label}
                  </div>
                  <div
                    className={`text-[10px] font-mono font-semibold ${
                      item.passed ? 'text-[#31d0a0]' : 'text-[#ff7085]'
                    }`}
                  >
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Split View: قسم التوافق الصاعد vs قسم التوافق الهابط */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Right Column: Bullish Alignment Section (قسم التوافق الصاعد) */}
        <div className="bg-[#121a2b] border border-[#31d0a0]/35 rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-l from-[#31d0a0]/15 to-[#0f1626] border-b border-[#31d0a0]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-[#31d0a0] glow-emerald" />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>قسم التوافق الصاعد (Bullish Alignment)</span>
                  <span className="text-xs font-mono text-[#31d0a0] bg-[#31d0a0]/15 px-2 py-0.5 rounded border border-[#31d0a0]/30">
                    فرص الشراء LONG 🟢
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  السعر <strong className="text-[#31d0a0]">فوق EMA 50</strong> على الفريمات + تمركز حيتان مرتفع + زخم سيولة إيجابي
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#31d0a0] shrink-0">
              {bullishCoins.length} عملات جاهزة
            </span>
          </div>

          {/* Difference Explanation Strip */}
          <div className="px-4 py-2 bg-[#0b1020] border-b border-[#1f2d47] text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong className="text-[#31d0a0]">متى أدخل شراء؟</strong> عندما تكون نسبة التوافق الصاعد{' '}
              <span className="font-mono text-white font-bold">≥ 66%</span> والفريمات <span className="font-mono text-[#31d0a0]">2/3 أو 3/3</span>.
            </span>
            <span className="text-[10px] font-mono text-slate-400">الأهداف: +2.5 ATR و +5.0 ATR</span>
          </div>

          {/* List of Top Bullish Coins */}
          <div className="p-3 space-y-2 overflow-y-auto max-h-[360px] flex-1">
            {bullishCoins.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                لا توجد عملات تحقق شروط التوافق الصاعد الكامل في هذه اللحظة.
              </div>
            ) : (
              bullishCoins.map((coin) => {
                const isSelected = activeCoin?.symbol === coin.symbol;
                const canEnter =
                  coin.verdict === 'STRONG_LONG' || coin.verdict === 'MODERATE_LONG';

                return (
                  <div
                    key={coin.symbol}
                    onClick={() => onSelectTicker(coin)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-[#182c2c] border-[#31d0a0]'
                        : 'bg-[#0f1626] border-[#1f2d47] hover:border-[#31d0a0]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Confluence Circle */}
                      <div className="w-10 h-10 rounded-lg bg-[#31d0a0]/15 border border-[#31d0a0]/40 flex flex-col items-center justify-center font-mono shrink-0">
                        <span className="text-xs font-bold text-[#31d0a0]">
                          {coin.bullishConfluence}%
                        </span>
                        <span className="text-[8px] text-slate-300">توافق</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-white">
                            {coin.displaySymbol}
                          </span>
                          <span className="font-mono text-xs text-slate-300">
                            ${formatPrice(coin.lastPrice)}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#31d0a0]/15 text-[#31d0a0]">
                            MTF {coin.alignmentScore}/3
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                          <span>حيتان: {coin.mcdx.banker.toFixed(0)}%</span>
                          <span>·</span>
                          <span>MFI: {coin.mfi.toFixed(0)}</span>
                          <span>·</span>
                          <span>Vol: {coin.volumeBurst}x</span>
                        </div>
                      </div>
                    </div>

                    {/* Decision & Action */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                      <span
                        className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                          canEnter
                            ? 'bg-[#31d0a0] text-slate-950'
                            : 'bg-[#18233a] text-[#ffc66d] border border-[#ffc66d]/30'
                        }`}
                      >
                        <ArrowUpRight size={12} />
                        <span>{canEnter ? 'ادخل شراء' : 'انتظر'}</span>
                      </span>

                      <button
                        onClick={(e) => handleQuickTelegram(e, coin)}
                        className="p-1.5 rounded bg-[#2aabee]/15 hover:bg-[#2aabee]/30 border border-[#2aabee]/40 text-[#2aabee]"
                        title="إرسال الصفقة لتليجرام"
                      >
                        {sentSymbol === coin.symbol ? <Check size={13} /> : <Send size={13} />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Left Column: Bearish Alignment Section (قسم التوافق الهابط) */}
        <div className="bg-[#121a2b] border border-[#ff7085]/35 rounded-xl overflow-hidden shadow-lg flex flex-col">
          <div className="px-4 py-3 bg-gradient-to-l from-[#ff7085]/15 to-[#0f1626] border-b border-[#ff7085]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-[#ff7085] glow-rose" />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>قسم التوافق الهابط (Bearish Alignment)</span>
                  <span className="text-xs font-mono text-[#ff7085] bg-[#ff7085]/15 px-2 py-0.5 rounded border border-[#ff7085]/30">
                    فرص البيع SHORT 🔴
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  السعر <strong className="text-[#ff7085]">تحت EMA 50</strong> على الفريمات + تصريف سيولة الحيتان + ضغط بيعي
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#ff7085] shrink-0">
              {bearishCoins.length} عملات هابطة
            </span>
          </div>

          {/* Difference Explanation Strip */}
          <div className="px-4 py-2 bg-[#0b1020] border-b border-[#1f2d47] text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong className="text-[#ff7085]">متى أدخل بيع (أو أحذر الشراء)؟</strong> عندما تكون نسبة التوافق الهابط{' '}
              <span className="font-mono text-white font-bold">≥ 66%</span> والسعر كاسر لـ EMA 50.
            </span>
            <span className="text-[10px] font-mono text-slate-400">الأهداف: -2.5 ATR و -5.0 ATR</span>
          </div>

          {/* List of Top Bearish Coins */}
          <div className="p-3 space-y-2 overflow-y-auto max-h-[360px] flex-1">
            {bearishCoins.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                لا توجد عملات في حالة توافق هابط حاد حالياً.
              </div>
            ) : (
              bearishCoins.map((coin) => {
                const isSelected = activeCoin?.symbol === coin.symbol;
                const canEnterShort =
                  coin.verdict === 'STRONG_SHORT' || coin.verdict === 'MODERATE_SHORT';

                return (
                  <div
                    key={coin.symbol}
                    onClick={() => onSelectTicker(coin)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-[#2b1824] border-[#ff7085]'
                        : 'bg-[#0f1626] border-[#1f2d47] hover:border-[#ff7085]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Confluence Circle */}
                      <div className="w-10 h-10 rounded-lg bg-[#ff7085]/15 border border-[#ff7085]/40 flex flex-col items-center justify-center font-mono shrink-0">
                        <span className="text-xs font-bold text-[#ff7085]">
                          {coin.bearishConfluence}%
                        </span>
                        <span className="text-[8px] text-slate-300">توافق</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-white">
                            {coin.displaySymbol}
                          </span>
                          <span className="font-mono text-xs text-slate-300">
                            ${formatPrice(coin.lastPrice)}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#ff7085]/15 text-[#ff7085]">
                            هابط {3 - coin.alignmentScore}/3
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                          <span>حيتان: {coin.mcdx.banker.toFixed(0)}%</span>
                          <span>·</span>
                          <span>MFI: {coin.mfi.toFixed(0)}</span>
                          <span>·</span>
                          <span>Vol: {coin.volumeBurst}x</span>
                        </div>
                      </div>
                    </div>

                    {/* Decision & Action */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                      <span
                        className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                          canEnterShort
                            ? 'bg-[#ff7085] text-white'
                            : 'bg-[#18233a] text-[#ffc66d] border border-[#ffc66d]/30'
                        }`}
                      >
                        <ArrowDownRight size={12} />
                        <span>{canEnterShort ? 'ادخل بيع' : 'تجنب الشراء'}</span>
                      </span>

                      <button
                        onClick={(e) => handleQuickTelegram(e, coin)}
                        className="p-1.5 rounded bg-[#2aabee]/15 hover:bg-[#2aabee]/30 border border-[#2aabee]/40 text-[#2aabee]"
                        title="إرسال الصفقة لتليجرام"
                      >
                        {sentSymbol === coin.symbol ? <Check size={13} /> : <Send size={13} />}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
