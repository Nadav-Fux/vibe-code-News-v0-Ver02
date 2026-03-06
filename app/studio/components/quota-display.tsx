"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Search, Bot, Cpu } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────
interface QuotaData {
  serp: { used: number; total: number };
  apify: { remaining: number; total: number };
  llms: {
    name: string;
    status: "active" | "down" | "degraded";
  }[];
}

const defaultQuota: QuotaData = {
  serp: { used: 0, total: 250 },
  apify: { remaining: 0, total: 5 },
  llms: [
    { name: "Gemini", status: "active" },
    { name: "GLM", status: "active" },
    { name: "Groq", status: "active" },
    { name: "Minimax", status: "active" },
    { name: "OpenAI", status: "active" },
  ],
};

// ── Animated counter ─────────────────────────────────────────
function AnimatedNumber({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const spring = useSpring(0, { stiffness: 120, damping: 30 });
  const display = useTransform(spring, (v) => Math.round(v));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsub = display.on("change", (v) => setCurrent(v));
    return unsub;
  }, [display]);

  return <span className={className}>{current}</span>;
}

// ── Status dot color ─────────────────────────────────────────
function statusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-emerald-500 shadow-emerald-500/40";
    case "degraded":
      return "bg-amber-500 shadow-amber-500/40";
    case "down":
      return "bg-red-500 shadow-red-500/40";
    default:
      return "bg-muted-foreground";
  }
}

function serpBarColor(pct: number): string {
  if (pct < 60) return "bg-emerald-500";
  if (pct < 85) return "bg-amber-500";
  return "bg-red-500";
}

// ── Component ────────────────────────────────────────────────
export default function QuotaDisplay() {
  const [quota, setQuota] = useState<QuotaData>(defaultQuota);
  const [loaded, setLoaded] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchQuota() {
      try {
        const res = await fetch("/api/studio/quota");
        if (res.ok) {
          const data = await res.json();
          setQuota(data);
        }
      } catch {
        // silently use defaults
      } finally {
        setLoaded(true);
      }
    }

    fetchQuota();
  }, []);

  const serpPct = (quota.serp.used / quota.serp.total) * 100;
  const apifyPct =
    ((quota.apify.total - quota.apify.remaining) / quota.apify.total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: loaded ? 1 : 0.5, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-wrap items-center gap-4 rounded-lg border bg-card/60 px-4 py-2.5 backdrop-blur-sm"
      dir="rtl"
    >
      {/* ── SerpAPI quota ──────────────────────────────── */}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2.5">
              <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="flex items-center gap-1.5 text-xs">
                <AnimatedNumber
                  value={quota.serp.used}
                  className="font-semibold tabular-nums"
                />
                <span className="text-muted-foreground">
                  / {quota.serp.total} חיפושים
                </span>
              </div>
              <div className="w-20">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full", serpBarColor(serpPct))}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(serpPct, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>SerpAPI: {quota.serp.used} מתוך {quota.serp.total} חיפושים</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* ── Divider ────────────────────────────────────── */}
      <div className="h-4 w-px bg-border" />

      {/* ── Apify quota ────────────────────────────────── */}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2.5">
              <Bot className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="flex items-center gap-1 text-xs">
                <span className="font-semibold tabular-nums">
                  ${quota.apify.remaining.toFixed(2)}
                </span>
                <span className="text-muted-foreground">נותר</span>
              </div>
              <div className="w-16">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      apifyPct < 60
                        ? "bg-emerald-500"
                        : apifyPct < 85
                          ? "bg-amber-500"
                          : "bg-red-500",
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(apifyPct, 100)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                  />
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Apify: ${quota.apify.remaining.toFixed(2)} נותר מתוך $
              {quota.apify.total.toFixed(2)}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* ── Divider ────────────────────────────────────── */}
      <div className="h-4 w-px bg-border" />

      {/* ── LLM status dots ────────────────────────────── */}
      <TooltipProvider delayDuration={200}>
        <div className="flex items-center gap-2">
          <Cpu className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="flex items-center gap-1.5">
            {quota.llms.map((llm) => (
              <Tooltip key={llm.name}>
                <TooltipTrigger asChild>
                  <motion.div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full shadow-sm",
                      statusColor(llm.status),
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      delay: 0.3,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {llm.name}:{" "}
                    {llm.status === "active"
                      ? "פעיל"
                      : llm.status === "degraded"
                        ? "מוגבל"
                        : "לא זמין"}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>
    </motion.div>
  );
}
