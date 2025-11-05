"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Wand2 } from "lucide-react"
import { getAvailableModels, AI_MODELS, type AIModelKey } from "@/lib/ai/models"

type AIAssistantProps = {
  onContentGenerated: (content: string) => void
  currentContent?: string
}

export function AIAssistant({ onContentGenerated, currentContent }: AIAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [mode, setMode] = useState<"generate" | "improve" | "summarize">("generate")
  const [title, setTitle] = useState("")
  const [tone, setTone] = useState("professional")
  const [selectedModel, setSelectedModel] = useState<AIModelKey>("openai")
  const [availableModels, setAvailableModels] = useState<AIModelKey[]>([])

  useEffect(() => {
    setAvailableModels(getAvailableModels())
  }, [])

  const handleGenerate = async () => {
    if (!title.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, tone, model: selectedModel }),
      })

      if (!response.ok) throw new Error("Failed to generate content")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let generatedContent = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          generatedContent += chunk
          onContentGenerated(generatedContent)
        }
      }
    } catch (error) {
      console.error("Generation error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleImprove = async () => {
    if (!currentContent?.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/improve-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: currentContent, model: selectedModel }),
      })

      if (!response.ok) throw new Error("Failed to improve content")

      const { improvedContent } = await response.json()
      onContentGenerated(improvedContent)
    } catch (error) {
      console.error("Improvement error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSummarize = async () => {
    if (!currentContent?.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: currentContent, model: selectedModel }),
      })

      if (!response.ok) throw new Error("Failed to generate summary")

      const { summary } = await response.json()
      onContentGenerated(summary)
    } catch (error) {
      console.error("Summary error:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">AI Assistant</h3>
      </div>

      <div className="grid gap-2">
        <Label>AI Model</Label>
        <Select value={selectedModel} onValueChange={(v: AIModelKey) => setSelectedModel(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map((modelKey) => (
              <SelectItem key={modelKey} value={modelKey}>
                {AI_MODELS[modelKey].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Mode</Label>
        <Select value={mode} onValueChange={(v: any) => setMode(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="generate">Generate Content</SelectItem>
            <SelectItem value="improve">Improve Content</SelectItem>
            <SelectItem value="summarize">Summarize</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mode === "generate" && (
        <>
          <div className="grid gap-2">
            <Label>Topic</Label>
            <Textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What should the article be about?"
              rows={2}
            />
          </div>
          <div className="grid gap-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={isGenerating || !title.trim()} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </>
      )}

      {mode === "improve" && (
        <Button onClick={handleImprove} disabled={isGenerating || !currentContent?.trim()} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Improving...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Improve Content
            </>
          )}
        </Button>
      )}

      {mode === "summarize" && (
        <Button onClick={handleSummarize} disabled={isGenerating || !currentContent?.trim()} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Summary
            </>
          )}
        </Button>
      )}
    </div>
  )
}
