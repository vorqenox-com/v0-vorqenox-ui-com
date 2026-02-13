"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface NeonConfig {
  hue: number
  saturation: number
  lightness: number
  glowIntensity: "low" | "medium" | "high"
}

interface NeonContextType {
  config: NeonConfig
  setConfig: (config: Partial<NeonConfig>) => void
}

const NeonContext = createContext<NeonContextType | null>(null)

const GLOW_LEVELS = {
  low: { sm: 0.2, md: 0.15, lg: 0.2 },
  medium: { sm: 0.4, md: 0.3, lg: 0.4 },
  high: { sm: 0.6, md: 0.5, lg: 0.6 },
}

export function NeonProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<NeonConfig>({
    hue: 185,
    saturation: 100,
    lightness: 50,
    glowIntensity: "medium",
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--neon-hue", String(config.hue))
    root.style.setProperty("--neon-saturation", `${config.saturation}%`)
    root.style.setProperty("--neon-lightness", `${config.lightness}%`)

    const glow = GLOW_LEVELS[config.glowIntensity]
    root.style.setProperty(
      "--neon-glow-sm",
      `0 0 5px hsl(var(--neon) / ${glow.sm})`
    )
    root.style.setProperty(
      "--neon-glow-md",
      `0 0 15px hsl(var(--neon) / ${glow.md}), 0 0 30px hsl(var(--neon) / ${glow.md * 0.5})`
    )
    root.style.setProperty(
      "--neon-glow-lg",
      `0 0 20px hsl(var(--neon) / ${glow.lg}), 0 0 40px hsl(var(--neon) / ${glow.lg * 0.5}), 0 0 80px hsl(var(--neon) / ${glow.lg * 0.25})`
    )
  }, [config])

  const setConfig = (partial: Partial<NeonConfig>) => {
    setConfigState((prev) => ({ ...prev, ...partial }))
  }

  return (
    <NeonContext.Provider value={{ config, setConfig }}>
      {children}
    </NeonContext.Provider>
  )
}

export function useNeon() {
  const ctx = useContext(NeonContext)
  if (!ctx) throw new Error("useNeon must be used within NeonProvider")
  return ctx
}
