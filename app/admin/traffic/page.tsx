"use client"

import { useStore } from "@/lib/store"
import { Activity, RefreshCw } from "lucide-react"

export default function TrafficPage() {
  const { silentRefresh, setSilentRefresh } = useStore()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">غسل الزيارات</h1>
      <p className="text-sm text-muted-foreground">
        تفعيل التحديث الصامت في الخلفية لإعادة تدوير الزيارات
      </p>

      <div className="glass rounded-xl p-6" style={{ boxShadow: "var(--neon-glow-sm)" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              silentRefresh ? "bg-neon/20" : "bg-secondary"
            }`}>
              <Activity className={`h-6 w-6 ${silentRefresh ? "text-neon" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">التحديث الصامت (Auto-Wash)</h3>
              <p className="text-xs text-muted-foreground">
                {silentRefresh ? "نشط - يتم تحديث الصفحات كل 30 ثانية" : "معطل"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSilentRefresh(!silentRefresh)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              silentRefresh ? "bg-neon" : "bg-secondary"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-foreground transition-transform ${
                silentRefresh ? "right-1" : "right-6"
              }`}
            />
          </button>
        </div>

        {silentRefresh && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-neon/5 p-3">
            <RefreshCw className="h-4 w-4 animate-spin text-neon" />
            <span className="text-xs text-neon">جاري التحديث الصامت...</span>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-xl p-5">
          <h3 className="mb-2 text-sm font-semibold text-foreground">كيف يعمل</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            يقوم النظام بإرسال أحداث تحديث صامتة إلى جميع الصفحات المفتوحة كل 30 ثانية. هذا يمنع انتهاء الجلسات ويحافظ على نشاط الزوار.
          </p>
        </div>
        <div className="glass rounded-xl p-5">
          <h3 className="mb-2 text-sm font-semibold text-foreground">الإعدادات المتقدمة</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            يمكنك تفعيل التحديث التلقائي لكل مقال على حدة من صفحة إدارة المقالات عبر مفتاح "تحديث تلقائي".
          </p>
        </div>
      </div>
    </div>
  )
}
