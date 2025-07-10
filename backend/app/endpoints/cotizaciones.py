from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import Session, select

from app.database.database import get_session
from app.models.models import Cotizacion, ItemCotizacion, Cliente
from app.schemas.schemas import (
    CotizacionCreate, CotizacionResponse, CotizacionUpdate, ItemCotizacionCreate,
    EstadoUpdate, PrecioUpdate, NotaInterna, DatosContacto, ValidacionResponse
)
from pydantic import BaseModel
from typing import Optional
from app.services.pdf_service import generar_pdf_cotizacion

# Esquema para calcular precio basado en especificaciones
class EspecificacionesMueble(BaseModel):
    alto: float
    ancho: float
    profundidad: float
    material: str
    color: str
    herrajes: str
    puertas: str
    cajones: str
    repisas: str
    tipo_mueble: str

router = APIRouter(prefix="/cotizaciones", tags=["Cotizaciones"])


@router.post("/calcular-precio", response_model=dict)
def calcular_precio_especificaciones(especificaciones: EspecificacionesMueble):
    """
    Calcula el precio de un mueble basado en sus especificaciones.
    """
    try:
        # Cálculo básico del precio basado en dimensiones
        volumen = especificaciones.alto * especificaciones.ancho * especificaciones.profundidad
        precio_base = (volumen / 1000000) * 50000  # 50.000 CLP por m³
        
        # Multiplicadores por material
        multiplicadores_material = {
            "melamina": 1.0,
            "mdf": 1.2,
            "madera-natural": 1.5,
            "maderas-enchapadas": 1.8,
        }
        
        precio_base *= multiplicadores_material.get(especificaciones.material, 1.0)
        
        # Multiplicador por herrajes
        multiplicadores_herrajes = {
            "estandar": 1.0,
            "premium": 1.3,
            "cierre-suave": 1.2,
        }
        
        precio_base *= multiplicadores_herrajes.get(especificaciones.herrajes, 1.0)
        
        # Ajustes por cantidad de elementos
        puertas = int(especificaciones.puertas) if especificaciones.puertas.isdigit() else 0
        cajones = int(especificaciones.cajones) if especificaciones.cajones.isdigit() else 0
        repisas = int(especificaciones.repisas) if especificaciones.repisas.isdigit() else 0
        
        # Ajuste por elementos adicionales
        ajuste_elementos = 1.0
        if puertas > 0:
            ajuste_elementos += puertas * 0.1
        if cajones > 0:
            ajuste_elementos += cajones * 0.15
        if repisas > 0:
            ajuste_elementos += repisas * 0.05
        
        precio_final = round(precio_base * ajuste_elementos)
        
        return {
            "precio_estimado": precio_final,
            "desglose": {
                "volumen_m3": round(volumen / 1000000, 3),
                "precio_base": round(precio_base),
                "multiplicador_material": multiplicadores_material.get(especificaciones.material, 1.0),
                "multiplicador_herrajes": multiplicadores_herrajes.get(especificaciones.herrajes, 1.0),
                "ajuste_elementos": ajuste_elementos,
                "puertas": puertas,
                "cajones": cajones,
                "repisas": repisas
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al calcular el precio: {str(e)}"
        )


@router.post("/calcular", response_model=dict)
def calcular_cotizacion_temporal(cotizacion_data: CotizacionCreate):
    """
    Calcula una cotización temporal sin guardarla en la base de datos.
    Retorna el desglose detallado para mostrar al usuario.
    """
    try:
        # Calcular desglose detallado
        total = cotizacion_data.total
        subtotal = total / 1.19  # Asumiendo 19% IVA
        iva = total - subtotal
        
        # Distribuir el subtotal en los diferentes costos
        items_con_desglose = []
        for item in cotizacion_data.items:
            # Calcular costos basados en el tipo de material y dimensiones
            costo_base = item.precio_unitario * 0.5  # 50% del precio
            costo_material = item.precio_unitario * 0.25  # 25% del precio
            costo_herrajes = item.precio_unitario * 0.15  # 15% del precio
            costo_instalacion = item.precio_unitario * 0.1  # 10% del precio

            # Extraer información detallada de la descripción
            descripcion_parts = item.descripcion.split(" - ") if item.descripcion else []
            dimensiones = descripcion_parts[0] if descripcion_parts else None

            # Usar campos explícitos si existen
            color_acabado = getattr(item, 'color_acabado', None)
            herrajes_tipo = getattr(item, 'herrajes_tipo', None)
            puertas = getattr(item, 'puertas', None)
            cajones = getattr(item, 'cajones', None)
            repisas = getattr(item, 'repisas', None)

            # Fallback: intentar extraer de la descripción solo si no existen
            if color_acabado in [None, ""] or str(color_acabado).lower() == "none":
                color_acabado = "Nogal"  # Por defecto
                for part in descripcion_parts:
                    if "Color:" in part:
                        color_acabado = part.replace("Color:", "").strip()
                        break
            if herrajes_tipo in [None, ""] or str(herrajes_tipo).lower() == "none":
                herrajes_tipo = "Premium"  # Por defecto
                for part in descripcion_parts:
                    if "Herrajes:" in part:
                        herrajes_tipo = part.replace("Herrajes:", "").strip()
                        break
            if puertas in [None, ""] or str(puertas).lower() == "none":
                puertas = None
                for part in descripcion_parts:
                    if "Puertas:" in part:
                        try:
                            puertas = int(part.replace("Puertas:", "").strip())
                        except:
                            puertas = None
                        break
            if cajones in [None, ""] or str(cajones).lower() == "none":
                cajones = None
                for part in descripcion_parts:
                    if "Cajones:" in part:
                        try:
                            cajones = int(part.replace("Cajones:", "").strip())
                        except:
                            cajones = None
                        break
            if repisas in [None, ""] or str(repisas).lower() == "none":
                repisas = None
                for part in descripcion_parts:
                    if "Repisas:" in part:
                        try:
                            repisas = int(part.replace("Repisas:", "").strip())
                        except:
                            repisas = None
                        break

            # Asegurar que puertas, cajones y repisas sean numéricos
            try:
                puertas = int(puertas) if puertas is not None else None
            except:
                puertas = None
            try:
                cajones = int(cajones) if cajones is not None else None
            except:
                cajones = None
            try:
                repisas = int(repisas) if repisas is not None else None
            except:
                repisas = None

            item_desglose = {
                "nombre": item.nombre,
                "descripcion": item.descripcion,
                "cantidad": item.cantidad,
                "unidad": item.unidad,
                "tipo_material": item.tipo_material,
                "precio_unitario": item.precio_unitario,
                "subtotal": item.subtotal,
                "costo_base": round(costo_base),
                "costo_material": round(costo_material),
                "costo_herrajes": round(costo_herrajes),
                "costo_instalacion": round(costo_instalacion),
                "iva": round(item.subtotal * 0.19),
                "dimensiones": dimensiones,
                "color_acabado": color_acabado,
                "herrajes_tipo": herrajes_tipo,
                "puertas": puertas,
                "cajones": cajones,
                "repisas": repisas
            }
            items_con_desglose.append(item_desglose)
        
        return {
            "cotizacion_temporal": {
                "fecha": datetime.now().isoformat(),
                "total": total,
                "subtotal": round(subtotal),
                "iva": round(iva),
                "items": items_con_desglose,
                "observaciones": cotizacion_data.observaciones
            },
            "mensaje": "Cotización calculada exitosamente"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al calcular la cotización: {str(e)}"
        )


@router.post("/", response_model=CotizacionResponse)
def crear_cotizacion(cotizacion_data: CotizacionCreate, session: Session = Depends(get_session)):
    """
    Crea una nueva cotización en la base de datos.
    """
    try:
        # Verificar que el cliente existe
        cliente = session.exec(select(Cliente).where(Cliente.id == cotizacion_data.cliente_id)).first()
        if not cliente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cliente no encontrado"
            )

        # Crear la cotización
        cotizacion = Cotizacion(
            fecha=cotizacion_data.fecha or datetime.now(),
            total=cotizacion_data.total,
            cliente_id=cotizacion_data.cliente_id,
            observaciones=cotizacion_data.observaciones
        )
        session.add(cotizacion)
        session.commit()
        session.refresh(cotizacion)

        # Crear los items de la cotización
        for item_data in cotizacion_data.items:
            # Calcular costos para el desglose
            costo_base = item_data.precio_unitario * 0.5
            costo_material = item_data.precio_unitario * 0.25
            costo_herrajes = item_data.precio_unitario * 0.15
            costo_instalacion = item_data.precio_unitario * 0.1
            iva = item_data.subtotal * 0.19
            
            # Normalizar color_acabado y herrajes_tipo
            color_acabado = getattr(item_data, 'color_acabado', None)
            if color_acabado in [None, ""]:
                color_acabado = None
            herrajes_tipo = getattr(item_data, 'herrajes_tipo', None)
            if herrajes_tipo in [None, ""]:
                herrajes_tipo = None
            
            item = ItemCotizacion(
                cotizacion_id=cotizacion.id,
                nombre=item_data.nombre,
                descripcion=item_data.descripcion,
                cantidad=item_data.cantidad,
                unidad=item_data.unidad,
                tipo_material=item_data.tipo_material,
                precio_unitario=item_data.precio_unitario,
                subtotal=item_data.subtotal,
                costo_base=round(costo_base),
                costo_material=round(costo_material),
                costo_herrajes=round(costo_herrajes),
                costo_instalacion=round(costo_instalacion),
                iva=round(iva),
                dimensiones=getattr(item_data, 'dimensiones', None) or (item_data.descripcion.split(" - ")[0] if item_data.descripcion else None),
                color_acabado=color_acabado,
                herrajes_tipo=herrajes_tipo,
                puertas=getattr(item_data, 'puertas', None),
                cajones=getattr(item_data, 'cajones', None),
                repisas=getattr(item_data, 'repisas', None),
            )
            session.add(item)

        session.commit()
        session.refresh(cotizacion)

        return cotizacion
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear la cotización: {str(e)}"
        )


@router.get("/", response_model=List[CotizacionResponse])
def obtener_cotizaciones(session: Session = Depends(get_session)):
    """
    Obtiene todas las cotizaciones.
    """
    cotizaciones = session.exec(select(Cotizacion)).all()
    return cotizaciones


@router.get("/{cotizacion_id}", response_model=CotizacionResponse)
def obtener_cotizacion(cotizacion_id: int, session: Session = Depends(get_session)):
    """
    Obtiene una cotización específica por ID.
    """
    cotizacion = session.exec(select(Cotizacion).where(Cotizacion.id == cotizacion_id)).first()
    if not cotizacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotización no encontrada"
        )
    return cotizacion


@router.put("/{cotizacion_id}", response_model=CotizacionResponse)
def actualizar_cotizacion(
    cotizacion_id: int, 
    cotizacion_data: CotizacionUpdate, 
    session: Session = Depends(get_session)
):
    """
    Actualiza una cotización existente.
    """
    cotizacion = session.exec(select(Cotizacion).where(Cotizacion.id == cotizacion_id)).first()
    if not cotizacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotización no encontrada"
        )

    # Actualizar campos
    if cotizacion_data.fecha is not None:
        cotizacion.fecha = cotizacion_data.fecha
    if cotizacion_data.total is not None:
        cotizacion.total = cotizacion_data.total
    if cotizacion_data.cliente_id is not None:
        cotizacion.cliente_id = cotizacion_data.cliente_id
    if cotizacion_data.observaciones is not None:
        cotizacion.observaciones = cotizacion_data.observaciones

    cotizacion.updated_at = datetime.now()
    session.add(cotizacion)
    session.commit()
    session.refresh(cotizacion)

    return cotizacion


@router.delete("/{cotizacion_id}")
def eliminar_cotizacion(cotizacion_id: int, session: Session = Depends(get_session)):
    """
    Elimina una cotización.
    """
    cotizacion = session.exec(select(Cotizacion).where(Cotizacion.id == cotizacion_id)).first()
    if not cotizacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotización no encontrada"
        )

    # Eliminar primero los items asociados
    session.query(ItemCotizacion).filter(ItemCotizacion.cotizacion_id == cotizacion_id).delete()
    session.delete(cotizacion)
    session.commit()
    return {"message": "Cotización eliminada exitosamente"}


@router.patch("/{cotizacion_id}/estado")
def cambiar_estado_cotizacion(
    cotizacion_id: int, 
    estado_data: EstadoUpdate, 
    session: Session = Depends(get_session)
):
    """
    Cambia el estado de una cotización.
    """
    cotizacion = session.exec(select(Cotizacion).where(Cotizacion.id == cotizacion_id)).first()
    if not cotizacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotización no encontrada"
        )

    # Actualizar observaciones con el nuevo estado
    observaciones_actuales = cotizacion.observaciones or ""
    # Remover estados anteriores si existen
    estados_anteriores = ["nuevo", "revisado", "contactado", "aprobado"]
    for estado_anterior in estados_anteriores:
        observaciones_actuales = observaciones_actuales.replace(estado_anterior, "")
    
    cotizacion.observaciones = f"{observaciones_actuales.strip()} {estado_data.estado}".strip()
    cotizacion.updated_at = datetime.now()
    
    session.add(cotizacion)
    session.commit()
    session.refresh(cotizacion)

    return {"message": f"Estado cambiado a {estado_data.estado}", "cotizacion": cotizacion}


@router.patch("/{cotizacion_id}/precio")
def actualizar_precio_cotizacion(
    cotizacion_id: int, 
    precio_data: PrecioUpdate, 
    session: Session = Depends(get_session)
):
    """
    Actualiza el precio de una cotización.
    """
    cotizacion = session.exec(select(Cotizacion).where(Cotizacion.id == cotizacion_id)).first()
    if not cotizacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotización no encontrada"
        )

    precio_anterior = cotizacion.total
    cotizacion.total = precio_data.nuevo_precio
    cotizacion.updated_at = datetime.now()
    
    # Agregar nota sobre el cambio de precio
    observaciones_actuales = cotizacion.observaciones or ""
    cotizacion.observaciones = f"{observaciones_actuales} [Precio actualizado: ${precio_anterior:,} → ${precio_data.nuevo_precio:,}]".strip()
    
    session.add(cotizacion)
    session.commit()
    session.refresh(cotizacion)

    return {"message": "Precio actualizado exitosamente", "cotizacion": cotizacion}


@router.post("/{cotizacion_id}/notas")
def agregar_nota_interna(
    cotizacion_id: int, 
    nota_data: NotaInterna, 
    session: Session = Depends(get_session)
):
    """
    Agrega una nota interna a una cotización.
    """
    cotizacion = session.exec(select(Cotizacion).where(Cotizacion.id == cotizacion_id)).first()
    if not cotizacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotización no encontrada"
        )

    # Agregar la nota a las observaciones
    observaciones_actuales = cotizacion.observaciones or ""
    timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
    nueva_nota = f"[{timestamp}] NOTA INTERNA: {nota_data.nota}"
    
    cotizacion.observaciones = f"{observaciones_actuales}\n{nueva_nota}".strip()
    cotizacion.updated_at = datetime.now()
    
    session.add(cotizacion)
    session.commit()
    session.refresh(cotizacion)

    return {"message": "Nota interna agregada exitosamente", "cotizacion": cotizacion}


@router.post("/{cotizacion_id}/contacto")
def registrar_contacto_cliente(
    cotizacion_id: int, 
    datos_contacto: DatosContacto, 
    session: Session = Depends(get_session)
):
    """
    Registra un contacto con el cliente.
    """
    cotizacion = session.exec(select(Cotizacion).where(Cotizacion.id == cotizacion_id)).first()
    if not cotizacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotización no encontrada"
        )

    # Agregar información del contacto a las observaciones
    observaciones_actuales = cotizacion.observaciones or ""
    timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
    
    contacto_info = f"[{timestamp}] CONTACTO: Método={datos_contacto.metodo}, "
    contacto_info += f"Resultado={datos_contacto.resultado}"
    
    if datos_contacto.notas:
        contacto_info += f", Notas={datos_contacto.notas}"
    
    cotizacion.observaciones = f"{observaciones_actuales}\n{contacto_info}".strip()
    cotizacion.updated_at = datetime.now()
    
    # Cambiar estado a "contactado" si no está ya
    if "contactado" not in cotizacion.observaciones.lower():
        cotizacion.observaciones += " contactado"
    
    session.add(cotizacion)
    session.commit()
    session.refresh(cotizacion)

    return {"message": "Contacto registrado exitosamente", "cotizacion": cotizacion}


@router.post("/{cotizacion_id}/validar")
def marcar_como_validada(
    cotizacion_id: int, 
    session: Session = Depends(get_session)
):
    """
    Marca una cotización como validada.
    """
    cotizacion = session.exec(select(Cotizacion).where(Cotizacion.id == cotizacion_id)).first()
    if not cotizacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cotización no encontrada"
        )

    # Agregar marca de validación
    observaciones_actuales = cotizacion.observaciones or ""
    timestamp = datetime.now().strftime("%d/%m/%Y %H:%M")
    validacion_info = f"[{timestamp}] VALIDADA: Cotización revisada y aprobada por administrador"
    
    cotizacion.observaciones = f"{observaciones_actuales}\n{validacion_info}".strip()
    cotizacion.updated_at = datetime.now()
    
    session.add(cotizacion)
    session.commit()
    session.refresh(cotizacion)

    return {"message": "Cotización marcada como validada", "cotizacion": cotizacion}


@router.get("/{cotizacion_id}/pdf")
def descargar_pdf_cotizacion(cotizacion_id: int, session: Session = Depends(get_session)):
    """
    Genera y descarga el PDF de una cotización guardada.
    """
    cotizacion = session.exec(select(Cotizacion).where(Cotizacion.id == cotizacion_id)).first()
    if not cotizacion:
        raise HTTPException(status_code=404, detail="Cotización no encontrada")
    cliente = session.exec(select(Cliente).where(Cliente.id == cotizacion.cliente_id)).first()
    items = session.exec(select(ItemCotizacion).where(ItemCotizacion.cotizacion_id == cotizacion.id)).all()
    # Convertir a dict para el servicio
    cotizacion_dict = cotizacion.dict()
    cliente_dict = cliente.dict() if cliente else {}
    items_dict = [item.dict() for item in items]
    pdf_bytes = generar_pdf_cotizacion(cotizacion_dict, cliente_dict, items_dict)
    return Response(pdf_bytes, media_type="application/pdf", headers={
        "Content-Disposition": f"attachment; filename=\"cotizacion_{cotizacion_id}.pdf\""
    })

class PDFTemporalRequest(BaseModel):
    cotizacion: dict
    cliente: dict
    items: list

@router.post("/pdf-temporal")
def descargar_pdf_temporal(data: PDFTemporalRequest):
    """
    Genera y descarga el PDF de una cotización temporal (no guardada en la base de datos).
    """
    pdf_bytes = generar_pdf_cotizacion(data.cotizacion, data.cliente, data.items)
    return Response(pdf_bytes, media_type="application/pdf", headers={
        "Content-Disposition": "attachment; filename=\"cotizacion_temporal.pdf\""
    })
