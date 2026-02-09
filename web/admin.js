// Admin Panel - Menu Generator v0.3.1
// Improved with: Color picker + HEX display, ZIP exports, Multi-page PDF
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
  const categoria_ptInput = document.getElementById('categoria_pt');
  const nombre_ptInput = document.getElementById('nombre_pt');
  const precio_ptInput = document.getElementById('precio_pt');
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
  let rotTimer = null;
  let fontsLoaded = false;
  let orientation = 'landscape'; // 16:9
  
  // Store per-sheet styles
  let sheetStyles = {};

  console.log('Admin panel v0.3.1 initialized');

  // Canvas dimensions based on orientation
  function getCanvasDimensions() {
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

  // ============ COLOR PICKER SYNC ============
  // Sync color picker ↔ HEX text input
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

  // Load sample data
  async function loadSample() {
    try {
      const res = await fetch('../sample_data_complete.json');
      data = await res.json();
      console.log('Sample data loaded:', data);
      sheetStyles = {};
      populateSheetSelect();
      initColorSync();
      loadFont(fontCssInput.value).then(() => renderSheet(0));
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

  // File input
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      data = JSON.parse(text);
      console.log('Custom data loaded from file:', data);
      sheetStyles = {};
      populateSheetSelect();
      initColorSync();
      loadFont(fontCssInput.value).then(() => renderSheet(0));
    } catch (err) {
      console.error('Error parsing JSON:', err);
      alert('Error al cargar el archivo: ' + err.message);
    }
  });

  // ============ SHEET COUNTER ============
  function updateSheetCounter() {
    if (!data || !data.hojas) {
      sheetCount.textContent = '0/0';
      return;
    }
    const current = currentIndex + 1;
    const total = data.hojas.length;
    sheetCount.textContent = `${current}/${total}`;
  }

  // ============ STYLE PERSISTENCE ============
  function saveSheetStyle() {
    if (!data || !data.hojas || currentIndex >= data.hojas.length) return;
    
    const sheetId = data.hojas[currentIndex].id || `sheet_${currentIndex}`;
    sheetStyles[sheetId] = {
      categoria_pt: categoria_ptInput.value,
      nombre_pt: nombre_ptInput.value,
      precio_pt: precio_ptInput.value,
      bgcolor: bgColorInput.value,
      textcolor: textColorInput.value,
      dividercolor: dividerColorInput.value,
      itemSpacing: itemSpacingInput.value,
      margin: marginInput.value
    };
    console.log('Saved style for sheet:', sheetId);
  }

  function loadSheetStyle() {
    if (!data || !data.hojas || currentIndex >= data.hojas.length) return;
    
    const sheetId = data.hojas[currentIndex].id || `sheet_${currentIndex}`;
    const style = sheetStyles[sheetId];
    
    if (style) {
      categoria_ptInput.value = style.categoria_pt;
      nombre_ptInput.value = style.nombre_pt;
      precio_ptInput.value = style.precio_pt;
      bgColorInput.value = style.bgcolor;
      bgColorPicker.value = style.bgcolor;
      textColorInput.value = style.textcolor;
      textColorPicker.value = style.textcolor;
      dividerColorInput.value = style.dividercolor;
      dividerColorPicker.value = style.dividercolor;
      itemSpacingInput.value = style.itemSpacing;
      marginInput.value = style.margin;
      console.log('Loaded style for sheet:', sheetId);
    } else {
      console.log('No style saved for sheet:', sheetId, '- using defaults');
    }
  }

  // Sheet selector change
  sheetSelect.addEventListener('change', (e) => {
    saveSheetStyle();
    currentIndex = parseInt(e.target.value);
    updateSheetCounter();
    loadSheetStyle();
    renderSheet(currentIndex);
  });

  // Font loading
  async function loadFont(url) {
    if (!url || url.trim() === '') {
      console.log('No font URL provided');
      return;
    }
    try {
      const link = document.createElement('link');
      link.href = url;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      fontsLoaded = true;
      console.log('Font loaded from URL:', url);
    } catch (e) {
      console.error('Font loading error:', e);
    }
  }

  fontCssInput.addEventListener('change', (e) => {
    loadFont(e.target.value).then(() => renderSheet(currentIndex));
  });

  // Font file upload
  fontFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const buffer = await file.arrayBuffer();
      const blob = new Blob([buffer], { type: file.type });
      const url = URL.createObjectURL(blob);
      const fontFace = new FontFace('CustomFont', `url(${url})`);
      document.fonts.add(fontFace);
      fontsLoaded = true;
      console.log('Font file loaded:', file.name);
      renderSheet(currentIndex);
    } catch (e) {
      console.error('Font file error:', e);
      alert('Error cargando fuente: ' + e.message);
    }
  });

  // Input changes - save & render
  [categoria_ptInput, nombre_ptInput, precio_ptInput, itemSpacingInput, marginInput].forEach(input => {
    input.addEventListener('change', () => {
      saveSheetStyle();
      renderSheet(currentIndex);
    });
    input.addEventListener('input', () => {
      saveSheetStyle();
      renderSheet(currentIndex);
    });
  });

  // ============ RENDERING ============
  function renderSheet(index) {
    if (!data || !data.hojas || index >= data.hojas.length) return;
    
    const dims = getCanvasDimensions();
    const hoja = data.hojas[index];
    
    // Clear canvas
    ctx.fillStyle = bgColorInput.value;
    ctx.fillRect(0, 0, dims.width, dims.height);
    
    const margin = parseInt(marginInput.value) || 50;
    const itemSpacing = parseInt(itemSpacingInput.value) || 32;
    const categoria_pt = parseInt(categoria_ptInput.value) || 120;
    const nombre_pt = parseInt(nombre_ptInput.value) || 85;
    const precio_pt = parseInt(precio_ptInput.value) || 100;
    const textColor = textColorInput.value;
    const dividerColor = dividerColorInput.value;
    
    const maxWidth = dims.width - 2 * margin;
    let y = margin;
    
    // Draw categoria
    if (hoja.categoria) {
      ctx.font = `bold ${categoria_pt}px "Roboto Serif", serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(hoja.categoria, dims.width / 2, y + categoria_pt);
      y += categoria_pt + itemSpacing;
    }
    
    // Draw items
    if (hoja.items && Array.isArray(hoja.items)) {
      ctx.font = `${nombre_pt}px "Roboto", sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      
      hoja.items.forEach(item => {
        // Item nombre
        ctx.fillText(item.nombre || '', margin, y);
        y += nombre_pt;
        
        // Item precio
        ctx.font = `${precio_pt}px "Roboto", monospace`;
        ctx.textAlign = 'right';
        ctx.fillText(item.precio ? '$' + item.precio : '', dims.width - margin, y);
        ctx.textAlign = 'left';
        ctx.font = `${nombre_pt}px "Roboto", sans-serif`;
        y += precio_pt + itemSpacing / 2;
      });
      
      // Divider line
      ctx.strokeStyle = dividerColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(margin, y - itemSpacing / 4);
      ctx.lineTo(dims.width - margin, y - itemSpacing / 4);
      ctx.stroke();
    }
    
    previewInfo.textContent = `${hoja.nombre || 'Hoja ' + (index + 1)} - ${dims.width}×${dims.height}px`;
  }

  // ============ EXPORT - SINGLE PNG ============
  function downloadURI(dataURI, filename) {
    const link = document.createElement('a');
    link.href = dataURI;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportPNGBtn.addEventListener('click', () => {
    if (!data || !data.hojas || currentIndex >= data.hojas.length) {
      alert('No hay datos cargados');
      return;
    }
    const uri = canvas.toDataURL('image/png');
    const filename = `${String(currentIndex + 1).padStart(2, '0')}_${data.hojas[currentIndex].nombre}.png`;
    downloadURI(uri, filename);
    console.log(`PNG exported: ${filename}`);
  });

  // ============ EXPORT - ALL PNG AS ZIP ============
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
        renderSheet(i);
        
        // Pequeño delay entre renders
        await new Promise(resolve => setTimeout(resolve, 150));
        
        const uri = canvas.toDataURL('image/png');
        const base64 = uri.split(',')[1];
        const filename = `${String(i + 1).padStart(2, '0')}_${data.hojas[i].nombre}.png`;
        zip.file(filename, base64, { base64: true });
        console.log(`Added to ZIP: ${filename}`);
      }
      
      // Generate ZIP
      zip.generateAsync({ type: 'blob' })
        .then(blob => {
          downloadURI(URL.createObjectURL(blob), 'menus_export.zip');
          console.log('ZIP file downloaded: menus_export.zip');
          
          // Return to original sheet
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

  // ============ EXPORT - SINGLE PDF ============
  exportPDFBtn.addEventListener('click', () => {
    if (!data || !data.hojas || currentIndex >= data.hojas.length) {
      alert('No hay datos cargados');
      return;
    }
    if (!window.jspdf) {
      alert('jsPDF librería no está cargada');
      return;
    }
    
    try {
      const uri = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const dims = getCanvasDimensions();
      const pdf = new jsPDF({ 
        orientation: orientation === 'landscape' ? 'l' : 'p', 
        unit: 'mm', 
        format: [dims.width * 0.264583, dims.height * 0.264583] 
      });
      pdf.addImage(uri, 'PNG', 0, 0, dims.width * 0.264583, dims.height * 0.264583);
      const filename = `${String(currentIndex + 1).padStart(2, '0')}_${data.hojas[currentIndex].nombre}.pdf`;
      pdf.save(filename);
      console.log(`PDF exported: ${filename}`);
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Error exportando PDF: ' + e.message);
    }
  });

  // ============ EXPORT - ALL PDF AS SINGLE DOCUMENT ============
  exportAllPDFBtn.addEventListener('click', async () => {
    if (!data || !data.hojas) {
      alert('No hay datos cargados');
      return;
    }
    if (!window.jspdf) {
      alert('jsPDF librería no está cargada');
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
        renderSheet(i);
        
        // Pequeño delay entre renders
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

  // ============ ROTATION ============
  startRotBtn.addEventListener('click', () => {
    if (!data || !data.hojas || data.hojas.length === 0) {
      alert('No hay datos cargados');
      return;
    }
    
    if (rotTimer) {
      console.log('Rotation already running');
      return;
    }
    
    const seconds = parseInt(rotIntervalInput.value) || 600;
    console.log('Starting rotation with interval:', seconds, 'seconds');
    
    rotTimer = setInterval(() => {
      if (!data || !data.hojas || data.hojas.length === 0) return;
      saveSheetStyle();
      currentIndex = (currentIndex + 1) % data.hojas.length;
      sheetSelect.value = currentIndex;
      updateSheetCounter();
      loadSheetStyle();
      renderSheet(currentIndex);
    }, seconds * 1000);
  });

  stopRotBtn.addEventListener('click', () => {
    if (rotTimer) {
      clearInterval(rotTimer);
      rotTimer = null;
      console.log('Rotation stopped');
    }
  });

  // ============ CONFIG SAVE/LOAD ============
  saveConfigBtn.addEventListener('click', () => {
    if (!data) {
      alert('No hay datos cargados');
      return;
    }
    
    saveSheetStyle();
    
    const config = {
      version: '0.3.1',
      timestamp: new Date().toISOString(),
      sheetStyles: sheetStyles
    };
    
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const uri = URL.createObjectURL(blob);
    downloadURI(uri, 'menu_config.json');
    console.log('Config saved:', config);
  });

  loadConfigBtn.addEventListener('click', () => {
    configFile.click();
  });

  configFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const config = JSON.parse(text);
      sheetStyles = config.sheetStyles || {};
      console.log('Config loaded:', config);
      
      if (data && currentIndex < data.hojas.length) {
        loadSheetStyle();
        renderSheet(currentIndex);
      }
      
      alert(`✅ Configuración restaurada (v${config.version})`);
    } catch (e) {
      console.error('Config load error:', e);
      alert('Error cargando configuración: ' + e.message);
    }
  });

  // Initialize canvas
  updateCanvasDimensions();
})();
