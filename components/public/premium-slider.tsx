"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Crown, Sparkles } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function PremiumSlider() {
  const { articles } = useStore()
  const premiumArticles = articles.filter((a) => a.cardType === "premium")
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % premiumArticles.length)
  }, [premiumArticles.length])

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + premiumArticles.length) % premiumArticles.length)
  }, [premiumArticles.length])

  useEffect(() => {
    if (premiumArticles.length <= 1) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next, premiumArticles.length])

  if (premiumArticles.length === 0) return null

  const getCardStyle = (index: number) => {
    const diff = index - current
    const total = premiumArticles.length

    // Normalize for wrap-around
    let normalizedDiff = diff
    if (Math.abs(diff) > total / 2) {
      normalizedDiff = diff > 0 ? diff - total : diff + total
    }

    const isCenter = normalizedDiff === 0
    const isLeft = normalizedDiff === -1 || (normalizedDiff === total - 1)
    const isRight = normalizedDiff === 1 || (normalizedDiff === -(total - 1))

    if (isCenter) {
      return {
        transform: "translateX(0) scale(1) rotateY(0deg)",
        zIndex: 30,
        opacity: 1,
        filter: "none",
      }
    }
    if (isLeft) {
      return {
        transform: "translateX(-70%) scale(0.8) rotateY(12deg)",
        zIndex: 20,
        opacity: 0.6,
        filter: "brightness(0.5)",
      }
    }
    if (isRight) {
      return {
        transform: "translateX(70%) scale(0.8) rotateY(-12deg)",
        zIndex: 20,
        opacity: 0.6,
        filter: "brightness(0.5)",
      }
    }
    return {
      transform: "translateX(0) scale(0.6)",
      zIndex: 10,
      opacity: 0,
      filter: "brightness(0.3)",
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="mb-5 flex items-center gap-2">
        <Crown className="h-5 w-5" style={{ color: "hsl(var(--neon2))" }} />
        <h2 className="text-lg font-semibold text-foreground">Premium Collection</h2>
        <Sparkles className="h-4 w-4" style={{ color: "hsl(var(--neon))" }} />
      </div>

      {/* 3D Carousel Container */}
      <div className="perspective-container relative mx-auto" style={{ height: "320px", maxWidth: "600px" }}>
        {premiumArticles.map((article, index) => {
          const style = getCardStyle(index)
          return (
            <div
              key={article.id}
              className="absolute left-1/2 top-0 w-[280px] -translate-x-1/2 transition-all duration-500 ease-out sm:w-[340px]"
              style={{
                ...style,
                transformStyle: "preserve-3d",
              }}
            >
              <Link href={`/article/${article.id}`}>
                <div
                  className="glass overflow-hidden rounded-2xl transition-all"
                  style={{
                    border: index === current
                      ? "1px solid hsl(var(--neon) / 0.4)"
                      : "1px solid hsl(var(--border))",
                    boxShadow: index === current ? "var(--neon-glow-md)" : "none",
                  }}
                >
                  {/* Card image area */}
                  <div
                    className="flex h-40 items-center justify-center sm:h-48"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--neon) / 0.15), hsl(var(--neon2) / 0.08))`,
                    }}
                  >
                    <span className="neon-text px-4 text-center font-mono text-sm font-bold">
                      {article.title}
                    </span>
                  </div>
                  <div className="p-5">
                    <span className="mb-1.5 block text-xs font-medium" style={{ color: "hsl(var(--neon2))" }}>
                      {article.category}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug text-foreground">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}

        {/* Nav buttons */}
        {premiumArticles.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur-sm transition-colors hover:bg-accent"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur-sm transition-colors hover:bg-accent"
              aria-label="Next card"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}
