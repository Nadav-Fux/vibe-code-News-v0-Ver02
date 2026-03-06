export interface QuotaInfo {
  serpapi: { used: number; limit: number; remaining: number };
  apify: { usedUsd: number; limitUsd: number; remainingUsd: number };
  llms: Record<string, { status: 'active' | 'degraded' | 'inactive' }>;
}

/**
 * GET /api/studio/quota
 *
 * Returns current API usage quotas and LLM availability.
 * In production, this would pull real-time data from Supabase usage tracking
 * or query each provider's API for remaining credits.
 */
export async function GET(): Promise<Response> {
  const quota: QuotaInfo = {
    serpapi: {
      used: 63,
      limit: 250,
      remaining: 187,
    },
    apify: {
      usedUsd: 1.23,
      limitUsd: 5.0,
      remainingUsd: 3.77,
    },
    llms: {
      gemini: { status: 'active' },
      glm: { status: 'active' },
      groq: { status: 'active' },
      minimax: { status: 'active' },
      openai: { status: 'active' },
    },
  };

  return Response.json(quota, {
    headers: {
      'Cache-Control': 'private, max-age=60',
    },
  });
}
