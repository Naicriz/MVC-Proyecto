"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  FileText,
  Mail,
  Edit,
  Calendar,
  Download,
  User,
  Phone,
  Package,
  MapPin,
  Check,
  X,
  Eye,
  Flag,
  Pencil,
  Loader2,
  DollarSign,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { apiService } from "@/lib/api"
import { descargarPDFCotizacion } from "@/hooks/use-api"

import type { Cotizacion } from "@/lib/api"
import { Input } from "@/components/ui/input"

export default function DetalleCotizacion() {
  const params = useParams()
  const id = params.id
  const { toast } = useToast()

  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [estado, setEstado] = useState("revisado")
  const [notaInterna, setNotaInterna] = useState("")
  const [precioModificado, setPrecioModificado] = useState(0)
  const [editandoPrecio, setEditandoPrecio] = useState(false)
  const [dialogoContacto, setDialogoContacto] = useState(false)
  const [datosContacto, setDatosContacto] = useState({
    metodo: "telefono",
    resultado: "interesado",
    notas: ""
  })
  const [loadingAccion, setLoadingAccion] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)

  // Cargar datos de la cotización
  useEffect(() => {
    const cargarCotizacion = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const cotizacionData = await apiService.getCotizacion(Number(id))
        setCotizacion(cotizacionData)
        setPrecioModificado(cotizacionData.total)
        
        // Determinar estado basado en observaciones
        const observaciones = cotizacionData.observaciones?.toLowerCase() || ""
        if (observaciones.includes("nuevo")) setEstado("nuevo")
        else if (observaciones.includes("revisado")) setEstado("revisado")
        else if (observaciones.includes("contactado")) setEstado("contactado")
        else if (observaciones.includes("aprobado")) setEstado("aprobado")
        else setEstado("nuevo")
        
      } catch (error) {
        console.error('Error al cargar cotización:', error)
        toast({
          title: "Error",
          description: "No se pudo cargar la cotización",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    cargarCotizacion()
  }, [id, toast])

  // Obtener el color del badge según el estado
  const getStatusBadgeVariant = (estado: string) => {
    switch (estado) {
      case "nuevo":
        return "default"
      case "revisado":
        return "secondary"
      case "contactado":
        return "destructive"
      case "aprobado":
        return "default"
      default:
        return "outline"
    }
  }

  // Traducir el estado al español para mostrar
  const getStatusText = (estado: string) => {
    switch (estado) {
      case "nuevo":
        return "Nuevo"
      case "revisado":
        return "Revisado"
      case "contactado":
        return "Contactado"
      case "aprobado":
        return "Aprobado"
      default:
        return estado
    }
  }

  const handleSubmitNota = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notaInterna.trim() || !cotizacion) return
    
    try {
      setLoadingAccion(true)
      await apiService.agregarNotaInterna(cotizacion.id, notaInterna)
      
      // Recargar la cotización para mostrar la nueva nota
      const cotizacionActualizada = await apiService.getCotizacion(cotizacion.id)
      setCotizacion(cotizacionActualizada)
      setNotaInterna("")
      
      toast({
        title: "Nota guardada",
        description: "La nota interna ha sido guardada exitosamente",
      })
    } catch (error) {
      console.error('Error al guardar nota:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar la nota interna",
        variant: "destructive",
      })
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleUpdatePrice = async () => {
    if (!cotizacion) return
    
    try {
      setLoadingAccion(true)
      await apiService.actualizarPrecioCotizacion(cotizacion.id, precioModificado)
      
      // Recargar la cotización
      const cotizacionActualizada = await apiService.getCotizacion(cotizacion.id)
      setCotizacion(cotizacionActualizada)
      setPrecioModificado(cotizacionActualizada.total)
      setEditandoPrecio(false)
      
      toast({
        title: "Precio actualizado",
        description: "El precio ha sido actualizado exitosamente",
      })
    } catch (error) {
      console.error('Error al actualizar precio:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el precio",
        variant: "destructive",
      })
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleContactarCliente = async () => {
    if (!cotizacion) return
    
    try {
      setLoadingAccion(true)
      await apiService.registrarContactoCliente(cotizacion.id, datosContacto)
      
      // Recargar la cotización
      const cotizacionActualizada = await apiService.getCotizacion(cotizacion.id)
      setCotizacion(cotizacionActualizada)
      setDialogoContacto(false)
      
      toast({
        title: "Contacto registrado",
        description: "El contacto con el cliente ha sido registrado exitosamente",
      })
    } catch (error) {
      console.error('Error al registrar contacto:', error)
      toast({
        title: "Error",
        description: "No se pudo registrar el contacto",
        variant: "destructive",
      })
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleCambiarEstado = async (nuevoEstado: string) => {
    if (!cotizacion) return
    
    try {
      setLoadingAccion(true)
      await apiService.cambiarEstadoCotizacion(cotizacion.id, nuevoEstado)
      
      // Recargar la cotización
      const cotizacionActualizada = await apiService.getCotizacion(cotizacion.id)
      setCotizacion(cotizacionActualizada)
      setEstado(nuevoEstado)
      
      toast({
        title: "Estado actualizado",
        description: `El estado ha sido cambiado a ${nuevoEstado}`,
      })
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado",
        variant: "destructive",
      })
    } finally {
      setLoadingAccion(false)
    }
  }

  const handleMarcarComoValidada = async () => {
    if (!cotizacion) return
    
    try {
      setLoadingAccion(true)
      await apiService.marcarComoValidada(cotizacion.id)
      
      // Recargar la cotización
      const cotizacionActualizada = await apiService.getCotizacion(cotizacion.id)
      setCotizacion(cotizacionActualizada)
      
      toast({
        title: "Cotización validada",
        description: "La cotización ha sido marcada como validada",
      })
    } catch (error) {
      console.error('Error al validar cotización:', error)
      toast({
        title: "Error",
        description: "No se pudo marcar como validada",
        variant: "destructive",
      })
    } finally {
      setLoadingAccion(false)
    }
  }

  // Función para parsear las observaciones y extraer notas internas y contactos
  const parsearObservaciones = (observaciones: string) => {
    if (!observaciones) return []
    
    const lineas = observaciones.split('\n')
    const eventos: Array<{
      fecha: string
      tipo: string
      contenido: string
      icono: React.ReactNode
    }> = []
    
    lineas.forEach(linea => {
      if (linea.includes('NOTA INTERNA:')) {
        const match = linea.match(/\[(.*?)\] NOTA INTERNA: (.*)/)
        if (match) {
          eventos.push({
            fecha: match[1],
            tipo: 'nota',
            contenido: match[2],
            icono: <Pencil className="h-5 w-5 text-blue-500" />
          })
        }
      } else if (linea.includes('CONTACTO:')) {
        const match = linea.match(/\[(.*?)\] CONTACTO: (.*)/)
        if (match) {
          eventos.push({
            fecha: match[1],
            tipo: 'contacto',
            contenido: match[2],
            icono: <Phone className="h-5 w-5 text-green-500" />
          })
        }
      } else if (linea.includes('VALIDADA:')) {
        const match = linea.match(/\[(.*?)\] VALIDADA: (.*)/)
        if (match) {
          eventos.push({
            fecha: match[1],
            tipo: 'validacion',
            contenido: match[2],
            icono: <Check className="h-5 w-5 text-emerald-500" />
          })
        }
      } else if (linea.includes('Precio actualizado:')) {
        const match = linea.match(/\[(.*?)\] Precio actualizado: (.*)/)
        if (match) {
          eventos.push({
            fecha: match[1],
            tipo: 'precio',
            contenido: match[2],
            icono: <DollarSign className="h-5 w-5 text-yellow-500" />
          })
        }
      }
    })
    
    return eventos
  }

  // Abrir modal y cargar datos actuales
  const handleAbrirEditar = () => {
    if (!cotizacion) return
    const item = cotizacion.items[0] || {}
    setEditForm({
      nombre: item.nombre || "",
      dimensiones: item.dimensiones || "",
      tipo_material: item.tipo_material || "",
      color_acabado: item.color_acabado || "",
      herrajes_tipo: item.herrajes_tipo || "",
      cantidad: item.cantidad || 1,
      unidad: item.unidad || "unidad",
      observaciones: cotizacion.observaciones || "",
    })
    setModalEditar(true)
  }

  // Guardar cambios
  const handleGuardarEdicion = async () => {
    if (!cotizacion || !editForm) return
    try {
      setLoadingAccion(true)
      // Solo actualizamos el primer item y los campos principales
      const updateData = {
        observaciones: editForm.observaciones,
        items: [
          {
            nombre: editForm.nombre,
            dimensiones: editForm.dimensiones,
            tipo_material: editForm.tipo_material,
            color_acabado: editForm.color_acabado,
            herrajes_tipo: editForm.herrajes_tipo,
            cantidad: Number(editForm.cantidad) || 1,
            unidad: editForm.unidad,
            descripcion: `${editForm.dimensiones} - Material: ${editForm.tipo_material}, Color: ${editForm.color_acabado}, Herrajes: ${editForm.herrajes_tipo}`,
            precio_unitario: cotizacion.items[0]?.precio_unitario || 0,
            subtotal: cotizacion.items[0]?.subtotal || 0,
          }
        ]
      }
      await apiService.actualizarCotizacion(cotizacion.id, updateData)
      // Recargar cotización
      const cotizacionActualizada = await apiService.getCotizacion(cotizacion.id)
      setCotizacion(cotizacionActualizada)
      setModalEditar(false)
      toast({ title: "Cotización actualizada", description: "Los datos han sido actualizados." })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar la cotización", variant: "destructive" })
    } finally {
      setLoadingAccion(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando cotización...</span>
        </div>
      </div>
    )
  }

  if (!cotizacion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Cotización no encontrada</h2>
          <p className="text-gray-500 mb-4">La cotización con ID {id} no existe</p>
          <Link href="/admin/cotizaciones">
            <Button>Volver a cotizaciones</Button>
          </Link>
        </div>
      </div>
    )
  }

  const primerItem = cotizacion.items[0]
  const fechaFormateada = cotizacion.fecha ? new Date(cotizacion.fecha).toLocaleDateString('es-CL') : 'Sin fecha'

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/cotizaciones" className="text-gray-600 hover:text-emerald-600 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
            <div className="h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
              MVC
            </div>
            <h1 className="text-xl font-semibold hidden sm:block">Detalle de Cotización</h1>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex items-center" onClick={() => descargarPDFCotizacion(cotizacion.id)}>
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAbrirEditar}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Información principal */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow border overflow-hidden mb-8">
              <div className="p-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Cotización #{cotizacion.id}</h2>
                    <Badge variant={getStatusBadgeVariant(estado)}>{getStatusText(estado)}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {fechaFormateada}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {primerItem?.nombre || "Sin especificar"}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Valor Estimado</div>
                  {editandoPrecio ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={precioModificado}
                        onChange={(e) => setPrecioModificado(Number(e.target.value))}
                        className="border rounded px-2 py-1 w-32 text-right font-bold"
                      />
                      <div>
                        <Button size="icon" variant="ghost" onClick={handleUpdatePrice} className="h-7 w-7">
                          <Check className="h-4 w-4 text-emerald-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditandoPrecio(false)}
                          className="h-7 w-7"
                        >
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold">${precioModificado.toLocaleString("es-CL")}</div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditandoPrecio(true)}>
                        <Pencil className="h-3.5 w-3.5 text-gray-400" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <Tabs defaultValue="detalles">
                <TabsList className="px-6 border-b rounded-none gap-4 justify-start">
                  <TabsTrigger value="detalles">Detalles</TabsTrigger>
                  <TabsTrigger value="cliente">Cliente</TabsTrigger>
                  <TabsTrigger value="historial">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="detalles" className="p-6 pt-4">
                  <div className="grid gap-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">Especificaciones del Mueble</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700">Producto</h4>
                          <p>{primerItem?.nombre || "Sin especificar"}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Material Principal</h4>
                          <p>{primerItem?.tipo_material || "Sin especificar"}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Dimensiones</h4>
                          <p>{primerItem?.dimensiones || "Sin especificar"}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Herrajes</h4>
                          <p>{primerItem?.herrajes_tipo || "Sin especificar"}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Color/Acabado</h4>
                          <p>{primerItem?.color_acabado || "Sin especificar"}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Cantidad</h4>
                          <p>{primerItem?.cantidad} {primerItem?.unidad}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-lg mb-4">Desglose de Precios</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <p className="text-gray-600">Costo base</p>
                          <p>${primerItem?.costo_base?.toLocaleString("es-CL") || "0"}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Material ({primerItem?.tipo_material})</p>
                          <p>${primerItem?.costo_material?.toLocaleString("es-CL") || "0"}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Herrajes {primerItem?.herrajes_tipo}</p>
                          <p>${primerItem?.costo_herrajes?.toLocaleString("es-CL") || "0"}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">Instalación</p>
                          <p>${primerItem?.costo_instalacion?.toLocaleString("es-CL") || "0"}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <p className="font-medium">Subtotal</p>
                          <p>${primerItem?.subtotal?.toLocaleString("es-CL") || "0"}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-gray-600">IVA (19%)</p>
                          <p>${primerItem?.iva?.toLocaleString("es-CL") || "0"}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <p>Total</p>
                          <p>${cotizacion.total.toLocaleString("es-CL")}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-lg mb-4">Observaciones del Cliente</h3>
                      <p className="text-gray-600">
                        {cotizacion.observaciones || "Sin observaciones adicionales"}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cliente" className="p-6 pt-4">
                  <div className="grid gap-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4">Información del Cliente</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-700">Nombre</h4>
                            <p>{cotizacion.cliente?.nombre} {cotizacion.cliente?.apellido}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-700">Correo Electrónico</h4>
                            <p>{cotizacion.cliente?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-700">Teléfono</h4>
                            <p>{cotizacion.cliente?.telefono}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-700">Dirección</h4>
                            <p>{cotizacion.cliente?.direccion}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-lg mb-4">Historial de Cliente</h3>
                      <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No hay historial disponible para este cliente</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="historial" className="p-6 pt-4">
                  <div className="grid gap-8">
                    <div className="space-y-6">
                      {/* Eventos del sistema */}
                      {[
                        {
                          fecha: new Date(cotizacion.created_at).toLocaleString('es-CL'),
                          usuario: "Sistema",
                          accion: "Cotización creada",
                          icono: <Package className="h-5 w-5 text-gray-400" />,
                        },
                        ...(cotizacion.updated_at ? [{
                          fecha: new Date(cotizacion.updated_at).toLocaleString('es-CL'),
                          usuario: "Sistema",
                          accion: "Cotización actualizada",
                          icono: <Edit className="h-5 w-5 text-blue-500" />,
                        }] : []),
                      ].map((item, index) => (
                        <div key={`sistema-${index}`} className="flex gap-4">
                          {item.icono}
                          <div>
                            <div className="flex gap-2 items-center font-medium">
                              <span>{item.usuario}</span>
                              <span className="text-gray-400 text-sm">•</span>
                              <span className="text-gray-500 text-sm">{item.fecha}</span>
                            </div>
                            <p className="text-gray-600">{item.accion}</p>
                          </div>
                        </div>
                      ))}

                      {/* Eventos parseados de las observaciones */}
                      {parsearObservaciones(cotizacion.observaciones || "").map((evento, index) => (
                        <div key={`evento-${index}`} className="flex gap-4">
                          {evento.icono}
                          <div>
                            <div className="flex gap-2 items-center font-medium">
                              <span>Admin</span>
                              <span className="text-gray-400 text-sm">•</span>
                              <span className="text-gray-500 text-sm">{evento.fecha}</span>
                            </div>
                            <p className="text-gray-600">{evento.contenido}</p>
                          </div>
                        </div>
                      ))}

                      {parsearObservaciones(cotizacion.observaciones || "").length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No hay eventos adicionales registrados</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Panel lateral */}
          <div className="w-full lg:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={estado} onValueChange={handleCambiarEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cambiar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo</SelectItem>
                    <SelectItem value="revisado">Revisado</SelectItem>
                    <SelectItem value="contactado">Contactado</SelectItem>
                    <SelectItem value="aprobado">Aprobado</SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-1 gap-2">
                  <Button onClick={() => setDialogoContacto(true)} disabled={loadingAccion}>
                    <Phone className="mr-2 h-4 w-4" />
                    Contactar
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" disabled={loadingAccion} onClick={() => descargarPDFCotizacion(cotizacion.id)}>
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notas Internas</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitNota}>
                  <div className="space-y-4">
                    {/* Mostrar notas existentes */}
                    {parsearObservaciones(cotizacion.observaciones || "")
                      .filter(evento => evento.tipo === 'nota')
                      .map((nota, index) => (
                        <div key={`nota-${index}`} className="border rounded-md p-4 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">Admin</div>
                            <div className="text-xs text-gray-500">{nota.fecha}</div>
                          </div>
                          <p className="text-sm mt-1 text-gray-600">
                            {nota.contenido}
                          </p>
                        </div>
                      ))}

                    {parsearObservaciones(cotizacion.observaciones || "")
                      .filter(evento => evento.tipo === 'nota').length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          No hay notas internas registradas
                        </div>
                      )}

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Agregar una nueva nota interna..."
                        value={notaInterna}
                        onChange={(e) => setNotaInterna(e.target.value)}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={!notaInterna.trim() || loadingAccion}
                      >
                        {loadingAccion ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          "Guardar Nota"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Validación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span>Datos del cliente verificados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span>Medidas validadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                    <span>Cálculo de precio verificado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-amber-500" />
                    <span>Verificar disponibilidad de material</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleMarcarComoValidada}
                  disabled={loadingAccion}
                >
                  {loadingAccion ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    "Marcar como Validado"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={dialogoContacto} onOpenChange={setDialogoContacto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contactar al Cliente</DialogTitle>
            <DialogDescription>Registra los detalles del contacto con el cliente.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="metodo-contacto">Método de contacto</Label>
              <Select 
                value={datosContacto.metodo} 
                onValueChange={(value) => setDatosContacto(prev => ({ ...prev, metodo: value }))}
              >
                <SelectTrigger id="metodo-contacto">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telefono">Llamada telefónica</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultado-contacto">Resultado</Label>
              <Select 
                value={datosContacto.resultado}
                onValueChange={(value) => setDatosContacto(prev => ({ ...prev, resultado: value }))}
              >
                <SelectTrigger id="resultado-contacto">
                  <SelectValue placeholder="Seleccionar resultado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interesado">Interesado</SelectItem>
                  <SelectItem value="considerar">En consideración</SelectItem>
                  <SelectItem value="agendado">Visita agendada</SelectItem>
                  <SelectItem value="rechazado">No interesado</SelectItem>
                  <SelectItem value="no-contactado">No contestó</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas-contacto">Notas del contacto</Label>
              <Textarea
                id="notas-contacto"
                placeholder="Detalles de la conversación, acuerdos, siguientes pasos..."
                rows={4}
                value={datosContacto.notas}
                onChange={(e) => setDatosContacto(prev => ({ ...prev, notas: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoContacto(false)} disabled={loadingAccion}>
              Cancelar
            </Button>
            <Button onClick={handleContactarCliente} disabled={loadingAccion}>
              {loadingAccion ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrar Contacto"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edición */}
      <Dialog open={modalEditar} onOpenChange={setModalEditar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cotización</DialogTitle>
            <DialogDescription>Modifica los datos principales de la cotización.</DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Producto</Label>
                  <Input value={editForm.nombre} onChange={e => setEditForm((f: any) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div>
                  <Label>Dimensiones</Label>
                  <Input value={editForm.dimensiones} onChange={e => setEditForm((f: any) => ({ ...f, dimensiones: e.target.value }))} />
                </div>
                <div>
                  <Label>Material</Label>
                  <Input value={editForm.tipo_material} onChange={e => setEditForm((f: any) => ({ ...f, tipo_material: e.target.value }))} />
                </div>
                <div>
                  <Label>Color/Acabado</Label>
                  <Input value={editForm.color_acabado} onChange={e => setEditForm((f: any) => ({ ...f, color_acabado: e.target.value }))} />
                </div>
                <div>
                  <Label>Herrajes</Label>
                  <Input value={editForm.herrajes_tipo} onChange={e => setEditForm((f: any) => ({ ...f, herrajes_tipo: e.target.value }))} />
                </div>
                <div>
                  <Label>Cantidad</Label>
                  <Input type="number" value={editForm.cantidad} onChange={e => setEditForm((f: any) => ({ ...f, cantidad: e.target.value }))} />
                </div>
                <div>
                  <Label>Unidad</Label>
                  <Input value={editForm.unidad} onChange={e => setEditForm((f: any) => ({ ...f, unidad: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Observaciones</Label>
                <Textarea value={editForm.observaciones} onChange={e => setEditForm((f: any) => ({ ...f, observaciones: e.target.value }))} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEditar(false)} disabled={loadingAccion}>Cancelar</Button>
            <Button onClick={handleGuardarEdicion} disabled={loadingAccion}>
              {loadingAccion ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
