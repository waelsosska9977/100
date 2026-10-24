import { MarketTicker, SignalItem } from '../types';

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

// Deterministic hash for realistic spread across 100 coins
function symbolSeed(sym: string): number {
  let h = 0;
  for (let i = 0; i < sym.length; i++) {
    h = (h * 31 + sym.charCodeAt(i)) % 1000;
  }
  return h / 1000;
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

  // 1. Try server-side proxy first (/api/binance/tickers)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch('/api/binance/tickers', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const json = await res.json();
      if (json && json.ok && Array.isArray(json.data)) {
        rawTickers = json.data;
        isLive = true;
      }
    }
  } catch {
    // fallback to direct browser call
  }

  // 2. Fallback to direct public Binance Data API
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

  const rawMap = new Map<string, (typeof rawTickers)[0]>();
  for (const t of rawTickers) {
    rawMap.set(t.symbol, t);
  }

  const processedTickers: MarketTicker[] = [];

  for (let idx = 0; idx < TOP_100_PAIRS.length; idx++) {
    const item = TOP_100_PAIRS[idx];
    const seed = symbolSeed(item.symbol);
    // Support IOUSDT fallback if IOUUSDT
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

      // Range ratio in 24h high-low
      const rangeRatio = highPrice > lowPrice ? (lastPrice - lowPrice) / (highPrice - lowPrice) : 0.5;
      const initialMfi = Math.min(94, Math.max(12, rangeRatio * 80 + (seed - 0.5) * 20));
      const initialBanker = Math.min(92, Math.max(15, rangeRatio * 75 + (priceChangePercent > 2 ? 15 : 0)));
      const initialRetail = Math.max(8, Math.min(68, 100 - initialBanker - 14));
      const initialHot = Math.max(5, 100 - initialBanker - initialRetail);

      hist = {
        prevPrice: lastPrice,
        ema50_15m: lastPrice * offsetMultiplier,
        ema50_1h: lastPrice * offsetMultiplier1h,
        ema50_4h: lastPrice * offsetMultiplier4h,
        ema100_15m: lastPrice * (isPositive ? 0.982 : 1.018),
        ema100_1h: lastPrice * (isPositive ? 0.972 : 1.028),
        mfi: Number(initialMfi.toFixed(1)),
        banker: Number(initialBanker.toFixed(1)),
        retail: Number(initialRetail.toFixed(1)),
        hotMoney: Number(initialHot.toFixed(1)),
        atr: Number(((highPrice - lowPrice) / 14).toFixed(lastPrice < 1 ? 6 : 4)),
      };
      technicalHistory[item.symbol] = hist;
    } else {
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

    processedTickers.push({
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
      lastUpdated: Date.now(),
    });
  }

  const btcTicker = processedTickers.find((t) => t.symbol === 'BTCUSDT') || processedTickers[0];
  const btcStatus15m = btcTicker.lastPrice >= btcTicker.ema100_15m ? 'BULLISH' : 'BEARISH';
  const btcStatus1h = btcTicker.lastPrice >= btcTicker.ema100_1h ? 'BULLISH' : 'BEARISH';

  const endTime = performance.now();
  const latency = Math.round(endTime - startTime);

  return {
    tickers: processedTickers,
    btcMacro: {
      status15m: btcStatus15m,
      status1h: btcStatus1h,
      price: btcTicker.lastPrice,
      ema100_15m: btcTicker.ema100_15m,
      ema100_1h: btcTicker.ema100_1h,
    },
    isLive,
    lastLatencyMs: latency,
    lastFetchedAt: new Date(),
  };
}

export function generateInstitutionalSignals(tickers: MarketTicker[]): SignalItem[] {
  const signals: SignalItem[] = [];

  for (const ticker of tickers) {
    const isBullAligned = ticker.trend15m === 'bull' && ticker.trend1h === 'bull';
    const isBearAligned = ticker.trend15m === 'bear' && ticker.trend1h === 'bear';
    const decimals = ticker.lastPrice < 0.001 ? 7 : ticker.lastPrice < 1 ? 5 : 3;

    // Strong Bullish Institutional Signal
    if (isBullAligned && (ticker.mcdx.banker >= 65 || ticker.mfi <= 28 || ticker.volumeBurst >= 2.4)) {
      const isOversoldAcc = ticker.mfi <= 28;
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
        title: isOversoldAcc ? 'تجميع حيتان في قاع ارتدادي' : 'اختراق مؤسسي مع تدفق بنكي قوي',
        reason: isOversoldAcc
          ? `MFI في مناطق التجميع المؤسسي (${ticker.mfi.toFixed(0)}) + هيمنة صانع السوق ${ticker.mcdx.banker.toFixed(0)}%`
          : `توافق ترند صاعد (${ticker.alignmentScore}/3) مع مضاعف فوليوم ${ticker.volumeBurst}x وهيمنة حيتان ${ticker.mcdx.banker.toFixed(0)}%`,
        timeframe: ticker.alignmentScore === 3 ? '15m / 1h / 4h' : '15m / 1h',
        entryPrice: entry,
        sl,
        tp1,
        tp2,
        atr,
        volumeBurst: ticker.volumeBurst,
        bankerDominance: ticker.mcdx.banker,
        mfiValue: ticker.mfi,
        status: 'ACTIVE',
        timestamp: Date.now() - signals.length * 45000,
      });
    }

    // Strong Bearish Institutional Signal
    if (isBearAligned && (ticker.mfi >= 75 || ticker.mcdx.banker <= 30)) {
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
        title: 'تصريف مؤسسات وجني أرباح',
        reason: `مؤشر MFI (${ticker.mfi.toFixed(0)}) مع كسر EMA 50 وتراجع سيولة الحيتان إلى ${ticker.mcdx.banker.toFixed(0)}%`,
        timeframe: ticker.alignmentScore === 0 ? '15m / 1h / 4h' : '15m / 1h',
        entryPrice: entry,
        sl,
        tp1,
        tp2,
        atr,
        volumeBurst: ticker.volumeBurst,
        bankerDominance: ticker.mcdx.banker,
        mfiValue: ticker.mfi,
        status: 'ACTIVE',
        timestamp: Date.now() - signals.length * 60000,
      });
    }
  }

  // Sort by highest conviction (volumeBurst + bankerDominance difference)
  signals.sort((a, b) => b.volumeBurst * 15 + b.bankerDominance - (a.volumeBurst * 15 + a.bankerDominance));

  return signals.slice(0, 25);
}
