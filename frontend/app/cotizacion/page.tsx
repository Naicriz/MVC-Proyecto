"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Download, Mail, Phone, ArrowLeft, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import { useCotizaciones, descargarPDFCotizacionTemporal } from "@/hooks/use-api"
import type { Cotizacion, CotizacionCreate } from "@/lib/api"

export default function VisualizacionCotizacion() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo") || "mueble"
  const cotizacionId = searchParams.get("id")
  const isTemporal = searchParams.get("temporal") === "true"
  const { toast } = useToast()
  const { crearCotizacion } = useCotizaciones()
  
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [cotizacionTemporal, setCotizacionTemporal] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [enviando, setEnviando] = useState(false)

  // Capitalizar primera letra del tipo
  const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1)

  // Cargar cotización desde el backend si hay ID
  useEffect(() => {
    if (cotizacionId) {
      setLoading(true)
      // Aquí deberías tener un endpoint para obtener una cotización específica
      // Por ahora usamos datos de ejemplo
      setTimeout(() => {
        setCotizacion({
          id: parseInt(cotizacionId),
          fecha: new Date().toISOString(),
          total: 1890000,
          cliente_id: 1,
          observaciones: "Cotización generada desde el formulario",
          created_at: new Date().toISOString(),
          cliente: {
            id: 1,
            nombre: "Cliente",
            apellido: "Temporal",
            email: "cliente@temporal.com",
            telefono: "+56912345678",
            created_at: new Date().toISOString(),
          },
          items: [
            {
              id: 1,
              nombre: `${tipoCapitalizado} a Medida`,
              descripcion: "Mueble personalizado según especificaciones",
              cantidad: 1,
              unidad: "unidad",
              tipo_material: "melamina",
              precio_unitario: 1890000,
              subtotal: 1890000,
              cotizacion_id: parseInt(cotizacionId),
            }
          ]
        })
        setLoading(false)
      }, 1000)
    }
  }, [cotizacionId, tipoCapitalizado])

  // Cargar datos temporales si es una cotización temporal
  useEffect(() => {
    if (isTemporal) {
      // Leer datos temporales del sessionStorage
      const datosTemporalesStr = sessionStorage.getItem('cotizacionTemporal')
      console.log('Datos temporales del sessionStorage:', datosTemporalesStr)
      
      if (datosTemporalesStr) {
        try {
          const datosTemporales = JSON.parse(datosTemporalesStr)
          console.log('Datos temporales parseados:', datosTemporales)
          
          // Verificar que los datos tengan la estructura correcta
          if (datosTemporales.cliente_temporal && datosTemporales.cotizacion_temporal) {
            setCotizacionTemporal(datosTemporales)
          } else {
            console.error('Estructura de datos temporales incorrecta:', datosTemporales)
            throw new Error('Estructura de datos incorrecta')
          }
        } catch (error) {
          console.error('Error al parsear datos temporales:', error)
          // Fallback a datos de ejemplo si hay error
          const datosTemporales = {
            cliente_temporal: {
              id: 1,
              nombre: "Cliente",
              apellido: "Temporal",
              email: "cliente@temporal.com",
              telefono: "+56912345678",
              direccion: "Dirección temporal",
              created_at: new Date().toISOString(),
            },
            cotizacion_temporal: {
              fecha: new Date().toISOString(),
              total: 270000,
              subtotal: 226890,
              iva: 43110,
              items: [
                {
                  nombre: `${tipoCapitalizado} a Medida`,
                  descripcion: "220cm x 120cm x 60cm - Material: madera-natural",
                  cantidad: 1,
                  unidad: "unidad",
                  tipo_material: "madera-natural",
                  precio_unitario: 270000,
                  subtotal: 270000,
                  costo_base: 135000,
                  costo_material: 67500,
                  costo_herrajes: 40500,
                  costo_instalacion: 27000,
                  iva: 51300,
                  dimensiones: "220cm x 120cm x 60cm",
                  color_acabado: "Nogal",
                  herrajes_tipo: "Premium"
                }
              ],
              observaciones: "Cotización temporal calculada"
            }
          }
          setCotizacionTemporal(datosTemporales)
        }
      } else {
        console.log('No se encontraron datos temporales en sessionStorage')
        // Redirigir de vuelta a la página de configuración si no hay datos
        toast({
          title: "Error",
          description: "No se encontraron datos de cotización. Por favor, vuelve a calcular la cotización.",
          variant: "destructive",
        })
        router.push(`/configurar/${tipo}`)
      }
    }
  }, [isTemporal, tipoCapitalizado, router, toast])

  // Generar número de cotización aleatorio si no hay ID
  const numeroCotizacion = cotizacionId || Math.floor(Math.random() * 900000) + 100000

  // Función para manejar el envío de cotización
  const handleEnviarCotizacion = async () => {
    // Validar campos requeridos
    if (!email.trim() || !nombre.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa tu nombre y email",
        variant: "destructive",
      })
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      })
      return
    }

    if (!cotizacionTemporal) {
      toast({
        title: "Error",
        description: "No hay datos de cotización para enviar",
        variant: "destructive",
      })
      return
    }

    console.log('Verificando estructura de cotización temporal:', cotizacionTemporal)

    if (!cotizacionTemporal?.cliente_temporal?.id) {
      console.error('Cliente temporal no encontrado:', cotizacionTemporal?.cliente_temporal)
      toast({
        title: "Error",
        description: "No se encontró el cliente temporal. Por favor, vuelve a calcular la cotización.",
        variant: "destructive",
      })
      return
    }

    if (!cotizacionTemporal?.cotizacion_temporal?.items || !Array.isArray(cotizacionTemporal.cotizacion_temporal.items)) {
      console.error('Items de cotización no encontrados:', cotizacionTemporal?.cotizacion_temporal?.items)
      toast({
        title: "Error",
        description: "No se encontraron los datos de la cotización. Por favor, vuelve a calcular la cotización.",
        variant: "destructive",
      })
      return
    }

    setEnviando(true)
    try {
      console.log('Iniciando proceso de envío de cotización...')
      
      // Preparar datos del cliente real
      const nombreCompleto = nombre.trim()
      const partesNombre = nombreCompleto.split(" ")
      const primerNombre = partesNombre[0] || "Usuario"
      const apellido = partesNombre.slice(1).join(" ") || "Sin Apellido"
      
      const clienteData = {
        nombre: primerNombre,
        apellido: apellido,
        email: email.trim(),
        telefono: telefono.trim() || "+56912345678",
        direccion: direccion.trim() || "Dirección no especificada",
      }

      console.log('Actualizando cliente temporal con datos:', clienteData)

      // Actualizar el cliente temporal con los datos reales del usuario
      const clienteActualizado = await apiService.actualizarClienteTemporal(
        cotizacionTemporal.cliente_temporal.id, 
        clienteData
      )

      console.log('Cliente actualizado:', clienteActualizado)

      // Crear cotización final en la base de datos con datos reales
      const cotizacionData: CotizacionCreate = {
        fecha: new Date().toISOString(),
        total: cotizacionTemporal.cotizacion_temporal.total,
        cliente_id: clienteActualizado.id,
        observaciones: `Cotización oficial enviada por ${nombreCompleto} (${email.trim()}) - ${new Date().toLocaleString()}`,
        items: cotizacionTemporal.cotizacion_temporal.items.map((item: any) => ({
          nombre: item.nombre,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          unidad: item.unidad,
          tipo_material: item.tipo_material,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
          costo_base: item.costo_base,
          costo_material: item.costo_material,
          costo_herrajes: item.costo_herrajes,
          costo_instalacion: item.costo_instalacion,
          iva: item.iva,
          dimensiones: item.dimensiones,
          color_acabado: item.color_acabado,
          herrajes_tipo: item.herrajes_tipo,
          puertas: item.puertas !== undefined && item.puertas !== null ? parseInt(item.puertas) : undefined,
          cajones: item.cajones !== undefined && item.cajones !== null ? parseInt(item.cajones) : undefined,
          repisas: item.repisas !== undefined && item.repisas !== null ? parseInt(item.repisas) : undefined,
        }))
      }

      console.log('Creando cotización final:', cotizacionData)

      const cotizacionFinal = await crearCotizacion(cotizacionData)

      console.log('Cotización final creada:', cotizacionFinal)

      // Limpiar datos temporales
      sessionStorage.removeItem('cotizacionTemporal')

      toast({
        title: "¡Cotización enviada exitosamente!",
        description: `Hola ${primerNombre}, tu cotización ha sido guardada con el ID #${cotizacionFinal.id}. Te contactaremos pronto al correo ${email.trim()}`,
        variant: "default",
      })

      // Redirigir a la página de confirmación con ID real después de un pequeño delay
      setTimeout(() => {
        router.push(`/cotizacion?id=${cotizacionFinal.id}&tipo=${tipo}`)
      }, 1500)
    } catch (error) {
      console.error('Error al enviar cotización:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar la cotización. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setEnviando(false)
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
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-emerald-600 hidden md:flex items-center"
            >
              <Printer className="mr-1 h-4 w-4" />
              Imprimir
            </Button>
            <Link href={`/configurar/${tipo}`} className="text-gray-600 hover:text-emerald-600 flex items-center">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Modificar cotización
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-6 flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold">Tu Presupuesto Estimado</h1>
              <p className="text-gray-500">
                Cotización N° {numeroCotizacion} | {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-center">
              <p className="text-sm text-emerald-700 mb-1">Valor Estimado</p>
              <p className="text-3xl font-bold text-emerald-700">
                ${loading ? "..." : (cotizacionTemporal?.cotizacion_temporal?.total || cotizacion?.total || 1890000).toLocaleString("es-CL")} CLP
              </p>
              <p className="text-xs text-emerald-600 mt-1">*IVA incluido</p>
            </div>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Detalles de Cotización</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Este es un presupuesto estimado basado en la información proporcionada. El valor final puede variar
                    luego de la validación técnica por nuestros especialistas.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Producto</h3>
                      <p>{cotizacionTemporal?.cotizacion_temporal?.items?.[0]?.nombre || `${tipoCapitalizado} a Medida`}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Material Principal</h3>
                      <p>{cotizacionTemporal?.cotizacion_temporal?.items?.[0]?.tipo_material || "Melamina"} - {cotizacionTemporal?.cotizacion_temporal?.items?.[0]?.color_acabado || "Nogal"}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Dimensiones</h3>
                      <p>{cotizacionTemporal?.cotizacion_temporal?.items?.[0]?.dimensiones || "220 cm (alto) x 120 cm (ancho) x 60 cm (prof.)"}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Herrajes</h3>
                      <p>{cotizacionTemporal?.cotizacion_temporal?.items?.[0]?.herrajes_tipo || "Premium con cierre suave"}</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Puertas y Cajones</h3>
                      <p>{cotizacionTemporal?.cotizacion_temporal?.items?.[0]?.puertas ?? "-"} puertas, {cotizacionTemporal?.cotizacion_temporal?.items?.[0]?.cajones ?? "-"} cajones, {cotizacionTemporal?.cotizacion_temporal?.items?.[0]?.repisas ?? "-"} repisas</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Tiempo estimado de entrega</h3>
                      <p>15-20 días hábiles</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Desglose Detallado</h2>

                  <div className="space-y-3">
                    {cotizacionTemporal?.cotizacion_temporal?.items?.map((item: any, index: number) => (
                      <div key={index} className="space-y-3">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-3">{item.nombre}</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <p className="text-gray-600">Dimensiones</p>
                              <p>{item.dimensiones}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">Color/Acabado</p>
                              <p>{item.color_acabado}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">Herrajes</p>
                              <p>{item.herrajes_tipo}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">Puertas</p>
                              <p>{item.puertas}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">Cajones</p>
                              <p>{item.cajones}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">Repisas</p>
                              <p>{item.repisas}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">Costo base</p>
                              <p>${item.costo_base?.toLocaleString("es-CL")}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">Material</p>
                              <p>${item.costo_material?.toLocaleString("es-CL")}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">Herrajes</p>
                              <p>${item.costo_herrajes?.toLocaleString("es-CL")}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">Instalación</p>
                              <p>${item.costo_instalacion?.toLocaleString("es-CL")}</p>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                              <p className="font-medium">Subtotal</p>
                              <p>${item.subtotal?.toLocaleString("es-CL")}</p>
                            </div>
                            <div className="flex justify-between">
                              <p className="text-gray-600">IVA (19%)</p>
                              <p>${item.iva?.toLocaleString("es-CL")}</p>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold">
                              <p>Total Item</p>
                              <p>${(item.subtotal + item.iva)?.toLocaleString("es-CL")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!cotizacionTemporal && (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <p className="text-gray-600">Costo base de {tipoCapitalizado}</p>
                          <p>$950.000</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Material (Melamina Nogal)</p>
                          <p>$380.000</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Herrajes premium</p>
                          <p>$180.000</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Instalación</p>
                          <p>$80.000</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <p className="font-medium">Subtotal</p>
                          <p>$1.590.000</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">IVA (19%)</p>
                          <p>$300.000</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <p>Total</p>
                          <p>$1.890.000</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="email" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">¿Qué deseas hacer con tu cotización?</h2>

            <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 mb-6">
              <TabsTrigger value="email">Enviar por Email</TabsTrigger>
              <TabsTrigger value="descargar">Descargar PDF</TabsTrigger>
              <TabsTrigger value="contacto">Solicitar Contacto</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="mb-4 text-gray-600">Ingresa tu correo electrónico para recibir esta cotización.</p>

                                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre-email">Nombre completo *</Label>
                        <Input 
                          id="nombre-email" 
                          placeholder="Tu nombre completo" 
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico *</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="tucorreo@ejemplo.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input 
                          id="telefono" 
                          type="tel" 
                          placeholder="+56 9 XXXX XXXX" 
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input 
                          id="direccion" 
                          placeholder="Tu dirección (opcional)" 
                          value={direccion}
                          onChange={(e) => setDireccion(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleEnviarCotizacion}
                        disabled={enviando || !email.trim() || !nombre.trim()}
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        {enviando ? "Enviando..." : "Enviar Cotización"}
                      </Button>
                    </div>
                  </div>
              </div>
            </TabsContent>

            <TabsContent value="descargar" className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <p className="mb-6 text-gray-600">Descarga tu cotización en formato PDF para guardarla o imprimirla.</p>

                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => {
  if (cotizacionTemporal) {
    descargarPDFCotizacionTemporal(
      cotizacionTemporal.cotizacion_temporal,
      cotizacionTemporal.cliente_temporal,
      cotizacionTemporal.cotizacion_temporal.items
    )
  } else {
    toast({
      title: "Error",
      description: "No hay datos de cotización temporal para descargar.",
      variant: "destructive",
    })
  }
}}>
                  <Download className="mr-2 h-5 w-5" />
                  Descargar PDF
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contacto" className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <p className="mb-4 text-gray-600">Completa tus datos para que un especialista se contacte contigo.</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre-contacto">Nombre completo</Label>
                      <Input id="nombre-contacto" placeholder="Tu nombre completo" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" type="tel" placeholder="+56 9 XXXX XXXX" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-contacto">Correo electrónico</Label>
                    <Input id="email-contacto" type="email" placeholder="tucorreo@ejemplo.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="horario">Horario preferido de contacto</Label>
                    <Input id="horario" placeholder="Ej: Lunes a Viernes, de 9:00 a 18:00" />
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Phone className="mr-2 h-4 w-4" />
                      Solicitar Contacto
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {isTemporal && (
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Cotización Temporal</h3>
              <p className="text-blue-700 text-sm">
                Esta es una cotización temporal calculada automáticamente. Para recibir una cotización oficial y 
                guardarla en nuestro sistema, completa tus datos y presiona "Enviar Cotización".
              </p>
            </div>
          )}

          <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
            <h3 className="font-semibold text-amber-800 mb-2">Nota importante</h3>
            <p className="text-amber-700 text-sm">
              Esta cotización es un valor estimado basado en la información proporcionada. El valor final podría variar
              después de una evaluación técnica y/o visita en terreno. La validez de esta cotización es de 15 días a
              partir de la fecha de emisión.
            </p>
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
