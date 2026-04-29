"""
Script de configuración rápida para Render + Supabase

Este script automatiza:
1. Copia de .env.example a .env
2. Solicita credenciales de Supabase
3. Prueba la conexión a la base de datos

Uso:
    python setup.py
"""

import os
import sys
import getpass
from pathlib import Path

def setup():
    """Ejecuta el setup interactivo."""
    
    print("=" * 70)
    print("🚀 CONFIGURACIÓN AUTOMÁTICA - RENDER + SUPABASE")
    print("=" * 70)
    
    # Cambiar a carpeta backend
    backend_dir = Path(__file__).parent / "backend"
    os.chdir(backend_dir)
    
    # 1. Copiar .env.example a .env
    print("\n1️⃣  Creando archivo .env...")
    env_example = Path(".env.example")
    env_file = Path(".env")
    
    if env_file.exists():
        response = input("   .env ya existe. ¿Sobrescribir? (s/n): ").lower()
        if response != 's':
            print("   ✓ Usando .env existente")
        else:
            env_file.write_text(env_example.read_text())
            print("   ✓ .env creado desde .env.example")
    else:
        env_file.write_text(env_example.read_text())
        print("   ✓ .env creado desde .env.example")
    
    # 2. Solicitar credenciales
    print("\n2️⃣  Configurar credenciales de Supabase...")
    print("   Obtén esta información en: https://app.supabase.com")
    print("   Settings → Database → Connection String")
    
    database_url = input("\n   Ingresa tu DATABASE_URL: ").strip()
    
    if not database_url.startswith("postgresql://"):
        print("   ❌ URL debe comenzar con 'postgresql://'")
        return False
    
    # 3. Solicitar CORS_ORIGINS
    print("\n3️⃣  Configurar CORS_ORIGINS...")
    print("   Ejemplo: http://localhost:3000,http://localhost:5173")
    
    cors_origins = input("   CORS_ORIGINS (separadas por comas): ").strip()
    if not cors_origins:
        cors_origins = "http://localhost:3000,http://localhost:5173"
    
    # 4. Actualizar .env
    print("\n4️⃣  Actualizando archivo .env...")
    env_content = env_file.read_text()
    env_content = env_content.replace(
        "DATABASE_URL=postgresql://user:password@db.xxxxxx.supabase.co:5432/postgres",
        f"DATABASE_URL={database_url}"
    )
    env_content = env_content.replace(
        "CORS_ORIGINS=http://localhost:3000,http://localhost:5173,https://your-render-frontend.onrender.com",
        f"CORS_ORIGINS={cors_origins}"
    )
    env_file.write_text(env_content)
    print("   ✓ Variables actualizadas")
    
    # 5. Probar conexión
    print("\n5️⃣  Probando conexión a la base de datos...")
    try:
        from sqlalchemy import create_engine, text
        
        engine = create_engine(database_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT NOW()"))
            timestamp = result.scalar()
            print(f"   ✓ Conexión exitosa: {timestamp}")
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
        print("   Verifica que DATABASE_URL sea correcto")
        return False
    
    # 6. Resumen
    print("\n" + "=" * 70)
    print("✅ CONFIGURACIÓN COMPLETADA")
    print("=" * 70)
    print("\n📝 Próximos pasos:")
    print("   1. Prueba localmente:")
    print("      python -m uvicorn app:app --reload")
    print("")
    print("   2. Para migrar datos de SQLite:")
    print("      python migrate_to_postgres.py")
    print("")
    print("   3. Para desplegar en Render:")
    print("      - Sube cambios a GitHub: git push")
    print("      - Ve a https://dashboard.render.com")
    print("      - Conecta tu repositorio")
    print("      - Agrega variables de entorno")
    print("")
    print("   📖 Consulta DEPLOYMENT_GUIDE.md para detalles completos")
    print("=" * 70)
    
    return True

if __name__ == "__main__":
    try:
        success = setup()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Configuración cancelada")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
