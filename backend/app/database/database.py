from sqlmodel import create_engine, SQLModel, Session
from app.config import settings

# Crear el motor de base de datos
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=settings.DEBUG
)

# Función para crear todas las tablas
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependencia para obtener la sesión de base de datos
def get_db():
    with Session(engine) as session:
        yield session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
