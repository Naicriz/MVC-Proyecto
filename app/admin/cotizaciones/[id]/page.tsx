"use client"

import { Label } from "@/components/ui/label"

import type React from "react"

import { useState } from "react"
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

export default function DetalleCotizacion() {
  const params = useParams()
  const id = params.id

  const [estado, setEstado] = useState("revisado")
  const [notaInterna, setNotaInterna] = useState("")
  const [precioModificado, setPrecioModificado] = useState(1890000)
  const [editandoPrecio, setEditandoPrecio] = useState(false)
  const [dialogoContacto, setDialogoContacto] = useState(false)

  // Obtener el color del badge según el estado
  const getStatusBadgeVariant = (estado: string) => {
    switch (estado) {
      case "nuevo":
        return "default"
      case "revisado":
        return "secondary"
      case "contactado":
        return "warning"
      case "aprobado":
        return "success"
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

  const handleSubmitNota = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar la nota interna
    alert("Nota interna guardada")
  }

  const handleUpdatePrice = () => {
    setEditandoPrecio(false)
    // Aquí iría la lógica para actualizar el precio
    alert("Precio actualizado")
  }

  const handleContactarCliente = () => {
    setDialogoContacto(false)
    setEstado("contactado")
    // Aquí iría la lógica para registrar el contacto
    alert("Cliente contactado")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-emerald-600 flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
            <div className="h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
              MVC
            </div>
            <h1 className="text-xl font-semibold hidden sm:block">Detalle de Cotización</h1>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Descargar PDF
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Enviar al Cliente
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
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
                    <h2 className="text-2xl font-bold">Cotización #{id}</h2>
                    <Badge variant={getStatusBadgeVariant(estado)}>{getStatusText(estado)}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      09/05/2023
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Closet a Medida
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
                          <p>Closet a Medida</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Material Principal</h4>
                          <p>Melamina - Nogal</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Dimensiones</h4>
                          <p>220 cm (alto) x 120 cm (ancho) x 60 cm (prof.)</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Herrajes</h4>
                          <p>Premium con cierre suave</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Puertas y Cajones</h4>
                          <p>2 puertas, 3 cajones, 4 repisas</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700">Acabado</h4>
                          <p>Color nogal, tirador oculto</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-lg mb-4">Desglose de Precios</h3>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <p className="text-gray-600">Costo base de Closet</p>
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
                          <p>${precioModificado.toLocaleString("es-CL")}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-lg mb-4">Observaciones del Cliente</h3>
                      <p className="text-gray-600">
                        Necesito que el closet tenga un espacio específico para colgar trajes largos en el lado
                        izquierdo. También quisiera incluir un organizador de zapatos en la parte inferior derecha.
                        Prefiero que los cajones tengan divisores internos. Si es posible, me gustaría que las puertas
                        tuvieran espejos por dentro.
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
                            <p>María Rodríguez</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-700">Correo Electrónico</h4>
                            <p>maria.rodriguez@ejemplo.com</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-700">Teléfono</h4>
                            <p>+56 9 8765 4321</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-700">Dirección</h4>
                            <p>Av. Principal 123, Las Condes, Santiago</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium text-lg mb-4">Historial de Cliente</h3>

                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded p-4 border">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">Cotización #489270</h4>
                            <Badge variant="outline">Aprobado</Badge>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <div className="text-gray-600">12/03/2023</div>
                            <div>Escritorio a Medida</div>
                            <div className="font-medium">$650.000</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded p-4 border">
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">Cotización #489152</h4>
                            <Badge variant="outline">Aprobado</Badge>
                          </div>
                          <div className="flex gap-4 text-sm">
                            <div className="text-gray-600">24/01/2023</div>
                            <div>Estantería para Libros</div>
                            <div className="font-medium">$780.000</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="historial" className="p-6 pt-4">
                  <div className="grid gap-8">
                    <div className="space-y-6">
                      {[
                        {
                          fecha: "09/05/2023 16:45",
                          usuario: "Sistema",
                          accion: "Cotización generada automáticamente",
                          icono: <Package className="h-5 w-5 text-gray-400" />,
                        },
                        {
                          fecha: "09/05/2023 17:32",
                          usuario: "Admin",
                          accion: "Cotización revisada y validada",
                          icono: <Eye className="h-5 w-5 text-emerald-500" />,
                        },
                        {
                          fecha: "10/05/2023 09:15",
                          usuario: "Admin",
                          accion: "Se ajustó el precio de $1.950.000 a $1.890.000",
                          icono: <Edit className="h-5 w-5 text-blue-500" />,
                        },
                        {
                          fecha: "10/05/2023 09:20",
                          usuario: "Admin",
                          accion: "Se agregó nota interna sobre disponibilidad de material",
                          icono: <FileText className="h-5 w-5 text-orange-500" />,
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex gap-4">
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
                <Select value={estado} onValueChange={setEstado}>
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

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => setDialogoContacto(true)}>
                    <Phone className="mr-2 h-4 w-4" />
                    Contactar
                  </Button>
                  <Button variant="outline">
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
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
                    <div className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">Admin</div>
                        <div className="text-xs text-gray-500">10/05/2023 09:20</div>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">
                        Verificar disponibilidad de melamina en nogal. Hay posible retraso de 5 días en stock.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Agregar una nueva nota interna..."
                        value={notaInterna}
                        onChange={(e) => setNotaInterna(e.target.value)}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={!notaInterna.trim()}
                      >
                        Guardar Nota
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

                <Button className="w-full">Marcar como Validado</Button>
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
              <Select defaultValue="telefono">
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
              <Select defaultValue="interesado">
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoContacto(false)}>
              Cancelar
            </Button>
            <Button onClick={handleContactarCliente}>Registrar Contacto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
