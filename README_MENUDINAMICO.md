# Generador de Menús Dinámicos — Tracking y Tareas

Estado y tracking de trabajo para el proyecto "Generador de Menús Dinámicos".

## ✅ Entregables finalizados

- [x] Crear README con tracking y esquema (md)
- [x] Definir esquema JSON y ejemplo (sample_data.json)
- [x] Diseñar wireframes: Dashboard, Importador, Style Builder, Preview (SVG)
- [x] Especificar algoritmo de layout y reglas tipográficas
- [x] Definir motor de renderizado: preview, rotación y exportación
- [x] Implementar wrapping inteligente (word-based)
- [x] Agregar Google Fonts URL por defecto y sample_data_long.json
- [x] Mejorar carga de fuentes: CSS Google Fonts + upload .ttf/.woff/.woff2 local
- [x] Guía de uso (GUIDE.md)
- [x] README principal (README.md)
- [x] Datos completos del PDF (sample_data_complete.json)

## 📁 Estructura final

```
fluffy-system/
├── README.md                        ← START HERE (Resumen y quick start)
├── GUIDE.md                         ← Guía de uso detallada
├── README_MENUDINAMICO.md           ← Este archivo (Tracking)
├── sample_data.json                 ← Datos básicos
├── sample_data_long.json            ← Nombres largos (test wrapping)
├── sample_data_complete.json        ← Datos completos del PDF original
├── docs/
│   └── algorithm_layout.md          ← Especificación técnica
├── assets/wireframes/               ← Diseños UI (SVG)
│   ├── dashboard.svg
│   ├── importer.svg
│   ├── stylebuilder.svg
│   └── preview.svg
└── web/                             ← Aplicación web
    ├── index.html
    ├── styles.css
    └── app.js
```

## 🚀 Inicio rápido

```bash
cd /Users/franciscoosnaya/Documents/CARNICERIA/fluffy-system
python3 -m http.server 8000
# Abre: http://localhost:8000/web/index.html
```

## 📋 Esquema JSON (resumen)

```json
{
  "meta":{
    "fuente_url":"https://...",
    "linea_div_color":"#D4AF37",
    "rotacion_default_minutos":10
  },
  "hojas":[
    {
      "id":"categoria_01",
      "nombre":"Nombre de la Hoja",
      "fondo":"#7B0000",
      "texto":"#FFFDD0",
      "mostrar_logo":true,
      "productos":[
        {"categoria":"RES","nombre":"PRODUCTO","precio":100.00,"unidad":"KG","visible":true,"nota":""}
      ]
    }
  ]
}
```

## 🎨 Paleta de colores recomendada (Pantone 2025/26)

| Categoría | Fondo | Texto |
|-----------|-------|-------|
| Res y Cerdo | #7B0000 | #FFFDD0 |
| Pollo | #E6A519 | #2B1B00 |
| Pescados | #001F5B | #FFFDD0 |
| Víveres | #004B23 | #FFFDD0 |
| Vísceras | #8D918D | #FFFFFF |

## ✨ Características implementadas

✅ Carga de JSON dinámico  
✅ Canvas rendering optimizado para pantallas a distancia  
✅ Wrapping inteligente por palabras (word-wrap)  
✅ Algoritmo de layout con balanceo automático de columnas  
✅ Soporte Google Fonts CSS + fuentes locales (.ttf, .woff, .woff2)  
✅ Rotación automática configurable  
✅ Exporta PNG (1280x720 HD) y PDF  
✅ Línea divisoria central personalizable  
✅ Reducción iterativa de tamaño si no cabe (prioridad: precio > nombre > categoría)  

## 📝 Características futuras (no incluidas)

- [ ] Importación CSV (con mapeador de columnas)
- [ ] Dashboard web completo (CRUD de productos, Style Builder GUI)
- [ ] Historial y auditoría de cambios
- [ ] API REST para gestión remota
- [ ] Integración con sistemas POS

## 📖 Documentación

- **[README.md](README.md)** — Inicio rápido y descripción general
- **[GUIDE.md](GUIDE.md)** — Guía de uso paso a paso
- **[docs/algorithm_layout.md](docs/algorithm_layout.md)** — Especificación técnica del layout y renderizador

## 📊 Archivos de ejemplo

1. **sample_data.json** — Datos básicos (Res, Cerdo, Pollo)
2. **sample_data_long.json** — Nombres largos para probar wrapping
3. **sample_data_complete.json** — Todas las categorías del PDF: Res, Cerdo, Pollo, Pescados, Víveres, Vísceras

## 🔧 Tecnologías usadas

- **HTML5 Canvas** — Renderizado de gráficos
- **JavaScript Vanilla** — Lógica, sin frameworks
- **CSS3** — Estilos responsivos
- **Google Fonts API** — Fuentes web
- **jsPDF** — Exportación a PDF
- **FontFace API** — Carga de fuentes locales

## 🎯 Próximos pasos sugeridos

1. Prueba la demo: http://localhost:8000/web/index.html
2. Carga `sample_data_complete.json` para ver todas las categorías
3. Experimenta con fuentes (Google Fonts o sube un .ttf local)
4. Ajusta colores en el JSON si lo deseas
5. Exporta PNG/PDF para usar en pantallas o imprimir

## ℹ️ Notas técnicas

- El algoritmo de layout usa `canvas.measureText()` para mediciones exactas de texto.
- Los tamaños por defecto (120pt categoría, 85pt nombre, 100pt precio) están optimizados para 5+ metros.
- El wrapping es inteligente: divide por palabras, no por caracteres.
- Si los productos no caben, el `nombre_pt` se reduce iterativamente hasta 51pt (60% del objetivo).

---

**Proyecto finalizado: Febrero 9, 2026**
