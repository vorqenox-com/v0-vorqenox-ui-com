"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Lock, Eye, EyeOff, Shield, Zap, Loader2 } from "lucide-react"

export default function AdminGateway() {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [scanLines, setScanLines] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated, loading } = useAuth()

  // If already authenticated, redirect to admin
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, loading, router])

  // Scan line animation trigger
  useEffect(() => {
    const timer = setInterval(() => {
      setScanLines(true)
      setTimeout(() => setScanLines(false), 200)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(password)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      setTimeout(() => setError(""), 3000)
    } else {
      router.push("/admin")
    }
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "hsl(var(--neon))" }} />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Animated grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--neon) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon) / 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scan line effect */}
      {scanLines && (
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-10"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--neon) / 0.3) 2px, transparent 4px)",
          }}
        />
      )}

      {/* Corner accents */}
      <div className="pointer-events-none absolute left-4 top-4 h-16 w-16 border-l-2 border-t-2 opacity-20" style={{ borderColor: "hsl(var(--neon))" }} />
      <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 border-r-2 border-t-2 opacity-20" style={{ borderColor: "hsl(var(--neon))" }} />
      <div className="pointer-events-none absolute bottom-4 left-4 h-16 w-16 border-b-2 border-l-2 opacity-20" style={{ borderColor: "hsl(var(--neon2))" }} />
      <div className="pointer-events-none absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2 opacity-20" style={{ borderColor: "hsl(var(--neon2))" }} />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-2xl backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
            style={{ background: "hsl(220 15% 8% / 0.85)" }}
          >
            <Shield className="h-12 w-12" style={{ color: "hsl(var(--neon))" }} />
          </div>
          <div className="mt-5 flex items-center gap-2">
            <Zap className="h-4 w-4" style={{ color: "hsl(var(--neon2))" }} />
            <h1 className="neon-text font-mono text-2xl font-black tracking-[0.3em]">
              VORQENOX
            </h1>
            <Zap className="h-4 w-4" style={{ color: "hsl(var(--neon2))" }} />
          </div>
          <p className="mt-2 text-xs tracking-widest text-muted-foreground">
            SYSTEM ACCESS TERMINAL v3.0
          </p>
        </div>

        {/* Login Form - Password Only */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl p-8 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          style={{ background: "hsl(220 15% 8% / 0.85)" }}
        >
          {/* Password */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Access Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon focus:outline-none focus:ring-1"
                style={{ "--tw-ring-color": "hsl(var(--neon))" } as React.CSSProperties}
                placeholder="Enter access key..."
                autoComplete="off"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
              <p className="red-blink text-center text-sm font-bold">{error}</p>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="neon-ring flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50"
            style={{
              backgroundColor: "hsl(var(--neon))",
              color: "hsl(var(--background))",
              boxShadow: "var(--neon-glow-md)",
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {isLoading ? "AUTHENTICATING..." : "AUTHENTICATE"}
          </button>
        </form>

        {/* Bottom text */}
        <div className="mt-8 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span className="tracking-wider">ENCRYPTED CONNECTION</span>
          <span className="h-px flex-1 bg-border" />
        </div>
      </div>
    </div>
  )
}
