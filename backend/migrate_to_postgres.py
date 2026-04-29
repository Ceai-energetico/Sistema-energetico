"""
Script de migración: SQLite → PostgreSQL (Supabase)

Este script copia todos tus datos de la base de datos SQLite local
a PostgreSQL en Supabase.

Uso:
    python migrate_to_postgres.py
"""

import os
import sys
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
import json

# Importar los modelos desde app.py
sys.path.insert(0, os.path.dirname(__file__))
from app import (
    Base, Sede, ConsumoMensual, CurvaCarga, InventarioItem,
    Oportunidad, RevisionEnergetica088
)

def migrate_data():
    """Migra datos de SQLite a PostgreSQL."""
    
    # Variables de entorno
    sqlite_url = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'data.db')}"
    postgres_url = os.getenv('DATABASE_URL')
    
    if not postgres_url:
        print("❌ Error: DATABASE_URL no está configurada")
        print("   Asegúrate de tener un archivo .env con DATABASE_URL")
        return False
    
    print(f"📦 Conectando a SQLite: {sqlite_url}")
    print(f"🐘 Conectando a PostgreSQL: {postgres_url}")
    
    try:
        # Crear conexiones
        sqlite_engine = create_engine(sqlite_url)
        postgres_engine = create_engine(postgres_url)
        
        # Crear tablas en PostgreSQL
        print("\n🔨 Creando tablas en PostgreSQL...")
        Base.metadata.create_all(bind=postgres_engine)
        
        # Crear sesiones
        SQLiteSession = sessionmaker(bind=sqlite_engine)
        PostgresSession = sessionmaker(bind=postgres_engine)
        
        sqlite_session = SQLiteSession()
        postgres_session = PostgresSession()
        
        try:
            # Contar registros en SQLite
            sedes_count = sqlite_session.query(Sede).count()
            print(f"\n📊 Registros en SQLite:")
            print(f"   - Sedes: {sedes_count}")
            print(f"   - Consumos: {sqlite_session.query(ConsumoMensual).count()}")
            print(f"   - Curvas: {sqlite_session.query(CurvaCarga).count()}")
            print(f"   - Inventario: {sqlite_session.query(InventarioItem).count()}")
            print(f"   - Oportunidades: {sqlite_session.query(Oportunidad).count()}")
            print(f"   - Revisiones 088: {sqlite_session.query(RevisionEnergetica088).count()}")
            
            if sedes_count == 0:
                print("\n⚠️  No hay datos para migrar en SQLite")
                return True
            
            # Migrar Sedes
            print("\n📋 Migrando Sedes...")
            for sede in sqlite_session.query(Sede).all():
                postgres_session.add(sede)
            postgres_session.commit()
            
            # Migrar Consumos Mensuales
            print("📊 Migrando Consumos Mensuales...")
            for consumo in sqlite_session.query(ConsumoMensual).all():
                postgres_session.add(consumo)
            postgres_session.commit()
            
            # Migrar Curva de Carga
            print("📈 Migrando Curva de Carga...")
            for curva in sqlite_session.query(CurvaCarga).all():
                postgres_session.add(curva)
            postgres_session.commit()
            
            # Migrar Inventario
            print("🏗️ Migrando Inventario...")
            for item in sqlite_session.query(InventarioItem).all():
                postgres_session.add(item)
            postgres_session.commit()
            
            # Migrar Oportunidades
            print("💡 Migrando Oportunidades...")
            for oportunidad in sqlite_session.query(Oportunidad).all():
                postgres_session.add(oportunidad)
            postgres_session.commit()
            
            # Migrar Revisiones 088
            print("📝 Migrando Revisiones Energéticas 088...")
            for revision in sqlite_session.query(RevisionEnergetica088).all():
                postgres_session.add(revision)
            postgres_session.commit()
            
            print("\n✅ ¡Migración completada exitosamente!")
            print(f"   Total de {sedes_count} sede(s) migrada(s)")
            return True
            
        finally:
            sqlite_session.close()
            postgres_session.close()
            
    except Exception as e:
        print(f"\n❌ Error durante la migración: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 MIGRACIÓN DE DATOS: SQLite → PostgreSQL")
    print("=" * 60)
    
    success = migrate_data()
    
    if success:
        print("\n" + "=" * 60)
        print("Tu aplicación está lista para usar PostgreSQL en Render 🎉")
        print("=" * 60)
        sys.exit(0)
    else:
        sys.exit(1)
