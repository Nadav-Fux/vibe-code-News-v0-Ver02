'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Search,
  Linkedin,
  Twitter,
  BookOpen,
  Clapperboard,
  Mail,
  Keyboard,
  Copy,
  Check,
} from 'lucide-react'

import SourceFeed from '../components/source-feed'
import GenerationControls from '../components/generation-controls'
import OutputPreview from '../components/output-preview'
import PlatformBadge from '../components/platform-badge'
import { useGenerate } from '../hooks/use-generate'
import { useSources } from '../hooks/use-sources'

const platforms = [
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'x', label: 'X', icon: Twitter },
  { id: 'blog', label: 'בלוג', icon: BookOpen },
  { id: 'tiktok', label: 'TikTok', icon: Clapperboard },
  { id: 'newsletter', label: 'ניוזלטר', icon: Mail },
] as const

const filters = ['RSS', 'API', 'ידני', 'חברתי'] as const

export default function SplitPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [platform, setPlatform] = useState('linkedin')
  const [editableOutput, setEditableOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const { generate, isGenerating, output } = useGenerate()
  const { items: sources } = useSources()

  const toggleFilter = (f: string) =>
    setSelectedFilters((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableOutput || output || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* ── Left: Sources ─────────────────────────── */}
        <ResizablePanel defaultSize={38} minSize={25}>
          <div className="h-full flex flex-col backdrop-blur-xl bg-[oklch(0.14_0.02_280/.45)] border-l border-white/5">
            {/* Search */}
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[oklch(0.45_0.02_280)]" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="חיפוש מקורות..."
                  className="pr-10 bg-[oklch(0.16_0.02_280)] border-white/8 text-sm placeholder:text-[oklch(0.40_0.02_280)] focus-visible:ring-[oklch(0.55_0.20_280)]"
                />
              </div>
            </div>

            {/* Filter checkboxes */}
            <div className="flex flex-wrap gap-3 px-4 py-3 border-b border-white/5">
              {filters.map((f) => (
                <label
                  key={f}
                  className="flex items-center gap-1.5 text-xs text-[oklch(0.65_0.02_280)] cursor-pointer"
                >
                  <Checkbox
                    checked={selectedFilters.includes(f)}
                    onCheckedChange={() => toggleFilter(f)}
                    className="border-white/20 data-[state=checked]:bg-[oklch(0.50_0.22_280)] data-[state=checked]:border-[oklch(0.50_0.22_280)]"
                  />
                  {f}
                </label>
              ))}
            </div>

            {/* Source feed with multi-select */}
            <div className="flex-1 overflow-y-auto p-3">
              <SourceFeed
                searchQuery={searchQuery}
                filters={selectedFilters}
                multiSelect
                selectedIds={selectedSources}
                onSelectionChange={setSelectedSources}
              />
            </div>

            {/* Selection count */}
            <AnimatePresence>
              {selectedSources.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 py-2 border-t border-white/5 bg-[oklch(0.18_0.06_280/.50)]"
                >
                  <p className="text-xs text-[oklch(0.70_0.10_280)]">
                    {selectedSources.length} מקורות נבחרו
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/5 w-px" />

        {/* ── Right: Config + Output ────────────────── */}
        <ResizablePanel defaultSize={62} minSize={35}>
          <div className="h-full flex flex-col backdrop-blur-xl bg-[oklch(0.13_0.015_280/.35)]">
            {/* Platform tabs */}
            <Tabs
              value={platform}
              onValueChange={setPlatform}
              className="flex flex-col flex-1 min-h-0"
            >
              <TabsList className="flex justify-start gap-1 px-4 pt-3 pb-0 bg-transparent h-auto">
                {platforms.map((p) => (
                  <TabsTrigger
                    key={p.id}
                    value={p.id}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg data-[state=active]:bg-[oklch(0.22_0.08_280)] data-[state=active]:text-white text-[oklch(0.55_0.02_280)] transition-all"
                  >
                    <p.icon className="w-3.5 h-3.5" />
                    {p.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Shared content area for all tabs */}
              <div className="flex-1 flex flex-col min-h-0 px-5 py-4 gap-4 overflow-y-auto">
                {/* Platform badge */}
                <PlatformBadge platform={platform} />

                {/* Compact generation controls */}
                <div className="rounded-xl border border-white/5 bg-[oklch(0.15_0.02_280/.50)] p-4">
                  <GenerationControls compact platform={platform} />
                </div>

                {/* Editable output */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[oklch(0.75_0.03_280)]">
                      תוצאה
                    </h3>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg bg-[oklch(0.20_0.04_280)] hover:bg-[oklch(0.25_0.06_280)] text-[oklch(0.65_0.02_280)] transition-colors"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copied ? 'הועתק!' : 'העתק'}
                    </button>
                  </div>

                  <Textarea
                    value={editableOutput || output || ''}
                    onChange={(e) => setEditableOutput(e.target.value)}
                    placeholder="התוצאה תופיע כאן... ניתן לערוך ישירות."
                    className="flex-1 min-h-[200px] bg-[oklch(0.15_0.02_280/.60)] border-white/5 text-sm leading-relaxed placeholder:text-[oklch(0.35_0.02_280)] focus-visible:ring-[oklch(0.55_0.20_280)] resize-none"
                    dir="rtl"
                  />
                </div>
              </div>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* ── Keyboard shortcuts bar ───────────────────── */}
      <div className="flex items-center justify-center gap-6 px-6 py-2.5 border-t border-white/5 bg-[oklch(0.11_0.01_280/.70)] backdrop-blur-xl">
        {[
          { keys: 'K', icon: Search, label: 'חיפוש' },
          { keys: 'G', icon: null, label: 'ייצור' },
          { keys: 'C', icon: Copy, label: 'העתקה' },
        ].map((shortcut) => (
          <div
            key={shortcut.keys}
            className="flex items-center gap-1.5 text-[10px] text-[oklch(0.45_0.02_280)]"
          >
            <Keyboard className="w-3 h-3" />
            <kbd className="px-1.5 py-0.5 rounded bg-[oklch(0.18_0.02_280)] border border-white/8 font-mono text-[oklch(0.60_0.02_280)]">
              {shortcut.keys}
            </kbd>
            <span>{shortcut.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
