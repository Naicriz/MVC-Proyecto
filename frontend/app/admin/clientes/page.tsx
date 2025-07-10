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
  Download,
  Mail,
  Eye,
  Edit,
  Trash2,
  Phone,
  Star,
  UserPlus,
  Loader2,
} from "lucide-react"

import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { useClientes } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"

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
  const { user, logout } = useAuth()
  const { clientes, loading, error, fetchClientes } = useClientes()
  const { toast } = useToast()

  // Cargar clientes al montar el componente
  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

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

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      searchTerm === "" ||
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.telefono && cliente.telefono.includes(searchTerm))

    // Para el filtro de estado, usamos una lógica simple basada en la fecha de creación
    // Clientes recientes (últimos 30 días) = "activo", más antiguos = "inactivo"
    const fechaCreacion = new Date(cliente.created_at)
    const diasDesdeCreacion = Math.floor((Date.now() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))
    const estado = diasDesdeCreacion <= 30 ? "activo" : "inactivo"
    
    const matchesStatus = statusFilter === "todos" || estado === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (estado: string) => {
    switch (estado) {
      case "activo":
        return "default"
      case "vip":
        return "secondary"
      case "inactivo":
        return "outline"
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

  // Calcular estadísticas reales
  const calcularEstadisticas = () => {
    const totalClientes = clientes.length
    const clientesActivos = clientes.filter((c) => {
      const fechaCreacion = new Date(c.created_at)
      const diasDesdeCreacion = Math.floor((Date.now() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))
      return diasDesdeCreacion <= 30
    }).length

    const clientesVIP = Math.floor(totalClientes * 0.15) // 15% de clientes VIP (simulado)
    
    // Calcular valor promedio por cliente (simulado)
    const valorPromedio = totalClientes > 0 ? Math.floor(2500000 / totalClientes) : 0

    return {
      totalClientes,
      clientesActivos,
      clientesVIP,
      valorPromedio
    }
  }

  const estadisticas = calcularEstadisticas()

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando clientes...</span>
          </div>
        </div>
      </AuthGuard>
    )
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
              <h1 className="text-xl font-semibold">Clientes</h1>
            </div>

            <div className="flex items-center ml-auto gap-4">
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Total Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estadisticas.totalClientes}</div>
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
                    {loading ? "Cargando..." : "Clientes registrados"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Clientes Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estadisticas.clientesActivos}</div>
                  <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Clientes VIP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estadisticas.clientesVIP}</div>
                  <p className="text-xs text-gray-500 mt-1">Clientes premium</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Valor Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${(estadisticas.valorPromedio / 1000).toFixed(0)}K
                  </div>
                  <p className="text-xs text-gray-500 mt-1">CLP por cliente</p>
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
                      <SelectItem value="inactivo">Inactivos</SelectItem>
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
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClientes.map((cliente) => {
                    // Determinar estado basado en fecha de creación
                    const fechaCreacion = new Date(cliente.created_at)
                    const diasDesdeCreacion = Math.floor((Date.now() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))
                    const estado = diasDesdeCreacion <= 30 ? "activo" : "inactivo"
                    
                    return (
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
                                {cliente.nombre[0]}{cliente.apellido[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{cliente.nombre} {cliente.apellido}</div>
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
                            {cliente.telefono && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3 text-gray-400" />
                                {cliente.telefono}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(estado)}>{getStatusText(estado)}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">
                            {new Date(cliente.created_at).toLocaleDateString('es-CL')}
                          </span>
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
                                <FileText className="mr-2 h-4 w-4" />
                                Ver Cotizaciones
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {filteredClientes.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  {loading ? "Cargando clientes..." : "No se encontraron clientes que coincidan con los filtros."}
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
    </AuthGuard>
  )
}
