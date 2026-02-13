"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Lock, Eye, EyeOff, Shield, Zap } from "lucide-react"

const SUPER_PASSWORD = "Elfr3onela3zamx430#"
const SUB_PASSWORD = "SubAdmin2026#"

export default function AdminGateway() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [trapped, setTrapped] = useState(false)
  const [error, setError] = useState("")
  const [scanLines, setScanLines] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  // Scan line animation trigger
  useEffect(() => {
    const timer = setInterval(() => {
      setScanLines(true)
      setTimeout(() => setScanLines(false), 200)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // THE TRAP: If username is NOT empty => red strobe
    if (username.trim() !== "") {
      setTrapped(true)
      return
    }

    // Username MUST be empty for access
    if (password === SUPER_PASSWORD) {
      login("super-admin")
      router.push("/admin")
    } else if (password === SUB_PASSWORD) {
      login("sub-admin")
      router.push("/admin")
    } else {
      setError("ACCESS DENIED")
      setTimeout(() => setError(""), 3000)
    }
  }

  // RED STROBE ANTI-INTRUDER
  if (trapped) {
    return (
      <div className="red-strobe fixed inset-0 z-[999] flex items-center justify-center">
        <div className="text-center">
          <h1
            className="select-none text-6xl font-black uppercase tracking-[0.2em] text-white md:text-[10rem]"
            style={{
              textShadow: "0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(255,0,0,0.5)",
              lineHeight: 1,
            }}
          >
            WHO ARE YOU?
          </h1>
          <p
            className="mt-8 text-lg font-bold uppercase tracking-widest text-white/80"
            style={{ textShadow: "0 0 20px rgba(255,255,255,0.4)" }}
          >
            Unauthorized Access Detected
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-white" />
            <span className="text-xs uppercase tracking-wider text-white/60">
              Connection Terminated
            </span>
          </div>
        </div>
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
            className="flex h-24 w-24 items-center justify-center rounded-2xl glass"
            style={{ boxShadow: "var(--neon-glow-lg)" }}
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

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-strong space-y-6 rounded-2xl p-8"
          style={{ boxShadow: "var(--neon-glow-sm)" }}
        >
          {/* Username */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon focus:outline-none focus:ring-1"
              style={{ "--tw-ring-color": "hsl(var(--neon))" } as React.CSSProperties}
              placeholder="Enter username..."
              autoComplete="off"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Password
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
            className="neon-ring flex w-full items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-bold uppercase tracking-wider transition-all"
            style={{
              backgroundColor: "hsl(var(--neon))",
              color: "hsl(var(--background))",
              boxShadow: "var(--neon-glow-md)",
            }}
          >
            <Lock className="h-4 w-4" />
            AUTHENTICATE
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
