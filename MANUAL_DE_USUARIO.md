# 📚 Manual de Usuario - Aplicativo Revisión Energética

## 🌟 Introducción

Bienvenido al **Aplicativo Revisión Energética**, un sistema completo para auditar, registrar y analizar el consumo energético en sedes de capacitación del SENA.

Este manual te guiará por todas las funciones del sistema paso a paso.

---

## 📋 Tabla de Contenidos

1. [Acceso al Sistema](#-acceso-al-sistema)
2. [Interfaz Principal](#-interfaz-principal)
3. [Gestión de Equipos](#-gestión-de-equipos)
4. [Exportación de Datos](#-exportación-de-datos)
5. [Revisión 088](#-revisión-088-formulario-completo)
6. [Consolidado Energético](#-consolidado-energético)
7. [Preguntas Frecuentes](#-preguntas-frecuentes)

---

## 🔐 Acceso al Sistema

### Credenciales de Ingreso
- **Correo:** `ceaienergetico@gmail.com`
- **Contraseña:** `Energetico2026`

### Pasos para Ingresar:
1. Abre el navegador web
2. Ingresa a la URL del aplicativo
3. Escribe el correo y contraseña en los campos correspondientes
4. Haz clic en **"Ingresar"**
5. ¡Listo! Ya estás dentro del sistema

### Seguridad:
- Tu sesión expira automáticamente después de **10 minutos de inactividad**
- Siempre puedes cerrar sesión manualmente con el botón **"Cerrar sesión"**

---

## 🎨 Interfaz Principal

### Estructura de la Pantalla

```
┌─────────────────────────────────────────────────────────┐
│  SENA | Aplicativo Revisión Energética | Cerrar sesión  │  ← ENCABEZADO
├──────────────────────────────────────────────────────────┤
│         │                                                │
│  MENÚ   │  ÁREA PRINCIPAL DE TRABAJO                    │
│  LATERAL │                                                │
│         │                                                │
│         ├─ Inventario de Equipos                         │
│         ├─ Consolidado Energético                        │
│         └─ Gráficos Detallados                           │
│         │                                                │
└─────────────────────────────────────────────────────────┘
```

### Menú Lateral (Izquierda)

#### REVISIONES
- **087** - Usos finales de energía (Sede Demo)
- Otras sedes registradas en el sistema

#### HERRAMIENTAS
- **Revisión 088** - Formulario completo con toda la información energética

### Botón de Menú (Móvil) ☰
En dispositivos móviles, el menú aparece en el encabezado. Toca ☰ para abrirlo.

---

## ⚙️ Gestión de Equipos

### Vista: Inventario de Equipos

En esta sección puedes ver, agregar, editar y eliminar equipos registrados.

#### 🔍 Filtros

**Tipo:** Selecciona la categoría de equipo:
- ⚙️ Equipos y Maquinaria Industrial
- 🖥️ Servicios TIC
- 🖨️ Ofimática
- ❄️ Equipos de Refrigeración
- 🧊 Soporte Gases Refrigerantes
- 💡 Iluminación
- ⛽ Consumo de Combustible
- ⚡ Plantas Eléctricas
- 🔥 Gasodomésticos

**Regional:** Filtra por región geográfica del SENA

**Centro:** Filtra por centro de formación específico

#### ➕ Agregar Nuevo Equipo

1. Haz clic en el botón **"➕ Agregar equipo"**
2. Se abrirá un formulario modal
3. Completa los campos requeridos (marcados con *)
4. Sigue las secciones del formulario:
   - Información de la sede
   - Especificaciones del equipo
   - **Valor Unitario** (en COP colombianos)
   - Cantidad y horario de uso
   - Características técnicas
   - Ubicación y fotos
   - Observaciones

#### 💰 Campo: Valor Unitario

**Importante:** El valor debe ingresarse en **COP (Pesos Colombianos)**

Ejemplos:
- Ingresa: `1000000`
- Se muestra: `$1.000.000 COP`

El sistema formatea automáticamente el valor con separadores de miles para mejor legibilidad.

#### 📷 Fotos/Evidencias

- **En Móvil:** Usa el botón 📷 Cámara para capturar fotos directamente
- **En Computadora:** Selecciona archivos de tu computadora
- Puedes agregar múltiples fotos por equipo
- Las fotos se usan como evidencia para auditorías

#### ✏️ Editar Equipo

1. Busca el equipo en la tabla
2. Haz clic en el botón **"✏️ Editar"**
3. Modifica los campos necesarios
4. Haz clic en **"Guardar"**

#### 👁️ Ver Detalles

1. Haz clic en el botón **"👁️ Ver"**
2. Se abrirá una ventana con todos los detalles del equipo
3. Puedes ver las fotos en esta ventana
4. Haz clic en cualquier foto para verla en tamaño completo

#### 🗑️ Eliminar Equipo

1. Haz clic en el botón **"🗑️ Eliminar"**
2. Confirma que deseas eliminar
3. El equipo se eliminará permanentemente

### 📊 Tabla de Inventario

La tabla muestra:
- **Tipo:** Categoría del equipo
- **Descripción:** Nombre/modelo del equipo
- **Grupo:** Clasificación principal
- **Fotos:** Miniatura de la primera foto
- **Cantidad:** Número de unidades
- **Potencia (kW):** Consumo energético unitario
- **Consumo (kWh/mes):** Consumo mensual calculado
- **Acciones:** Botones Ver, Editar, Eliminar

---

## 📊 Exportación de Datos

### Exportar a Excel 📊

1. Haz clic en el botón **"📊 Exportar Excel"**
2. Se descargará un archivo con extensión `.xlsx`
3. El archivo contiene:
   - **Todos los equipos** filtrados por tipo/regional/centro
   - **21 columnas** con información completa:
     - Tipo de equipo
     - Regional, Centro, Sede
     - Descripción, Marca, Modelo
     - Clasificación energética
     - Año de instalación
     - Cantidad
     - Potencia (kW)
     - Horas de uso diario
     - Días de uso al mes
     - **Consumo (kWh/mes)** ← Calculado
     - **Valor Unitario (COP)** ← En pesos colombianos
     - **Valor Total (COP)** ← Cantidad × Valor Unitario
     - Grupo principal
     - Ubicación
     - Uso
     - Tecnología
     - Observaciones

### 💾 Guardar el Archivo

El navegador lo descargará automáticamente a tu carpeta de descargas.

Nombre del archivo: `inventario_sena.xlsx`

### 📥 Abrir en Excel/Calc

1. Abre el archivo descargado
2. Se abrirá en tu programa de hojas de cálculo (Excel, LibreOffice, Google Sheets)
3. Puedes editar, copiar o analizar los datos
4. Los valores en COP muestran con separadores de miles automáticamente

---

## 📋 Revisión 088 - Formulario Completo

La **Revisión 088** es el formulario completo para auditorías energéticas detalladas.

### Acceder a Revisión 088

1. Haz clic en **"⚙️ Revisión 088"** en el menú lateral
2. O toca **"⚙️ Revisión 088"** en el menú móvil (☰)

### Secciones del Formulario 088

#### 1️⃣ INFORMACIÓN GENERAL
- Fecha de la auditoría
- Regional y Centro de formación
- Sede y dirección
- Datos del edificio (área, temperatura, etc.)
- Información de personal

#### 2️⃣ RÉGIMEN DE TRABAJO
- Horarios de operación por día de la semana
- Franjas horarias de 2 horas
- Marcar cuáles están activas

#### 3️⃣ MATRIZ ENERGÉTICA
- Consumo mensual por tipo de energía:
  - Electricidad (kWh, COP)
  - Gas natural (m³, COP)
  - ACPM (galones, COP)
  - Gasolina (galones, COP)

#### 4️⃣ USOS SIGNIFICATIVOS
- Desagregación por tipo de energía:
  - Energía eléctrica
  - Gas natural
  - ACPM
  - Gasolina
- Descripción del uso
- Consumo estimado
- Participación porcentual

#### 5️⃣ CARACTERIZACIÓN DE USOS
- Detalle de equipos principales
- Descripción
- Consumo asociado
- Notas técnicas

### Guardar Revisión 088

- El sistema guarda **automáticamente** los cambios
- Aparece un mensaje confirmando la hora del último guardado
- Si hay conexión, los datos se sincronizan con el servidor

### Exportar Revisión 088

- Haz clic en **"⬇️ Exportar Excel"** para descargar toda la revisión en formato Excel
- Se creará un archivo con múltiples hojas (General, Régimen, Matriz, Usos, etc.)

---

## 📈 Consolidado Energético

### Vista General

El **Consolidado Energético** muestra un resumen del consumo total de la sede.

### Información Mostrada

**Consumo Total Mensual (kWh):**
- Total de energía consumida en el mes
- Valor calculado automáticamente a partir de los equipos registrados

**Desglose por Categoría:**
- Iluminación
- Equipos y Maquinaria Industrial
- Servicios TIC
- Refrigeración
- Otros

Cada categoría muestra su consumo en kWh.

### 📊 Gráficos

El sistema genera gráficos automáticos de:
- Consumo por categoría (pie chart)
- Evolución del consumo (línea)
- Comparativa mensual (barras)

---

## ❓ Preguntas Frecuentes

### P: ¿Qué pasa si me desconecto?
**R:** Tu sesión expirará después de 10 minutos sin actividad. Se te pedirá que ingreses nuevamente.

### P: ¿Puedo editar un equipo después de agregarlo?
**R:** Sí, haz clic en ✏️ Editar en la fila del equipo. Se abrirá el formulario con los datos actuales.

### P: ¿El valor unitario debe estar en COP?
**R:** Sí, **siempre en pesos colombianos**. El sistema lo formatea automáticamente.

### P: ¿Cómo agrego fotos en móvil?
**R:** Toca el botón 📷 Cámara. Se abrirá tu cámara del dispositivo. Toma la foto y confirma.

### P: ¿Puedo agregar múltiples fotos?
**R:** Sí, puedes agregar varias fotos por equipo. Cada foto quedará registrada como evidencia.

### P: ¿Los datos se guardan automáticamente?
**R:** En la Revisión 088, **sí**. En el Inventario de Equipos, debes hacer clic en "Guardar".

### P: ¿Puedo descargar los datos?
**R:** Sí, usa el botón "📊 Exportar Excel" para descargar todos los datos en formato Excel.

### P: ¿Qué columnas tiene el Excel?
**R:** 21 columnas con información completa incluyendo Valor Unitario, Valor Total, Consumo calculado, etc.

### P: ¿Puedo filtrar por regional?
**R:** Sí, usa el dropdown "Regional" para filtrar. El "Centro" se actualizará automáticamente.

### P: ¿Qué es la Revisión 088?
**R:** Es el formulario oficial de auditoría energética con información técnica detallada de la sede.

### P: ¿Puedo usar esto en móvil?
**R:** Sí, la interfaz es completamente responsive. Se adapta a celulares y tablets elegantemente.

### P: ¿Dónde guarda los datos?
**R:** Los datos se guardan en una base de datos en el servidor. Siempre están respaldados.

---

## 🚀 Consejos Prácticos

### Para Auditorías Efectivas:
1. Completa todos los campos de información
2. Agrega fotos claras como evidencia
3. Registra valores unitarios correctamente en COP
4. Usa las observaciones para notas importantes
5. Exporta datos regularmente para respaldo

### Para Mejor Rendimiento:
1. Recarga la página si algo se ve lento
2. Usa navegadores modernos (Chrome, Firefox, Safari, Edge)
3. En móvil, asegúrate de tener buena conexión al subir fotos
4. Cierra la sesión cuando termines

### Para Datos Precisos:
1. Verifica que las cantidades sean correctas
2. Asegúrate de que el consumo en kWh esté actualizado
3. Valida los precios en COP antes de guardar
4. Revisa el consolidado energético regularmente

---

## 📞 Soporte

Si tienes preguntas o problemas:
1. Recarga la página (Ctrl+F5)
2. Revisa esta guía nuevamente
3. Verifica que estés usando la contraseña correcta
4. Contacta al administrador del sistema

---

**Última actualización:** Abril 2026  
**Versión:** 1.0  
**Aplicativo:** Revisión Energética SENA - CEAI

