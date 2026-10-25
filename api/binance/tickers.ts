// Vercel Serverless Function: GET /api/binance/tickers
let cachedTickers: unknown[] | null = null;
let lastCacheTime = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = Date.now();
  if (cachedTickers && now - lastCacheTime < 5000) {
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
    return res.status(200).json({ ok: true, source: 'cache', data: cachedTickers });
  }

  // data-api.binance.vision is comes first because it is globally accessible (including US/EU Vercel regions)
  const endpoints = [
    'https://data-api.binance.vision/api/v3/ticker/24hr',
    'https://api4.binance.com/api/v3/ticker/24hr',
    'https://api1.binance.com/api/v3/ticker/24hr',
    'https://api2.binance.com/api/v3/ticker/24hr',
    'https://api3.binance.com/api/v3/ticker/24hr',
    'https://api.binance.com/api/v3/ticker/24hr',
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4500);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'SOSSKA1-Institutional-Screener/1.0',
        },
      });
      clearTimeout(timeout);

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          cachedTickers = json;
          lastCacheTime = Date.now();
          res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
          return res.status(200).json({ ok: true, source: url, data: json });
        }
      }
    } catch {
      // try next endpoint
    }
  }

  return res.status(502).json({ ok: false, error: 'All Binance endpoints unreachable' });
}

