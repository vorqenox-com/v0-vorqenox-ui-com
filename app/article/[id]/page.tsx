"use client"

import { useStore } from "@/lib/store"
import { Header } from "@/components/public/header"
import { Footer } from "@/components/public/footer"
import { LandingGate } from "@/components/public/landing-gate"
import { SocialProofNotifications } from "@/components/public/social-proof"
import { ArrowLeft, Calendar, Tag, Zap, Table } from "lucide-react"
import Link from "next/link"
import { useState, useCallback, useEffect, use } from "react"

function CounterSection({ article }: { article: { counterMode: string; counterFixed: number; counterMin: number; counterMax: number; targetUrl: string } }) {
  const [count, setCount] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (article.counterMode === "fixed") {
      // Mode A: Fixed countdown
      setCount(article.counterFixed)
    } else {
      // Mode B: Random number (simulating active users/stock)
      const random = Math.floor(Math.random() * (article.counterMax - article.counterMin + 1)) + article.counterMin
      setCount(random)
    }
  }, [article])

  // Fixed countdown timer
  useEffect(() => {
    if (article.counterMode !== "fixed" || count === null || count <= 0) return
    const timer = setInterval(() => {
      setCount((c) => {
        if (c === null || c <= 1) {
          setFinished(true)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [article.counterMode, count])

  // Random mode: mark finished after 3 seconds
  useEffect(() => {
    if (article.counterMode !== "random") return
    const timer = setTimeout(() => setFinished(true), 3000)
    return () => clearTimeout(timer)
  }, [article.counterMode])

  return (
    <div className="glass-strong rounded-2xl p-6 text-center" style={{ boxShadow: "var(--neon-glow-sm)" }}>
      <p className="mb-4 text-xs uppercase tracking-wider text-muted-foreground">
        {article.counterMode === "fixed" ? "Time Remaining" : "Active Users Right Now"}
      </p>

      <div className="mb-4" suppressHydrationWarning>
        {article.counterMode === "fixed" ? (
          <span className="countdown-glow font-mono text-5xl font-black" style={{ color: "hsl(var(--neon))" }} suppressHydrationWarning>
            {count ?? 0}s
          </span>
        ) : (
          <span className="countdown-glow font-mono text-5xl font-black" style={{ color: "hsl(var(--neon))" }} suppressHydrationWarning>
            {count?.toLocaleString() ?? "---"}
          </span>
        )}
      </div>

      {finished && (
        <a
          href={article.targetUrl || "#"}
          className="neon-pulse mt-2 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wider transition-all"
          style={{
            backgroundColor: "hsl(var(--neon2))",
            color: "hsl(var(--background))",
            boxShadow: "var(--neon2-glow)",
          }}
        >
          <Zap className="h-4 w-4" />
          Continue
        </a>
      )}
    </div>
  )
}

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { articles, adSlots } = useStore()
  const article = articles.find((a) => a.id === resolvedParams.id)
  const [showLanding, setShowLanding] = useState(false)
  const [gateCleared, setGateCleared] = useState(false)

  useEffect(() => {
    if (article?.showLandingPage && !gateCleared) {
      setShowLanding(true)
    }
  }, [article, gateCleared])

  const handleGatePass = useCallback(() => {
    setShowLanding(false)
    setGateCleared(true)
  }, [])

  // Auto-refresh
  useEffect(() => {
    if (!article?.autoRefresh) return
    const timer = setInterval(() => {
      window.dispatchEvent(new CustomEvent("vorqenox:refresh"))
    }, 15000)
    return () => clearInterval(timer)
  }, [article?.autoRefresh])

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="neon-text text-2xl font-bold">Article Not Found</h1>
          <Link href="/" className="mt-4 inline-block text-sm hover:underline" style={{ color: "hsl(var(--neon))" }}>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Show landing gate if enabled
  if (showLanding && !gateCleared) {
    return <LandingGate onPass={handleGatePass} />
  }

  const hasAds = article.showAds
  const topAd = adSlots.find((a) => a.position === "top" && a.active)
  const middleAd = adSlots.find((a) => a.position === "middle" && a.active)
  const bottomAd = adSlots.find((a) => a.position === "bottom" && a.active)

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1440px] border-x border-white/5 bg-[#050505] text-white shadow-2xl">
      <Header />
      <SocialProofNotifications />

      <article className="mx-auto max-w-3xl px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Featured Image */}
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="mb-6 w-full rounded-2xl object-cover"
            style={{ maxHeight: "400px" }}
            crossOrigin="anonymous"
          />
        ) : (
          <div
            className="mb-6 flex h-56 items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, hsl(var(--neon) / 0.15), hsl(var(--neon2) / 0.05))`,
            }}
          >
            <span className="neon-text font-mono text-lg font-bold">{article.title}</span>
          </div>
        )}

        {/* Article Header */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: "hsl(var(--neon) / 0.1)", color: "hsl(var(--neon))" }}
            >
              <Tag className="h-3 w-3" />
              {article.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {article.createdAt}
            </span>
          </div>

          <h1 className="text-balance text-3xl font-bold leading-tight text-foreground md:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        </div>

        {/* Ad Slot - Top */}
        {hasAds && topAd && (
          <div className="mb-6 flex items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-4 py-8">
            <span className="text-xs text-muted-foreground">{topAd.content} - Ad (Top)</span>
          </div>
        )}

        {/* Article Content */}
        <div className="glass-strong rounded-2xl p-6 md:p-8">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{article.content}</p>
            <p>
              This article explores cutting-edge developments in {article.category.toLowerCase()}.
              Our research team has compiled the latest findings and analysis to bring you
              comprehensive coverage of this rapidly evolving field.
            </p>
            <p>
              As the technology landscape continues to shift, staying informed about these
              advancements becomes increasingly critical. The implications extend far beyond
              the immediate scope, touching every aspect of digital systems interaction.
            </p>
          </div>
        </div>

        {/* Ad Slot - Middle */}
        {hasAds && middleAd && (
          <div className="my-6 flex items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-4 py-8">
            <span className="text-xs text-muted-foreground">{middleAd.content} - Ad (Middle)</span>
          </div>
        )}

        {/* Dynamic Specs Table */}
        {article.specs && article.specs.length > 0 && (
          <div className="my-8 glass rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <Table className="h-5 w-5" style={{ color: "hsl(var(--neon))" }} />
              <h3 className="text-lg font-semibold text-foreground">Specifications</h3>
            </div>
            <div className="divide-y divide-border">
              {article.specs.map((spec, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "hsl(var(--neon))" }}
                    />
                    {spec.key}
                  </span>
                  <span className="text-sm font-medium text-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Primary Action Area: Counter System */}
        <div className="my-8">
          <CounterSection article={article} />
        </div>

        {/* Ad Slot - Bottom */}
        {hasAds && bottomAd && (
          <div className="mt-6 flex items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-4 py-8">
            <span className="text-xs text-muted-foreground">{bottomAd.content} - Ad (Bottom)</span>
          </div>
        )}
      </article>

      <Footer />
    </main>
  )
}
