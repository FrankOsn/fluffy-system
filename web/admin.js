// Admin Panel - Menu Generator v0.1
(function(){
  const canvas = document.getElementById('menuCanvas');
  const ctx = canvas.getContext('2d');
  
  // Controls
  const orientationRadios = document.querySelectorAll('input[name="orientation"]');
  const fileInput = document.getElementById('fileInput');
  const btnLoadSample = document.getElementById('btnLoadSample');
  const sheetSelect = document.getElementById('sheetSelect');
  const fontCssInput = document.getElementById('fontCss');
  const fontFileInput = document.getElementById('fontFile');
  const categoria_ptInput = document.getElementById('categoria_pt');
  const nombre_ptInput = document.getElementById('nombre_pt');
  const precio_ptInput = document.getElementById('precio_pt');
  const bgColorInput = document.getElementById('bgcolor');
  const textColorInput = document.getElementById('textcolor');
  const dividerColorInput = document.getElementById('dividercolor');
  const itemSpacingInput = document.getElementById('itemSpacing');
  const marginInput = document.getElementById('margin');
  const rotIntervalInput = document.getElementById('rotInterval');
  const startRotBtn = document.getElementById('startRotation');
  const stopRotBtn = document.getElementById('stopRotation');
  const exportPNGBtn = document.getElementById('exportPNG');
  const exportPDFBtn = document.getElementById('exportPDF');
  const previewInfo = document.getElementById('previewInfo');

  let data = null;
  let currentIndex = 0;
  let rotTimer = null;
  let fontsLoaded = false;
  let orientation = 'landscape'; // 16:9

  console.log('Admin panel initialized');

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

  // Load sample data
  async function loadSample() {
    try {
      const res = await fetch('../sample_data_complete.json');
      data = await res.json();
      console.log('Sample data loaded:', data);
      populateSheetSelect();
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
    data.hojas.forEach((hoja, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = hoja.nombre || `Hoja ${i + 1}`;
      sheetSelect.appendChild(opt);
    });
    sheetSelect.value = 0;
    console.log('Sheet selector populated with', data.hojas.length, 'sheets');
  }

  sheetSelect.addEventListener('change', (e) => {
    currentIndex = parseInt(e.target.value);
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
      populateSheetSelect();
      currentIndex = 0;
      renderSheet(0);
      console.log('Custom JSON file loaded');
    } catch (e) {
      alert('JSON inválido: ' + e.message);
    }
  });

  // Render function
  function renderSheet(index) {
    if (!data || !data.hojas) {
      previewInfo.textContent = 'No data loaded';
      return;
    }

    currentIndex = index % data.hojas.length;
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
      categoria_pt: parseInt(categoria_ptInput.value) || 120,
      nombre_pt: parseInt(nombre_ptInput.value) || 85,
      precio_pt: parseInt(precio_ptInput.value) || 100,
      itemSpacing: parseInt(itemSpacingInput.value) || 32,
      col_padding: 50
    };

    const usableW = canvas.width - cfg.margin * 2;
    const colW = (usableW - cfg.colGap) / 2;
    const leftX = cfg.margin + cfg.col_padding;
    const rightX = cfg.margin + colW + cfg.colGap + cfg.col_padding;
    const dividerX = cfg.margin + colW + cfg.colGap / 2;

    // Divider
    ctx.fillStyle = dividerColorInput.value || '#D4AF37';
    ctx.fillRect(dividerX - 8, cfg.margin + 20, 16, canvas.height - cfg.margin * 2 - 40);

    // Prep items
    const items = hoja.productos.filter(p => p.visible !== false).map(p => ({ ...p }));

    const targetSizes = {
      categoria: cfg.categoria_pt,
      nombre: cfg.nombre_pt,
      precio: cfg.precio_pt
    };
    const minSizes = {
      categoria: Math.round(targetSizes.categoria * 0.7),
      nombre: Math.round(targetSizes.nombre * 0.55),
      precio: Math.round(targetSizes.precio * 0.75)
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
        const catH = Math.round(ptToPx(sizes.categoria) * 1.2);
        const nombrePx = ptToPx(sizes.nombre);
        const nameLines = Math.max(1, wrapText(nombrePx, it.nombre, colWidthPx).length);
        const lineH = Math.round(nombrePx * 1.2);
        const priceH = Math.round(ptToPx(sizes.precio) * 1.2);
        it.estHeight = catH + 8 + nameLines * lineH + 12 + priceH + cfg.itemSpacing;
      });
    }

    // Distribute
    const cols = [{ items: [], height: 0 }, { items: [], height: 0 }];
    let sizes = { ...targetSizes };
    const maxContentHeight = canvas.height - cfg.margin * 2 - 80;

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
    const textColor = textColorInput.value || '#FFFDD0';
    [{x: leftX, idx: 0}, {x: rightX, idx: 1}].forEach(col => {
      let y = cfg.margin + 40;
      const colData = cols[col.idx];

      for (const it of colData.items) {
        // Category
        const catPx = Math.round(ptToPx(sizes.categoria));
        ctx.font = `900 ${catPx}px "Roboto Serif", Arial, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.fillText(it.categoria, col.x, y);
        y += catPx + 8;

        // Name
        const nombrePx = Math.round(ptToPx(sizes.nombre));
        const nameLines = wrapText(nombrePx, it.nombre, colW - cfg.col_padding * 2);
        ctx.font = `600 ${nombrePx}px "Roboto Serif", Arial, sans-serif`;
        ctx.fillStyle = textColor;
        for (const line of nameLines) {
          ctx.fillText(line, col.x, y);
          y += Math.round(nombrePx * 1.2);
        }
        y += 12;

        // Price
        const pricePx = Math.round(ptToPx(sizes.precio));
        ctx.font = `900 ${pricePx}px "Roboto Serif", Arial, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'right';
        const priceStr = `$${Number(it.precio).toFixed(2)}`;
        ctx.fillText(priceStr, col.x + (colW - cfg.col_padding * 2), y);
        ctx.textAlign = 'left';
        y += Math.round(pricePx * 1.2) + cfg.itemSpacing;
      }
    });

    // Update info
    previewInfo.textContent = `${hoja.nombre} (${orientation === 'landscape' ? '1280×720' : '720×1280'}) - ${items.length} items`;
  }

  // Input change listeners for live update
  [categoria_ptInput, nombre_ptInput, precio_ptInput, bgColorInput, textColorInput, dividerColorInput, itemSpacingInput, marginInput].forEach(input => {
    input.addEventListener('change', () => renderSheet(currentIndex));
    input.addEventListener('input', () => renderSheet(currentIndex));
  });

  // Rotation
  function startRotation() {
    stopRotation();
    const seconds = Math.max(5, parseInt(rotIntervalInput.value) || 600);
    rotTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % (data?.hojas?.length || 1);
      sheetSelect.value = currentIndex;
      renderSheet(currentIndex);
    }, seconds * 1000);
    console.log('Rotation started:', seconds, 'seconds');
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
    a.remove();
  }

  exportPNGBtn.addEventListener('click', () => {
    const uri = canvas.toDataURL('image/png');
    downloadURI(uri, `menu_${currentIndex + 1}.png`);
    console.log('PNG exported');
  });

  exportPDFBtn.addEventListener('click', async () => {
    try {
      const uri = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const dims = getCanvasDimensions();
      const pdf = new jsPDF({ orientation: orientation === 'landscape' ? 'l' : 'p', unit: 'px', format: [dims.width, dims.height] });
      pdf.addImage(uri, 'PNG', 0, 0, dims.width, dims.height);
      pdf.save(`menu_${currentIndex + 1}.pdf`);
      console.log('PDF exported');
    } catch (e) {
      console.error('PDF export error:', e);
      alert('Error exporting PDF: ' + e.message);
    }
  });

  // Init
  console.log('Initializing with landscape orientation');
  updateCanvasDimensions();
  loadSample();

})();
