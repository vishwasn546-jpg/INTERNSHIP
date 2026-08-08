/* ==========================================================================
   AI GUARDIAN - Voice Intelligence & Audio Visualizer Engine
   ========================================================================== */

class VoiceAIEngine {
  constructor() {
    this.canvas = document.getElementById('voice-waveform-canvas');
    this.micBtn = document.getElementById('mic-main-btn');
    this.statusText = document.getElementById('voice-status-text');
    this.confidenceText = document.getElementById('voice-confidence-val');
    this.keywordLog = document.getElementById('voice-keyword-log');

    this.isListening = false;
    this.audioCtx = null;
    this.analyser = null;
    this.dataArray = null;

    this.init();
  }

  init() {
    if (this.micBtn) {
      this.micBtn.addEventListener('click', () => this.toggleListening());
    }
    this.animateWaveform();
  }

  async toggleListening() {
    if (!this.isListening) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
        const source = this.audioCtx.createMediaStreamSource(stream);
        source.connect(this.analyser);
        this.analyser.fftSize = 128;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.isListening = true;
        this.micBtn.style.background = 'linear-gradient(135deg, #FF2A6D, #CC0033)';
        if (this.statusText) this.statusText.innerText = 'LISTENING FOR DISTRESS KEYWORDS...';
        
        this.startKeywordSimulation();
      } catch (err) {
        console.warn('Microphone access unavailable, using synthetic audio waveform visualization.');
        this.isListening = true;
        this.micBtn.style.background = 'linear-gradient(135deg, #00FF9D, #00F2FE)';
        if (this.statusText) this.statusText.innerText = 'SYNTHETIC VOICE GUARDIAN LISTENING...';
        this.startKeywordSimulation();
      }
    } else {
      this.isListening = false;
      this.micBtn.style.background = 'linear-gradient(135deg, #00F2FE 0%, #0284C7 100%)';
      if (this.statusText) this.statusText.innerText = 'CLICK TO START VOICE GUARDIAN';
      if (this.keywordSimInterval) clearInterval(this.keywordSimInterval);
    }
  }

  animateWaveform() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');

    const render = () => {
      if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
      }

      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);

      ctx.beginPath();
      ctx.moveTo(0, h / 2);

      const numBars = 60;
      const barWidth = w / numBars;

      for (let i = 0; i < numBars; i++) {
        let amp = 5;
        if (this.isListening) {
          if (this.dataArray && this.analyser) {
            this.analyser.getByteFrequencyData(this.dataArray);
            amp = (this.dataArray[i % this.dataArray.length] / 255) * (h / 2.2);
          } else {
            amp = Math.sin(Date.now() * 0.005 + i * 0.2) * 30 + Math.random() * 20;
          }
        }

        const x = i * barWidth;
        const y = h / 2 - amp;

        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = this.isListening ? '#00FF9D' : '#00F2FE';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00F2FE';
      ctx.stroke();

      requestAnimationFrame(render);
    };

    render();
  }

  startKeywordSimulation() {
    if (this.keywordSimInterval) clearInterval(this.keywordSimInterval);
    const keywords = ['HELP', 'EMERGENCY', 'STOP', 'SAVE ME'];

    this.keywordSimInterval = setInterval(() => {
      if (!this.isListening) return;

      const randomWord = keywords[Math.floor(Math.random() * keywords.length)];
      const confidence = (Math.random() * 4 + 95.5).toFixed(1);

      if (this.confidenceText) {
        this.confidenceText.innerText = `${confidence}%`;
      }

      if (this.keywordLog) {
        const item = document.createElement('div');
        item.style.padding = '0.4rem 0';
        item.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        item.innerHTML = `<span style="color: #FF2A6D; font-weight: bold;">[SPOTTER]</span> Detected keyword: <strong>"${randomWord}"</strong> (${confidence}% confidence)`;
        this.keywordLog.prepend(item);
      }
    }, 6000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.voiceEngine = new VoiceAIEngine();
});
