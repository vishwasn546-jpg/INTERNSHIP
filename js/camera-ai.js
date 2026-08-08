/* ==========================================================================
   AI GUARDIAN - Camera AI & Computer Vision Object Detection Engine
   ========================================================================== */

class CameraAIEngine {
  constructor() {
    this.video = document.getElementById('video-element');
    this.canvas = document.getElementById('camera-overlay-canvas');
    this.logBox = document.getElementById('triton-log-body');
    
    this.isStreaming = false;
    this.activeScenario = 'safe'; // 'safe', 'violence', 'weapon', 'fall', 'unknown'
    this.fps = 60;
    this.frameCount = 0;
    
    // Sample Bounding Box Detections for scenarios
    this.scenarios = {
      safe: [
        { label: 'Person - Safe', confidence: 99.4, color: '#00FF9D', x: 0.25, y: 0.15, w: 0.35, h: 0.75 }
      ],
      violence: [
        { label: 'Violence Detected!', confidence: 98.6, color: '#FF2A6D', x: 0.18, y: 0.12, w: 0.55, h: 0.78 },
        { label: 'High Distress Level', confidence: 95.2, color: '#FF2A6D', x: 0.58, y: 0.2, w: 0.3, h: 0.5 }
      ],
      weapon: [
        { label: 'Weapon Detected [Knife/Object]', confidence: 97.8, color: '#FF2A6D', x: 0.42, y: 0.35, w: 0.22, h: 0.32 },
        { label: 'Threat Subject', confidence: 94.1, color: '#FFB800', x: 0.3, y: 0.15, w: 0.45, h: 0.75 }
      ],
      fall: [
        { label: 'Fall Detected!', confidence: 99.1, color: '#FF2A6D', x: 0.1, y: 0.5, w: 0.75, h: 0.4 }
      ],
      unknown: [
        { label: 'Unknown Person', confidence: 88.5, color: '#00F2FE', x: 0.55, y: 0.18, w: 0.32, h: 0.7 }
      ]
    };

    this.init();
  }

  init() {
    this.startCamera();
    this.animateDetections();
    this.startLogStream();
  }

  async startCamera() {
    if (!this.video) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
      this.video.srcObject = stream;
      this.video.play();
      this.isStreaming = true;
      this.addLog('[SYS] WebCam stream initialized. Resolution: 1280x720@60FPS');
    } catch (err) {
      console.warn('WebCam not available, using synthetic video stream preview:', err);
      this.addLog('[WARN] WebCam permission unavailable. Falling back to Synthetic Vision Test Stream.');
    }
  }

  setScenario(scenarioKey) {
    if (this.scenarios[scenarioKey]) {
      this.activeScenario = scenarioKey;
      this.addLog(`[NEURAL] Inference scenario updated to: ${scenarioKey.toUpperCase()}`);
      
      if (scenarioKey !== 'safe') {
        if (window.app) {
          window.app.pushNotification('CRITICAL AI ALERT', `Computer Vision engine triggered threat mode: ${scenarioKey.toUpperCase()}`, 'danger');
        }
      }
    }
  }

  animateDetections() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    
    const draw = () => {
      if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
      }

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const width = this.canvas.width;
      const height = this.canvas.height;
      const detections = this.scenarios[this.activeScenario] || this.scenarios.safe;

      // Draw bounding boxes
      detections.forEach(det => {
        const bx = det.x * width;
        const by = det.y * height;
        const bw = det.w * width;
        const bh = det.h * height;

        const jitterX = (Math.random() - 0.5) * 2;
        const jitterY = (Math.random() - 0.5) * 2;

        ctx.strokeStyle = det.color;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 18;
        ctx.shadowColor = det.color;
        ctx.strokeRect(bx + jitterX, by + jitterY, bw, bh);

        // Corner accents
        const cornerLength = 16;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(bx, by + cornerLength);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx + cornerLength, by);
        ctx.stroke();

        // Label Tag Box
        ctx.fillStyle = det.color;
        const labelText = `${det.label} [${det.confidence.toFixed(1)}%]`;
        ctx.font = 'bold 13px "Space Grotesk", sans-serif';
        const textWidth = ctx.measureText(labelText).width;

        ctx.fillRect(bx, by - 26, textWidth + 16, 26);

        ctx.fillStyle = '#000000';
        ctx.shadowBlur = 0;
        ctx.fillText(labelText, bx + 8, by - 8);
      });

      this.frameCount++;
      requestAnimationFrame(draw);
    };

    draw();
  }

  addLog(msg) {
    if (!this.logBox) return;
    const timeStr = new Date().toLocaleTimeString();
    const line = document.createElement('div');
    line.innerHTML = `<span style="color: #64748B;">[${timeStr}]</span> ${msg}`;
    this.logBox.appendChild(line);
    this.logBox.scrollTop = this.logBox.scrollHeight;
  }

  startLogStream() {
    setInterval(() => {
      const logs = [
        `[FP16-Inference] Batch 1 time: ${(Math.random() * 0.8 + 1.1).toFixed(2)}ms`,
        `[Neural-Core] Hardware Temp: 48°C | VRAM: 3.8GB / 16.0GB`,
        `[Pose-Estimation] Keypoint alignment confidence: ${(Math.random() * 2 + 97.8).toFixed(1)}%`,
        `[Spatial-CV] Tracking ID #1049 active. Velocity vector: [0.02, -0.01]`
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      this.addLog(randomLog);
    }, 4500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cameraEngine = new CameraAIEngine();
});
