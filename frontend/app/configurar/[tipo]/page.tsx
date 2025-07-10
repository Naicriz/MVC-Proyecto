"use client"

import type React from "react"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Upload, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useCotizaciones, useClientes } from "@/hooks/use-api"
import type { CotizacionCreate, ClienteCreate } from "@/lib/api"

export default function ConfiguracionCotizacion() {
  const router = useRouter()
  const params = useParams()
  const tipo = typeof params.tipo === "string" ? params.tipo : ""
  const { toast } = useToast()
  const { crearCotizacion, calcularCotizacionTemporal, calcularPrecioEspecificaciones, loading: cotizacionLoading } = useCotizaciones()
  const { crearClienteTemporal, loading: clienteLoading } = useClientes()

  const [formData, setFormData] = useState({
    alto: "",
    ancho: "",
    profundidad: "",
    material: "melamina",
    color: "blanco",
    herrajes: "estandar",
    puertas: "2",
    cajones: "3",
    repisas: "4",
    notas: "",
  })

  // Capitalizar primera letra del tipo
  const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calcularPrecioEstimado = () => {
    const alto = parseFloat(formData.alto) || 0
    const ancho = parseFloat(formData.ancho) || 0
    const profundidad = parseFloat(formData.profundidad) || 0
    
    // Cálculo básico del precio basado en dimensiones y materiales
    let precioBase = (alto * ancho * profundidad) / 1000000 * 50000 // 50.000 CLP por m³
    
    // Multiplicadores por material
    const multiplicadoresMaterial = {
      melamina: 1,
      mdf: 1.2,
      "madera-natural": 1.5,
      "maderas-enchapadas": 1.8,
    }
    
    precioBase *= multiplicadoresMaterial[formData.material as keyof typeof multiplicadoresMaterial] || 1
    
    // Multiplicador por herrajes
    const multiplicadoresHerrajes = {
      estandar: 1,
      premium: 1.3,
      "cierre-suave": 1.2,
    }
    
    precioBase *= multiplicadoresHerrajes[formData.herrajes as keyof typeof multiplicadoresHerrajes] || 1
    
    return Math.round(precioBase)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.alto || !formData.ancho || !formData.profundidad) {
      toast({
        title: "Error",
        description: "Por favor completa las medidas básicas",
        variant: "destructive",
      })
      return
    }

    try {
      // Usar el backend para calcular el precio basado en las especificaciones
      const precioData = await calcularPrecioEspecificaciones({
        alto: parseFloat(formData.alto) || 0,
        ancho: parseFloat(formData.ancho) || 0,
        profundidad: parseFloat(formData.profundidad) || 0,
        material: formData.material,
        color: formData.color,
        herrajes: formData.herrajes,
        puertas: formData.puertas,
        cajones: formData.cajones,
        repisas: formData.repisas,
        tipo_mueble: tipo
      })

      const precioEstimado = precioData.precio_estimado

      // Crear cliente temporal con email único
      const timestamp = Date.now()
      const clienteData: ClienteCreate = {
        nombre: "Cliente",
        apellido: "Temporal",
        email: `cliente.temporal.${timestamp}@example.com`,
        telefono: "+56912345678",
        direccion: "Dirección temporal",
      }

      const cliente = await crearClienteTemporal(clienteData)
      
      // Crear cotización temporal con el precio calculado por el backend
      const cotizacionData: CotizacionCreate = {
        fecha: new Date().toISOString(),
        total: precioEstimado,
        cliente_id: cliente.id,
        observaciones: formData.notas,
        items: [
          {
            nombre: `${tipoCapitalizado} a Medida`,
            descripcion: `${formData.alto}cm x ${formData.ancho}cm x ${formData.profundidad}cm - Material: ${formData.material}, Color: ${formData.color}, Herrajes: ${formData.herrajes}, Puertas: ${formData.puertas}, Cajones: ${formData.cajones}, Repisas: ${formData.repisas}`,
            cantidad: 1,
            unidad: "unidad",
            tipo_material: formData.material,
            precio_unitario: precioEstimado,
            subtotal: precioEstimado,
            dimensiones: `${formData.alto}cm x ${formData.ancho}cm x ${formData.profundidad}cm`,
            color_acabado: formData.color,
            herrajes_tipo: formData.herrajes,
            puertas: parseInt(formData.puertas) || 0,
            cajones: parseInt(formData.cajones) || 0,
            repisas: parseInt(formData.repisas) || 0,
          }
        ]
      }

      // Usar el backend para calcular la cotización con desglose detallado
      const cotizacionTemporal = await calcularCotizacionTemporal(cotizacionData)
      console.log('Cotización temporal calculada:', cotizacionTemporal)
      
      // Crear objeto completo con cliente temporal y cotización temporal
      const datosCompletos = {
        cliente_temporal: cliente,
        cotizacion_temporal: cotizacionTemporal.cotizacion_temporal // <-- fix aquí
      }
      
      console.log('Datos completos a guardar:', datosCompletos)
      
      // Guardar datos temporales en sessionStorage para pasarlos a la página de cotización
      sessionStorage.setItem('cotizacionTemporal', JSON.stringify(datosCompletos))
      console.log('Datos guardados en sessionStorage')
      
      toast({
        title: "Cotización calculada",
        description: "Tu cotización ha sido calculada exitosamente",
      })

      // Redirigir a la página de cotización con los datos temporales
      router.push(`/cotizacion?tipo=${tipo}&temporal=true`)
    } catch (error) {
      console.error('Error al calcular cotización:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo calcular la cotización. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
              MVC
            </div>
            <h1 className="text-xl font-semibold hidden sm:block">MVC Proyecto & Diseño Ltda.</h1>
          </div>
          <Link href="/" className="text-gray-600 hover:text-emerald-600 flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Volver al catálogo
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cotización para {tipoCapitalizado} a Medida</h1>

          <div className="bg-white rounded-lg shadow-md p-6 border">
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="medidas" className="mb-8">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="medidas">Medidas</TabsTrigger>
                  <TabsTrigger value="materiales">Materiales</TabsTrigger>
                  <TabsTrigger value="detalles">Detalles</TabsTrigger>
                </TabsList>

                <TabsContent value="medidas" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="alto">Alto (cm)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="px-2 h-6">
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Medida vertical desde la base hasta la parte superior</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input 
                        type="number" 
                        id="alto" 
                        placeholder="Ej: 220" 
                        min="0" 
                        value={formData.alto}
                        onChange={(e) => handleInputChange("alto", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="ancho">Ancho (cm)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="px-2 h-6">
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Medida horizontal de lado a lado</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input 
                        type="number" 
                        id="ancho" 
                        placeholder="Ej: 120" 
                        min="0" 
                        value={formData.ancho}
                        onChange={(e) => handleInputChange("ancho", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Label htmlFor="profundidad">Profundidad (cm)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm" className="px-2 h-6">
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Medida desde el frente hacia atrás</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input 
                        type="number" 
                        id="profundidad" 
                        placeholder="Ej: 60" 
                        min="0" 
                        value={formData.profundidad}
                        onChange={(e) => handleInputChange("profundidad", e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="materiales" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="material-principal">Material Principal</Label>
                      <Select 
                        value={formData.material} 
                        onValueChange={(value) => {
                          handleInputChange("material", value)
                        }}
                      >
                        <SelectTrigger id="material-principal">
                          <SelectValue placeholder="Seleccionar material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="melamina">Melamina</SelectItem>
                          <SelectItem value="mdf">MDF</SelectItem>
                          <SelectItem value="madera-natural">Madera Natural</SelectItem>
                          <SelectItem value="maderas-enchapadas">Maderas Enchapadas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color-material">Color/Acabado</Label>
                      <Select 
                        value={formData.color}
                        onValueChange={(value) => handleInputChange("color", value)}
                      >
                        <SelectTrigger id="color-material">
                          <SelectValue placeholder="Seleccionar color/acabado" />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.material === "melamina" && (
                            <>
                              <SelectItem value="blanco">Blanco</SelectItem>
                              <SelectItem value="gris">Gris</SelectItem>
                              <SelectItem value="nogal">Nogal</SelectItem>
                              <SelectItem value="roble">Roble</SelectItem>
                              <SelectItem value="negro">Negro</SelectItem>
                            </>
                          )}

                          {formData.material === "mdf" && (
                            <>
                              <SelectItem value="blanco">Blanco</SelectItem>
                              <SelectItem value="pintable">Sin acabado (Pintable)</SelectItem>
                              <SelectItem value="lacado">Lacado</SelectItem>
                            </>
                          )}

                          {formData.material === "madera-natural" && (
                            <>
                              <SelectItem value="pino">Pino</SelectItem>
                              <SelectItem value="lenga">Lenga</SelectItem>
                              <SelectItem value="roble">Roble</SelectItem>
                              <SelectItem value="encino">Encino</SelectItem>
                            </>
                          )}

                          {formData.material === "maderas-enchapadas" && (
                            <>
                              <SelectItem value="cerezo">Cerezo</SelectItem>
                              <SelectItem value="nogal">Nogal</SelectItem>
                              <SelectItem value="ebano">Ébano</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="herrajes">Herrajes y Accesorios</Label>
                      <Select 
                        value={formData.herrajes}
                        onValueChange={(value) => handleInputChange("herrajes", value)}
                      >
                        <SelectTrigger id="herrajes">
                          <SelectValue placeholder="Seleccionar herrajes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estandar">Estándar</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="cierre-suave">Con cierre suave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="detalles" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="puertas">Cantidad de puertas</Label>
                      <Select 
                        value={formData.puertas}
                        onValueChange={(value) => handleInputChange("puertas", value)}
                      >
                        <SelectTrigger id="puertas">
                          <SelectValue placeholder="Seleccionar cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sin puertas</SelectItem>
                          <SelectItem value="1">1 puerta</SelectItem>
                          <SelectItem value="2">2 puertas</SelectItem>
                          <SelectItem value="3">3 puertas</SelectItem>
                          <SelectItem value="4">4 puertas</SelectItem>
                          <SelectItem value="5">5+ puertas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cajones">Cantidad de cajones</Label>
                      <Select 
                        value={formData.cajones}
                        onValueChange={(value) => handleInputChange("cajones", value)}
                      >
                        <SelectTrigger id="cajones">
                          <SelectValue placeholder="Seleccionar cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sin cajones</SelectItem>
                          <SelectItem value="1">1 cajón</SelectItem>
                          <SelectItem value="2">2 cajones</SelectItem>
                          <SelectItem value="3">3 cajones</SelectItem>
                          <SelectItem value="4">4 cajones</SelectItem>
                          <SelectItem value="5">5+ cajones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="repisas">Cantidad de repisas/divisiones</Label>
                      <Select 
                        value={formData.repisas}
                        onValueChange={(value) => handleInputChange("repisas", value)}
                      >
                        <SelectTrigger id="repisas">
                          <SelectValue placeholder="Seleccionar cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Sin repisas</SelectItem>
                          <SelectItem value="2">2 repisas</SelectItem>
                          <SelectItem value="4">4 repisas</SelectItem>
                          <SelectItem value="6">6 repisas</SelectItem>
                          <SelectItem value="8">8+ repisas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notas">Observaciones adicionales</Label>
                      <Textarea
                        id="notas"
                        placeholder="Describe cualquier detalle especial que necesites para tu mueble..."
                        rows={4}
                        value={formData.notas}
                        onChange={(e) => handleInputChange("notas", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Imágenes de referencia (opcional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Arrastra y suelta o</p>
                        <Button type="button" variant="outline" size="sm">
                          Seleccionar archivos
                        </Button>
                        <p className="text-xs text-gray-400 mt-2">PNG, JPG o PDF (Máx. 10MB)</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="border-t pt-6 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={cotizacionLoading || clienteLoading}
                >
                  {cotizacionLoading || clienteLoading ? "Creando cotización..." : "Calcular Presupuesto Estimado"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                MVC
              </div>
              <h2 className="text-lg font-semibold">MVC Proyecto & Diseño Ltda.</h2>
            </div>

            <div className="text-gray-300 text-sm md:text-base">
              &copy; {new Date().getFullYear()} MVC Proyecto & Diseño Ltda. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
