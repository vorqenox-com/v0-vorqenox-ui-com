"use client"

import { useStore, type Article, type SpecRow } from "@/lib/store"
import { useState } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"

function generateId() {
  return Math.random().toString(36).substring(2, 10)
}

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
}

export default function ArticlesPage() {
  const { articles, setArticles } = useStore()
  const [editing, setEditing] = useState<Article | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<Article, "id" | "createdAt">>(EMPTY_ARTICLE)

  const startCreate = () => {
    setForm(EMPTY_ARTICLE)
    setEditing(null)
    setCreating(true)
  }

  const startEdit = (article: Article) => {
    setForm(article)
    setEditing(article)
    setCreating(true)
  }

  const handleSave = () => {
    if (!form.title.trim()) return

    if (editing) {
      setArticles((prev) =>
        prev.map((a) => (a.id === editing.id ? { ...a, ...form } : a))
      )
    } else {
      const newArticle: Article = {
        ...form,
        id: generateId(),
        createdAt: new Date().toISOString().split("T")[0],
      }
      setArticles((prev) => [newArticle, ...prev])
    }

    setCreating(false)
    setEditing(null)
    setForm(EMPTY_ARTICLE)
  }

  const handleDelete = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id))
  }

  // Specs management
  const addSpec = () => {
    setForm((f) => ({ ...f, specs: [...f.specs, { key: "", value: "" }] }))
  }

  const updateSpec = (index: number, field: keyof SpecRow, value: string) => {
    setForm((f) => ({
      ...f,
      specs: f.specs.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }))
  }

  const removeSpec = (index: number) => {
    setForm((f) => ({ ...f, specs: f.specs.filter((_, i) => i !== index) }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">إدارة المقالات</h1>
        <button
          onClick={startCreate}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          style={{
            backgroundColor: "hsl(var(--neon))",
            color: "hsl(var(--background))",
            boxShadow: "var(--neon-glow-sm)",
          }}
        >
          <Plus className="h-4 w-4" />
          مقال جديد
        </button>
      </div>

      {/* Create/Edit Modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div
            className="glass-strong max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6"
            style={{ boxShadow: "var(--neon-glow-md)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editing ? "تعديل المقال" : "مقال جديد"}
              </h2>
              <button
                onClick={() => { setCreating(false); setEditing(null) }}
                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">العنوان</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                  placeholder="عنوان المقال..."
                />
              </div>

              {/* Target URL */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">رابط الهدف (Target URL)</label>
                <input
                  value={form.targetUrl}
                  onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                  placeholder="https://..."
                  dir="ltr"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">الملخص</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                  rows={2}
                  placeholder="ملخص المقال..."
                />
              </div>

              {/* Content (Rich Text placeholder) */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">المحتوى</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                  rows={5}
                  placeholder="محتوى المقال..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">التصنيف</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                    placeholder="التصنيف..."
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">الكلمات المفتاحية</label>
                  <input
                    value={form.keywords}
                    onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                    placeholder="كلمة1, كلمة2..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Card Type */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">نوع البطاقة (المكان)</label>
                  <select
                    value={form.cardType}
                    onChange={(e) => setForm({ ...form, cardType: e.target.value as Article["cardType"] })}
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                  >
                    <option value="titan">Titan (الكبير)</option>
                    <option value="premium">Premium (3D)</option>
                    <option value="normal">Normal (العادي)</option>
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">رابط الصورة</label>
                  <input
                    value={form.image || ""}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                    placeholder="https://..."
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Counter Mode */}
              <div className="glass rounded-xl p-4">
                <p className="mb-3 text-xs font-medium text-muted-foreground">نظام العداد</p>
                <div className="flex gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, counterMode: "fixed" })}
                    className="rounded-lg px-4 py-2 text-xs transition-all"
                    style={{
                      backgroundColor: form.counterMode === "fixed" ? "hsl(var(--neon) / 0.15)" : "hsl(var(--secondary))",
                      color: form.counterMode === "fixed" ? "hsl(var(--neon))" : "hsl(var(--muted-foreground))",
                      border: form.counterMode === "fixed" ? "1px solid hsl(var(--neon) / 0.3)" : "1px solid transparent",
                    }}
                  >
                    عد تنازلي ثابت
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, counterMode: "random" })}
                    className="rounded-lg px-4 py-2 text-xs transition-all"
                    style={{
                      backgroundColor: form.counterMode === "random" ? "hsl(var(--neon) / 0.15)" : "hsl(var(--secondary))",
                      color: form.counterMode === "random" ? "hsl(var(--neon))" : "hsl(var(--muted-foreground))",
                      border: form.counterMode === "random" ? "1px solid hsl(var(--neon) / 0.3)" : "1px solid transparent",
                    }}
                  >
                    رقم عشوائي
                  </button>
                </div>
                {form.counterMode === "fixed" ? (
                  <div>
                    <label className="mb-1 block text-xs text-muted-foreground">مدة العد (ثواني)</label>
                    <input
                      type="number"
                      value={form.counterFixed}
                      onChange={(e) => setForm({ ...form, counterFixed: Number(e.target.value) })}
                      className="w-32 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-neon focus:outline-none"
                      dir="ltr"
                    />
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">الحد الأدنى</label>
                      <input
                        type="number"
                        value={form.counterMin}
                        onChange={(e) => setForm({ ...form, counterMin: Number(e.target.value) })}
                        className="w-32 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-neon focus:outline-none"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">الحد الأقصى</label>
                      <input
                        type="number"
                        value={form.counterMax}
                        onChange={(e) => setForm({ ...form, counterMax: Number(e.target.value) })}
                        className="w-32 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-neon focus:outline-none"
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Specs Table */}
              <div className="glass rounded-xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">جدول المواصفات</p>
                  <button
                    type="button"
                    onClick={addSpec}
                    className="flex items-center gap-1 rounded-md px-3 py-1 text-xs"
                    style={{ backgroundColor: "hsl(var(--neon) / 0.1)", color: "hsl(var(--neon))" }}
                  >
                    <Plus className="h-3 w-3" />
                    إضافة
                  </button>
                </div>
                {form.specs.map((spec, i) => (
                  <div key={i} className="mb-2 flex gap-2">
                    <input
                      value={spec.key}
                      onChange={(e) => updateSpec(i, "key", e.target.value)}
                      placeholder="المفتاح..."
                      className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:border-neon focus:outline-none"
                    />
                    <input
                      value={spec.value}
                      onChange={(e) => updateSpec(i, "value", e.target.value)}
                      placeholder="القيمة..."
                      className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground focus:border-neon focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(i)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(var(--destructive))" }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6">
                <ToggleSwitch label="عرض الإعلانات" checked={form.showAds} onChange={(v) => setForm({ ...form, showAds: v })} />
                <ToggleSwitch label="صفحة الهبوط" checked={form.showLandingPage} onChange={(v) => setForm({ ...form, showLandingPage: v })} />
                <ToggleSwitch label="غسل الزيارات" checked={form.autoRefresh} onChange={(v) => setForm({ ...form, autoRefresh: v })} />
              </div>

              <button
                onClick={handleSave}
                className="w-full rounded-lg py-2.5 text-sm font-semibold"
                style={{
                  backgroundColor: "hsl(var(--neon))",
                  color: "hsl(var(--background))",
                  boxShadow: "var(--neon-glow-sm)",
                }}
              >
                {editing ? "حفظ التغييرات" : "إنشاء المقال"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="glass overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-right">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">العنوان</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">التصنيف</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">المكان</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">العداد</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">إعلانات</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">هبوط</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-border/50 transition-colors hover:bg-accent/30">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{article.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{article.category}</td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs"
                      style={{ backgroundColor: "hsl(var(--neon) / 0.1)", color: "hsl(var(--neon))" }}
                    >
                      {article.cardType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {article.counterMode === "fixed" ? `${article.counterFixed}s` : `${article.counterMin}-${article.counterMax}`}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {article.showAds ? "نعم" : "لا"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {article.showLandingPage ? "نعم" : "لا"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(article)} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent">
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => handleDelete(article.id)} className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" style={{ color: "hsl(var(--destructive))" }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ToggleSwitch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative h-5 w-9 rounded-full transition-colors"
        style={{ backgroundColor: checked ? "hsl(var(--neon))" : "hsl(var(--secondary))" }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-transform"
          style={{ right: checked ? "2px" : "16px" }}
        />
      </button>
      <span className="text-xs text-muted-foreground">{label}</span>
    </label>
  )
}
