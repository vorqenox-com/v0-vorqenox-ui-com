"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Zap } from "lucide-react"
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
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  if (titanArticles.length === 0) return null

  const article = titanArticles[current]

  return (
    <section className="relative mx-auto max-w-7xl px-4">
      <Link href={`/article/${article.id}`} className="group relative block overflow-hidden rounded-2xl">
        {/* The neon-border card */}
        <div
          className="neon-border relative overflow-hidden rounded-2xl"
          style={{ minHeight: "340px" }}
        >
          <div className="glass relative z-10 flex h-full min-h-[340px] flex-col justify-end rounded-2xl p-8">
            {/* Prime Badge */}
            <div className="neon-pulse mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-neon/10 px-3 py-1 text-xs font-semibold text-neon">
              <Zap className="h-3 w-3" />
              PRIME
            </div>

            <span className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {article.category}
            </span>
            <h2 className="text-balance text-2xl font-bold leading-tight text-foreground md:text-4xl">
              {article.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {article.excerpt}
            </p>

            {/* Dots */}
            <div className="mt-6 flex items-center gap-2">
              {titanArticles.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrent(i)
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === current
                      ? "w-8 bg-neon"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  style={i === current ? { boxShadow: "var(--neon-glow-sm)" } : {}}
                >
                  <span className="sr-only">Slide {i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Nav arrows */}
      {titanArticles.length > 1 && (
        <>
          <button
            onClick={prev}
            className="neon-ring absolute left-6 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-accent"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
            <span className="sr-only">Previous slide</span>
          </button>
          <button
            onClick={next}
            className="neon-ring absolute right-6 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-card/80 backdrop-blur-sm transition-colors hover:bg-accent"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
            <span className="sr-only">Next slide</span>
          </button>
        </>
      )}
    </section>
  )
}
