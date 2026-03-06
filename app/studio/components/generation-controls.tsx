"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Linkedin,
  Twitter,
  Facebook,
  Music,
  FileText,
  Mail,
  Sparkles,
  Loader2,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useStudio } from "../hooks/use-studio-store";
import type { PlatformKey } from "./platform-badge";

// ── Platform options ─────────────────────────────────────────
const platforms: { value: PlatformKey; label: string; icon: typeof Linkedin }[] = [
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "twitter", label: "X", icon: Twitter },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "tiktok", label: "TikTok", icon: Music },
  { value: "blog", label: "בלוג", icon: FileText },
  { value: "newsletter", label: "ניוזלטר", icon: Mail },
];

// ── LLM options ──────────────────────────────────────────────
const llmOptions = [
  { value: "gemini", label: "Gemini" },
  { value: "glm", label: "GLM" },
  { value: "groq", label: "Groq" },
  { value: "minimax", label: "Minimax" },
  { value: "openai", label: "OpenAI" },
];

// ── Style presets ────────────────────────────────────────────
const stylePresets = [
  { value: "professional", label: "מקצועי" },
  { value: "witty", label: "שנון" },
  { value: "educational", label: "חינוכי" },
  { value: "provocative", label: "פרובוקטיבי" },
];

// ── Depth options ────────────────────────────────────────────
const depthOptions = [
  { value: "brief", label: "תמציתי" },
  { value: "medium", label: "בינוני" },
  { value: "deep", label: "מעמיק" },
];

// ── Props ────────────────────────────────────────────────────
interface GenerationControlsProps {
  onGenerate: () => void;
}

// ── Component ────────────────────────────────────────────────
export default function GenerationControls({
  onGenerate,
}: GenerationControlsProps) {
  const {
    platform,
    setPlatform,
    llm,
    setLlm,
    tone,
    setTone,
    depth,
    setDepth,
    style,
    setStyle,
    topic,
    setTopic,
    isGenerating,
  } = useStudio();

  const handleToneChange = useCallback(
    (val: number[]) => setTone(val[0]),
    [setTone],
  );

  // Tone label
  const toneLabel =
    tone <= 25
      ? "רשמי"
      : tone <= 50
        ? "מאוזן"
        : tone <= 75
          ? "גמיש"
          : "יצירתי";

  return (
    <div className="flex flex-col gap-5 rounded-xl border bg-card p-4">
      {/* ── Platform selector ────────────────────────────── */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          פלטפורמה
        </Label>
        <ToggleGroup
          type="single"
          value={platform}
          onValueChange={(v) => v && setPlatform(v as PlatformKey)}
          className="flex flex-wrap justify-start gap-1"
        >
          {platforms.map((p) => {
            const Icon = p.icon;
            return (
              <ToggleGroupItem
                key={p.value}
                value={p.value}
                aria-label={p.label}
                className={cn(
                  "gap-1.5 px-2.5 py-1.5 text-xs",
                  "data-[state=on]:bg-primary/15 data-[state=on]:text-primary",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{p.label}</span>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      {/* ── LLM selector ─────────────────────────────────── */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          מודל שפה
        </Label>
        <Select value={llm} onValueChange={setLlm}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="בחר מודל" />
          </SelectTrigger>
          <SelectContent>
            {llmOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Tone slider ──────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">
            טון
          </Label>
          <span className="text-[10px] font-medium text-primary">
            {toneLabel} ({tone})
          </span>
        </div>
        <Slider
          value={[tone]}
          onValueChange={handleToneChange}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>רשמי</span>
          <span>יצירתי</span>
        </div>
      </div>

      {/* ── Depth selector ───────────────────────────────── */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          עומק
        </Label>
        <ToggleGroup
          type="single"
          value={depth}
          onValueChange={(v) => v && setDepth(v)}
          className="w-full"
        >
          {depthOptions.map((d) => (
            <ToggleGroupItem
              key={d.value}
              value={d.value}
              className="flex-1 text-xs data-[state=on]:bg-primary/15 data-[state=on]:text-primary"
            >
              {d.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* ── Style presets ────────────────────────────────── */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          סגנון
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {stylePresets.map((s) => (
            <Button
              key={s.value}
              variant={style === s.value ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-7 rounded-full px-3 text-xs transition-all",
                style === s.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-primary/10",
              )}
              onClick={() => setStyle(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ── Topic input ──────────────────────────────────── */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          נושא
        </Label>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="על מה נכתוב?"
          className="text-sm"
          dir="rtl"
        />
      </div>

      {/* ── Generate button ──────────────────────────────── */}
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          size="lg"
          disabled={isGenerating}
          onClick={onGenerate}
          className={cn(
            "w-full gap-2 text-base font-semibold",
            "bg-gradient-to-l from-primary via-primary/90 to-primary/80",
            "shadow-lg shadow-primary/20 transition-shadow hover:shadow-xl hover:shadow-primary/30",
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              מייצר תוכן...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              ייצר תוכן
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
