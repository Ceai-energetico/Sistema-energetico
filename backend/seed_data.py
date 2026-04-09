"""
Script para agregar datos de demostración a la base de datos.
Se ejecuta automáticamente si la base de datos está vacía.
"""

from app import SessionLocal, Sede, ConsumoMensual, CurvaCarga
from datetime import datetime, timedelta
import json

def seed_database():
    """Crea datos de demostración si no existen sedes."""
    session = SessionLocal()
    try:
        # Verificar si ya hay sedes
        count = session.query(Sede).count()
        if count > 0:
            print("✓ Base de datos ya contiene sedes. Omitiendo seed.")
            return
        
        # Crear sede demo
        sede = Sede(
            regional="REGIONAL VALLE",
            centro="Centro de Formación - SENA Cali",
            nombre="Sede Cali",
            direccion="Calle 13 No. 100-50",
            ciudad="Cali",
            fecha_revision="2026-03-17",
            responsable_empresa="Director Centro",
            temp_promedio=26.5,
            vel_viento=2.1,
            radiacion_solar=4.8,
            ano_construccion=2010,
            sede_comparte=False,
            propiedad="SENA (Pública)",
            num_trabajadores=45,
            num_aprendices=250,
            num_visitantes=15,
            tiene_renovables=False,
            tipos_renovables="[]",
            area_total_m2=3500.0,
            area_util_m2=2800.0,
            funcionario_responsable="Ing. Carlos García",
            cedula_responsable="12345678901"
        )
        session.add(sede)
        session.flush()
        
        # Agregar consumos mensuales (36 meses)
        base_date = datetime(2023, 3, 1)
        for i in range(36):
            fecha = base_date + timedelta(days=30*i)
            consumo = ConsumoMensual(
                sede_id=sede.id,
                fecha=fecha.strftime("%Y-%m-%d"),
                energia_kwh=8500.0 + (i % 12) * 500,  # Variación estacional
                energia_cop=3825000.0 + (i % 12) * 225000,
                gas_m3=120.0 - (i % 12) * 5,
                gas_cop=312000.0 - (i % 12) * 13000,
                acpm_gal=0.0,
                acpm_cop=0.0,
                gasolina_gal=5.0,
                gasolina_cop=75000.0
            )
            session.add(consumo)
        
        # Agregar curva de carga (día representativo)
        for hora in range(24):
            potencia = 150.0 + 80 * (1 + 0.5 * (1 if 8 <= hora <= 17 else -0.3))
            curva = CurvaCarga(
                sede_id=sede.id,
                hora=hora,
                potencia_kw=potencia
            )
            session.add(curva)
        
        session.commit()
        print("✓ Base de datos inicializada con datos de demostración")
        print(f"  - Sede: {sede.nombre}")
        print(f"  - Centro: {sede.centro}")
        print(f"  - Ciudad: {sede.ciudad}")
        
    except Exception as e:
        session.rollback()
        print(f"✗ Error al inicializar base de datos: {e}")
    finally:
        session.close()

if __name__ == "__main__":
    seed_database()
