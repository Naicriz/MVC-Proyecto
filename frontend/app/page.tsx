import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowRightCircle } from "lucide-react"

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
            <Link href="#" className="text-gray-600 hover:text-emerald-600">
              Proyectos
            </Link>
            <Link href="#" className="text-gray-600 hover:text-emerald-600">
              Contacto
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
        <section className="py-10 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Obtén tu Cotización Personalizada</h2>
              <p className="text-gray-600">
                Selecciona el tipo de mueble o servicio que necesitas y configura tus requerimientos para recibir un
                presupuesto estimado inmediato.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Cocinas",
                  description: "Muebles y diseños de cocina personalizados a tu espacio y necesidades.",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Baños",
                  description: "Renovaciones y muebles para baños con diseños modernos y funcionales.",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Closets",
                  description: "Closets y armarios personalizados para maximizar tu espacio de almacenamiento.",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Vanitorios",
                  description: "Muebles para lavamanos y espejos con acabados de alta calidad.",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Estanterías",
                  description: "Estanterías a medida para organizar y mostrar tus pertenencias con estilo.",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Escritorios",
                  description: "Escritorios adaptados a tus necesidades y espacio disponible.",
                  image: "/placeholder.svg?height=200&width=300",
                },
                {
                  title: "Obras Menores",
                  description: "Servicios de remodelación y construcción para pequeños proyectos.",
                  image: "/placeholder.svg?height=200&width=300",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-md border transition hover:shadow-lg"
                >
                  <div className="aspect-[3/2] relative">
                    <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <Link
                      href={`/configurar/${item.title.toLowerCase()}`}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Solicitar cotización
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-emerald-50 py-12 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">¿Por qué elegir MVC Proyecto & Diseño?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Calidad Superior</h3>
                <p className="text-gray-600">
                  Utilizamos materiales de alta calidad y acabados premium para asegurar durabilidad y elegancia.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Entregas a Tiempo</h3>
                <p className="text-gray-600">
                  Nos comprometemos con los plazos establecidos para que disfrutes de tus muebles cuando los necesites.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Diseño Personalizado</h3>
                <p className="text-gray-600">
                  Adaptamos cada proyecto a tus necesidades específicas, espacio y preferencias estéticas.
                </p>
              </div>
            </div>

            <Link
              href="#contacto"
              className="mt-10 inline-flex items-center bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
            >
              Contáctanos para más información
              <ArrowRightCircle className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  MVC
                </div>
                <h2 className="text-lg font-semibold">MVC Proyecto & Diseño Ltda.</h2>
              </div>
              <p className="text-gray-300">
                Especialistas en muebles a medida y obras menores con más de 10 años de experiencia en el mercado.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <p className="mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +56 9 5555 5555
              </p>
              <p className="mb-2 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                contacto@mvcproyectoydiseno.cl
              </p>
              <p className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Av. Ejemplo 123, Santiago, Chile
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Horario de Atención</h3>
              <p className="mb-2">Lunes a Viernes: 9:00 - 18:00</p>
              <p>Sábados: 10:00 - 14:00</p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MVC Proyecto & Diseño Ltda. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
