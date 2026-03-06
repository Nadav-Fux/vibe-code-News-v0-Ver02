'use client';

import { useCompletion } from 'ai/react';
import { useState, useCallback } from 'react';
import type { PlatformKey } from '../lib/platforms';
import { getPromptForPlatform } from '../lib/platforms';

export interface GenerationRecord {
  content: string;
  platform: PlatformKey;
  llm: string;
  createdAt: string;
}

export interface GenerateOptions {
  topic: string;
  platform: PlatformKey;
  llm: string;
  tone?: string;
  depth?: string;
  style?: string;
  sourceContext?: string;
}

export function useGenerate() {
  const [lastGeneration, setLastGeneration] = useState<GenerationRecord | null>(null);

  const { completion, complete, isLoading, error, stop } = useCompletion({
    api: '/api/studio/generate',
  });

  const generate = useCallback(
    async (opts: GenerateOptions) => {
      const tone = opts.tone || 'professional';
      const depth = opts.depth || 'medium';

      const prompt = getPromptForPlatform(
        opts.platform,
        opts.topic,
        tone,
        depth,
        opts.sourceContext,
      );

      const result = await complete(prompt, {
        body: {
          model: opts.llm,
          platform: opts.platform,
          tone,
          depth,
          style: opts.style,
        },
      });

      if (result) {
        setLastGeneration({
          content: result,
          platform: opts.platform,
          llm: opts.llm,
          createdAt: new Date().toISOString(),
        });
      }

      return result;
    },
    [complete],
  );

  return { completion, generate, isLoading, error, stop, lastGeneration };
}
