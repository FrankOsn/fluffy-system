# Algoritmo de Layout y Reglas Tipográficas

Objetivo
- Definir reglas y pseudocódigo para distribuir productos en 1 o 2 columnas optimizadas para pantallas de alta distancia, priorizando legibilidad del precio y consistencia visual.

Entradas
- `hoja` (objeto): incluye `fondo`, `texto`, `productos[]`, `config` (tamaños, espaciados, grosor_linea).
- `ancho_total_px`, `alto_total_px`: dimensiones del canvas de render.
- `tipografia` con tamaños objetivo en pt: `categoria_pt`, `nombre_pt`, `precio_pt`.

Salidas
- `layout` con columnas y posición (x,y) para cada producto y metadatos de overflow/truncado.

Restricciones y prioridades
1. Prioridad máxima: Precio (no debe reducirse por debajo de 70% del tamaño objetivo salvo excepción configurada).
2. Prioridad media: Nombre del producto (puede reducirse o truncarse antes que reducir el precio).
3. Prioridad baja: Categoría (tamaño fijo preferente; puede escalar si es necesario en casos extremos).
4. Precios alineados a la derecha; nombres alineados a la izquierda dentro de su columna.

Estimación de tamaño de línea
- Para estimar alto requerido por una entrada usamos:
  - `line_height = font_pt * 1.12` (factor de leading recomendado).
  - si el nombre ocupa más de una línea por ancho disponible, se añade `line_height` por línea extra.
- Para medir ancho de texto en implementación real usar `CanvasRenderingContext2D.measureText()` o librería tipográfica. Aquí usamos una estimación por carácter: `avg_char_width_px = font_pt * 0.6` (valor inicial configurable).

Algoritmo (resumen)
1. Calcular `col_gap` (grosor de la línea divisoria) y `col_width = (ancho_total_px - col_gap - margin_left - margin_right) / num_columns`.
2. Para cada producto calcular `estimated_height_i` = suma de alturas de líneas de `categoria`, `nombre` y `precio` + espaciado inter-item.
3. Decidir `num_columns`: si la altura total de lista en 1 columna > `alto_total_px - header_footer`, intentar 2 columnas.
4. Distribuir items entre columnas usando un algoritmo de balanceo (greedy by height):
   - Inicializar `col_heights = [0,0]`.
   - Ordenar items por `estimated_height` descendente.
   - Para cada item asignar a la columna con menor `col_heights`.
5. Si alguna columna excede `alto_total_px - header_footer`, aplicar medidas:
   - Paso A: Reducir `nombre_pt` hasta `nombre_pt_min` (ej. 60% de objetivo) en pasos.
   - Paso B: Si sigue sin caber, truncar nombres (ellipsize) a caracteres que quepan en `col_width` y marcar `has_tooltip=true`.
   - Paso C: Si aún no cabe, reducir `categoria_pt` hasta mínimo aceptable; nunca reducir `precio_pt` por debajo de 70%.
6. Generar posiciones (x,y) por columna: `x_left = margin_left`, `x_right = margin_left + col_width + col_gap`.

Pseudocódigo (JavaScript-like)
```js
function layoutHoja(hoja, ancho, alto, config){
  const margin = config.margin || 40;
  const colGap = config.colGap || config.grosor_linea || 8;
  const target = {categoria:config.categoria_pt, nombre:config.nombre_pt, precio:config.precio_pt};
  const min = {categoria: Math.round(target.categoria*0.7), nombre: Math.round(target.nombre*0.6), precio: Math.round(target.precio*0.7)};

  let numColumns = 1;
  const usableWidth = ancho - margin*2;
  const colWidth1 = usableWidth;

  let items = hoja.productos.map(p => ({...p, estHeight: estimateHeight(p, target, colWidth1)}));
  const totalHeight1 = items.reduce((s,i)=>s+i.estHeight,0);

  if(totalHeight1 > (alto - config.headerFooter)){
    numColumns = 2;
  }

  const colWidth = (usableWidth - (numColumns-1)*colGap)/numColumns;
  items.forEach(i => i.estHeight = estimateHeight(i, target, colWidth));

  // Greedy balance by height
  const cols = Array.from({length:numColumns}, ()=>({items:[], height:0}));
  items.sort((a,b)=>b.estHeight - a.estHeight);
  for(const it of items){
    cols.sort((a,b)=>a.height-b.height);
    cols[0].items.push(it);
    cols[0].height += it.estHeight;
  }

  // Fit checks and adjustments
  let adjusted = adjustFontsToFit(cols, alto, config, target, min, colWidth);

  // Calculate positions
  const layout = [];
  cols.forEach((col,ci)=>{
    let y = config.headerPadding;
    const x = margin + ci*(colWidth + colGap);
    for(const it of col.items){
      layout.push({product:it, x, y, width:colWidth});
      y += it.estHeight;
    }
  });

  return {layout, numColumns, adjusted};
}

function estimateHeight(item, sizes, colWidth){
  const lineH = ptToPx(sizes.nombre) * 1.12;
  const nameCharsPerLine = Math.floor(colWidth / (ptToPx(sizes.nombre)*0.6));
  const nameLines = Math.max(1, Math.ceil(item.nombre.length / Math.max(1, nameCharsPerLine)));
  const catH = ptToPx(sizes.categoria) * 1.12;
  const priceH = ptToPx(sizes.precio) * 1.12;
  const est = catH + nameLines*lineH + priceH + (sizes.itemSpacing || 8);
  return est;
}

function ptToPx(pt){ return Math.round(pt * 1.333); } // 1pt = 1.333px at 96dpi, ajustar si es necesario
```

Reglas tipográficas y valores recomendados
- Tamaños objetivo (por defecto): `categoria=120pt`, `nombre=85pt`, `precio=100pt`.
- Límites mínimos razonables: `categoria_min=84pt` (70%), `nombre_min=51pt` (60%), `precio_min=70pt` (70%).
- Interlineado: `lineHeight = fontPt * 1.12`.
- Espaciado entre productos: configurable por `itemSpacing` en px (recomendado 12–24px; usar equivalente a 'una letra' como en el brief).

Comportamiento ante fuentes personalizadas y medición exacta
- Implementación real debe usar medición real de texto (`canvas.measureText`) para obtener `actualBoundingBoxAscent/Descent` cuando esté disponible.
- Cachear mediciones por texto y tamaño para rendimiento.

Truncado y tooltips
- Cuando se aplica truncado, guardar versión completa en `metadata.tooltip` y mostrar `…` al final. En export estático opcionalmente mostrar nombre completo en línea extra o con menor prioridad.

Notas de rendimiento y UX
- Calcular layout en worker si la lista es larga (>200 items).
- Preview en tiempo real puede usar simplificación estimada para mantener interactividad y recalcular exacto en export alta resolución.

Ejemplo de configuración de `config` recomendada
```json
{
  "margin":40,
  "headerFooter":120,
  "grosor_linea":8,
  "categoria_pt":120,
  "nombre_pt":85,
  "precio_pt":100,
  "itemSpacing":18
}
```

Conclusión
- Este diseño prioriza la legibilidad del precio, equilibra las columnas por altura y proporciona reglas de degradación controladas (reducción de nombre, truncado, reducción de categoría) antes de tocar el precio. La implementación deberá usar mediciones exactas para ajustes finos y ofrecer límites configurables para tolerancias visuales.
