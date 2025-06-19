from sqlmodel import create_engine, SQLModel, Session
from app import settings

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
    # Crear todas las tablas en la base de datos
    SQLModel.metadata.create_all(engine)

# Función para obtener una sesión de base de datos
def get_db():
    """
    Obtiene una sesión de base de datos.
    """
    with Session(engine) as session:
        yield session
