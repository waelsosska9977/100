export type Timeframe = '15m' | '1h' | '4h';

export type SignalType = 'LONG' | 'SHORT';

export type TradeVerdictType =
  | 'STRONG_LONG'
  | 'MODERATE_LONG'
  | 'STRONG_SHORT'
  | 'MODERATE_SHORT'
  | 'NO_TRADE';

export type CrossoverEntryStatus = 'OPTIMAL' | 'CONTINUATION' | 'LATE' | 'REVERSAL';

export interface CrossoverMoveInfo {
  direction: 1 | -1;          // 1 = Bullish Cross (EMA 5 > EMA 15), -1 = Bearish Cross (EMA 5 < EMA 15)
  crossTypeLabel: string;     // 'صاعد 🟢' | 'هابط 🔴'
  crossPrice: number;         // Close price of the crossover candle
  barsAgo: number;            // Number of 15m candles elapsed since crossover
  pointsMove: number;         // (currentClose - crossPrice) * direction
  pctMove: number;            // (pointsMove / crossPrice) * 100
  atrMove: number;            // pointsMove / currentATR
  ema5_15m: number;
  ema15_15m: number;
  entryStatus: CrossoverEntryStatus;
  entryStatusText: string;    // '🎯 بداية الحركة (دخول مثالي)' | '⚡ حركة مستمرة' | '⚠️ متأخرة / تشبعت' | '🔄 انعكاس ضد التقاطع'
  entryStatusColor: string;   // '#31d0a0' | '#ffc66d' | '#ff7085' | '#7da8ff'
}

export interface ConfluenceChecklistItem {
  label: string;
  passed: boolean;
  detail: string;
  weight: number;
}

export interface MarketTicker {
  symbol: string;           // e.g. 'BTCUSDT'
  displaySymbol: string;    // e.g. 'BTC/USDT'
  baseAsset: string;        // e.g. 'BTC'
  name: string;             // e.g. 'Bitcoin'
  lastPrice: number;
  prevPrice: number;
  priceChange: number;
  priceChangePercent: number;
  highPrice: number;
  lowPrice: number;
  volume: number;           // 24h Base Volume
  quoteVolume: number;      // 24h Quote Volume in USDT
  // Technicals
  ema50_15m: number;
  ema50_1h: number;
  ema50_4h: number;
  ema100_15m: number;
  ema100_1h: number;
  atr14: number;
  mfi: number;              // Money Flow Index (0 - 100)
  mcdx: {
    banker: number;         // Institutional / Banker Flow % (0 - 100)
    retail: number;         // Retail Volume % (0 - 100)
    hotMoney: number;       // Hot / Speculative Money % (0 - 100)
  };
  trend15m: 'bull' | 'bear';
  trend1h: 'bull' | 'bear';
  trend4h: 'bull' | 'bear';
  alignmentScore: number;   // 0 to 3 (bullish score)
  volumeBurst: number;      // Multiplier vs 20-period avg volume (e.g. 2.8x)
  // 15m EMA 5 / EMA 15 Crossover Move Tracker
  crossoverMove: CrossoverMoveInfo;
  // Analysis Confluence & Decision Engine
  bullishConfluence: number; // 0 - 100%
  bearishConfluence: number; // 0 - 100%
  dominantDirection: 'LONG' | 'SHORT' | 'NEUTRAL';
  confluencePercent: number; // Dominant confluence % (0 - 100%)
  verdict: TradeVerdictType;
  verdictText: string;       // e.g. 'ادخل شراء بقوة' | 'لا تدخل - انتظر'
  verdictReason: string;
  checklist: ConfluenceChecklistItem[];
  lastUpdated: number;
}

export interface SignalItem {
  id: string;
  symbol: string;
  displaySymbol: string;
  type: SignalType;
  title: string;
  reason: string;
  timeframe: string;
  entryPrice: number;
  sl: number;
  tp1: number;
  tp2: number;
  atr: number;
  volumeBurst: number;
  bankerDominance: number;
  mfiValue: number;
  confluencePercent?: number;
  verdictText?: string;
  crossoverMove?: CrossoverMoveInfo;
  status: 'ACTIVE' | 'TP1_HIT' | 'TP2_HIT' | 'SL_HIT';
  timestamp: number;
}

export interface CalculatorState {
  symbol: string;
  direction: SignalType;
  entryPrice: number;
  atr: number;
  capital: number;
  riskPercent: number;
}

export interface CalculatorResult {
  entryPrice: number;
  sl: number;
  tp1: number;
  tp2: number;
  slDistancePercent: number;
  tp1DistancePercent: number;
  tp2DistancePercent: number;
  riskAmountUsd: number;
  positionSizeUsd: number;
  positionSizeUnits: number;
  rrTp1: number;
  rrTp2: number;
}

export interface SavedTrade {
  id: string;
  timestamp: number;
  symbol: string;
  direction: SignalType;
  entryPrice: number;
  sl: number;
  tp1: number;
  tp2: number;
  positionSizeUsd: number;
  riskAmountUsd: number;
  capital: number;
  riskPercent: number;
  note?: string;
}
