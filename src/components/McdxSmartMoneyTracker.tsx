import React from 'react';
import { MarketTicker } from '../types';
import { ShieldAlert, TrendingUp, Users, Building2 } from 'lucide-react';

interface McdxProps {
  ticker: MarketTicker | null;
  allTickers: MarketTicker[];
  onSelectTicker: (ticker: MarketTicker) => void;
}

export const McdxSmartMoneyTracker: React.FC<McdxProps> = ({
  ticker,
  allTickers,
  onSelectTicker,
}) => {
  if (!ticker) {
    return (
      <div className="bg-[#121a2b] border border-[#1f2d47] rounded-xl p-4 text-center text-slate-400">
        اختر عملة لعرض تدفق السيولة المؤسسية
      </div>
    );
  }

  const banker = ticker.mcdx.banker;
  const retail = ticker.mcdx.retail;
  const hotMoney = ticker.mcdx.hotMoney;

  const isBankerDominant = banker >= 50;
  const isExtremeBanker = banker >= 75;

  return (
    <div className="bg-[#121a2b] border border-[#1f2d47] rounded-xl p-4 shadow-lg flex flex-col justify-between">
      {/* Title & Badge */}
      <div className="flex items-center justify-between border-b border-[#1f2d47] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#7da8ff] glow-blue" />
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>هيمنة السيولة المؤسسية</span>
              <span className="text-xs font-mono text-[#7da8ff]">MCDX+ Smart Money</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              تتبع تدفق صانع السوق والحيتان مقابل الأفراد للأصل: <span className="font-mono text-white font-semibold">{ticker.displaySymbol}</span>
            </p>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${
            isExtremeBanker
              ? 'bg-[#7da8ff]/20 text-[#7da8ff] border-[#7da8ff]/40 glow-blue'
              : isBankerDominant
              ? 'bg-[#31d0a0]/15 text-[#31d0a0] border-[#31d0a0]/30'
              : 'bg-[#ffc66d]/15 text-[#ffc66d] border-[#ffc66d]/30'
          }`}
        >
          {isExtremeBanker
            ? '🚀 سيطرة حيتان كاسحة'
            : isBankerDominant
            ? '🏦 هيمنة مؤسسية'
            : '👥 سيطرة أفراد / تذبذب'}
        </span>
      </div>

      {/* Main Flow Stacked Bar Gauge */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="flex items-center gap-1.5 text-[#ff7085] font-semibold">
              <Building2 size={13} className="text-[#ff7085]" />
              صانع السوق / الحيتان (Banker): {banker.toFixed(1)}%
            </span>
            <span className="flex items-center gap-1.5 text-[#31d0a0] font-semibold">
              <Users size={13} className="text-[#31d0a0]" />
              المتداولون الأفراد (Retail): {retail.toFixed(1)}%
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="h-4 w-full bg-[#0b1020] rounded-full overflow-hidden flex border border-[#1f2d47] p-0.5 gap-0.5">
            {/* Banker Flow Bar */}
            <div
              style={{ width: `${banker}%` }}
              className="h-full bg-gradient-to-r from-[#ff7085] to-[#7da8ff] rounded-l-full transition-all duration-700 relative group"
              title={`Banker Flow: ${banker}%`}
            >
              {banker > 15 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white drop-shadow">
                  {banker.toFixed(0)}%
                </span>
              )}
            </div>

            {/* Hot Money / Speculative Bar */}
            <div
              style={{ width: `${hotMoney}%` }}
              className="h-full bg-[#ffc66d] transition-all duration-700 relative"
              title={`Hot Money: ${hotMoney}%`}
            >
              {hotMoney > 10 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-slate-900">
                  {hotMoney.toFixed(0)}%
                </span>
              )}
            </div>

            {/* Retail Volume Bar */}
            <div
              style={{ width: `${retail}%` }}
              className="h-full bg-gradient-to-r from-[#20aa7f] to-[#31d0a0] rounded-r-full transition-all duration-700 relative"
              title={`Retail Volume: ${retail}%`}
            >
              {retail > 15 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-slate-950">
                  {retail.toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono pt-1">
          <div className="p-2 rounded-lg bg-[#18233a]/60 border border-[#2e4166]">
            <div className="text-slate-400 text-[10px]">Banker (مؤسسات)</div>
            <div className="text-[#7da8ff] font-bold text-sm">{banker.toFixed(1)}%</div>
          </div>
          <div className="p-2 rounded-lg bg-[#18233a]/60 border border-[#2e4166]">
            <div className="text-slate-400 text-[10px]">Hot Money (مضاربة)</div>
            <div className="text-[#ffc66d] font-bold text-sm">{hotMoney.toFixed(1)}%</div>
          </div>
          <div className="p-2 rounded-lg bg-[#18233a]/60 border border-[#2e4166]">
            <div className="text-slate-400 text-[10px]">Retail (أفراد)</div>
            <div className="text-[#31d0a0] font-bold text-sm">{retail.toFixed(1)}%</div>
          </div>
        </div>

        {/* Comparative Mini Matrix of All Tracked Coins */}
        <div className="pt-2 border-t border-[#1f2d47]">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>مقارنة السيولة المؤسسية لباقي العملات:</span>
            <span className="text-[10px] text-slate-500 font-mono">انقر للتبديل</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {allTickers.slice(0, 5).map((t) => {
              const isCurr = t.symbol === ticker.symbol;
              const b = t.mcdx.banker;
              return (
                <button
                  key={t.symbol}
                  onClick={() => onSelectTicker(t)}
                  className={`p-1.5 rounded-lg border text-right transition-all ${
                    isCurr
                      ? 'bg-[#18233a] border-[#7da8ff] ring-1 ring-[#7da8ff]/50'
                      : 'bg-[#0f1626] border-[#1f2d47] hover:border-[#2e4166]'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="font-bold text-slate-200">{t.baseAsset}</span>
                    <span className={b >= 50 ? 'text-[#7da8ff] font-bold' : 'text-slate-400'}>
                      {b.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#18233a] rounded-full overflow-hidden mt-1">
                    <div
                      style={{ width: `${b}%` }}
                      className={`h-full ${b >= 50 ? 'bg-[#7da8ff]' : 'bg-[#ffc66d]'}`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
