from sqlalchemy.orm import Session
from app.models.models import Usuario
from app.schemas.schemas import UsuarioCreate
from app.services.auth import get_password_hash
from typing import List, Optional

# Servicios de Usuario
class UsuarioService:
    
    @staticmethod
    def get_usuario_by_id(db: Session, usuario_id: int) -> Optional[Usuario]:
        """Obtener usuario por ID"""
        return db.query(Usuario).filter(Usuario.id == usuario_id).first()
    
    @staticmethod
    def get_usuarios(db: Session, skip: int = 0, limit: int = 100) -> List[Usuario]:
        """Obtener lista de usuarios"""
        return db.query(Usuario).offset(skip).limit(limit).all()
    
    @staticmethod
    def create_usuario(db: Session, usuario: UsuarioCreate) -> Usuario:
        """Crear nuevo usuario"""
        hashed_password = get_password_hash(usuario.password)
        db_usuario = Usuario(
            email=usuario.email,
            nombre=usuario.nombre,
            apellido=usuario.apellido,
            telefono=usuario.telefono,
            hashed_password=hashed_password
        )
        db.add(db_usuario)
        db.commit()
        db.refresh(db_usuario)
        return db_usuario