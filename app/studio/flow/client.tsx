'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Rss,
  SlidersHorizontal,
  Zap,
  FileOutput,
  ArrowDown,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

import SourceFeed from '../components/source-feed'
import GenerationControls from '../components/generation-controls'
import OutputPreview from '../components/output-preview'
import { useGenerate } from '../hooks/use-generate'
import { useSources } from '../hooks/use-sources'
import { useStudio } from '../hooks/use-studio-store'

/* ── Stage wrapper ────────────────────────────────────────── */
function Stage({
  index,
  icon: Icon,
  title,
  subtitle,
  completed,
  unlocked,
  children,
}: {
  index: number
  icon: React.ElementType
  title: string
  subtitle: string
  completed: boolean
  unlocked: boolean
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { amount: 0.4 })

  return (
    <section
      ref={ref}
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-8 py-16 snap-start relative"
      style={{
        scrollSnapAlign: 'start',
      }}
    >
      {/* Connecting line to next stage */}
      {index < 3 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-24 flex flex-col items-center z-10">
          <svg width="2" height="60" className="overflow-visible">
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="60"
              stroke="oklch(0.35 0.10 280)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <motion.circle
              cx="1"
              r="3"
              fill="oklch(0.65 0.25 280)"
              animate={{ cy: [0, 60] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </svg>
          <ArrowDown className="w-4 h-4 text-[oklch(0.40_0.12_280)] mt-1" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-4xl"
        style={{
          opacity: unlocked ? undefined : 0.3,
          filter: unlocked ? 'none' : 'grayscale(0.6)',
          pointerEvents: unlocked ? 'auto' : 'none',
          transition: 'opacity 0.5s, filter 0.5s',
        }}
      >
        {/* Stage header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              background: completed
                ? 'oklch(0.45 0.18 150)'
                : 'linear-gradient(135deg, oklch(0.30 0.12 280), oklch(0.25 0.12 310))',
            }}
          >
            {completed ? (
              <CheckCircle2 className="w-5 h-5 text-white" />
            ) : (
              <Icon className="w-5 h-5 text-[oklch(0.80_0.10_280)]" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-xs text-[oklch(0.50_0.02_280)]">{subtitle}</p>
          </div>
          <span className="mr-auto text-xs font-mono text-[oklch(0.35_0.05_280)]">
            {index + 1}/4
          </span>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-white/5 backdrop-blur-xl bg-[oklch(0.14_0.02_280/.50)] p-6 shadow-2xl shadow-black/20">
          {children}
        </div>
      </motion.div>
    </section>
  )
}

/* ── Flow Page ────────────────────────────────────────────── */
export default function FlowPage() {
  const [sourcesReady, setSourcesReady] = useState(false)
  const [configReady, setConfigReady] = useState(false)
  const [topic, setTopic] = useState('')
  const { generate, isGenerating, output } = useGenerate()
  const { items: sources } = useSources()

  const generateDone = !!output

  return (
    <div
      className="h-[calc(100vh-7rem)] overflow-y-auto"
      style={{
        scrollSnapType: 'y mandatory',
      }}
    >
      {/* Stage 1: Sources */}
      <Stage
        index={0}
        icon={Rss}
        title="בחירת מקורות"
        subtitle="בחר מקורות תוכן להזנת הייצור"
        completed={sourcesReady}
        unlocked={true}
      >
        <div className="space-y-4">
          {/* Horizontal filter buttons */}
          <div className="flex gap-2 flex-wrap">
            {['הכל', 'RSS', 'API', 'ידני'].map((f) => (
              <button
                key={f}
                className="px-4 py-1.5 text-xs rounded-full bg-[oklch(0.20_0.04_280)] text-[oklch(0.70_0.03_280)] hover:bg-[oklch(0.25_0.08_280)] transition-colors"
              >
                {f}
              </button>
            ))}
          </div>

          <div className="max-h-64 overflow-y-auto">
            <SourceFeed layout="horizontal" />
          </div>

          <button
            onClick={() => setSourcesReady(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-l from-[oklch(0.50_0.22_280)] to-[oklch(0.45_0.22_310)] text-white shadow-lg shadow-[oklch(0.40_0.20_290/.25)] hover:shadow-[oklch(0.40_0.20_290/.45)] transition-shadow"
          >
            אישור מקורות →
          </button>
        </div>
      </Stage>

      {/* Stage 2: Configure */}
      <Stage
        index={1}
        icon={SlidersHorizontal}
        title="הגדרות ייצור"
        subtitle="התאם פלטפורמה, טון ואורך"
        completed={configReady}
        unlocked={sourcesReady}
      >
        <div className="space-y-6">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="נושא או הנחיה ספציפית..."
            className="w-full px-4 py-3 rounded-xl bg-[oklch(0.16_0.02_280)] border border-white/8 text-sm placeholder:text-[oklch(0.40_0.02_280)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.55_0.20_280)]"
          />

          <GenerationControls topic={topic} />

          <button
            onClick={() => setConfigReady(true)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-l from-[oklch(0.50_0.22_280)] to-[oklch(0.45_0.22_310)] text-white shadow-lg shadow-[oklch(0.40_0.20_290/.25)] hover:shadow-[oklch(0.40_0.20_290/.45)] transition-shadow"
          >
            אישור הגדרות →
          </button>
        </div>
      </Stage>

      {/* Stage 3: Generate */}
      <Stage
        index={2}
        icon={Zap}
        title="ייצור תוכן"
        subtitle="לחץ ליצירת תוכן עם AI"
        completed={generateDone}
        unlocked={configReady}
      >
        <div className="flex flex-col items-center justify-center py-12 gap-8">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => generate(topic)}
            disabled={isGenerating}
            className="relative w-36 h-36 rounded-full flex items-center justify-center text-white font-bold text-lg disabled:opacity-60"
            style={{
              background:
                'linear-gradient(135deg, oklch(0.50 0.28 280), oklch(0.45 0.28 330))',
              boxShadow:
                '0 0 60px oklch(0.45 0.25 300 / .35), 0 0 120px oklch(0.40 0.20 280 / .15)',
            }}
          >
            {/* Animated border gradient while loading */}
            {isGenerating && (
              <motion.div
                className="absolute inset-[-3px] rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, oklch(0.65 0.30 280), oklch(0.55 0.30 330), oklch(0.50 0.25 200), oklch(0.65 0.30 280))',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute inset-[3px] rounded-full bg-[oklch(0.14_0.02_280)]" />
              </motion.div>
            )}

            <span className="relative z-10 flex flex-col items-center gap-1">
              {isGenerating ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-normal">מייצר...</span>
                </>
              ) : (
                <>
                  <Zap className="w-8 h-8" />
                  <span className="text-sm">ייצר</span>
                </>
              )}
            </span>
          </motion.button>

          {/* Streaming progress */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-48 h-1.5 rounded-full bg-[oklch(0.20_0.04_280)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, oklch(0.55 0.25 280), oklch(0.50 0.25 330))',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-[oklch(0.50_0.02_280)]">
                מעבד ומייצר תוכן...
              </p>
            </motion.div>
          )}
        </div>
      </Stage>

      {/* Stage 4: Output */}
      <Stage
        index={3}
        icon={FileOutput}
        title="תוצאה"
        subtitle="עיין, ערוך והעתק"
        completed={false}
        unlocked={generateDone}
      >
        <OutputPreview />
      </Stage>
    </div>
  )
}
