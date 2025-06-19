# Proyecto MVC - Sistemas de Información

Proyecto universitario Full-Stack desarrollado en equipo utilizando:

- **Frontend**: Next.js, TypeScript y Tailwind CSS
- **Backend**: FastAPI, SQLModel y PostgreSQL

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- Python (versión 3.13 o superior)
- npm o pnpm
- Docker y Docker Compose (opcional)

### Instalación de Dependencias

#### Frontend (Next.js)

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

#### Backend (FastAPI)

1. Ve a la carpeta del backend:

```bash
cd backend
```

2. **Opción A: Con Poetry (Recomendado para desarrollo)**

```bash
# Instalar Poetry si no lo tienes
curl -sSL https://install.python-poetry.org | python3 -

# O con pip
pip install poetry

# Instalar dependencias del proyecto
poetry install

# Activar el entorno virtual de Poetry
poetry shell

# O ejecutar comandos con Poetry sin activar el shell
poetry run uvicorn app.main:app --reload
```

**Opción B: Con pip y venv (Tradicional)**

```bash
# Crea un entorno virtual de Python
python -m venv venv

# Activar entorno virtual
# En macOS/Linux:
source venv/bin/activate
# En Windows:
venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

3. Configura las variables de entorno:

```bash
cp .env.example .env
# Edita el archivo .env con tu configuración
```

### Iniciar los Servidores

#### Frontend (puerto 3000)

```bash
# Desde la raíz del proyecto
npm run dev

# O con pnpm
pnpm dev
```

#### Backend (puerto 8000)

**Con Poetry:**

```bash
# Desde la carpeta backend
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# O con FastAPI CLI (más moderno)
poetry run fastapi dev app/main.py

# O si tienes el shell activado
poetry shell
fastapi dev app/main.py
```

**Con pip/venv:**

```bash
# Desde la carpeta backend (con el entorno virtual activado)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# O con FastAPI CLI
fastapi dev app/main.py
```

#### Con Docker (Ambos servicios)

```bash
# Desde la raíz del proyecto
docker-compose up --build
```

**URLs disponibles:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs
- Base de datos PostgreSQL: localhost:5432
- Redis: localhost:6379
- Adminer (DB Interface): http://localhost:8080

## 🛠️ Scripts Disponibles

### Frontend

- `npm run dev` - Inicia el servidor de desarrollo del frontend
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

### Backend

*[!] Esto es a elección pueden usar Poetry, pip/venv o Docker.*

**Con Poetry:**

- `poetry run fastapi dev app/main.py` - Inicia el servidor de desarrollo (recomendado)
- `poetry run uvicorn app.main:app --reload` - Inicia el servidor de desarrollo (alternativo)
- `poetry run python -m pytest` - Ejecuta las pruebas
- `poetry add <paquete>` - Agregar nueva dependencia
- `poetry add --group dev <paquete>` - Agregar dependencia de desarrollo
- `poetry show` - Ver dependencias instaladas
- `poetry update` - Actualizar dependencias

**Con pip/venv:**

- `fastapi dev app/main.py` - Inicia el servidor de desarrollo (recomendado)
- `uvicorn app.main:app --reload` - Inicia el servidor de desarrollo del backend
- `python -m pytest` - Ejecuta las pruebas
- `alembic upgrade head` - Ejecuta migraciones de base de datos

### Docker

- `docker-compose up` - Inicia todos los servicios
- `docker-compose down` - Detiene todos los servicios
- `docker-compose build` - Reconstruye las imágenes

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
├── frontend/              # Aplicación Next.js
│   ├── app/              # Páginas y rutas de Next.js
│   │   ├── admin/        # Páginas de administración
│   │   ├── cotizacion/   # Páginas de cotización
│   │   └── configurar/   # Páginas de configuración
│   ├── components/       # Componentes reutilizables
│   │   └── ui/          # Componentes de UI
│   ├── hooks/           # Hooks personalizados
│   ├── lib/             # Utilidades y helpers
│   ├── public/          # Archivos estáticos
│   └── styles/          # Estilos globales
├── backend/              # API FastAPI
│   ├── app/
│   │   ├── main.py      # Aplicación principal
│   │   ├── models/      # Modelos de base de datos
│   │   ├── endpoints/   # Endpoints de la API
│   │   ├── schemas/     # Esquemas Pydantic
│   │   ├── services/    # Lógica de negocio
│   │   └── database/    # Configuración de BD
│   ├── pyproject.toml   # Configuración Poetry
│   ├── requirements.txt # Dependencias Python (fallback)
│   └── Dockerfile       # Imagen Docker del backend
├── docker-compose.yml    # Orquestación de servicios
├── README.md            # Documentación principal
└── GUIA-DESARROLLO.md   # Guía para principiantes
```

## 🛡️ Buenas Prácticas

1. **Mantén las ramas pequeñas y enfocadas**
2. **Haz commits frecuentes con mensajes claros**
3. **Prueba tu código antes de hacer commit**
4. **Mantén el código limpio y comentado**
5. **Actualiza esta documentación cuando sea necesario**

---

**Desarrollado por el equipo de estudiantes de la asignatura de Sistemas de Información 2025/S1**
