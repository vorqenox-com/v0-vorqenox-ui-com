"use client"

import { useStore } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"
import {
  FileText,
  Activity,
  Database,
  TrendingUp,
  Clock,
  Zap,
} from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminOverview() {
  const { articles, visitors, silentRefresh } = useStore()
  const { role } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [liveVisitors, setLiveVisitors] = useState(0)
  const [supabaseStatus, setSupabaseStatus] = useState<"connected" | "checking" | "error">("checking")

  // Client-only initialization
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync visitors from store
  useEffect(() => {
    if (visitors > 0) setLiveVisitors(visitors)
  }, [visitors])

  // Simulate live fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveVisitors((prev) => Math.max(0, prev + Math.floor(Math.random() * 11) - 5))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // Check Supabase connectivity
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (url) {
      setSupabaseStatus("connected")
    } else {
      setSupabaseStatus("error")
    }
  }, [])

  const trafficMode = silentRefresh ? "Auto-Wash Active" : "Standard Mode"

  const stats = [
    {
      label: "Total Posts",
      value: mounted ? articles.length.toString() : "...",
      icon: FileText,
      accent: "hsl(var(--neon))",
    },
    {
      label: "Active Traffic Mode",
      value: mounted ? trafficMode : "...",
      icon: Activity,
      accent: silentRefresh ? "hsl(45, 90%, 55%)" : "hsl(var(--neon))",
    },
    {
      label: "Supabase Status",
      value: supabaseStatus === "connected" ? "Connected" : supabaseStatus === "checking" ? "Checking..." : "Not Configured",
      icon: Database,
      accent: supabaseStatus === "connected" ? "rgb(34, 197, 94)" : supabaseStatus === "error" ? "rgb(239, 68, 68)" : "hsl(var(--neon))",
    },
  ]

  const quickStats = [
    {
      label: "Live Visitors",
      value: mounted ? liveVisitors.toLocaleString() : "...",
      icon: TrendingUp,
      change: "+12%",
    },
    {
      label: "Titan Articles",
      value: mounted ? articles.filter((a) => a.cardType === "titan").length.toString() : "...",
      icon: Zap,
      change: null,
    },
    {
      label: "Premium Articles",
      value: mounted ? articles.filter((a) => a.cardType === "premium").length.toString() : "...",
      icon: Clock,
      change: null,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, <span style={{ color: "hsl(var(--neon))" }}>Admin</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {role === "super-admin" ? "Full system access granted." : "Limited access mode."}{" "}
          Here is your dashboard overview.
        </p>
      </div>

      {/* Primary Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-white/10 p-5 transition-all duration-300 hover:border-white/15"
            style={{
              background: "hsla(220, 15%, 7%, 0.7)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            {/* Subtle top accent line */}
            <div
              className="absolute left-0 right-0 top-0 h-px opacity-60"
              style={{
                background: `linear-gradient(90deg, transparent, ${stat.accent}, transparent)`,
              }}
            />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  {stat.label}
                </p>
                <p
                  className="mt-2 text-xl font-bold"
                  style={{ color: stat.accent }}
                  suppressHydrationWarning
                >
                  {stat.value}
                </p>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-shadow duration-300 group-hover:shadow-lg"
                style={{
                  background: `color-mix(in srgb, ${stat.accent} 10%, transparent)`,
                }}
              >
                <stat.icon className="h-5 w-5" style={{ color: stat.accent }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-white/10 px-5 py-4"
            style={{
              background: "hsla(220, 15%, 7%, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "hsl(var(--neon) / 0.08)" }}
            >
              <stat.icon className="h-5 w-5" style={{ color: "hsl(var(--neon))" }} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-white" suppressHydrationWarning>
                  {stat.value}
                </p>
                {stat.change && (
                  <span className="text-xs font-medium text-emerald-400">{stat.change}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div
        className="rounded-2xl border border-white/10 p-6"
        style={{
          background: "hsla(220, 15%, 7%, 0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Articles</h2>
          <span className="text-xs text-gray-500">Last 5 posts</span>
        </div>
        <div className="space-y-3">
          {articles.slice(0, 5).map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3 transition-colors hover:border-white/10"
              style={{ background: "hsla(220, 15%, 8%, 0.5)" }}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{article.title}</p>
                <p className="text-xs text-gray-500">{article.category}</p>
              </div>
              <span
                className="ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  background:
                    article.cardType === "titan"
                      ? "hsl(var(--neon) / 0.1)"
                      : article.cardType === "premium"
                        ? "hsl(45, 90%, 55%, 0.1)"
                        : "hsl(220, 12%, 20%)",
                  color:
                    article.cardType === "titan"
                      ? "hsl(var(--neon))"
                      : article.cardType === "premium"
                        ? "hsl(45, 90%, 55%)"
                        : "rgb(156, 163, 175)",
                }}
              >
                {article.cardType}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Info Footer */}
      <div className="flex items-center justify-between rounded-lg border border-white/5 px-5 py-3 text-xs text-gray-600">
        <span>Vorqenox V2 Admin Panel</span>
        <span suppressHydrationWarning>
          Session: {role} | Visitors: {mounted ? liveVisitors.toLocaleString() : "..."}
        </span>
      </div>
    </div>
  )
}
