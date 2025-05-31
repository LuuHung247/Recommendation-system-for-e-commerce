"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/auth"

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = (user: User) => {
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))

    // Set cookie for server-side auth
    document.cookie = `user_index=${user.user_index}; path=/; max-age=${60 * 60 * 24 * 7}`
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")

    // Remove cookie
    document.cookie = "user_index=; path=/; max-age=0"

    router.push("/")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
