"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Pin } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

type NewsFlash = {
  id: string
  content: string
  image_url: string | null
  created_at: string
  is_pinned: boolean
}

type Theme = "whatsapp" | "messenger" | "minimal"

const themeStyles = {
  whatsapp: {
    container: "bg-[#0a1014]",
    message: "bg-[#005c4b] text-white",
    time: "text-gray-300",
    avatar: "bg-[#00a884]",
  },
  messenger: {
    container: "bg-gradient-to-b from-purple-50 to-blue-50",
    message: "bg-gradient-to-br from-purple-500 to-blue-500 text-white",
    time: "text-gray-700",
    avatar: "bg-gradient-to-br from-purple-600 to-blue-600",
  },
  minimal: {
    container: "bg-gray-50",
    message: "bg-white border border-gray-200 text-gray-900",
    time: "text-gray-600",
    avatar: "bg-blue-600",
  },
}

export function NewsFlashFeedClient({ flashes }: { flashes: NewsFlash[] }) {
  const [theme, setTheme] = useState<Theme>("whatsapp")

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "עכשיו"
    if (diffMins < 60) return `לפני ${diffMins} דקות`
    if (diffHours < 24) return `לפני ${diffHours} שעות`
    if (diffDays < 7) return `לפני ${diffDays} ימים`
    return date.toLocaleDateString("he-IL")
  }

  const styles = themeStyles[theme]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => setTheme("whatsapp")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            theme === "whatsapp" ? "bg-[#00a884] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
          )}
        >
          סגנון WhatsApp
        </button>
        <button
          onClick={() => setTheme("messenger")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            theme === "messenger"
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300",
          )}
        >
          סגנון Messenger
        </button>
        <button
          onClick={() => setTheme("minimal")}
          className={cn(
            "px-4 py-2 rounded-lg font-medium transition-all",
            theme === "minimal" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300",
          )}
        >
          סגנון מינימליסטי
        </button>
      </div>

      <div className={cn("rounded-2xl p-6 min-h-[600px]", styles.container)}>
        <div className="max-w-3xl mx-auto space-y-4">
          {flashes.length === 0 ? (
            <div className="text-center py-12">
              <p className={cn("text-lg", styles.time)}>אין מבזקים להצגה כרגע</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {flashes.map((flash, index) => (
                <motion.div
                  key={flash.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
                      styles.avatar,
                    )}
                  >
                    VCG
                  </div>

                  <div className="flex-1 space-y-2 text-right">
                    <div className={cn("rounded-2xl p-4", styles.message)}>
                      {flash.is_pinned && (
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium justify-end opacity-80">
                          <span>הודעה נעוצה</span>
                          <Pin className="w-4 h-4" />
                        </div>
                      )}
                      <p className="text-base leading-relaxed whitespace-pre-wrap text-right">{flash.content}</p>
                      {flash.image_url && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <Image
                            src={flash.image_url || "/placeholder.svg"}
                            alt="תמונה"
                            width={400}
                            height={300}
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                    </div>

                    <div className={cn("flex items-center gap-1 text-xs justify-end", styles.time)}>
                      <span>{formatTime(flash.created_at)}</span>
                      <Clock className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
