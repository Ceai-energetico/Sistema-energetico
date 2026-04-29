# Sistema Energético - Auditoría de Consumo

Aplicación web para auditoría y análisis de consumo energético en instalaciones del SENA.

## 🚀 Cambios Recientes (Actualizado para Render + Supabase)

Este proyecto ha sido actualizado para:
- ✅ Usar **PostgreSQL** en lugar de SQLite (via Supabase)
- ✅ Desplegarse en **Render** (hosting gratuito)
- ✅ Configuración con variables de entorno
- ✅ CORS configurado para múltiples orígenes

## 📋 Requisitos Previos

- Python 3.8+
- Git
- Cuenta en Supabase (gratuita)
- Cuenta en Render (gratuita)

## 🔧 Instalación Local

### 1. Clonar y configurar

```bash
cd "c:\Users\Aprendiz\Desktop\Sistema energetico"
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` en la carpeta `backend/`:

```bash
copy backend\.env.example backend\.env
```

Edita `backend/.env` con tus credenciales de Supabase:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
ENVIRONMENT=development
```

### 3. Ejecutar localmente

```bash
cd backend
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Visita: http://localhost:8000

## 🚢 Deployment en Render + Supabase

### Paso a Paso Completo

Sigue la **[Guía de Deployment](./DEPLOYMENT_GUIDE.md)** para:
1. Crear base de datos PostgreSQL en Supabase
2. Configurar y desplegar en Render
3. Migrar datos (si tienes datos en SQLite local)
4. Verificar que todo funciona

### Migración de Datos (Si vienes de SQLite)

```bash
# En la carpeta backend, con .env configurado
python migrate_to_postgres.py
```

## 📁 Estructura del Proyecto

```
Sistema energetico/
├── backend/
│   ├── app.py                      # API FastAPI
│   ├── requirements.txt            # Dependencias Python
│   ├── .env.example               # Template de variables de entorno
│   ├── seed_data.py               # Datos de demostración
│   └── migrate_to_postgres.py     # Script de migración
├── frontend/
│   ├── index.html
│   ├── app.jsx
│   └── styles.css
├── DEPLOYMENT_GUIDE.md            # Guía de deployment
├── .gitignore                      # Archivos a ignorar en Git
├── render.yaml                     # Configuración para Render
└── README.md                       # Este archivo
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado de la API |
| GET | `/api/sedes` | Listar todas las sedes |
| GET | `/api/sedes/{id}` | Obtener una sede |
| POST | `/api/sedes/{id}/revision088` | Crear revisión 088 |
| GET | `/api/sedes/{id}/revision088` | Obtener revisiones 088 |

## 🌍 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Conexión PostgreSQL | `postgresql://...` |
| `CORS_ORIGINS` | Orígenes permitidos | `http://localhost:3000` |
| `ENVIRONMENT` | development o production | `production` |

## 📝 Archivos Nuevos/Modificados

- **`backend/requirements.txt`**: Agregados `psycopg2-binary`, `python-dotenv`, `gunicorn`
- **`backend/app.py`**: Actualizado para usar PostgreSQL y CORS
- **`backend/.env.example`**: Template de variables
- **`backend/migrate_to_postgres.py`**: Script de migración
- **`.gitignore`**: Mejorado para ignorar archivos sensibles
- **`render.yaml`**: Configuración de Render
- **`DEPLOYMENT_GUIDE.md`**: Guía paso a paso

## 🐛 Solución de Problemas

### Error de conexión a base de datos
1. Verifica que DATABASE_URL es correcto en Render
2. Asegúrate de tener acceso a internet
3. Revisa los logs en Render Dashboard

### CORS Error
1. Agranda tu URL de frontend a `CORS_ORIGINS` en Render
2. Incluye `http://localhost:3000` para desarrollo local

### Módulo no encontrado
```bash
pip install -r backend/requirements.txt
```

Consulta `DEPLOYMENT_GUIDE.md` para más soluciones.

## 🎓 Credenciales de Acceso

Para obtener tu `DATABASE_URL` de Supabase:
1. Ve a [Supabase Console](https://app.supabase.com)
2. Settings → Database → Connection String
3. Copia la URL y reemplaza `[YOUR-PASSWORD]`

## 📞 Soporte

Si encuentras problemas:
1. Revisa `DEPLOYMENT_GUIDE.md` - Sección "Solución de Problemas"
2. Verifica los logs en Render
3. Consulta la documentación oficial:
   - [FastAPI Docs](https://fastapi.tiangolo.com)
   - [Render Docs](https://render.com/docs)
   - [Supabase Docs](https://supabase.com/docs)

---

**Última actualización**: Abril 2026

¡Listo para desplegar en la nube! 🚀

