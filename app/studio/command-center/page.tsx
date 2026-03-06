'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Rss,
  Zap,
  Clock,
  Search,
  Gauge,
} from 'lucide-react'

import { SourceFeed } from '../components/source-feed'
import { GenerationControls } from '../components/generation-controls'
import { OutputPreview } from '../components/output-preview'
import { QuotaDisplay } from '../components/quota-display'
import { ContentCard } from '../components/content-card'
import { useGenerate } from '../hooks/use-generate'
import { useSources } from '../hooks/use-sources'
import { useStudio } from '../hooks/use-studio-store'

const filterTabs = ['הכל', 'RSS', 'API', 'ידני'] as const
type Filter = (typeof filterTabs)[number]

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function CommandCenterPage() {
  const [filter, setFilter] = useState<Filter>('הכל')
  const [topic, setTopic] = useState('')
  const { sources } = useSources()
  const { generate, isGenerating } = useGenerate()
  const { history } = useStudio()

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* ── Quota strip ───────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-sm text-[oklch(0.65_0.02_280)]">
          <Gauge className="w-4 h-4" />
          <span>מרכז פיקוד</span>
        </div>
        <QuotaDisplay />
      </div>

      {/* ── Three-column resizable layout ─────────────── */}
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 min-h-0"
      >
        {/* Left: Sources */}
        <ResizablePanel defaultSize={25} minSize={18}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="h-full flex flex-col overflow-hidden rounded-none border-l border-white/5 backdrop-blur-xl bg-[oklch(0.14_0.02_280/.45)]"
          >
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
              <Rss className="w-4 h-4 text-[oklch(0.65_0.20_280)]" />
              <h2 className="text-sm font-semibold">מקורות</h2>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 px-4 pb-3">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className="px-3 py-1 text-xs rounded-full transition-all"
                  style={{
                    background:
                      filter === tab
                        ? 'oklch(0.35 0.12 280)'
                        : 'oklch(0.18 0.02 280)',
                    color:
                      filter === tab
                        ? 'oklch(0.92 0.05 280)'
                        : 'oklch(0.55 0.02 280)',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-3">
              <SourceFeed filter={filter} />
            </div>
          </motion.div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/5 w-px" />

        {/* Center: Generation controls */}
        <ResizablePanel defaultSize={40} minSize={28}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="h-full flex flex-col overflow-y-auto backdrop-blur-xl bg-[oklch(0.13_0.015_280/.35)] px-6 py-5"
          >
            {/* Topic input */}
            <div className="relative mb-5">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.50_0.02_280)]" />
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="נושא או הנחיה..."
                className="pr-10 bg-[oklch(0.16_0.02_280)] border-white/8 text-sm placeholder:text-[oklch(0.40_0.02_280)] focus-visible:ring-[oklch(0.55_0.20_280)]"
              />
            </div>

            <div className="flex-1">
              <GenerationControls topic={topic} />
            </div>

            {/* Generate action */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => generate(topic)}
              disabled={isGenerating}
              className="mt-4 w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
              style={{
                background: isGenerating
                  ? 'oklch(0.25 0.08 280)'
                  : 'linear-gradient(135deg, oklch(0.55 0.25 280), oklch(0.50 0.25 330))',
                color: 'oklch(0.97 0.01 280)',
                boxShadow: isGenerating
                  ? 'none'
                  : '0 4px 24px oklch(0.45 0.20 300 / .3)',
              }}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 animate-pulse" />
                  מייצר...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  ייצר תוכן
                </span>
              )}
            </motion.button>
          </motion.div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/5 w-px" />

        {/* Right: Output */}
        <ResizablePanel defaultSize={35} minSize={22}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="h-full overflow-y-auto backdrop-blur-xl bg-[oklch(0.14_0.02_280/.45)] border-r border-white/5 p-5"
          >
            <OutputPreview />
          </motion.div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* ── Bottom history strip ──────────────────────── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="border-t border-white/5 bg-[oklch(0.12_0.02_280/.60)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 px-6 py-2">
          <Clock className="w-3.5 h-3.5 text-[oklch(0.50_0.02_280)]" />
          <span className="text-xs text-[oklch(0.50_0.02_280)]">
            היסטוריה אחרונה
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto px-6 pb-3 scrollbar-none">
          {(history ?? []).length === 0 ? (
            <p className="text-xs text-[oklch(0.40_0.02_280)] py-4">
              עדיין אין תוכן — ייצר משהו כדי להתחיל.
            </p>
          ) : (
            history.map((item, i) => (
              <motion.div key={item.id ?? i} variants={fadeUp} className="shrink-0">
                <ContentCard item={item} compact />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}
