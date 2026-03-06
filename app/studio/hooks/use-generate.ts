"use client"
import { useState, useCallback, useRef } from "react"
import type { PlatformKey } from "../lib/platforms"
import { getPromptForPlatform } from "../lib/platforms"

export interface GenerationRecord {
  id: string
  content: string
  platform: PlatformKey
  llm: string
  createdAt: string
}

export interface GenerateOptions {
  topic: string
  platform: PlatformKey
  llm: string
  tone?: string
  depth?: string
  style?: string
  sourceContext?: string
}

export function useGenerate() {
  const [completion, setCompletion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastGeneration, setLastGeneration] = useState<GenerationRecord | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const generate = useCallback(async (opts: GenerateOptions) => {
    setIsLoading(true)
    setError(null)
    setCompletion("")

    const prompt = getPromptForPlatform(
      opts.platform, opts.topic, opts.tone || "professional",
      opts.depth || "medium", opts.sourceContext
    )

    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt, model: opts.llm, platform: opts.platform,
          tone: opts.tone, depth: opts.depth, style: opts.style,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error("Generation failed")
      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        full += chunk
        setCompletion(full)
      }

      const record: GenerationRecord = {
        id: crypto.randomUUID(),
        content: full,
        platform: opts.platform,
        llm: opts.llm,
        createdAt: new Date().toISOString(),
      }
      setLastGeneration(record)
      return full
    } catch (e: any) {
      if (e.name !== "AbortError") setError(e.message)
      return null
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { completion, generate, isLoading, error, stop, lastGeneration }
}
