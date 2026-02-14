"use client"

import { useAuth } from "@/lib/auth-context"
import { Shield, Lock, KeyRound, Eye, EyeOff, CheckCircle2, AlertTriangle } from "lucide-react"
import { useState } from "react"

const SUPER_PASSWORD = "Elfr3onela3zamx430#"

export default function SecurityPage() {
  const { role } = useAuth()
  const [currentPw, setCurrentPw] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [verifyStatus, setVerifyStatus] = useState<"idle" | "success" | "error">("idle")

  const handleVerify = () => {
    if (currentPw === SUPER_PASSWORD) {
      setVerifyStatus("success")
    } else {
      setVerifyStatus("error")
    }
    setTimeout(() => setVerifyStatus("idle"), 3000)
    setCurrentPw("")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Security Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage access credentials and authentication for the admin panel.
        </p>
      </div>

      {/* Access Status */}
      <div
        className="flex items-center gap-4 rounded-2xl border border-white/10 p-5"
        style={{
          background: "hsla(220, 15%, 7%, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(34, 211, 238, 0.08)",
            boxShadow: "0 0 15px rgba(34, 211, 238, 0.15)",
          }}
        >
          <Shield className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Current Role</p>
          <p className="text-xs text-gray-400">
            {role === "super-admin" ? "Super Admin -- Full system access" : "Sub Admin -- Limited access"}
          </p>
        </div>
        <span
          className="ml-auto rounded-full px-3 py-1 text-[11px] font-medium"
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            color: "rgb(34, 197, 94)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          Authenticated
        </span>
      </div>

      {/* Password Verification */}
      <div
        className="rounded-2xl border border-white/10 p-6"
        style={{
          background: "hsla(220, 15%, 7%, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="mb-5 flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Verify Master Password</h2>
        </div>
        <p className="mb-4 text-xs text-gray-500">
          Re-enter the master access key to confirm your identity.
        </p>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type={showPw ? "text" : "password"}
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="Enter master key..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-gray-600 transition-colors duration-200 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={handleVerify}
            className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-[#050505] transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: "hsl(var(--neon))",
              boxShadow: "0 0 15px rgba(34, 211, 238, 0.2)",
            }}
          >
            Verify
          </button>
        </div>

        {verifyStatus === "success" && (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Identity confirmed.
          </div>
        )}
        {verifyStatus === "error" && (
          <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Incorrect password.
          </div>
        )}
      </div>

      {/* Access Info */}
      <div
        className="rounded-2xl border border-white/10 p-6"
        style={{
          background: "hsla(220, 15%, 7%, 0.7)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <div className="mb-5 flex items-center gap-2">
          <Lock className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Access Information</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-white/5 px-4 py-3" style={{ background: "hsla(220, 15%, 8%, 0.5)" }}>
            <span className="text-xs text-gray-400">Login Route</span>
            <code className="rounded bg-white/5 px-2 py-0.5 font-mono text-xs text-cyan-400">/admin-gateway</code>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/5 px-4 py-3" style={{ background: "hsla(220, 15%, 8%, 0.5)" }}>
            <span className="text-xs text-gray-400">Username Field</span>
            <span className="text-xs text-gray-300">Must be left empty (trap mechanism active)</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/5 px-4 py-3" style={{ background: "hsla(220, 15%, 8%, 0.5)" }}>
            <span className="text-xs text-gray-400">Auth Method</span>
            <span className="text-xs text-gray-300">Client-side password + context-based session</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/5 px-4 py-3" style={{ background: "hsla(220, 15%, 8%, 0.5)" }}>
            <span className="text-xs text-gray-400">Session Persistence</span>
            <span className="text-xs text-gray-300">In-memory only (clears on refresh)</span>
          </div>
        </div>
      </div>

      {/* System Footer */}
      <div className="flex items-center justify-between rounded-lg border border-white/5 px-5 py-3 text-xs text-gray-600">
        <span>Vorqenox V2 Security Module</span>
        <span>Encryption: Client-Side Auth Context</span>
      </div>
    </div>
  )
}
