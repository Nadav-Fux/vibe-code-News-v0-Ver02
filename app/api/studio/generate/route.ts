import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { getModelConfig, type AIModelKey } from '@/lib/ai/models';

export const maxDuration = 60;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    prompt,
    model = 'gemini',
    platform,
    tone,
    depth,
    style,
  } = body as {
    prompt?: string;
    model?: string;
    platform?: string;
    tone?: string;
    depth?: string;
    style?: string;
  };

  if (!prompt) {
    return Response.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const modelConfig = getModelConfig(model as AIModelKey);
    let modelInstance: Parameters<typeof streamText>[0]['model'];

    switch (modelConfig.provider) {
      case 'google': {
        const google = createGoogleGenerativeAI({
          apiKey: modelConfig.apiKey,
        });
        modelInstance = google(modelConfig.model);
        break;
      }
      case 'zhipu': {
        const zhipu = createOpenAI({
          apiKey: modelConfig.apiKey,
          baseURL: 'https://open.bigmodel.cn/api/paas/v4',
        });
        modelInstance = zhipu(modelConfig.model);
        break;
      }
      case 'minimax': {
        const minimax = createOpenAI({
          apiKey: modelConfig.apiKey,
          baseURL: 'https://api.minimax.chat/v1',
        });
        modelInstance = minimax(modelConfig.model);
        break;
      }
      case 'groq': {
        const groq = createOpenAI({
          apiKey: modelConfig.apiKey,
          baseURL: 'https://api.groq.com/openai/v1',
        });
        modelInstance = groq(modelConfig.model);
        break;
      }
      case 'openai': {
        const openai = createOpenAI({
          apiKey: modelConfig.apiKey,
        });
        modelInstance = openai(modelConfig.model);
        break;
      }
      default: {
        const fallback = createOpenAI({
          apiKey: modelConfig.apiKey,
        });
        modelInstance = fallback('gpt-4o-mini');
      }
    }

    const temperature =
      tone === 'creative' ? 0.9 : tone === 'professional' ? 0.5 : 0.7;

    const result = streamText({
      model: modelInstance,
      prompt,
      maxTokens: 4000,
      temperature,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Generation failed';
    console.error('Studio generate error:', error);
    return Response.json({ error: message }, { status: 500 });
  }
}
