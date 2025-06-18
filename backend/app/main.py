from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.database import create_db_and_tables
from app.routes import auth_router, usuarios_router, cotizaciones_router, health_router

# Crear las tablas en la base de datos
create_db_and_tables()

# Crear la aplicación FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="API del proyecto MVC - Sistemas de Información",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(health_router)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(usuarios_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
    )
