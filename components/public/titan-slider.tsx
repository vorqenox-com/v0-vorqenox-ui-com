"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Zap, Crown } from "lucide-react"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function TitanSlider() {
  const { articles } = useStore()
  const titanArticles = articles.filter((a) => a.cardType === "titan")
  const [current, setCurrent] = useState(0)
  const [borderPhase, setBorderPhase] = useState<"cyan" | "gold">("cyan")

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % titanArticles.length)
  }, [titanArticles.length])

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + titanArticles.length) % titanArticles.length)
  }, [titanArticles.length])

  // Auto-advance slides
  useEffect(() => {
    if (titanArticles.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, titanArticles.length])

  // Cycle neon border color between cyan and gold
  useEffect(() => {
    const timer = setInterval(() => {
      setBorderPhase((p) => (p === "cyan" ? "gold" : "cyan"))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  if (titanArticles.length === 0) return null

  const article = titanArticles[current]

  const borderColor =
    borderPhase === "cyan"
      ? "rgba(34, 211, 238, 0.5)"
      : "rgba(255, 215, 0, 0.5)"

  const glowColor =
    borderPhase === "cyan"
      ? "0 0 20px rgba(34, 211, 238, 0.25), 0 0 40px rgba(34, 211, 238, 0.1)"
      : "0 0 20px rgba(255, 215, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.08)"

  return (
    <section className="relative">
      <Link href={`/article/${article.id}`} className="group relative block">
        {/* 21:9 Cinematic Container with Flowing Neon Border */}
        <div
          className="relative overflow-hidden rounded-2xl transition-all duration-[1500ms] ease-in-out"
          style={{
            aspectRatio: "21 / 9",
            border: `2px solid ${borderColor}`,
            boxShadow: glowColor,
          }}
        >
          {/* Background Gradient */}
          <div
            className="absolute inset-0 transition-all duration-[1500ms]"
            style={{
              background:
                borderPhase === "cyan"
                  ? "linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(6, 182, 212, 0.03) 40%, transparent 70%)"
                  : "linear-gradient(135deg, rgba(255, 215, 0, 0.06) 0%, rgba(234, 179, 8, 0.02) 40%, transparent 70%)",
            }}
          />

          {/* Content: Left-Aligned with text-shadow */}
          <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-10 lg:p-14">
            {/* Floating Prime Badges */}
            <div className="absolute right-6 top-6 flex items-center gap-2 md:right-10 md:top-8">
              <span className="neon-pulse inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
                <Zap className="h-3 w-3" />
                PRIME
              </span>
              <span
                className="neon-pulse inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-400"
                style={{ animationDelay: "0.5s" }}
              >
                <Crown className="h-3 w-3" />
                TITAN
              </span>
            </div>

            {/* Category */}
            <span className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              {article.category}
            </span>

            {/* Title with text-shadow */}
            <h2
              className="max-w-2xl text-balance text-2xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
              style={{
                textShadow: "0 2px 20px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)",
              }}
            >
              {article.title}
            </h2>

            {/* Excerpt */}
            <p
              className="mt-3 max-w-xl text-sm leading-relaxed text-gray-400 md:text-base"
              style={{
                textShadow: "0 1px 10px rgba(0,0,0,0.4)",
              }}
            >
              {article.excerpt}
            </p>

            {/* Pagination Dots */}
            <div className="mt-6 flex items-center gap-2">
              {titanArticles.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrent(i)
                  }}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? "2rem" : "0.5rem",
                    backgroundColor:
                      i === current
                        ? borderPhase === "cyan"
                          ? "rgb(34, 211, 238)"
                          : "rgb(255, 215, 0)"
                        : "rgba(255, 255, 255, 0.2)",
                    boxShadow:
                      i === current
                        ? borderPhase === "cyan"
                          ? "0 0 8px rgba(34, 211, 238, 0.5)"
                          : "0 0 8px rgba(255, 215, 0, 0.4)"
                        : "none",
                  }}
                >
                  <span className="sr-only">Slide {i + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation Arrows */}
      {titanArticles.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md transition-all hover:border-cyan-500/30 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 text-gray-300" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md transition-all hover:border-cyan-500/30 hover:bg-black/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </button>
        </>
      )}
    </section>
  )
}
