"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Mail,
  Save,
  RefreshCw,
  Loader2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import PlatformBadge, {
  type PlatformKey,
  platformsConfig,
} from "./platform-badge";

// ── Helpers ──────────────────────────────────────────────────
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function readingTime(words: number): string {
  const mins = Math.ceil(words / 200);
  return mins <= 1 ? "פחות מדקה" : `${mins} דק׳ קריאה`;
}

// ── Props ────────────────────────────────────────────────────
interface OutputPreviewProps {
  content: string;
  platform: PlatformKey;
  isLoading: boolean;
  onRegenerate: () => void;
}

// ── Component ────────────────────────────────────────────────
export default function OutputPreview({
  content,
  platform,
  isLoading,
  onRegenerate,
}: OutputPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [saved, setSaved] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (isLoading && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content, isLoading]);

  const charLimit = platformsConfig[platform]?.charLimit ?? Infinity;
  const chars = content.length;
  const words = useMemo(() => wordCount(content), [content]);
  const overLimit = chars > charLimit;

  // ── Copy to clipboard ──────────────────────────────────
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  // ── Send email ─────────────────────────────────────────
  const handleSendEmail = useCallback(async () => {
    if (!email.trim()) return;
    setSending(true);
    try {
      await fetch("/api/studio/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, content, platform }),
      });
      setEmailOpen(false);
      setEmail("");
    } finally {
      setSending(false);
    }
  }, [email, content, platform]);

  // ── Save to history ────────────────────────────────────
  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  // ── Empty state ────────────────────────────────────────
  if (!content && !isLoading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/20 p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <FileText className="h-12 w-12 text-muted-foreground/40" />
        </motion.div>
        <p className="text-center text-sm text-muted-foreground">
          בחר מקורות, הגדר פרמטרים ולחץ על &ldquo;ייצר תוכן&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card">
      {/* ── Header: platform badge ─────────────────────── */}
      <div className="flex items-center gap-2 border-b px-4 pt-4 pb-3">
        <PlatformBadge platform={platform} size="lg" />
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>מייצר...</span>
          </motion.div>
        )}
      </div>

      {/* ── Content area ───────────────────────────────── */}
      <div
        ref={contentRef}
        className="max-h-[480px] min-h-[200px] overflow-y-auto px-4"
        dir="rtl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={content.length > 0 ? "content" : "empty"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="whitespace-pre-wrap text-sm leading-relaxed"
          >
            {content}
            {isLoading && (
              <motion.span
                className="inline-block h-4 w-0.5 bg-primary"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Stats bar ──────────────────────────────────── */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 border-t px-4 py-2 text-[11px]",
          overLimit ? "text-red-400" : "text-muted-foreground",
        )}
      >
        <span>{words} מילים</span>
        <span className="text-muted-foreground/30">|</span>
        <span className="flex items-center gap-1">
          {chars.toLocaleString()} / {charLimit.toLocaleString()} תווים
          {overLimit && <AlertTriangle className="h-3 w-3 text-red-400" />}
        </span>
        <span className="text-muted-foreground/30">|</span>
        <span>{readingTime(words)}</span>
      </div>

      {/* ── Action buttons ─────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleCopy}
          disabled={!content}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copied ? "הועתק!" : "העתק"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setEmailOpen(true)}
          disabled={!content}
        >
          <Mail className="h-3.5 w-3.5" />
          שלח למייל
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={handleSave}
          disabled={!content}
        >
          {saved ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saved ? "נשמר!" : "שמור"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="me-auto gap-1.5 text-xs"
          onClick={onRegenerate}
          disabled={isLoading}
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", isLoading && "animate-spin")}
          />
          ייצר מחדש
        </Button>
      </div>

      {/* ── Email dialog ───────────────────────────────── */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent dir="rtl" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>שליחה למייל</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="email-input">כתובת מייל</Label>
            <Input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              dir="ltr"
              className="text-left"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleSendEmail}
              disabled={sending || !email.trim()}
              className="gap-2"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              שלח
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
