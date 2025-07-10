"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"

export function ConnectionDiagnostics() {
  const { toast } = useToast()
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [userAgent, setUserAgent] = useState("No disponible")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserAgent(navigator.userAgent)
    }
  }, [])

  const testBackendConnection = async () => {
    setLoading(true)
    const newResults: any = {}
    
    try {
      // Test 1: Health check
      const healthResponse = await fetch('http://localhost:8000/health')
      newResults.health = {
        status: healthResponse.status,
        ok: healthResponse.ok,
        data: healthResponse.ok ? await healthResponse.json() : null
      }
    } catch (error) {
      newResults.health = {
        status: 'error',
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }

    try {
      // Test 2: CORS preflight
      const corsResponse = await fetch('http://localhost:8000/health', {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      })
      newResults.cors = {
        status: corsResponse.status,
        ok: corsResponse.ok,
        headers: Object.fromEntries(corsResponse.headers.entries())
      }
    } catch (error) {
      newResults.cors = {
        status: 'error',
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }

    try {
      // Test 3: Clientes endpoint
      const clientesResponse = await fetch('http://localhost:8000/clientes/')
      newResults.clientes = {
        status: clientesResponse.status,
        ok: clientesResponse.ok,
        data: clientesResponse.ok ? await clientesResponse.json() : null
      }
    } catch (error) {
      newResults.clientes = {
        status: 'error',
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }

    try {
      // Test 4: Cotizaciones endpoint
      const cotizacionesResponse = await fetch('http://localhost:8000/cotizaciones/')
      newResults.cotizaciones = {
        status: cotizacionesResponse.status,
        ok: cotizacionesResponse.ok,
        data: cotizacionesResponse.ok ? await cotizacionesResponse.json() : null
      }
    } catch (error) {
      newResults.cotizaciones = {
        status: 'error',
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }

    try {
      // Test 5: Login endpoint
      const loginResponse = await fetch('http://localhost:8000/auth/login-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@mvc.cl',
          password: 'Admin123'
        })
      })
      newResults.login = {
        status: loginResponse.status,
        ok: loginResponse.ok,
        data: loginResponse.ok ? await loginResponse.json() : null
      }
    } catch (error) {
      newResults.login = {
        status: 'error',
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }

    try {
      // Test 6: Calcular precio endpoint
      const precioResponse = await fetch('http://localhost:8000/cotizaciones/calcular-precio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alto: 220,
          ancho: 120,
          profundidad: 60,
          material: 'melamina',
          color: 'blanco',
          herrajes: 'estandar',
          puertas: '2',
          cajones: '3',
          repisas: '4',
          tipo_mueble: 'closet'
        })
      })
      newResults.calcularPrecio = {
        status: precioResponse.status,
        ok: precioResponse.ok,
        data: precioResponse.ok ? await precioResponse.json() : null
      }
    } catch (error) {
      newResults.calcularPrecio = {
        status: 'error',
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }

    setResults(newResults)
    setLoading(false)

    // Mostrar resumen
    const successCount = Object.values(newResults).filter((r: any) => r.ok).length
    const totalCount = Object.keys(newResults).length

    if (successCount === totalCount) {
      toast({
        title: "✅ Conexión exitosa",
        description: `Todos los endpoints funcionan correctamente (${successCount}/${totalCount})`,
      })
    } else {
      toast({
        title: "⚠️ Problemas de conexión",
        description: `Solo ${successCount}/${totalCount} endpoints funcionan`,
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Diagnóstico de Conexión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testBackendConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Diagnosticando..." : "Ejecutar Diagnóstico Completo"}
        </Button>
        
        {Object.keys(results).length > 0 && (
          <div className="space-y-4">
            {Object.entries(results).map(([key, result]: [string, any]) => (
              <div key={key} className={`p-3 rounded-md border ${
                result.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <h4 className="font-medium mb-2 capitalize">{key}</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Estado:</strong> {result.ok ? '✅ OK' : '❌ Error'}</p>
                  <p><strong>Código:</strong> {result.status}</p>
                  {result.error && (
                    <p><strong>Error:</strong> {result.error}</p>
                  )}
                  {result.data && (
                    <p><strong>Datos:</strong> {JSON.stringify(result.data, null, 2)}</p>
                  )}
                  {result.headers && (
                    <div>
                      <strong>Headers CORS:</strong>
                      <pre className="text-xs mt-1 bg-gray-100 p-2 rounded">
                        {JSON.stringify(result.headers, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Información de Red</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Frontend:</strong> http://localhost:3000</p>
            <p><strong>Backend:</strong> http://localhost:8000</p>
            <p><strong>User Agent:</strong> {userAgent}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 