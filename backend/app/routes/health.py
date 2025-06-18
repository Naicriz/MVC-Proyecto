from fastapi import APIRouter
from datetime import datetime
from app.schemas.schemas import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    """Endpoint para verificar el estado de la API"""
    return {
        "status": "healthy",
        "message": "MVC Proyecto API está funcionando correctamente",
        "timestamp": datetime.now()
    }

@router.get("/")
def root():
    """Endpoint raíz"""
    return {
        "message": "¡Bienvenido a MVC Proyecto API!",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }
