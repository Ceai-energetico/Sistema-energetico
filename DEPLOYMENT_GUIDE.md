# 🚀 Guía de Deployment: Render + Supabase PostgreSQL

## 📋 Índice
1. [Configuración de Supabase](#1-configuración-de-supabase)
2. [Configuración de Render](#2-configuración-de-render)
3. [Pruebas locales](#3-pruebas-locales)
4. [Solución de problemas](#4-solución-de-problemas)

---

## 1. Configuración de Supabase

### Paso 1.1: Obtener la cadena de conexión

1. Ve a [Supabase Console](https://app.supabase.com)
2. Selecciona tu proyecto
3. En el panel izquierdo, ve a **Settings** → **Database**
4. Busca **Connection string** (en la sección "Connection pooling" o "Direct connection")
5. Copia la cadena que empieza con `postgresql://`
6. Reemplaza `[YOUR-PASSWORD]` con la contraseña que configuraste

**Debería verse así:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

### Paso 1.2: Crear una tabla de prueba en Supabase (Opcional)

1. En Supabase, ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia y ejecuta este SQL para verificar que funciona:

```sql
CREATE TABLE sedes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    ciudad VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);
```

4. Si se crea sin errores, ¡tu base de datos funciona!

---

## 2. Configuración de Render

### Paso 2.1: Crear un nuevo servicio en Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Haz clic en **+ New** → **Web Service**
3. Selecciona tu repositorio GitHub (o conecta uno)
4. Configura:
   - **Name:** `sistema-energetico-api`
   - **Environment:** Python 3
   - **Region:** Ohio (más cercano a Latinoamérica)
   - **Branch:** main
   - **Build Command:**
     ```
     pip install -r backend/requirements.txt
     ```
   - **Start Command:**
     ```
     gunicorn -w 4 -b 0.0.0.0:10000 backend.app:app
     ```

### Paso 2.2: Configurar variables de entorno

1. En la página del servicio en Render, ve a **Environment**
2. Haz clic en **Add Environment Variable**
3. Agrega estas variables:

| Clave | Valor |
|-------|-------|
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres` |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173,https://tu-frontend.onrender.com` |
| `ENVIRONMENT` | `production` |

**⚠️ Importante:** Reemplaza `[PASSWORD]` con tu contraseña real de Supabase

### Paso 2.3: Hacer deploy

1. Haz clic en **Create Web Service**
2. Render automáticamente:
   - Instala dependencias
   - Construye la app
   - Inicia el servidor
3. Espera a ver el estado **Live** (puede tomar 2-5 minutos)
4. Copia la URL de tu servicio (ej: `https://sistema-energetico-api.onrender.com`)

### Paso 2.4: Verificar que funciona

```bash
curl https://sistema-energetico-api.onrender.com/api/health
```

Deberías ver:
```json
{"status":"ok"}
```

---

## 3. Pruebas Locales

### Paso 3.1: Configurar ambiente local

1. Ve a la carpeta del proyecto:
   ```bash
   cd "c:\Users\Aprendiz\Desktop\Sistema energetico"
   ```

2. Activa el virtual environment:
   ```bash
   .venv\Scripts\Activate.ps1
   ```

3. Instala dependencias:
   ```bash
   pip install -r backend/requirements.txt
   ```

### Paso 3.2: Crear archivo `.env` local

Crea un archivo `.env` en la carpeta `backend/`:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
ENVIRONMENT=development
```

**⚠️ NOTA:** Este archivo NO se debe comitear a Git (está en .gitignore)

### Paso 3.3: Prueba local

```bash
cd backend
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Deberías ver:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Visita: http://localhost:8000/api/health

---

## 4. Solución de Problemas

### Error: "could not translate host name"
**Causa:** La cadena de conexión está mal o no tiene conexión a internet.
**Solución:**
- Verifica que copiaste bien la URL de Supabase
- Asegúrate que tienes acceso a internet
- Prueba en otra red (hotspot del teléfono)

### Error: "password authentication failed"
**Causa:** La contraseña en la URL está mal.
**Solución:**
- Ve a Supabase → Settings → Database → Reset Password
- Copia la nueva contraseña en la URL

### Error: "CORS error" en el frontend
**Causa:** El frontend no está en la lista de CORS_ORIGINS.
**Solución:**
- Ve a Render → Environment
- Edita `CORS_ORIGINS` y agrega tu URL de frontend

### Error: "ModuleNotFoundError: No module named 'psycopg2'"
**Causa:** No instalaste las dependencias.
**Solución:**
```bash
pip install -r backend/requirements.txt
```

### Render muestra "Build failed"
**Verificar:**
1. ¿El comando build está correcto? (debe ser `pip install -r backend/requirements.txt`)
2. ¿El archivo requirements.txt existe?
3. ¿Hay errores de sintaxis en Python?

Revisa los logs en Render → Logs

---

## 📝 Checklist Final

- [ ] Supabase PostgreSQL está activo
- [ ] Obtuviste la cadena de conexión
- [ ] Configuraste las variables en Render
- [ ] El deploy de Render está "Live"
- [ ] `/api/health` retorna OK
- [ ] CORS_ORIGINS incluye tu frontend
- [ ] El `.env` está en `.gitignore`
- [ ] Hiciste `git add .` y `git commit`
- [ ] Hiciste `git push` para que Render redeploy

---

## 🔗 URLs Útiles

- Supabase: https://app.supabase.com
- Render: https://dashboard.render.com
- Logs de Render: https://dashboard.render.com/services/[YOUR-SERVICE-ID]/logs
- API Health: https://tu-api.onrender.com/api/health

---

**¡Listo! Tu aplicación está en la nube 🎉**

Si tienes problemas, verifica los logs en Render o pregunta en la comunidad.
