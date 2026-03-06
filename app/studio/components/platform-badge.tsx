"use client";

import {
  Linkedin,
  Twitter,
  Facebook,
  Music,
  FileText,
  Mail,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ── Platform key type ────────────────────────────────────────
export type PlatformKey =
  | "linkedin"
  | "twitter"
  | "facebook"
  | "tiktok"
  | "blog"
  | "newsletter";

// ── Per-platform config ──────────────────────────────────────
export interface PlatformConfig {
  label: string;
  icon: LucideIcon;
  color: string;        // OKLCH foreground
  bgClass: string;       // Tailwind bg + text classes
  charLimit: number;
}

export const platformsConfig: Record<PlatformKey, PlatformConfig> = {
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    color: "oklch(0.60 0.16 250)",
    bgClass: "bg-blue-600/15 text-blue-400 border-blue-500/30",
    charLimit: 3000,
  },
  twitter: {
    label: "X / Twitter",
    icon: Twitter,
    color: "oklch(0.72 0.14 220)",
    bgClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    charLimit: 280,
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    color: "oklch(0.55 0.18 260)",
    bgClass: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    charLimit: 63206,
  },
  tiktok: {
    label: "TikTok",
    icon: Music,
    color: "oklch(0.75 0.20 350)",
    bgClass: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    charLimit: 2200,
  },
  blog: {
    label: "בלוג",
    icon: FileText,
    color: "oklch(0.68 0.16 145)",
    bgClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    charLimit: 50000,
  },
  newsletter: {
    label: "ניוזלטר",
    icon: Mail,
    color: "oklch(0.70 0.17 55)",
    bgClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    charLimit: 25000,
  },
};

// ── Size mappings ────────────────────────────────────────────
const sizeClasses = {
  sm: "gap-1 px-1.5 py-0 text-[10px]",
  md: "gap-1.5 px-2 py-0.5 text-xs",
  lg: "gap-2 px-3 py-1 text-sm",
} as const;

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4",
} as const;

// ── Props ────────────────────────────────────────────────────
interface PlatformBadgeProps {
  platform: PlatformKey;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// ── Component ────────────────────────────────────────────────
export default function PlatformBadge({
  platform,
  size = "md",
  className,
}: PlatformBadgeProps) {
  const cfg = platformsConfig[platform];
  if (!cfg) return null;

  const Icon = cfg.icon;

  return (
    <Badge
      variant="outline"
      className={cn(sizeClasses[size], cfg.bgClass, className)}
    >
      <Icon className={iconSizes[size]} />
      {cfg.label}
    </Badge>
  );
}
