type VercelRequest = {
  method?: string;
  query: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  end: () => void;
  setHeader: (name: string, value: string) => void;
};

const API_BIBLE_CHAPTER_URL = 'https://api.scripture.api.bible/v1/bibles';
const BIBLE_ID_PATTERN = /^[A-Za-z0-9-]+$/;
const CHAPTER_ID_PATTERN = /^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+$/;

const firstQueryValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const parseUpstreamBody = async (upstream: Response): Promise<unknown> => {
  const contentType = upstream.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return upstream.json();
  }

  const text = await upstream.text();
  return text ? { message: text } : null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'BIBLE_API_KEY is not configured on the server.' });
    return;
  }

  const bibleId = firstQueryValue(req.query.bibleId)?.trim();
  const chapterId = firstQueryValue(req.query.chapterId)?.trim();

  if (!bibleId || !chapterId) {
    res.status(400).json({ error: 'Missing bibleId or chapterId.' });
    return;
  }

  if (!BIBLE_ID_PATTERN.test(bibleId) || !CHAPTER_ID_PATTERN.test(chapterId)) {
    res.status(400).json({ error: 'Invalid bibleId or chapterId.' });
    return;
  }

  try {
    const upstream = await fetch(
      `${API_BIBLE_CHAPTER_URL}/${encodeURIComponent(bibleId)}/chapters/${encodeURIComponent(chapterId)}?content-type=html&include-verse-numbers=true`,
      { headers: { 'api-key': apiKey } }
    );

    const body = await parseUpstreamBody(upstream);

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: 'API.Bible upstream request failed.', details: body });
      return;
    }

    res.status(upstream.status).json(body);
  } catch (error) {
    console.error('API.Bible proxy error', error);
    res.status(502).json({ error: 'API.Bible upstream request failed.' });
  }
}
