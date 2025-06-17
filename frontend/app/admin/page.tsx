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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  // Datos de ejemplo para las cotizaciones
  const cotizaciones = [
    {
      id: 489302,
      fecha: "10/05/2023",
      cliente: "Juan Pérez",
      articulo: "Cocina Personalizada",
      valor: 2450000,
      estado: "nuevo",
    },
    {
      id: 489301,
      fecha: "09/05/2023",
      cliente: "María Rodríguez",
      articulo: "Closet a Medida",
      valor: 1890000,
      estado: "revisado",
    },
    {
      id: 489300,
      fecha: "08/05/2023",
      cliente: "Carlos Soto",
      articulo: "Estantería",
      valor: 780000,
      estado: "contactado",
    },
    {
      id: 489299,
      fecha: "07/05/2023",
      cliente: "Ana Martínez",
      articulo: "Vanitorios",
      valor: 1250000,
      estado: "aprobado",
    },
    {
      id: 489298,
      fecha: "07/05/2023",
      cliente: "Pedro González",
      articulo: "Escritorio",
      valor: 650000,
      estado: "nuevo",
    },
    {
      id: 489297,
      fecha: "06/05/2023",
      cliente: "Laura Díaz",
      articulo: "Baño Completo",
      valor: 3250000,
      estado: "contactado",
    },
    {
      id: 489296,
      fecha: "05/05/2023",
      cliente: "Fernando Vega",
      articulo: "Obras Menores",
      valor: 1850000,
      estado: "revisado",
    },
  ]

  const filteredCotizaciones = cotizaciones.filter((cotizacion) => {
    // Filtro por término de búsqueda
    const matchesSearch =
      searchTerm === "" ||
      cotizacion.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cotizacion.id.toString().includes(searchTerm) ||
      cotizacion.articulo.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por estado
    const matchesStatus = statusFilter === "todos" || cotizacion.estado === statusFilter

    return matchesSearch && matchesStatus
  })

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
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Cotizaciones Totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">248</div>
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
                    12% más que el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Cotizaciones Nuevas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">42</div>
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
                    8% más que la semana pasada
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Monto Total (Mes)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$28.5M</div>
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
                    15% más que el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Tasa de Conversión</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">42%</div>
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
                    3% más que el último trimestre
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
                  {filteredCotizaciones.map((cotizacion) => (
                    <TableRow key={cotizacion.id}>
                      <TableCell className="font-medium">{cotizacion.id}</TableCell>
                      <TableCell>{cotizacion.fecha}</TableCell>
                      <TableCell>{cotizacion.cliente}</TableCell>
                      <TableCell>{cotizacion.articulo}</TableCell>
                      <TableCell className="text-right">${cotizacion.valor.toLocaleString("es-CL")}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(cotizacion.estado)}>
                          {getStatusText(cotizacion.estado)}
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
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                            <DropdownMenuItem>Generar PDF</DropdownMenuItem>
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
          </div>
        </main>
      </div>
    </div>
  )
}
