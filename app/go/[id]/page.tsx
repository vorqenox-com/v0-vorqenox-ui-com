"use client"

import { useState, useEffect, use } from "react"
import { Shield, ExternalLink, Clock, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const COUNTDOWN_SECONDS = 5

export default function IntermediatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [targetUrl, setTargetUrl] = useState<string | null>(null)
  const [articleTitle, setArticleTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const isReady = countdown <= 0

  // Fetch article data from Supabase
  useEffect(() => {
    async function fetchArticle() {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("articles")
        .select("title, target_url")
        .eq("id", resolvedParams.id)
        .single()

      if (fetchError || !data) {
        setError(true)
        setLoading(false)
        return
      }

      setArticleTitle(data.title)
      setTargetUrl(data.target_url)
      setLoading(false)
    }

    fetchArticle()
  }, [resolvedParams.id])

  // Countdown timer
  useEffect(() => {
    if (loading || error) return
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((c) => c - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, error, countdown])

  // Progress percentage
  const progress = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-[hsl(var(--neon))]" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="neon-text text-2xl font-bold">Link Not Found</h1>
          <a href="/" className="mt-4 inline-block text-sm hover:underline" style={{ color: "hsl(var(--neon))" }}>
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--neon) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon) / 0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center px-6">
        {/* Ad Slot - Top */}
        <div className="mb-8 w-full rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center">
          <span className="text-xs text-muted-foreground">Ad Slot (Top)</span>
        </div>

        {/* Main verification card */}
        <div
          className="w-full rounded-2xl p-8 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          style={{ background: "hsl(220 15% 8% / 0.85)" }}
        >
          {/* Header */}
          <div className="mb-6 flex flex-col items-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "hsl(var(--neon) / 0.08)",
                boxShadow: "0 0 20px hsl(var(--neon) / 0.2)",
              }}
            >
              <Shield className="h-8 w-8" style={{ color: "hsl(var(--neon))" }} />
            </div>
            <h2 className="text-center text-xl font-bold text-foreground">
              Verifying Your Access
            </h2>
            <p className="mt-2 max-w-xs text-center text-sm text-muted-foreground">
              Please wait while we verify your connection for:
            </p>
            <p className="mt-1 text-center text-xs font-medium" style={{ color: "hsl(var(--neon))" }}>
              {articleTitle}
            </p>
          </div>

          {/* Countdown ring */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120" className="block">
                {/* Background ring */}
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="4"
                />
                {/* Progress ring */}
                <circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke={isReady ? "rgb(34, 197, 94)" : "hsl(var(--neon))"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                  transform="rotate(-90 60 60)"
                  style={{
                    transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
                    filter: `drop-shadow(0 0 6px ${isReady ? "rgba(34, 197, 94, 0.5)" : "hsl(var(--neon) / 0.5)"})`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isReady ? (
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                ) : (
                  <>
                    <span
                      className="countdown-glow font-mono text-3xl font-black"
                      style={{ color: "hsl(var(--neon))" }}
                    >
                      {countdown}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">sec</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status text */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {isReady ? "Verification complete" : `Verifying... ${countdown}s remaining`}
            </span>
          </div>

          {/* CTA Button - Hidden/disabled until countdown is 0 */}
          <div className="flex justify-center">
            {isReady ? (
              <a
                href={targetUrl || "#"}
                rel="noopener noreferrer"
                className="neon-pulse inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wider transition-all hover:scale-105"
                style={{
                  backgroundColor: "hsl(var(--neon))",
                  color: "hsl(var(--background))",
                  boxShadow: "var(--neon-glow-md)",
                }}
              >
                <ExternalLink className="h-4 w-4" />
                Go to Link
              </a>
            ) : (
              <button
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-wider opacity-30"
                style={{
                  backgroundColor: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                <ExternalLink className="h-4 w-4" />
                Please Wait...
              </button>
            )}
          </div>
        </div>

        {/* Ad Slot - Bottom */}
        <div className="mt-8 w-full rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center">
          <span className="text-xs text-muted-foreground">Ad Slot (Bottom)</span>
        </div>

        {/* Back link */}
        <a
          href="/"
          className="mt-6 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to Home
        </a>
      </div>
    </div>
  )
}
