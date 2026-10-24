/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MarketTicker, SavedTrade, SignalItem } from './types';
import {
  fetchLiveBinanceTickers,
  generateInstitutionalSignals,
} from './services/binanceService';
import { soundService } from './services/soundService';
import { telegramService } from './services/telegramService';
import { Header } from './components/Header';
import { AlignmentDecisionHub } from './components/AlignmentDecisionHub';
import { MtfMatrixTable } from './components/MtfMatrixTable';
import { McdxSmartMoneyTracker } from './components/McdxSmartMoneyTracker';
import { MfiOscillator } from './components/MfiOscillator';
import { OpportunityCalculator } from './components/OpportunityCalculator';
import { SignalsFeed } from './components/SignalsFeed';
import { StrategyGuideModal } from './components/StrategyGuideModal';
import { TradeJournalModal } from './components/TradeJournalModal';

export default function App() {
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<MarketTicker | null>(null);
  const [signals, setSignals] = useState<SignalItem[]>([]);
  const [btcMacro, setBtcMacro] = useState({
    status15m: 'BULLISH' as 'BULLISH' | 'BEARISH',
    status1h: 'BULLISH' as 'BULLISH' | 'BEARISH',
    price: 94850,
    ema100_15m: 93500,
    ema100_1h: 92100,
  });

  const [isLive, setIsLive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [telegramBotConnected, setTelegramBotConnected] = useState(false);

  const [autoTelegramEnabled, setAutoTelegramEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sosska_auto_telegram') === 'true';
    } catch {
      return false;
    }
  });

  const [savedTrades, setSavedTrades] = useState<SavedTrade[]>(() => {
    try {
      const saved = localStorage.getItem('sosska_saved_trades');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const prevSignalsCountRef = useRef<number>(0);

  useEffect(() => {
    telegramService.checkStatus().then((status) => {
      setTelegramBotConnected(Boolean(status.ok));
    });
  }, []);

  const handleToggleAutoTelegram = () => {
    const next = !autoTelegramEnabled;
    setAutoTelegramEnabled(next);
    try {
      localStorage.setItem('sosska_auto_telegram', String(next));
    } catch {
      // ignore
    }
  };

  const loadMarketData = useCallback(
    async (manual = false) => {
      if (manual) setIsRefreshing(true);
      try {
        const result = await fetchLiveBinanceTickers();
        setTickers(result.tickers);
        setBtcMacro(result.btcMacro);
        setIsLive(result.isLive);

        setSelectedTicker((curr) => {
          if (!curr && result.tickers.length > 0) {
            return result.tickers[0];
          }
          if (curr) {
            const match = result.tickers.find((t) => t.symbol === curr.symbol);
            return match || curr;
          }
          return null;
        });

        const newSignals = generateInstitutionalSignals(result.tickers);
        setSignals(newSignals);

        if (prevSignalsCountRef.current > 0 && newSignals.length > prevSignalsCountRef.current) {
          const topSignal = newSignals[0];
          if (topSignal) {
            soundService.playSignalAlert(topSignal.type);
          }
        }
        prevSignalsCountRef.current = newSignals.length;

        if (autoTelegramEnabled && newSignals.length > 0) {
          const unsentTop = newSignals.find((s) => !telegramService.hasSentSignal(s.id));
          if (unsentTop) {
            telegramService.markSignalSent(unsentTop.id);
            const msg = telegramService.formatSignalForTelegram(unsentTop);
            telegramService.sendMessage(msg);
          }
        }
      } catch (err) {
        console.error('Error fetching market data:', err);
      } finally {
        if (manual) {
          setTimeout(() => setIsRefreshing(false), 300);
        }
      }
    },
    [autoTelegramEnabled]
  );

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadMarketData();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadMarketData]);

  const handleSaveTrade = (trade: SavedTrade) => {
    const next = [trade, ...savedTrades];
    setSavedTrades(next);
    try {
      localStorage.setItem('sosska_saved_trades', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleDeleteTrade = (id: string) => {
    const next = savedTrades.filter((t) => t.id !== id);
    setSavedTrades(next);
    try {
      localStorage.setItem('sosska_saved_trades', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const handleClearAllTrades = () => {
    setSavedTrades([]);
    try {
      localStorage.removeItem('sosska_saved_trades');
    } catch {
      // ignore
    }
  };

  const handleLoadSignalIntoCalculator = (signal: SignalItem) => {
    const matchingTicker = tickers.find((t) => t.symbol === signal.symbol);
    if (matchingTicker) {
      setSelectedTicker(matchingTicker);
    }
    const calcEl = document.getElementById('opportunity-calculator-section');
    if (calcEl) {
      calcEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSendCoinAlertToTelegram = async (ticker: MarketTicker): Promise<boolean> => {
    const isBull = ticker.dominantDirection !== 'SHORT';
    const decimals = ticker.lastPrice < 0.001 ? 7 : ticker.lastPrice < 1 ? 5 : 3;
    const entry = ticker.lastPrice;
    const atr = ticker.atr14;
    const sl = isBull
      ? Number(Math.max(0.0000001, entry - 1.8 * atr).toFixed(decimals))
      : Number((entry + 1.8 * atr).toFixed(decimals));
    const tp1 = isBull
      ? Number((entry + 2.5 * atr).toFixed(decimals))
      : Number(Math.max(0.0000001, entry - 2.5 * atr).toFixed(decimals));
    const tp2 = isBull
      ? Number((entry + 5.0 * atr).toFixed(decimals))
      : Number(Math.max(0.0000001, entry - 5.0 * atr).toFixed(decimals));

    const tempSignal: SignalItem = {
      id: `manual-${ticker.symbol}-${Date.now()}`,
      symbol: ticker.symbol,
      displaySymbol: ticker.displaySymbol,
      type: isBull ? 'LONG' : 'SHORT',
      title: `نسبة التوافق ${ticker.confluencePercent}% — القرار: ${ticker.verdictText}`,
      reason: ticker.verdictReason,
      timeframe: '15m / 1h / 4h',
      entryPrice: entry,
      sl,
      tp1,
      tp2,
      atr,
      volumeBurst: ticker.volumeBurst,
      bankerDominance: ticker.mcdx.banker,
      mfiValue: ticker.mfi,
      confluencePercent: ticker.confluencePercent,
      verdictText: ticker.verdictText,
      status: 'ACTIVE',
      timestamp: Date.now(),
    };

    const msg = telegramService.formatSignalForTelegram(tempSignal);
    const res = await telegramService.sendMessage(msg);
    return res.ok;
  };

  const handleSendPulseReportToTelegram = async (): Promise<boolean> => {
    const msg = telegramService.formatMarketPulseSummary(tickers, btcMacro, signals);
    const res = await telegramService.sendMessage(msg);
    return res.ok;
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-slate-100 flex flex-col font-sans selection:bg-[#7da8ff]/30 selection:text-white">
      {/* 1. Market Pulse Top Header */}
      <Header
        btcMacro={btcMacro}
        isLive={isLive}
        isRefreshing={isRefreshing}
        countdown={countdown}
        onRefreshManual={() => {
          setCountdown(10);
          loadMarketData(true);
        }}
        onOpenJournal={() => setIsJournalOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        journalCount={savedTrades.length}
        onSendPulseReportToTelegram={handleSendPulseReportToTelegram}
        telegramBotConnected={telegramBotConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-3 sm:p-4 lg:p-6 space-y-5">
        {/* Section A: Bullish vs Bearish Alignment & Trade Entry Decision Hub */}
        <section aria-label="قسم التوافق الصاعد والتوافق الهابط ومستشار القرار">
          <AlignmentDecisionHub
            tickers={tickers}
            selectedTicker={selectedTicker}
            onSelectTicker={(ticker) => setSelectedTicker(ticker)}
            onSendCoinAlertToTelegram={handleSendCoinAlertToTelegram}
          />
        </section>

        {/* Section B: 100-Coin Multi-Timeframe Trend Matrix */}
        <section aria-label="مصفوفة الفريمات المتعددة لـ 100 عملة">
          <MtfMatrixTable
            tickers={tickers}
            selectedTicker={selectedTicker}
            onSelectTicker={(ticker) => setSelectedTicker(ticker)}
            onSendCoinAlertToTelegram={handleSendCoinAlertToTelegram}
          />
        </section>

        {/* Section C: Institutional Flow & Saturation (2 Column Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5" aria-label="تحليل السيولة والتشبع المؤسسي">
          <McdxSmartMoneyTracker
            ticker={selectedTicker}
            allTickers={tickers}
            onSelectTicker={(ticker) => setSelectedTicker(ticker)}
          />

          <MfiOscillator ticker={selectedTicker} />
        </section>

        {/* Section D: Opportunity Lab & Live Signals Feed (2 Column Grid) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5" aria-label="مختبر الفرص وسجل التنبيهات">
          <div id="opportunity-calculator-section" className="lg:col-span-7">
            <OpportunityCalculator
              selectedTicker={selectedTicker}
              onSaveTrade={handleSaveTrade}
            />
          </div>

          <div className="lg:col-span-5">
            <SignalsFeed
              signals={signals}
              onLoadSignal={handleLoadSignalIntoCalculator}
              autoTelegramEnabled={autoTelegramEnabled}
              onToggleAutoTelegram={handleToggleAutoTelegram}
            />
          </div>
        </section>
      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-[#1f2d47] bg-[#0c1220] py-3.5 px-4 lg:px-6 text-xs text-slate-400">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-200">
              SOSSKA1 100-Coin Screener &amp; Opportunity Lab
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-sans text-[11px]">
              مسح مؤسسي مباشر لـ 100 عملة رقمية مربوط ببوت تليجرام
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className={`w-2 h-2 rounded-full ${telegramBotConnected ? 'bg-[#2aabee]' : 'bg-[#ffc66d]'}`} />
              Telegram Bot {telegramBotConnected ? 'Connected' : 'Ready'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-[#31d0a0]" />
              Binance 100-Pair Engine (10s)
            </span>
          </div>
        </div>
      </footer>

      <StrategyGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <TradeJournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        trades={savedTrades}
        onDeleteTrade={handleDeleteTrade}
        onClearAll={handleClearAllTrades}
      />
    </div>
  );
}
