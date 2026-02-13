"use client"

import { useStore, type Article } from "@/lib/store"
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
  cardType: "normal",
  showAds: true,
  showLandingPage: false,
  autoRefresh: false,
}

export default function ArticlesPage() {
  const { articles, setArticles } = useStore()
  const [editing, setEditing] = useState<Article | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(EMPTY_ARTICLE)

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">إدارة المقالات</h1>
        <button
          onClick={startCreate}
          className="neon-ring flex items-center gap-2 rounded-lg bg-neon px-4 py-2 text-sm font-semibold text-primary-foreground"
          style={{ boxShadow: "var(--neon-glow-sm)" }}
        >
          <Plus className="h-4 w-4" />
          مقال جديد
        </button>
      </div>

      {/* Create/Edit Modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="glass-strong w-full max-w-2xl rounded-xl p-6" style={{ boxShadow: "var(--neon-glow-md)" }}>
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

              {/* Content */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">المحتوى</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                  rows={4}
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

                {/* Card Type */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">نوع البطاقة</label>
                  <select
                    value={form.cardType}
                    onChange={(e) => setForm({ ...form, cardType: e.target.value as Article["cardType"] })}
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-neon focus:outline-none"
                  >
                    <option value="titan">Titan</option>
                    <option value="premium">Premium</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
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

              {/* Toggles */}
              <div className="flex flex-wrap gap-6">
                <ToggleSwitch
                  label="عرض الإعلانات"
                  checked={form.showAds}
                  onChange={(v) => setForm({ ...form, showAds: v })}
                />
                <ToggleSwitch
                  label="صفحة الهبوط"
                  checked={form.showLandingPage}
                  onChange={(v) => setForm({ ...form, showLandingPage: v })}
                />
                <ToggleSwitch
                  label="تحديث تلقائي"
                  checked={form.autoRefresh}
                  onChange={(v) => setForm({ ...form, autoRefresh: v })}
                />
              </div>

              <button
                onClick={handleSave}
                className="neon-ring w-full rounded-lg bg-neon py-2.5 text-sm font-semibold text-primary-foreground"
                style={{ boxShadow: "var(--neon-glow-sm)" }}
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
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">النوع</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">الإعلانات</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">هبوط</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-border/50">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{article.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{article.category}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-neon/10 px-2 py-0.5 text-xs text-neon">
                      {article.cardType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {article.showAds ? "نعم" : "لا"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {article.showLandingPage ? "نعم" : "لا"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(article)}
                        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
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

function ToggleSwitch({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-neon" : "bg-secondary"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-transform ${
            checked ? "right-0.5" : "right-4"
          }`}
        />
      </button>
      <span className="text-xs text-muted-foreground">{label}</span>
    </label>
  )
}
