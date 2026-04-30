# 🌱 Aplicativo Revisión Energética - SENA CEAI

[![Estado: En Producción](https://img.shields.io/badge/Estado-En%20Producci%C3%B3n-green.svg)](https://github.com)
[![Versión](https://img.shields.io/badge/Versi%C3%B3n-1.0.0-blue.svg)](https://github.com)
[![Licencia](https://img.shields.io/badge/Licencia-MIT-purple.svg)](LICENSE)

## 📝 Descripción

**Aplicativo Revisión Energética** es una solución completa para auditoría, monitoreo y análisis del consumo energético en sedes del SENA. Permite registrar equipos, calcular consumo energético, generar reportes y exportar datos en formato Excel.

### ✨ Características Principales

✅ **Gestión de Inventario de Equipos**
- Registro completo de equipos por categoría
- Múltiples tipos: Maquinaria, TIC, Iluminación, Refrigeración, etc.
- Adjuntar evidencia fotográfica

✅ **Cálculo Automático de Consumo**
- Consumo energético estimado (kWh/mes)
- Potencia total calculada
- Valor económico (COP)

✅ **Formato de Valores en COP**
- Valores unitarios en pesos colombianos
- Separadores de miles automáticos
- Visualización en tiempo real

✅ **Formulario 088 Completo**
- Información general de la sede
- Régimen de trabajo
- Matriz energética mensual
- Usos significativos de energía
- Caracterización detallada

✅ **Exportación de Datos**
- Descarga en Excel con 21+ columnas
- Información completa del inventario
- Datos calculados incluidos

✅ **Interfaz Responsive**
- Funciona perfectamente en móvil, tablet y desktop
- Menú adaptable con hamburguesa en móvil
- Diseño elegante y moderno

---

## 🚀 Inicio Rápido

### Para Usuarios

**Ver [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md) para instrucciones completas**

Ingresar con:
```
Correo: ceaienergetico@gmail.com
Contraseña: Energetico2026
```

### Para Desarrolladores

1. Clonar repositorio
2. Crear virtualenv y instalar dependencias
3. Configurar `.env` con credenciales Supabase
4. Ejecutar `python backend/app.py`

**Ver [QUICK_START.md](./QUICK_START.md) para detalles**

---

## 📊 Funcionalidades

### Gestión de Equipos
- ➕ Agregar equipos con formulario completo
- 👁️ Ver detalles de cada equipo
- ✏️ Editar información
- 🗑️ Eliminar equipos
- 📷 Adjuntar fotos como evidencia

### Valores en COP (Pesos Colombianos)
```
Ingresa:  1000000
Muestra: $1.000.000 COP
```
- Separadores de miles automáticos
- Visualización en tiempo real
- Exportación correcta

### Exportación
- 📊 Descargar Excel con 21+ columnas
- Incluye: Valor Unitario, Valor Total, Consumo calculado
- Todo en formato COP

### Revisión 088
- Formulario técnico completo
- Matriz energética mensual
- Usos significativos
- Caracterización detallada

---

## 📱 Responsive

- ✅ Móvil (360px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Menú hamburguesa en móvil
- ✅ Diseño elegante y adaptable

---

## 🗄️ Tecnología

- **Frontend:** React 17+
- **Backend:** Python + Flask
- **Database:** PostgreSQL (Supabase)
- **Hosting:** Render
- **Gráficos:** Chart.js

---

## 📚 Documentación

| Archivo | Contenido |
|---------|-----------|
| [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md) | Guía completa del usuario |
| [QUICK_START.md](./QUICK_START.md) | Inicio rápido para desarrollo |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Guía de despliegue |

---

## ❓ FAQ

**¿Funciona en móvil?** Sí, completamente optimizado.

**¿Dónde se guardan los datos?** En PostgreSQL con respaldos automáticos.

**¿Puedo descargar los datos?** Sí, todo a Excel con un clic.

**¿Cuánto cuesta?** Render y Supabase tienen planes gratuitos.

---

## 🐛 Soporte

- Problemas técnicos: Contacta al administrador
- Preguntas de uso: Ver [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md)
- Instalación: Ver [QUICK_START.md](./QUICK_START.md)

---

**Versión:** 1.0.0 | **Estado:** En Producción ✅ | **Última actualización:** Abril 2026
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

