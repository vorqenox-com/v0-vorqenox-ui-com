"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import {
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Tag,
  Monitor,
  HardDrive,
  Shield,
  Loader2,
} from "lucide-react"

const ARTICLES_PER_PAGE = 6

interface ArticleRow {
  id: string
  title: string
  excerpt: string
  image: string | null
  category: string
  card_type: string
  created_at: string
  show_landing_page: boolean
  info_boxes: Array<{ label: string; value: string; icon: string }>
}

async function fetchArticles(): Promise<ArticleRow[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, excerpt, image, category, card_type, created_at, show_landing_page, info_boxes")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data ?? []
}

export function ArticlesGrid() {
  const { data: articles, error, isLoading } = useSWR("articles-grid", fetchArticles)
  const [activeTab, setActiveTab] = useState<string>("latest")
  const [page, setPage] = useState(1)

  // Get unique categories
  const categories = useMemo(() => {
    if (!articles) return []
    const cats = new Set(articles.map((a) => a.category))
    return Array.from(cats)
  }, [articles])

  // Filtered articles based on active tab
  const filteredArticles = useMemo(() => {
    if (!articles) return []
    if (activeTab === "latest") {
      return [...articles].sort((a, b) => b.created_at.localeCompare(a.created_at))
    }
    if (activeTab === "all") return articles
    return articles.filter((a) => a.category === activeTab)
  }, [articles, activeTab])

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE)
  const paginatedArticles = filteredArticles.slice(
    (page - 1) * ARTICLES_PER_PAGE,
    page * ARTICLES_PER_PAGE
  )

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setPage(1)
  }

  if (isLoading) {
    return (
      <section className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "hsl(var(--neon))" }} />
      </section>
    )
  }

  if (error || !articles) {
    return (
      <section className="py-10 text-center">
        <p className="text-sm text-muted-foreground">Failed to load articles.</p>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-6 flex items-center gap-2.5">
        <LayoutGrid className="h-5 w-5 text-cyan-400" />
        <h2 className="text-lg font-semibold text-white">Articles Hub</h2>
      </div>

      {/* Tab Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["latest", "all", ...categories].map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className="rounded-xl px-4 py-2 text-xs font-medium transition-all"
              style={{
                backgroundColor: isActive ? "rgba(34, 211, 238, 0.1)" : "rgba(255, 255, 255, 0.03)",
                color: isActive ? "rgb(34, 211, 238)" : "rgb(156, 163, 175)",
                boxShadow: isActive ? "0 0 10px rgba(34, 211, 238, 0.15)" : "none",
                border: isActive
                  ? "1px solid rgba(34, 211, 238, 0.2)"
                  : "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              {tab === "latest" ? "Latest" : tab === "all" ? "All" : tab}
            </button>
          )
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedArticles.map((article) => {
          // Traffic wash: article page -> /go/[id] intermediate -> final URL
          const href = article.show_landing_page
            ? `/article/${article.id}`
            : `/article/${article.id}`

          return (
            <Link key={article.id} href={href} className="group">
              <div className="h-full overflow-hidden rounded-2xl backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(255,215,0,0.3)] bg-white/[0.02] transition-all duration-300 hover:border-cyan-500/20 hover:shadow-[0_0_25px_rgba(255,215,0,0.4)]">
                {/* Image or gradient */}
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-40 w-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div
                    className="flex h-40 items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(34, 211, 238, 0.08) 0%, rgba(255, 215, 0, 0.03) 100%)",
                    }}
                  >
                    <span className="px-4 text-center font-mono text-xs font-bold text-cyan-400/70">
                      {article.title}
                    </span>
                  </div>
                )}

                <div className="p-4">
                  {/* Category + Date Row */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                      {article.category}
                    </span>
                    <span className="text-[10px] text-gray-600">{article.created_at}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold leading-snug text-gray-200">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {article.excerpt}
                  </p>

                  {/* 4-Box Info Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <InfoBox
                      icon={<Tag className="h-3.5 w-3.5 text-cyan-400" />}
                      label="Version"
                      value="v2.1"
                    />
                    <InfoBox
                      icon={<Monitor className="h-3.5 w-3.5 text-cyan-400" />}
                      label="Platform"
                      value="Multi"
                    />
                    <InfoBox
                      icon={<HardDrive className="h-3.5 w-3.5 text-cyan-400" />}
                      label="Size"
                      value="4.2 MB"
                    />
                    <InfoBox
                      icon={<Shield className="h-3.5 w-3.5 text-cyan-400" />}
                      label="License"
                      value="Premium"
                    />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-all hover:border-cyan-500/20 hover:bg-white/[0.06] disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 text-gray-400" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isActive = page === p
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-medium transition-all"
                style={{
                  backgroundColor: isActive ? "rgba(34, 211, 238, 0.1)" : "rgba(255, 255, 255, 0.03)",
                  color: isActive ? "rgb(34, 211, 238)" : "rgb(156, 163, 175)",
                  border: isActive
                    ? "1px solid rgba(34, 211, 238, 0.2)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: isActive ? "0 0 8px rgba(34, 211, 238, 0.12)" : "none",
                }}
              >
                {p}
              </button>
            )
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-all hover:border-cyan-500/20 hover:bg-white/[0.06] disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      )}
    </section>
  )
}

/* 4-Box Info Grid Cell */
function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
      {icon}
      <div className="flex flex-col">
        <span className="text-[9px] uppercase tracking-wider text-gray-600">{label}</span>
        <span className="text-[11px] font-medium text-gray-300">{value}</span>
      </div>
    </div>
  )
}
