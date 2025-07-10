from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from ..models.models import Cliente
from ..schemas.schemas import ClienteCreate, ClienteResponse, ClienteUpdate
from ..database.database import get_session

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.post("/", response_model=ClienteResponse)
def crear_cliente(cliente: ClienteCreate, session: Session = Depends(get_session)):
    """Crear un nuevo cliente"""
    # Verificar si ya existe un cliente con ese email
    existing_cliente = session.exec(
        select(Cliente).where(Cliente.email == cliente.email)
    ).first()
    
    if existing_cliente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un cliente con ese email"
        )
    
    # Crear el cliente
    db_cliente = Cliente(
        nombre=cliente.nombre,
        apellido=cliente.apellido,
        email=cliente.email,
        telefono=cliente.telefono,
        direccion=cliente.direccion,
    )
    
    session.add(db_cliente)
    session.commit()
    session.refresh(db_cliente)
    
    return db_cliente


@router.post("/temporal", response_model=ClienteResponse)
def crear_cliente_temporal(cliente: ClienteCreate, session: Session = Depends(get_session)):
    """Crear un cliente temporal (sin validar duplicados)"""
    # Crear el cliente sin validar duplicados
    db_cliente = Cliente(
        nombre=cliente.nombre,
        apellido=cliente.apellido,
        email=cliente.email,
        telefono=cliente.telefono,
        direccion=cliente.direccion,
    )
    
    session.add(db_cliente)
    session.commit()
    session.refresh(db_cliente)
    
    return db_cliente


@router.put("/temporal/{cliente_id}", response_model=ClienteResponse)
def actualizar_cliente_temporal(
    cliente_id: int, 
    cliente_update: ClienteCreate, 
    session: Session = Depends(get_session)
):
    """Actualizar un cliente temporal con datos reales del usuario"""
    cliente = session.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente temporal no encontrado"
        )
    
    # Verificar si el nuevo email ya existe en otro cliente
    if cliente_update.email != cliente.email:
        existing_cliente = session.exec(
            select(Cliente).where(Cliente.email == cliente_update.email)
        ).first()
        
        if existing_cliente:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un cliente con ese email"
            )
    
    # Actualizar con los datos reales del usuario
    cliente.nombre = cliente_update.nombre
    cliente.apellido = cliente_update.apellido
    cliente.email = cliente_update.email
    cliente.telefono = cliente_update.telefono
    cliente.direccion = cliente_update.direccion
    
    session.add(cliente)
    session.commit()
    session.refresh(cliente)
    
    return cliente


@router.get("/", response_model=list[ClienteResponse])
def listar_clientes(session: Session = Depends(get_session)):
    """Listar todos los clientes"""
    clientes = session.exec(select(Cliente)).all()
    return clientes


@router.get("/{cliente_id}", response_model=ClienteResponse)
def obtener_cliente(cliente_id: int, session: Session = Depends(get_session)):
    """Obtener un cliente específico por ID"""
    cliente = session.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    return cliente


@router.put("/{cliente_id}", response_model=ClienteResponse)
def actualizar_cliente(
    cliente_id: int, 
    cliente_update: ClienteUpdate, 
    session: Session = Depends(get_session)
):
    """Actualizar un cliente existente"""
    cliente = session.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    # Actualizar solo los campos proporcionados
    update_data = cliente_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(cliente, field, value)
    
    session.add(cliente)
    session.commit()
    session.refresh(cliente)
    
    return cliente


@router.delete("/{cliente_id}")
def eliminar_cliente(cliente_id: int, session: Session = Depends(get_session)):
    """Eliminar un cliente"""
    cliente = session.get(Cliente, cliente_id)
    if not cliente:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente no encontrado"
        )
    
    session.delete(cliente)
    session.commit()
    
    return {"message": "Cliente eliminado exitosamente"} 