# 📖 Índice de Documentación - Aplicativo Revisión Energética

## 🎯 ¿Dónde Encontrar lo Que Necesitas?

### 👨‍💼 Si Eres Usuario del Sistema

**Empiezo aquí:**
1. [QUICK_START.md](./QUICK_START.md) ← Para acceder por primera vez
2. [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md) ← Guía completa paso a paso

**Preguntas comunes:**
- ¿Cómo inicio sesión? → [Manual: Acceso al Sistema](./MANUAL_DE_USUARIO.md#-acceso-al-sistema)
- ¿Cómo agrego equipos? → [Manual: Agregar Equipo](./MANUAL_DE_USUARIO.md#-agregar-nuevo-equipo)
- ¿Dónde ingreso el valor? → [Manual: Campo Valor Unitario](./MANUAL_DE_USUARIO.md#-campo-valor-unitario)
- ¿Cómo agrego fotos? → [Manual: Fotos/Evidencias](./MANUAL_DE_USUARIO.md#-fotosevidencias)
- ¿Cómo descargo datos? → [Manual: Exportar Excel](./MANUAL_DE_USUARIO.md#-exportar-a-excel-)
- ¿Qué es Revisión 088? → [Manual: Revisión 088](./MANUAL_DE_USUARIO.md#-revisión-088---formulario-completo)

---

### 👨‍💻 Si Eres Desarrollador

**Empiezo aquí:**
1. [README.md](./README.md) ← Visión general del proyecto
2. [QUICK_START.md](./QUICK_START.md) ← Instalación local
3. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) ← Desplegar en producción

**Información técnica:**
- Stack: React + Flask + PostgreSQL
- Base de datos: [README: Base de Datos](./README.md#-base-de-datos)
- API endpoints: Documentadas en código
- Variables de entorno: Documento `.env.example`

---

### 🔄 Si Quieres Ver Qué Se Cambió

**Lee aquí:**
→ [CAMBIOS_REALIZADOS.md](./CAMBIOS_REALIZADOS.md)

Incluye:
- ✅ Cambios en valor unitario (COP)
- ✅ Cambios en header (responsive)
- ✅ Nuevas columnas en Excel (21 en lugar de 12)
- ✅ Documentación creada
- ✅ Cómo verificar los cambios

---

### 📋 Si Quieres Conocer Todas las Características

**Lee aquí:**
→ [FEATURES.md](./FEATURES.md)

Incluye:
- Autenticación y acceso
- Gestión de inventario
- Sistema COP
- Cálculos automáticos
- Filtros y búsqueda
- Exportación Excel
- Revisión 088
- Consolidado energético
- Responsive design
- Y mucho más...

---

## 📚 Índice Rápido de Archivos

```
📁 Sistema energetico/
│
├── 📖 DOCUMENTOS DE REFERENCIA
│   ├── 📄 README.md ........................ Descripción general del proyecto
│   ├── 📄 MANUAL_DE_USUARIO.md ........... Guía completa del usuario (500+ líneas)
│   ├── 📄 QUICK_START.md ................. Inicio rápido para desarrollo
│   ├── 📄 DEPLOYMENT_GUIDE.md ........... Guía de despliegue en Render
│   ├── 📄 FEATURES.md .................... Catálogo completo de características
│   ├── 📄 CAMBIOS_REALIZADOS.md ......... Lo que se modificó recientemente
│   └── 📄 INDEX.md (este archivo)........ Índice de documentación
│
├── 📁 frontend/
│   ├── 📄 app.jsx ....................... Aplicación principal (React)
│   ├── 📄 revision088.jsx ............... Formulario 088
│   ├── 📄 index.html .................... HTML base
│   └── 📄 styles.css .................... Estilos CSS
│
├── 📁 backend/
│   ├── 📄 app.py ....................... API Flask
│   ├── 📄 requirements.txt .............. Dependencias Python
│   ├── 📄 migrate_to_postgres.py ....... Migración a PostgreSQL
│   └── 📄 seed_data.py ................. Datos de prueba
│
├── 🔧 CONFIGURACIÓN
│   ├── 📄 .env.example ................. Variables de entorno
│   ├── 📄 render.yaml .................. Config Render
│   └── 📄 setup.py ..................... Setup del proyecto
│
└── 📊 DATOS
    ├── 📄 analizar_excel.py ........... Utilidad para analizar
    └── 📄 bootstrap_create_project.py  Inicialización
```

---

## 🎯 Casos de Uso - Dónde Buscar

### Caso 1: "Quiero usar el sistema"
```
MANUAL_DE_USUARIO.md → Leerlo completo → Empezar
```

### Caso 2: "¿Cómo agrego un equipo con valor en COP?"
```
MANUAL_DE_USUARIO.md → Sección "Gestión de Equipos" → "Agregar Nuevo Equipo"
→ "Campo: Valor Unitario"
```

### Caso 3: "¿Qué cambios se hicieron?"
```
CAMBIOS_REALIZADOS.md → Leerlo completo
```

### Caso 4: "Quiero descargar datos en Excel"
```
MANUAL_DE_USUARIO.md → "Exportación de Datos" → "Exportar a Excel"
```

### Caso 5: "¿Funciona en móvil?"
```
FEATURES.md → "Responsive Design"
O
README.md → "Responsive"
```

### Caso 6: "¿Cómo instalo localmente?"
```
QUICK_START.md → Seguir pasos
```

### Caso 7: "¿Cómo despliego en producción?"
```
DEPLOYMENT_GUIDE.md → Seguir pasos
```

### Caso 8: "¿Cuáles son todas las características?"
```
FEATURES.md → Leerlo completo
```

### Caso 9: "¿Cuáles son los campos de cada equipo?"
```
FEATURES.md → "Gestión de Equipos" → "Agregar Equipo"
O
MANUAL_DE_USUARIO.md → Formulario detallado
```

### Caso 10: "¿Qué columnas tiene el Excel?"
```
CAMBIOS_REALIZADOS.md → "Exportación a Excel - EXPANDIDA"
O
FEATURES.md → "Exportación a Excel" → "Contenido del Archivo"
```

---

## 🔤 Búsqueda Rápida por Palabra Clave

| Palabra Clave | Archivo | Sección |
|---|---|---|
| Valor unitario | MANUAL_DE_USUARIO.md | Campo: Valor Unitario |
| Cálculo | FEATURES.md | Cálculos Automáticos |
| COP | README.md | Valores en COP |
| Móvil | FEATURES.md | Responsive Design |
| Exportar | MANUAL_DE_USUARIO.md | Exportación de Datos |
| Fotos | MANUAL_DE_USUARIO.md | Fotos/Evidencias |
| Revisión 088 | MANUAL_DE_USUARIO.md | Revisión 088 |
| Instalar | QUICK_START.md | Instalación |
| Desplegar | DEPLOYMENT_GUIDE.md | Completo |
| Excel | FEATURES.md | Exportación a Excel |

---

## 📊 Estructura de Documentación

```
REFERENCIA RÁPIDA
    ↓
    ├─→ ¿Usuario? → MANUAL_DE_USUARIO.md
    ├─→ ¿Desarrollador? → README.md + QUICK_START.md
    ├─→ ¿Quiero ver cambios? → CAMBIOS_REALIZADOS.md
    ├─→ ¿Quiero todas las features? → FEATURES.md
    ├─→ ¿Voy a desplegar? → DEPLOYMENT_GUIDE.md
    └─→ ¿Necesito algo específico? → INDEX.md (este archivo)
```

---

## ✨ Lo Que Encontrarás en Cada Archivo

### 📄 README.md
- **Para:** Todos (especialmente nuevos usuarios)
- **Contenido:** Descripción, características, stack técnico
- **Tamaño:** Completo pero conciso
- **Tiempo de lectura:** 5-10 minutos

### 📄 MANUAL_DE_USUARIO.md
- **Para:** Usuarios finales
- **Contenido:** Guía paso a paso de todas las funciones
- **Tamaño:** Muy completo (500+ líneas)
- **Tiempo de lectura:** 30-45 minutos (o por secciones)

### 📄 QUICK_START.md
- **Para:** Desarrolladores
- **Contenido:** Cómo instalar y ejecutar localmente
- **Tamaño:** Conciso
- **Tiempo de lectura:** 10-15 minutos

### 📄 DEPLOYMENT_GUIDE.md
- **Para:** Administradores/DevOps
- **Contenido:** Cómo desplegar en Render y Supabase
- **Tamaño:** Detallado
- **Tiempo de lectura:** 15-20 minutos

### 📄 FEATURES.md
- **Para:** Técnicos interesados
- **Contenido:** Catálogo completo de características con tablas
- **Tamaño:** Muy detallado (15 secciones)
- **Tiempo de lectura:** 20-30 minutos

### 📄 CAMBIOS_REALIZADOS.md
- **Para:** Todos (para saber qué es nuevo)
- **Contenido:** Cambios recientes con comparativas antes/después
- **Tamaño:** Completo
- **Tiempo de lectura:** 15-20 minutos

---

## 🎓 Orden Recomendado de Lectura

### Para Usuario Nuevo
1. Este archivo (2 min)
2. QUICK_START.md si tienes dudas (10 min)
3. MANUAL_DE_USUARIO.md completamente (45 min)
4. Usa el sistema (práctica)

### Para Desarrollador Nuevo
1. README.md (10 min)
2. QUICK_START.md (15 min)
3. FEATURES.md (30 min)
4. Revisa código en `frontend/` y `backend/`
5. DEPLOYMENT_GUIDE.md cuando necesites desplegar

### Para Verificar Cambios
1. CAMBIOS_REALIZADOS.md (20 min)
2. Prueba los cambios en el sistema
3. Lee FEATURES.md si quieres contexto

---

## 🔗 Enlaces Útiles

**Dentro del Proyecto:**
- [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md) - Guía usuario
- [README.md](./README.md) - Visión general
- [QUICK_START.md](./QUICK_START.md) - Inicio rápido
- [FEATURES.md](./FEATURES.md) - Características
- [CAMBIOS_REALIZADOS.md](./CAMBIOS_REALIZADOS.md) - Novedades

**Externas:**
- [Render.com](https://render.com) - Hosting
- [Supabase](https://supabase.com) - Base de datos
- [React Documentation](https://react.dev) - React
- [Flask Documentation](https://flask.palletsprojects.com) - Flask

---

## ❓ ¿Todavía No Encuentras lo Que Necesitas?

1. **Busca en este archivo** con Ctrl+F (Windows) o Cmd+F (Mac)
2. **Ve a la sección correspondiente** en la tabla de contenidos
3. **Lee la sección "Preguntas Frecuentes"** en MANUAL_DE_USUARIO.md
4. **Contacta al administrador** si el problema persiste

---

## 📞 Soporte Rápido

| Problema | Solución |
|----------|----------|
| No puedo iniciar sesión | MANUAL_DE_USUARIO.md → Acceso |
| No entiendo cómo agregar equipo | MANUAL_DE_USUARIO.md → Gestión |
| ¿Valor en COP? | CAMBIOS_REALIZADOS.md → Valor Unitario |
| ¿Funciona en móvil? | README.md → Responsive |
| Quiero desplegar | DEPLOYMENT_GUIDE.md |
| Instalar localmente | QUICK_START.md |

---

**Documentación actualizada:** Abril 2026  
**Versión:** 1.0.0  
**Última revisión:** Hoy ✅

---

## 🎉 ¿Listo para Empezar?

👉 **Usuario:** Ve a [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md)  
👉 **Desarrollador:** Ve a [README.md](./README.md)  
👉 **Ver cambios:** Ve a [CAMBIOS_REALIZADOS.md](./CAMBIOS_REALIZADOS.md)  

¡Bienvenido! 🌱

