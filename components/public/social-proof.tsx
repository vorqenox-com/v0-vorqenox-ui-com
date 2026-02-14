"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useStore } from "@/lib/store"
import { Bell } from "lucide-react"

export function SocialProofNotifications() {
  const { socialProofs } = useStore()
  const activeProofs = useMemo(
    () => socialProofs.filter((p) => p.active),
    [socialProofs]
  )
  const [current, setCurrent] = useState<string | null>(null)
  const [exiting, setExiting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const showNext = useCallback(() => {
    if (activeProofs.length === 0) return
    const random = activeProofs[Math.floor(Math.random() * activeProofs.length)]
    setCurrent(random.text)
    setExiting(false)

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setExiting(true)
      setTimeout(() => setCurrent(null), 500)
    }, 4000)
  }, [activeProofs])

  useEffect(() => {
    if (!mounted || activeProofs.length === 0) return
    // Show first notification after 5 seconds, then every 15 seconds
    const initialTimer = setTimeout(showNext, 5000)
    const interval = setInterval(showNext, 15000)
    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [showNext, activeProofs.length, mounted])

  if (!mounted || !current) return null

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div
        className={`glass-strong flex max-w-xs items-start gap-3 rounded-xl p-4 ${
          exiting ? "social-proof-out" : "social-proof-in"
        }`}
        style={{ boxShadow: "var(--neon-glow-sm)" }}
      >
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "hsl(var(--neon) / 0.15)" }}
        >
          <Bell className="h-4 w-4" style={{ color: "hsl(var(--neon))" }} />
        </div>
        <div suppressHydrationWarning>
          <p className="text-sm text-foreground">{current}</p>
          <p className="mt-1 text-xs text-muted-foreground" suppressHydrationWarning>Just now</p>
        </div>
      </div>
    </div>
  )
}
