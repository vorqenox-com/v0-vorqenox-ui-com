"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, Crown } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function PremiumSlider() {
  const { articles } = useStore()
  const premiumArticles = articles.filter((a) => a.cardType === "premium")
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 320
      scrollRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      })
    }
  }

  if (premiumArticles.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-neon" />
          <h2 className="text-lg font-semibold text-foreground">Premium</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card transition-colors hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
            <span className="sr-only">Scroll left</span>
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card transition-colors hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
            <span className="sr-only">Scroll right</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {premiumArticles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group w-72 shrink-0"
          >
            <div className="glass overflow-hidden rounded-xl transition-all hover:border-neon/30"
              style={{ transition: "box-shadow 0.3s ease" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--neon-glow-md)"
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none"
              }}
            >
              {/* Neon solid block for missing image */}
              <div
                className="flex h-36 items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, hsl(var(--neon) / 0.15), hsl(var(--neon) / 0.05))`,
                }}
              >
                <span className="neon-text px-4 text-center font-mono text-sm font-bold">
                  {article.title}
                </span>
              </div>
              <div className="p-4">
                <span className="mb-1 block text-xs text-neon">{article.category}</span>
                <h3 className="text-sm font-semibold text-foreground">{article.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
