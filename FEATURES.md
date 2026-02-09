# 🎯 Fluffy System - Características v0.0.2

## 📊 Panel de Control Administrativo (Admin Panel)

### Ubicación
`/web/admin.html` - Interfaz principal del sistema

### 📺 1. Control de Orientación Pantalla
- **Horizontal (16:9)**: Aspecto ratio 1280×720 px - Recomendado para pantallas de pared
- **Vertical (9:16)**: Aspecto ratio 720×1280 px - Para orientación vertical
- **Actualización en tiempo real**: Cambiar orientación redimensiona el canvas automáticamente
- **Default**: Landscape (Horizontal)

### 📂 2. Gestión de Datos
- **Carga archivo JSON**: Soporta archivos JSON personalizados con estructura de menú
- **Cargar ejemplo**: Carga automáticamente `sample_data_complete.json` con todos los datos de demo
- **Estructura JSON requerida**:
  ```json
  {
    "meta": { "fuente_url": "...", "linea_div_color": "#D4AF37", "rotacion_default_minutos": 10 },
    "hojas": [
      {
        "id": "res_cerdo_01",
        "nombre": "Res y Cerdo",
        "fondo": "#7B0000",
        "texto": "#FFFDD0",
        "mostrar_logo": true,
        "productos": [
          { "categoria": "RES", "nombre": "ARRACHERA NAL", "precio": 240.00, "unidad": "KG", "visible": true }
        ]
      }
    ]
  }
  ```

### 📄 3. Selección de Hoja
- **Dropdown dinámico**: Se llena automáticamente según hojas disponibles en los datos
- **Vista previa**: Muestra el nombre de la hoja actual, dimensiones y cantidad de items
- **Cambio inmediato**: Al seleccionar una hoja diferente se renderiza al instante

### 🔤 4. Configuración de Fuentes
- **Google Fonts CSS**: Permite inyectar cualquier fuente de Google Fonts
  - Default: `https://fonts.googleapis.com/css2?family=Roboto+Serif...`
  - Soporta cualquier URL válida de Google Fonts
- **Carga local**: Soporte para archivos `.ttf`, `.woff`, `.woff2`
  - Arrastra/suelta o selecciona archivo
  - Se convierte automáticamente a FontFace y carga en el canvas

### 📏 5. Configuración de Tamaños (Puntos)
- **Categoría (pt)**: Tamaño del texto de categoría - Default 120 pt
  - Rango: 60-200 pt
  - Peso de fuente: 900 (extrabold)
  - Ejemplo: "RES", "CERDO", "POLLO"
- **Nombre (pt)**: Tamaño del nombre del producto - Default 85 pt
  - Rango: 40-150 pt
  - Peso de fuente: 600 (semibold)
  - Se adapta automáticamente si hay overflow
- **Precio (pt)**: Tamaño del precio - Default 100 pt
  - Rango: 50-200 pt
  - Peso de fuente: 900 (extrabold)
  - Formato: `$XXX.XX`

**Conversión interna**: 1 pt = 1.333 px (basado en 96 DPI estándar)

### 🎨 6. Configuración de Colores
- **Fondo**: Color de fondo del menú - Default #7B0000 (rojo oscuro)
- **Texto**: Color del texto - Default #FFFDD0 (amarillo claro)
- **Divisor**: Color de la línea divisora central - Default #D4AF37 (oro)
- **Picker de color**: Click para abrir selector nativo del navegador
- **Aplicación en tiempo real**: Los cambios se reflejan inmediatamente en el canvas

### 📦 7. Configuración de Espaciado (Píxeles)
- **Entre Items (px)**: Espacio vertical entre productos - Default 32 px
  - Rango: 10-80 px
  - Se suma al altura estimada de cada item
- **Margen (px)**: Margen general desde los bordes - Default 50 px
  - Rango: 20-100 px
  - Afecta a izquierda, derecha, arriba y abajo

**Espaciado interno automático**:
- Después de categoría: 8 px
- Antes de precio: 12 px
- Ancho columna: Mitad del espacio usable menos gap
- Gap entre columnas: 18 px

### ⏱️ 8. Control de Rotación
- **Intervalo (segundos)**: Tiempo entre cambios de hoja - Default 600 seg (10 min)
  - Mínimo: 5 segundos
  - Máximo: Sin límite configurado
- **Iniciar**: Comienza rotación automática cíclica
- **Parar**: Detiene la rotación
- **Comportamiento**: Cicla a través de todas las hojas disponibles

### 💾 9. Exportación
- **PNG**: Descarga el menú como imagen PNG
  - Resolución: Exacto al tamaño del canvas (1280×720 o 720×1280)
  - Nombre archivo: `menu_1.png`, `menu_2.png`, etc.
  - Compatible con cualquier software de edición de imagen
- **PDF**: Descarga el menú como documento PDF
  - Orientación: Automática según selección (horizontal/vertical)
  - Tamaño: Mantiene aspecto ratio 16:9
  - Nombre archivo: `menu_1.pdf`, `menu_2.pdf`, etc.
  - Listo para impresión profesional

---

## 🔄 Algoritmo de Renderización

### 1. Inicialización
1. Limpiar canvas completamente
2. Llenar fondo con color seleccionado
3. Establecer línea base de texto (`textBaseline: 'top'`)

### 2. Configuración
- Lee todos los valores de inputs del formulario
- Calcula dimensiones de columnas:
  - Ancho usable = ancho_canvas - (margen × 2)
  - Ancho columna = (ancho_usable - gap_columnas) / 2
- Calcula posiciones X para texto

### 3. Divisor Central
- Dibuja rectángulo de 16 px ancho en el centro
- Color: valor de input `dividercolor`
- Altura: desde margen+20 hasta canvas.height-margen-40

### 4. Estimación de Alturas
Para cada producto:
1. Altura categoría = pt×1.333×1.2
2. Líneas de nombre = calcular word-wrap
3. Altura nombre = líneas × (pt×1.333×1.2)
4. Altura precio = pt×1.333×1.2
5. Total = altura_cat + 8 + altura_nombre + 12 + altura_precio + itemSpacing

### 5. Distribución en Columnas
- Ordena items por altura descending (greedy algorithm)
- Asigna cada item a la columna con menor altura actual
- Resultado: Distribución visual equilibrada

### 6. Ajuste Adaptativo
- Si contenido no cabe en altura disponible:
  - Reduce tamaño nombre por 18% (multiplicador 0.82)
  - Re-estima alturas
  - Re-distribuye
  - Repite máx 15 iteraciones
- Mínimo permitido: 55% del tamaño original

### 7. Renderización de Texto
**Columna izquierda** (X = margen + col_padding):
- Items pares del array distribuido

**Columna derecha** (X = margen + ancho_col + gap + col_padding):
- Items impares del array distribuido

**Para cada item**:
1. **Categoría**
   - Font: 900 weight, tamaño_categoria pt
   - Y += altura_cat + 8
2. **Nombre** (con word-wrap)
   - Font: 600 weight, tamaño_nombre pt
   - Word-wrap: máximo (ancho_columna - col_padding×2)
   - Y += altura_nombre + 12
3. **Precio**
   - Font: 900 weight, tamaño_precio pt
   - Formato: `$XXX.XX`
   - Alineación: derecha
   - Y += altura_precio + itemSpacing

---

## 🎨 Paletas de Color Pantone 2025/26

### Categorías Implementadas
- **Res**: `#7B0000` (Rojo Carnicería)
- **Cerdo**: `#7B0000` (Rojo Carnicería)
- **Pollo**: `#E6A519` (Naranja/Dorado)
- **Pescados**: `#001F5B` (Azul Marino)
- **Víveres**: `#004B23` (Verde Oscuro)
- **Vísceras**: `#8D918D` (Gris)

### Colores Complementarios
- **Texto sobre oscuro**: `#FFFDD0` (Crema)
- **Texto sobre dorado**: `#2B1B00` (Marrón muy oscuro)
- **Divisor/Detalle**: `#D4AF37` (Oro)

---

## 📋 Datos de Ejemplo

### Archivos Incluidos
1. **sample_data.json**: Mínimo (Res, Cerdo, Pollo)
2. **sample_data_long.json**: Test de word-wrap
3. **sample_data_complete.json**: 6 hojas con todas las categorías

### Estructura de Producto
```javascript
{
  "categoria": "RES",           // Texto de categoría (40 caracteres máx recomendado)
  "nombre": "ARRACHERA NAL",    // Nombre producto (sin límite, se adapta)
  "precio": 240.00,             // Número decimal
  "unidad": "KG",               // Unidad (no se muestra, opcional para datos)
  "visible": true,              // Filtro de items a mostrar
  "nota": ""                     // Campo futuro (no usado en v0.0.2)
}
```

---

## 🚀 Cómo Usar

### 1. Abrir Admin Panel
```bash
python3 -m http.server 8000
# Luego visita: http://localhost:8000/web/admin.html
```

### 2. Flujo Básico
1. Selecciona orientación (Horizontal por defecto)
2. Click "Cargar Ejemplo"
3. Espera a que cargue (verás canvas con datos)
4. Cambia valores en formulario → preview actualiza al instante
5. Selecciona hoja diferente en dropdown
6. Ajusta colores, tamaños, espaciado según necesites
7. Click PNG o PDF para descargar

### 3. Usar Datos Personalizados
1. Crea archivo JSON con estructura correcta
2. Click en "Archivo JSON" en el panel
3. Selecciona tu archivo
4. Se cargará automáticamente

### 4. Rotación de Menús
1. Ingresa intervalo en segundos (ej: 300 = 5 minutos)
2. Click "Iniciar"
3. El menú cambiará automáticamente cada N segundos
4. Click "Parar" para detener

---

## ⚡ Rendimiento

- **Canvas rendering**: Instantáneo (< 16ms en hardware moderno)
- **Recalcular layout**: ~2-5ms por cambio
- **Fonts load time**: 1-3 segundos (Google Fonts) o instant (local)
- **Export PNG**: < 100ms
- **Export PDF**: < 500ms

---

## 🔧 Arquitectura Técnica

### Stack
- **HTML5**: Estructura del formulario y canvas
- **CSS3**: Styling responsive (360px panel + preview flexible)
- **JavaScript**: Lógica pura (sin frameworks)
- **Canvas API**: Rendering de texto y gráficos
- **FontFace API**: Carga dinámmica de fuentes
- **jsPDF**: Exportación a PDF

### Archivos
- `admin.html` (138 líneas): Estructura del formulario
- `admin.css` (265 líneas): Estilos del panel
- `admin.js` (450+ líneas): Lógica completa de la aplicación
- `app_v2.js` (antiguo, no usado): Renderer original

### Tamaños
- Bundle HTML+CSS+JS: ~100 KB (sin dependencias)
- jsPDF library: ~600 KB (CDN)
- Google Fonts: Varía (~50-200 KB dependiendo de hojas)

---

## 📝 Notas Importantes

1. **Font Weight**: El sistema usa 900 para categoría/precio y 600 para nombre. Asegúrate que tu fuente soporte estos pesos.

2. **Word Wrap**: Se divide por espacios, no por caracteres. Un producto sin espacios que sea muy largo se renderizará en una sola línea y podría overflow.

3. **Colores en PNG**: Se preservan exactamente como se ven en pantalla.

4. **Orientación**: Cambiar orientación recalcula todo. No hay preservación de estado entre orientaciones (cada una tiene su propio layout).

5. **Rotación**: Es un timer simple, no pausado si cambias valores de formulario. Para cambiar intervalo debes Parar e Iniciar de nuevo.

---

## 🐛 Debugging

Abre la consola del navegador (`F12` → Console) para ver logs de:
- Carga de datos
- Carga de fuentes
- Cambios de orientación
- Exportaciones
- Errores de parsing

---

## ✅ v0.0.2 Roadmap

- [x] Admin panel básico con orientación 16:9
- [x] Renderización en dos columnas
- [x] Word-wrap automático
- [x] Distribución equilibrada
- [x] Colores dinámicos
- [x] Exportación PNG/PDF
- [x] Rotación automática
- [ ] CSV import (v0.0.3)
- [ ] Presets de estilos Pantone (v0.0.3)
- [ ] Dashboard con miniaturas (v0.0.4)
- [ ] Sincronización multi-pantalla (v0.0.5)

---

**Última actualización**: 2024  
**Versión**: 0.0.2  
**Estado**: Prototipo funcional con todas las características core
