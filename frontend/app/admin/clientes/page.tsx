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
  Download,
  Mail,
  Eye,
  Edit,
  Trash2,
  Phone,
  Star,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [selectedClientes, setSelectedClientes] = useState<number[]>([])

  // Datos de ejemplo de clientes
  const clientes = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@email.com",
      telefono: "+56 9 1234 5678",
      direccion: "Av. Principal 123, Las Condes",
      fechaRegistro: "15/03/2023",
      ultimaActividad: "10/05/2023",
      totalCotizaciones: 3,
      totalGastado: 4250000,
      estado: "activo",
      prioridad: "alta",
      rating: 5,
    },
    {
      id: 2,
      nombre: "María Rodríguez",
      email: "maria.rodriguez@email.com",
      telefono: "+56 9 8765 4321",
      direccion: "Calle Secundaria 456, Providencia",
      fechaRegistro: "22/02/2023",
      ultimaActividad: "09/05/2023",
      totalCotizaciones: 2,
      totalGastado: 2540000,
      estado: "activo",
      prioridad: "media",
      rating: 4,
    },
    {
      id: 3,
      nombre: "Carlos Soto",
      email: "carlos.soto@email.com",
      telefono: "+56 9 5555 1234",
      direccion: "Pasaje Los Álamos 789, Ñuñoa",
      fechaRegistro: "08/01/2023",
      ultimaActividad: "08/05/2023",
      totalCotizaciones: 1,
      totalGastado: 780000,
      estado: "activo",
      prioridad: "baja",
      rating: 4,
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      email: "ana.martinez@email.com",
      telefono: "+56 9 9999 8888",
      direccion: "Av. Los Leones 321, Providencia",
      fechaRegistro: "12/12/2022",
      ultimaActividad: "07/05/2023",
      totalCotizaciones: 4,
      totalGastado: 5890000,
      estado: "vip",
      prioridad: "alta",
      rating: 5,
    },
    {
      id: 5,
      nombre: "Pedro González",
      email: "pedro.gonzalez@email.com",
      telefono: "+56 9 7777 6666",
      direccion: "Calle Norte 654, Santiago Centro",
      fechaRegistro: "05/04/2023",
      ultimaActividad: "07/05/2023",
      totalCotizaciones: 1,
      totalGastado: 650000,
      estado: "activo",
      prioridad: "media",
      rating: 3,
    },
    {
      id: 6,
      nombre: "Laura Díaz",
      email: "laura.diaz@email.com",
      telefono: "+56 9 3333 2222",
      direccion: "Av. Apoquindo 987, Las Condes",
      fechaRegistro: "18/11/2022",
      ultimaActividad: "06/05/2023",
      totalCotizaciones: 2,
      totalGastado: 4100000,
      estado: "vip",
      prioridad: "alta",
      rating: 5,
    },
    {
      id: 7,
      nombre: "Fernando Vega",
      email: "fernando.vega@email.com",
      telefono: "+56 9 1111 0000",
      direccion: "Calle Sur 147, Maipú",
      fechaRegistro: "30/03/2023",
      ultimaActividad: "05/05/2023",
      totalCotizaciones: 1,
      totalGastado: 1850000,
      estado: "inactivo",
      prioridad: "media",
      rating: 4,
    },
  ]

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      searchTerm === "" ||
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.telefono.includes(searchTerm)

    const matchesStatus = statusFilter === "todos" || cliente.estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (estado: string) => {
    switch (estado) {
      case "activo":
        return "success"
      case "vip":
        return "warning"
      case "inactivo":
        return "secondary"
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
      case "activo":
        return "Activo"
      case "vip":
        return "VIP"
      case "inactivo":
        return "Inactivo"
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
      setSelectedClientes(filteredClientes.map((c) => c.id))
    } else {
      setSelectedClientes([])
    }
  }

  const handleSelectCliente = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedClientes([...selectedClientes, id])
    } else {
      setSelectedClientes(selectedClientes.filter((cId) => cId !== id))
    }
  }

  const totalGastado = filteredClientes.reduce((sum, cliente) => sum + cliente.totalGastado, 0)
  const totalCotizaciones = filteredClientes.reduce((sum, cliente) => sum + cliente.totalCotizaciones, 0)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

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
                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <FileText className="h-5 w-5" />
                Cotizaciones
              </Link>
            </li>
            <li>
              <Link
                href="/admin/clientes"
                className="flex items-center gap-3 px-4 py-3 rounded-md bg-gray-800 text-white"
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
              <h1 className="text-xl font-semibold">Clientes</h1>
            </div>

            <div className="flex items-center ml-auto gap-4">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <UserPlus className="mr-2 h-4 w-4" />
                Nuevo Cliente
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
              <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Newsletter
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{filteredClientes.length}</div>
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
                    8% más que el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Clientes VIP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{filteredClientes.filter((c) => c.estado === "vip").length}</div>
                  <p className="text-xs text-gray-500 mt-1">Clientes premium</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Valor Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${(totalGastado / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-gray-500 mt-1">CLP en ventas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Promedio por Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${Math.round(totalGastado / filteredClientes.length / 1000)}K
                  </div>
                  <p className="text-xs text-gray-500 mt-1">CLP promedio</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre, email o teléfono"
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select defaultValue="todos" onValueChange={(value) => setStatusFilter(value)}>
                    <SelectTrigger className="w-[150px]">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Estado" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="activo">Activos</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="inactivo">Inactivos</SelectItem>
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
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {selectedClientes.length > 0 && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-md border border-emerald-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-700">{selectedClientes.length} clientes seleccionados</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Enviar Email
                      </Button>
                      <Button size="sm" variant="outline">
                        Exportar Seleccionados
                      </Button>
                      <Button size="sm" variant="outline">
                        Cambiar Estado
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
                        checked={selectedClientes.length === filteredClientes.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead className="text-right">Cotizaciones</TableHead>
                    <TableHead className="text-right">Total Gastado</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Última Actividad</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedClientes.includes(cliente.id)}
                          onCheckedChange={(checked) => handleSelectCliente(cliente.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {cliente.nombre
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{cliente.nombre}</div>
                            <div className="text-sm text-gray-500">ID: {cliente.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            {cliente.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {cliente.telefono}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(cliente.estado)}>{getStatusText(cliente.estado)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityBadgeVariant(cliente.prioridad)}>
                          {getPriorityText(cliente.prioridad)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{cliente.totalCotizaciones}</TableCell>
                      <TableCell className="text-right font-medium">
                        ${cliente.totalGastado.toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStars(cliente.rating)}
                          <span className="text-sm text-gray-500 ml-1">({cliente.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">{cliente.ultimaActividad}</span>
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
                              <Eye className="mr-2 h-4 w-4" />
                              Ver perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Phone className="mr-2 h-4 w-4" />
                              Llamar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Ver Cotizaciones
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

              {filteredClientes.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No se encontraron clientes que coincidan con los filtros.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Mostrando {filteredClientes.length} de {clientes.length} clientes
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
