"use client"

import { useStore } from "@/lib/store"

interface AdSlotProps {
  position: "top" | "middle" | "bottom"
}

export function AdSlotComponent({ position }: AdSlotProps) {
  const { adSlots } = useStore()

  // Conflict Logic: If Heavy Ad is active, hide regular ads
  const heavyAd = adSlots.find((a) => a.type === "heavy" && a.active)
  if (heavyAd) return null

  const ad = adSlots.find((a) => a.position === position && a.active)
  if (!ad) return null

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-4 py-8">
        <div className="text-center">
          <span className="text-xs text-muted-foreground">{ad.content}</span>
          <p className="mt-1 text-[10px] text-muted-foreground/50">Ad Slot ({position})</p>
        </div>
      </div>
    </div>
  )
}

export function HeavyAdZone() {
  const { adSlots } = useStore()
  const heavyAd = adSlots.find((a) => a.type === "heavy" && a.active)

  if (!heavyAd) return null

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div
        className="glass flex items-center justify-center rounded-2xl py-24"
        style={{ boxShadow: "var(--neon-glow-lg)" }}
      >
        <div className="text-center">
          <p className="neon-text text-xl font-bold">{heavyAd.content}</p>
          <span className="mt-2 block text-xs text-muted-foreground">Heavy Advertisement Zone</span>
        </div>
      </div>
    </div>
  )
}
