class HalftoneWorldMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.landPolygons = [];
    
    this.resizeCanvas();
    this.setupEventListeners();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.canvas.style.width = window.innerWidth + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      if (this.landPolygons.length > 0) this.drawHalftoneWorld();
    });
  }

  drawDot(ctx, x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = '#2fc2b0';
    ctx.fill();
  }

  drawShadow(ctx, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.max(width, height) / 2;
    
    // Create a radial gradient from the center
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,           // Inner circle center (x, y) and radius
      centerX, centerY, radius       // Outer circle center (x, y) and radius
    );
    
    gradient.addColorStop(0, '#102324');    // Center color
    gradient.addColorStop(0.7, '#0e0f13');  // Outer color
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add dithering to reduce banding
    const noiseAmount = width * height * 1.5;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let i = 0; i < noiseAmount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  pointInPolygon(point, vs) {
    let x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      let xi = vs[i][0], yi = vs[i][1];
      let xj = vs[j][0], yj = vs[j][1];
      let intersect = ((yi > y) !== (yj > y)) &&
                      (x < (xj - xi) * (y - yi) / (yj - yi + 0.0000001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  isPointInAnyPolygon(point, polygons) {
    return polygons.some(poly => this.pointInPolygon(point, poly));
  }

  async loadGeoData() {
    const res = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
    const geo = await res.json();
    geo.features.forEach(f => {
      if (f.properties.name === "Antarctica") return;
      const coords = f.geometry.coordinates;
      if (f.geometry.type === "Polygon") {
        this.landPolygons.push(...coords);
      } else if (f.geometry.type === "MultiPolygon") {
        coords.forEach(p => this.landPolygons.push(...p));
      }
    });
    this.drawHalftoneWorld();
  }

  drawHalftoneWorld(ctxOverride, width, height) {
    const targetCtx = ctxOverride || this.ctx;
    const w = width || this.canvas.width;
    const h = height || this.canvas.height;

    targetCtx.clearRect(0, 0, w, h);
    this.drawShadow(targetCtx, w, h);

    const paddingX = w * 0.20;
    const paddingYTop = h * 0.12;
    const paddingYBottom = h * 0;

    const contentWidth = w - paddingX * 2;
    const contentHeight = h - paddingYTop - paddingYBottom;

    const cols = 200;
    const rows = Math.floor(cols * (contentHeight / contentWidth));
    const spacingX = contentWidth / cols;
    const spacingY = contentHeight / rows;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const lon = (x / cols) * 360 - 180;
        const lat = 90 - (y / rows) * 180;
        if (!this.isPointInAnyPolygon([lon, lat], this.landPolygons)) continue;
        this.drawDot(targetCtx, paddingX + x * spacingX, paddingYTop + y * spacingY, 2.5);
      }
    }
  }

  exportScreenshot() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 5040;
    exportCanvas.height = 2160;
    const exportCtx = exportCanvas.getContext('2d');
    this.drawHalftoneWorld(exportCtx, exportCanvas.width, exportCanvas.height);
    const link = document.createElement('a');
    link.download = 'halftone-world-map.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  }
}

export default HalftoneWorldMap; 