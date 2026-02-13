"use client"

import { useStore } from "@/lib/store"
import Link from "next/link"
import { LayoutGrid } from "lucide-react"

export function ArticlesGrid() {
  const { articles } = useStore()
  const normalArticles = articles.filter((a) => a.cardType === "normal")

  if (normalArticles.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="mb-4 flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-neon" />
        <h2 className="text-lg font-semibold text-foreground">Latest Articles</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {normalArticles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`} className="group">
            <div
              className="glass overflow-hidden rounded-xl transition-all"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--neon-glow-md)"
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none"
              }}
            >
              {/* Image or Neon Solid Block */}
              {article.image ? (
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div
                  className="flex h-40 items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--neon) / 0.2), hsl(var(--neon) / 0.05))`,
                  }}
                >
                  <span className="neon-text px-4 text-center font-mono text-sm font-bold">
                    {article.title}
                  </span>
                </div>
              )}

              <div className="p-4">
                <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-neon">
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
    </section>
  )
}
