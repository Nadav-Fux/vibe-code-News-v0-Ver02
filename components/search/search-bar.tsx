"use client"

import { useState, useEffect } from "react"
import { Search, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

type SearchResult = {
  id: string
  title: string
  slug: string
  excerpt: string
  category?: { name: string; slug: string }
  author?: { full_name: string }
  rank: number
}

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const router = useRouter()

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Perform search
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    const performSearch = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=10`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error("[v0] Search failed:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery])

  const handleResultClick = (slug: string) => {
    setOpen(false)
    setQuery("")
    setResults([])
    router.push(`/articles/${slug}`)
  }

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64 bg-transparent"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search articles...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="sr-only">Search Articles</DialogTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 pr-9"
                autoFocus
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={() => {
                    setQuery("")
                    setResults([])
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto border-t">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">No results found for "{query}"</div>
            )}

            {!loading && results.length > 0 && (
              <div className="divide-y">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result.slug)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 space-y-1">
                        <h3 className="font-medium leading-tight">{result.title}</h3>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{result.excerpt}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {result.author && <span>{result.author.full_name}</span>}
                          {result.category && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                {result.category.name}
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!query && (
              <div className="py-8 text-center text-sm text-muted-foreground">Start typing to search articles...</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
