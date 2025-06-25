"use client"

import Link from "next/link"
import { useState } from "react"
import {
  LogOut,
  Grid,
  Users,
  FileText,
  BarChart,
  Bell,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Target,
  Clock,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportesPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("mes")

  // Datos de ejemplo para los reportes
  const ventasPorMes = [
    { mes: "Ene", ventas: 12500000, cotizaciones: 45 },
    { mes: "Feb", ventas: 15800000, cotizaciones: 52 },
    { mes: "Mar", ventas: 18200000, cotizaciones: 61 },
    { mes: "Abr", ventas: 16900000, cotizaciones: 58 },
    { mes: "May", ventas: 21300000, cotizaciones: 67 },
  ]

  const productosMasVendidos = [
    { producto: "Cocinas", ventas: 8500000, porcentaje: 35, cantidad: 12 },
    { producto: "Closets", ventas: 6200000, porcentaje: 26, cantidad: 18 },
    { producto: "Baños", ventas: 4800000, porcentaje: 20, cantidad: 8 },
    { producto: "Escritorios", ventas: 2900000, porcentaje: 12, cantidad: 15 },
    { producto: "Estanterías", ventas: 1700000, porcentaje: 7, cantidad: 22 },
  ]

  const estadisticasConversion = [
    { estado: "Nuevas", cantidad: 45, porcentaje: 100, color: "bg-blue-500" },
    { estado: "Revisadas", cantidad: 38, porcentaje: 84, color: "bg-yellow-500" },
    { estado: "Contactadas", cantidad: 32, porcentaje: 71, color: "bg-orange-500" },
    { estado: "Aprobadas", cantidad: 19, porcentaje: 42, color: "bg-green-500" },
  ]

  const clientesTop = [
    { nombre: "Ana Martínez", totalGastado: 5890000, cotizaciones: 4, ultimaCompra: "07/05/2023" },
    { nombre: "Laura Díaz", totalGastado: 4100000, cotizaciones: 2, ultimaCompra: "06/05/2023" },
    { nombre: "Juan Pérez", totalGastado: 4250000, cotizaciones: 3, ultimaCompra: "10/05/2023" },
    { nombre: "María Rodríguez", totalGastado: 2540000, cotizaciones: 2, ultimaCompra: "09/05/2023" },
    { nombre: "Fernando Vega", totalGastado: 1850000, cotizaciones: 1, ultimaCompra: "05/05/2023" },
  ]

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
                className="flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              >
                <Users className="h-5 w-5" />
                Clientes
              </Link>
            </li>
            <li>
              <Link href="/admin/reportes" className="flex items-center gap-3 px-4 py-3 rounded-md bg-gray-800 text-white">
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
              <h1 className="text-xl font-semibold">Reportes</h1>
            </div>

            <div className="flex items-center ml-auto gap-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar Reporte
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
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
              <h1 className="text-2xl font-bold">Reportes y Análisis</h1>
              <div className="flex gap-2">
                <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                  <SelectTrigger className="w-[150px]">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semana">Esta semana</SelectItem>
                    <SelectItem value="mes">Este mes</SelectItem>
                    <SelectItem value="trimestre">Este trimestre</SelectItem>
                    <SelectItem value="año">Este año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="ventas">Ventas</TabsTrigger>
                <TabsTrigger value="productos">Productos</TabsTrigger>
                <TabsTrigger value="clientes">Clientes</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Ingresos Totales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">$21.3M</div>
                      <div className="flex items-center text-sm mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                        <span className="text-emerald-500">+15.2%</span>
                        <span className="text-gray-500 ml-1">vs mes anterior</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Cotizaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">67</div>
                      <div className="flex items-center text-sm mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                        <span className="text-emerald-500">+8.1%</span>
                        <span className="text-gray-500 ml-1">vs mes anterior</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                        <Target className="mr-2 h-4 w-4" />
                        Tasa de Conversión
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">42%</div>
                      <div className="flex items-center text-sm mt-1">
                        <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                        <span className="text-emerald-500">+3.2%</span>
                        <span className="text-gray-500 ml-1">vs mes anterior</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Tiempo Promedio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">3.2d</div>
                      <div className="flex items-center text-sm mt-1">
                        <TrendingDown className="h-3 w-3 text-emerald-500 mr-1" />
                        <span className="text-emerald-500">-12%</span>
                        <span className="text-gray-500 ml-1">tiempo respuesta</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Ventas por Mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {ventasPorMes.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 text-sm font-medium">{item.mes}</div>
                              <div className="flex-1">
                                <Progress 
                                  value={(item.ventas / Math.max(...ventasPorMes.map(v => v.ventas))) * 100} 
                                  className="h-2"
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${(item.ventas / 1000000).toFixed(1)}M</div>
                              <div className="text-sm text-gray-500">{item.cotizaciones} cotiz.</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Embudo de Conversión</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {estadisticasConversion.map((item, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{item.estado}</span>
                              <span className="text-sm text-gray-500">{item.cantidad} ({item.porcentaje}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${item.color}`}
                                style={{ width: `${item.porcentaje}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="ventas" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Evolución de Ventas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-end justify-between gap-2 p-4">
                        {ventasPorMes.map((item, index) => (
                          <div key={index} className="flex flex-col items-center gap-2">
                            <div 
                              className="bg-emerald-500 rounded-t w-12 min-h-[20px]"
                              style={{ 
                                height: `${(item.ventas / Math.max(...ventasPorMes.map(v => v.ventas))) * 200}px` 
                              }}
                            ></div>
                            <div className="text-xs text-gray-500">{item.mes}</div>
                            <div className="text-xs font-medium">${(item.ventas / 1000000).toFixed(1)}M</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Métricas de Ventas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Venta Promedio</span>
                          <span className="font-medium">$1.8M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Mejor Mes</span>
                          <span className="font-medium">Mayo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Crecimiento</span>
                          <span className="font-medium text-emerald-600">+15.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Meta Mensual</span>
                          <span className="font-medium">$20M</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="text-sm text-gray-500 mb-2">Progreso Meta Mensual</div>
                        <Progress value={85} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">85% completado</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="productos" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Productos Más Vendidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {productosMasVendidos.map((producto, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{producto.producto}</span>
                              <div className="text-right">
                                <div className="font-medium">${(producto.ventas / 1000000).toFixed(1)}M</div>
                                <div className="text-sm text-gray-500">{producto.cantidad} unidades</div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 bg-emerald-500 rounded-full"
                                style={{ width: `${producto.porcentaje}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500">{producto.porcentaje}% del total</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Análisis de Productos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Categorías con Mayor Demanda</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Muebles de Cocina</span>
                            <span className="text-sm font-medium">35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Closets y Armarios</span>
                            <span className="text-sm font-medium">26%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Muebles de Baño</span>
                            <span className="text-sm font-medium">20%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Materiales Preferidos</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Melamina</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">MDF</span>
                            <span className="text-sm font-medium">30%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Madera Natural</span>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Tendencias</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            <span>Closets modulares +25%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            <span>Acabados mate +18%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-3 w-3 text-red-500" />
                            <span>Escritorios tradicionales -8%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="clientes" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Clientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {clientesTop.map((cliente, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-medium text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium">{cliente.nombre}</div>
                                <div className="text-sm text-gray-500">{cliente.cotizaciones} cotizaciones</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${(cliente.totalGastado / 1000000).toFixed(1)}M</div>
                              <div className="text-sm text-gray-500">{cliente.ultimaCompra}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Análisis de Clientes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Segmentación por Valor</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Clientes VIP ($3M)</span>
                              <span className="text-sm font-medium">15%</span>
                            </div>
                            <Progress value={15} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Clientes Premium ($1M-$3M)</span>
                              <span className="text-sm font-medium">35%</span>
                            </div>
                            <Progress value={35} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Clientes Regulares ($1M)</span>
                              <span className="text-sm font-medium">50%</span>
                            </div>
                            <Progress value={50} className="h-2" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Métricas de Retención</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Tasa de Retención</span>
                            <span className="font-medium">78%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Clientes Recurrentes</span>
                            <span className="font-medium">42%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Tiempo Promedio Cliente</span>
                            <span className="font-medium">18 meses</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Valor Promedio Vida</span>
                            <span className="font-medium">$2.8M</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Satisfacción</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Rating Promedio</span>
                            <span className="font-medium">4.3/5</span>
                          </div>
                          <Progress value={86} className="h-2" />
                          <div className="text-xs text-gray-500">86% de satisfacción</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
