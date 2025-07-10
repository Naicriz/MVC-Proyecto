from app.models.models import cotizacion, tiposdemuebles, materiales
from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlmodel import Session
from app.database.database import get_db  # Asegúrate de importar get_db
from app.endpoints.auth import get_current_user  # Asegúrate de importar get_current_user

router = APIRouter(prefix="/cotizaciones", tags=["Cotizaciones"])

@router.get("/", response_model=list[cotizacion])
def get_cotizaciones(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)):
    """Obtener lista de cotizaciones"""
    cotizaciones = db.query(cotizacion).offset(skip).limit(limit).all()
    return cotizaciones

@router.post("/", response_model=cotizacion)
def create_cotizacion(
    cotizacion_data: cotizacion, 
    db: Session = Depends(get_db)
    ):
    """Crear una nueva cotización"""
    new_cotizacion = cotizacion(**cotizacion_data.dict())
    db.add(new_cotizacion)
    db.commit()
    db.refresh(new_cotizacion)
    return new_cotizacion

@router.delete("/{cotizacion_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cotizacion(
    cotizacion_id: int, 
    db: Session = Depends(get_db)
    ):
    """Eliminar una cotización por ID"""
    cotizacion_to_delete = db.query(cotizacion).filter(cotizacion.id == cotizacion_id).first()
    if not cotizacion_to_delete:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cotización no encontrada")
    
    db.delete(cotizacion_to_delete)
    db.commit()
    return {"detail": "Cotización eliminada exitosamente"}

@router.put("/{cotizacion_id}", response_model=cotizacion)
def update_cotizacion(
    cotizacion_id: int, 
    cotizacion_data: cotizacion, 
    db: Session = Depends(get_db)
    ):
    """Actualizar una cotización por ID"""
    cotizacion_to_update = db.query(cotizacion).filter(cotizacion.id == cotizacion_id).first()
    if not cotizacion_to_update:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cotización no encontrada")
    
    for key, value in cotizacion_data.dict().items():
        setattr(cotizacion_to_update, key, value)
    
    db.commit()
    db.refresh(cotizacion_to_update)
    return cotizacion_to_update

@router.post("/calcular", response_model=dict)
def calcular_cotizacion(
    tipo_mueble: str = Body(...),
    material: str = Body(...),
    medidas: str = Body(...),
    cantidad: int = Body(1),
    db: Session = Depends(get_db)
):
    """Calcula el total estimado de una cotización"""
    # Limpiar y normalizar entradas
    tipo_mueble_nombre = tipo_mueble.strip().lower()
    material_nombre = material.strip().lower()
    # Buscar precio base del tipo de mueble (case-insensitive)
    tipo = db.query(tiposdemuebles).filter(tiposdemuebles.nombre.ilike(tipo_mueble_nombre)).first()
    if not tipo:
        tipos_validos = [t.nombre for t in db.query(tiposdemuebles).all()]
        return {"error": "Tipo de mueble no encontrado", "tipos_validos": tipos_validos}
    # Buscar precio base del material (case-insensitive)
    mat = db.query(materiales).filter(materiales.nombre.ilike(material_nombre)).first()
    if not mat:
        materiales_validos = [m.nombre for m in db.query(materiales).all()]
        return {"error": "Material no encontrado", "materiales_validos": materiales_validos}
    try:
        precio_tipo = float(tipo.precio_base)
        precio_material = float(mat.precio_base)
    except Exception:
        return {"error": "Precio base inválido en la base de datos"}
    # Lógica de cálculo (puedes personalizarla)
    total = (precio_tipo + precio_material) * cantidad
    return {
        "total_estimado": total,
        "detalle": f"{cantidad} x {tipo_mueble} de {material} ({medidas})"
    }
