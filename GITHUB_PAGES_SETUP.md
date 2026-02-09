# 🚀 Desplegar en GitHub Pages

## Instrucciones Rápidas

### 1. Hacer Fork del Repositorio
```bash
# En GitHub, haz click en "Fork" en https://github.com/[tu-usuario]/fluffy-system
```

### 2. Habilitar GitHub Pages
```
1. Ve a Settings del repositorio
2. Ve a Pages (lado izquierdo)
3. Source: main branch, /root folder
4. Guarda cambios
```

### 3. Acceder a la Aplicación
```
Tu URL será:
https://[tu-usuario].github.io/fluffy-system/web/admin.html

Ejemplo:
https://myusername.github.io/fluffy-system/web/admin.html
```

---

## Estructura de Archivos Esperada

Para que GitHub Pages funcione correctamente:

```
fluffy-system/
├── web/
│   ├── admin.html           ← Página principal
│   ├── admin.js             ← Lógica
│   └── admin.css            ← Estilos
├── sample_data_complete.json
├── sample_data.json
├── README.md
└── [otros archivos]
```

---

## Configuración CORS

Si tienes problemas cargando archivos JSON desde GitHub Pages:

### Opción 1: Usar Raw GitHub URL
```javascript
const res = await fetch('https://raw.githubusercontent.com/[usuario]/fluffy-system/main/sample_data_complete.json');
```

### Opción 2: Incluir JSON como HTML
```html
<script id="data">
window.preloadedData = { ... };
</script>
```

**Nota**: La configuración actual trabaja bien con rutas relativas (`../sample_data_complete.json`)

---

## Troubleshooting

### "No se carga el JSON"
- Verifica que el archivo está en la carpeta raíz
- Usa la ruta relativa: `../sample_data_complete.json`
- Revisa la consola del navegador (F12)

### "Los estilos no se aplican"
- Verifica que `admin.css` está en la carpeta `web/`
- Limpia el caché del navegador (Ctrl+Shift+R)

### "No puedo descargar archivos"
- Es normal en GitHub Pages - solo descarga
- Los archivos se guardarán en tu carpeta de descargas
- Usa `PNG TODO` y `PDF TODO` para múltiples archivos

---

## Actualizar el Contenido

### Cambiar los Datos JSON
```bash
1. Edita sample_data_complete.json
2. Git push
3. GitHub Pages se actualiza automáticamente
```

### Cambiar la Lógica
```bash
1. Edita web/admin.js
2. Git push
3. Recarga la página en el navegador (Ctrl+F5)
```

---

## URLs Útiles

- **Admin Panel**: `/web/admin.html`
- **Datos de Ejemplo**: `/sample_data_complete.json`
- **Release Notes**: `/RELEASE_v0.3.2.md`

---

## Performance en GitHub Pages

- ✅ Carga rápida (CDN global de GitHub)
- ✅ Sin cuota de ancho de banda
- ✅ HTTPS automático
- ✅ Actualizaciones instantáneas

---

## Soporte

Si tienes problemas:
1. Revisa la consola (F12)
2. Verifica estructura de archivos
3. Limpia caché del navegador
4. Abre un issue en GitHub

