# 📋 CHECKLIST: Deployment en Render + Supabase

## 🎯 Objetivo
Desplegar tu aplicación de Sistema Energético en Render con PostgreSQL (Supabase)

---

## FASE 1: PREPARACIÓN LOCAL ✅
- [ ] Leer este checklist completamente
- [ ] Abrir terminal en: `c:\Users\Aprendiz\Desktop\Sistema energetico`
- [ ] Activar virtual env: `.venv\Scripts\Activate.ps1`

## FASE 2: CONFIGURACIÓN ✅
- [ ] Ejecutar setup automático: `python setup.py`
  - Ingresa tu DATABASE_URL de Supabase
  - Ingresa tu CORS_ORIGINS
- [ ] O configurar manualmente:
  - [ ] Copiar `backend\.env.example` → `backend\.env`
  - [ ] Editar `backend\.env` con credenciales de Supabase

## FASE 3: VERIFICACIÓN LOCAL ✅
- [ ] Instalar dependencias: `pip install -r backend/requirements.txt`
- [ ] Prueba rápida:
  ```bash
  cd backend
  python -m uvicorn app:app --reload
  ```
- [ ] Visita http://localhost:8000/api/health
- [ ] Deberías ver: `{"status":"ok"}`

## FASE 4: MIGRACIÓN DE DATOS (OPCIONAL) ✅
**Solo si tienes datos en SQLite local:**
- [ ] Ir a carpeta backend: `cd backend`
- [ ] Ejecutar: `python migrate_to_postgres.py`
- [ ] Esperar confirmación ✓

## FASE 5: PREPARAR GIT ✅
- [ ] Verificar que `.env` está en `.gitignore`
- [ ] `git status` - NO debe mostrar `.env`
- [ ] `git add .` - Agregar todos los cambios
- [ ] `git commit -m "feat: migrate to PostgreSQL and Render deployment"`
- [ ] `git push` - Enviar a GitHub

## FASE 6: CONFIGURAR SUPABASE ✅

### Opción A: Ya tienes proyecto Supabase
- [ ] Ve a https://app.supabase.com
- [ ] Settings → Database → Connection String
- [ ] Copia: `postgresql://postgres:PASSWORD@db.xxxx.supabase.co:5432/postgres`
- [ ] Reemplaza `PASSWORD` con tu contraseña

### Opción B: Crear nuevo proyecto
- [ ] Ve a https://app.supabase.com → New project
- [ ] Nombre: `sistema-energetico`
- [ ] Región: São Paulo (o más cercana)
- [ ] Contraseña: Guarda en lugar seguro
- [ ] Espera a que se cree (3-5 min)
- [ ] Copia la cadena de conexión

## FASE 7: CONFIGURAR RENDER ✅

### Crear servicio web
- [ ] Ve a https://dashboard.render.com
- [ ] Haz clic: **+ New** → **Web Service**
- [ ] Conecta tu repositorio GitHub
- [ ] Llena los datos:
  | Campo | Valor |
  |-------|-------|
  | Name | `sistema-energetico-api` |
  | Environment | Python 3 |
  | Region | Ohio |
  | Build Command | `pip install -r backend/requirements.txt` |
  | Start Command | `gunicorn -w 4 -b 0.0.0.0:10000 backend.app:app` |

### Configurar variables de entorno
- [ ] En Render, ir a **Environment**
- [ ] Agregar estas variables:
  ```
  DATABASE_URL = postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres
  CORS_ORIGINS = https://tu-frontend-url.onrender.com
  ENVIRONMENT = production
  ```
- [ ] Haz clic en **Create Web Service**
- [ ] Espera a que compile (2-5 minutos)

### Verificar deployment
- [ ] Estado debe ser **Live** (verde)
- [ ] Copia tu URL (ej: https://sistema-energetico-api.onrender.com)
- [ ] Prueba: `curl https://tu-url.onrender.com/api/health`
- [ ] Deberías ver: `{"status":"ok"}`

## FASE 8: CONFIGURAR FRONTEND (Si lo despliegas)
- [ ] Actualizar API_BASE_URL en frontend a: `https://tu-backend-url.onrender.com`
- [ ] Desplegar frontend en Render o Vercel
- [ ] Agregar URL del frontend a `CORS_ORIGINS` en backend

## FASE 9: PRUEBAS FINALES ✅
- [ ] ✅ API health está OK
- [ ] ✅ Base de datos responde
- [ ] ✅ Puedes acceder desde frontend
- [ ] ✅ Los datos se guardan correctamente
- [ ] ✅ Sin errores CORS

---

## 🎉 ¡LISTO!

Tu aplicación está en vivo en:
- **Backend**: https://sistema-energetico-api.onrender.com
- **Database**: Supabase PostgreSQL

---

## 📞 SI HAY PROBLEMAS

1. **Error de compilación en Render**
   - Ve a: Render → Logs
   - Busca línea roja (error)
   - Verifica que `requirements.txt` tenga todas las dependencias

2. **Error de conexión a BD**
   - Verifica DATABASE_URL en Render
   - Abre https://app.supabase.com para confirmar credenciales

3. **CORS error en frontend**
   - Agrega tu URL de frontend a CORS_ORIGINS
   - Espera 1 min para que Render redeploy automáticamente

4. **Migración de datos fallida**
   - Verifica que PostgreSQL está activo
   - Ejecuta: `python migrate_to_postgres.py` nuevamente

---

## 📚 REFERENCIAS

- [Guía Completa](./DEPLOYMENT_GUIDE.md)
- [Documentación FastAPI](https://fastapi.tiangolo.com)
- [Documentación Render](https://render.com/docs)
- [Documentación Supabase](https://supabase.com/docs)

---

**Fecha**: Abril 2026  
**Estado**: ✅ Listo para producción

