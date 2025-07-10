"use client"

import { useState, useCallback } from 'react'
import { apiService, type Cotizacion, type Cliente, type CotizacionCreate, type ClienteCreate, type ClienteUpdate } from '@/lib/api'
import { toast as toastGlobal } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApiState<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }))
  }, [])

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }))
  }, [])

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, loading: false, error: null }))
  }, [])

  return {
    ...state,
    setLoading,
    setError,
    setData,
  }
}

// Hook para cotizaciones
export function useCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCotizaciones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getCotizaciones()
      setCotizaciones(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar cotizaciones')
    } finally {
      setLoading(false)
    }
  }, [])

  const crearCotizacion = useCallback(async (cotizacionData: CotizacionCreate) => {
    setLoading(true)
    setError(null)
    try {
      const nuevaCotizacion = await apiService.crearCotizacion(cotizacionData)
      setCotizaciones(prev => [...prev, nuevaCotizacion])
      return nuevaCotizacion
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cotización')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const calcularCotizacionTemporal = useCallback(async (cotizacionData: CotizacionCreate) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.calcularCotizacionTemporal(cotizacionData)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular cotización')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const calcularPrecioEspecificaciones = useCallback(async (especificaciones: {
    alto: number
    ancho: number
    profundidad: number
    material: string
    color: string
    herrajes: string
    puertas: string
    cajones: string
    repisas: string
    tipo_mueble: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.calcularPrecioEspecificaciones(especificaciones)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular precio')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    cotizaciones,
    loading,
    error,
    fetchCotizaciones,
    crearCotizacion,
    calcularCotizacionTemporal,
    calcularPrecioEspecificaciones,
  }
}

// Hook para clientes
export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClientes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.getClientes()
      setClientes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  const crearCliente = useCallback(async (cliente: ClienteCreate) => {
    setLoading(true)
    setError(null)
    try {
      const nuevoCliente = await apiService.crearCliente(cliente)
      setClientes(prev => [...prev, nuevoCliente])
      return nuevoCliente
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cliente')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const crearClienteTemporal = useCallback(async (cliente: ClienteCreate) => {
    setLoading(true)
    setError(null)
    try {
      const nuevoCliente = await apiService.crearClienteTemporal(cliente)
      setClientes(prev => [...prev, nuevoCliente])
      return nuevoCliente
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cliente temporal')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const actualizarClienteTemporal = useCallback(async (clienteId: number, cliente: ClienteCreate) => {
    setLoading(true)
    setError(null)
    try {
      const clienteActualizado = await apiService.actualizarClienteTemporal(clienteId, cliente)
      setClientes(prev => prev.map(c => c.id === clienteId ? clienteActualizado : c))
      return clienteActualizado
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar cliente temporal')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const actualizarCliente = useCallback(async (id: number, cliente: ClienteUpdate) => {
    setLoading(true)
    setError(null)
    try {
      const clienteActualizado = await apiService.actualizarCliente(id, cliente)
      setClientes(prev => prev.map(c => c.id === id ? clienteActualizado : c))
      return clienteActualizado
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar cliente')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const eliminarCliente = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await apiService.eliminarCliente(id)
      setClientes(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cliente')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    clientes,
    loading,
    error,
    fetchClientes,
    crearCliente,
    crearClienteTemporal,
    actualizarClienteTemporal,
    actualizarCliente,
    eliminarCliente,
  }
}

// Hook para verificar el estado de la API
export function useApiHealth() {
  const [health, setHealth] = useState<{ status: string; message: string; timestamp: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiService.healthCheck()
      setHealth(data)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al verificar el estado de la API')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    health,
    loading,
    error,
    checkHealth,
  }
}

// Utilidad para descargar PDF de cotización guardada
export async function descargarPDFCotizacion(id: number, onSuccess?: () => void) {
  try {
    const blob = await apiService.descargarPDFCotizacion(id)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cotizacion_${id}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    if (onSuccess) onSuccess()
    toastGlobal({
      title: "Descarga exitosa",
      description: "El PDF de la cotización se descargó correctamente.",
      variant: "default"
    })
  } catch (error) {
    toastGlobal({
      title: "Error al descargar PDF",
      description: error instanceof Error ? error.message : "No se pudo descargar el PDF.",
      variant: "destructive"
    })
  }
}

// Utilidad para descargar PDF de cotización temporal
export async function descargarPDFCotizacionTemporal(cotizacion: any, cliente: any, items: any[], onSuccess?: () => void) {
  try {
    const blob = await apiService.descargarPDFCotizacionTemporal(cotizacion, cliente, items)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cotizacion_temporal.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    if (onSuccess) onSuccess()
    toastGlobal({
      title: "Descarga exitosa",
      description: "El PDF de la cotización se descargó correctamente.",
      variant: "default"
    })
  } catch (error) {
    toastGlobal({
      title: "Error al descargar PDF",
      description: error instanceof Error ? error.message : "No se pudo descargar el PDF.",
      variant: "destructive"
    })
  }
} 