# ⚡ Quick Start - Fluffy System

## 🎯 En 3 pasos

### 1️⃣ Inicia el servidor local
```bash
cd /Users/franciscoosnaya/Documents/CARNICERIA/fluffy-system
python3 -m http.server 8000
```

### 2️⃣ Abre el panel
En tu navegador: **http://localhost:8000/web/admin.html**

### 3️⃣ Carga datos y personaliza
- Haz click en **"Cargar Ejemplo"** para ver el menú de demostración
- Ajusta colores, tamaños y espaciado en los controles
- Los cambios aparecen instantáneamente en la vista previa
- Descarga como **PNG** o **PDF** cuando esté listo

---

## 📋 Guía Rápida de Controles

| Control | Función | Default |
|---------|---------|---------|
| 📺 Orientación | Horizontal (16:9) o Vertical (9:16) | Horizontal |
| 📂 Archivo JSON | Sube tus propios datos | - |
| 📄 Hoja Actual | Selecciona qué mostrar | Primera hoja |
| 🔤 Google Fonts | Inyecta URL de fuente | Roboto Serif |
| 📏 Tamaños | Categoría/Nombre/Precio en puntos | 120/85/100 pt |
| 🎨 Colores | Fondo/Texto/Divisor | #7B0000/#FFFDD0/#D4AF37 |
| 📦 Espaciado | Espacio entre items y márgenes | 32px / 50px |
| ⏱️ Rotación | Auto-cambio cada N segundos | 600s (10 min) |
| 💾 Exportar | Descarga PNG o PDF de alta resolución | - |

---

## 🎨 Colores Recomendados (Pantone 2025/26)

```
Res/Cerdo:     #7B0000  (Rojo oscuro)
Pollo:         #E6A519  (Naranja dorado)
Pescados:      #001F5B  (Azul marino)
Víveres:       #004B23  (Verde oscuro)
Vísceras:      #8D918D  (Gris)

Texto:         #FFFDD0  (Crema)
Divisor:       #D4AF37  (Oro)
```

---

## 📊 Estructura de Datos (JSON)

Necesitas un archivo `.json` con esta estructura:

```json
{
  "meta": {
    "fuente_url": "https://fonts.googleapis.com/...",
    "linea_div_color": "#D4AF37",
    "rotacion_default_minutos": 10
  },
  "hojas": [
    {
      "id": "res_01",
      "nombre": "Res y Cerdo",
      "fondo": "#7B0000",
      "texto": "#FFFDD0",
      "mostrar_logo": true,
      "productos": [
        {
          "categoria": "RES",
          "nombre": "ARRACHERA NAL",
          "precio": 240.00,
          "unidad": "KG",
          "visible": true,
          "nota": ""
        }
      ]
    }
  ]
}
```

---

## 🚀 Casos de Uso

### 📺 Menú en Pantalla (Digital Signage)
1. Sube tu JSON con productos
2. Selecciona **Horizontal** (16:9)
3. Ajusta colores para que sea visible a 5+ metros
4. Usa la **Rotación** para cambiar menús cada 10 minutos
5. Abre en pantalla full-screen en tu carnicería

### 🖨️ Impresión Física
1. Personaliza tu menú en el panel
2. Click **PDF**
3. Abre en Adobe Reader
4. Imprime en papel de alta calidad (A3 recomendado)

### 📱 Vertical Display
1. Selecciona **Vertical** (9:16)
2. El layout se adapta automáticamente
3. Ideal para pantallas empotradas en pilares

---

## ⚙️ Archivos Incluidos

| Archivo | Descripción | Tamaño |
|---------|-------------|--------|
| `web/admin.html` | Interfaz principal | 4 KB |
| `web/admin.css` | Estilos del panel | 8 KB |
| `web/admin.js` | Lógica de la app | 15 KB |
| `sample_data_complete.json` | Datos de ejemplo completos | 3 KB |
| `sample_data_long.json` | Test de word-wrap | 1 KB |
| `sample_data.json` | Mínimo de ejemplo | 0.5 KB |

---

## 🔧 Requerimientos

- **Navegador**: Chrome, Firefox, Safari, Edge (cualquier moderno)
- **Servidor local**: Python 3 (o cualquier HTTP server)
- **Conexión internet**: Solo para cargar Google Fonts (se puede evitar con .ttf)

---

## 💡 Pro Tips

1. **Custom Fonts**: Usa `Upload local` con archivos `.ttf` para fuentes privadas
2. **Fast Export**: El PDF mantiene vector text (editable en Adobe)
3. **Pantalla Automática**: Usa rotación para menú que cambia cada X minutos
4. **Color Picker**: Click en los cuadrados de color para abrir picker visual
5. **Word Wrapping**: Automático, no necesitas saltos de línea manuales

---

## ❓ FAQ

**P: ¿Puedo usar mis propias fuentes?**  
R: Sí, con `.ttf/.woff/.woff2` en la sección "Fuente" → "Cargar local"

**P: ¿Qué tamaño debe tener mi pantalla?**  
R: Para 16:9, cualquier tamaño. El menú se verá igual, solo cambias el zoom.

**P: ¿Puedo editar el PDF descargado?**  
R: Sí, el texto es editable en Adobe Reader o Illustrator

**P: ¿Funciona sin internet?**  
R: Sí, pero debes usar fuentes locales (no Google Fonts)

**P: ¿Cuántas hojas puedo tener?**  
R: Sin límite práctico (probado con 50+)

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| Canvas en blanco | Haz click "Cargar Ejemplo" |
| Fuente no carga | Verifica URL de Google Fonts o sube .ttf |
| Texto se corta | Aumenta "Margen" o disminuye tamaños |
| PNG/PDF no descarga | Verifica bloqueador de pop-ups |
| Rotación no funciona | Intervalo mínimo es 5 segundos |

---

**¿Preguntas?** Revisa `FEATURES.md` para documentación completa.
