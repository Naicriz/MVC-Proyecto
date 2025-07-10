from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib import colors


def generar_pdf_cotizacion(cotizacion, cliente, items):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Encabezado
    c.setFont("Helvetica-Bold", 18)
    c.drawString(40, height - 50, "Cotización")
    c.setFont("Helvetica", 10)
    fecha = cotizacion.get('fecha', '')
    if hasattr(fecha, 'strftime'):
        fecha_str = fecha.strftime('%Y-%m-%d')
    else:
        fecha_str = str(fecha)[:10]
    c.drawString(40, height - 70, f"Fecha: {fecha_str}")
    c.drawString(40, height - 85, f"N° Cotización: {cotizacion.get('id', 'TEMP')}")

    # Datos del cliente
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, height - 120, "Datos del Cliente:")
    c.setFont("Helvetica", 10)
    c.drawString(60, height - 135, f"Nombre: {cliente.get('nombre', '')} {cliente.get('apellido', '')}")
    c.drawString(60, height - 150, f"Email: {cliente.get('email', '')}")
    if cliente.get('telefono'):
        c.drawString(60, height - 165, f"Teléfono: {cliente.get('telefono', '')}")
    if cliente.get('direccion'):
        c.drawString(60, height - 180, f"Dirección: {cliente.get('direccion', '')}")

    # Tabla de items
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, height - 210, "Detalle de Productos:")
    c.setFont("Helvetica-Bold", 10)
    y = height - 230
    c.drawString(40, y, "Producto")
    c.drawString(200, y, "Cantidad")
    c.drawString(260, y, "Material")
    c.drawString(340, y, "Subtotal")
    c.setFont("Helvetica", 10)
    y -= 15
    for item in items:
        c.drawString(40, y, item.get('nombre', ''))
        c.drawString(200, y, str(item.get('cantidad', '')))
        c.drawString(260, y, item.get('tipo_material', ''))
        c.drawString(340, y, f"${item.get('subtotal', 0):,}")
        y -= 15

        # Especificaciones del producto
        c.setFont("Helvetica-Oblique", 9)
        especificaciones = []
        if item.get('dimensiones'):
            especificaciones.append(f"Dimensiones: {item.get('dimensiones')}")
        if item.get('color_acabado'):
            especificaciones.append(f"Color/Acabado: {item.get('color_acabado')}")
        if item.get('herrajes_tipo'):
            especificaciones.append(f"Herrajes: {item.get('herrajes_tipo')}")
        if item.get('puertas') is not None:
            especificaciones.append(f"Puertas: {item.get('puertas')}")
        if item.get('cajones') is not None:
            especificaciones.append(f"Cajones: {item.get('cajones')}")
        if item.get('repisas') is not None:
            especificaciones.append(f"Repisas: {item.get('repisas')}")
        for espec in especificaciones:
            c.drawString(60, y, espec[:90])
            y -= 12
            if y < 100:
                c.showPage()
                y = height - 50
        c.setFont("Helvetica", 10)

        # Desglose de precios
        c.setFont("Helvetica", 9)
        desglose = [
            ("Costo base", item.get('costo_base', 0)),
            ("Material", item.get('costo_material', 0)),
            ("Herrajes", item.get('costo_herrajes', 0)),
            ("Instalación", item.get('costo_instalacion', 0)),
            ("IVA", item.get('iva', 0)),
            ("Subtotal", item.get('subtotal', 0)),
        ]
        for label, value in desglose:
            c.drawString(80, y, f"{label}: ${value:,}")
            y -= 11
            if y < 100:
                c.showPage()
                y = height - 50
        c.setFont("Helvetica", 10)
        y -= 5
        # Línea separadora
        c.setStrokeColor(colors.grey)
        c.line(40, y, width - 40, y)
        y -= 10
        if y < 100:
            c.showPage()
            y = height - 50

    # Totales
    y -= 10
    c.setFont("Helvetica-Bold", 11)
    c.drawString(260, y, "Subtotal:")
    c.setFont("Helvetica", 10)
    c.drawString(340, y, f"${cotizacion.get('subtotal', 0):,}")
    y -= 15
    c.setFont("Helvetica-Bold", 11)
    c.drawString(260, y, "IVA (19%):")
    c.setFont("Helvetica", 10)
    c.drawString(340, y, f"${cotizacion.get('iva', 0):,}")
    y -= 15
    c.setFont("Helvetica-Bold", 12)
    c.drawString(260, y, "Total:")
    c.setFont("Helvetica-Bold", 12)
    c.drawString(340, y, f"${cotizacion.get('total', 0):,}")

    # Observaciones
    y -= 30
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, y, "Observaciones:")
    c.setFont("Helvetica", 10)
    obs = cotizacion.get('observaciones', '') or ''
    for line in obs.split('\n'):
        y -= 13
        c.drawString(60, y, line[:90])
        if y < 50:
            c.showPage()
            y = height - 50

    # Pie de página
    c.setFont("Helvetica-Oblique", 8)
    c.setFillColor(colors.grey)
    c.drawString(40, 30, "Generado por MVC Proyecto & Diseño Ltda.")
    c.save()
    pdf = buffer.getvalue()
    buffer.close()
    return pdf 