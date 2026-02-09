# Guía de Uso — Generador de Menús Dinámicos v0.3.2

## 🚀 Inicio Rápido

### 1. **Acceder a la aplicación**

**Opción A - Local (desarrollo)**:
```bash
cd /Users/franciscoosnaya/Documents/CARNICERIA/fluffy-system
python3 -m http.server 8000
```
Luego abre: `http://localhost:8000/web/admin.html`

**Opción B - GitHub Pages (producción)**:
```
https://FrankOsn.github.io/fluffy-system/web/admin.html
```

### 2. **Cargar datos**
- Click en **"Cargar Ejemplo"** → Carga `sample_data_complete.json`
- O click en **"Archivo JSON"** → Selecciona tu propio JSON

### 3. **Personalizar**
- Selecciona hoja en dropdown
- Ajusta colores (color picker + HEX)
- Modifica tamaños de fuente (pt)
- Cambiar espaciado si quieres
- **Los cambios se guardan automáticamente por hoja**

### 4. **Exportar**
- **PNG Actual** → PNG de la hoja actual
- **PNG TODO** → ZIP con todos los menús
- **PDF Actual** → PDF de la hoja actual  
- **PDF TODO** → PDF multipágina (todas en 1 documento)

### 5. **Guardar configuración**
- Click **"💾 Guardar"** → Descarga `menu_config.json`
- Click **"📂 Cargar"** → Restaura estilos guardados

---

## 📁 Ubicación de Archivos

```
/fluffy-system/
├── sample_data_complete.json    ← ARCHIVO PRINCIPAL (edita aquí)
├── sample_data.json             ← Versión simplificada
├── sample_data_long.json        ← Versión extendida
├── web/
│   ├── admin.html              ← Panel de control
│   ├── admin.js                ← Lógica (v0.3.2)
│   └── admin.css               ← Estilos
└── GUIDE.md                     ← Esta guía
```

---

## 📋 Estructura de JSON - FORMATO COMPLETO

**Archivo**: `sample_data_complete.json`

```json
{
  "meta": {
    "fuente_url": "https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900...",
    "linea_div_color": "#D4AF37",
    "rotacion_default_minutos": 10,
    "descripcion": "Carnicería Los 44 - Menú Completo"
  },
  "hojas": [
    {
      "id": "res_cerdo_01",
      "nombre": "Res y Cerdo",
      "fondo": "#7B0000",
      "texto": "#FFFDD0",
      "mostrar_logo": true,
      "productos": [
        {
          "categoria": "RES",
          "nombre": "ARRACHERA MARINADA",
          "precio": 280.00,
          "unidad": "KG",
          "visible": true,
          "nota": ""
        },
        {
          "categoria": "CERDO",
          "nombre": "COSTILLA CARGADA",
          "precio": 130.00,
          "unidad": "KG",
          "visible": true,
          "nota": ""
        }
      ]
    }
  ]
}
```

### 📌 Campos Obligatorios

#### Nivel `meta` (Global):
| Campo | Tipo | Ejemplo | Obligatorio |
|-------|------|---------|------------|
| `fuente_url` | string | Google Fonts URL | Sí |
| `linea_div_color` | HEX | "#D4AF37" | Sí |
| `rotacion_default_minutos` | número | 10 | Sí |
| `descripcion` | string | "Mi menú" | No |

#### Nivel `hojas` (Por pantalla):
| Campo | Tipo | Ejemplo | Obligatorio |
|-------|------|---------|------------|
| `id` | string | "res_01" | Recomendado |
| `nombre` | string | "Res y Cerdo" | Sí |
| `fondo` | HEX | "#7B0000" | Sí |
| `texto` | HEX | "#FFFDD0" | Sí |
| `mostrar_logo` | boolean | true/false | No |
| `productos` | array | [...] | Sí |

#### Nivel `productos` (Items del menú):
| Campo | Tipo | Ejemplo | Obligatorio |
|-------|------|---------|------------|
| `categoria` | string | "RES", "POLLO", "PESCADO" | Sí |
| `nombre` | string | "ARRACHERA MARINADA" | Sí |
| `precio` | número | 280.00 | Sí |
| `unidad` | string | "KG", "PIEZA", "DOCENA" | Sí |
| `visible` | boolean | true/false | Sí |
| `nota` | string | "Bajo pedido" | No |

---

## 🎨 Categorías Disponibles

```
"RES"         → Carnes rojas
"CERDO"       → Carnes de cerdo
"POLLO"       → Pollo
"PESCADO"     → Pescados
"MARISCO"     → Mariscos
"VÍSCERAS"    → Órganos internos
"ARROZ"       → Granos
"SEMILLAS"    → Frijoles, lentejas
"HUEVO"       → Huevos
"AZÚCAR"      → Azúcares y condimentos
```

---

## 🎨 Paleta de Colores Recomendada

| Categoría | Fondo | Texto | Uso |
|-----------|-------|-------|-----|
| Res y Cerdo | #7B0000 | #FFFDD0 | Rojo oscuro elegante |
| Pollo | #E6A519 | #2B1B00 | Oro/Marrón |
| Pescados | #001F5B | #FFFDD0 | Azul marino |
| Víveres | #004B23 | #FFFDD0 | Verde oscuro |
| Vísceras | #8D918D | #FFFFFF | Gris claro |

**Nota**: Puedes cambiar cualquier color en la app sin editar JSON

---

## 📏 Tamaños de Fuente (en puntos)

Por defecto (optimizado para 5 metros):
- **Categoría**: 120pt (Bold)
- **Nombre**: 85pt (Medium)
- **Precio**: 100pt (Extra Bold)

El algoritmo reduce automáticamente `nombre` si los productos no caben verticalmente.

---

## Ejemplos incluidos

- `sample_data.json`: Datos básicos (Res, Cerdo, Pollo).
- `sample_data_long.json`: Nombres largos para probar wrapping.

---

## Soporte de fuentes

### Google Fonts
Copia una URL completa de Google Fonts (incluyendo `&display=swap`) y pégala en el input "Google Fonts CSS".

Ejemplo:
```
https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wght@0,8..144,100..900&display=swap
```

### Local (.ttf, .woff, .woff2)
- Haz clic en "O cargar .ttf/.woff/.woff2 local".
- Selecciona un archivo de tu computadora.
- La fuente se aplicará inmediatamente al renderizar.

---

## Exportación

### PNG
- Resolución: 1280 x 720 px (16:9 HD).
- Uso: pantallas de carnicería, impresión, redes sociales.

### PDF
- Mismo contenido que PNG, en formato PDF.
- Uso: almacenamiento, documentación.

---

## Características futuras

- **CSV**: Soporte para importar desde hojas de cálculo (próximamente).
- **Editor web completo**: Dashboard con Style Builder integrado (próximamente).
- **Historial de cambios**: Auditoría y reversión (próximamente).

---

## Troubleshooting

### La fuente no carga
- Verifica que la URL sea válida (Google Fonts) o que el archivo sea .ttf/.woff/.woff2.
- Abre la consola (F12) para ver mensajes de error.

### El texto se corta
- El algoritmo reduce automáticamente el tamaño de `nombre`.
- Si deseas más espacio, edita el JSON y aumenta `itemSpacing` o reduce `nombre_pt`.

### ¿Cómo cambiar los colores?
- Edita los valores HEX en el JSON (`fondo` y `texto`).
- O usa la paleta recomendada de arriba.

---

## Contacto y soporte

Para sugerencias o bugs, consulta la documentación en `docs/algorithm_layout.md` y `README_MENUDINAMICO.md`.
