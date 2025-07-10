"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApiHealth } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"

export function ApiTest() {
  const { health, loading, error, checkHealth } = useApiHealth()
  const { toast } = useToast()
  const [testResult, setTestResult] = useState<string>("")

  const handleTestConnection = async () => {
    try {
      const result = await checkHealth()
      setTestResult(`API conectada: ${result.status} - ${result.message}`)
      toast({
        title: "Conexión exitosa",
        description: "El backend está funcionando correctamente",
      })
    } catch (err) {
      setTestResult(`Error de conexión: ${err instanceof Error ? err.message : "Error desconocido"}`)
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar con el backend",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Prueba de Conexión API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleTestConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Probando..." : "Probar Conexión"}
        </Button>
        
        {testResult && (
          <div className="p-3 bg-gray-100 rounded-md">
            <p className="text-sm">{testResult}</p>
          </div>
        )}
        
        {health && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              <strong>Estado:</strong> {health.status}
            </p>
            <p className="text-sm text-green-700">
              <strong>Mensaje:</strong> {health.message}
            </p>
            <p className="text-xs text-green-600">
              <strong>Timestamp:</strong> {new Date(health.timestamp).toLocaleString()}
            </p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 