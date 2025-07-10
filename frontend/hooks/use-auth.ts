"use client"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from './use-toast'
import { apiService } from '@/lib/api'

interface AdminUser {
  id: number
  email: string
  nombre: string
  apellido: string
  is_admin: boolean
}

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Función de logout que no depende del router para evitar dependencias circulares
  const clearAuth = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
  }, [])

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('adminToken')
      const storedUser = localStorage.getItem('adminUser')

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          
          // Verificar que el token sea válido con el backend
          try {
            // Intentar hacer una petición al backend para verificar el token
            await apiService.healthCheck()
            setToken(storedToken)
            setUser(userData)
          } catch (error) {
            console.error('Token inválido o backend no disponible:', error)
            // Si el backend no responde o el token es inválido, limpiar datos
            clearAuth()
          }
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          clearAuth()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [clearAuth])

  const login = useCallback((userData: AdminUser, accessToken: string) => {
    console.log('Login hook - userData:', userData)
    console.log('Login hook - accessToken:', accessToken)
    setUser(userData)
    setToken(accessToken)
    localStorage.setItem('adminToken', accessToken)
    localStorage.setItem('adminUser', JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    })
    
    router.push('/login')
  }, [router, toast, clearAuth])

  const isAuthenticated = !!user && !!token
  const isAdmin = user?.is_admin || false

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  }
} 