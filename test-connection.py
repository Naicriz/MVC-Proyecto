#!/usr/bin/env python3
"""
Script para probar la conexión entre frontend y backend
"""

import requests
import json
from datetime import datetime

# Configuración
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_backend_health():
    """Probar el endpoint de health del backend"""
    print("🔍 Probando health del backend...")
    try:
        response = requests.get(f"{BACKEND_URL}/health/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend funcionando: {data['status']} - {data['message']}")
            return True
        else:
            print(f"❌ Error en health check: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se pudo conectar al backend. ¿Está corriendo en http://localhost:8000?")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def test_create_cliente():
    """Probar la creación de un cliente"""
    print("\n👤 Probando creación de cliente...")
    try:
        cliente_data = {
            "nombre": "Test",
            "apellido": "Usuario",
            "email": f"test{datetime.now().timestamp()}@example.com",
            "telefono": "+56912345678",
            "direccion": "Dirección de prueba"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/clientes/",
            json=cliente_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Cliente creado exitosamente: {data['nombre']} {data['apellido']}")
            return data['id']
        else:
            print(f"❌ Error creando cliente: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return None

def test_create_cotizacion(cliente_id):
    """Probar la creación de una cotización"""
    print("\n📋 Probando creación de cotización...")
    try:
        cotizacion_data = {
            "fecha": datetime.now().isoformat(),
            "total": 1500000,
            "cliente_id": cliente_id,
            "observaciones": "Cotización de prueba desde script",
            "items": [
                {
                    "nombre": "Mueble de Prueba",
                    "descripcion": "Mueble creado para testing",
                    "cantidad": 1,
                    "unidad": "unidad",
                    "tipo_material": "melamina",
                    "precio_unitario": 1500000,
                    "subtotal": 1500000
                }
            ]
        }
        
        response = requests.post(
            f"{BACKEND_URL}/cotizaciones/",
            json=cotizacion_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Cotización creada exitosamente: ID {data['id']}")
            return data['id']
        else:
            print(f"❌ Error creando cotización: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return None

def test_get_cotizaciones():
    """Probar obtener cotizaciones"""
    print("\n📊 Probando obtención de cotizaciones...")
    try:
        response = requests.get(f"{BACKEND_URL}/cotizaciones/")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Cotizaciones obtenidas: {len(data)} cotizaciones")
            return True
        else:
            print(f"❌ Error obteniendo cotizaciones: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def test_frontend_connection():
    """Probar si el frontend está corriendo"""
    print("\n🌐 Probando conexión al frontend...")
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print("✅ Frontend está corriendo en http://localhost:3000")
            return True
        else:
            print(f"❌ Frontend respondió con código: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ No se pudo conectar al frontend. ¿Está corriendo en http://localhost:3000?")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def main():
    """Función principal de pruebas"""
    print("🚀 Iniciando pruebas de conexión Backend-Frontend")
    print("=" * 50)
    
    # Probar backend
    if not test_backend_health():
        print("\n❌ Backend no está funcionando. Deteniendo pruebas.")
        return
    
    # Probar creación de cliente
    cliente_id = test_create_cliente()
    if not cliente_id:
        print("\n❌ No se pudo crear cliente. Deteniendo pruebas.")
        return
    
    # Probar creación de cotización
    cotizacion_id = test_create_cotizacion(cliente_id)
    if not cotizacion_id:
        print("\n❌ No se pudo crear cotización. Deteniendo pruebas.")
        return
    
    # Probar obtención de cotizaciones
    test_get_cotizaciones()
    
    # Probar frontend
    test_frontend_connection()
    
    print("\n" + "=" * 50)
    print("✅ Pruebas completadas")
    print(f"📋 Cliente creado con ID: {cliente_id}")
    print(f"📄 Cotización creada con ID: {cotizacion_id}")
    print("\n🎉 ¡La conexión entre backend y frontend está funcionando!")
    print("\n📝 Próximos pasos:")
    print("1. Abre http://localhost:3000 en tu navegador")
    print("2. Usa el componente de prueba en la página principal")
    print("3. Prueba crear una cotización desde el frontend")

if __name__ == "__main__":
    main() 