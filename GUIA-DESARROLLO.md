# 📚 Guía de Desarrollo - Next.js para Principiantes

Esta guía te ayudará a entender cómo trabajar con Next.js, crear páginas, componentes y usar las herramientas del proyecto.

## 📖 Conceptos Básicos

### ¿Qué es Next.js?
Next.js es un framework de React que nos permite crear aplicaciones web. Piensa en él como una estructura que ya tiene todo configurado para que puedas enfocarte en crear tu aplicación.

### ¿Qué es un Componente?
Un componente es como un bloque de LEGO reutilizable. Puedes crear un botón una vez y usarlo en muchas partes de tu aplicación.

### ¿Qué es una Página?
Una página es lo que ve el usuario cuando visita una URL específica de tu sitio web.

## 🏗️ Estructura del Proyecto

```
app/                    # Aquí van las páginas
├── page.tsx           # Página principal (/)
├── admin/             # Páginas de admin (/admin)
│   └── page.tsx       # (/admin)
└── cotizacion/        # Páginas de cotización (/cotizacion)
    └── page.tsx       # (/cotizacion)

components/            # Aquí van los componentes reutilizables
├── ui/               # Componentes de interfaz (botones, inputs, etc.)
└── mi-componente.tsx # Tus componentes personalizados
```

## 📄 Cómo Crear una Nueva Página

### 1. Página Simple
Crea un archivo en la carpeta `app/` con el nombre `page.tsx`:

```tsx
// app/mi-nueva-pagina/page.tsx
export default function MiNuevaPagina() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Mi Nueva Página</h1>
      <p>Esta es mi primera página en Next.js</p>
    </div>
  )
}
```

### 2. Página con Parámetros
Para crear una página que reciba parámetros (como `/usuario/123`):

```tsx
// app/usuario/[id]/page.tsx
interface Props {
  params: {
    id: string
  }
}

export default function PaginaUsuario({ params }: Props) {
  return (
    <div className="container mx-auto p-4">
      <h1>Usuario ID: {params.id}</h1>
    </div>
  )
}
```

### 3. Página con Múltiples Secciones

```tsx
// app/servicios/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaginaServicios() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold">Nuestros Servicios</h1>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Servicio 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Descripción del servicio</p>
            <Button className="mt-4">Solicitar</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
```

## 🧩 Cómo Crear Componentes

### 1. Componente Básico

```tsx
// components/saludo.tsx
interface Props {
  nombre: string
  edad?: number // El ? significa que es opcional
}

export function Saludo({ nombre, edad }: Props) {
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2>¡Hola {nombre}!</h2>
      {edad && <p>Tienes {edad} años</p>}
    </div>
  )
}
```

**Cómo usarlo:**
```tsx
import { Saludo } from "@/components/saludo"

export default function MiPagina() {
  return (
    <div>
      <Saludo nombre="Juan" edad={25} />
      <Saludo nombre="María" />
    </div>
  )
}
```

### 2. Componente con Estado (Interactivo)

```tsx
// components/contador.tsx
"use client" // Necesario para componentes interactivos

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Contador() {
  const [numero, setNumero] = useState(0)

  const incrementar = () => {
    setNumero(numero + 1)
  }

  const decrementar = () => {
    setNumero(numero - 1)
  }

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <Button onClick={decrementar} variant="outline">-</Button>
      <span className="text-xl font-bold">{numero}</span>
      <Button onClick={incrementar}>+</Button>
    </div>
  )
}
```

### 3. Componente de Formulario

```tsx
// components/formulario-contacto.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function FormularioContacto() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")

  const enviarFormulario = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Datos:", { nombre, email })
    // Aquí enviarías los datos al servidor
  }

  return (
    <form onSubmit={enviarFormulario} className="space-y-4 p-4 border rounded-lg">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
        />
      </div>

      <Button type="submit">Enviar</Button>
    </form>
  )
}
```

## 🎨 Usando Componentes UI Existentes

El proyecto ya tiene componentes listos para usar:

### Botones
```tsx
import { Button } from "@/components/ui/button"

<Button>Botón Normal</Button>
<Button variant="outline">Botón con Borde</Button>
<Button variant="destructive">Botón Rojo</Button>
<Button size="lg">Botón Grande</Button>
```

### Cards (Tarjetas)
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Título de la Tarjeta</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Contenido de la tarjeta</p>
  </CardContent>
</Card>
```

### Inputs
```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Ingresa tu email" />
</div>
```

## 🔗 Navegación entre Páginas

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MiPagina() {
  return (
    <div>
      {/* Link simple */}
      <Link href="/contacto">Ir a Contacto</Link>

      {/* Link con estilo de botón */}
      <Link href="/servicios">
        <Button>Ver Servicios</Button>
      </Link>

      {/* Link con parámetros */}
      <Link href="/usuario/123">Ver Usuario 123</Link>
    </div>
  )
}
```

## 🎨 Estilos con Tailwind CSS

Tailwind CSS te permite dar estilos usando clases:

### Clases Básicas
```tsx
<div className="p-4">Padding en todos los lados</div>
<div className="mt-4">Margen superior</div>
<div className="bg-blue-500">Fondo azul</div>
<div className="text-white">Texto blanco</div>
<div className="rounded-lg">Bordes redondeados</div>
<div className="shadow-md">Sombra</div>
```

### Layout
```tsx
<div className="flex items-center justify-center">
  Centrado horizontal y vertical
</div>

<div className="grid grid-cols-2 gap-4">
  <div>Columna 1</div>
  <div>Columna 2</div>
</div>
```

### Responsive
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  Ancho completo en móvil, mitad en tablet, un tercio en desktop
</div>
```

## 📝 Consejos y Buenas Prácticas

### 1. Organización de Archivos
- Usa nombres descriptivos: `formulario-contacto.tsx` en lugar de `form.tsx`
- Agrupa componentes relacionados en carpetas
- Mantén los componentes pequeños y enfocados

### 2. Nomenclatura
- Componentes: `PascalCase` (ej: `MiComponente`)
- Archivos: `kebab-case` (ej: `mi-componente.tsx`)
- Variables: `camelCase` (ej: `miVariable`)

### 3. Uso de Props
```tsx
// ✅ Bueno - Define los tipos
interface Props {
  titulo: string
  opcional?: boolean
}

// ❌ Malo - Sin tipos
function MiComponente(props) {
  // ...
}
```

### 4. Componentes Reutilizables
```tsx
// ✅ Bueno - Flexible y reutilizable
interface Props {
  children: React.ReactNode
  color?: "blue" | "red" | "green"
}

export function Alerta({ children, color = "blue" }: Props) {
  return (
    <div className={`p-4 rounded border-l-4 border-${color}-500`}>
      {children}
    </div>
  )
}

// Uso:
<Alerta color="red">Error en el formulario</Alerta>
<Alerta>Información general</Alerta>
```

## 🚀 Próximos Pasos

1. **Crea tu primera página**: Sigue el ejemplo de página simple
2. **Experimenta con componentes**: Crea un componente básico
3. **Usa los componentes UI**: Prueba botones, cards e inputs
4. **Añade navegación**: Conecta tus páginas con Links
5. **Estiliza con Tailwind**: Experimenta con las clases CSS

## 🆘 Problemas Comunes

### Error: "use client" faltante
**Problema**: El componente usa hooks (useState, useEffect) pero no funciona
**Solución**: Añade `"use client"` al inicio del archivo

### Error de importación
**Problema**: `Cannot resolve '@/components/...'`
**Solución**: Verifica que el archivo exista y la ruta sea correcta

### Estilos no se aplican
**Problema**: Las clases de Tailwind no funcionan
**Solución**: Revisa que el nombre de la clase esté bien escrito

## 📚 Recursos Útiles

- [Documentación Next.js](https://nextjs.org/docs)
- [Tailwind CSS Cheatsheet](https://tailwindcomponents.com/cheatsheet/)
- [Shadcn/ui Components](https://ui.shadcn.com/docs/components/accordion)

---

¡Recuerda: la práctica hace al maestro! Empieza con algo simple y ve añadiendo complejidad gradualmente. 🚀
