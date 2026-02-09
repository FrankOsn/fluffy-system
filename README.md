# Generador de Menús Dinámicos — Proyecto Carnicería Los 44

Solución web para generar menús optimizados para pantallas de alta distancia (5+ metros) en una carnicería. Carga datos en JSON, renderiza con paleta personalizable y exporta PNG/PDF.

## Inicio rápido

```bash
# 1. Ve al directorio del proyecto
cd /Users/franciscoosnaya/Documents/CARNICERIA/fluffy-system

# 2. Inicia servidor local
python3 -m http.server 8000

# 3. Abre en navegador
# http://localhost:8000/web/index.html
```

## ¿Qué hay dentro?

```
fluffy-system/
├── README_MENUDINAMICO.md          # Tracking de tareas
├── GUIDE.md                         # Guía de uso detallada
├── sample_data.json                 # Datos básicos (Res, Cerdo, Pollo)
├── sample_data_long.json            # Nombres largos para probar wrapping
├── docs/
│   └── algorithm_layout.md          # Especificación técnica del layout
├── assets/wireframes/               # Diseños UI (SVG)
│   ├── dashboard.svg
│   ├── importer.svg
│   ├── stylebuilder.svg
│   └── preview.svg
└── web/                             # Aplicación web
    ├── index.html                   # Interfaz
    ├── styles.css                   # Estilos
    └── app.js                       # Lógica de renderizado
```

## Funcionalidades

✅ Carga datos JSON  
✅ Renderiza en canvas optimizado para distancia  
✅ Wrapping inteligente por palabras  
✅ Soporte Google Fonts + fuentes locales (.ttf, .woff, .woff2)  
✅ Rotación automática configurable  
✅ Exporta PNG + PDF  
✅ Algoritmo de layout con balanceo de columnas  

## Paleta de colores (Pantone 2025/26)

| Categoría | Fondo | Texto |
|-----------|-------|-------|
| Res y Cerdo | #7B0000 | #FFFDD0 |
| Pollo | #E6A519 | #2B1B00 |
| Pescados | #001F5B | #FFFDD0 |
| Víveres | #004B23 | #FFFDD0 |
| Vísceras | #8D918D | #FFFFFF |

## Estructura JSON mínima

```json
{
  "meta": {
    "fuente_url": "https://...",
    "linea_div_color": "#D4AF37",
    "rotacion_default_minutos": 10
  },
  "hojas": [
    {
      "id": "res_01",
      "nombre": "Res",
      "fondo": "#7B0000",
      "texto": "#FFFDD0",
      "mostrar_logo": true,
      "productos": [
        {
          "categoria": "RES",
          "nombre": "ARRACHERA",
          "precio": 160.00,
          "unidad": "KG",
          "visible": true,
          "nota": ""
        }
      ]
    }
  ]
}
```

## Características futuras

- [ ] CSV import (mapeador de columnas)
- [ ] Dashboard web completo (Style Builder integrado)
- [ ] Historial y auditoría
- [ ] API REST para gestión de menús
- [ ] Integración con sistemas POS

## Documentación

- **[GUIDE.md](GUIDE.md)** — Guía de uso paso a paso
- **[docs/algorithm_layout.md](docs/algorithm_layout.md)** — Especificación técnica del renderizador
- **[README_MENUDINAMICO.md](README_MENUDINAMICO.md)** — Tracking de desarrollo

## Requerimientos

- Navegador moderno (Chrome, Firefox, Safari, Edge).
- Servidor HTTP local (Python, Node, etc.) para servir archivos.

## Licencia

Interno — Proyecto Carnicería Los 44 (2026).
