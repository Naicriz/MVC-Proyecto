import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowRightCircle } from "lucide-react"
import { ApiTest } from "@/components/api-test"
import { ConnectionDiagnostics } from "@/components/connection-diagnostics"

export default function CatalogoServicios() {
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
          <nav className="hidden md:flex gap-6">
            <Link href="#" className="text-gray-600 hover:text-emerald-600">
              Inicio
            </Link>
            <Link href="#" className="text-gray-600 hover:text-emerald-600">
              Servicios
            </Link>
            <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Admin
            </Link>
          </nav>
          <button className="p-2 md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Muebles a Medida
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Diseñamos y fabricamos muebles personalizados para tu hogar. 
              Desde closets hasta cocinas, creamos espacios únicos que se adaptan a tu estilo y necesidades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/configurar/closet">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                  Cotizar Closet
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link href="/configurar/cocina">
                <button className="bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-600 px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                  Cotizar Cocina
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Closets</h3>
                <p className="text-gray-600">Closets a medida con diseño personalizado y máxima funcionalidad.</p>
                <Link href="/configurar/closet" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mt-4">
                  Cotizar ahora
                  <ArrowRightCircle className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cocinas</h3>
                <p className="text-gray-600">Cocinas modernas y funcionales que optimizan tu espacio.</p>
                <Link href="/configurar/cocina" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mt-4">
                  Cotizar ahora
                  <ArrowRightCircle className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Muebles</h3>
                <p className="text-gray-600">Muebles personalizados para cualquier espacio de tu hogar.</p>
                <Link href="/configurar/mueble" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mt-4">
                  Cotizar ahora
                  <ArrowRightCircle className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

{/*         Diagnóstico de Conexión 
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Diagnóstico de Sistema</h2>
            <div className="flex justify-center">
              <ConnectionDiagnostics />
            </div>
          </div>
        </section> */}
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                  MVC
                </div>
                <h3 className="text-xl font-semibold">MVC Proyecto</h3>
              </div>
              <p className="text-gray-300">
                Especialistas en muebles a medida con más de 10 años de experiencia.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Closets a medida</li>
                <li>Cocinas personalizadas</li>
                <li>Muebles de oficina</li>
                <li>Diseño de interiores</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-300">
                <li>📞 +56 9 1234 5678</li>
                <li>📧 info@mvcproyecto.cl</li>
                <li>📍 Santiago, Chile</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Horarios</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Lunes - Viernes: 9:00 - 18:00</li>
                <li>Sábado: 9:00 - 14:00</li>
                <li>Domingo: Cerrado</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 MVC Proyecto & Diseño Ltda. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
