'use client';

import { useState, useEffect, useCallback } from 'react';

export type SourceType = 'rss' | 'serp' | 'twitter' | 'apify';

export interface SourceItem {
  id: string;
  title: string;
  content: string;
  url: string;
  source_type: SourceType;
  source_name: string;
  fetched_at: string;
  metadata?: Record<string, unknown>;
}

export function useSources() {
  const [items, setItems] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SourceType | null>(null);

  const fetchSources = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter
        ? `/api/studio/sources?type=${encodeURIComponent(filter)}`
        : '/api/studio/sources';
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch sources (${res.status})`);
      }
      const data = await res.json();
      setItems(data.items || []);
      setError(null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/studio/sources', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Refresh failed (${res.status})`);
      }
      await fetchSources();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      setError(message);
    }
  }, [fetchSources]);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const filtered = filter ? items.filter((i) => i.source_type === filter) : items;

  return { items: filtered, allItems: items, loading, error, refresh, filter, setFilter };
}
