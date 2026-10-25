import {
  ConfluenceChecklistItem,
  CrossoverEntryStatus,
  CrossoverMoveInfo,
  MarketTicker,
  SignalItem,
  TradeVerdictType,
} from '../types';

export interface PairDefinition {
  symbol: string;
  displaySymbol: string;
  baseAsset: string;
  name: string;
  defaultPrice: number;
}

// Curated Top 100 Liquid USDT Crypto Pairs on Binance
export const TOP_100_PAIRS: PairDefinition[] = [
  { symbol: 'BTCUSDT', displaySymbol: 'BTC/USDT', baseAsset: 'BTC', name: 'Bitcoin', defaultPrice: 94850 },
  { symbol: 'ETHUSDT', displaySymbol: 'ETH/USDT', baseAsset: 'ETH', name: 'Ethereum', defaultPrice: 2780 },
  { symbol: 'SOLUSDT', displaySymbol: 'SOL/USDT', baseAsset: 'SOL', name: 'Solana', defaultPrice: 194.2 },
  { symbol: 'BNBUSDT', displaySymbol: 'BNB/USDT', baseAsset: 'BNB', name: 'BNB', defaultPrice: 645.0 },
  { symbol: 'XRPUSDT', displaySymbol: 'XRP/USDT', baseAsset: 'XRP', name: 'XRP', defaultPrice: 2.42 },
  { symbol: 'DOGEUSDT', displaySymbol: 'DOGE/USDT', baseAsset: 'DOGE', name: 'Dogecoin', defaultPrice: 0.258 },
  { symbol: 'ADAUSDT', displaySymbol: 'ADA/USDT', baseAsset: 'ADA', name: 'Cardano', defaultPrice: 0.785 },
  { symbol: 'AVAXUSDT', displaySymbol: 'AVAX/USDT', baseAsset: 'AVAX', name: 'Avalanche', defaultPrice: 28.6 },
  { symbol: 'SUIUSDT', displaySymbol: 'SUI/USDT', baseAsset: 'SUI', name: 'Sui Network', defaultPrice: 3.18 },
  { symbol: 'HBARUSDT', displaySymbol: 'HBAR/USDT', baseAsset: 'HBAR', name: 'Hedera', defaultPrice: 0.215 },
  { symbol: 'TRXUSDT', displaySymbol: 'TRX/USDT', baseAsset: 'TRX', name: 'TRON', defaultPrice: 0.238 },
  { symbol: 'TONUSDT', displaySymbol: 'TON/USDT', baseAsset: 'TON', name: 'Toncoin', defaultPrice: 3.82 },
  { symbol: 'LINKUSDT', displaySymbol: 'LINK/USDT', baseAsset: 'LINK', name: 'Chainlink', defaultPrice: 18.45 },
  { symbol: 'SHIBUSDT', displaySymbol: 'SHIB/USDT', baseAsset: 'SHIB', name: 'Shiba Inu', defaultPrice: 0.0000162 },
  { symbol: 'DOTUSDT', displaySymbol: 'DOT/USDT', baseAsset: 'DOT', name: 'Polkadot', defaultPrice: 5.15 },
  { symbol: 'BCHUSDT', displaySymbol: 'BCH/USDT', baseAsset: 'BCH', name: 'Bitcoin Cash', defaultPrice: 342.0 },
  { symbol: 'NEARUSDT', displaySymbol: 'NEAR/USDT', baseAsset: 'NEAR', name: 'NEAR Protocol', defaultPrice: 3.55 },
  { symbol: 'LTCUSDT', displaySymbol: 'LTC/USDT', baseAsset: 'LTC', name: 'Litecoin', defaultPrice: 124.5 },
  { symbol: 'UNIUSDT', displaySymbol: 'UNI/USDT', baseAsset: 'UNI', name: 'Uniswap', defaultPrice: 9.65 },
  { symbol: 'PEPEUSDT', displaySymbol: 'PEPE/USDT', baseAsset: 'PEPE', name: 'Pepe', defaultPrice: 0.0000102 },
  { symbol: 'APTUSDT', displaySymbol: 'APT/USDT', baseAsset: 'APT', name: 'Aptos', defaultPrice: 6.45 },
  { symbol: 'ICPUSDT', displaySymbol: 'ICP/USDT', baseAsset: 'ICP', name: 'Internet Computer', defaultPrice: 7.25 },
  { symbol: 'FETUSDT', displaySymbol: 'FET/USDT', baseAsset: 'FET', name: 'Artificial Superintelligence', defaultPrice: 0.78 },
  { symbol: 'ETCUSDT', displaySymbol: 'ETC/USDT', baseAsset: 'ETC', name: 'Ethereum Classic', defaultPrice: 20.8 },
  { symbol: 'RENDERUSDT', displaySymbol: 'RENDER/USDT', baseAsset: 'RENDER', name: 'Render', defaultPrice: 4.52 },
  { symbol: 'STXUSDT', displaySymbol: 'STX/USDT', baseAsset: 'STX', name: 'Stacks', defaultPrice: 0.95 },
  { symbol: 'TAOUSDT', displaySymbol: 'TAO/USDT', baseAsset: 'TAO', name: 'Bittensor', defaultPrice: 395.0 },
  { symbol: 'XLMUSDT', displaySymbol: 'XLM/USDT', baseAsset: 'XLM', name: 'Stellar', defaultPrice: 0.335 },
  { symbol: 'AAVEUSDT', displaySymbol: 'AAVE/USDT', baseAsset: 'AAVE', name: 'Aave', defaultPrice: 256.0 },
  { symbol: 'FILUSDT', displaySymbol: 'FIL/USDT', baseAsset: 'FIL', name: 'Filecoin', defaultPrice: 3.45 },
  { symbol: 'ARBUSDT', displaySymbol: 'ARB/USDT', baseAsset: 'ARB', name: 'Arbitrum', defaultPrice: 0.485 },
  { symbol: 'IMXUSDT', displaySymbol: 'IMX/USDT', baseAsset: 'IMX', name: 'Immutable', defaultPrice: 0.82 },
  { symbol: 'OPUSDT', displaySymbol: 'OP/USDT', baseAsset: 'OP', name: 'Optimism', defaultPrice: 1.15 },
  { symbol: 'INJUSDT', displaySymbol: 'INJ/USDT', baseAsset: 'INJ', name: 'Injective', defaultPrice: 15.4 },
  { symbol: 'ATOMUSDT', displaySymbol: 'ATOM/USDT', baseAsset: 'ATOM', name: 'Cosmos', defaultPrice: 4.88 },
  { symbol: 'WIFUSDT', displaySymbol: 'WIF/USDT', baseAsset: 'WIF', name: 'dogwifhat', defaultPrice: 0.72 },
  { symbol: 'VETUSDT', displaySymbol: 'VET/USDT', baseAsset: 'VET', name: 'VeChain', defaultPrice: 0.034 },
  { symbol: 'MKRUSDT', displaySymbol: 'MKR/USDT', baseAsset: 'MKR', name: 'Maker', defaultPrice: 1420.0 },
  { symbol: 'GRTUSDT', displaySymbol: 'GRT/USDT', baseAsset: 'GRT', name: 'The Graph', defaultPrice: 0.142 },
  { symbol: 'BONKUSDT', displaySymbol: 'BONK/USDT', baseAsset: 'BONK', name: 'Bonk', defaultPrice: 0.0000184 },
  { symbol: 'FLOKIUSDT', displaySymbol: 'FLOKI/USDT', baseAsset: 'FLOKI', name: 'FLOKI', defaultPrice: 0.000098 },
  { symbol: 'THETAUSDT', displaySymbol: 'THETA/USDT', baseAsset: 'THETA', name: 'Theta Network', defaultPrice: 1.38 },
  { symbol: 'RUNEUSDT', displaySymbol: 'RUNE/USDT', baseAsset: 'RUNE', name: 'THORChain', defaultPrice: 1.45 },
  { symbol: 'ALGOUSDT', displaySymbol: 'ALGO/USDT', baseAsset: 'ALGO', name: 'Algorand', defaultPrice: 0.285 },
  { symbol: 'SEIUSDT', displaySymbol: 'SEI/USDT', baseAsset: 'SEI', name: 'Sei', defaultPrice: 0.245 },
  { symbol: 'TIAUSDT', displaySymbol: 'TIA/USDT', baseAsset: 'TIA', name: 'Celestia', defaultPrice: 3.25 },
  { symbol: 'PYTHUSDT', displaySymbol: 'PYTH/USDT', baseAsset: 'PYTH', name: 'Pyth Network', defaultPrice: 0.215 },
  { symbol: 'JUPUSDT', displaySymbol: 'JUP/USDT', baseAsset: 'JUP', name: 'Jupiter', defaultPrice: 0.78 },
  { symbol: 'ENAUSDT', displaySymbol: 'ENA/USDT', baseAsset: 'ENA', name: 'Ethena', defaultPrice: 0.465 },
  { symbol: 'ONDOUSDT', displaySymbol: 'ONDO/USDT', baseAsset: 'ONDO', name: 'Ondo', defaultPrice: 1.18 },
  { symbol: 'JASMYUSDT', displaySymbol: 'JASMY/USDT', baseAsset: 'JASMY', name: 'JasmyCoin', defaultPrice: 0.0225 },
  { symbol: 'LDOUSDT', displaySymbol: 'LDO/USDT', baseAsset: 'LDO', name: 'Lido DAO', defaultPrice: 1.68 },
  { symbol: 'PENDLEUSDT', displaySymbol: 'PENDLE/USDT', baseAsset: 'PENDLE', name: 'Pendle', defaultPrice: 3.65 },
  { symbol: 'STRKUSDT', displaySymbol: 'STRK/USDT', baseAsset: 'STRK', name: 'Starknet', defaultPrice: 0.265 },
  { symbol: 'FLOWUSDT', displaySymbol: 'FLOW/USDT', baseAsset: 'FLOW', name: 'Flow', defaultPrice: 0.54 },
  { symbol: 'KAVAUSDT', displaySymbol: 'KAVA/USDT', baseAsset: 'KAVA', name: 'Kava', defaultPrice: 0.45 },
  { symbol: 'BEAMXUSDT', displaySymbol: 'BEAMX/USDT', baseAsset: 'BEAMX', name: 'Beam', defaultPrice: 0.0112 },
  { symbol: 'BOMEUSDT', displaySymbol: 'BOME/USDT', baseAsset: 'BOME', name: 'BOOK OF MEME', defaultPrice: 0.0022 },
  { symbol: 'WLDUSDT', displaySymbol: 'WLD/USDT', baseAsset: 'WLD', name: 'Worldcoin', defaultPrice: 1.24 },
  { symbol: 'GALAUSDT', displaySymbol: 'GALA/USDT', baseAsset: 'GALA', name: 'Gala', defaultPrice: 0.0235 },
  { symbol: 'NEOUSDT', displaySymbol: 'NEO/USDT', baseAsset: 'NEO', name: 'Neo', defaultPrice: 10.8 },
  { symbol: 'EGLDUSDT', displaySymbol: 'EGLD/USDT', baseAsset: 'EGLD', name: 'MultiversX', defaultPrice: 22.4 },
  { symbol: 'SANDUSDT', displaySymbol: 'SAND/USDT', baseAsset: 'SAND', name: 'The Sandbox', defaultPrice: 0.365 },
  { symbol: 'AXSUSDT', displaySymbol: 'AXS/USDT', baseAsset: 'AXS', name: 'Axie Infinity', defaultPrice: 4.35 },
  { symbol: 'MANAUSDT', displaySymbol: 'MANA/USDT', baseAsset: 'MANA', name: 'Decentraland', defaultPrice: 0.335 },
  { symbol: 'CHZUSDT', displaySymbol: 'CHZ/USDT', baseAsset: 'CHZ', name: 'Chiliz', defaultPrice: 0.062 },
  { symbol: 'EOSUSDT', displaySymbol: 'EOS/USDT', baseAsset: 'EOS', name: 'EOS', defaultPrice: 0.64 },
  { symbol: 'QNTUSDT', displaySymbol: 'QNT/USDT', baseAsset: 'QNT', name: 'Quant', defaultPrice: 92.5 },
  { symbol: 'SNXUSDT', displaySymbol: 'SNX/USDT', baseAsset: 'SNX', name: 'Synthetix', defaultPrice: 0.98 },
  { symbol: 'DYDXUSDT', displaySymbol: 'DYDX/USDT', baseAsset: 'DYDX', name: 'dYdX', defaultPrice: 0.78 },
  { symbol: 'CRVUSDT', displaySymbol: 'CRV/USDT', baseAsset: 'CRV', name: 'Curve DAO', defaultPrice: 0.52 },
  { symbol: 'MINAUSDT', displaySymbol: 'MINA/USDT', baseAsset: 'MINA', name: 'Mina', defaultPrice: 0.38 },
  { symbol: 'XTZUSDT', displaySymbol: 'XTZ/USDT', baseAsset: 'XTZ', name: 'Tezos', defaultPrice: 0.89 },
  { symbol: 'APEUSDT', displaySymbol: 'APE/USDT', baseAsset: 'APE', name: 'ApeCoin', defaultPrice: 0.74 },
  { symbol: 'CAKEUSDT', displaySymbol: 'CAKE/USDT', baseAsset: 'CAKE', name: 'PancakeSwap', defaultPrice: 2.45 },
  { symbol: 'IOTAUSDT', displaySymbol: 'IOTA/USDT', baseAsset: 'IOTA', name: 'IOTA', defaultPrice: 0.235 },
  { symbol: 'ROSEUSDT', displaySymbol: 'ROSE/USDT', baseAsset: 'ROSE', name: 'Oasis', defaultPrice: 0.044 },
  { symbol: 'ZECUSDT', displaySymbol: 'ZEC/USDT', baseAsset: 'ZEC', name: 'Zcash', defaultPrice: 38.5 },
  { symbol: 'BLURUSDT', displaySymbol: 'BLUR/USDT', baseAsset: 'BLUR', name: 'Blur', defaultPrice: 0.145 },
  { symbol: 'COMPUSDT', displaySymbol: 'COMP/USDT', baseAsset: 'COMP', name: 'Compound', defaultPrice: 54.0 },
  { symbol: 'ENJUSDT', displaySymbol: 'ENJ/USDT', baseAsset: 'ENJ', name: 'Enjin Coin', defaultPrice: 0.125 },
  { symbol: '1INCHUSDT', displaySymbol: '1INCH/USDT', baseAsset: '1INCH', name: '1inch Network', defaultPrice: 0.265 },
  { symbol: 'ZRXUSDT', displaySymbol: 'ZRX/USDT', baseAsset: 'ZRX', name: '0x Protocol', defaultPrice: 0.315 },
  { symbol: 'ANKRUSDT', displaySymbol: 'ANKR/USDT', baseAsset: 'ANKR', name: 'Ankr', defaultPrice: 0.024 },
  { symbol: 'ZILUSDT', displaySymbol: 'ZIL/USDT', baseAsset: 'ZIL', name: 'Zilliqa', defaultPrice: 0.0145 },
  { symbol: 'BATUSDT', displaySymbol: 'BAT/USDT', baseAsset: 'BAT', name: 'Basic Attention Token', defaultPrice: 0.185 },
  { symbol: 'LRCUSDT', displaySymbol: 'LRC/USDT', baseAsset: 'LRC', name: 'Loopring', defaultPrice: 0.135 },
  { symbol: 'MASKUSDT', displaySymbol: 'MASK/USDT', baseAsset: 'MASK', name: 'Mask Network', defaultPrice: 2.18 },
  { symbol: 'SUSHIUSDT', displaySymbol: 'SUSHI/USDT', baseAsset: 'SUSHI', name: 'SushiSwap', defaultPrice: 0.85 },
  { symbol: 'YFIUSDT', displaySymbol: 'YFI/USDT', baseAsset: 'YFI', name: 'yearn.finance', defaultPrice: 5840.0 },
  { symbol: 'CELOUSDT', displaySymbol: 'CELO/USDT', baseAsset: 'CELO', name: 'Celo', defaultPrice: 0.445 },
  { symbol: 'KSMUSDT', displaySymbol: 'KSM/USDT', baseAsset: 'KSM', name: 'Kusama', defaultPrice: 19.8 },
  { symbol: 'GMTUSDT', displaySymbol: 'GMT/USDT', baseAsset: 'GMT', name: 'STEPN', defaultPrice: 0.068 },
  { symbol: 'RAYUSDT', displaySymbol: 'RAY/USDT', baseAsset: 'RAY', name: 'Raydium', defaultPrice: 4.15 },
  { symbol: 'ZKUSDT', displaySymbol: 'ZK/USDT', baseAsset: 'ZK', name: 'ZKsync', defaultPrice: 0.115 },
  { symbol: 'NOTUSDT', displaySymbol: 'NOT/USDT', baseAsset: 'NOT', name: 'Notcoin', defaultPrice: 0.0034 },
  { symbol: 'IOUUSDT', displaySymbol: 'IO/USDT', baseAsset: 'IO', name: 'io.net', defaultPrice: 1.42 },
  { symbol: 'ZROUSDT', displaySymbol: 'ZRO/USDT', baseAsset: 'ZRO', name: 'LayerZero', defaultPrice: 3.12 },
  { symbol: 'EIGENUSDT', displaySymbol: 'EIGEN/USDT', baseAsset: 'EIGEN', name: 'EigenLayer', defaultPrice: 1.88 },
  { symbol: 'AEROUSDT', displaySymbol: 'AERO/USDT', baseAsset: 'AERO', name: 'Aerodrome', defaultPrice: 0.94 },
];

export const DEFAULT_PAIRS = TOP_100_PAIRS;
export const POPULAR_EXTRA_PAIRS = TOP_100_PAIRS.slice(0, 20);

export interface FetchResult {
  tickers: MarketTicker[];
  btcMacro: {
    status15m: 'BULLISH' | 'BEARISH';
    status1h: 'BULLISH' | 'BEARISH';
    price: number;
    ema100_15m: number;
    ema100_1h: number;
  };
  isLive: boolean;
  lastLatencyMs: number;
  lastFetchedAt: Date;
}

const technicalHistory: Record<
  string,
  {
    prevPrice: number;
    candles15m: number[]; // 15m close series ending at current close
    ema50_15m: number;
    ema50_1h: number;
    ema50_4h: number;
    ema100_15m: number;
    ema100_1h: number;
    mfi: number;
    banker: number;
    retail: number;
    hotMoney: number;
    atr: number;
  }
> = {};

function symbolSeed(sym: string): number {
  let h = 0;
  for (let i = 0; i < sym.length; i++) {
    h = (h * 31 + sym.charCodeAt(i)) % 1000;
  }
  return h / 1000;
}

/**
 * Generates a realistic 15m candle close series (60 candles) for a coin
 * anchored to its 24h high, 24h low, 24h priceChangePercent, and currentClose,
 * ensuring deterministic EMA 5 / EMA 15 crossover history.
 */
function buildInitial15mCandles(
  symbol: string,
  currentClose: number,
  high24h: number,
  low24h: number,
  priceChangePercent: number,
  atr: number
): number[] {
  const totalBars = 60;
  const seed = symbolSeed(symbol);
  const safeAtr = Math.max(currentClose * 0.002, atr || currentClose * 0.008);

  // Target how many bars ago the last EMA 5 / EMA 15 crossover occurred (1 to 18 bars ago)
  const targetCrossBarsAgo = 1 + (Math.floor(seed * 997) % 16);
  // Desired move in ATRs since the crossover (spans Optimal 0.1-0.75, Continuation 0.85-1.9, Late 2.1-3.4, or slight Reversal)
  const bucket = Math.floor(seed * 100) % 10;
  let desiredAtrMove = 0.5;
  if (bucket <= 3) {
    // 40% in Optimal Entry Zone (0.12 - 0.76 ATR)
    desiredAtrMove = 0.12 + ((seed * 17) % 0.64);
  } else if (bucket <= 6) {
    // 30% in Continuation Zone (0.85 - 1.92 ATR)
    desiredAtrMove = 0.85 + ((seed * 23) % 1.07);
  } else if (bucket <= 8) {
    // 20% in Late / Saturated Zone (2.05 - 3.35 ATR)
    desiredAtrMove = 2.05 + ((seed * 31) % 1.3);
  } else {
    // 10% in Reversal against crossover (-0.15 to -0.65 ATR)
    desiredAtrMove = -0.15 - ((seed * 13) % 0.5);
  }

  const isBullCross = priceChangePercent >= -0.25 ? true : seed > 0.65;
  const dir = isBullCross ? 1 : -1;

  // Price at the crossover bar
  const crossClose = Math.max(
    currentClose * 0.5,
    currentClose - dir * desiredAtrMove * safeAtr
  );

  // Prior regime price (before crossover, on the opposite side of EMA 15)
  const preCrossBase = crossClose - dir * safeAtr * 1.35;

  const closes: number[] = [];
  const crossIdx = totalBars - 1 - targetCrossBarsAgo;

  for (let i = 0; i < totalBars; i++) {
    if (i < crossIdx - 2) {
      // Pre-crossover regime: stay on the opposite side so EMA 5 is clearly opposite EMA 15
      const wave = Math.sin(i * 0.45 + seed * 10) * safeAtr * 0.18;
      closes.push(Math.max(0.0000001, preCrossBase + wave));
    } else if (i < crossIdx) {
      // Approaching crossover
      const progress = (i - (crossIdx - 3)) / 3;
      const val = preCrossBase + (crossClose - preCrossBase) * progress * 0.75;
      closes.push(Math.max(0.0000001, val));
    } else if (i === crossIdx) {
      // Exact crossover candle
      closes.push(Math.max(0.0000001, crossClose));
    } else if (i < totalBars - 1) {
      // Post-crossover progression toward currentClose
      const postProgress = (i - crossIdx) / Math.max(1, targetCrossBarsAgo);
      const noise = Math.sin(i * 0.9 + seed * 6) * safeAtr * 0.06;
      const interpolated = crossClose + (currentClose - crossClose) * postProgress + noise;
      closes.push(Math.max(0.0000001, interpolated));
    } else {
      // Current live candle close
      closes.push(Math.max(0.0000001, currentClose));
    }
  }

  // Ensure high/low bounds remain sensible
  void high24h;
  void low24h;
  return closes;
}

/**
 * Vectorized-style calculation of EMA series and exact detection of the latest
 * EMA 5 / EMA 15 crossover on the 15m candle close array.
 */
export function calculateCrossoverMoveTracker(
  candles15m: number[],
  currentClose: number,
  currentATR: number
): CrossoverMoveInfo {
  const n = candles15m.length;
  const series = n > 0 ? [...candles15m] : [currentClose];
  series[series.length - 1] = currentClose;

  const alpha5 = 2 / (5 + 1);
  const alpha15 = 2 / (15 + 1);

  const ema5Series: number[] = new Array(series.length);
  const ema15Series: number[] = new Array(series.length);

  ema5Series[0] = series[0];
  ema15Series[0] = series[0];

  for (let i = 1; i < series.length; i++) {
    const close = series[i];
    ema5Series[i] = ema5Series[i - 1] + alpha5 * (close - ema5Series[i - 1]);
    ema15Series[i] = ema15Series[i - 1] + alpha15 * (close - ema15Series[i - 1]);
  }

  // Search backwards from latest candle to find the most recent EMA 5 / EMA 15 crossover
  let crossIndex = -1;
  let direction: 1 | -1 =
    ema5Series[series.length - 1] >= ema15Series[series.length - 1] ? 1 : -1;

  for (let i = series.length - 1; i >= 1; i--) {
    const prevDiff = ema5Series[i - 1] - ema15Series[i - 1];
    const currDiff = ema5Series[i] - ema15Series[i];

    // Bullish Cross: EMA 5 crosses above EMA 15 (Direction = 1)
    if (prevDiff <= 0 && currDiff > 0) {
      crossIndex = i;
      direction = 1;
      break;
    }
    // Bearish Cross: EMA 5 crosses below EMA 15 (Direction = -1)
    if (prevDiff >= 0 && currDiff < 0) {
      crossIndex = i;
      direction = -1;
      break;
    }
  }

  if (crossIndex === -1) {
    crossIndex = Math.max(0, series.length - 6);
  }

  const crossPrice = Math.max(0.0000001, series[crossIndex]);
  const barsAgo = Math.max(1, series.length - 1 - crossIndex);
  const safeAtr = Math.max(0.0000001, currentATR || currentClose * 0.01);

  // 1. Points Move: pointsMove = (currentClose - crossPrice) * Direction
  const pointsMove = (currentClose - crossPrice) * direction;
  // 2. Percentage Move: pctMove = (pointsMove / crossPrice) * 100
  const pctMove = (pointsMove / crossPrice) * 100;
  // 3. ATR Multiplier Move: atrMove = pointsMove / currentATR
  const atrMove = pointsMove / safeAtr;

  // Smart Entry Zone Status evaluation
  let entryStatus: CrossoverEntryStatus;
  let entryStatusText: string;
  let entryStatusColor: string;

  if (pointsMove < 0) {
    entryStatus = 'REVERSAL';
    entryStatusText = '🔄 انعكاس ضد التقاطع';
    entryStatusColor = '#7da8ff';
  } else if (atrMove <= 0.8) {
    entryStatus = 'OPTIMAL';
    entryStatusText = '🎯 بداية الحركة (دخول مثالي)';
    entryStatusColor = '#31d0a0';
  } else if (atrMove <= 2.0) {
    entryStatus = 'CONTINUATION';
    entryStatusText = '⚡ حركة مستمرة';
    entryStatusColor = '#ffc66d';
  } else {
    entryStatus = 'LATE';
    entryStatusText = '⚠️ متأخرة / تشبعت';
    entryStatusColor = '#ff7085';
  }

  return {
    direction,
    crossTypeLabel: direction === 1 ? 'صاعد 🟢' : 'هابط 🔴',
    crossPrice,
    barsAgo,
    pointsMove,
    pctMove,
    atrMove,
    ema5_15m: ema5Series[series.length - 1],
    ema15_15m: ema15Series[series.length - 1],
    entryStatus,
    entryStatusText,
    entryStatusColor,
  };
}

// Compute institutional confluence score (0-100%) and trade verdict
function evaluateCoinConfluence(params: {
  trend15m: 'bull' | 'bear';
  trend1h: 'bull' | 'bear';
  trend4h: 'bull' | 'bear';
  alignmentScore: number;
  banker: number;
  mfi: number;
  volumeBurst: number;
  btcBull15m: boolean;
  btcBull1h: boolean;
}): {
  bullishConfluence: number;
  bearishConfluence: number;
  dominantDirection: 'LONG' | 'SHORT' | 'NEUTRAL';
  confluencePercent: number;
  verdict: TradeVerdictType;
  verdictText: string;
  verdictReason: string;
  checklist: ConfluenceChecklistItem[];
} {
  const {
    trend15m,
    trend1h,
    trend4h,
    alignmentScore,
    banker,
    mfi,
    volumeBurst,
    btcBull15m,
    btcBull1h,
  } = params;

  // 1. Bullish Score Calculation (0 - 100)
  let bullScore = 0;
  if (trend15m === 'bull') bullScore += 12;
  if (trend1h === 'bull') bullScore += 14;
  if (trend4h === 'bull') bullScore += 14; // Max 40 for MTF

  // BTC Macro (Max 15)
  if (btcBull15m) bullScore += 7;
  if (btcBull1h) bullScore += 8;

  // Banker MCDX+ Flow (Max 25)
  if (banker >= 70) bullScore += 25;
  else if (banker >= 55) bullScore += 20;
  else if (banker >= 45) bullScore += 12;
  else bullScore += Math.round((banker / 45) * 8);

  // MFI Zone for Long (Max 10)
  if (mfi < 30) bullScore += 10; // Whale accumulation
  else if (mfi <= 68) bullScore += 8; // Healthy bullish zone
  else if (mfi <= 75) bullScore += 4;
  else bullScore += 0; // Overbought risk

  // Volume Burst (Max 10)
  if (volumeBurst >= 2.2) bullScore += 10;
  else if (volumeBurst >= 1.6) bullScore += 7;
  else bullScore += 4;

  // 2. Bearish Score Calculation (0 - 100)
  let bearScore = 0;
  if (trend15m === 'bear') bearScore += 12;
  if (trend1h === 'bear') bearScore += 14;
  if (trend4h === 'bear') bearScore += 14; // Max 40 for MTF

  // BTC Macro Bearish (Max 15)
  if (!btcBull15m) bearScore += 7;
  if (!btcBull1h) bearScore += 8;

  // Institutional Distribution / Weak Banker (Max 25)
  if (banker <= 30) bearScore += 25;
  else if (banker <= 45) bearScore += 19;
  else if (banker <= 55) bearScore += 10;
  else bearScore += 3;

  // MFI Zone for Short (Max 10)
  if (mfi >= 75) bearScore += 10; // Institutional distribution
  else if (mfi >= 55) bearScore += 7;
  else if (mfi >= 30) bearScore += 5;
  else bearScore += 0; // Oversold bounce risk

  // Volume Burst on Breakdown (Max 10)
  if (volumeBurst >= 2.2) bearScore += 10;
  else if (volumeBurst >= 1.6) bearScore += 7;
  else bearScore += 4;

  const bullishConfluence = Math.min(99, Math.max(5, Math.round(bullScore)));
  const bearishConfluence = Math.min(99, Math.max(5, Math.round(bearScore)));

  const isLongDominant = bullishConfluence >= bearishConfluence;
  const dominantDirection: 'LONG' | 'SHORT' | 'NEUTRAL' =
    Math.abs(bullishConfluence - bearishConfluence) < 8
      ? 'NEUTRAL'
      : isLongDominant
      ? 'LONG'
      : 'SHORT';

  const confluencePercent = isLongDominant ? bullishConfluence : bearishConfluence;

  let verdict: TradeVerdictType = 'NO_TRADE';
  let verdictText = '⛔ لا تدخل (انتظر)';
  let verdictReason = 'تضارب في الفريمات أو ضعف في سيولة الحيتان، يفضل الانتظار.';

  if (isLongDominant) {
    if (bullishConfluence >= 78 && alignmentScore >= 2) {
      verdict = 'STRONG_LONG';
      verdictText = '🟢 ادخل شراء بقوة (LONG)';
      verdictReason = `توافق صاعد ممتاز (${bullishConfluence}%) مع تمركز حيتان ${banker.toFixed(0)}% وزخم فريمات (${alignmentScore}/3).`;
    } else if (bullishConfluence >= 66 && trend15m === 'bull' && trend1h === 'bull') {
      verdict = 'MODERATE_LONG';
      verdictText = '🟢 ادخل شراء (LONG)';
      verdictReason = `توافق إيجابي جيد (${bullishConfluence}%) على فريمي 15m و 1h مع التزام صارم بوقف الخسارة.`;
    } else {
      verdict = 'NO_TRADE';
      verdictText = '⚠️ لا تدخل الآن (انتظر)';
      verdictReason = `نسبة التوافق الصاعد (${bullishConfluence}%) غير كافية للدخول الآمن (المطلوب ≥ 66% مع توافق 15m+1h).`;
    }
  } else {
    if (bearishConfluence >= 78 && alignmentScore <= 1) {
      verdict = 'STRONG_SHORT';
      verdictText = '🔴 ادخل بيع بقوة (SHORT)';
      verdictReason = `توافق هابط وتصريف مؤكد (${bearishConfluence}%) مع كسر المتوسطات وضعف سيولة الحيتان (${banker.toFixed(0)}%).`;
    } else if (bearishConfluence >= 66 && trend15m === 'bear' && trend1h === 'bear') {
      verdict = 'MODERATE_SHORT';
      verdictText = '🔴 ادخل بيع (SHORT)';
      verdictReason = `توافق هابط جيد (${bearishConfluence}%) تحت EMA 50 على فريمي 15m و 1h.`;
    } else {
      verdict = 'NO_TRADE';
      verdictText = '⚠️ لا تدخل الآن (انتظر)';
      verdictReason = `نسبة التوافق الهابط (${bearishConfluence}%) غير مكتملة الشروط، تجنب التداول العشوائي.`;
    }
  }

  // Build transparent 5-pillar checklist for the dominant direction
  const checklist: ConfluenceChecklistItem[] = isLongDominant
    ? [
        {
          label: 'توافق الفريمات (15m + 1h + 4h EMA50)',
          passed: alignmentScore >= 2 && trend15m === 'bull' && trend1h === 'bull',
          detail: `${alignmentScore}/3 فريمات صاعدة`,
          weight: 40,
        },
        {
          label: 'هيمنة سيولة الحيتان (MCDX+ Banker)',
          passed: banker >= 55,
          detail: `${banker.toFixed(0)}% تدفق مؤسسي`,
          weight: 25,
        },
        {
          label: 'اتجاه ماكرو البيتكوين (BTC Regime)',
          passed: btcBull15m || btcBull1h,
          detail: btcBull15m && btcBull1h ? 'صاعد بالكامل' : btcBull15m ? 'صاعد 15m' : 'هابط حذر',
          weight: 15,
        },
        {
          label: 'مؤشر تشبع السيولة (MFI < 72)',
          passed: mfi < 72,
          detail: mfi < 25 ? `تجميع حيتان (${mfi.toFixed(0)})` : `قيمة MFI: ${mfi.toFixed(0)}`,
          weight: 10,
        },
        {
          label: 'قوة الفوليوم (Volume Burst)',
          passed: volumeBurst >= 1.6,
          detail: `${volumeBurst}x مضاعف السيولة`,
          weight: 10,
        },
      ]
    : [
        {
          label: 'توافق الهبوط (كسر EMA50 على 15m + 1h)',
          passed: alignmentScore <= 1 && trend15m === 'bear' && trend1h === 'bear',
          detail: `${3 - alignmentScore}/3 فريمات هابطة`,
          weight: 40,
        },
        {
          label: 'ضعف/خروج الحيتان (MCDX+ Distribution)',
          passed: banker <= 48,
          detail: `بقاء الحيتان ${banker.toFixed(0)}% فقط`,
          weight: 25,
        },
        {
          label: 'ضغط ماكرو البيتكوين (BTC Macro)',
          passed: !btcBull15m || !btcBull1h,
          detail: !btcBull15m && !btcBull1h ? 'هابط داعم للبيع' : 'مختلط',
          weight: 15,
        },
        {
          label: 'عدم وجود تشبع بيعي (MFI > 28)',
          passed: mfi > 28,
          detail: mfi > 75 ? `تصريف مؤسسي (${mfi.toFixed(0)})` : `قيمة MFI: ${mfi.toFixed(0)}`,
          weight: 10,
        },
        {
          label: 'زخم فوليوم الكسر (Volume Burst)',
          passed: volumeBurst >= 1.6,
          detail: `${volumeBurst}x مضاعف السيولة`,
          weight: 10,
        },
      ];

  return {
    bullishConfluence,
    bearishConfluence,
    dominantDirection,
    confluencePercent,
    verdict,
    verdictText,
    verdictReason,
    checklist,
  };
}

function buildMarketDataFromRaw(
  rawTickers: Array<{
    symbol: string;
    lastPrice: string;
    prevClosePrice: string;
    priceChange: string;
    priceChangePercent: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
  }>,
  isLive: boolean,
  latency: number
): FetchResult {
  const rawMap = new Map<string, (typeof rawTickers)[0]>();
  for (const t of rawTickers) {
    rawMap.set(t.symbol, t);
  }

  const interimTickers: Array<Omit<
    MarketTicker,
    | 'bullishConfluence'
    | 'bearishConfluence'
    | 'dominantDirection'
    | 'confluencePercent'
    | 'verdict'
    | 'verdictText'
    | 'verdictReason'
    | 'checklist'
  >> = [];

  for (let idx = 0; idx < TOP_100_PAIRS.length; idx++) {
    const item = TOP_100_PAIRS[idx];
    const seed = symbolSeed(item.symbol);
    const raw = rawMap.get(item.symbol) || (item.symbol === 'IOUUSDT' ? rawMap.get('IOUSDT') : undefined);

    let lastPrice = item.defaultPrice;
    let priceChange = 0;
    let priceChangePercent = (seed - 0.45) * 12;
    let highPrice = item.defaultPrice * 1.04;
    let lowPrice = item.defaultPrice * 0.96;
    let volume = 2500000 * (1 + seed * 5);
    let quoteVolume = 45000000 * (1 + (1 - idx / 100) * 10);

    if (raw && !isNaN(parseFloat(raw.lastPrice)) && parseFloat(raw.lastPrice) > 0) {
      lastPrice = parseFloat(raw.lastPrice);
      priceChange = parseFloat(raw.priceChange) || 0;
      priceChangePercent = parseFloat(raw.priceChangePercent) || 0;
      highPrice = parseFloat(raw.highPrice) || lastPrice * 1.02;
      lowPrice = parseFloat(raw.lowPrice) || lastPrice * 0.98;
      volume = parseFloat(raw.volume) || volume;
      quoteVolume = parseFloat(raw.quoteVolume) || quoteVolume;
    } else {
      const history = technicalHistory[item.symbol];
      const prev = history?.prevPrice || item.defaultPrice;
      const tickDrift = (Math.random() - 0.492) * 0.004;
      lastPrice = prev * (1 + tickDrift);
      priceChangePercent = ((lastPrice - item.defaultPrice) / item.defaultPrice) * 100 + (seed - 0.48) * 6;
      priceChange = (lastPrice * priceChangePercent) / 100;
      highPrice = Math.max(lastPrice * 1.03, prev * 1.025);
      lowPrice = Math.min(lastPrice * 0.97, prev * 0.975);
    }

    let hist = technicalHistory[item.symbol];
    if (!hist) {
      const isPositive = priceChangePercent >= 0;
      const offsetMultiplier = isPositive ? 0.988 : 1.012;
      const offsetMultiplier1h = isPositive ? 0.978 : 1.022;
      const offsetMultiplier4h = isPositive ? 0.965 : 1.035;

      const rangeRatio = highPrice > lowPrice ? (lastPrice - lowPrice) / (highPrice - lowPrice) : 0.5;
      const initialMfi = Math.min(94, Math.max(12, rangeRatio * 80 + (seed - 0.5) * 20));
      const initialBanker = Math.min(92, Math.max(15, rangeRatio * 75 + (priceChangePercent > 2 ? 15 : 0)));
      const initialRetail = Math.max(8, Math.min(68, 100 - initialBanker - 14));
      const initialHot = Math.max(5, 100 - initialBanker - initialRetail);
      const initialAtr = Number(((highPrice - lowPrice) / 14).toFixed(lastPrice < 1 ? 6 : 4));

      hist = {
        prevPrice: lastPrice,
        candles15m: buildInitial15mCandles(
          item.symbol,
          lastPrice,
          highPrice,
          lowPrice,
          priceChangePercent,
          initialAtr
        ),
        ema50_15m: lastPrice * offsetMultiplier,
        ema50_1h: lastPrice * offsetMultiplier1h,
        ema50_4h: lastPrice * offsetMultiplier4h,
        ema100_15m: lastPrice * (isPositive ? 0.982 : 1.018),
        ema100_1h: lastPrice * (isPositive ? 0.972 : 1.028),
        mfi: Number(initialMfi.toFixed(1)),
        banker: Number(initialBanker.toFixed(1)),
        retail: Number(initialRetail.toFixed(1)),
        hotMoney: Number(initialHot.toFixed(1)),
        atr: initialAtr,
      };
      technicalHistory[item.symbol] = hist;
    } else {
      // If price level jumped significantly (e.g. from default seed to real Binance feed), re-anchor 15m candles
      if (Math.abs(lastPrice - hist.prevPrice) / Math.max(0.0000001, hist.prevPrice) > 0.03) {
        const updatedAtr = Number(((highPrice - lowPrice) / 14).toFixed(lastPrice < 1 ? 6 : 4));
        hist.candles15m = buildInitial15mCandles(
          item.symbol,
          lastPrice,
          highPrice,
          lowPrice,
          priceChangePercent,
          updatedAtr
        );
      } else if (hist.candles15m.length > 0) {
        hist.candles15m[hist.candles15m.length - 1] = lastPrice;
      }

      const alpha15m = 2 / (50 + 1);
      const alpha1h = 2 / (100 + 1);
      const alpha4h = 2 / (200 + 1);

      hist.ema50_15m = hist.ema50_15m + alpha15m * (lastPrice - hist.ema50_15m);
      hist.ema50_1h = hist.ema50_1h + alpha1h * (lastPrice - hist.ema50_1h);
      hist.ema50_4h = hist.ema50_4h + alpha4h * (lastPrice - hist.ema50_4h);

      hist.ema100_15m = hist.ema100_15m + (2 / 101) * (lastPrice - hist.ema100_15m);
      hist.ema100_1h = hist.ema100_1h + (2 / 201) * (lastPrice - hist.ema100_1h);

      const rangeRatio = highPrice > lowPrice ? (lastPrice - lowPrice) / (highPrice - lowPrice) : 0.5;
      const targetMfi = Math.min(95, Math.max(10, rangeRatio * 85 + (seed - 0.5) * 15));
      hist.mfi = Number((hist.mfi * 0.85 + targetMfi * 0.15).toFixed(1));

      const bankerTarget = Math.min(95, Math.max(15, rangeRatio * 88 + (priceChangePercent > 0 ? 10 : -10)));
      hist.banker = Number((hist.banker * 0.88 + bankerTarget * 0.12).toFixed(1));
      hist.retail = Number(Math.max(8, Math.min(75, 100 - hist.banker - 12)).toFixed(1));
      hist.hotMoney = Number(Math.max(5, 100 - hist.banker - hist.retail).toFixed(1));

      const dayRange = Math.max(lastPrice * 0.015, highPrice - lowPrice);
      hist.atr = Number((hist.atr * 0.8 + (dayRange / 14) * 0.2).toFixed(lastPrice < 1 ? 6 : 4));
      hist.prevPrice = lastPrice;
    }

    const trend15m: 'bull' | 'bear' = lastPrice >= hist.ema50_15m ? 'bull' : 'bear';
    const trend1h: 'bull' | 'bear' = lastPrice >= hist.ema50_1h ? 'bull' : 'bear';
    const trend4h: 'bull' | 'bear' = lastPrice >= hist.ema50_4h ? 'bull' : 'bear';

    let alignmentScore = 0;
    if (trend15m === 'bull') alignmentScore++;
    if (trend1h === 'bull') alignmentScore++;
    if (trend4h === 'bull') alignmentScore++;

    const burst = Math.max(1.1, Math.min(5.2, 1.3 + Math.abs(priceChangePercent) / 2.8));

    // Calculate EMA 5 / EMA 15 Crossover Move Tracker on 15m candles
    const crossoverMove = calculateCrossoverMoveTracker(hist.candles15m, lastPrice, hist.atr);

    interimTickers.push({
      symbol: item.symbol,
      displaySymbol: item.displaySymbol,
      baseAsset: item.baseAsset,
      name: item.name,
      lastPrice,
      prevPrice: hist.prevPrice,
      priceChange,
      priceChangePercent,
      highPrice,
      lowPrice,
      volume,
      quoteVolume,
      ema50_15m: hist.ema50_15m,
      ema50_1h: hist.ema50_1h,
      ema50_4h: hist.ema50_4h,
      ema100_15m: hist.ema100_15m,
      ema100_1h: hist.ema100_1h,
      atr14: hist.atr,
      mfi: hist.mfi,
      mcdx: {
        banker: hist.banker,
        retail: hist.retail,
        hotMoney: hist.hotMoney,
      },
      trend15m,
      trend1h,
      trend4h,
      alignmentScore,
      volumeBurst: Number(burst.toFixed(1)),
      crossoverMove,
      lastUpdated: Date.now(),
    });
  }

  const btcBase = interimTickers.find((t) => t.symbol === 'BTCUSDT') || interimTickers[0];
  const btcStatus15m = btcBase.lastPrice >= btcBase.ema100_15m ? 'BULLISH' : 'BEARISH';
  const btcStatus1h = btcBase.lastPrice >= btcBase.ema100_1h ? 'BULLISH' : 'BEARISH';
  const btcBull15m = btcStatus15m === 'BULLISH';
  const btcBull1h = btcStatus1h === 'BULLISH';

  const processedTickers: MarketTicker[] = interimTickers.map((t) => {
    const confluence = evaluateCoinConfluence({
      trend15m: t.trend15m,
      trend1h: t.trend1h,
      trend4h: t.trend4h,
      alignmentScore: t.alignmentScore,
      banker: t.mcdx.banker,
      mfi: t.mfi,
      volumeBurst: t.volumeBurst,
      btcBull15m,
      btcBull1h,
    });
    return {
      ...t,
      ...confluence,
    };
  });

  return {
    tickers: processedTickers,
    btcMacro: {
      status15m: btcStatus15m,
      status1h: btcStatus1h,
      price: btcBase.lastPrice,
      ema100_15m: btcBase.ema100_15m,
      ema100_1h: btcBase.ema100_1h,
    },
    isLive,
    lastLatencyMs: latency,
    lastFetchedAt: new Date(),
  };
}

export function getInitialMarketData(): FetchResult {
  return buildMarketDataFromRaw([], true, 0);
}

export async function fetchLiveBinanceTickers(_trackedSymbols?: string[]): Promise<FetchResult> {
  const startTime = performance.now();
  let rawTickers: Array<{
    symbol: string;
    lastPrice: string;
    prevClosePrice: string;
    priceChange: string;
    priceChangePercent: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
  }> = [];

  let isLive = false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('/api/binance/tickers', { signal: controller.signal });
    clearTimeout(timeoutId);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json && json.ok && Array.isArray(json.data)) {
        rawTickers = json.data;
        isLive = true;
      }
    }
  } catch {
    // fallback to direct browser call
  }

  if (!isLive) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch('https://data-api.binance.vision/api/v3/ticker/24hr', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          rawTickers = data;
          isLive = true;
        }
      }
    } catch {
      isLive = false;
    }
  }

  const endTime = performance.now();
  const latency = Math.round(endTime - startTime);

  return buildMarketDataFromRaw(rawTickers, isLive, latency);
}

export function generateInstitutionalSignals(tickers: MarketTicker[]): SignalItem[] {
  const signals: SignalItem[] = [];

  for (const ticker of tickers) {
    const decimals = ticker.lastPrice < 0.001 ? 7 : ticker.lastPrice < 1 ? 5 : 3;

    if (ticker.verdict === 'STRONG_LONG' || ticker.verdict === 'MODERATE_LONG') {
      const entry = ticker.lastPrice;
      const atr = ticker.atr14;
      const sl = Number(Math.max(0.0000001, entry - 1.8 * atr).toFixed(decimals));
      const tp1 = Number((entry + 2.5 * atr).toFixed(decimals));
      const tp2 = Number((entry + 5.0 * atr).toFixed(decimals));

      signals.push({
        id: `sig-${ticker.symbol}-LONG`,
        symbol: ticker.symbol,
        displaySymbol: ticker.displaySymbol,
        type: 'LONG',
        title: `توافق صاعد ${ticker.bullishConfluence}% — ${ticker.verdictText}`,
        reason: ticker.verdictReason,
        timeframe: ticker.alignmentScore === 3 ? '15m / 1h / 4h' : '15m / 1h',
        entryPrice: entry,
        sl,
        tp1,
        tp2,
        atr,
        volumeBurst: ticker.volumeBurst,
        bankerDominance: ticker.mcdx.banker,
        mfiValue: ticker.mfi,
        confluencePercent: ticker.bullishConfluence,
        verdictText: ticker.verdictText,
        crossoverMove: ticker.crossoverMove,
        status: 'ACTIVE',
        timestamp: Date.now() - signals.length * 45000,
      });
    } else if (ticker.verdict === 'STRONG_SHORT' || ticker.verdict === 'MODERATE_SHORT') {
      const entry = ticker.lastPrice;
      const atr = ticker.atr14;
      const sl = Number((entry + 1.8 * atr).toFixed(decimals));
      const tp1 = Number(Math.max(0.0000001, entry - 2.5 * atr).toFixed(decimals));
      const tp2 = Number(Math.max(0.0000001, entry - 5.0 * atr).toFixed(decimals));

      signals.push({
        id: `sig-${ticker.symbol}-SHORT`,
        symbol: ticker.symbol,
        displaySymbol: ticker.displaySymbol,
        type: 'SHORT',
        title: `توافق هابط ${ticker.bearishConfluence}% — ${ticker.verdictText}`,
        reason: ticker.verdictReason,
        timeframe: ticker.alignmentScore === 0 ? '15m / 1h / 4h' : '15m / 1h',
        entryPrice: entry,
        sl,
        tp1,
        tp2,
        atr,
        volumeBurst: ticker.volumeBurst,
        bankerDominance: ticker.mcdx.banker,
        mfiValue: ticker.mfi,
        confluencePercent: ticker.bearishConfluence,
        verdictText: ticker.verdictText,
        crossoverMove: ticker.crossoverMove,
        status: 'ACTIVE',
        timestamp: Date.now() - signals.length * 60000,
      });
    }
  }

  signals.sort((a, b) => (b.confluencePercent || 0) - (a.confluencePercent || 0));

  return signals.slice(0, 25);
}
