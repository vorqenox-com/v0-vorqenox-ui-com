"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Zap, Crown } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function TitanSlider() {
  const { articles } = useStore()
  const titanArticles = articles.filter((a) => a.cardType === "titan")
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % titanArticles.length)
  }, [titanArticles.length])

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + titanArticles.length) % titanArticles.length)
  }, [titanArticles.length])

  useEffect(() => {
    if (titanArticles.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, titanArticles.length])

  if (titanArticles.length === 0) return null

  const article = titanArticles[current]

  return (
    <section className="relative mx-auto max-w-7xl px-4">
      <Link href={`/article/${article.id}`} className="group relative block overflow-hidden rounded-2xl">
        {/* Dual-neon gold border card */}
        <div className="dual-neon-border relative overflow-hidden rounded-2xl" style={{ minHeight: "380px" }}>
          <div className="glass relative z-10 flex h-full min-h-[380px] flex-col justify-end rounded-2xl p-8">
            {/* Floating Prime Badges */}
            <div className="absolute right-6 top-6 flex items-center gap-2">
              <span
                className="neon-pulse inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: "hsl(var(--neon) / 0.15)",
                  color: "hsl(var(--neon))",
                }}
              >
                <Zap className="h-3 w-3" />
                PRIME
              </span>
              <span
                className="neon-pulse inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  backgroundColor: "hsl(var(--neon2) / 0.15)",
                  color: "hsl(var(--neon2))",
                  animationDelay: "0.5s",
                }}
              >
                <Crown className="h-3 w-3" />
                TITAN
              </span>
            </div>

            {/* Content */}
            <span className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {article.category}
            </span>
            <h2 className="text-balance text-2xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              {article.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {article.excerpt}
            </p>

            {/* Pagination dots */}
            <div className="mt-6 flex items-center gap-2">
              {titanArticles.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setCurrent(i) }}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === current ? "2rem" : "0.5rem",
                    backgroundColor: i === current ? "hsl(var(--neon))" : "hsl(var(--muted-foreground) / 0.3)",
                    boxShadow: i === current ? "var(--neon-glow-sm)" : "none",
                  }}
                >
                  <span className="sr-only">Slide {i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation arrows */}
      {titanArticles.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
            style={{
              backgroundColor: "hsl(var(--card) / 0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid hsl(var(--neon) / 0.2)",
            }}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
            style={{
              backgroundColor: "hsl(var(--card) / 0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid hsl(var(--neon) / 0.2)",
            }}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </>
      )}
    </section>
  )
}
