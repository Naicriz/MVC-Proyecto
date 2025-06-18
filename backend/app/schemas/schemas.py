from sqlmodel import SQLModel
from pydantic import EmailStr
from typing import Optional
from datetime import datetime

# Esquemas de Usuario
class UsuarioBase(SQLModel):
    email: EmailStr
    nombre: str
    apellido: str
    telefono: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioUpdate(SQLModel):
    email: Optional[EmailStr] = None
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    telefono: Optional[str] = None
    is_active: Optional[bool] = None

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
    email: Optional[str] = None

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
