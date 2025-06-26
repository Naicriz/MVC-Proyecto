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