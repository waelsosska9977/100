import React from 'react';
import { MarketTicker } from '../types';
import { Waves, AlertTriangle, CheckCircle, Gauge } from 'lucide-react';

interface MfiProps {
  ticker: MarketTicker | null;
}

export const MfiOscillator: React.FC<MfiProps> = ({ ticker }) => {
  if (!ticker) {
    return (
      <div className="bg-[#121a2b] border border-[#1f2d47] rounded-xl p-4 text-center text-slate-400">
        اختر عملة لعرض مؤشر مناطق التشبع المؤسسي MFI
      </div>
    );
  }

  const mfi = ticker.mfi;
  const isWhaleAccumulation = mfi < 25;
  const isInstitutionalDistribution = mfi > 75;
  const isNeutral = !isWhaleAccumulation && !isInstitutionalDistribution;

  const formatPrice = (p: number) => {
    if (p < 0.001) return p.toFixed(6);
    if (p < 1) return p.toFixed(4);
    if (p < 10) return p.toFixed(3);
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-[#121a2b] border border-[#1f2d47] rounded-xl p-4 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1f2d47] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffc66d] glow-amber" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>مؤشر مناطق التشبع المؤسسي</span>
              <span className="text-xs font-mono text-[#ffc66d]">LAL3 Gemini / MFI</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Money Flow Index المرجح بالحجم والسيولة الحقيقية للأصل <span className="font-mono text-white font-semibold">{ticker.displaySymbol}</span>
            </p>
          </div>
        </div>

        {/* State Tag */}
        <span
          className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${
            isWhaleAccumulation
              ? 'bg-[#31d0a0]/20 text-[#31d0a0] border-[#31d0a0]/50 glow-emerald'
              : isInstitutionalDistribution
              ? 'bg-[#ff7085]/20 text-[#ff7085] border-[#ff7085]/50 glow-rose'
              : 'bg-[#18233a] text-slate-300 border-[#2e4166]'
          }`}
        >
          {isWhaleAccumulation
            ? '🟢 تجميع حيتان (MFI < 25)'
            : isInstitutionalDistribution
            ? '🔴 تصريف مؤسسات (MFI > 75)'
            : '⚪ تدفق محايد متوازن'}
        </span>
      </div>

      {/* Main Gauge Visualizer */}
      <div className="space-y-4">
        {/* Value Callout and Zone Indicator */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-sans">قيمة MFI الحالية:</div>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold font-mono tracking-tight ${
                isWhaleAccumulation ? 'text-[#31d0a0]' : isInstitutionalDistribution ? 'text-[#ff7085]' : 'text-[#ffc66d]'
              }`}>
                {mfi.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
            </div>
          </div>

          <div className="text-left">
            <div className="text-xs text-slate-400 font-sans">قيمة ATR(14) اللحظية:</div>
            <div className="font-mono font-bold text-slate-200 text-lg">
              ${formatPrice(ticker.atr14)}
            </div>
          </div>
        </div>

        {/* Linear Gradient Track with Threshold Markers */}
        <div className="relative pt-4 pb-2">
          {/* Track Bar */}
          <div className="h-3 w-full rounded-full bg-gradient-to-r from-[#31d0a0] via-[#ffc66d] to-[#ff7085] relative overflow-hidden opacity-90">
            {/* Threshold line 25 */}
            <div className="absolute top-0 bottom-0 left-[25%] w-0.5 bg-white/70" />
            {/* Threshold line 75 */}
            <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-white/70" />
          </div>

          {/* Value Indicator Pointer */}
          <div
            style={{ left: `${Math.min(98, Math.max(2, mfi))}%` }}
            className="absolute top-1 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-500"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#0b1020] shadow-md ring-2 ring-[#7da8ff]" />
            <div className="text-[10px] font-mono font-bold text-white bg-[#0b1020] px-1 rounded border border-[#2e4166] mt-0.5">
              {mfi.toFixed(0)}
            </div>
          </div>

          {/* Zone Labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
            <span className="text-[#31d0a0] font-semibold">0 (تجميع حيتان)</span>
            <span className="text-slate-300">25 (شراء قوي)</span>
            <span className="text-slate-400">50 (محايد)</span>
            <span className="text-[#ffc66d]">75 (جني أرباح)</span>
            <span className="text-[#ff7085] font-semibold">100 (تصريف)</span>
          </div>
        </div>

        {/* Actionable Interpretation Note */}
        <div className="p-2.5 rounded-lg bg-[#0b1020] border border-[#1f2d47] flex items-start gap-2.5 text-xs">
          {isWhaleAccumulation ? (
            <>
              <CheckCircle size={16} className="text-[#31d0a0] shrink-0 mt-0.5" />
              <div className="text-slate-200">
                <span className="text-[#31d0a0] font-bold">فرصة شراء استثنائية:</span> مؤشر MFI دون 25 يؤكد أن كبار الحيتان يمتصون عروض البيع في القاع. فرصة ممتازة لفتح صفقة Long مع التوافق الفني.
              </div>
            </>
          ) : isInstitutionalDistribution ? (
            <>
              <AlertTriangle size={16} className="text-[#ff7085] shrink-0 mt-0.5" />
              <div className="text-slate-200">
                <span className="text-[#ff7085] font-bold">تحذير تصريف مؤسسي:</span> مؤشر MFI يتجاوز 75 مشيراً إلى ذروة الشراء وتصريف صانع السوق لمراكزه. يُنصح بجني الأرباح أو البحث عن إشارات Short.
              </div>
            </>
          ) : (
            <>
              <Waves size={16} className="text-[#ffc66d] shrink-0 mt-0.5" />
              <div className="text-slate-300">
                <span className="text-[#ffc66d] font-bold">حالة توازن:</span> السيولة تتحرك في نطاق صحي وطبيعي. راقب تقاطع السعر مع EMA 50 لتأكيد اتجاه الزخم.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
