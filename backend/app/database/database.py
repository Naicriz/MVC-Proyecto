from sqlmodel import create_engine, SQLModel, Session
from app import settings
from app.models.models import Usuario
from app.services.auth import get_password_hash
from datetime import datetime

# Crear el motor de base de datos
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=settings.DEBUG
)

def init_db():
    """
    Inicializa la base de datos creando las tablas necesarias.
    """

    # crear un usuario admin
    admin_user = Usuario(
        email="admin@mvc.cl",
        nombre="Admin",
        apellido="Istrador",
        telefono="+56912345678",
        hashed_password="Admin123",
        is_active=True,
        is_admin=True,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    if not admin_user:
        with Session(engine) as session:
            session.add(admin_user)
            session.commit()

    # Crear todas las tablas en la base de datos
    SQLModel.metadata.create_all(engine)

# Función para obtener una sesión de base de datos
def get_db():
    """
    Obtiene una sesión de base de datos.
    """
    with Session(engine) as session:
        yield session
