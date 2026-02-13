"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from "lucide-react"

interface LandingGateProps {
  onPass: () => void
}

export function LandingGate({ onPass }: LandingGateProps) {
  const [countdown, setCountdown] = useState(10)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [showField, setShowField] = useState(true)

  useEffect(() => {
    if (countdown <= 0) {
      onPass()
      return
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, onPass])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      setShowField(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--neon) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon) / 0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Countdown */}
        <div className="mb-8">
          <span
            className="countdown-glow font-mono text-7xl font-black text-neon md:text-9xl"
          >
            {countdown}
          </span>
        </div>

        <p className="mb-6 text-center text-sm text-muted-foreground">
          You will be redirected to the article shortly...
        </p>

        {/* Psychological Email Field */}
        {showField && !submitted && (
          <div className="w-full max-w-sm">
            {/* Red blinking warning */}
            <div className="red-blink mb-3 flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Your IP has been flagged - Verify your identity
              </span>
            </div>

            <form onSubmit={handleEmailSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 rounded-lg border border-destructive bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-destructive"
                required
              />
              <button
                type="submit"
                className="rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground hover:opacity-90"
              >
                Verify
              </button>
            </form>
          </div>
        )}

        {submitted && (
          <p className="text-xs text-neon">Verified. Redirecting...</p>
        )}
      </div>
    </div>
  )
}
