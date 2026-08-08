/* ==========================================================================
   AI GUARDIAN - Interactive Spatial Vector Live Map Engine
   ========================================================================== */

class LiveMapEngine {
  constructor() {
    this.canvas = document.getElementById('live-map-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.pins = [
      { type: 'user', label: 'Current GPS Location', x: 0.45, y: 0.55, icon: '📍', color: '#00FF9D' },
      { type: 'police', label: 'Central Police Precinct (0.4mi)', x: 0.65, y: 0.3, icon: '🚓', color: '#00F2FE' },
      { type: 'hospital', label: 'City Emergency Medical (0.9mi)', x: 0.3, y: 0.25, icon: '🏥', color: '#FFB800' },
      { type: 'contact', label: 'Trusted Contact: Sarah (0.6mi)', x: 0.72, y: 0.68, icon: '👤', color: '#00FF9D' },
      { type: 'danger', label: 'Elevated Risk Area - Avoid', x: 0.2, y: 0.75, icon: '⚠️', color: '#FF2A6D' }
    ];

    this.route = [
      { x: 0.45, y: 0.55 },
      { x: 0.52, y: 0.48 },
      { x: 0.58, y: 0.4 },
      { x: 0.65, y: 0.3 }
    ];

    this.dashOffset = 0;
    this.init();
  }

  init() {
    this.animate();
  }

  animate() {
    if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // Draw Dark Cyber Map Grid
    this.ctx.strokeStyle = 'rgba(0, 242, 254, 0.06)';
    this.ctx.lineWidth = 1;
    const step = 44;
    for (let x = 0; x < w; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }

    // Draw Danger Zone Heatmap Circle
    const danger = this.pins.find(p => p.type === 'danger');
    if (danger) {
      const dx = danger.x * w;
      const dy = danger.y * h;
      const grad = this.ctx.createRadialGradient(dx, dy, 10, dx, dy, 95);
      grad.addColorStop(0, 'rgba(255, 42, 109, 0.38)');
      grad.addColorStop(1, 'rgba(255, 42, 109, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(dx, dy, 95, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw Animated Glowing Safe Route Path
    this.ctx.beginPath();
    this.route.forEach((pt, idx) => {
      const px = pt.x * w;
      const py = pt.y * h;
      if (idx === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    });

    this.ctx.strokeStyle = '#00F2FE';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([12, 8]);
    this.ctx.lineDashOffset = -this.dashOffset;
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = '#00F2FE';
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    this.dashOffset += 0.55;

    // Draw Location Pins & Markers
    this.pins.forEach(pin => {
      const px = pin.x * w;
      const py = pin.y * h;

      if (pin.type === 'user') {
        this.ctx.beginPath();
        this.ctx.arc(px, py, 22 + Math.sin(Date.now() * 0.006) * 5, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 255, 157, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }

      this.ctx.beginPath();
      this.ctx.arc(px, py, 16, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
      this.ctx.strokeStyle = pin.color;
      this.ctx.lineWidth = 2;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = pin.color;
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#fff';
      this.ctx.font = '14px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText(pin.icon, px, py);

      this.ctx.font = 'bold 11px "Space Grotesk", sans-serif';
      this.ctx.fillStyle = pin.color;
      this.ctx.textAlign = 'left';
      this.ctx.fillText(pin.label, px + 22, py + 4);
    });

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.liveMap = new LiveMapEngine();
});
