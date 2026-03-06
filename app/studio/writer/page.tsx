'use client'

import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Copy,
  Check,
  Mail,
  Save,
  Clock,
  Rss,
  Zap,
  Type,
  AlignRight,
  Smile,
  Briefcase,
  GraduationCap,
  Megaphone,
} from 'lucide-react'

import { SourceFeed } from '../components/source-feed'
import { useGenerate } from '../hooks/use-generate'
import { useStudio } from '../hooks/use-studio-store'

const toneOptions = [
  { id: 'professional', label: 'מקצועי', icon: Briefcase },
  { id: 'casual', label: 'יומיומי', icon: Smile },
  { id: 'academic', label: 'אקדמי', icon: GraduationCap },
  { id: 'marketing', label: 'שיווקי', icon: Megaphone },
] as const

const platforms = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'blog', label: 'בלוג' },
  { id: 'newsletter', label: 'ניוזלטר' },
  { id: 'tiktok', label: 'TikTok' },
]

const llmModels = [
  { id: 'gpt-4o', label: 'GPT-4o' },
  { id: 'claude-sonnet', label: 'Claude Sonnet' },
  { id: 'gemini-pro', label: 'Gemini Pro' },
  { id: 'groq-llama', label: 'Groq LLaMA' },
]

export default function WriterPage() {
  const [content, setContent] = useState('')
  const [platform, setPlatform] = useState('linkedin')
  const [model, setModel] = useState('claude-sonnet')
  const [tone, setTone] = useState('professional')
  const [showToolbar, setShowToolbar] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const toolbarTimeout = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { generate, isGenerating } = useGenerate()
  const { history } = useStudio()

  /* ── Auto-grow textarea ────────────────────────── */
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.max(400, ta.scrollHeight)}px`
  }, [content])

  /* ── Stats ─────────────────────────────────────── */
  const stats = useMemo(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0
    const chars = content.length
    const readingTime = Math.max(1, Math.ceil(words / 200))
    return { words, chars, readingTime }
  }, [content])

  /* ── Toolbar hover ─────────────────────────────── */
  const handleMouseEnter = useCallback(() => {
    if (toolbarTimeout.current) clearTimeout(toolbarTimeout.current)
    setShowToolbar(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    toolbarTimeout.current = setTimeout(() => setShowToolbar(false), 600)
  }, [])

  /* ── Actions ───────────────────────────────────── */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleGenerate = async () => {
    const result = await generate(content || 'Generate content')
    if (result) setContent(result)
  }

  return (
    <div className="relative min-h-[calc(100vh-7rem)] flex flex-col">
      {/* ── Main writing area ──────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 flex flex-col items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Floating toolbar */}
        <AnimatePresence>
          {showToolbar && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="sticky top-2 z-40 mx-auto"
            >
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/8 backdrop-blur-2xl bg-[oklch(0.16_0.02_280/.85)] shadow-2xl shadow-black/30">
                {/* Platform select */}
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="w-[120px] h-8 text-xs bg-transparent border-white/8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[oklch(0.16_0.02_280)] border-white/10">
                    {platforms.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="w-px h-5 bg-white/10" />

                {/* LLM select */}
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger className="w-[130px] h-8 text-xs bg-transparent border-white/8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[oklch(0.16_0.02_280)] border-white/10">
                    {llmModels.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="text-xs">
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="w-px h-5 bg-white/10" />

                {/* Tone quick-toggle */}
                <div className="flex gap-1">
                  {toneOptions.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      title={t.label}
                      className="p-1.5 rounded-lg transition-all"
                      style={{
                        background:
                          tone === t.id
                            ? 'oklch(0.30 0.12 280)'
                            : 'transparent',
                        color:
                          tone === t.id
                            ? 'oklch(0.85 0.10 280)'
                            : 'oklch(0.45 0.02 280)',
                      }}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <div className="w-full max-w-2xl px-6 pt-16 pb-32">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="התחל לכתוב, או השתמש בסרגל הכלים למעלה כדי לייצר תוכן ממקורות..."
            dir="rtl"
            className="w-full min-h-[400px] text-lg leading-relaxed bg-transparent border-0 outline-none resize-none text-[oklch(0.88_0.02_280)] placeholder:text-[oklch(0.30_0.02_280)] focus:ring-0 focus:border-b focus:border-white/5 transition-all font-[system-ui]"
            style={{
              caretColor: 'oklch(0.65 0.25 280)',
            }}
          />
        </div>
      </div>

      {/* ── Bottom stats bar ────────────────────────── */}
      <div className="fixed bottom-14 left-0 right-0 flex items-center justify-center gap-4 py-1.5 text-[oklch(0.35_0.02_280)]">
        <span className="flex items-center gap-1 text-[11px]">
          <Type className="w-3 h-3" />
          {stats.words} מילים
        </span>
        <span className="text-[11px]">{stats.chars} תווים</span>
        <span className="flex items-center gap-1 text-[11px]">
          <Clock className="w-3 h-3" />
          {stats.readingTime} דק׳ קריאה
        </span>
      </div>

      {/* ── Bottom action bar ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[oklch(0.12_0.01_280/.85)] backdrop-blur-2xl">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[oklch(0.18_0.03_280)] hover:bg-[oklch(0.22_0.05_280)] text-[oklch(0.65_0.02_280)] transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? 'הועתק' : 'העתק'}
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[oklch(0.18_0.03_280)] hover:bg-[oklch(0.22_0.05_280)] text-[oklch(0.65_0.02_280)] transition-colors">
              <Mail className="w-3.5 h-3.5" />
              שלח למייל
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[oklch(0.18_0.03_280)] hover:bg-[oklch(0.22_0.05_280)] text-[oklch(0.65_0.02_280)] transition-colors"
            >
              {saved ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {saved ? 'נשמר' : 'שמור'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[oklch(0.18_0.03_280)] hover:bg-[oklch(0.22_0.05_280)] text-[oklch(0.65_0.02_280)] transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              היסטוריה
            </button>

            <button
              onClick={() => setSourcesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[oklch(0.18_0.03_280)] hover:bg-[oklch(0.22_0.05_280)] text-[oklch(0.65_0.02_280)] transition-colors"
            >
              <Rss className="w-3.5 h-3.5" />
              מקורות
            </button>
          </div>
        </div>
      </div>

      {/* ── Generate FAB ────────────────────────────── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleGenerate}
        disabled={isGenerating}
        className="fixed bottom-20 left-6 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl disabled:opacity-50 z-50"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.55 0.28 280), oklch(0.48 0.28 330))',
          boxShadow:
            '0 4px 30px oklch(0.45 0.25 300 / .4), 0 0 60px oklch(0.40 0.20 280 / .15)',
        }}
      >
        {isGenerating ? (
          <Zap className="w-5 h-5 text-white animate-pulse" />
        ) : (
          <Zap className="w-5 h-5 text-white" />
        )}
      </motion.button>

      {/* ── History Sheet (right) ────────────────────── */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent
          side="left"
          className="w-[350px] sm:w-[400px] bg-[oklch(0.14_0.02_280)] border-white/5"
        >
          <SheetHeader>
            <SheetTitle className="text-right text-[oklch(0.90_0.02_280)]">
              היסטוריה
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            {(history ?? []).length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <Clock className="w-8 h-8 text-[oklch(0.30_0.05_280)]" />
                <p className="text-xs text-[oklch(0.40_0.02_280)]">
                  עדיין אין היסטוריה
                </p>
              </div>
            ) : (
              history.map((item, i) => (
                <button
                  key={item.id ?? i}
                  onClick={() => {
                    setContent(item.content ?? '')
                    setHistoryOpen(false)
                  }}
                  className="w-full text-right p-3 rounded-xl border border-white/5 bg-[oklch(0.16_0.02_280/.60)] hover:bg-[oklch(0.18_0.03_280)] transition-colors"
                >
                  <p className="text-xs font-semibold truncate">
                    {item.title ?? 'ללא כותרת'}
                  </p>
                  <p className="text-[10px] text-[oklch(0.45_0.02_280)] mt-1 line-clamp-2">
                    {item.content}
                  </p>
                </button>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Sources Sheet (left) ────────────────────── */}
      <Sheet open={sourcesOpen} onOpenChange={setSourcesOpen}>
        <SheetContent
          side="right"
          className="w-[350px] sm:w-[400px] bg-[oklch(0.14_0.02_280)] border-white/5"
        >
          <SheetHeader>
            <SheetTitle className="text-right text-[oklch(0.90_0.02_280)]">
              מקורות
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4">
            <SourceFeed />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
