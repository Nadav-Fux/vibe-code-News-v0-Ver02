"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Share2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import PlatformBadge, {
  type PlatformKey,
  platformsConfig,
} from "./platform-badge";

// ── Types ────────────────────────────────────────────────────
interface Generation {
  id: string;
  content: string;
  platform: PlatformKey;
  llm_used: string;
  tone?: string;
  depth?: string;
  style?: string;
  word_count: number;
  char_count?: number;
  created_at: string;
  source_refs?: unknown[];
}

// ── Time-ago helper ──────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "עכשיו";
  if (minutes < 60) return `לפני ${minutes} דק׳`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `לפני ${hours} שע׳`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `לפני ${days} ימים`;
  return new Date(dateStr).toLocaleDateString("he-IL");
}

// ── Platform border color ────────────────────────────────────
const borderColors: Record<PlatformKey, string> = {
  linkedin: "border-s-blue-500",
  twitter: "border-s-sky-400",
  facebook: "border-s-indigo-500",
  tiktok: "border-s-pink-500",
  blog: "border-s-emerald-500",
  newsletter: "border-s-amber-500",
};

// ── Props ────────────────────────────────────────────────────
interface ContentCardProps {
  generation: Generation;
  onDelete?: (id: string) => void;
  onOpen?: (id: string) => void;
  className?: string;
}

// ── Component ────────────────────────────────────────────────
export default function ContentCard({
  generation,
  onDelete,
  onOpen,
  className,
}: ContentCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(generation.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generation.content]);

  // Extract a title-like first line or first N chars
  const title =
    generation.content.split("\n")[0]?.slice(0, 60) ||
    generation.content.slice(0, 60);
  const snippet = generation.content.slice(title.length).trim();

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={className}
    >
      <Card
        className={cn(
          "cursor-pointer overflow-hidden border-s-[3px] transition-colors hover:border-primary/30",
          borderColors[generation.platform] ?? "border-s-muted-foreground",
        )}
        onClick={() => onOpen?.(generation.id)}
      >
        <CardContent className="flex flex-col gap-2.5 p-3.5">
          {/* ── Top row: platform badge + time ──────────── */}
          <div className="flex items-center gap-2">
            <PlatformBadge platform={generation.platform} size="sm" />
            <span className="me-auto text-[10px] text-muted-foreground">
              {timeAgo(generation.created_at)}
            </span>
          </div>

          {/* ── Title ──────────────────────────────────── */}
          <p className="line-clamp-1 text-sm font-medium leading-snug">
            {title}
          </p>

          {/* ── Snippet ────────────────────────────────── */}
          {snippet && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {snippet}
            </p>
          )}

          {/* ── Meta badges ────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              variant="secondary"
              className="px-1.5 py-0 text-[10px] font-normal"
            >
              {generation.llm_used}
            </Badge>
            <Badge
              variant="outline"
              className="px-1.5 py-0 text-[10px] font-normal text-muted-foreground"
            >
              {generation.word_count} מילים
            </Badge>
          </div>

          {/* ── Footer actions ─────────────────────────── */}
          <div className="flex items-center gap-1 border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              {copied ? "הועתק" : "העתק"}
            </Button>

            <div className="me-auto" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" dir="rtl">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen?.(generation.id);
                  }}
                >
                  <ExternalLink className="me-2 h-3.5 w-3.5" />
                  פתח
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                >
                  <Copy className="me-2 h-3.5 w-3.5" />
                  העתק תוכן
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Share2 className="me-2 h-3.5 w-3.5" />
                  שתף
                </DropdownMenuItem>
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-400 focus:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(generation.id);
                      }}
                    >
                      <Trash2 className="me-2 h-3.5 w-3.5" />
                      מחק
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
