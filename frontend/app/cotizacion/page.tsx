"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Download, Mail, Phone, ArrowLeft, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VisualizacionCotizacion() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tipo = searchParams.get("tipo") || "mueble"

  // Capitalizar primera letra del tipo
  const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1)

  // Generar número de cotización aleatorio
  const numeroCotizacion = Math.floor(Math.random() * 900000) + 100000

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
              <p className="text-3xl font-bold text-emerald-700">$1.890.000 CLP</p>
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
                      <p>{tipoCapitalizado} a Medida</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Material Principal</h3>
                      <p>Melamina - Nogal</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Dimensiones</h3>
                      <p>220 cm (alto) x 120 cm (ancho) x 60 cm (prof.)</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Herrajes</h3>
                      <p>Premium con cierre suave</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Puertas y Cajones</h3>
                      <p>2 puertas, 3 cajones, 4 repisas</p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700">Tiempo estimado de entrega</h3>
                      <p>15-20 días hábiles</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-4">Desglose</h2>

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
                      <Label htmlFor="nombre-email">Nombre</Label>
                      <Input id="nombre-email" placeholder="Tu nombre" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input id="email" type="email" placeholder="tucorreo@ejemplo.com" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar Cotización
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="descargar" className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                <p className="mb-6 text-gray-600">Descarga tu cotización en formato PDF para guardarla o imprimirla.</p>

                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
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
