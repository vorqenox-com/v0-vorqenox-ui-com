"use client"

import { useStore } from "@/lib/store"
import { Header } from "@/components/public/header"
import { LandingGate } from "@/components/public/landing-gate"
import { ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { useState, useCallback, useEffect, use } from "react"

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { articles } = useStore()
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
          <Link href="/" className="mt-4 inline-block text-sm text-neon hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Show landing gate
  if (showLanding && !gateCleared) {
    return <LandingGate onPass={handleGatePass} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <article className="mx-auto max-w-3xl px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-neon/10 px-3 py-1 text-xs font-medium text-neon">
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

        {/* Image or neon block */}
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            className="mb-8 w-full rounded-xl object-cover"
          />
        ) : (
          <div
            className="mb-8 flex h-56 items-center justify-center rounded-xl"
            style={{
              background: `linear-gradient(135deg, hsl(var(--neon) / 0.15), hsl(var(--neon) / 0.03))`,
            }}
          >
            <span className="neon-text font-mono text-lg font-bold">{article.title}</span>
          </div>
        )}

        {/* Article Content */}
        <div className="glass-strong rounded-xl p-6 md:p-8">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>{article.content}</p>
            <p>
              This article explores cutting-edge developments in {article.category.toLowerCase()}.
              Our team of researchers has compiled the latest findings and analysis to bring you
              comprehensive coverage of this rapidly evolving field.
            </p>
            <p>
              As the technology landscape continues to shift, staying informed about these
              advancements becomes increasingly critical for professionals and enthusiasts alike.
              The implications of these developments extend far beyond the immediate scope,
              touching every aspect of how we interact with digital systems.
            </p>
          </div>
        </div>

        {/* Ad slot below article */}
        {article.showAds && (
          <div className="mt-8 flex items-center justify-center rounded-lg border border-dashed border-border bg-card/40 px-4 py-8">
            <span className="text-xs text-muted-foreground">
              Article Ad Slot
            </span>
          </div>
        )}
      </article>
    </div>
  )
}
