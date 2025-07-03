"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  user: { email: string } | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)

  useEffect(() => {
    // Check if user is logged in on mount
    const savedAuth = localStorage.getItem("isAuthenticated")
    const savedUser = localStorage.getItem("user")
    if (savedAuth === "true" && savedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Simple demo login - in real app, validate with backend
    if (email && password) {
      const userData = { email }
      setIsAuthenticated(true)
      setUser(userData)
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
