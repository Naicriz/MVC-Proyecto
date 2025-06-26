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
