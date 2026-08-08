/* ==========================================================================
   AI GUARDIAN - Analytics Telemetry & Chart Engine
   ========================================================================== */

class AnalyticsEngine {
  constructor() {
    this.threatCanvas = document.getElementById('threat-chart-canvas');
    if (this.threatCanvas) {
      this.renderThreatChart();
    }
  }

  renderThreatChart() {
    const ctx = this.threatCanvas.getContext('2d');
    const draw = () => {
      if (this.threatCanvas.width !== this.threatCanvas.clientWidth || this.threatCanvas.height !== this.threatCanvas.clientHeight) {
        this.threatCanvas.width = this.threatCanvas.clientWidth;
        this.threatCanvas.height = this.threatCanvas.clientHeight;
      }

      const w = this.threatCanvas.width;
      const h = this.threatCanvas.height;
      ctx.clearRect(0, 0, w, h);

      const data = [2, 0, 1, 4, 0, 1, 0];
      const labels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

      const padding = 40;
      const graphW = w - padding * 2;
      const graphH = h - padding * 2;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding + (graphH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(w - padding, y);
        ctx.stroke();
      }

      const points = data.map((val, idx) => {
        const x = padding + (graphW / (data.length - 1)) * idx;
        const y = padding + graphH - (val / 5) * graphH;
        return { x, y, val };
      });

      const grad = ctx.createLinearGradient(0, padding, 0, h - padding);
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.45)');
      grad.addColorStop(1, 'rgba(0, 242, 254, 0)');

      ctx.beginPath();
      ctx.moveTo(points[0].x, h - padding);
      points.forEach(pt => ctx.lineTo(pt.x, pt.y));
      ctx.lineTo(points[points.length - 1].x, h - padding);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      points.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.strokeStyle = '#00F2FE';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#00F2FE';
      ctx.stroke();

      points.forEach((pt, idx) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#00FF9D';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00FF9D';
        ctx.fill();

        ctx.font = 'bold 11px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#94A3B8';
        ctx.textAlign = 'center';
        ctx.fillText(labels[idx], pt.x, h - 12);
      });
    };

    draw();
    window.addEventListener('resize', draw);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.analyticsEngine = new AnalyticsEngine();
});
