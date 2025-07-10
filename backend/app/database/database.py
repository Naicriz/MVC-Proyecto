# Dependencia para obtener una sesión de base de datos (SQLModel)
def get_session():
    from sqlmodel import Session
    from .database import engine

    with Session(engine) as session:
        yield session


from sqlmodel import create_engine, SQLModel, Session, select
from app import settings
from app.models.models import Usuario
from app.services.auth import get_password_hash
from datetime import datetime

# Crear el motor de base de datos
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=(
        {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
    ),
    echo=settings.DEBUG,
)


def init_db():
    """Inicializa la base de datos creando las tablas necesarias."""

    # Crear todas las tablas en la base de datos
    SQLModel.metadata.create_all(engine)

    # Crear usuario administrador por defecto si no existe
    with Session(engine) as session:
        existing_admin = session.exec(
            select(Usuario).where(Usuario.email == "admin@mvc.cl")
        ).first()

        if existing_admin is None:
            admin_user = Usuario(
                email="admin@mvc.cl",
                nombre="Admin",
                apellido="Istrador",
                telefono="+56912345678",
                hashed_password=get_password_hash("Admin123"),
                is_active=True,
                is_admin=True,
                created_at=datetime.now(),
                updated_at=datetime.now(),
            )
            session.add(admin_user)
            session.commit()


# Función para obtener una sesión de base de datos
def get_db():
    """
    Obtiene una sesión de base de datos.
    """
    with Session(engine) as session:
        yield session
