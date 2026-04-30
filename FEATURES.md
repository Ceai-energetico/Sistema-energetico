# 📋 Características del Aplicativo Revisión Energética

## 🎯 Características por Módulo

### 1. 🔐 Autenticación y Acceso

| Característica | Descripción |
|---|---|
| Login seguro | Credenciales: ceaienergetico@gmail.com / Energetico2026 |
| Sesión con timeout | Expira después de 10 minutos de inactividad |
| Cierre manual | Botón "Cerrar sesión" siempre disponible |
| Persistencia | Guarda sesión en localStorage |
| Multi-navegador | Compatible con Chrome, Firefox, Safari, Edge |

---

### 2. 📦 Gestión de Inventario

#### Agregar Equipo
| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| Categoría/Hoja | Select | ✅ | 9 categorías disponibles |
| Regional | Select | ✅ | Filtra por región SENA |
| Centro de Formación | Select | ✅ | Se actualiza con regional |
| Sede | Texto | ✅ | Nombre de la sede |
| Descripción | Texto | ✅ | Detalle del equipo |
| Marca | Texto | ❌ | Fabricante |
| Modelo | Texto | ❌ | Versión/modelo |
| Clasificación Energética | Texto | ❌ | RETIQ (A, B, etc.) |
| Año Instalación | Número | ❌ | 2000-2026 |
| Cantidad | Número | ❌ | Unidades disponibles |
| Potencia (kW) | Decimal | ❌ | Por unidad |
| Horas Uso Diario | Decimal | ❌ | 0-24 horas |
| Días Uso Mes | Número | ❌ | 0-31 días |
| **Valor Unitario** | **Número** | **❌** | **💰 En COP** |
| Ubicación | Texto | ❌ | Lugar específico |
| Uso | Texto | ❌ | Función principal |
| Tecnología | Texto | ❌ | Tipo (LED, Inverter, etc.) |
| Observaciones | Textarea | ❌ | Notas adicionales |
| Fotos | Archivos | ❌ | Múltiples evidencias |

#### Visualizar Equipo
- ✅ Ver todos los detalles en modal
- ✅ Galería de fotos con vista previa
- ✅ Click en foto para verla en pantalla completa
- ✅ Información bien organizada

#### Editar Equipo
- ✅ Modificar cualquier campo
- ✅ Agregar más fotos
- ✅ Eliminar fotos existentes
- ✅ Guardar cambios

#### Eliminar Equipo
- ✅ Confirmación de eliminación
- ✅ No se puede deshacer
- ✅ Elimina todas las asociaciones

---

### 3. 💰 Sistema de Valores en COP

#### Características Especiales
| Característica | Detalles |
|---|---|
| **Entrada en Tiempo Real** | Mientras escribes ves: `$1.000.000` |
| **Separadores de Miles** | Automático: 1000000 → 1.000.000 |
| **Formato Colombiano** | Usa punto (.) para miles |
| **Visualización Constante** | En input hay indicador de valor |
| **Exportación Correcta** | Excel muestra formateado |
| **Cálculos Exactos** | Usa números sin formato internamente |

#### Ejemplo de Uso
```
Escribes:  1000000
Ves:       $1.000.000 COP
Guardas:   1000000 (número interno)
Exportas:  1000000 (Excel lo formatea)
```

---

### 4. 📊 Cálculos Automáticos

| Cálculo | Fórmula | Resultado |
|---|---|---|
| **Consumo Mensual (kWh)** | Potencia × Horas/día × Días/mes | kWh/mes |
| **Potencia Total** | Potencia unitaria × Cantidad | kW total |
| **Horas Mes** | Horas/día × Días/mes | Horas |
| **Valor Total (COP)** | Cantidad × Valor unitario | COP |
| **Gas (Kg)** | Capacidad (gr) ÷ 1000 | Kg |

Estos se muestran en tiempo real mientras llenan el formulario.

---

### 5. 🔍 Filtros y Búsqueda

#### Filtros Disponibles
| Filtro | Opciones | Comportamiento |
|---|---|---|
| Tipo | 9 categorías | Filtra tabla inmediatamente |
| Regional | 32 regionales | Filtra tabla e actualiza Centro |
| Centro | Dinámico | Solo muestra centros de la regional |

#### Búsqueda
- ❌ Búsqueda por texto (futura mejora)
- ✅ Filtros combinables
- ✅ Ver cantidad de equipos filtrados

---

### 6. 📥 Exportación a Excel

#### Contenido del Archivo
```
21 columnas en Excel:
1.  Tipo
2.  Regional
3.  Centro
4.  Sede
5.  Descripción
6.  Marca
7.  Modelo
8.  Clasificación Energética
9.  Año Instalación
10. Cantidad
11. Potencia (kW)
12. Horas Uso Diario
13. Días Uso Mes
14. Consumo (kWh/mes)     ← CALCULADO
15. Valor Unitario (COP)  ← EN PESOS
16. Valor Total (COP)     ← CANTIDAD × UNITARIO
17. Grupo Principal
18. Ubicación
19. Uso
20. Tecnología
21. Observaciones
```

#### Características
- ✅ Descarga automática
- ✅ Nombre: `inventario_sena.xlsx`
- ✅ Incluye filtros aplicados
- ✅ Compatible con Excel, Calc, Sheets
- ✅ Valores numéricos preservados
- ✅ Totales calculados

---

### 7. 📋 Revisión 088

#### Secciones Principales

**1. Información General**
- Fecha de auditoría
- Regional y Centro
- Sede y dirección
- Área (total y útil)
- Datos climáticos
- Información de trabajadores

**2. Régimen de Trabajo**
- Matriz por día de semana
- 12 franjas horarias de 2 horas
- Marcar si activo (Lunes-Domingo + Festivo)

**3. Matriz Energética**
- Consumo mensual por tipo
- Electricidad (kWh y COP)
- Gas natural (m³ y COP)
- ACPM (galones y COP)
- Gasolina (galones y COP)
- Totales automáticos

**4. Usos Significativos**
- Por tipo de energía
- Descripción del uso
- Consumo estimado
- Participación porcentual

**5. Caracterización de Usos**
- Equipos específicos
- Descripción técnica
- Consumo asociado
- Notas

#### Funciones
- ✅ Guardar automático
- ✅ Mostrar hora de último guardado
- ✅ Limpiar secciones con confirmación
- ✅ Exportar a Excel con múltiples hojas

---

### 8. 📈 Consolidado Energético

#### Información Mostrada
| Métrica | Descripción |
|---|---|
| **Consumo Total Mensual** | kWh total de la sede |
| **Por Categoría** | Desglose por tipo de equipo |
| **Gráficos** | Visualización de datos |

#### Datos Incluidos
- Iluminación
- Equipos y Maquinaria Industrial
- Servicios TIC
- Refrigeración
- Otros

---

### 9. 📱 Responsive Design

#### Tamaños Soportados
| Dispositivo | Ancho | Adaptación |
|---|---|---|
| Móvil | 320-767px | Menú hamburguesa, stacking |
| Tablet | 768-1023px | Layout mixto |
| Desktop | 1024px+ | Pantalla completa |

#### Ajustes Específicos
- **Logo:** 40px (móvil) → 70px (desktop)
- **Fuentes:** 12px (móvil) → 28px (main title)
- **Padding:** 8px (móvil) → 32px (desktop)
- **Tablas:** Scroll horizontal en móvil
- **Menú:** Hamburguesa en móvil, normal en desktop
- **Botones:** Toque en móvil, click en desktop

---

### 10. 🖼️ Fotos y Evidencias

#### Captura en Móvil
- ✅ Botón 📷 Cámara
- ✅ Abre cámara del dispositivo
- ✅ Múltiples fotos por equipo
- ✅ Se almacenan como base64

#### Visualización
- ✅ Miniatura en tabla
- ✅ Galería en vista detalle
- ✅ Pantalla completa en modal
- ✅ Eliminar foto individual

---

### 11. 🎨 Interfaz y UX

#### Colores
- Primario: #0B7D4B (Verde SENA)
- Secundario: #1ab66f (Verde claro)
- Texto: #333 (Oscuro)
- Fondo: #f5f5f5 (Gris claro)

#### Iconografía
- ➕ Agregar
- 👁️ Ver
- ✏️ Editar
- 🗑️ Eliminar
- 📊 Exportar
- 📷 Cámara
- ⚙️ Configuración
- 🔐 Seguridad
- ⚡ Energía

#### Componentes
- ✅ Modals bien diseñados
- ✅ Confirmaciones claras
- ✅ Mensajes de error
- ✅ Indicadores de carga
- ✅ Información contextual

---

### 12. 🔒 Seguridad

#### Implementado
- ✅ Autenticación básica
- ✅ Timeout de sesión
- ✅ CORS configurado
- ✅ Validación en backend

#### Futuro
- 🔄 OAuth2 con SENA
- 🔄 JWT tokens
- 🔄 Rate limiting
- 🔄 Encriptación avanzada

---

### 13. ⚡ Rendimiento

#### Optimizaciones
| Aspecto | Mejora |
|---|---|
| **Carga** | ~2s (primera vez) |
| **Respuesta API** | <500ms promedio |
| **Cálculos** | Tiempo real sin lag |
| **Imágenes** | Comprimidas automáticamente |
| **Cache** | LocalStorage para sesión |

---

### 14. 🌐 Compatibilidad

#### Navegadores
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

#### Sistemas Operativos
- ✅ Windows
- ✅ macOS
- ✅ Linux
- ✅ iOS
- ✅ Android

---

### 15. 📈 Estadísticas

#### Capacidad
- **Equipos:** 10,000+
- **Fotos:** 100+ por equipo
- **Sedes:** Ilimitadas
- **Usuarios:** Actuales 1 (mejora futura)

#### Datos Almacenados
- ID, timestamps
- Información completa del equipo
- Valores calculados
- Referencias fotográficas
- Auditoría 088 completa

---

## 🚀 Mejoras Futuras

### Corto Plazo
- [ ] Búsqueda por texto
- [ ] Más temas de color
- [ ] Importar desde Excel
- [ ] Reportes PDF

### Mediano Plazo
- [ ] Múltiples usuarios
- [ ] OAuth2 SENA
- [ ] Gráficos avanzados
- [ ] API pública

### Largo Plazo
- [ ] App móvil nativa
- [ ] IA para predicción
- [ ] Integración IoT
- [ ] Sistema de alertas

---

**Documento actualizado:** Abril 2026  
**Versión:** 1.0.0

