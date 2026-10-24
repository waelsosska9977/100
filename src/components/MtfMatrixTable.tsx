import React, { useState, useMemo } from 'react';
import { MarketTicker } from '../types';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Search,
  Send,
  Check,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface MtfMatrixTableProps {
  tickers: MarketTicker[];
  selectedTicker: MarketTicker | null;
  onSelectTicker: (ticker: MarketTicker) => void;
  onSendCoinAlertToTelegram: (ticker: MarketTicker) => Promise<boolean>;
}

type MatrixFilter =
  | 'ALL'
  | 'READY_LONG'
  | 'READY_SHORT'
  | 'BULL_3'
  | 'BEAR_0'
  | 'WHALE_DOM'
  | 'MFI_OVERSOLD'
  | 'VOL_BURST';

type SortField = 'RANK' | 'CONFLUENCE' | 'CHANGE' | 'VOLUME' | 'BANKER' | 'MFI';

export const MtfMatrixTable: React.FC<MtfMatrixTableProps> = ({
  tickers,
  selectedTicker,
  onSelectTicker,
  onSendCoinAlertToTelegram,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<MatrixFilter>('ALL');
  const [sortField, setSortField] = useState<SortField>('CONFLUENCE');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sendingSymbol, setSendingSymbol] = useState<string | null>(null);
  const [sentSymbol, setSentSymbol] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    if (price < 0.0001) return price.toFixed(7);
    if (price < 0.01) return price.toFixed(5);
    if (price < 1) return price.toFixed(4);
    if (price < 10) return price.toFixed(3);
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1_000_000_000) return `${(vol / 1_000_000_000).toFixed(2)}B`;
    if (vol >= 1_000_000) return `${(vol / 1_000_000).toFixed(1)}M`;
    if (vol >= 1_000) return `${(vol / 1_000).toFixed(0)}K`;
    return vol.toFixed(0);
  };

  const getDistancePercent = (price: number, ema: number) => {
    if (!ema) return 0;
    return ((price - ema) / ema) * 100;
  };

  const counts = useMemo(() => {
    return {
      all: tickers.length,
      readyLong: tickers.filter(
        (t) => t.verdict === 'STRONG_LONG' || t.verdict === 'MODERATE_LONG'
      ).length,
      readyShort: tickers.filter(
        (t) => t.verdict === 'STRONG_SHORT' || t.verdict === 'MODERATE_SHORT'
      ).length,
      bull3: tickers.filter((t) => t.alignmentScore === 3).length,
      bear0: tickers.filter((t) => t.alignmentScore === 0).length,
      whaleDom: tickers.filter((t) => t.mcdx.banker >= 70).length,
      mfiOversold: tickers.filter((t) => t.mfi < 25).length,
      volBurst: tickers.filter((t) => t.volumeBurst >= 2.2).length,
    };
  }, [tickers]);

  const filteredTickers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = tickers.filter((t) => {
      if (q && !t.symbol.toLowerCase().includes(q) && !t.name.toLowerCase().includes(q)) {
        return false;
      }
      if (activeFilter === 'READY_LONG') {
        return t.verdict === 'STRONG_LONG' || t.verdict === 'MODERATE_LONG';
      }
      if (activeFilter === 'READY_SHORT') {
        return t.verdict === 'STRONG_SHORT' || t.verdict === 'MODERATE_SHORT';
      }
      if (activeFilter === 'BULL_3') return t.alignmentScore === 3;
      if (activeFilter === 'BEAR_0') return t.alignmentScore === 0;
      if (activeFilter === 'WHALE_DOM') return t.mcdx.banker >= 70;
      if (activeFilter === 'MFI_OVERSOLD') return t.mfi < 25;
      if (activeFilter === 'VOL_BURST') return t.volumeBurst >= 2.2;
      return true;
    });

    if (sortField !== 'RANK') {
      list.sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortField === 'CONFLUENCE') {
          valA = a.confluencePercent;
          valB = b.confluencePercent;
        } else if (sortField === 'CHANGE') {
          valA = a.priceChangePercent;
          valB = b.priceChangePercent;
        } else if (sortField === 'VOLUME') {
          valA = a.quoteVolume;
          valB = b.quoteVolume;
        } else if (sortField === 'BANKER') {
          valA = a.mcdx.banker;
          valB = b.mcdx.banker;
        } else if (sortField === 'MFI') {
          valA = a.mfi;
          valB = b.mfi;
        }
        return sortAsc ? valA - valB : valB - valA;
      });
    }

    return list;
  }, [tickers, searchQuery, activeFilter, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredTickers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTickers = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredTickers.slice(start, start + pageSize);
  }, [filteredTickers, safePage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(field === 'MFI');
    }
    setCurrentPage(1);
  };

  const handleSendRowTelegram = async (e: React.MouseEvent, ticker: MarketTicker) => {
    e.stopPropagation();
    if (sendingSymbol) return;
    setSendingSymbol(ticker.symbol);
    const ok = await onSendCoinAlertToTelegram(ticker);
    setSendingSymbol(null);
    if (ok) {
      setSentSymbol(ticker.symbol);
      setTimeout(() => setSentSymbol(null), 2500);
    }
  };

  return (
    <div className="bg-[#121a2b] border border-[#1f2d47] rounded-xl overflow-hidden shadow-lg">
      {/* Top Bar: Title, Search & Page Size */}
      <div className="px-4 py-3.5 border-b border-[#1f2d47] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0f1626]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#31d0a0] glow-emerald" />
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span>جدول مسح الـ 100 عملة ونسبة التوافق وقرار الدخول</span>
                <span className="text-xs font-mono text-[#7da8ff] font-normal">
                  100-Coin Confluence &amp; Entry Matrix
                </span>
              </h2>
            </div>
          </div>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#18233a] text-[#31d0a0] border border-[#31d0a0]/30 shrink-0">
            {filteredTickers.length} / {tickers.length} عملة
          </span>
        </div>

        {/* Search Input & View Size Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ابحث عن عملة (مثال: BTC, SOL, PEPE, SUI)..."
              className="w-full pr-8 pl-3 py-1.5 rounded-lg bg-[#0b1020] border border-[#2e4166] focus:border-[#7da8ff] text-xs text-slate-100 placeholder-slate-500 outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#0b1020] p-1 rounded-lg border border-[#1f2d47] text-[11px] font-mono">
            <span className="text-slate-400 px-1.5 font-sans">عرض:</span>
            {[25, 50, 100].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded transition-colors ${
                  pageSize === size
                    ? 'bg-[#7da8ff] text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="px-4 py-2.5 bg-[#0c1220] border-b border-[#1f2d47] flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => {
            setActiveFilter('ALL');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeFilter === 'ALL'
              ? 'bg-[#7da8ff] text-slate-950 font-bold'
              : 'bg-[#18233a] text-slate-300 hover:text-white'
          }`}
        >
          الكل ({counts.all})
        </button>

        <button
          onClick={() => {
            setActiveFilter('READY_LONG');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
            activeFilter === 'READY_LONG'
              ? 'bg-[#31d0a0] text-slate-950 shadow-sm'
              : 'bg-[#31d0a0]/15 text-[#31d0a0] border border-[#31d0a0]/40 hover:bg-[#31d0a0]/25'
          }`}
        >
          🟢 ادخل شراء الآن ({counts.readyLong})
        </button>

        <button
          onClick={() => {
            setActiveFilter('READY_SHORT');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
            activeFilter === 'READY_SHORT'
              ? 'bg-[#ff7085] text-white shadow-sm'
              : 'bg-[#ff7085]/15 text-[#ff7085] border border-[#ff7085]/40 hover:bg-[#ff7085]/25'
          }`}
        >
          🔴 ادخل بيع الآن ({counts.readyShort})
        </button>

        <button
          onClick={() => {
            setActiveFilter('BULL_3');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeFilter === 'BULL_3'
              ? 'bg-[#31d0a0] text-slate-950 font-bold'
              : 'bg-[#18233a] text-slate-300 hover:text-[#31d0a0]'
          }`}
        >
          توافق صاعد 3/3 ({counts.bull3})
        </button>

        <button
          onClick={() => {
            setActiveFilter('BEAR_0');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeFilter === 'BEAR_0'
              ? 'bg-[#ff7085] text-white font-bold'
              : 'bg-[#18233a] text-slate-300 hover:text-[#ff7085]'
          }`}
        >
          توافق هابط 0/3 ({counts.bear0})
        </button>

        <button
          onClick={() => {
            setActiveFilter('WHALE_DOM');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeFilter === 'WHALE_DOM'
              ? 'bg-[#7da8ff] text-slate-950 font-bold'
              : 'bg-[#18233a] text-[#7da8ff] hover:bg-[#7da8ff]/20'
          }`}
        >
          هيمنة حيتان &gt;70% ({counts.whaleDom})
        </button>

        <button
          onClick={() => {
            setActiveFilter('MFI_OVERSOLD');
            setCurrentPage(1);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            activeFilter === 'MFI_OVERSOLD'
              ? 'bg-[#31d0a0] text-slate-950 font-bold'
              : 'bg-[#18233a] text-slate-300 hover:text-[#31d0a0]'
          }`}
        >
          تجميع حيتان MFI&lt;25 ({counts.mfiOversold})
        </button>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto max-h-[560px]">
        <table className="w-full text-right text-xs relative">
          <thead className="sticky top-0 z-20 bg-[#0c1220] border-b border-[#1f2d47] text-slate-400 text-[11px] uppercase tracking-wider font-mono shadow-sm">
            <tr>
              <th className="py-2.5 px-3 text-right font-semibold">
                <button
                  onClick={() => handleSort('RANK')}
                  className="flex items-center gap-1 hover:text-white"
                >
                  <span># الأصل</span>
                  <ArrowUpDown size={11} />
                </button>
              </th>
              <th className="py-2.5 px-3 text-left font-semibold">السعر (USDT)</th>
              <th className="py-2.5 px-3 text-left font-semibold">
                <button
                  onClick={() => handleSort('CHANGE')}
                  className="flex items-center gap-1 hover:text-white mr-auto"
                >
                  <span>تغير 24h</span>
                  <ArrowUpDown size={11} />
                </button>
              </th>
              <th className="py-2.5 px-2 text-center font-semibold">15m</th>
              <th className="py-2.5 px-2 text-center font-semibold">1h</th>
              <th className="py-2.5 px-2 text-center font-semibold">4h</th>
              <th className="py-2.5 px-2.5 text-center font-semibold">
                <button
                  onClick={() => handleSort('CONFLUENCE')}
                  className="flex items-center justify-center gap-1 text-[#7da8ff] hover:text-white mx-auto"
                >
                  <span>نسبة التوافق</span>
                  <ArrowUpDown size={11} />
                </button>
              </th>
              <th className="py-2.5 px-2.5 text-center font-semibold font-sans text-white">
                هل أدخل الصفقة؟
              </th>
              <th className="py-2.5 px-2.5 text-center font-semibold">
                <button
                  onClick={() => handleSort('BANKER')}
                  className="flex items-center justify-center gap-1 hover:text-white mx-auto"
                >
                  <span>الحيتان</span>
                  <ArrowUpDown size={11} />
                </button>
              </th>
              <th className="py-2.5 px-2.5 text-center font-semibold">
                <button
                  onClick={() => handleSort('MFI')}
                  className="flex items-center justify-center gap-1 hover:text-white mx-auto"
                >
                  <span>MFI</span>
                  <ArrowUpDown size={11} />
                </button>
              </th>
              <th className="py-2.5 px-3 text-center font-semibold">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#18233a]">
            {paginatedTickers.map((ticker, index) => {
              const isSelected = selectedTicker?.symbol === ticker.symbol;
              const isChangePositive = ticker.priceChangePercent >= 0;
              const rankNum = (safePage - 1) * pageSize + index + 1;

              const dist15 = getDistancePercent(ticker.lastPrice, ticker.ema50_15m);
              const dist1h = getDistancePercent(ticker.lastPrice, ticker.ema50_1h);
              const dist4h = getDistancePercent(ticker.lastPrice, ticker.ema50_4h);

              const isSendingThis = sendingSymbol === ticker.symbol;
              const isSentThis = sentSymbol === ticker.symbol;

              const isLongVerdict =
                ticker.verdict === 'STRONG_LONG' || ticker.verdict === 'MODERATE_LONG';
              const isShortVerdict =
                ticker.verdict === 'STRONG_SHORT' || ticker.verdict === 'MODERATE_SHORT';

              return (
                <tr
                  key={ticker.symbol}
                  onClick={() => onSelectTicker(ticker)}
                  className={`cursor-pointer transition-colors group ${
                    isSelected
                      ? 'bg-[#18233a]/90 border-r-2 border-[#7da8ff]'
                      : 'hover:bg-[#162136]/60'
                  }`}
                >
                  {/* Symbol & Rank */}
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 w-5 text-center">
                        {rankNum}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-[#18233a] border border-[#2e4166] flex items-center justify-center font-mono font-bold text-[11px] text-white shrink-0">
                        {ticker.baseAsset.slice(0, 4)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 font-mono tracking-tight flex items-center gap-1.5">
                          <span>{ticker.displaySymbol}</span>
                          {ticker.volumeBurst >= 2.2 && (
                            <span
                              className="text-[10px] px-1 py-0.2 rounded bg-[#ffc66d]/15 text-[#ffc66d] border border-[#ffc66d]/30 flex items-center gap-0.5"
                              title={`انفجار فوليوم ${ticker.volumeBurst}x`}
                            >
                              <Zap size={9} />
                              {ticker.volumeBurst}x
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans truncate max-w-[100px]">
                          {ticker.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-2.5 px-3 text-left font-mono font-bold text-slate-100 whitespace-nowrap text-xs">
                    ${formatPrice(ticker.lastPrice)}
                  </td>

                  {/* 24h Change */}
                  <td className="py-2.5 px-3 text-left whitespace-nowrap">
                    <div
                      className={`inline-flex items-center gap-0.5 font-mono font-semibold px-1.5 py-0.5 rounded text-[11px] ${
                        isChangePositive
                          ? 'text-[#31d0a0] bg-[#31d0a0]/10 border border-[#31d0a0]/25'
                          : 'text-[#ff7085] bg-[#ff7085]/10 border border-[#ff7085]/25'
                      }`}
                    >
                      {isChangePositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      <span>
                        {isChangePositive ? '+' : ''}
                        {ticker.priceChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </td>

                  {/* 15m Trend */}
                  <td className="py-2.5 px-2 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold ${
                          ticker.trend15m === 'bull'
                            ? 'bg-[#31d0a0]/15 text-[#31d0a0] border border-[#31d0a0]/30'
                            : 'bg-[#ff7085]/15 text-[#ff7085] border border-[#ff7085]/30'
                        }`}
                      >
                        {ticker.trend15m === 'bull' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        <span>{ticker.trend15m === 'bull' ? 'صاعد' : 'هابط'}</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {dist15 >= 0 ? '+' : ''}
                        {dist15.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* 1h Trend */}
                  <td className="py-2.5 px-2 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold ${
                          ticker.trend1h === 'bull'
                            ? 'bg-[#31d0a0]/15 text-[#31d0a0] border border-[#31d0a0]/30'
                            : 'bg-[#ff7085]/15 text-[#ff7085] border border-[#ff7085]/30'
                        }`}
                      >
                        {ticker.trend1h === 'bull' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        <span>{ticker.trend1h === 'bull' ? 'صاعد' : 'هابط'}</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {dist1h >= 0 ? '+' : ''}
                        {dist1h.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* 4h Trend */}
                  <td className="py-2.5 px-2 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span
                        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold ${
                          ticker.trend4h === 'bull'
                            ? 'bg-[#31d0a0]/15 text-[#31d0a0] border border-[#31d0a0]/30'
                            : 'bg-[#ff7085]/15 text-[#ff7085] border border-[#ff7085]/30'
                        }`}
                      >
                        {ticker.trend4h === 'bull' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        <span>{ticker.trend4h === 'bull' ? 'صاعد' : 'هابط'}</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {dist4h >= 0 ? '+' : ''}
                        {dist4h.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Confluence Percentage */}
                  <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1 font-mono text-xs font-bold">
                        <span
                          className={
                            ticker.dominantDirection === 'LONG'
                              ? 'text-[#31d0a0]'
                              : ticker.dominantDirection === 'SHORT'
                              ? 'text-[#ff7085]'
                              : 'text-[#ffc66d]'
                          }
                        >
                          {ticker.confluencePercent}%
                        </span>
                        <span className="text-[10px] font-sans text-slate-400">
                          ({ticker.dominantDirection === 'LONG' ? 'صاعد' : ticker.dominantDirection === 'SHORT' ? 'هابط' : 'محايد'})
                        </span>
                      </div>
                      <div className="w-16 h-1.5 bg-[#0b1020] rounded-full overflow-hidden mt-1 border border-[#1f2d47]">
                        <div
                          style={{ width: `${ticker.confluencePercent}%` }}
                          className={`h-full ${
                            ticker.dominantDirection === 'LONG'
                              ? 'bg-[#31d0a0]'
                              : ticker.dominantDirection === 'SHORT'
                              ? 'bg-[#ff7085]'
                              : 'bg-[#ffc66d]'
                          }`}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Entry Verdict: هل أدخل الصفقة؟ */}
                  <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        ticker.verdict === 'STRONG_LONG'
                          ? 'bg-[#31d0a0] text-slate-950 shadow-sm'
                          : isLongVerdict
                          ? 'bg-[#31d0a0]/20 text-[#31d0a0] border border-[#31d0a0]/50'
                          : ticker.verdict === 'STRONG_SHORT'
                          ? 'bg-[#ff7085] text-white shadow-sm'
                          : isShortVerdict
                          ? 'bg-[#ff7085]/20 text-[#ff7085] border border-[#ff7085]/50'
                          : 'bg-[#18233a] text-slate-400 border border-[#2e4166]'
                      }`}
                    >
                      {ticker.verdictText}
                    </span>
                  </td>

                  {/* Banker MCDX */}
                  <td className="py-2.5 px-2.5 text-center whitespace-nowrap font-mono">
                    <span
                      className={`text-[11px] font-bold ${
                        ticker.mcdx.banker >= 70
                          ? 'text-[#7da8ff]'
                          : ticker.mcdx.banker >= 50
                          ? 'text-[#31d0a0]'
                          : 'text-slate-400'
                      }`}
                    >
                      {ticker.mcdx.banker.toFixed(0)}%
                    </span>
                  </td>

                  {/* MFI */}
                  <td className="py-2.5 px-2.5 text-center whitespace-nowrap font-mono">
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        ticker.mfi < 25
                          ? 'bg-[#31d0a0]/20 text-[#31d0a0] border border-[#31d0a0]/40'
                          : ticker.mfi > 75
                          ? 'bg-[#ff7085]/20 text-[#ff7085] border border-[#ff7085]/40'
                          : 'text-slate-300'
                      }`}
                    >
                      {ticker.mfi.toFixed(0)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicker(ticker);
                        }}
                        className="px-2 py-1 rounded bg-[#7da8ff]/15 hover:bg-[#7da8ff]/25 border border-[#7da8ff]/40 text-[#7da8ff] text-[11px] font-medium transition-colors"
                        title="تحليل في المختبر وتعبئة الحاسبة"
                      >
                        تحليل
                      </button>

                      <button
                        onClick={(e) => handleSendRowTelegram(e, ticker)}
                        disabled={isSendingThis}
                        className={`p-1.5 rounded border transition-colors ${
                          isSentThis
                            ? 'bg-[#31d0a0]/20 border-[#31d0a0] text-[#31d0a0]'
                            : 'bg-[#2aabee]/15 hover:bg-[#2aabee]/30 border-[#2aabee]/40 text-[#2aabee]'
                        }`}
                        title="إرسال تنبيه وقرار هذه العملة فوراً إلى تليجرام"
                      >
                        {isSentThis ? <Check size={12} /> : <Send size={12} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 py-2.5 bg-[#0f1626] border-t border-[#1f2d47] flex items-center justify-between text-xs font-mono">
          <div className="text-slate-400 font-sans">
            صفحة <span className="font-mono text-white font-bold">{safePage}</span> من{' '}
            <span className="font-mono text-white font-bold">{totalPages}</span> (إجمالي {filteredTickers.length} عملة)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-2.5 py-1 rounded bg-[#18233a] hover:bg-[#1f2d47] disabled:opacity-40 text-slate-200 flex items-center gap-1"
            >
              <ChevronRight size={14} />
              <span className="font-sans">السابق</span>
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-2.5 py-1 rounded bg-[#18233a] hover:bg-[#1f2d47] disabled:opacity-40 text-slate-200 flex items-center gap-1"
            >
              <span className="font-sans">التالي</span>
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
