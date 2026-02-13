"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Lock, Eye, EyeOff, Shield } from "lucide-react"

const SUPER_PASSWORD = "Elfr3onela3zamx430#"
const SUB_PASSWORD = "SubAdmin2026#"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [trapped, setTrapped] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // THE TRAP: If username is NOT empty, show the red overlay
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

  // THE TRAP OVERLAY
  if (trapped) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-600">
        <div className="text-center">
          <h1
            className="text-5xl font-black tracking-wider text-white md:text-8xl"
            style={{ textShadow: "0 0 40px rgba(255,255,255,0.5)" }}
          >
            WHO ARE YOU?
          </h1>
          <p className="mt-6 text-lg text-red-200">Unauthorized access attempt detected.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--neon) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon) / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Icon */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl glass"
            style={{ boxShadow: "var(--neon-glow-md)" }}
          >
            <Shield className="h-10 w-10 text-neon" />
          </div>
          <h1 className="neon-text mt-4 font-mono text-2xl font-bold tracking-widest">
            VORQENOX
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">System Access Terminal</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="glass-strong space-y-5 rounded-xl p-8"
          style={{ boxShadow: "var(--neon-glow-sm)" }}
        >
          {/* Username Field */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon"
              placeholder="Enter username..."
              autoComplete="off"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-neon focus:outline-none focus:ring-1 focus:ring-neon"
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

          {/* Error Message */}
          {error && (
            <p className="red-blink text-center text-sm font-bold">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="neon-ring flex w-full items-center justify-center gap-2 rounded-lg bg-neon px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            style={{ boxShadow: "var(--neon-glow-sm)" }}
          >
            <Lock className="h-4 w-4" />
            AUTHENTICATE
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {"Secure Terminal v3.0 // Encrypted Connection"}
        </p>
      </div>
    </div>
  )
}
