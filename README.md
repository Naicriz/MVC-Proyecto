# Proyecto MVC - Sistemas de Información

Proyecto universitario desarrollado en equipo utilizando Next.js, TypeScript y Tailwind CSS.

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o pnpm

### Instalación de Dependencias

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd MVC-Proyecto
```

2. Instala las dependencias:

```bash
# Con npm
npm install

# O con pnpm (recomendado)
pnpm install
```

### Iniciar el Servidor de Desarrollo

```bash
# Con npm
npm run dev

# O con pnpm
pnpm dev
```

El servidor estará disponible en `http://localhost:3000`

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🌿 Flujo de Trabajo con Git

### Configuración Inicial

1. **Configura tu información de Git** (solo la primera vez):

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@ejemplo.com"
```

### Creación de Branches

Usamos la siguiente convención para nombrar branches:

```bash
# Para nuevas funcionalidades
git checkout -b funcionalidad/nombre-de-la-funcionalidad

# Para corrección de errores
git checkout -b correccion/descripcion-del-error

# Para mejoras
git checkout -b mejora/descripcion-de-la-mejora

# Para documentación
git checkout -b docs/descripcion-de-la-documentacion

# Ejemplos:
git checkout -b funcionalidad/login-sistema
git checkout -b correccion/error-formulario-contacto
git checkout -b mejora/optimizar-rendimiento
git checkout -b docs/actualizar-readme
```

### Flujo de Commits

#### 1. Antes de hacer cambios

```bash
# Asegúrate de estar en la rama correcta
git checkout core
git pull origin core

# Crea tu nueva rama
git checkout -b funcionalidad/mi-nueva-funcionalidad
```

#### 2. Realizar cambios y commits

```bash
# Agregar archivos específicos
git add archivo1.tsx archivo2.ts

# O agregar todos los cambios
git add .

# Commit con mensaje descriptivo
git commit -m "tipo: descripción clara de los cambios"
```

#### 3. Convención de Mensajes de Commit

Usamos la siguiente estructura:

```
tipo: descripción breve

[descripción más detallada si es necesaria]
```

**Tipos de commit:**

- `nueva:` Nueva funcionalidad
- `corrige:` Corrección de errores
- `docs:` Cambios en documentación
- `estilo:` Cambios de formato (espacios, comas, etc.)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `config:` Cambios en build, dependencias, etc.

**Ejemplos:**

```bash
git commit -m "nueva: agregar formulario de login"
git commit -m "corrige: corregir validación de email en registro"
git commit -m "docs: actualizar README con instrucciones"
git commit -m "estilo: formatear código con prettier"
git commit -m "refactor: reorganizar componentes de usuario"
git commit -m "test: agregar pruebas para formulario"
git commit -m "config: actualizar dependencias de desarrollo"
```

#### 4. Subir cambios al repositorio

```bash
# Primera vez que subes la rama
git push -u origin funcionalidad/mi-nueva-funcionalidad

# Siguientes pushes
git push
```

### Integración de Cambios

#### 1. Antes de hacer Pull Request

```bash
# Actualizar main(core) local
git checkout core
git pull origin core

# Volver a tu rama y rebasear
git checkout funcionalidad/mi-nueva-funcionalidad
git rebase core

# Si hay conflictos, resolverlos y continuar
git add .
git rebase --continue

# Subir cambios actualizados
git push --force-with-lease
```

#### 2. Crear Pull Request

1. Ve al repositorio en GitHub
2. Crea un Pull Request desde tu rama hacia `core`
3. Describe los cambios realizados
4. Solicita revisión del equipo
5. Espera aprobación antes de hacer merge

### Comandos Útiles

```bash
# Ver estado de archivos
git status

# Ver historial de commits
git log --oneline

# Ver diferencias
git diff

# Cambiar de rama
git checkout nombre-de-rama

# Ver todas las ramas
git branch -a

# Eliminar rama local (después del merge)
git branch -d funcionalidad/mi-funcionalidad

# Eliminar rama remota
git push origin --delete funcionalidad/mi-funcionalidad
```

## 👥 Colaboración en Equipo

### Reglas de Colaboración

1. **Nunca hacer push directo a `core`**
2. **Siempre crear Pull Request para revisión**
3. **Escribir commits descriptivos**
4. **Mantener las ramas actualizadas con `core`**
5. **Eliminar ramas después del merge**
6. **Comunicar cambios importantes al equipo**

### Comunicación

- Usa mensajes de commit claros y descriptivos
- Comenta tu código cuando sea necesario
- Documenta funcionalidades nuevas
- Reporta errores o problemas en GitHub Issues

## 📂 Estructura del Proyecto

```
MVC-Proyecto/
├── app/                    # Páginas y rutas de Next.js
│   ├── admin/             # Páginas de administración
│   ├── cotizacion/        # Páginas de cotización
│   └── configurar/        # Páginas de configuración
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de UI
├── hooks/                # Hooks personalizados
├── lib/                  # Utilidades y helpers
├── public/               # Archivos estáticos
└── styles/               # Estilos globales
```

## 🛡️ Buenas Prácticas

1. **Mantén las ramas pequeñas y enfocadas**
2. **Haz commits frecuentes con mensajes claros**
3. **Prueba tu código antes de hacer commit**
4. **Mantén el código limpio y comentado**
5. **Actualiza esta documentación cuando sea necesario**

---

**Desarrollado por el equipo de estudiantes de la asignatura de Sistemas de Información 2025/S1**
