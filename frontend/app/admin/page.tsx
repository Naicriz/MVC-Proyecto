"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  LogOut,
  Grid,
  Users,
  FileText,
  BarChart,
  Bell,
} from "lucide-react"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCotizaciones } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { apiService } from "@/lib/api"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const { cotizaciones, loading, error, fetchCotizaciones } = useCotizaciones()
  const { toast } = useToast()
  const { user, logout } = useAuth()

  const [modalEditar, setModalEditar] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [modalEliminar, setModalEliminar] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [loadingAccion, setLoadingAccion] = useState(false)

  // Cargar cotizaciones al montar el componente
  useEffect(() => {
    fetchCotizaciones()
  }, [fetchCotizaciones])

  // Mostrar error si ocurre
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const filteredCotizaciones = cotizaciones.filter((cotizacion) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      searchTerm === "" ||
      (cotizacion.cliente?.nombre && cotizacion.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cotizacion.cliente?.apellido && cotizacion.cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cotizacion.id.toString().includes(searchTerm) ||
      (cotizacion.items[0]?.nombre && cotizacion.items[0].nombre.toLowerCase().includes(searchTerm.toLowerCase()))

    // Filtro por estado (usando observaciones como estado temporal)
    const estado = cotizacion.observaciones?.includes("nuevo") ? "nuevo" : 
                   cotizacion.observaciones?.includes("revisado") ? "revisado" : 
                   cotizacion.observaciones?.includes("contactado") ? "contactado" : 
                   cotizacion.observaciones?.includes("aprobado") ? "aprobado" : "nuevo"
    const matchesStatus = statusFilter === "todos" || estado === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calcular estadísticas reales
  const calcularEstadisticas = () => {
    const totalCotizaciones = cotizaciones.length
    const cotizacionesNuevas = cotizaciones.filter((c) => {
      const estado = c.observaciones?.includes("nuevo") ? "nuevo" : 
                     c.observaciones?.includes("revisado") ? "revisado" : 
                     c.observaciones?.includes("contactado") ? "contactado" : 
                     c.observaciones?.includes("aprobado") ? "aprobado" : "nuevo"
      return estado === "nuevo"
    }).length

    const montoTotal = cotizaciones.reduce((sum, c) => sum + c.total, 0)
    
    // Calcular tasa de conversión (cotizaciones aprobadas / total)
    const cotizacionesAprobadas = cotizaciones.filter((c) => {
      const estado = c.observaciones?.includes("nuevo") ? "nuevo" : 
                     c.observaciones?.includes("revisado") ? "revisado" : 
                     c.observaciones?.includes("contactado") ? "contactado" : 
                     c.observaciones?.includes("aprobado") ? "aprobado" : "nuevo"
      return estado === "aprobado"
    }).length

    const tasaConversion = totalCotizaciones > 0 ? Math.round((cotizacionesAprobadas / totalCotizaciones) * 100) : 0

    return {
      totalCotizaciones,
      cotizacionesNuevas,
      montoTotal,
      tasaConversion
    }
  }

  const estadisticas = calcularEstadisticas()

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

  // Abrir modal de edición
  const handleAbrirEditar = (cotizacion: any) => {
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
      precio_unitario: item.precio_unitario || 0,
      subtotal: item.subtotal || 0,
    })
    setEditId(cotizacion.id)
    setModalEditar(true)
  }

  // Guardar cambios de edición
  const handleGuardarEdicion = async () => {
    if (!editForm || !editId) return
    try {
      setLoadingAccion(true)
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
            precio_unitario: editForm.precio_unitario || 0,
            subtotal: editForm.subtotal || 0,
          }
        ]
      }
      await apiService.actualizarCotizacion(editId, updateData)
      await fetchCotizaciones()
      setModalEditar(false)
      toast({ title: "Cotización actualizada", description: "Los datos han sido actualizados." })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar la cotización", variant: "destructive" })
    } finally {
      setLoadingAccion(false)
    }
  }

  // Abrir modal de eliminación
  const handleAbrirEliminar = (id: number) => {
    setDeleteId(id)
    setModalEliminar(true)
  }

  // Eliminar cotización
  const handleEliminar = async () => {
    if (!deleteId) return
    try {
      setLoadingAccion(true)
      await apiService.eliminarCotizacion(deleteId)
      await fetchCotizaciones()
      setModalEliminar(false)
      toast({ title: "Cotización eliminada", description: "La cotización ha sido eliminada." })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo eliminar la cotización", variant: "destructive" })
    } finally {
      setLoadingAccion(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                MVC
              </div>
              <h1 className="text-xl font-semibold">Panel Admin</h1>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              <li>
                <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-md bg-gray-800 text-white">
                  <Grid className="h-5 w-5" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/cotizaciones"
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <FileText className="h-5 w-5" />
                  Cotizaciones
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/clientes"
                  className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  <Users className="h-5 w-5" />
                  Clientes
                </Link>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-300 hover:text-white"
              onClick={logout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Cerrar sesión
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Top header */}
          <header className="bg-white border-b sticky top-0 z-10 w-full">
            <div className="container p-4 flex justify-between items-center">
              <div className="md:hidden flex items-center gap-2">
                <div className="h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                  MVC
                </div>
                <h1 className="text-xl font-semibold">Panel Admin</h1>
              </div>

              <div className="flex items-center ml-auto">
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Bell className="h-5 w-5" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 ml-4 rounded-full bg-gray-100 p-1 pr-4">
                      <div className="h-8 w-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-medium">
                        {user ? `${user.nombre[0]}${user.apellido[0]}` : 'AD'}
                      </div>
                      <span className="text-sm font-medium">
                        {user ? `${user.nombre} ${user.apellido}` : 'Admin'}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Perfil</DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

              {/* Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Cotizaciones Totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{estadisticas.totalCotizaciones}</div>
                    <p className="text-xs text-emerald-500 flex items-center mt-1">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18 15L12 9L6 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {loading ? "Cargando..." : "Cotizaciones en el sistema"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Cotizaciones Nuevas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{estadisticas.cotizacionesNuevas}</div>
                    <p className="text-xs text-emerald-500 flex items-center mt-1">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18 15L12 9L6 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Requieren revisión
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Monto Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${(estadisticas.montoTotal / 1000000).toFixed(1)}M</div>
                    <p className="text-xs text-emerald-500 flex items-center mt-1">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18 15L12 9L6 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      CLP en cotizaciones
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Tasa de Conversión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{estadisticas.tasaConversion}%</div>
                    <p className="text-xs text-emerald-500 flex items-center mt-1">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M18 15L12 9L6 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Aprobadas vs total
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Cotizaciones recientes */}
              <h2 className="text-xl font-semibold mb-4">Cotizaciones Recientes</h2>

              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por cliente, ID o artículo"
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Select defaultValue="todos" onValueChange={(value) => setStatusFilter(value)}>
                      <SelectTrigger className="w-[180px]">
                        <div className="flex items-center">
                          <Filter className="mr-2 h-4 w-4 text-gray-500" />
                          <SelectValue placeholder="Filtrar por estado" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los estados</SelectItem>
                        <SelectItem value="nuevo">Nuevos</SelectItem>
                        <SelectItem value="revisado">Revisados</SelectItem>
                        <SelectItem value="contactado">Contactados</SelectItem>
                        <SelectItem value="aprobado">Aprobados</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" size="icon">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Artículo</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCotizaciones.slice(0, 10).map((cotizacion) => {
                      const estado = cotizacion.observaciones?.includes("nuevo") ? "nuevo" : 
                                     cotizacion.observaciones?.includes("revisado") ? "revisado" : 
                                     cotizacion.observaciones?.includes("contactado") ? "contactado" : 
                                     cotizacion.observaciones?.includes("aprobado") ? "aprobado" : "nuevo"
                      
                      return (
                        <TableRow key={cotizacion.id}>
                          <TableCell className="font-medium">{cotizacion.id}</TableCell>
                          <TableCell>{cotizacion.fecha ? new Date(cotizacion.fecha).toLocaleDateString() : "N/A"}</TableCell>
                          <TableCell>{cotizacion.cliente ? `${cotizacion.cliente.nombre} ${cotizacion.cliente.apellido}` : "N/A"}</TableCell>
                          <TableCell>{cotizacion.items[0]?.nombre || "N/A"}</TableCell>
                          <TableCell className="text-right">${cotizacion.total.toLocaleString("es-CL")}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(estado)}>
                              {getStatusText(estado)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Link href={`/admin/cotizaciones/${cotizacion.id}`} className="w-full">
                                    Ver detalle
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAbrirEditar(cotizacion)}>Editar</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAbrirEliminar(cotizacion.id)} className="text-red-600">Eliminar</DropdownMenuItem>
                                <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                                <DropdownMenuItem>Generar PDF</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {filteredCotizaciones.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    {loading ? "Cargando cotizaciones..." : "No se encontraron cotizaciones que coincidan con los filtros."}
                  </div>
                )}

                {filteredCotizaciones.length > 10 && (
                  <div className="p-4 border-t text-center">
                    <Link href="/admin/cotizaciones">
                      <Button variant="outline">
                        Ver todas las cotizaciones ({cotizaciones.length})
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
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
                  <label className="block text-sm font-medium mb-1">Producto</label>
                  <Input value={editForm.nombre} onChange={e => setEditForm((f: any) => ({ ...f, nombre: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dimensiones</label>
                  <Input value={editForm.dimensiones} onChange={e => setEditForm((f: any) => ({ ...f, dimensiones: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Material</label>
                  <Input value={editForm.tipo_material} onChange={e => setEditForm((f: any) => ({ ...f, tipo_material: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color/Acabado</label>
                  <Input value={editForm.color_acabado} onChange={e => setEditForm((f: any) => ({ ...f, color_acabado: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Herrajes</label>
                  <Input value={editForm.herrajes_tipo} onChange={e => setEditForm((f: any) => ({ ...f, herrajes_tipo: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad</label>
                  <Input type="number" value={editForm.cantidad} onChange={e => setEditForm((f: any) => ({ ...f, cantidad: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unidad</label>
                  <Input value={editForm.unidad} onChange={e => setEditForm((f: any) => ({ ...f, unidad: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Observaciones</label>
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
      {/* Modal de eliminación */}
      <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cotización</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas eliminar esta cotización? Esta acción no se puede deshacer.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEliminar(false)} disabled={loadingAccion}>Cancelar</Button>
            <Button onClick={handleEliminar} disabled={loadingAccion} variant="destructive">
              {loadingAccion ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthGuard>
  )
}
