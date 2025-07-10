from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime


class Usuario(SQLModel, table=True):
    __tablename__ = "usuarios"
    
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    nombre: str = Field(max_length=50)
    apellido: str = Field(max_length=50)
    telefono: str | None = Field(max_length=15)
    hashed_password: str = Field(max_length=255)
    is_active: bool = Field(default=True)
    is_admin: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime | None =  Field(default_factory=datetime.now, nullable=True)

    # Relación con Cotizacion
    # cotizaciones: list["Cotizacion"] = Relationship(back_populates="usuario")

class cotizacion(SQLModel, table=True):
    __tablename__ = "cotizaciones"

    id: int | None = Field(default=None, primary_key=True)
    tipo_servicio: str = Field(max_length=100) #Tipo de mueble o servicio
    medidas:str = Field(max_length=100)#Descripción de las medidas (ej: "2x1x0.5")
    material: str = Field(max_length=50) #Material principal elegido
    estado: str = Field(max_length=50) #Estado actual (ej: 'pendiente', 'aprobada', 'rechazada')
    total : str = Field(max_length=10) #Monto total estimado o confirmado
    fecha_creacion: datetime = Field(default_factory=datetime.now)  # Fecha y hora de creación
    usuario_id: int = Field(foreign_key="usuarios.id")  # Relación con usuario

class catalogo(SQLModel, table=True):
    __tablename__ = "catalogos"

    id: int | None = Field(default=None, primary_key=True) #identificador unico del item catalogo
    tipo_mueble: str = Field(max_length=100)
    material: str = Field(max_length=100)
    precio: str = Field(max_length=100)


class historialdecambios (SQLModel, table=True):
    __tablename__ = "historial_cambios"

    id: int | None = Field(default=None, primary_key=True)
    cotizacion_id: int = Field(foreign_key="cotizaciones.id")
    fecha_cambio: datetime = Field(default_factory=datetime.now)  # Fecha y hora del cambio
    campo_modificado: str = Field(max_length=100)  # Nombre del campo modificado
    valor_anterior: str = Field(max_length=100)  # Valor anterior del campo
    valor_nuevo: str = Field(max_length=100)  # Nuevo valor del campo
    usuario_id: int = Field(foreign_key="usuarios.id")

class reportes (SQLModel, table=True):
    __tablename__ = "reportes"

    id: int | None = Field(default=None, primary_key=True)
    fecha_generacion: datetime = Field(default_factory=datetime.now)
    tipo_reporte: str = Field(max_length=100)  # Tipo de reporte (ej: 'ventas', 'inventario')
    
   

class materiales(SQLModel, table=True):
    __tablename__ = "materiales"
    id: int | None = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100)
    descripcion: str | None = Field(max_length=100)
    precio_base : str = Field(max_length=100)  # Precio base del material
    stock: int = Field(default=0)

class tiposdemuebles(SQLModel, table=True):
    __tablename__ = "tipos_de_muebles"
    
    id: int | None = Field(default=None, primary_key=True)
    nombre: str= Field(max_length=100)
    descripcion: str | None = Field(max_length=255)
    precio_base: str = Field(max_length=100)  # Precio base del tipo de mueble


