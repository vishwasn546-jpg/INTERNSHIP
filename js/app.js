/* ==========================================================================
   AI GUARDIAN - Main Application Controller & View Router
   ========================================================================== */

class AIGuardianApp {
  constructor() {
    this.currentView = 'landing';
    this.currentDashboardTab = 'overview';
    this.sosCountdownTimer = null;
    this.sosSeconds = 3;

    this.init();
  }

  init() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.bindEvents();
  }

  bindEvents() {
    // Mobile menu toggle
    const menuBtn = document.getElementById('mobile-menu-toggle');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        const sidebar = document.querySelector('.dashboard-sidebar');
        if (sidebar) sidebar.classList.toggle('mobile-open');
      });
    }
  }

  updateClock() {
    const clockEl = document.getElementById('utc-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.innerText = now.toUTCString().slice(17, 25) + ' UTC';
    }
  }

  switchView(viewName, dashboardSubTab = 'overview') {
    this.currentView = viewName;
    this.currentDashboardTab = dashboardSubTab;

    // Toggle View Sections
    const landingView = document.getElementById('view-landing');
    const dashboardView = document.getElementById('view-dashboard');

    if (viewName === 'landing') {
      if (landingView) landingView.classList.add('active');
      if (dashboardView) dashboardView.classList.remove('active');
      window.scrollTo(0, 0);
    } else if (viewName === 'dashboard') {
      if (landingView) landingView.classList.remove('active');
      if (dashboardView) dashboardView.classList.add('active');
      this.switchDashboardTab(dashboardSubTab);
    }

    // Update Nav Link Active States
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.tab === viewName || (viewName === 'dashboard' && link.dataset.tab === dashboardSubTab)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  switchDashboardTab(tabName) {
    this.currentDashboardTab = tabName;

    // Sidebar items highlight
    document.querySelectorAll('.sidebar-item').forEach(item => {
      if (item.dataset.tab === tabName) item.classList.add('active');
      else item.classList.remove('active');
    });

    // Dashboard Subpanel visibility
    const panels = ['overview', 'camera', 'voice', 'map', 'analytics', 'settings'];
    panels.forEach(p => {
      const el = document.getElementById(`dash-panel-${p}`);
      if (el) {
        if (p === tabName) el.classList.remove('hidden');
        else el.classList.add('hidden');
      }
    });

    // Re-trigger Canvas re-renders if switching to map or camera
    if (tabName === 'map' && window.liveMap) {
      setTimeout(() => window.liveMap.animate(), 100);
    }
  }

  scrollToSection(sectionId) {
    if (this.currentView !== 'landing') {
      this.switchView('landing');
      setTimeout(() => {
        const sec = document.getElementById(sectionId);
        if (sec) sec.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else {
      const sec = document.getElementById(sectionId);
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  triggerSosModal() {
    const modal = document.getElementById('sos-modal');
    if (!modal) return;
    modal.classList.remove('hidden');

    this.sosSeconds = 3;
    const secEl = document.getElementById('sos-seconds-text');
    const countEl = document.getElementById('sos-countdown-num');

    if (secEl) secEl.innerText = `${this.sosSeconds} seconds`;
    if (countEl) countEl.innerText = `${this.sosSeconds}`;

    if (this.sosCountdownTimer) clearInterval(this.sosCountdownTimer);

    this.sosCountdownTimer = setInterval(() => {
      this.sosSeconds--;
      if (secEl) secEl.innerText = `${this.sosSeconds} seconds`;
      if (countEl) countEl.innerText = `${this.sosSeconds}`;

      if (this.sosSeconds <= 0) {
        clearInterval(this.sosCountdownTimer);
        this.confirmInstantSos();
      }
    }, 1000);
  }

  cancelSosModal() {
    if (this.sosCountdownTimer) clearInterval(this.sosCountdownTimer);
    const modal = document.getElementById('sos-modal');
    if (modal) modal.classList.add('hidden');
    this.pushNotification('SOS CANCELLED', 'Emergency dispatch process aborted by user.', 'info');
  }

  confirmInstantSos() {
    if (this.sosCountdownTimer) clearInterval(this.sosCountdownTimer);
    const modal = document.getElementById('sos-modal');
    if (modal) modal.classList.add('hidden');

    alert('🚨 EMERGENCY SOS DISPATCHED!\n\n1. Live GPS transmitted to 911 Dispatch & Police Patrol\n2. Stealth Video & Audio recording initiated\n3. Emergency Contacts (Sarah, Mom, Local Security) notified via SMS/Call');
    this.pushNotification('EMERGENCY DISPATCH ACTIVE', 'Live emergency broadcast ongoing.', 'danger');
  }

  toggleNotificationsDrawer() {
    const drawer = document.getElementById('notif-drawer');
    if (drawer) drawer.classList.toggle('hidden');
  }

  pushNotification(title, msg, type = 'info') {
    const drawerBody = document.getElementById('notif-drawer-body');
    if (!drawerBody) return;

    const div = document.createElement('div');
    div.style.padding = '0.85rem';
    div.style.marginBottom = '0.5rem';
    div.style.borderRadius = '8px';
    div.style.border = '1px solid var(--border-glass)';
    div.style.background = type === 'danger' ? 'rgba(255, 51, 102, 0.15)' : 'rgba(118, 185, 0, 0.15)';

    const time = new Date().toLocaleTimeString();
    div.innerHTML = `
      <div style="font-weight: bold; font-size: 0.85rem; color: ${type === 'danger' ? '#FF3366' : '#00FF66'}">${title} <span style="font-size:0.7rem; color:#666;">(${time})</span></div>
      <div style="font-size: 0.8rem; color: #ccc;">${msg}</div>
    `;

    drawerBody.prepend(div);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new AIGuardianApp();
});
