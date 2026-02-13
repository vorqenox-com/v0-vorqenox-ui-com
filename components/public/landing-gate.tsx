"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertTriangle, Mail } from "lucide-react"

interface LandingGateProps {
  onPass: () => void
}

export function LandingGate({ onPass }: LandingGateProps) {
  const [stage, setStage] = useState<"email" | "countdown">("email")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [countdown, setCountdown] = useState(10)

  // Stage 1: Email Trap
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      // Smooth vanish then move to Stage 2
      setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => {
          setStage("countdown")
          setFadeOut(false)
        }, 500)
      }, 800)
    }
  }

  // Stage 2: Countdown
  useEffect(() => {
    if (stage !== "countdown") return
    if (countdown <= 0) {
      onPass()
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [stage, countdown, onPass])

  // Progress for geometric countdown
  const progress = ((10 - countdown) / 10) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
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
        {/* ====== STAGE 1: EMAIL TRAP ====== */}
        {stage === "email" && (
          <div
            className="w-full transition-all duration-500"
            style={{ opacity: fadeOut ? 0 : 1, transform: fadeOut ? "translateY(-20px)" : "translateY(0)" }}
          >
            <h2 className="mb-3 text-center text-2xl font-bold text-foreground md:text-3xl">
              Verify Your Identity
            </h2>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              Complete verification to access premium content
            </p>

            {/* RED blinking warning - conflicts with site neon theme on purpose */}
            <div className="red-blink mb-4 flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Must use personal email for verification
              </span>
            </div>

            {!submitted ? (
              <form onSubmit={handleEmailSubmit} className="glass-strong rounded-xl p-6">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email..."
                      className="w-full rounded-lg py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      style={{
                        border: "1px solid hsl(0 72% 51%)",
                        backgroundColor: "hsl(var(--secondary))",
                      }}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg px-6 py-3 text-sm font-bold text-white"
                    style={{
                      backgroundColor: "hsl(0 72% 51%)",
                      boxShadow: "0 0 15px hsl(0 72% 51% / 0.3)",
                    }}
                  >
                    Verify
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <span className="text-sm" style={{ color: "hsl(var(--neon))" }}>
                  Verified successfully. Proceeding...
                </span>
              </div>
            )}
          </div>
        )}

        {/* ====== STAGE 2: GEOMETRIC COUNTDOWN ====== */}
        {stage === "countdown" && (
          <div className="flex w-full flex-col items-center">
            {/* Video Ad Slot ABOVE counter */}
            <div className="mb-8 w-full rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center">
              <span className="text-xs text-muted-foreground">Video Ad Slot (Above)</span>
            </div>

            {/* Geometric Countdown */}
            <div className="relative mb-6">
              <svg width="180" height="180" viewBox="0 0 180 180" className="block">
                {/* Outer ring background */}
                <circle
                  cx="90" cy="90" r="82"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="4"
                />
                {/* Progress ring */}
                <circle
                  cx="90" cy="90" r="82"
                  fill="none"
                  stroke="hsl(var(--neon))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 82}`}
                  strokeDashoffset={`${2 * Math.PI * 82 * (1 - progress / 100)}`}
                  transform="rotate(-90 90 90)"
                  style={{ transition: "stroke-dashoffset 1s linear", filter: "drop-shadow(0 0 6px hsl(var(--neon) / 0.5))" }}
                />
                {/* Secondary ring */}
                <circle
                  cx="90" cy="90" r="72"
                  fill="none"
                  stroke="hsl(var(--neon2) / 0.3)"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                />
                {/* Inner hexagon */}
                <polygon
                  points="90,30 145,60 145,120 90,150 35,120 35,60"
                  fill="none"
                  stroke="hsl(var(--neon) / 0.15)"
                  strokeWidth="1"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="countdown-glow font-mono text-5xl font-black"
                  style={{ color: "hsl(var(--neon))" }}
                >
                  {countdown}
                </span>
              </div>
            </div>

            <p className="mb-6 text-center text-sm text-muted-foreground">
              Preparing your content...
            </p>

            {/* Video Ad Slot BELOW counter */}
            <div className="w-full rounded-xl border border-dashed border-border bg-card/40 px-4 py-10 text-center">
              <span className="text-xs text-muted-foreground">Video Ad Slot (Below)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
