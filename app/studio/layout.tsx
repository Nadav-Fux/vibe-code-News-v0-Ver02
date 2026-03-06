'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  GitBranch,
  Columns2,
  Kanban,
  PenLine,
  Sparkles,
} from 'lucide-react'
import { StudioProvider } from './hooks/use-studio-store'

const navItems = [
  {
    label: 'מרכז פיקוד',
    labelEn: 'Command Center',
    href: '/studio/command-center',
    icon: LayoutDashboard,
  },
  {
    label: 'זרימה',
    labelEn: 'Flow',
    href: '/studio/flow',
    icon: GitBranch,
  },
  {
    label: 'פיצול',
    labelEn: 'Split',
    href: '/studio/split',
    icon: Columns2,
  },
  {
    label: 'סדנה',
    labelEn: 'Workshop',
    href: '/studio/workshop',
    icon: Kanban,
  },
  {
    label: 'כותב',
    labelEn: 'Writer',
    href: '/studio/writer',
    icon: PenLine,
  },
]

export default function StudioLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <StudioProvider>
      <div
        dir="rtl"
        className="min-h-screen bg-[oklch(0.13_0.02_280)] text-[oklch(0.95_0.01_280)]"
        style={{
          background:
            'linear-gradient(145deg, oklch(0.13 0.02 280), oklch(0.10 0.03 260), oklch(0.12 0.02 300))',
        }}
      >
        {/* ── Sticky Header ──────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-2xl bg-[oklch(0.13_0.02_280/.65)]">
          <div className="mx-auto max-w-[1800px] px-4 sm:px-6">
            {/* Top row: logo + optional extras */}
            <div className="flex items-center justify-between h-14">
              <Link
                href="/studio"
                className="flex items-center gap-2.5 group"
              >
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.55_0.28_330)] shadow-lg shadow-[oklch(0.55_0.25_300/.25)] group-hover:shadow-[oklch(0.55_0.25_300/.45)] transition-shadow">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-l from-[oklch(0.85_0.15_280)] to-[oklch(0.80_0.18_330)] bg-clip-text text-transparent">
                  Content Studio
                </span>
              </Link>
            </div>

            {/* Navigation tabs */}
            <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-none pb-0">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/studio' && pathname?.startsWith(item.href))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors shrink-0"
                    style={{
                      color: isActive
                        ? 'oklch(0.95 0.01 280)'
                        : 'oklch(0.60 0.02 280)',
                    }}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.labelEn}</span>

                    {isActive && (
                      <motion.div
                        layoutId="studio-tab-indicator"
                        className="absolute inset-x-0 -bottom-px h-0.5 rounded-full"
                        style={{
                          background:
                            'linear-gradient(90deg, oklch(0.65 0.25 280), oklch(0.60 0.25 330))',
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </header>

        {/* ── Page content ───────────────────────────────────── */}
        <main className="mx-auto max-w-[1800px]">{children}</main>
      </div>
    </StudioProvider>
  )
}
