"use client"

import { useStore } from "@/lib/store"
import { Globe } from "lucide-react"

export function NetworkSection() {
  const { friendlySites } = useStore()

  if (friendlySites.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="mb-4 flex items-center gap-2">
        <Globe className="h-5 w-5 text-neon" />
        <h2 className="text-lg font-semibold text-foreground">Friendly Sites</h2>
      </div>

      <div className="flex flex-wrap gap-6">
        {friendlySites.map((site) => (
          <a
            key={site.id}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2"
          >
            {/* Glowing neon ring logo placeholder */}
            <div
              className="neon-ring flex h-16 w-16 items-center justify-center rounded-full bg-card transition-all"
            >
              <span className="text-lg font-bold text-neon">
                {site.name.charAt(0)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
              {site.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
