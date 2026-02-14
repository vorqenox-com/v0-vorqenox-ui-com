"use client"

import { useStore, type Article, type InfoBox, type LeadGenMode, type TrafficWashMode, type Visibility } from "@/lib/store"
import { supabase } from "@/lib/supabase"
import { useState, useEffect, useCallback } from "react"
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Tag,
  Monitor,
  HardDrive,
  Shield,
  Calendar,
  Star,
  ChevronDown,
  ChevronUp,
  FileText,
  Zap,
  AlertCircle,
  Check,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Default shapes                                                     */
/* ------------------------------------------------------------------ */

const DEFAULT_INFO_BOXES: InfoBox[] = [
  { label: "Version", value: "", icon: "tag" },
  { label: "Platform", value: "", icon: "monitor" },
  { label: "Size", value: "", icon: "hard-drive" },
  { label: "License", value: "", icon: "shield" },
  { label: "Release", value: "", icon: "calendar" },
  { label: "Rating", value: "", icon: "star" },
]

const EMPTY_ARTICLE: Omit<Article, "id" | "createdAt"> = {
  title: "",
  excerpt: "",
  content: "",
  image: "",
  category: "",
  keywords: "",
  targetUrl: "",
  cardType: "normal",
  showAds: true,
  showLandingPage: false,
  autoRefresh: false,
  counterMode: "fixed",
  counterFixed: 10,
  counterMin: 500,
  counterMax: 1500,
  specs: [],
  leadGenMode: "none",
  trafficWashMode: "off",
  visibility: "grid",
  infoBoxes: [...DEFAULT_INFO_BOXES],
}

/* ------------------------------------------------------------------ */
/*  Icon map                                                           */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, React.ElementType> = {
  tag: Tag,
  monitor: Monitor,
  "hard-drive": HardDrive,
  shield: Shield,
  calendar: Calendar,
  star: Star,
}

function getIcon(name: string) {
  return ICON_MAP[name] ?? Tag
}

/* ------------------------------------------------------------------ */
/*  ID generator (hydration-safe)                                      */
/* ------------------------------------------------------------------ */

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8)
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function ArticlesPage() {
  const { articles, setArticles } = useStore()
  const [editing, setEditing] = useState<Article | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<Article, "id" | "createdAt">>(EMPTY_ARTICLE)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  /* ---- Form helpers ---- */

  const startCreate = () => {
    setForm({ ...EMPTY_ARTICLE, infoBoxes: [...DEFAULT_INFO_BOXES] })
    setEditing(null)
    setCreating(true)
    setSaveStatus("idle")
  }

  const startEdit = (article: Article) => {
    const { id, createdAt, ...rest } = article
    void id
    void createdAt
    setForm({
      ...rest,
      infoBoxes: rest.infoBoxes?.length ? rest.infoBoxes : [...DEFAULT_INFO_BOXES],
    })
    setEditing(article)
    setCreating(true)
    setSaveStatus("idle")
  }

  const closeModal = () => {
    setCreating(false)
    setEditing(null)
    setForm(EMPTY_ARTICLE)
    setSaveStatus("idle")
  }

  /* ---- Save (local + Supabase) ---- */

  const handleSave = useCallback(async () => {
    if (!form.title.trim()) return
    setSaving(true)
    setSaveStatus("idle")

    const now = new Date().toISOString().split("T")[0]
    let newArticle: Article

    if (editing) {
      newArticle = { ...editing, ...form }
      setArticles((prev) => prev.map((a) => (a.id === editing.id ? newArticle : a)))
    } else {
      newArticle = { ...form, id: generateId(), createdAt: now }
      setArticles((prev) => [newArticle, ...prev])
    }

    // Persist to Supabase
    try {
      const payload = {
        id: newArticle.id,
        title: newArticle.title,
        excerpt: newArticle.excerpt,
        content: newArticle.content,
        image: newArticle.image || null,
        category: newArticle.category,
        keywords: newArticle.keywords,
        target_url: newArticle.targetUrl,
        card_type: newArticle.cardType,
        show_ads: newArticle.showAds,
        show_landing_page: newArticle.showLandingPage,
        auto_refresh: newArticle.autoRefresh,
        counter_mode: newArticle.counterMode,
        counter_fixed: newArticle.counterFixed,
        counter_min: newArticle.counterMin,
        counter_max: newArticle.counterMax,
        specs: newArticle.specs,
        lead_gen_mode: newArticle.leadGenMode,
        traffic_wash_mode: newArticle.trafficWashMode,
        visibility: newArticle.visibility,
        info_boxes: newArticle.infoBoxes,
        created_at: newArticle.createdAt,
      }

      const { error } = await supabase
        .from("articles")
        .upsert(payload, { onConflict: "id" })

      if (error) {
        // Supabase upsert failed
        setSaveStatus("error")
      } else {
        setSaveStatus("success")
      }
    } catch (err) {
      // Supabase save failed
      setSaveStatus("error")
    }

    setSaving(false)
    setTimeout(() => {
      if (saveStatus !== "error") closeModal()
    }, 800)
  }, [form, editing, setArticles, saveStatus])

  /* ---- Delete ---- */

  const handleDelete = async (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id))
    try {
      await supabase.from("articles").delete().eq("id", id)
    } catch {
      // silent
    }
  }

  /* ---- Info box updater ---- */

  const updateInfoBox = (index: number, field: keyof InfoBox, value: string) => {
    setForm((f) => ({
      ...f,
      infoBoxes: f.infoBoxes.map((box, i) => (i === index ? { ...box, [field]: value } : box)),
    }))
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Advanced Post Manager</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, edit, and manage articles with full control over visibility, monetization, and traffic logic.
          </p>
        </div>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: "hsl(var(--neon))",
            color: "#050505",
            boxShadow: "0 0 15px rgba(34, 211, 238, 0.2)",
          }}
        >
          <Plus className="h-4 w-4" />
          New Post
        </button>
      </div>

      {/* ============================================================= */}
      {/*  CREATE / EDIT MODAL                                           */}
      {/* ============================================================= */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm">
          <div
            className="relative w-full max-w-3xl rounded-2xl border border-white/10 p-6"
            style={{
              background: "hsla(220, 15%, 7%, 0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 0 30px rgba(34, 211, 238, 0.08), 0 25px 50px -12px rgba(0,0,0,0.6)",
            }}
          >
            {/* Modal header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: "hsl(var(--neon) / 0.1)" }}
                >
                  <FileText className="h-5 w-5" style={{ color: "hsl(var(--neon))" }} />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {editing ? "Edit Article" : "Create New Article"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* ---- Core Fields ---- */}
              <SectionLabel label="Core Information" />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Title"
                  value={form.title}
                  onChange={(v) => setForm({ ...form, title: v })}
                  placeholder="Article title..."
                  fullWidth
                />
                <FormField
                  label="Category"
                  value={form.category}
                  onChange={(v) => setForm({ ...form, category: v })}
                  placeholder="e.g. Technology"
                />
              </div>

              <FormField
                label="Excerpt"
                value={form.excerpt}
                onChange={(v) => setForm({ ...form, excerpt: v })}
                placeholder="Short summary..."
                textarea
                rows={2}
              />

              <FormField
                label="Content"
                value={form.content}
                onChange={(v) => setForm({ ...form, content: v })}
                placeholder="Full article content..."
                textarea
                rows={5}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Image URL"
                  value={form.image || ""}
                  onChange={(v) => setForm({ ...form, image: v })}
                  placeholder="https://..."
                />
                <FormField
                  label="Target URL"
                  value={form.targetUrl}
                  onChange={(v) => setForm({ ...form, targetUrl: v })}
                  placeholder="https://..."
                />
              </div>

              <FormField
                label="Keywords"
                value={form.keywords}
                onChange={(v) => setForm({ ...form, keywords: v })}
                placeholder="keyword1, keyword2, ..."
              />

              {/* ---- 6-Box Info Grid ---- */}
              <SectionLabel label="6-Box Info Grid" />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {form.infoBoxes.map((box, i) => {
                  const Icon = getIcon(box.icon)
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3"
                      style={{ background: "hsla(220, 15%, 10%, 0.5)" }}
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ background: "hsl(var(--neon) / 0.08)" }}
                      >
                        <Icon className="h-4 w-4" style={{ color: "hsl(var(--neon))" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                          {box.label}
                        </p>
                        <input
                          value={box.value}
                          onChange={(e) => updateInfoBox(i, "value", e.target.value)}
                          placeholder={`Enter ${box.label.toLowerCase()}...`}
                          className="mt-0.5 w-full bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ---- Professional Toggles ---- */}
              <SectionLabel label="Professional Toggles" />

              <div
                className="space-y-4 rounded-2xl border border-white/10 p-5"
                style={{ background: "hsla(220, 15%, 8%, 0.6)" }}
              >
                {/* Ads Status */}
                <ToggleRow
                  label="Ads Status"
                  description="Show advertisements on this article"
                  checked={form.showAds}
                  onChange={(v) => setForm({ ...form, showAds: v })}
                />

                <Divider />

                {/* Counter Type */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Counter Type
                  </p>
                  <p className="mb-3 text-[11px] text-gray-600">
                    Controls the countdown/number display on the article page
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["fixed", "random", "hidden"] as const).map((mode) => (
                      <OptionPill
                        key={mode}
                        label={mode === "fixed" ? "Fixed Countdown" : mode === "random" ? "Random Number" : "Hidden"}
                        active={form.counterMode === mode}
                        onClick={() => setForm({ ...form, counterMode: mode })}
                      />
                    ))}
                  </div>
                  {form.counterMode === "fixed" && (
                    <div className="mt-3">
                      <FormField
                        label="Duration (seconds)"
                        value={form.counterFixed.toString()}
                        onChange={(v) => setForm({ ...form, counterFixed: Number(v) || 0 })}
                        type="number"
                        small
                      />
                    </div>
                  )}
                  {form.counterMode === "random" && (
                    <div className="mt-3 flex gap-3">
                      <FormField
                        label="Min"
                        value={form.counterMin.toString()}
                        onChange={(v) => setForm({ ...form, counterMin: Number(v) || 0 })}
                        type="number"
                        small
                      />
                      <FormField
                        label="Max"
                        value={form.counterMax.toString()}
                        onChange={(v) => setForm({ ...form, counterMax: Number(v) || 0 })}
                        type="number"
                        small
                      />
                    </div>
                  )}
                </div>

                <Divider />

                {/* Lead Gen Mode */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lead Gen Mode
                  </p>
                  <p className="mb-3 text-[11px] text-gray-600">
                    Controls how aggressively the article captures leads
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { key: "none", label: "None" },
                      { key: "quiet", label: "Quiet" },
                      { key: "aggressive", label: "Aggressive" },
                      { key: "email-to-unlock", label: "Email-to-Unlock" },
                    ] as const).map((opt) => (
                      <OptionPill
                        key={opt.key}
                        label={opt.label}
                        active={form.leadGenMode === opt.key}
                        onClick={() => setForm({ ...form, leadGenMode: opt.key as LeadGenMode })}
                      />
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Traffic Washing */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Traffic Washing
                  </p>
                  <p className="mb-3 text-[11px] text-gray-600">
                    Auto-redirect mode for traffic routing
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { key: "off", label: "Off" },
                      { key: "type1", label: "Type 1" },
                      { key: "type2", label: "Type 2" },
                    ] as const).map((opt) => (
                      <OptionPill
                        key={opt.key}
                        label={opt.label}
                        active={form.trafficWashMode === opt.key}
                        onClick={() => setForm({ ...form, trafficWashMode: opt.key as TrafficWashMode })}
                      />
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Visibility */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Visibility
                  </p>
                  <p className="mb-3 text-[11px] text-gray-600">
                    Where this article appears on the public site
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {([
                      { key: "titan", label: "Titan Slider" },
                      { key: "premium", label: "Premium Stack" },
                      { key: "grid", label: "Regular Grid" },
                    ] as const).map((opt) => (
                      <OptionPill
                        key={opt.key}
                        label={opt.label}
                        active={form.visibility === opt.key}
                        onClick={() => setForm({ ...form, visibility: opt.key as Visibility })}
                        accent={opt.key === "titan" ? "hsl(var(--neon))" : opt.key === "premium" ? "hsl(45, 90%, 55%)" : undefined}
                      />
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Landing Page */}
                <ToggleRow
                  label="Landing Page"
                  description="Show a gated landing page before the article"
                  checked={form.showLandingPage}
                  onChange={(v) => setForm({ ...form, showLandingPage: v })}
                />
              </div>

              {/* ---- Save Status & Button ---- */}
              {saveStatus === "error" && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>Supabase save failed. Article saved locally.</span>
                </div>
              )}

              {saveStatus === "success" && (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5 text-sm text-emerald-400">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>Article saved to Supabase successfully.</span>
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  backgroundColor: "hsl(var(--neon))",
                  color: "#050505",
                  boxShadow: "0 0 15px rgba(34, 211, 238, 0.2)",
                }}
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editing ? "Save Changes" : "Create Article"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/*  ARTICLES TABLE                                                */}
      {/* ============================================================= */}
      <div
        className="overflow-hidden rounded-2xl border border-white/10"
        style={{
          background: "hsla(220, 15%, 7%, 0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_100px_90px_90px_80px_80px_70px] items-center border-b border-white/5 px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-gray-500">
          <span>Title</span>
          <span>Visibility</span>
          <span>Counter</span>
          <span>Lead Gen</span>
          <span>Ads</span>
          <span>Wash</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Table Rows */}
        {articles.map((article) => {
          const isExpanded = expandedRow === article.id
          return (
            <div key={article.id} className="border-b border-white/[0.03] last:border-b-0">
              {/* Main row */}
              <div
                className="grid cursor-pointer grid-cols-[1fr_100px_90px_90px_80px_80px_70px] items-center px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                onClick={() => setExpandedRow(isExpanded ? null : article.id)}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <button className="shrink-0 text-gray-600">
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{article.title}</p>
                    <p className="truncate text-[11px] text-gray-500">{article.category}</p>
                  </div>
                </div>

                <VisibilityBadge visibility={article.visibility || (article.cardType as Visibility)} />

                <span className="text-xs text-gray-400">
                  {article.counterMode === "hidden"
                    ? "Hidden"
                    : article.counterMode === "fixed"
                      ? `${article.counterFixed}s`
                      : `${article.counterMin}-${article.counterMax}`}
                </span>

                <LeadGenBadge mode={article.leadGenMode || "none"} />

                <span className="text-xs">
                  {article.showAds ? (
                    <span className="text-emerald-400">On</span>
                  ) : (
                    <span className="text-gray-600">Off</span>
                  )}
                </span>

                <span className="text-xs">
                  {(article.trafficWashMode || "off") === "off" ? (
                    <span className="text-gray-600">Off</span>
                  ) : (
                    <span style={{ color: "hsl(45, 90%, 55%)" }}>
                      {article.trafficWashMode === "type1" ? "T1" : "T2"}
                    </span>
                  )}
                </span>

                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startEdit(article)
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-all duration-200 hover:scale-105 hover:bg-white/5 hover:text-white"
                    style={{ boxShadow: "0 0 8px rgba(34, 211, 238, 0)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 15px rgba(34, 211, 238, 0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 8px rgba(34, 211, 238, 0)")}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(article.id)
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-all duration-200 hover:scale-105 hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded detail panel */}
              {isExpanded && (
                <div
                  className="border-t border-white/[0.03] px-5 py-4"
                  style={{ background: "hsla(220, 15%, 6%, 0.5)" }}
                >
                  {/* Info Boxes */}
                  {article.infoBoxes && article.infoBoxes.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">
                        Info Grid
                      </p>
                      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                        {article.infoBoxes.map((box, i) => {
                          const Icon = getIcon(box.icon)
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded-lg border border-white/5 px-3 py-2"
                              style={{ background: "hsla(220, 15%, 10%, 0.4)" }}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "hsl(var(--neon))" }} />
                              <div className="min-w-0">
                                <p className="text-[9px] uppercase tracking-wider text-gray-500">{box.label}</p>
                                <p className="truncate text-xs font-medium text-white">{box.value || "---"}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Excerpt */}
                  <p className="text-xs leading-relaxed text-gray-400">
                    {article.excerpt || "No excerpt provided."}
                  </p>

                  {/* Quick specs */}
                  {article.specs.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {article.specs.map((s, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-white/5 px-2.5 py-0.5 text-[11px] text-gray-400"
                          style={{ background: "hsla(220, 15%, 12%, 0.5)" }}
                        >
                          {s.key}: {s.value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {articles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="mb-3 h-10 w-10 text-gray-700" />
            <p className="text-sm text-gray-500">No articles yet.</p>
            <p className="text-xs text-gray-600">Click &ldquo;New Post&rdquo; to create your first article.</p>
          </div>
        )}
      </div>

      {/* Footer summary */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{articles.length} article{articles.length !== 1 ? "s" : ""} total</span>
        <span>
          Titan: {articles.filter((a) => (a.visibility || a.cardType) === "titan").length} |
          Premium: {articles.filter((a) => (a.visibility || a.cardType) === "premium").length} |
          Grid: {articles.filter((a) => (a.visibility || a.cardType) === "grid" || (a.visibility || a.cardType) === "normal").length}
        </span>
      </div>
    </div>
  )
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
        {label}
      </span>
      <span className="h-px flex-1 bg-white/5" />
    </div>
  )
}

function Divider() {
  return <div className="h-px w-full bg-white/5" />
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea = false,
  rows = 3,
  small = false,
  fullWidth = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  textarea?: boolean
  rows?: number
  small?: boolean
  fullWidth?: boolean
}) {
  const cls = `w-full rounded-2xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 transition-colors duration-200 ${
    small ? "px-3 py-2 text-xs" : "px-4 py-2.5"
  } ${fullWidth ? "sm:col-span-2" : ""}`

  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-gray-500">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={cls}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
        <p className="text-[11px] text-gray-600">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{
          backgroundColor: checked ? "hsl(var(--neon))" : "hsla(220, 15%, 15%, 1)",
        }}
        role="switch"
        aria-checked={checked}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{
            transform: checked ? "translateX(22px)" : "translateX(2px)",
          }}
        />
      </button>
    </div>
  )
}

function OptionPill({
  label,
  active,
  onClick,
  accent,
}: {
  label: string
  active: boolean
  onClick: () => void
  accent?: string
}) {
  const color = accent || "hsl(var(--neon))"
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl px-3.5 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105"
      style={{
        backgroundColor: active ? `color-mix(in srgb, ${color} 12%, transparent)` : "hsla(220, 15%, 12%, 0.5)",
        color: active ? color : "rgb(107, 114, 128)",
        border: active ? `1px solid color-mix(in srgb, ${color} 25%, transparent)` : "1px solid transparent",
      }}
    >
      {label}
    </button>
  )
}

function VisibilityBadge({ visibility }: { visibility: Visibility | "normal" }) {
  const config: Record<string, { label: string; color: string; bg: string }> = {
    titan: { label: "Titan", color: "hsl(var(--neon))", bg: "hsl(var(--neon) / 0.1)" },
    premium: { label: "Premium", color: "hsl(45, 90%, 55%)", bg: "hsla(45, 90%, 55%, 0.1)" },
    grid: { label: "Grid", color: "rgb(156, 163, 175)", bg: "hsla(220, 12%, 20%, 0.5)" },
    normal: { label: "Grid", color: "rgb(156, 163, 175)", bg: "hsla(220, 12%, 20%, 0.5)" },
  }
  const c = config[visibility] || config.grid
  return (
    <span
      className="inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  )
}

function LeadGenBadge({ mode }: { mode: LeadGenMode }) {
  const config: Record<LeadGenMode, { label: string; color: string }> = {
    none: { label: "None", color: "rgb(107, 114, 128)" },
    quiet: { label: "Quiet", color: "hsl(var(--neon))" },
    aggressive: { label: "Aggro", color: "hsl(25, 95%, 55%)" },
    "email-to-unlock": { label: "E2U", color: "hsl(280, 70%, 60%)" },
  }
  const c = config[mode] || config.none
  return (
    <span className="text-xs font-medium" style={{ color: c.color }}>
      {c.label}
    </span>
  )
}
