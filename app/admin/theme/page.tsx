"use client"

import { useNeon, THEME_PRESETS } from "@/lib/neon-context"
import { useStore } from "@/lib/store"
import { Palette, Sparkles, Plus, Trash2, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function ThemeMasterPage() {
  const { config, setConfig, applyPreset } = useNeon()
  const { socialLinks, setSocialLinks, friendlySites, setFriendlySites } = useStore()
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Social Links management
  const addSocialLink = () => {
    setSocialLinks((prev) => [...prev, { id: Math.random().toString(36).substring(2, 10), platform: "", url: "" }])
  }

  const updateSocialLink = (id: string, field: "platform" | "url", value: string) => {
    setSocialLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
  }

  const removeSocialLink = (id: string) => {
    setSocialLinks((prev) => prev.filter((l) => l.id !== id))
  }

  // Friendly Sites management
  const addFriendlySite = () => {
    setFriendlySites((prev) => [...prev, { id: Math.random().toString(36).substring(2, 10), name: "", description: "", url: "" }])
  }

  const updateFriendlySite = (id: string, field: string, value: string) => {
    setFriendlySites((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const removeFriendlySite = (id: string) => {
    setFriendlySites((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Palette className="h-6 w-6" style={{ color: "hsl(var(--neon))" }} />
        <h1 className="text-2xl font-bold text-foreground">محرك السمات</h1>
      </div>

      {/* Theme Presets */}
      <div className="glass rounded-xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: "hsl(var(--neon2))" }} />
          <h2 className="text-lg font-semibold text-foreground">السمات الجاهزة</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(THEME_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              className="flex items-center gap-3 rounded-xl border p-4 text-sm transition-all"
              style={{
                borderColor: config.preset === key ? "hsl(var(--neon) / 0.5)" : "hsl(var(--border))",
                backgroundColor: config.preset === key ? "hsl(var(--neon) / 0.05)" : "transparent",
                boxShadow: config.preset === key ? "var(--neon-glow-sm)" : "none",
              }}
            >
              <div className="flex gap-1">
                <span className="h-5 w-5 rounded-full" style={{ backgroundColor: `hsl(${preset.primaryHue}, 100%, 50%)` }} />
                <span className="h-5 w-5 rounded-full" style={{ backgroundColor: `hsl(${preset.secondaryHue}, 100%, 50%)` }} />
              </div>
              <span className="text-foreground">{key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dual-Neon Custom Controls */}
      <div className="glass rounded-xl p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">التحكم بالنيون المزدوج</h2>
        <div className="space-y-4">
          {/* Primary Hue */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: `hsl(${config.primaryHue}, 100%, 50%)` }} />
              اللون الأساسي: {config.primaryHue}
            </label>
            <input
              type="range" min="0" max="360"
              value={config.primaryHue}
              onChange={(e) => setConfig({ primaryHue: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: `hsl(${config.primaryHue}, 100%, 50%)` }}
            />
          </div>

          {/* Secondary Hue */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: `hsl(${config.secondaryHue}, 100%, 50%)` }} />
              اللون الثانوي: {config.secondaryHue}
            </label>
            <input
              type="range" min="0" max="360"
              value={config.secondaryHue}
              onChange={(e) => setConfig({ secondaryHue: Number(e.target.value) })}
              className="w-full"
              style={{ accentColor: `hsl(${config.secondaryHue}, 100%, 50%)` }}
            />
          </div>

          {/* Glow Intensity */}
          <div>
            <label className="mb-2 block text-xs text-muted-foreground">شدة التوهج</label>
            <div className="flex gap-3">
              {(["low", "medium", "high"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setConfig({ glowIntensity: level })}
                  className="rounded-lg border px-4 py-2 text-xs transition-all"
                  style={{
                    borderColor: config.glowIntensity === level ? "hsl(var(--neon) / 0.5)" : "hsl(var(--border))",
                    backgroundColor: config.glowIntensity === level ? "hsl(var(--neon) / 0.1)" : "transparent",
                    color: config.glowIntensity === level ? "hsl(var(--neon))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {level === "low" ? "منخفض" : level === "medium" ? "متوسط" : "مرتفع"}
                </button>
              ))}
            </div>
          </div>

          {/* Gold Mode Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">وضع الذهب (Gold Mode)</p>
              <p className="text-xs text-muted-foreground">تطبيق تأثير ذهبي على عناصر Prime</p>
            </div>
            <button
              onClick={() => setConfig({ goldMode: !config.goldMode })}
              className="relative h-6 w-11 rounded-full transition-colors"
              style={{ backgroundColor: config.goldMode ? "hsl(45, 90%, 55%)" : "hsl(var(--secondary))" }}
            >
              <span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform"
                style={{ right: config.goldMode ? "2px" : "20px" }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Social Links Manager */}
      <div className="glass rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">الروابط الاجتماعية</h2>
          <button onClick={addSocialLink} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs" style={{ backgroundColor: "hsl(var(--neon) / 0.1)", color: "hsl(var(--neon))" }}>
            <Plus className="h-3 w-3" />
            إضافة
          </button>
        </div>
        <div className="space-y-2">
          {socialLinks.map((link) => (
            <div key={link.id} className="flex gap-2">
              <input
                value={link.platform}
                onChange={(e) => updateSocialLink(link.id, "platform", e.target.value)}
                placeholder="المنصة..."
                className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:border-neon focus:outline-none"
              />
              <input
                value={link.url}
                onChange={(e) => updateSocialLink(link.id, "url", e.target.value)}
                placeholder="الرابط..."
                dir="ltr"
                className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:border-neon focus:outline-none"
              />
              <button onClick={() => removeSocialLink(link.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(var(--destructive))" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Friendly Sites (Network Rings) Manager */}
      <div className="glass rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" style={{ color: "hsl(var(--neon))" }} />
            <h2 className="text-lg font-semibold text-foreground">حلقات الشبكة (Neon Rings)</h2>
          </div>
          <button onClick={addFriendlySite} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs" style={{ backgroundColor: "hsl(var(--neon) / 0.1)", color: "hsl(var(--neon))" }}>
            <Plus className="h-3 w-3" />
            إضافة
          </button>
        </div>
        <div className="space-y-3">
          {friendlySites.map((site) => (
            <div key={site.id} className="flex gap-2">
              <input
                value={site.name}
                onChange={(e) => updateFriendlySite(site.id, "name", e.target.value)}
                placeholder="الاسم..."
                className="w-28 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:border-neon focus:outline-none"
              />
              <input
                value={site.description}
                onChange={(e) => updateFriendlySite(site.id, "description", e.target.value)}
                placeholder="الوصف..."
                className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:border-neon focus:outline-none"
              />
              <input
                value={site.url}
                onChange={(e) => updateFriendlySite(site.id, "url", e.target.value)}
                placeholder="الرابط..."
                dir="ltr"
                className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:border-neon focus:outline-none"
              />
              <button onClick={() => removeFriendlySite(site.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(var(--destructive))" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="rounded-lg px-6 py-2.5 text-sm font-semibold"
        style={{
          backgroundColor: "hsl(var(--neon))",
          color: "hsl(var(--background))",
          boxShadow: "var(--neon-glow-sm)",
        }}
      >
        {saved ? "تم الحفظ!" : "حفظ التغييرات"}
      </button>
    </div>
  )
}
