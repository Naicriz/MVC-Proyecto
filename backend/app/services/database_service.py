from sqlmodel import Session, select

from app.services.auth import get_password_hash
from app.models.models import Usuario
from app.schemas.schemas import UsuarioCreate, UsuarioUpdate


class UsuarioService:
    """Servicio para manejar operaciones de usuario en la base de datos"""

    @staticmethod
    def get_usuario_by_id(db: Session, usuario_id: int) -> Usuario | None:
        """Obtener usuario por ID"""
        return db.get(Usuario, usuario_id)
    
    @staticmethod
    def get_usuario_by_email(db: Session, email: str) -> Usuario | None:
        """Obtener usuario por email"""
        statement = select(Usuario).where(Usuario.email == email)
        return db.exec(statement).first()
    
    @staticmethod
    def get_usuarios(db: Session, skip: int = 0, limit: int = 100) -> list[Usuario]:
        """Obtener lista de usuarios"""
        statement = select(Usuario).offset(skip).limit(limit)
        return db.exec(statement).all()
    
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
    
    @staticmethod
    def update_usuario(db: Session, usuario_id: int, usuario_update: UsuarioUpdate) -> Usuario | None:
        """Actualizar usuario"""
        db_usuario = db.get(Usuario, usuario_id)
        if not db_usuario:
            return None
        
        usuario_data = usuario_update.model_dump(exclude_unset=True)
        for field, value in usuario_data.items():
            setattr(db_usuario, field, value)
        
        db.add(db_usuario)
        db.commit()
        db.refresh(db_usuario)
        return db_usuario
