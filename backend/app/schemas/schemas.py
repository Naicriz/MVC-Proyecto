from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Esquemas de Usuario
class UsuarioBase(BaseModel):
    email: EmailStr
    nombre: str
    apellido: str
    telefono: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioResponse(UsuarioBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Esquemas de Autenticación
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Esquemas de respuesta general
class MessageResponse(BaseModel):
    message: str

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: datetime
