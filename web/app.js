// Demo renderer: carga sample_data.json, render en canvas, rotación y export
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
      const res = await fetch('../sample_data.json');
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
      // If Google Fonts CSS URL provided, inject link and wait for fonts to load via document.fonts
      if(url.includes('fonts.googleapis.com')){
        const linkId = 'gf-stylesheet';
        if(!document.getElementById(linkId)){
          const l = document.createElement('link');
          l.id = linkId;
          l.rel = 'stylesheet';
          l.href = url;
          document.head.appendChild(l);
        }
        // Wait for fonts to be available
        await document.fonts.ready;
        fontsLoaded = true;
        metaFont.textContent = url.split('/').pop();
        return;
      }

      // Otherwise try loading a direct font file (woff/woff2/ttf)
      const font = new FontFace('UserFont', `url(${url})`);
      await font.load();
      document.fonts.add(font);
      fontsLoaded = true;
      metaFont.textContent = url.split('/').pop();
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
    // background
    ctx.fillStyle = hoja.fondo || '#7B0000';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // settings
    const cfg = {margin:40, headerFooter:120, colGap:10, categoria_pt:120, nombre_pt:85, precio_pt:100, itemSpacing:18};
    ctx.textBaseline = 'top';

    // draw central divider
    const usableW = canvas.width - cfg.margin*2;
    const numCols = 2;
    const colW = (usableW - cfg.colGap)/numCols;
    const leftX = cfg.margin;
    const rightX = cfg.margin + colW + cfg.colGap;
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(cfg.margin + colW + cfg.colGap/2 - 5, cfg.margin, 10, canvas.height - cfg.margin*2);

    // group products into items
    const items = hoja.productos.map(p=>({ ...p }));

    // sizes in pt
    const targetSizes = {categoria:cfg.categoria_pt, nombre:cfg.nombre_pt, precio:cfg.precio_pt};
    const minSizes = {categoria: Math.round(targetSizes.categoria*0.7), nombre: Math.round(targetSizes.nombre*0.6), precio: Math.round(targetSizes.precio*0.7)};

    function ptToPx(pt){ return pt * 1.333; }

    function wrapTextForFont(fontPx, text, maxWidth){
      ctx.font = `${Math.round(fontPx)}px ${fontsLoaded? 'UserFont' : 'Arial'}`;
      const words = text.split(/\s+/);
      const lines = [];
      let cur = '';
      for(const w of words){
        const test = cur ? cur + ' ' + w : w;
        const wMetrics = ctx.measureText(test).width;
        if(wMetrics <= maxWidth || !cur){
          cur = test;
        } else {
          lines.push(cur);
          cur = w;
        }
      }
      if(cur) lines.push(cur);
      return lines;
    }

    function estimateHeights(sizes){
      const colWidthPx = colW;
      items.forEach(it => {
        const catH = Math.round(ptToPx(sizes.categoria) * 1.12);
        const nombrePx = ptToPx(sizes.nombre);
        const nameLines = wrapTextForFont(nombrePx, it.nombre, colWidthPx).length;
        const lineH = Math.round(nombrePx * 1.12);
        const priceH = Math.round(ptToPx(sizes.precio) * 1.12);
        it.estHeight = catH + nameLines*lineH + priceH + cfg.itemSpacing;
        it._nameLines = nameLines;
      });
    }

    // distribute with adaptive sizing: reduce nombre size if total height overflows
    const cols = [{items:[],height:0},{items:[],height:0}];
    let sizes = {...targetSizes};
    const maxContentHeight = canvas.height - cfg.margin*2 - cfg.headerFooter/2;

    function distribute(){
      cols[0].items = []; cols[0].height = 0; cols[1].items = []; cols[1].height = 0;
      items.sort((a,b)=>b.estHeight - a.estHeight);
      for(const it of items){
        cols.sort((a,b)=>a.height-b.height);
        cols[0].items.push(it);
        cols[0].height += it.estHeight;
      }
    }

    // iterative adjustment
    estimateHeights(sizes);
    distribute();
    let fits = Math.max(cols[0].height, cols[1].height) <= maxContentHeight;
    while(!fits && sizes.nombre > minSizes.nombre){
      sizes.nombre = Math.max(minSizes.nombre, Math.round(sizes.nombre * 0.9));
      estimateHeights(sizes);
      distribute();
      fits = Math.max(cols[0].height, cols[1].height) <= maxContentHeight;
    }

    // final distribution already in cols

    // render columns
    [leftX, rightX].forEach((x,ci)=>{
      let y = cfg.margin;
      const col = cols[ci];
      for(const it of col.items){
        // category
        const catPx = Math.round(ptToPx(sizes.categoria));
        ctx.font = `${catPx}px ${fontsLoaded? 'UserFont' : 'Arial'}`;
        ctx.fillStyle = hoja.texto || '#FFFDD0';
        ctx.fillText(it.categoria, x, y);
        y += Math.round(catPx * 1.12);

        // name (wrap by words)
        const nombrePx = Math.round(ptToPx(sizes.nombre));
        const nameLines = wrapTextForFont(nombrePx, it.nombre, colW);
        ctx.font = `${nombrePx}px ${fontsLoaded? 'UserFont' : 'Arial'}`;
        ctx.fillStyle = hoja.texto || '#FFFDD0';
        for(const line of nameLines){
          ctx.fillText(line, x, y);
          y += Math.round(nombrePx * 1.12);
        }

        // price right aligned
        const pricePx = Math.round(ptToPx(sizes.precio));
        ctx.font = `${pricePx}px ${fontsLoaded? 'UserFont' : 'Arial'}`;
        ctx.fillStyle = hoja.texto || '#FFFDD0';
        const priceStr = `$${Number(it.precio).toFixed(2)}`;
        ctx.textAlign = 'right';
        ctx.fillText(priceStr, x + colW - 10, y - Math.round(pricePx * 1.12));
        ctx.textAlign = 'left';
        y += Math.round(pricePx * 1.12) + cfg.itemSpacing;
      }
    });

  }

  // helper functions moved above

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
  loadSample();
  // expose for debug
  window._menuRender = {renderSheet};

})();
