from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime


class Usuario(SQLModel, table=True):
    # __tablename__ no es necesario con SQLModel
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    nombre: str = Field(max_length=50)
    apellido: str = Field(max_length=50)
    telefono: str | None = Field(max_length=15)
    hashed_password: str = Field(max_length=255)
    is_active: bool = Field(default=True)
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime | None = Field(default_factory=datetime.now, nullable=True)
    # Relación con Cotizacion (opcional, si quieres ver cotizaciones creadas por admin)
    # cotizaciones: list["Cotizacion"] = Relationship(back_populates="usuario")


from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime


class Cliente(SQLModel, table=True):
    # __tablename__ no es necesario con SQLModel
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100)
    apellido: str = Field(max_length=100)
    email: str = Field(index=True, unique=False)
    telefono: str | None = Field(max_length=20)
    direccion: str | None = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime | None = Field(default_factory=datetime.now, nullable=True)
    # Relación con Cotizacion
    cotizaciones: list["Cotizacion"] = Relationship(back_populates="cliente")


class Cotizacion(SQLModel, table=True):
    # __tablename__ no es necesario con SQLModel
    id: int | None = Field(default=None, primary_key=True)
    fecha: datetime = Field(default_factory=datetime.now)
    total: float = Field(default=0)
    cliente_id: int = Field(foreign_key="cliente.id")
    observaciones: str | None = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime | None = Field(default_factory=datetime.now, nullable=True)
    # Relaciones
    cliente: "Cliente" = Relationship(back_populates="cotizaciones")
    items: list["ItemCotizacion"] = Relationship(back_populates="cotizacion")


class ItemCotizacion(SQLModel, table=True):
    # __tablename__ no es necesario con SQLModel
    id: int | None = Field(default=None, primary_key=True)
    cotizacion_id: int = Field(foreign_key="cotizacion.id")
    nombre: str = Field(max_length=100)
    descripcion: str | None = Field(default=None, max_length=255)
    cantidad: float = Field(default=1)
    unidad: str = Field(max_length=20)
    tipo_material: str = Field(max_length=50)
    precio_unitario: float = Field(default=0)
    subtotal: float = Field(default=0)
    # Campos adicionales para desglose detallado
    costo_base: float | None = Field(default=None)
    costo_material: float | None = Field(default=None)
    costo_herrajes: float | None = Field(default=None)
    costo_instalacion: float | None = Field(default=None)
    iva: float | None = Field(default=None)
    dimensiones: str | None = Field(default=None, max_length=100)
    color_acabado: str | None = Field(default=None, max_length=50)
    herrajes_tipo: str | None = Field(default=None, max_length=50)
    puertas: int | None = Field(default=None)
    cajones: int | None = Field(default=None)
    repisas: int | None = Field(default=None)
    # Relación
    cotizacion: "Cotizacion" = Relationship(back_populates="items")
