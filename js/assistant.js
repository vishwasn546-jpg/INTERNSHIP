/* ==========================================================================
   AI GUARDIAN - Conversational AI Assistant & Reasoning Engine
   ========================================================================== */

class AssistantEngine {
  constructor() {
    this.drawer = document.getElementById('assistant-drawer');
    this.body = document.getElementById('assistant-chat-body');
    this.input = document.getElementById('assistant-input');
    
    this.init();
  }

  init() {
    if (this.input) {
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }
  }

  toggleDrawer() {
    if (!this.drawer) return;
    this.drawer.classList.toggle('hidden');
  }

  sendMessage() {
    if (!this.input || !this.input.value.trim()) return;
    const text = this.input.value.trim();
    this.input.value = '';

    // Append User Bubble
    this.appendBubble(text, 'user');

    // Simulate AI Thought Reasoning steps
    setTimeout(() => {
      this.appendReasoningStep('AI Thought Process: 1. Analyzing local spatial crime index (0.4mi radius)...');
    }, 400);

    setTimeout(() => {
      this.appendReasoningStep('AI Thought Process: 2. Evaluating live ambient acoustic pitch & computer vision frames...');
    }, 900);

    setTimeout(() => {
      const response = this.generateResponse(text);
      this.appendBubble(response, 'ai');
    }, 1500);
  }

  appendBubble(text, sender) {
    if (!this.body) return;
    const div = document.createElement('div');
    div.className = `chat-bubble ${sender}`;
    div.innerText = text;
    this.body.appendChild(div);
    this.body.scrollTop = this.body.scrollHeight;
  }

  appendReasoningStep(stepText) {
    if (!this.body) return;
    const div = document.createElement('div');
    div.style.fontSize = '0.72rem';
    div.style.color = '#76B900';
    div.style.fontFamily = 'monospace';
    div.style.opacity = '0.85';
    div.innerText = stepText;
    this.body.appendChild(div);
    this.body.scrollTop = this.body.scrollHeight;
  }

  generateResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('police') || q.includes('help')) {
      return "I have located Central Police Station (0.4 miles away). Would you like me to initiate a priority SOS dispatch or share your live GPS coordinates with officer patrol?";
    } else if (q.includes('route') || q.includes('safe')) {
      return "Analyzing safe passage... The recommended glowing green vector avoids 5th Street due to recent elevated risk index. Stay on Main Avenue.";
    } else {
      return `AI Guardian actively monitoring your perimeter. System health: 99.8% confidence. How can I assist your safety right now?`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.assistantEngine = new AssistantEngine();
});
