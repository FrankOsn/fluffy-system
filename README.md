# Generador de Menús Dinámicos — Proyecto Carnicería Los 44

Solución web para generar menús optimizados para pantallas de alta distancia (5+ metros) en una carnicería. Carga datos en JSON, renderiza con paleta personalizable y exporta PNG/PDF.

## 🚀 Inicio rápido (3 pasos)

```bash
# 1. Ve al directorio del proyecto
cd /Users/franciscoosnaya/Documents/CARNICERIA/fluffy-system

# 2. Inicia servidor local
python3 -m http.server 8000

# 3. Abre en navegador (NUEVA interfaz admin)
# http://localhost:8000/web/admin.html
```

👉 **[Ver Quick Start detallado →](QUICKSTART.md)**

## 📚 Documentación

| Documento | Propósito |
|-----------|-----------|
| **[QUICKSTART.md](QUICKSTART.md)** | Guía de 5 minutos para empezar |
| **[FEATURES.md](FEATURES.md)** | Documentación completa de todas las características |
| **[GUIDE.md](GUIDE.md)** | Guía de uso detallada (estructura, paletas, etc) |
| **[docs/algorithm_layout.md](docs/algorithm_layout.md)** | Especificación técnica del algoritmo |

## ¿Qué hay dentro?

```
fluffy-system/
├── README.md                        # Este archivo
├── QUICKSTART.md                    # ⭐ Cómo empezar rápido
├── FEATURES.md                      # ⭐ Documentación completa
├── README_MENUDINAMICO.md           # Tracking de tareas
├── GUIDE.md                         # Guía de uso detallada
├── sample_data_complete.json        # ⭐ Datos de ejemplo (6 hojas)
├── sample_data_long.json            # Nombres largos para probar wrapping
├── sample_data.json                 # Datos básicos (Res, Cerdo, Pollo)
├── docs/
│   └── algorithm_layout.md          # Especificación técnica del layout
├── assets/wireframes/               # Diseños UI (SVG)
│   ├── dashboard.svg
│   ├── importer.svg
│   ├── stylebuilder.svg
│   └── preview.svg
└── web/                             # Aplicación web
    ├── admin.html                   # ⭐ Panel de control (NUEVO v0.0.2)
    ├── admin.css                    # ⭐ Estilos del panel (NUEVO v0.0.2)
    ├── admin.js                     # ⭐ Lógica de aplicación (NUEVO v0.0.2)
    ├── index.html                   # Interfaz original (legacy)
    ├── styles.css                   # Estilos originales
    ├── app.js                       # Renderer original (deprecated)
    ├── app_v2.js                    # Renderer mejorado (backend)
```

## 🎯 Funcionalidades v0.0.2

✅ **Panel Admin**: Interfaz completa con controles dinámicos  
✅ **Orientación 16:9**: Horizontal (1280×720) o Vertical (720×1280)  
✅ **Carga JSON**: Soporta datos personalizados  
✅ **Renderización Canvas**: Optimizado para distancia (5+ metros)  
✅ **Word-Wrap Inteligente**: Por palabras, no caracteres  
✅ **Fuentes**: Google Fonts + locales (.ttf, .woff, .woff2)  
✅ **Rotación automática**: Configurable por segundos  
✅ **Exportación**: PNG + PDF de alta resolución  
✅ **Colores dinámicos**: Selector de color en tiempo real  
✅ **Algoritmo equilibrado**: Distribución automática en columnas  

## 🎨 Paleta de colores (Pantone 2025/26)

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

- **v0.0.3**: CSV import, Presets de estilos Pantone
- **v0.0.4**: Dashboard con miniaturas de hojas
- **v0.0.5**: Sincronización multi-pantalla en red

## 🤝 Stack Técnico

**Frontend**
- HTML5 Canvas (rendering optimizado para distancia)
- CSS3 Grid + Flexbox (responsive design)
- JavaScript Vanilla (sin frameworks)
- FontFace API (carga dinámmica de fuentes)
- jsPDF (exportación a PDF)

**Hosting**
- Python HTTP Server (desarrollo local)
- Compatible con Apache, Nginx, etc.

**Assets**
- Google Fonts API
- Fuentes locales (.ttf, .woff, .woff2)

## 📊 Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| **0.0.2** | 2024 | Panel admin completo, orientación 16:9, renderización mejorada |
| **0.0.1** | 2024 | Prototipo inicial, canvas básico |

## 🔄 Roadmap

- [x] Scope definition y especificación técnica
- [x] JSON schema y datos de ejemplo
- [x] Canvas renderer con word-wrap
- [x] Google Fonts + local font support
- [x] Rotación y exportación (PNG/PDF)
- [x] Admin panel con orientación 16:9
- [ ] Validación y manejo de errores robusto
- [ ] CSV import
- [ ] Presets de paletas
- [ ] Dashboard mejorado
- [ ] Sincronización multi-pantalla

## 📞 Soporte

Si encuentras problemas:
1. Revisa [QUICKSTART.md](QUICKSTART.md) para ayuda rápida
2. Mira [FEATURES.md](FEATURES.md) para documentación completa
3. Abre la consola del navegador (F12) para ver logs de debugging
4. Verifica que tu JSON siga la estructura correcta

## 📄 Licencia

Proyecto privado para Carnicería Los 44

---

**Última actualización**: 2024  
**Versión estable**: 0.0.2


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
