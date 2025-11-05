// AI Models Configuration
export const AI_MODELS = {
  gemini: {
    name: "Gemini 2.5 Flash",
    provider: "google",
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
  },
  glm: {
    name: "GLM 4.6",
    provider: "zhipu",
    model: "glm-4-flash",
    apiKey: process.env.GLM_API_KEY,
  },
  minimax: {
    name: "Minimax 2",
    provider: "minimax",
    model: "abab6.5s-chat",
    apiKey: process.env.MINIMAX_API_KEY,
  },
  openai: {
    name: "GPT-5 Mini",
    provider: "openai",
    model: "openai/gpt-5-mini",
    apiKey: undefined, // Uses Vercel AI Gateway
  },
} as const

export type AIModelKey = keyof typeof AI_MODELS

export function getAvailableModels(): AIModelKey[] {
  return Object.entries(AI_MODELS)
    .filter(([_, config]) => config.apiKey !== undefined || config.provider === "openai")
    .map(([key]) => key as AIModelKey)
}

export function getModelConfig(modelKey: AIModelKey) {
  return AI_MODELS[modelKey]
}
