'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Rss,
  PenTool,
  Eye,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
  Loader2,
  Trash2,
  GripVertical,
  Inbox,
} from 'lucide-react'

import { SourceFeed } from '../components/source-feed'
import { GenerationControls } from '../components/generation-controls'
import { ContentCard } from '../components/content-card'
import { useGenerate } from '../hooks/use-generate'
import { useSources } from '../hooks/use-sources'
import { useStudio } from '../hooks/use-studio-store'

/* ── Types ──────────────────────────────────────────────── */
interface CardItem {
  id: string
  title: string
  content: string
  source?: string
  status: 'sources' | 'drafting' | 'review' | 'ready'
}

/* ── Column config ──────────────────────────────────────── */
const columns = [
  { id: 'sources' as const, label: 'מקורות', icon: Rss, color: 'oklch(0.55 0.20 280)' },
  { id: 'drafting' as const, label: 'טיוטה', icon: PenTool, color: 'oklch(0.55 0.20 50)' },
  { id: 'review' as const, label: 'סקירה', icon: Eye, color: 'oklch(0.55 0.20 200)' },
  { id: 'ready' as const, label: 'מוכן', icon: CheckCircle2, color: 'oklch(0.55 0.20 150)' },
] as const

type ColumnId = (typeof columns)[number]['id']

/* ── Card animations ────────────────────────────────────── */
const cardVariants = {
  initial: { opacity: 0, scale: 0.9, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, y: -12, transition: { duration: 0.2 } },
}

/* ── Empty state ────────────────────────────────────────── */
function EmptyColumn({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Inbox className="w-8 h-8 text-[oklch(0.30_0.05_280)]" />
      <p className="text-xs text-[oklch(0.35_0.02_280)]">
        אין פריטים ב{label}
      </p>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function WorkshopPage() {
  const [cards, setCards] = useState<CardItem[]>([
    {
      id: '1',
      title: 'מגמות AI בפיתוח',
      content: 'סקירה של המגמות העדכניות בתחום הבינה המלאכותית...',
      source: 'RSS',
      status: 'sources',
    },
    {
      id: '2',
      title: 'עדכוני React 19',
      content: 'התכונות החדשות ב-React 19 כולל Server Components...',
      source: 'API',
      status: 'sources',
    },
    {
      id: '3',
      title: 'אבטחת מידע בענן',
      content: 'שיטות עבודה מומלצות לאבטחת תשתיות ענן...',
      source: 'RSS',
      status: 'sources',
    },
  ])

  const [draftingSheet, setDraftingSheet] = useState(false)
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const { generate, isGenerating } = useGenerate()

  const moveCard = useCallback(
    (id: string, to: ColumnId) => {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: to } : c))
      )
    },
    []
  )

  const removeCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const handleDraft = (id: string) => {
    setActiveDraftId(id)
    setDraftingSheet(true)
  }

  const handleStartGeneration = async () => {
    if (!activeDraftId) return
    moveCard(activeDraftId, 'drafting')
    setDraftingSheet(false)

    // Simulate generation
    await generate(cards.find((c) => c.id === activeDraftId)?.title ?? '')

    moveCard(activeDraftId, 'review')
    setActiveDraftId(null)
  }

  const handleCopy = async (id: string, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const startEdit = (card: CardItem) => {
    setEditingId(card.id)
    setEditContent(card.content)
  }

  const saveEdit = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: editContent } : c))
    )
    setEditingId(null)
  }

  const cardsInColumn = (col: ColumnId) => cards.filter((c) => c.status === col)

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
        <h2 className="text-sm font-semibold text-[oklch(0.75_0.03_280)]">
          סדנת כרטיסים
        </h2>
        <span className="text-xs text-[oklch(0.45_0.02_280)]">
          {cards.length} פריטים
        </span>
      </div>

      {/* Kanban board */}
      <div className="flex-1 flex gap-3 overflow-x-auto p-4 min-h-0">
        {columns.map((col) => {
          const items = cardsInColumn(col.id)

          return (
            <div
              key={col.id}
              className="flex flex-col min-w-[280px] w-[280px] shrink-0 rounded-2xl border border-white/5 backdrop-blur-xl overflow-hidden"
              style={{
                background: 'oklch(0.14 0.02 280 / .50)',
              }}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <col.icon
                  className="w-4 h-4"
                  style={{ color: col.color }}
                />
                <span className="text-sm font-semibold">{col.label}</span>
                <Badge
                  variant="secondary"
                  className="mr-auto text-[10px] px-2 py-0 h-5"
                  style={{
                    background: 'oklch(0.20 0.04 280)',
                    color: col.color,
                  }}
                >
                  {items.length}
                </Badge>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <EmptyColumn label={col.label} />
                  ) : (
                    items.map((card) => (
                      <motion.div
                        key={card.id}
                        layout
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="rounded-xl border border-white/5 p-3 bg-[oklch(0.16_0.02_280/.70)]"
                      >
                        {/* Card header */}
                        <div className="flex items-start gap-2 mb-2">
                          <GripVertical className="w-3.5 h-3.5 text-[oklch(0.30_0.02_280)] mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold truncate">
                              {card.title}
                            </h4>
                            {card.source && (
                              <span className="text-[10px] text-[oklch(0.45_0.02_280)]">
                                {card.source}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Drafting: skeleton */}
                        {col.id === 'drafting' && (
                          <div className="space-y-1.5 mb-3">
                            <div className="h-2 rounded bg-[oklch(0.22_0.04_280)] animate-pulse w-full" />
                            <div className="h-2 rounded bg-[oklch(0.22_0.04_280)] animate-pulse w-3/4" />
                            <div className="h-2 rounded bg-[oklch(0.22_0.04_280)] animate-pulse w-5/6" />
                            <div className="flex items-center gap-1.5 mt-2">
                              <Loader2 className="w-3 h-3 animate-spin text-[oklch(0.55_0.20_50)]" />
                              <span className="text-[10px] text-[oklch(0.50_0.02_280)]">
                                מייצר...
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Review: editable content */}
                        {col.id === 'review' && (
                          <div className="mb-3">
                            {editingId === card.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="text-xs min-h-[80px] bg-[oklch(0.13_0.01_280)] border-white/8 resize-none"
                                  dir="rtl"
                                />
                                <button
                                  onClick={() => saveEdit(card.id)}
                                  className="text-[10px] px-2 py-1 rounded-md bg-[oklch(0.40_0.18_150)] text-white"
                                >
                                  שמור
                                </button>
                              </div>
                            ) : (
                              <p
                                className="text-xs text-[oklch(0.60_0.02_280)] line-clamp-3 cursor-pointer hover:text-[oklch(0.75_0.02_280)] transition-colors"
                                onClick={() => startEdit(card)}
                              >
                                {card.content}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Source: preview content */}
                        {col.id === 'sources' && (
                          <p className="text-xs text-[oklch(0.50_0.02_280)] line-clamp-2 mb-3">
                            {card.content}
                          </p>
                        )}

                        {/* Ready: full content + copy */}
                        {col.id === 'ready' && (
                          <p className="text-xs text-[oklch(0.65_0.02_280)] line-clamp-3 mb-3">
                            {card.content}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-1.5 flex-wrap">
                          {col.id === 'sources' && (
                            <button
                              onClick={() => handleDraft(card.id)}
                              className="flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-lg font-medium transition-all"
                              style={{
                                background: 'oklch(0.30 0.12 280)',
                                color: 'oklch(0.85 0.08 280)',
                              }}
                            >
                              טיוטה
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}

                          {col.id === 'review' && (
                            <>
                              <button
                                onClick={() => moveCard(card.id, 'ready')}
                                className="flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-lg font-medium bg-[oklch(0.35_0.15_150)] text-white"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                אישור
                              </button>
                              <button
                                onClick={() => moveCard(card.id, 'sources')}
                                className="px-2.5 py-1 text-[10px] rounded-lg bg-[oklch(0.20_0.04_280)] text-[oklch(0.55_0.02_280)]"
                              >
                                חזרה
                              </button>
                            </>
                          )}

                          {col.id === 'ready' && (
                            <>
                              <button
                                onClick={() => handleCopy(card.id, card.content)}
                                className="flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-lg font-medium bg-[oklch(0.30_0.12_280)] text-[oklch(0.85_0.08_280)]"
                              >
                                {copiedId === card.id ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                                {copiedId === card.id ? 'הועתק!' : 'העתק'}
                              </button>
                              <button
                                onClick={() => removeCard(card.id)}
                                className="px-2 py-1 text-[10px] rounded-lg bg-[oklch(0.20_0.04_280)] text-[oklch(0.50_0.02_280)] hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Draft Sheet ─────────────────────────────── */}
      <Sheet open={draftingSheet} onOpenChange={setDraftingSheet}>
        <SheetContent
          side="left"
          className="w-[400px] sm:w-[480px] bg-[oklch(0.14_0.02_280)] border-white/5"
        >
          <SheetHeader>
            <SheetTitle className="text-right text-[oklch(0.90_0.02_280)]">
              הגדרות ייצור
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <GenerationControls
              topic={
                cards.find((c) => c.id === activeDraftId)?.title ?? ''
              }
            />

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartGeneration}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-50"
              style={{
                background:
                  'linear-gradient(135deg, oklch(0.50 0.25 280), oklch(0.45 0.25 330))',
                boxShadow: '0 4px 24px oklch(0.40 0.20 300 / .3)',
              }}
            >
              {isGenerating ? 'מייצר...' : 'התחל ייצור'}
            </motion.button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
