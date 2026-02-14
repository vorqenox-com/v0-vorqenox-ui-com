"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type Role = "super-admin" | "sub-admin" | null

interface AuthContextType {
  isAuthenticated: boolean
  role: Role
  user: User | null
  loading: boolean
  login: (password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

const ADMIN_EMAIL = "Vorqenox@gmail.com"
const SUPER_PASSWORD = "Elfr3onela3zamx430#"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    // Check existing session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        setRole("super-admin")
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setRole("super-admin")
      } else {
        setUser(null)
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (password: string): Promise<{ error?: string }> => {
    if (password !== SUPER_PASSWORD) {
      return { error: "ACCESS DENIED" }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: SUPER_PASSWORD,
    })

    if (error) {
      // If user doesn't exist yet, sign them up first
      if (error.message.includes("Invalid login credentials")) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: ADMIN_EMAIL,
          password: SUPER_PASSWORD,
          options: {
            data: { role: "super-admin" },
          },
        })
        if (signUpError) {
          return { error: signUpError.message }
        }
        // Try sign in again after signup
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: SUPER_PASSWORD,
        })
        if (retryError) {
          return { error: retryError.message }
        }
        return {}
      }
      return { error: error.message }
    }
    return {}
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
