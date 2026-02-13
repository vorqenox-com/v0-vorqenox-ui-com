"use client"

import { useState, useMemo } from "react"
import { useStore } from "@/lib/store"
import Link from "next/link"
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"

const ARTICLES_PER_PAGE = 5

export function ArticlesGrid() {
  const { articles } = useStore()
  const [activeTab, setActiveTab] = useState<"latest" | "all" | string>("latest")
  const [page, setPage] = useState(1)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category))
    return Array.from(cats)
  }, [articles])

  // Filtered articles based on active tab
  const filteredArticles = useMemo(() => {
    if (activeTab === "latest") {
      return [...articles].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
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

  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="mb-5 flex items-center gap-2">
        <LayoutGrid className="h-5 w-5" style={{ color: "hsl(var(--neon))" }} />
        <h2 className="text-lg font-semibold text-foreground">Articles Hub</h2>
      </div>

      {/* Tabs: Latest, All, Categories */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["latest", "all", ...categories].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className="rounded-lg px-4 py-2 text-xs font-medium transition-all"
            style={{
              backgroundColor: activeTab === tab ? "hsl(var(--neon) / 0.15)" : "hsl(var(--secondary))",
              color: activeTab === tab ? "hsl(var(--neon))" : "hsl(var(--muted-foreground))",
              boxShadow: activeTab === tab ? "var(--neon-glow-sm)" : "none",
              border: activeTab === tab ? "1px solid hsl(var(--neon) / 0.3)" : "1px solid transparent",
            }}
          >
            {tab === "latest" ? "Latest" : tab === "all" ? "All" : tab}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {paginatedArticles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`} className="group">
            <div
              className="glass h-full overflow-hidden rounded-xl transition-all duration-300"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--neon-glow-md)"
                ;(e.currentTarget as HTMLDivElement).style.borderColor = "hsl(var(--neon) / 0.3)"
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none"
                ;(e.currentTarget as HTMLDivElement).style.borderColor = ""
              }}
            >
              {/* Image or neon gradient */}
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-36 w-full object-cover"
                  crossOrigin="anonymous"
                />
              ) : (
                <div
                  className="flex h-36 items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--neon) / 0.2), hsl(var(--neon2) / 0.05))`,
                  }}
                >
                  <span className="neon-text px-3 text-center font-mono text-xs font-bold">
                    {article.title}
                  </span>
                </div>
              )}

              <div className="p-4">
                <span
                  className="mb-1 block text-xs font-medium uppercase tracking-wider"
                  style={{ color: "hsl(var(--neon))" }}
                >
                  {article.category}
                </span>
                <h3 className="text-sm font-semibold leading-snug text-foreground">
                  {article.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
                <span className="mt-2 block text-xs text-muted-foreground">{article.createdAt}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: page === p ? "hsl(var(--neon) / 0.15)" : "hsl(var(--card))",
                color: page === p ? "hsl(var(--neon))" : "hsl(var(--muted-foreground))",
                border: page === p ? "1px solid hsl(var(--neon) / 0.3)" : "1px solid hsl(var(--border))",
                boxShadow: page === p ? "var(--neon-glow-sm)" : "none",
              }}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-accent disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        </div>
      )}
    </section>
  )
}
