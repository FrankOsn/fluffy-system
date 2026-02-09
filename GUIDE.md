# Guía de Uso — Generador de Menús Dinámicos

## Inicio rápido

1. **Inicia el servidor**:
   ```bash
   cd /Users/franciscoosnaya/Documents/CARNICERIA/fluffy-system
   python3 -m http.server 8000
   ```

2. **Abre en tu navegador**:
   - http://localhost:8000/web/index.html

3. **Cargar datos**:
   - Por defecto carga `sample_data.json`.
   - O arrastra un JSON propio en el input "Archivo JSON" del panel.

4. **Configurar fuentes** (opcional):
   - **Google Fonts CSS**: Pre-llenado con Roboto. Cambia la URL si quieres otra familia.
   - **Local .ttf/.woff/.woff2**: Sube un archivo de tu computadora.

5. **Rotación**:
   - Ajusta segundos en "Intervalo rotación" (default: 600s = 10min).
   - Pulsa "Iniciar rotación" para ciclar automáticamente entre hojas.

6. **Exportar**:
   - **PNG**: Descarga la hoja actual como imagen PNG.
   - **PDF**: Descarga la hoja actual como PDF.

---

## Estructura de JSON

Archivo mínimo:

```json
{
  "meta":{
    "fuente_url":"https://fonts.googleapis.com/...",
    "linea_div_color":"#D4AF37",
    "rotacion_default_minutos":10
  },
  "hojas":[
    {
      "id":"res_01",
      "nombre":"Res - Rojo",
      "fondo":"#7B0000",
      "texto":"#FFFDD0",
      "mostrar_logo":true,
      "productos":[
        {
          "categoria":"RES",
          "nombre":"ARRACHERA MARINADA",
          "precio":160.00,
          "unidad":"KG",
          "visible":true,
          "nota":""
        }
      ]
    }
  ]
}
```

### Campos explicados

- `hojas`: Array de pantallas/slides en rotación.
- `fondo` (HEX): Color de fondo de la hoja.
- `texto` (HEX): Color del texto (categoría, nombre, precio).
- `productos`: Array de items a mostrar.
  - `categoria`: Ej. "RES", "POLLO", "PESCADO".
  - `nombre`: Nombre del producto.
  - `precio`: Número (ej. 160.00).
  - `unidad`: "KG", "PIEZA", etc.
  - `visible`: true/false (mostrar/ocultar).
  - `nota`: Texto adicional (ej. "Bajo pedido").

---

## Paleta de colores recomendada (Pantone 2025/26)

| Categoría | Fondo | Texto |
|-----------|-------|-------|
| Res y Cerdo | #7B0000 | #FFFDD0 |
| Pollo | #E6A519 | #2B1B00 |
| Pescados | #001F5B | #FFFDD0 |
| Víveres | #004B23 | #FFFDD0 |
| Vísceras | #8D918D | #FFFFFF |

---

## Tamaños de fuente (pt)

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
