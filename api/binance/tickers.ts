// Vercel Serverless Function: GET /api/binance/tickers
let cachedTickers: unknown[] | null = null;
let lastCacheTime = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(_req: any, res: any) {
  const now = Date.now();
  if (cachedTickers && now - lastCacheTime < 5000) {
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate=10');
    return res.status(200).json({ ok: true, source: 'cache', data: cachedTickers });
  }

  const endpoints = [
    'https://data-api.binance.vision/api/v3/ticker/24hr',
    'https://api.binance.com/api/v3/ticker/24hr',
    'https://api1.binance.com/api/v3/ticker/24hr',
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json)) {
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
