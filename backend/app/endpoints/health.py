from datetime import datetime

from fastapi import APIRouter
from app.schemas.schemas import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    """Endpoint para verificar el estado de la API"""
    return {

        "message": "MVC Proyecto API está funcionando correctamente",
    }

@router.get("/")
def root():
    """Endpoint raíz"""
    return {
        "status": "Saludable",
        "message": "MVC API - Sistemas de Información",
        "version": "1.1.0",
        "docs": "/docs",
        "timestamp": datetime.now()
    }
