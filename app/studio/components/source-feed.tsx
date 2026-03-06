"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rss, Search, Twitter, Bot, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { SourceItem } from "../hooks/use-sources";

// ── Source type visual config ────────────────────────────────
const sourceTypeConfig: Record<
  string,
  { label: string; icon: typeof Rss; color: string; badgeBg: string }
> = {
  rss: {
    label: "RSS",
    icon: Rss,
    color: "oklch(0.70 0.17 45)",
    badgeBg: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  },
  serp: {
    label: "SerpAPI",
    icon: Search,
    color: "oklch(0.70 0.17 145)",
    badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  },
  twitter: {
    label: "Twitter",
    icon: Twitter,
    color: "oklch(0.70 0.17 230)",
    badgeBg: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  },
  apify: {
    label: "Apify",
    icon: Bot,
    color: "oklch(0.70 0.17 310)",
    badgeBg: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  },
};

const filterTabs = [
  { value: "all", label: "הכל" },
  { value: "rss", label: "RSS" },
  { value: "serp", label: "SerpAPI" },
  { value: "twitter", label: "Twitter" },
  { value: "apify", label: "Apify" },
];

// ── Time-ago helper ──────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דק׳`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `לפני ${hours} שע׳`;
  const days = Math.floor(hours / 24);
  return `לפני ${days} ימים`;
}

// ── Animation variants ───────────────────────────────────────
const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 28 },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.18 } },
};

// ── Props ────────────────────────────────────────────────────
interface SourceFeedProps {
  items: SourceItem[];
  onToggle: (item: SourceItem) => void;
  selectedIds: Set<string>;
  filter: string;
  onFilterChange: (value: string) => void;
}

// ── Component ────────────────────────────────────────────────
export default function SourceFeed({
  items,
  onToggle,
  selectedIds,
  filter,
  onFilterChange,
}: SourceFeedProps) {
  const filtered = useMemo(
    () =>
      filter === "all"
        ? items
        : items.filter((i) => i.source_type === filter),
    [items, filter],
  );

  return (
    <div className="flex h-full flex-col gap-3">
      {/* ── Filter tabs ─────────────────────────────────── */}
      <Tabs value={filter} onValueChange={onFilterChange}>
        <TabsList className="w-full justify-start gap-1 bg-muted/40 p-1">
          {filterTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="text-xs data-[state=active]:bg-background"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* ── Selected counter ────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-xs text-primary">
          <Filter className="h-3 w-3" />
          <span>{selectedIds.size} פריטים נבחרו</span>
        </div>
      )}

      {/* ── Scrollable feed ─────────────────────────────── */}
      <ScrollArea className="flex-1" dir="rtl">
        <AnimatePresence mode="popLayout">
          <motion.div
            className="flex flex-col gap-2 pe-3"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            key={filter}
          >
            {filtered.length === 0 && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                אין תוצאות עבור הסינון הנוכחי
              </p>
            )}

            {filtered.map((item) => {
              const cfg = sourceTypeConfig[item.source_type] ?? sourceTypeConfig.rss;
              const Icon = cfg.icon;
              const isSelected = selectedIds.has(item.id);

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  layoutId={item.id}
                >
                  <Card
                    className={cn(
                      "cursor-pointer border transition-colors hover:border-primary/40",
                      isSelected && "border-primary/60 bg-primary/5",
                    )}
                    onClick={() => onToggle(item)}
                  >
                    <CardContent className="flex items-start gap-3 p-3">
                      {/* Checkbox */}
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggle(item)}
                        className="mt-1 shrink-0"
                        aria-label={`בחר ${item.title}`}
                      />

                      {/* Content */}
                      <div className="min-w-0 flex-1 space-y-1.5">
                        {/* Top row: badge + source + time */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <Badge
                            variant="outline"
                            className={cn("gap-1 px-1.5 py-0", cfg.badgeBg)}
                          >
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </Badge>
                          <span className="text-muted-foreground">
                            {item.source_name}
                          </span>
                          <span className="me-auto text-muted-foreground/60">
                            {timeAgo(item.fetched_at)}
                          </span>
                        </div>

                        {/* Title */}
                        <p className="line-clamp-1 text-sm font-medium leading-snug">
                          {item.title}
                        </p>

                        {/* Snippet */}
                        {item.content && (
                          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
