from pydantic_settings import BaseSettings
from typing import List
# import os

class Settings(BaseSettings):
    # Base de datos
    DATABASE_URL: str = "sqlite:///./mvc_proyecto.db"
    
    # Seguridad
    SECRET_KEY: str = "clave_secreta_super_segura_cambiala_en_produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API
    PROJECT_NAME: str = "MVC Proyecto API"
    DEBUG: bool = True
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://192.168.85.29:3000",
        "http://0.0.0.0:3000",
    ]
    
    # class Config:
    #     env_file = ".env.example"
    #     case_sensitive = True

