from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from app.database.database import get_db
from app.schemas.schemas import  UsuarioResponse
from app.services.database_service import UsuarioService
from app.routes.auth import get_current_user

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get("/", response_model=List[UsuarioResponse])
def get_usuarios(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Obtener lista de usuarios (solo admins)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permisos para acceder a esta información"
        )
    usuarios = UsuarioService.get_usuarios(db, skip=skip, limit=limit)
    return usuarios