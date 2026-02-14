"use client"

import { useStore } from "@/lib/store"
import { Users, FileText, Eye, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminOverview() {
  const { articles, visitors } = useStore()
  const [liveVisitors, setLiveVisitors] = useState(0)

  // Sync once visitors are available from store
  useEffect(() => {
    if (visitors > 0) setLiveVisitors(visitors)
  }, [visitors])

  // Simulate live visitor fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveVisitors((prev) => prev + Math.floor(Math.random() * 11) - 5)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      label: "الزوار المباشرون",
      value: liveVisitors.toLocaleString("ar-EG"),
      icon: Users,
      color: "text-neon",
    },
    {
      label: "إجمالي المقالات",
      value: articles.length.toLocaleString("ar-EG"),
      icon: FileText,
      color: "text-neon",
    },
    {
      label: "المشاهدات اليوم",
      value: (liveVisitors * 3).toLocaleString("ar-EG"),
      icon: Eye,
      color: "text-neon",
    },
    {
      label: "معدل التحويل",
      value: "٪٣.٢",
      icon: TrendingUp,
      color: "text-neon",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">نظرة عامة</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-xl p-5"
            style={{ boxShadow: "var(--neon-glow-sm)" }}
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="glass rounded-xl p-5">
        <h2 className="mb-4 text-lg font-semibold text-foreground">أحدث المقالات</h2>
        <div className="space-y-3">
          {articles.slice(0, 5).map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{article.title}</p>
                <p className="text-xs text-muted-foreground">{article.category}</p>
              </div>
              <span className="inline-flex rounded-full bg-neon/10 px-2 py-0.5 text-xs text-neon">
                {article.cardType}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
