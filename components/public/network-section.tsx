"use client"

import { useStore } from "@/lib/store"
import { Globe } from "lucide-react"

export function NetworkSection() {
  const { friendlySites } = useStore()

  if (friendlySites.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="mb-5 flex items-center gap-2">
        <Globe className="h-5 w-5" style={{ color: "hsl(var(--neon))" }} />
        <h2 className="text-lg font-semibold text-foreground">Network Hub</h2>
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        {friendlySites.map((site) => (
          <a
            key={site.id}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-3"
          >
            {/* Pulsating dual-neon ring logo */}
            <div className="dual-neon-ring flex h-20 w-20 items-center justify-center rounded-full bg-card transition-all">
              {site.logo ? (
                <img src={site.logo} alt={site.name} className="h-10 w-10 rounded-full object-cover" crossOrigin="anonymous" />
              ) : (
                <span className="text-2xl font-bold" style={{ color: "hsl(var(--neon))" }}>
                  {site.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="text-center">
              <span className="block text-sm font-medium text-foreground transition-colors group-hover:text-neon">
                {site.name}
              </span>
              <span className="block text-xs text-muted-foreground">{site.description}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
