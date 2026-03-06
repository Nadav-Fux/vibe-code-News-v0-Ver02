import { createClient } from '@/lib/supabase/server';

const VALID_SOURCE_TYPES = ['rss', 'serp', 'twitter', 'apify'] as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  // Validate source_type filter if provided
  if (type && !VALID_SOURCE_TYPES.includes(type as (typeof VALID_SOURCE_TYPES)[number])) {
    return Response.json(
      { error: `Invalid source type. Must be one of: ${VALID_SOURCE_TYPES.join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    let query = supabase
      .from('studio_feed_cache')
      .select('*')
      .order('fetched_at', { ascending: false })
      .limit(100);

    if (type) {
      query = query.eq('source_type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Sources fetch error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ items: data || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sources';
    console.error('Sources route error:', error);
    return Response.json({ error: message }, { status: 500 });
  }
}

/**
 * POST = trigger a source refresh.
 * In production this would call n8n webhook or run direct RSS/SERP fetches.
 */
export async function POST() {
  // Placeholder: in production, trigger n8n webhook or direct RSS fetch
  return Response.json({
    success: true,
    message: 'Source refresh triggered',
    timestamp: new Date().toISOString(),
  });
}
