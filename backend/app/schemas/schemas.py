from sqlmodel import SQLModel
from pydantic import EmailStr
from datetime import datetime

# Por si acaso, el Optional no se usa en Python 3.13, por lo que se usa el tipo: str | None


# Esquemas de Usuario
class UsuarioBase(SQLModel):
    email: EmailStr
    nombre: str
    apellido: str
    telefono: str | None = None


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioUpdate(SQLModel):
    email: EmailStr | None = None
    nombre: str | None = None
    apellido: str | None = None
    telefono: str | None = None
    is_active: bool | None = None


class UsuarioResponse(UsuarioBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime


# Esquemas de Autenticación
class Token(SQLModel):
    access_token: str
    token_type: str
    user: dict | None = None


class TokenData(SQLModel):
    email: str | None = None


class LoginRequest(SQLModel):
    email: EmailStr
    password: str


# Esquemas de respuesta general
class MessageResponse(SQLModel):
    message: str


class HealthResponse(SQLModel):
    status: str
    message: str
    timestamp: datetime


# Esquemas de Cliente
class ClienteBase(SQLModel):
    nombre: str
    apellido: str
    email: EmailStr
    telefono: str | None = None
    direccion: str | None = None


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(SQLModel):
    nombre: str | None = None
    apellido: str | None = None
    email: EmailStr | None = None
    telefono: str | None = None
    direccion: str | None = None


class ClienteResponse(ClienteBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None


# Esquemas de ItemCotizacion
class ItemCotizacionBase(SQLModel):
    nombre: str
    descripcion: str | None = None
    cantidad: float
    unidad: str
    tipo_material: str
    precio_unitario: float
    subtotal: float
    # Campos adicionales para desglose detallado
    costo_base: float | None = None
    costo_material: float | None = None
    costo_herrajes: float | None = None
    costo_instalacion: float | None = None
    iva: float | None = None
    dimensiones: str | None = None
    color_acabado: str | None = None
    herrajes_tipo: str | None = None
    puertas: int | None = None
    cajones: int | None = None
    repisas: int | None = None


class ItemCotizacionCreate(ItemCotizacionBase):
    pass


class ItemCotizacionUpdate(SQLModel):
    nombre: str | None = None
    descripcion: str | None = None
    cantidad: float | None = None
    unidad: str | None = None
    tipo_material: str | None = None
    precio_unitario: float | None = None
    subtotal: float | None = None


class ItemCotizacionResponse(ItemCotizacionBase):
    id: int
    cotizacion_id: int


# Esquemas de Cotizacion
class CotizacionBase(SQLModel):
    fecha: datetime | None = None
    total: float
    cliente_id: int
    observaciones: str | None = None


class CotizacionCreate(CotizacionBase):
    items: list[ItemCotizacionCreate]


class CotizacionUpdate(SQLModel):
    fecha: datetime | None = None
    total: float | None = None
    cliente_id: int | None = None
    observaciones: str | None = None
    items: list[ItemCotizacionUpdate] | None = None


class CotizacionResponse(CotizacionBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None
    cliente: ClienteResponse | None = None
    items: list[ItemCotizacionResponse] = []


# Esquemas para acciones de cotizaciones
class EstadoUpdate(SQLModel):
    estado: str


class PrecioUpdate(SQLModel):
    nuevo_precio: float


class NotaInterna(SQLModel):
    nota: str


class DatosContacto(SQLModel):
    metodo: str
    resultado: str
    notas: str | None = None


class ValidacionResponse(SQLModel):
    message: str
    cotizacion: CotizacionResponse
