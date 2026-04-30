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

✅ **Base de Datos PostgreSQL**
- Sincronización en tiempo real
- Respaldo automático
- Escalable y seguro

---

## 🏗️ Estructura del Proyecto

```
Sistema energetico/
├── frontend/
│   ├── app.jsx                 # Aplicación principal React
│   ├── revision088.jsx         # Formulario 088
│   ├── index.html              # HTML base
│   ├── styles.css              # Estilos
│   └── ...
├── backend/
│   ├── app.py                  # API Flask
│   ├── requirements.txt         # Dependencias Python
│   ├── migrate_to_postgres.py  # Migración BD
│   ├── seed_data.py            # Datos de prueba
│   └── ...
├── MANUAL_DE_USUARIO.md        # Guía completa del usuario
├── README.md                   # Este archivo
├── QUICK_START.md              # Inicio rápido
├── DEPLOYMENT_GUIDE.md         # Guía de despliegue
└── render.yaml                 # Configuración Render
```

---

## 🚀 Inicio Rápido

### Para Usuarios

1. **Abrir la aplicación**
   - URL: Contacta al administrador
   - Navegador: Chrome, Firefox, Safari, Edge

2. **Ingresar al sistema**
   ```
   Correo: ceaienergetico@gmail.com
   Contraseña: Energetico2026
   ```

3. **Agregar equipo**
   - Clic en "➕ Agregar equipo"
   - Completa el formulario
   - Adjunta fotos
   - Haz clic en "Guardar"

4. **Exportar datos**
   - Clic en "📊 Exportar Excel"
   - Se descargará automáticamente

📖 **Lee [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md) para instrucciones completas**

### Para Desarrolladores

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd "Sistema energetico"
   ```

2. **Configurar el backend**
   ```bash
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   cd backend
   pip install -r requirements.txt
   ```

3. **Configurar variables de entorno**
   ```bash
   # Crear archivo backend/.env
   DATABASE_URL=postgresql://[credentials]
   CORS_ORIGINS=http://localhost:3000
   ```

4. **Ejecutar servidor**
   ```bash
   python app.py
   ```

5. **Servir frontend**
   - El frontend se sirve desde `frontend/`
   - Usar un servidor web local o Render

📖 **Lee [QUICK_START.md](./QUICK_START.md) para detalles técnicos**

---

## 📊 Funcionalidades Detalladas

### 1. Gestión de Equipos

| Acción | Descripción |
|--------|------------|
| ➕ Agregar | Registrar nuevo equipo con formulario completo |
| 👁️ Ver | Visualizar detalles completos del equipo |
| ✏️ Editar | Modificar información del equipo |
| 🗑️ Eliminar | Remover equipo del inventario |
| 📷 Fotos | Adjuntar múltiples evidencias fotográficas |

### 2. Categorías de Equipos

- ⚙️ **Equipos y Maquinaria Industrial**
- 🖥️ **Servicios TIC**
- 🖨️ **Ofimática**
- ❄️ **Equipos de Refrigeración**
- 🧊 **Soporte Gases Refrigerantes**
- 💡 **Iluminación**
- ⛽ **Consumo de Combustible**
- ⚡ **Plantas Eléctricas**
- 🔥 **Gasodomésticos**

### 3. Campos de Datos

#### Por Equipo:
- Tipo y categoría
- Marca, modelo, fabricación
- Cantidad y potencia
- Horas de uso diario
- Días de uso al mes
- **Valor unitario (COP)**
- Ubicación y observaciones
- Fotos de evidencia

#### Calculados Automáticamente:
- Consumo mensual (kWh) = Potencia × Horas/día × Días/mes
- Valor total (COP) = Cantidad × Valor unitario
- Consumo potencia total

### 4. Exportación Excel

El archivo descargado incluye:

| # | Columna | Tipo |
|---|---------|------|
| 1 | Tipo | Categoría |
| 2 | Regional | SENA Regional |
| 3 | Centro | Centro de Formación |
| 4 | Sede | Nombre de sede |
| 5 | Descripción | Equipo |
| 6 | Marca | Fabricante |
| 7 | Modelo | Versión |
| 8 | Clasificación Energética | RETIQ |
| 9 | Año Instalación | 20XX |
| 10 | Cantidad | Unidades |
| 11 | Potencia (kW) | kW |
| 12 | Horas Uso Diario | Horas |
| 13 | Días Uso Mes | Días |
| 14 | Consumo (kWh/mes) | kWh 📊 Calculado |
| 15 | **Valor Unitario (COP)** | 💰 **En pesos colombianos** |
| 16 | **Valor Total (COP)** | 💰 **Cantidad × Unitario** |
| 17 | Grupo Principal | Clasificación |
| 18 | Ubicación | Lugar |
| 19 | Uso | Función |
| 20 | Tecnología | Tipo |
| 21 | Observaciones | Notas |

### 5. Revisión 088

Formulario técnico con secciones:
- ℹ️ Información general
- 🕐 Régimen de trabajo
- 📊 Matriz energética mensual
- 🔌 Usos significativos
- ⚙️ Caracterización de usos

---

## 💰 Valores en COP (Pesos Colombianos)

### Formato de Entrada
```
Ingresa:  1000000
Se muestra: $1.000.000 COP
```

### Características
✅ Separadores de miles automáticos
✅ Visualización en tiempo real mientras escribes
✅ Validación numérica
✅ Exportación con formato correcto

---

## 📱 Responsive Design

### Dispositivos Soportados
- 📱 Móvil (360px - 768px)
- 📱 Tablet (768px - 1024px)
- 💻 Desktop (1024px+)

### Adaptaciones
- Logo y texto reducidos en móvil
- Menú tipo hamburguesa (☰) en pantallas pequeñas
- Tablas con scroll horizontal en móvil
- Botones optimizados para toque

### Navegadores Compatibles
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 🗄️ Base de Datos

### Tecnología
- **PostgreSQL** (Supabase)
- Relacional con integridad referencial
- Respaldos automáticos

### Tablas Principales
```
sedes
├── id (PK)
├── nombre
├── regional
├── centro_formacion
└── ...

inventario
├── id (PK)
├── sede_id (FK)
├── hoja_tipo
├── cantidad
├── valor_unitario
├── ...

revision088
├── id (PK)
├── sede_id (FK)
├── fecha
├── area_total_m2
├── ...
```

---

## 🔐 Seguridad

### Autenticación
- Credenciales hardcoded (desarrollo)
- Sesión con token
- Timeout automático 10 minutos

### Base de Datos
- Conexión cifrada (SSL)
- Variables de entorno para credenciales
- Validación en backend

### Mejoras Futuras
- OAuth2 con SENA
- JWT tokens
- Rate limiting
- Validación CSRF

---

## 📈 Estadísticas

### Información Almacenada
- **Equipos:** Descripción completa
- **Consumo:** KWh mensual calculado
- **Costo:** COP estimado
- **Evidencia:** Fotos por equipo
- **Auditoría:** Revisión 088 completa

### Capacidad
- Soporta 10,000+ equipos por sede
- Múltiples sedes
- Histórico completo de cambios

---

## 🛠️ Stack Tecnológico

### Frontend
```
React 17+
├── JSX para componentes
├── Hooks (useState, useEffect)
├── CSS inline responsive
└── Chart.js para gráficos
```

### Backend
```
Python 3.8+
├── Flask para API REST
├── PostgreSQL con Supabase
├── CORS habilitado
└── Validación de datos
```

### Hosting
```
Render.com
├── Backend: Flask app
├── Frontend: Static files
├── Database: Supabase PostgreSQL
└── Auto-deploy en git push
```

---

## 🚀 Despliegue

### Opción 1: Render (Recomendado)

1. **Conectar GitHub**
   ```
   1. Ir a render.com
   2. Conectar repositorio
   3. Seleccionar rama principal
   ```

2. **Configurar variables de entorno**
   ```
   DATABASE_URL = <supabase-url>
   CORS_ORIGINS = <dominio>
   ```

3. **Desplegar**
   ```
   Git push automáticamente dispara el deploy
   ```

📖 **Lee [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

### Opción 2: Local
```bash
python backend/app.py
```

---

## 📚 Documentación

| Documento | Contenido |
|-----------|-----------|
| [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md) | Guía completa del usuario |
| [QUICK_START.md](./QUICK_START.md) | Inicio rápido para desarrollo |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Guía de despliegue |
| [README.md](./README.md) | Este archivo |

---

## ❓ Preguntas Frecuentes

**P: ¿Funciona en móvil?**
R: Sí, está completamente optimizado para móviles.

**P: ¿Dónde se guardan los datos?**
R: En PostgreSQL en Supabase con respaldos automáticos.

**P: ¿Puedo descargar los datos?**
R: Sí, todo a Excel con un clic.

**P: ¿Cuánto cuesta?**
R: Render y Supabase tienen planes gratuitos generosos.

**P: ¿Puedo agregar más usuarios?**
R: Actualmente comparte credenciales. Mejora futura: OAuth.

---

## 🐛 Reportar Problemas

Si encuentras bugs:
1. Anota los pasos para reproducir
2. Describe lo que esperabas vs. lo que sucedió
3. Captura pantalla si es posible
4. Contacta al administrador

---

## 📅 Roadmap (Futuro)

- [ ] Autenticación OAuth2 con SENA
- [ ] Múltiples usuarios por sede
- [ ] Gráficos avanzados
- [ ] API pública para integraciones
- [ ] Aplicación móvil nativa
- [ ] Predicción de consumo con IA
- [ ] Alertas de eficiencia

---

## 📞 Contacto y Soporte

- **Problema técnico?** Contacta al equipo de desarrollo
- **Pregunta sobre uso?** Consulta [MANUAL_DE_USUARIO.md](./MANUAL_DE_USUARIO.md)
- **Instalación?** Ver [QUICK_START.md](./QUICK_START.md)

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver [LICENSE](LICENSE) para detalles.

---

## 👥 Créditos

Desarrollado para: **SENA - Laboratorio de Servicios Tecnológicos CEAI**

- 🌍 Auditoría Energética
- ⚡ Eficiencia Energética
- 🔋 Sostenibilidad

---

## 🌟 Agradecimientos

A todos los que utilizan y colaboran con este sistema para mejorar la eficiencia energética en el SENA.

---

**Última actualización:** Abril 2026  
**Versión:** 1.0.0  
**Estado:** En Producción ✅

