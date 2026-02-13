"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Role = "super-admin" | "sub-admin" | null

interface AuthContextType {
  isAuthenticated: boolean
  role: Role
  login: (role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState<Role>(null)

  const login = (r: Role) => {
    setIsAuthenticated(true)
    setRole(r)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
