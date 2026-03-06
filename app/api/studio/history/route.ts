import { createClient } from '@/lib/supabase/server';

const VALID_PLATFORMS = ['linkedin', 'twitter', 'facebook', 'tiktok', 'blog', 'newsletter'] as const;
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const platform = searchParams.get('platform');
  const rawLimit = searchParams.get('limit');

  // Validate platform filter
  if (platform && !VALID_PLATFORMS.includes(platform as (typeof VALID_PLATFORMS)[number])) {
    return Response.json(
      { error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(', ')}` },
      { status: 400 },
    );
  }

  // Parse and clamp limit
  const limit = Math.min(
    Math.max(1, parseInt(rawLimit || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
    MAX_LIMIT,
  );

  try {
    const supabase = await createClient();

    let query = supabase
      .from('studio_generations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;

    if (error) {
      console.error('History fetch error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ items: data || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch history';
    console.error('History route error:', error);
    return Response.json({ error: message }, { status: 500 });
  }
}
