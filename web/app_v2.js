// Demo renderer v0.0.2: Improved layout with better spacing and typography
(function(){
  const canvas = document.getElementById('menuCanvas');
  const ctx = canvas.getContext('2d');
  const fileInput = document.getElementById('fileInput');
  const fontCssInput = document.getElementById('fontCss');
  const fontFileInput = document.getElementById('fontFile');
  const rotInput = document.getElementById('rotInterval');
  const startBtn = document.getElementById('startRotation');
  const stopBtn = document.getElementById('stopRotation');
  const exportPNG = document.getElementById('exportPNG');
  const exportPDF = document.getElementById('exportPDF');
  const metaFont = document.getElementById('metaFont');
  const metaPage = document.getElementById('metaPage');
  const metaTotal = document.getElementById('metaTotal');

  let data = null;
  let currentIndex = 0;
  let rotTimer = null;
  let fontsLoaded = false;

  async function loadSample(){
    try{
      const res = await fetch('../sample_data_long.json');
      data = await res.json();
      metaTotal.textContent = data.hojas.length;
      renderSheet(0);
    }catch(e){
      console.error('No se pudo cargar sample_data.json',e);
    }
  }

  async function loadFont(url){
    if(!url) return;
    try{
      if(url.includes('fonts.googleapis.com')){
        const linkId = 'gf-stylesheet';
        if(!document.getElementById(linkId)){
          const l = document.createElement('link');
          l.id = linkId;
          l.rel = 'stylesheet';
          l.href = url;
          document.head.appendChild(l);
        }
        await document.fonts.ready;
        fontsLoaded = true;
        metaFont.textContent = url.split('/').pop();
        renderSheet(currentIndex);
        return;
      }
      const font = new FontFace('UserFont', `url(${url})`);
      await font.load();
      document.fonts.add(font);
      fontsLoaded = true;
      metaFont.textContent = url.split('/').pop();
      renderSheet(currentIndex);
    }catch(e){
      console.warn('No se pudo cargar la fuente:',e);
    }
  }

  function clear(){ ctx.clearRect(0,0,canvas.width,canvas.height); }

  function renderSheet(index){
    if(!data) return;
    currentIndex = index % data.hojas.length;
    const hoja = data.hojas[currentIndex];
    metaPage.textContent = (currentIndex+1);
    
    clear();
    
    // Background
    ctx.fillStyle = hoja.fondo || '#7B0000';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.textBaseline = 'top';

    // Config
    const cfg = {
      margin: 50, 
      colGap: 18, 
      categoria_pt: 120, 
      nombre_pt: 75, 
      precio_pt: 100, 
      itemSpacing: 32,
      col_padding: 50
    };
    
    const usableW = canvas.width - cfg.margin * 2;
    const colW = (usableW - cfg.colGap) / 2;
    const leftX = cfg.margin + cfg.col_padding;
    const rightX = cfg.margin + colW + cfg.colGap + cfg.col_padding;
    const dividerX = cfg.margin + colW + cfg.colGap / 2;

    // Central divider (gold)
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(dividerX - 8, cfg.margin + 20, 16, canvas.height - cfg.margin * 2 - 40);

    const items = hoja.productos.map(p => ({ ...p }));

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

    function wrapTextForFont(fontPx, text, maxWidth) {
      ctx.font = `bold ${Math.round(fontPx)}px ${fontsLoaded ? 'Roboto Serif' : 'Arial'}`;
      const words = text.split(/\s+/);
      const lines = [];
      let cur = '';
      for (const w of words) {
        const test = cur ? cur + ' ' + w : w;
        const wMetrics = ctx.measureText(test).width;
        if (wMetrics <= maxWidth || !cur) {
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
        const nameLines = Math.max(1, wrapTextForFont(nombrePx, it.nombre, colWidthPx).length);
        const lineH = Math.round(nombrePx * 1.2);
        const priceH = Math.round(ptToPx(sizes.precio) * 1.2);
        it.estHeight = catH + 8 + nameLines * lineH + 12 + priceH + cfg.itemSpacing;
      });
    }

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

    // Render both columns
    [{x: leftX, idx: 0}, {x: rightX, idx: 1}].forEach(col => {
      let y = cfg.margin + 40;
      const colData = cols[col.idx];
      
      for (const it of colData.items) {
        // Category (BOLD, LARGE)
        const catPx = Math.round(ptToPx(sizes.categoria));
        ctx.font = `900 ${catPx}px ${fontsLoaded ? 'Roboto Serif' : 'Arial'}`;
        ctx.fillStyle = hoja.texto || '#FFFDD0';
        ctx.textAlign = 'left';
        ctx.fillText(it.categoria, col.x, y);
        y += catPx + 8;

        // Product name (MEDIUM, wraps)
        const nombrePx = Math.round(ptToPx(sizes.nombre));
        const nameLines = wrapTextForFont(nombrePx, it.nombre, colW - cfg.col_padding * 2);
        ctx.font = `600 ${nombrePx}px ${fontsLoaded ? 'Roboto Serif' : 'Arial'}`;
        ctx.fillStyle = hoja.texto || '#FFFDD0';
        ctx.textAlign = 'left';
        for (const line of nameLines) {
          ctx.fillText(line, col.x, y);
          y += Math.round(nombrePx * 1.2);
        }
        y += 12;

        // Price (RIGHT ALIGNED, EXTRA BOLD)
        const pricePx = Math.round(ptToPx(sizes.precio));
        ctx.font = `900 ${pricePx}px ${fontsLoaded ? 'Roboto Serif' : 'Arial'}`;
        ctx.fillStyle = hoja.texto || '#FFFDD0';
        ctx.textAlign = 'right';
        const priceStr = `$${Number(it.precio).toFixed(2)}`;
        ctx.fillText(priceStr, col.x + (colW - cfg.col_padding * 2), y);
        ctx.textAlign = 'left';
        y += Math.round(pricePx * 1.2) + cfg.itemSpacing;
      }
    });
  }

  function startRotation(){
    stopRotation();
    const seconds = Math.max(5, Number(rotInput.value) || 600);
    rotTimer = setInterval(()=>{
      currentIndex = (currentIndex+1) % (data?.hojas?.length || 1);
      renderSheet(currentIndex);
    }, seconds*1000);
  }

  function stopRotation(){ if(rotTimer){ clearInterval(rotTimer); rotTimer = null; } }

  function downloadURI(uri, name){
    const a = document.createElement('a'); a.href = uri; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }

  exportPNG.addEventListener('click', ()=>{
    const uri = canvas.toDataURL('image/png');
    downloadURI(uri, `menu_${currentIndex+1}.png`);
  });

  exportPDF.addEventListener('click', async ()=>{
    const uri = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({orientation:'landscape', unit:'px', format:[canvas.width, canvas.height]});
    pdf.addImage(uri, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`menu_${currentIndex+1}.pdf`);
  });

  fileInput.addEventListener('change', async (e)=>{
    const f = e.target.files[0];
    if(!f) return;
    try{
      const txt = await f.text();
      const json = JSON.parse(txt);
      data = json;
      metaTotal.textContent = data.hojas.length;
      currentIndex = 0;
      renderSheet(0);
    }catch(err){ alert('JSON inválido') }
  });

  fontCssInput.addEventListener('change', ()=>{ loadFont(fontCssInput.value); });
  fontFileInput.addEventListener('change', async (e)=>{
    const f = e.target.files[0];
    if(f) await loadFontFromFile(f);
  });
  startBtn.addEventListener('click', startRotation);
  stopBtn.addEventListener('click', stopRotation);

  async function loadFontFromFile(file){
    if(!file) return;
    try{
      const data = await file.arrayBuffer();
      const font = new FontFace('UserFont', data, {});
      await font.load();
      document.fonts.add(font);
      fontsLoaded = true;
      metaFont.textContent = file.name;
      renderSheet(currentIndex);
    }catch(e){
      console.warn('No se pudo cargar el archivo de fuente (.ttf, .woff, .woff2):',e);
    }
  }

  // init
  loadFont(fontCssInput.value).then(() => loadSample());
  window._menuRender = {renderSheet};

})();
