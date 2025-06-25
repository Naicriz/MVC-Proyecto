"use client"

import Link from "next/link"
import { useState } from "react"
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
  Plus,
  Download,
  Mail,
  Eye,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

export default function CotizacionesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [selectedCotizaciones, setSelectedCotizaciones] = useState<number[]>([])

  // Datos de ejemplo expandidos
  const cotizaciones = [
    {
      id: 489302,
      fecha: "10/05/2023",
      cliente: "Juan Pérez",
      email: "juan.perez@email.com",
      telefono: "+56 9 1234 5678",
      articulo: "Cocina Personalizada",
      valor: 2450000,
      estado: "nuevo",
      prioridad: "alta",
      fechaVencimiento: "25/05/2023",
    },
    {
      id: 489301,
      fecha: "09/05/2023",
      cliente: "María Rodríguez",
      email: "maria.rodriguez@email.com",
      telefono: "+56 9 8765 4321",
      articulo: "Closet a Medida",
      valor: 1890000,
      estado: "revisado",
      prioridad: "media",
      fechaVencimiento: "24/05/2023",
    },
    {
      id: 489300,
      fecha: "08/05/2023",
      cliente: "Carlos Soto",
      email: "carlos.soto@email.com",
      telefono: "+56 9 5555 1234",
      articulo: "Estantería",
      valor: 780000,
      estado: "contactado",
      prioridad: "baja",
      fechaVencimiento: "23/05/2023",
    },
    {
      id: 489299,
      fecha: "07/05/2023",
      cliente: "Ana Martínez",
      email: "ana.martinez@email.com",
      telefono: "+56 9 9999 8888",
      articulo: "Vanitorios",
      valor: 1250000,
      estado: "aprobado",
      prioridad: "alta",
      fechaVencimiento: "22/05/2023",
    },
    {
      id: 489298,
      fecha: "07/05/2023",
      cliente: "Pedro González",
      email: "pedro.gonzalez@email.com",
      telefono: "+56 9 7777 6666",
      articulo: "Escritorio",
      valor: 650000,
      estado: "nuevo",
      prioridad: "media",
      fechaVencimiento: "22/05/2023",
    },
    {
      id: 489297,
      fecha: "06/05/2023",
      cliente: "Laura Díaz",
      email: "laura.diaz@email.com",
      telefono: "+56 9 3333 2222",
      articulo: "Baño Completo",
      valor: 3250000,
      estado: "contactado",
      prioridad: "alta",
      fechaVencimiento: "21/05/2023",
    },
    {
      id: 489296,
      fecha: "05/05/2023",
      cliente: "Fernando Vega",
      email: "fernando.vega@email.com",
      telefono: "+56 9 1111 0000",
      articulo: "Obras Menores",
      valor: 1850000,
      estado: "revisado",
      prioridad: "media",
      fechaVencimiento: "20/05/2023",
    },
  ]

  const filteredCotizaciones = cotizaciones.filter((cotizacion) => {
    const matchesSearch =
      searchTerm === "" ||
      cotizacion.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotizacion.id.toString().includes(searchTerm) ||
      cotizacion.articulo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || cotizacion.estado === statusFilter

    return matchesSearch && matchesStatus
  })

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

  const getPriorityBadgeVariant = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "destructive"
      case "media":
        return "warning"
      case "baja":
        return "secondary"
      default:
        return "outline"
    }
  }

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

  const getPriorityText = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "Alta"
      case "media":
        return "Media"
      case "baja":
        return "Baja"
      default:
        return prioridad
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCotizaciones(filteredCotizaciones.map((c) => c.id))
    } else {
      setSelectedCotizaciones([])
    }
  }

  const handleSelectCotizacion = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedCotizaciones([...selectedCotizaciones, id])
    } else {
      setSelectedCotizaciones(selectedCotizaciones.filter((cId) => cId !== id))
    }
  }

  const totalValor = filteredCotizaciones.reduce((sum, cotizacion) => sum + cotizacion.valor, 0)

  return (
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
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Grid className="h-5 w-5" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/cotizaciones"
                className="flex items-center gap-3 px-4 py-3 rounded-md bg-gray-800 text-white"
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
            <li>
              <Link
                href="/admin/reportes"
                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <BarChart className="h-5 w-5" />
                Reportes
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white">
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
              <h1 className="text-xl font-semibold">Cotizaciones</h1>
            </div>

            <div className="flex items-center ml-auto gap-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Cotización
              </Button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="h-5 w-5" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 ml-4 rounded-full bg-gray-100 p-1 pr-4">
                    <div className="h-8 w-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-medium">
                      AD
                    </div>
                    <span className="text-sm font-medium">Admin</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                  <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Gestión de Cotizaciones</h1>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Envío Masivo
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Cotizaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{filteredCotizaciones.length}</div>
                  <p className="text-xs text-gray-500 mt-1">En vista actual</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Valor Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${(totalValor / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-gray-500 mt-1">CLP en cotizaciones</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {filteredCotizaciones.filter((c) => c.estado === "nuevo" || c.estado === "revisado").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Aprobadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {filteredCotizaciones.filter((c) => c.estado === "aprobado").length}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Listas para procesar</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente, ID o artículo"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select defaultValue="todos" onValueChange={(value) => setStatusFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Estado" />
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

                  <Select defaultValue="todos">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>

                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedCotizaciones.length > 0 && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-md border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-700">
                      {selectedCotizaciones.length} cotizaciones seleccionadas
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Cambiar Estado
                      </Button>
                      <Button size="sm" variant="outline">
                        Exportar Seleccionadas
                      </Button>
                      <Button size="sm" variant="outline">
                        Enviar Email
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedCotizaciones.length === filteredCotizaciones.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Artículo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vence</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCotizaciones.map((cotizacion) => (
                    <TableRow key={cotizacion.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCotizaciones.includes(cotizacion.id)}
                          onCheckedChange={(checked) => handleSelectCotizacion(cotizacion.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{cotizacion.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{cotizacion.cliente}</div>
                          <div className="text-sm text-gray-500">{cotizacion.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{cotizacion.articulo}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${cotizacion.valor.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(cotizacion.estado)}>
                          {getStatusText(cotizacion.estado)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(cotizacion.prioridad)}>
                          {getPriorityText(cotizacion.prioridad)}
                        </Badge>
                      </TableCell>
                      <TableCell>{cotizacion.fecha}</TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">{cotizacion.fechaVencimiento}</span>
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
                              <Link href={`/admin/cotizaciones/${cotizacion.id}`} className="w-full flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalle
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Descargar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredCotizaciones.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No se encontraron cotizaciones que coincidan con los filtros.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Mostrando {filteredCotizaciones.length} de {cotizaciones.length} cotizaciones
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
