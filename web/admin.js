// Admin Panel - Menu Generator v0.4.0 [STABLE] - Categoría central + Unidad configurable + Disclaimer
// Features: Per-sheet styles, Category title, Unit display, Disclaimer, Logo upload, ZIP exports, Multi-page PDF
(function(){
  const canvas = document.getElementById('menuCanvas');
  const ctx = canvas.getContext('2d');
  
  // Controls
  const orientationRadios = document.querySelectorAll('input[name="orientation"]');
  const fileInput = document.getElementById('fileInput');
  const btnLoadSample = document.getElementById('btnLoadSample');
  const sheetSelect = document.getElementById('sheetSelect');
  const sheetCount = document.getElementById('sheetCount');
  const fontCssInput = document.getElementById('fontCss');
  const fontFileInput = document.getElementById('fontFile');
  const logoFileInput = document.getElementById('logoFile');
  const titulo_ptInput = document.getElementById('titulo_pt');
  const nombre_ptInput = document.getElementById('nombre_pt');
  const precio_ptInput = document.getElementById('precio_pt');
  const unidad_ptInput = document.getElementById('unidad_pt');
  const showTituloInput = document.getElementById('showTitulo');
  const showUnidadInput = document.getElementById('showUnidad');
  const disclaimerInput = document.getElementById('disclaimer');
  const bgColorInput = document.getElementById('bgcolor');
  const bgColorPicker = document.getElementById('bgcolorPicker');
  const textColorInput = document.getElementById('textcolor');
  const textColorPicker = document.getElementById('textcolorPicker');
  const dividerColorInput = document.getElementById('dividercolor');
  const dividerColorPicker = document.getElementById('dividercolorPicker');
  const itemSpacingInput = document.getElementById('itemSpacing');
  const marginInput = document.getElementById('margin');
  const rotIntervalInput = document.getElementById('rotInterval');
  const startRotBtn = document.getElementById('startRotation');
  const stopRotBtn = document.getElementById('stopRotation');
  const exportPNGBtn = document.getElementById('exportPNG');
  const exportAllPNGBtn = document.getElementById('exportAllPNG');
  const exportPDFBtn = document.getElementById('exportPDF');
  const exportAllPDFBtn = document.getElementById('exportAllPDF');
  const previewInfo = document.getElementById('previewInfo');
  const saveConfigBtn = document.getElementById('saveConfig');
  const loadConfigBtn = document.getElementById('loadConfig');
  const configFile = document.getElementById('configFile');

  let data = null;
  let currentIndex = 0;
  let currentLogoImage = null;
  let rotTimer = null;
  let fontsLoaded = false;
  let orientation = 'landscape'; // 16:9
  
  // Store per-sheet styles
  let sheetStyles = {};

  // Logo file input handler
  if (logoFileInput) {
    logoFileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (!data || !data.hojas) {
        alert('No hay datos cargados');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(event) {
        const dataurl = event.target.result;
        const currentSheetId = sheetSelect.value;
        currentIndex = parseInt(currentSheetId, 10) || 0;
        const hoja = data && data.hojas ? data.hojas[currentIndex] : null;
        const sheetKey = hoja && hoja.id ? hoja.id : `sheet_${currentIndex}`;
        
        // Save logo to localStorage
        localStorage.setItem(`logo_${sheetKey}`, dataurl);
        
        // Update the sheet
        loadSheetStyle();
        renderSheet(currentIndex);
        
        alert(`Logo guardado para ${document.querySelector(`#sheetSelect option[value="${currentSheetId}"]`).text}`);
      };
      reader.readAsDataURL(file);
    });
  }

  console.log('Admin panel v0.4.0 initialized');

  // Canvas dimensions based on orientation
  function getCanvasDimensions() {
    // Check if we have a current sheet with its own orientation
    if (data && data.hojas && data.hojas[currentIndex] && data.hojas[currentIndex].orientacion) {
      const sheetOrientation = data.hojas[currentIndex].orientacion;
      if (sheetOrientation === 'landscape') {
        return { width: 1280, height: 720 }; // 16:9
      } else {
        return { width: 720, height: 1280 }; // 9:16
      }
    }
    // Fallback to global orientation
    if (orientation === 'landscape') {
      return { width: 1280, height: 720 }; // 16:9
    } else {
      return { width: 720, height: 1280 }; // 9:16
    }
  }

  function updateCanvasDimensions() {
    const dims = getCanvasDimensions();
    canvas.width = dims.width;
    canvas.height = dims.height;
    if (data) renderSheet(currentIndex);
  }

  // Orientation change
  orientationRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      orientation = e.target.value;
      console.log('Orientation changed to:', orientation);
      updateCanvasDimensions();
    });
  });

  // Load sample data
  async function loadSample() {
    try {
      const res = await fetch('../sample_data_complete.json');
      data = await res.json();
      console.log('Sample data loaded:', data);
      sheetStyles = {};
      populateSheetSelect();
      initColorSync();
      currentIndex = 0;
      loadSheetStyle();
      const firstSheetFont = data.hojas[0]?.fuente_url || fontCssInput.value;
      loadFont(firstSheetFont).then(() => renderSheet(0));
    } catch (e) {
      console.error('Error loading sample:', e);
      previewInfo.textContent = 'Error cargando datos: ' + e.message;
    }
  }

  btnLoadSample.addEventListener('click', loadSample);

  // Populate sheet selector
  function populateSheetSelect() {
    sheetSelect.innerHTML = '';
    if (!data || !data.hojas) return;
    const total = data.hojas.length;
    data.hojas.forEach((hoja, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = hoja.nombre || `Hoja ${i + 1}`;
      sheetSelect.appendChild(opt);
    });
    sheetSelect.value = 0;
    updateSheetCounter();
    console.log('Sheet selector populated with', total, 'sheets');
  }

  // ============ COLOR PICKER SYNC ============
  function initColorSync() {
    // Fondo
    bgColorPicker.addEventListener('change', () => {
      bgColorInput.value = bgColorPicker.value;
      saveSheetStyle();
      renderSheet(currentIndex);
    });
    bgColorInput.addEventListener('input', () => {
      if (/^#[0-9A-F]{6}$/i.test(bgColorInput.value)) {
        bgColorPicker.value = bgColorInput.value;
        saveSheetStyle();
        renderSheet(currentIndex);
      }
    });

    // Texto
    textColorPicker.addEventListener('change', () => {
      textColorInput.value = textColorPicker.value;
      saveSheetStyle();
      renderSheet(currentIndex);
    });
    textColorInput.addEventListener('input', () => {
      if (/^#[0-9A-F]{6}$/i.test(textColorInput.value)) {
        textColorPicker.value = textColorInput.value;
        saveSheetStyle();
        renderSheet(currentIndex);
      }
    });

    // Divisor
    dividerColorPicker.addEventListener('change', () => {
      dividerColorInput.value = dividerColorPicker.value;
      saveSheetStyle();
      renderSheet(currentIndex);
    });
    dividerColorInput.addEventListener('input', () => {
      if (/^#[0-9A-F]{6}$/i.test(dividerColorInput.value)) {
        dividerColorPicker.value = dividerColorInput.value;
        saveSheetStyle();
        renderSheet(currentIndex);
      }
    });
  }

  function updateSheetCounter() {
    if (data && data.hojas) {
      sheetCount.textContent = `${currentIndex + 1}/${data.hojas.length}`;
    }
  }

  sheetSelect.addEventListener('change', (e) => {
    currentIndex = parseInt(e.target.value);
    updateSheetCounter();
    loadSheetStyle();
    const sheetFont = data.hojas[currentIndex]?.fuente_url || fontCssInput.value;
    if (sheetFont) loadFont(sheetFont);
    renderSheet(currentIndex);
  });

  // Load fonts
  async function loadFont(url) {
    if (!url) {
      fontsLoaded = false;
      return;
    }
    try {
      if (url.includes('fonts.googleapis.com')) {
        const linkId = 'gf-stylesheet';
        if (!document.getElementById(linkId)) {
          const l = document.createElement('link');
          l.id = linkId;
          l.rel = 'stylesheet';
          l.href = url;
          document.head.appendChild(l);
        }
        await document.fonts.ready;
        fontsLoaded = true;
        console.log('Google Fonts loaded');
        if (data) renderSheet(currentIndex);
        return;
      }
      const font = new FontFace('UserFont', `url(${url})`);
      await font.load();
      document.fonts.add(font);
      fontsLoaded = true;
      console.log('Custom font loaded from URL');
      if (data) renderSheet(currentIndex);
    } catch (e) {
      console.warn('Font load error:', e);
      fontsLoaded = false;
    }
  }

  fontCssInput.addEventListener('change', () => loadFont(fontCssInput.value));

  fontFileInput.addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const ab = await f.arrayBuffer();
      const font = new FontFace('UserFont', ab, {});
      await font.load();
      document.fonts.add(font);
      fontsLoaded = true;
      console.log('Local font file loaded');
      if (data) renderSheet(currentIndex);
    } catch (e) {
      console.warn('Local font error:', e);
      fontsLoaded = false;
    }
  });

  fileInput.addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const txt = await f.text();
      data = JSON.parse(txt);
      sheetStyles = {};
      populateSheetSelect();
      initColorSync();
      currentIndex = 0;
      loadSheetStyle();
      renderSheet(0);
      console.log('Custom JSON file loaded');
    } catch (e) {
      alert('JSON inválido: ' + e.message);
    }
  });

  // Per-sheet style management
  function saveSheetStyle() {
    if (!data || !data.hojas || !data.hojas[currentIndex]) return;
    
    const hoja = data.hojas[currentIndex];
    const sheetId = hoja.id || `sheet_${currentIndex}`;
    
    sheetStyles[sheetId] = {
      titulo_pt: parseInt(titulo_ptInput.value) || 140,
      nombre_pt: parseInt(nombre_ptInput.value) || 85,
      precio_pt: parseInt(precio_ptInput.value) || 100,
      unidad_pt: parseInt(unidad_ptInput.value) || 65,
      showTitulo: showTituloInput.checked,
      showUnidad: showUnidadInput.checked,
      disclaimer: disclaimerInput.value || '',
      bgcolor: bgColorInput.value || '#7B0000',
      textcolor: textColorInput.value || '#FFFDD0',
      dividercolor: dividerColorInput.value || '#D4AF37',
      itemSpacing: parseInt(itemSpacingInput.value) || 32,
      margin: parseInt(marginInput.value) || 50
    };
    
    console.log('Sheet style saved for:', sheetId);
  }

  function loadSheetStyle() {
    if (!data || !data.hojas || !data.hojas[currentIndex]) return;
    
    const hoja = data.hojas[currentIndex];
    const sheetId = hoja.id || `sheet_${currentIndex}`;
    
    const style = sheetStyles[sheetId];
    const hojaDivider = hoja.linea_div_color || '#D4AF37';
    
    // Load logo from localStorage if exists
    const logoData = localStorage.getItem(`logo_${sheetId}`);
    window.currentLogo = logoData || null;
    if (logoData) {
      currentLogoImage = new Image();
      currentLogoImage.src = logoData;
    } else {
      currentLogoImage = null;
    }
    
    if (style) {
      titulo_ptInput.value = style.titulo_pt;
      nombre_ptInput.value = style.nombre_pt;
      precio_ptInput.value = style.precio_pt;
      unidad_ptInput.value = style.unidad_pt;
      showTituloInput.checked = style.showTitulo !== false;
      showUnidadInput.checked = style.showUnidad !== false;
      disclaimerInput.value = style.disclaimer || '';
      bgColorInput.value = style.bgcolor;
      bgColorPicker.value = style.bgcolor;
      textColorInput.value = style.textcolor;
      textColorPicker.value = style.textcolor;
      dividerColorInput.value = style.dividercolor || hojaDivider;
      dividerColorPicker.value = style.dividercolor || hojaDivider;
      itemSpacingInput.value = style.itemSpacing;
      marginInput.value = style.margin;
      console.log('Sheet style loaded for:', sheetId);
    } else {
      // Default values from hoja
      const catConfig = hoja.categoria_config || {};
      const unidadConfig = hoja.unidad_config || {};
      
      titulo_ptInput.value = catConfig.size || 140;
      nombre_ptInput.value = 85;
      precio_ptInput.value = 100;
      unidad_ptInput.value = unidadConfig.size || 65;
      showTituloInput.checked = catConfig.visible !== false;
      showUnidadInput.checked = unidadConfig.visible !== false;
      disclaimerInput.value = hoja.disclaimer || '';
      bgColorInput.value = hoja.fondo || '#7B0000';
      bgColorPicker.value = hoja.fondo || '#7B0000';
      textColorInput.value = hoja.texto || '#FFFDD0';
      textColorPicker.value = hoja.texto || '#FFFDD0';
      dividerColorInput.value = hojaDivider;
      dividerColorPicker.value = hojaDivider;
      itemSpacingInput.value = 32;
      marginInput.value = 50;
    }
  }

  function ensureLogoReady() {
    if (!window.currentLogo) return Promise.resolve();
    if (currentLogoImage && currentLogoImage.complete) return Promise.resolve();
    return new Promise((resolve) => {
      const img = currentLogoImage || new Image();
      img.onload = () => {
        currentLogoImage = img;
        resolve();
      };
      img.onerror = () => resolve();
      img.src = window.currentLogo;
    });
  }

  // Render function
  function renderSheet(index) {
    if (!data || !data.hojas) {
      previewInfo.textContent = 'No data loaded';
      return;
    }

    currentIndex = index % data.hojas.length;
    updateSheetCounter();
    const hoja = data.hojas[currentIndex];
    const dims = getCanvasDimensions();

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = bgColorInput.value || hoja.fondo || '#7B0000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textBaseline = 'top';

    // Config from inputs
    const cfg = {
      margin: parseInt(marginInput.value) || 50,
      colGap: 18,
      titulo_pt: parseInt(titulo_ptInput.value) || 140,
      nombre_pt: parseInt(nombre_ptInput.value) || 85,
      precio_pt: parseInt(precio_ptInput.value) || 100,
      unidad_pt: parseInt(unidad_ptInput.value) || 65,
      itemSpacing: parseInt(itemSpacingInput.value) || 32,
      col_padding: 50,
      showTitulo: showTituloInput.checked,
      showUnidad: showUnidadInput.checked,
      disclaimer: disclaimerInput.value || ''
    };
    
    const textColor = textColorInput.value || '#FFFDD0';
    let currentY = cfg.margin;
    
    // Render title (category) centered at top
    if (cfg.showTitulo && hoja.categoria) {
      const tituloPx = Math.round(cfg.titulo_pt * 1.333);
      ctx.font = `900 ${tituloPx}px "Roboto Serif", Arial, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(hoja.categoria, canvas.width / 2, currentY);
      currentY += Math.round(tituloPx * 1.3) + 20;
      ctx.textAlign = 'left';
    } else {
      currentY += 40;
    }

    const usableW = canvas.width - cfg.margin * 2;
    const colW = (usableW - cfg.colGap) / 2;
    const leftX = cfg.margin + cfg.col_padding;
    const rightX = cfg.margin + colW + cfg.colGap + cfg.col_padding;
    const dividerX = cfg.margin + colW + cfg.colGap / 2;
    
    const dividerStartY = currentY;
    const disclaimerHeight = cfg.disclaimer ? 80 : 40;

    // Divider
    ctx.fillStyle = dividerColorInput.value || '#D4AF37';
    ctx.fillRect(dividerX - 8, dividerStartY, 16, canvas.height - dividerStartY - cfg.margin - disclaimerHeight);

    // Prep items
    const items = hoja.productos.filter(p => p.visible !== false).map(p => ({ ...p }));

    const targetSizes = {
      nombre: cfg.nombre_pt,
      precio: cfg.precio_pt,
      unidad: cfg.unidad_pt
    };
    const minSizes = {
      nombre: Math.max(1, Math.round(targetSizes.nombre * 0.55)),
      precio: Math.round(targetSizes.precio * 0.75),
      unidad: Math.round(targetSizes.unidad * 0.75)
    };

    function ptToPx(pt) { return pt * 1.333; }

    function wrapText(fontPx, text, maxWidth) {
      ctx.font = `bold ${Math.round(fontPx)}px "Roboto Serif", Arial, sans-serif`;
      const words = text.split(/\s+/);
      const lines = [];
      let cur = '';
      for (const w of words) {
        const test = cur ? cur + ' ' + w : w;
        if (ctx.measureText(test).width <= maxWidth || !cur) {
          cur = test;
        } else {
          lines.push(cur);
          cur = w;
        }
      }
      if (cur) lines.push(cur);
      return lines;
    }

    function estimateHeights(sizes) {
      const colWidthPx = colW - cfg.col_padding * 2;
      items.forEach(it => {
        const nombrePx = ptToPx(sizes.nombre);
        const nameLines = Math.max(1, wrapText(nombrePx, it.nombre, colWidthPx).length);
        const lineH = Math.round(nombrePx * 1.2);
        const priceH = Math.round(ptToPx(sizes.precio) * 1.2);
        it.estHeight = nameLines * lineH + 12 + priceH + cfg.itemSpacing;
      });
    }

    // Distribute
    const cols = [{ items: [], height: 0 }, { items: [], height: 0 }];
    let sizes = { ...targetSizes };
    const maxContentHeight = canvas.height - dividerStartY - cfg.margin - disclaimerHeight;

    function distribute() {
      cols[0].items = []; cols[0].height = 0;
      cols[1].items = []; cols[1].height = 0;
      items.sort((a, b) => b.estHeight - a.estHeight);
      for (const it of items) {
        cols.sort((a, b) => a.height - b.height);
        cols[0].items.push(it);
        cols[0].height += it.estHeight;
      }
    }

    estimateHeights(sizes);
    distribute();
    let fits = Math.max(cols[0].height, cols[1].height) <= maxContentHeight;
    let iter = 0;
    while (!fits && sizes.nombre > minSizes.nombre && iter < 15) {
      sizes.nombre = Math.max(minSizes.nombre, Math.round(sizes.nombre * 0.82));
      estimateHeights(sizes);
      distribute();
      fits = Math.max(cols[0].height, cols[1].height) <= maxContentHeight;
      iter++;
    }

    // Render columns
    [{x: leftX, idx: 0}, {x: rightX, idx: 1}].forEach(col => {
      let y = dividerStartY;
      const colData = cols[col.idx];

      for (const it of colData.items) {
        // Name
        const nombrePx = Math.round(ptToPx(sizes.nombre));
        const nameLines = wrapText(nombrePx, it.nombre, colW - cfg.col_padding * 2);
        ctx.font = `600 ${nombrePx}px "Roboto Serif", Arial, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        for (const line of nameLines) {
          ctx.fillText(line, col.x, y);
          y += Math.round(nombrePx * 1.2);
        }
        y += 12;

        // Price + Unit
        const pricePx = Math.round(ptToPx(sizes.precio));
        ctx.font = `900 ${pricePx}px "Roboto Serif", Arial, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'right';
        const priceStr = `$${Number(it.precio).toFixed(2)}`;
        const priceX = col.x + (colW - cfg.col_padding * 2);
        ctx.fillText(priceStr, priceX, y);
        
        // Unit (if visible)
        if (cfg.showUnidad && hoja.unidad) {
          const unidadPx = Math.round(ptToPx(sizes.unidad));
          ctx.font = `600 ${unidadPx}px "Roboto Serif", Arial, sans-serif`;
          ctx.fillStyle = textColor;
          const priceWidth = ctx.measureText(priceStr).width;
          ctx.font = `900 ${pricePx}px "Roboto Serif", Arial, sans-serif`;
          const priceWidthBold = ctx.measureText(priceStr).width;
          ctx.font = `600 ${unidadPx}px "Roboto Serif", Arial, sans-serif`;
          const unitStr = ` | ${hoja.unidad}`;
          ctx.fillText(unitStr, priceX - priceWidthBold - 10, y + (pricePx - unidadPx) * 0.5);
        }
        
        ctx.textAlign = 'left';
        y += Math.round(pricePx * 1.2) + cfg.itemSpacing;
      }
    });

    // Render logo if exists
    if (window.currentLogo && hoja.mostrar_logo) {
      const logoSize = 80;
      const logoPaddingRight = 30;
      const logoPaddingTop = 30;
      const logoX = canvas.width - logoSize - logoPaddingRight;
      const logoY = logoPaddingTop;

      const drawLogo = (img) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);
        ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
      };

      if (currentLogoImage && currentLogoImage.complete) {
        drawLogo(currentLogoImage);
      } else {
        const logoImg = new Image();
        logoImg.onload = function() {
          currentLogoImage = logoImg;
          drawLogo(logoImg);
        };
        logoImg.src = window.currentLogo;
      }
    }
    
    // Render disclaimer at bottom
    if (cfg.disclaimer && cfg.disclaimer.trim()) {
      const disclaimerFontSize = 28;
      const disclaimerY = canvas.height - cfg.margin - 40;
      ctx.font = `400 ${disclaimerFontSize}px "Roboto Serif", Arial, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      const lines = cfg.disclaimer.split('\n').filter(l => l.trim());
      lines.forEach((line, idx) => {
        ctx.fillText(line.trim(), canvas.width / 2, disclaimerY + idx * disclaimerFontSize * 1.2);
      });
      ctx.textAlign = 'left';
    }

    // Update info
    previewInfo.textContent = `${hoja.nombre} (${orientation === 'landscape' ? '1280×720' : '720×1280'}) - ${items.length} items`;
  }

  // Input change listeners for live update
  [titulo_ptInput, nombre_ptInput, precio_ptInput, unidad_ptInput, showTituloInput, showUnidadInput, disclaimerInput, bgColorInput, textColorInput, dividerColorInput, itemSpacingInput, marginInput].forEach(input => {
    input.addEventListener('change', () => {
      saveSheetStyle();
      renderSheet(currentIndex);
    });
    input.addEventListener('input', () => renderSheet(currentIndex));
  });

  // Rotation - FIXED
  function startRotation() {
    stopRotation();
    const seconds = Math.max(5, parseInt(rotIntervalInput.value) || 600);
    console.log('Rotation starting, interval:', seconds, 'seconds');
    
    rotTimer = setInterval(() => {
      if (!data || !data.hojas || data.hojas.length === 0) return;
      
      saveSheetStyle();
      currentIndex = (currentIndex + 1) % data.hojas.length;
      sheetSelect.value = currentIndex;
      updateSheetCounter();
      loadSheetStyle();
      renderSheet(currentIndex);
      console.log('Rotated to sheet:', currentIndex, '/', data.hojas.length);
    }, seconds * 1000);
  }

  function stopRotation() {
    if (rotTimer) {
      clearInterval(rotTimer);
      rotTimer = null;
      console.log('Rotation stopped');
    }
  }

  startRotBtn.addEventListener('click', startRotation);
  stopRotBtn.addEventListener('click', stopRotation);

  // Export
  function downloadURI(uri, name) {
    const a = document.createElement('a');
    a.href = uri;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  exportPNGBtn.addEventListener('click', async () => {
    if (!data) {
      alert('No hay datos cargados');
      return;
    }
    await ensureLogoReady();
    renderSheet(currentIndex);
    const uri = canvas.toDataURL('image/png');
    downloadURI(uri, `menu_${currentIndex + 1}_${data.hojas[currentIndex].nombre}.png`);
    console.log('PNG exported:', `menu_${currentIndex + 1}.png`);
  });

  exportAllPNGBtn.addEventListener('click', async () => {
    if (!data || !data.hojas) {
      alert('No hay datos cargados');
      return;
    }
    
    if (!window.JSZip) {
      alert('JSZip librería no está cargada');
      return;
    }
    
    try {
      console.log('Exporting ALL PNG sheets as ZIP...');
      saveSheetStyle();
      const zip = new JSZip();
      
      for (let i = 0; i < data.hojas.length; i++) {
        currentIndex = i;
        updateSheetCounter();
        loadSheetStyle();
        await ensureLogoReady();
        renderSheet(i);
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const uri = canvas.toDataURL('image/png');
        const base64 = uri.split(',')[1];
        const filename = `${String(i + 1).padStart(2, '0')}_${data.hojas[i].nombre}.png`;
        zip.file(filename, base64, { base64: true });
        console.log(`Added to ZIP: ${filename}`);
      }
      
      zip.generateAsync({ type: 'blob' })
        .then(blob => {
          downloadURI(URL.createObjectURL(blob), 'menus_export.zip');
          console.log('ZIP file downloaded: menus_export.zip');
          
          currentIndex = 0;
          updateSheetCounter();
          loadSheetStyle();
          renderSheet(0);
          alert(`✅ Se empaquetaron ${data.hojas.length} menús en menus_export.zip`);
        })
        .catch(e => {
          console.error('ZIP generation error:', e);
          alert('Error creando ZIP: ' + e.message);
        });
    } catch (e) {
      console.error('Export error:', e);
      alert('Error exportando PNG: ' + e.message);
    }
  });

  exportPDFBtn.addEventListener('click', async () => {
    if (!data) {
      alert('No hay datos cargados');
      return;
    }
    if (!window.jspdf) {
      console.error('jsPDF not loaded');
      alert('Librería PDF no está cargada');
      return;
    }
    try {
      await ensureLogoReady();
      renderSheet(currentIndex);
      const uri = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const dims = getCanvasDimensions();
      const pdf = new jsPDF({ 
        orientation: orientation === 'landscape' ? 'l' : 'p', 
        unit: 'mm', 
        format: [dims.width * 0.264583, dims.height * 0.264583] 
      });
      pdf.addImage(uri, 'PNG', 0, 0, dims.width * 0.264583, dims.height * 0.264583);
      pdf.save(`menu_${currentIndex + 1}_${data.hojas[currentIndex].nombre}.pdf`);
      console.log('PDF exported:', `menu_${currentIndex + 1}.pdf`);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Error exportando PDF: ' + e.message);
    }
  });

  exportAllPDFBtn.addEventListener('click', async () => {
    if (!data || !data.hojas) {
      alert('No hay datos cargados');
      return;
    }
    if (!window.jspdf) {
      console.error('Missing jsPDF');
      alert('Librería PDF no está cargada');
      return;
    }
    
    try {
      console.log('Exporting ALL sheets as SINGLE PDF document...');
      saveSheetStyle();
      const { jsPDF } = window.jspdf;
      const dims = getCanvasDimensions();
      
      // Create PDF with first sheet
      currentIndex = 0;
      updateSheetCounter();
      loadSheetStyle();
      await ensureLogoReady();
      renderSheet(0);
      
      let uri = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ 
        orientation: orientation === 'landscape' ? 'l' : 'p', 
        unit: 'mm', 
        format: [dims.width * 0.264583, dims.height * 0.264583] 
      });
      pdf.addImage(uri, 'PNG', 0, 0, dims.width * 0.264583, dims.height * 0.264583);
      console.log(`Added to PDF: Sheet 1 (${data.hojas[0].nombre})`);
      
      // Add remaining sheets
      for (let i = 1; i < data.hojas.length; i++) {
        currentIndex = i;
        updateSheetCounter();
        loadSheetStyle();
        await ensureLogoReady();
        renderSheet(i);
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        uri = canvas.toDataURL('image/png');
        pdf.addPage([dims.width * 0.264583, dims.height * 0.264583]);
        pdf.addImage(uri, 'PNG', 0, 0, dims.width * 0.264583, dims.height * 0.264583);
        console.log(`Added to PDF: Sheet ${i + 1} (${data.hojas[i].nombre})`);
      }
      
      // Save single PDF file
      pdf.save('menus_export.pdf');
      
      // Return to original sheet
      currentIndex = 0;
      updateSheetCounter();
      loadSheetStyle();
      renderSheet(0);
      alert(`✅ Se creó PDF con ${data.hojas.length} menús en menus_export.pdf`);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Error exportando PDF: ' + e.message);
    }
  });

  // Config save/load
  saveConfigBtn.addEventListener('click', () => {
    if (!data) {
      alert('No hay datos cargados');
      return;
    }
    
    saveSheetStyle();
    
    const config = {
      version: '0.0.2',
      timestamp: new Date().toISOString(),
      dataSource: 'saved_config',
      sheetStyles: sheetStyles
    };
    
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const uri = URL.createObjectURL(blob);
    downloadURI(uri, 'menu_config.json');
    console.log('Config saved');
  });

  loadConfigBtn.addEventListener('click', () => {
    configFile.click();
  });

  configFile.addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const txt = await f.text();
      const config = JSON.parse(txt);
      if (config.sheetStyles) {
        sheetStyles = config.sheetStyles;
        loadSheetStyle();
        renderSheet(currentIndex);
        console.log('Config loaded successfully');
        alert('✅ Configuración cargada correctamente');
      }
    } catch (e) {
      console.error('Config load error:', e);
      alert('Error cargando configuración: ' + e.message);
    }
  });

  // Init
  console.log('Initializing with landscape orientation');
  updateCanvasDimensions();
  loadSample();

})();
