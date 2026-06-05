type VercelRequest = {
  query: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

const firstQueryValue = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.BIBLE_API_KEY;
  const bibleId = firstQueryValue(req.query.bibleId);
  const chapterId = firstQueryValue(req.query.chapterId);

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  if (!apiKey) {
    res.status(503).json({ error: 'BIBLE_API_KEY is not configured on the server.' });
    return;
  }

  if (!bibleId || !chapterId) {
    res.status(400).json({ error: 'Missing bibleId or chapterId.' });
    return;
  }

  const upstream = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${encodeURIComponent(bibleId)}/chapters/${encodeURIComponent(chapterId)}?content-type=html&include-verse-numbers=true`,
    { headers: { 'api-key': apiKey } }
  );

  const body = (await upstream.json()) as unknown;
  res.status(upstream.status).json(body);
}
