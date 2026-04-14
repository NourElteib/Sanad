/**
 * dashboard.js — Admin Dashboard JavaScript
 * Handles: sidebar toggle, logout, date, animated stats, add-tip form,
 *          delete confirmations, view-message modal, sidebar nav links
 */

'use strict';

/* ── Sidebar Mobile Toggle ── */
(function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebar-toggle');
  const sidebar   = document.getElementById('dash-sidebar');
  const overlay   = document.getElementById('sidebar-overlay');

  if (!toggleBtn || !sidebar) return;

  function openSidebar() {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  if (overlay) overlay.addEventListener('click', closeSidebar);
})();

/* ── Topbar Date ── */
(function initTopbarDate() {
  const el = document.getElementById('topbar-date');
  if (!el) return;

  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = now.toLocaleDateString('ar-EG', opts);
})();

/* ── Animated Stat Counters ── */
(function initStatCounters() {
  /**
   * animateCounter — Counts up a number from 0 to target over a duration.
   * @param {HTMLElement} el     - The element to update
   * @param {number}      target - The final number
   * @param {number}      ms     - Duration in milliseconds
   */
  function animateCounter(el, target, ms = 1200) {
    const step  = target / (ms / 16);
    let current = 0;

    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString('ar-EG');
        return;
      }
      el.textContent = Math.floor(current).toLocaleString('ar-EG');
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const observers = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target || '0', 10);
        animateCounter(el, target);
        observers.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => observers.observe(el));
})();

/* ── Logout Button ── */
(function initLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', () => {
    if (confirm('هل تريدين تسجيل الخروج؟')) {
      window.location.href = 'login.html';
    }
  });
})();

/* ── Login form (login.html) ── */
(function initLoginForm() {
  const form    = document.getElementById('login-form');
  const errEl   = document.getElementById('login-error');
  if (!form) return;

  // Demo credentials
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'admin123';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      window.location.href = 'dashboard.html';
    } else {
      if (errEl) errEl.classList.add('show');
      // auto-hide after 3s
      setTimeout(() => errEl?.classList.remove('show'), 3000);
    }
  });
})();

/* ══════════════════════════════════════════
   ADD TIP FORM
   ══════════════════════════════════════════ */
(function initAddTipForm() {
  const form = document.getElementById('add-tip-form');
  if (!form) return;

  const tipTitle    = document.getElementById('tip-title');
  const tipCategory = document.getElementById('tip-category');
  const tipContent  = document.getElementById('tip-content');
  const tipsTable   = document.querySelector('#tips-table tbody');

  // Category value → badge class & label map
  const CATEGORY_MAP = {
    mental:     { badge: 'table-badge-blue',   label: 'صحة نفسية' },
    confidence: { badge: 'table-badge-purple', label: 'ثقة بالنفس' },
    general:    { badge: 'table-badge-green',  label: 'قضايا عامة' },
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = tipTitle.value.trim();
    const cat   = tipCategory.value;
    const body  = tipContent.value.trim();

    if (!title || !cat || !body) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    // Build today's date in Arabic format
    const now     = new Date();
    const dateStr = now.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

    // Build new row
    const catInfo = CATEGORY_MAP[cat] || CATEGORY_MAP.general;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(title)}</td>
      <td><span class="table-badge ${catInfo.badge}">${catInfo.label}</span></td>
      <td>${dateStr}</td>
      <td>
        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-sm btn-outline-primary rounded-pill btn-edit-tip" title="تعديل">✏️ تعديل</button>
          <button class="btn btn-sm btn-danger rounded-pill btn-delete-tip" title="مسح">🗑️ مسح</button>
        </div>
      </td>
    `;

    // Prepend to table
    if (tipsTable) tipsTable.prepend(row);

    // Attach event listeners to the new row
    attachTipRowListeners(row);

    // Reset form
    form.reset();

    // Show Bootstrap toast
    const toastEl = document.getElementById('tipToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();
    }
  });
})();

/* ══════════════════════════════════════════
   DELETE BUTTONS — Tips Table
   ══════════════════════════════════════════ */
function attachTipRowListeners(row) {
  // Delete
  row.querySelector('.btn-delete-tip')?.addEventListener('click', () => {
    if (confirm('هل أنتِ متأكدة من مسح هذه النصيحة؟')) {
      row.style.transition = 'opacity 0.35s, transform 0.35s';
      row.style.opacity = '0';
      row.style.transform = 'translateX(20px)';
      setTimeout(() => row.remove(), 350);
    }
  });

  // Edit (scroll to add-tip form and populate)
  row.querySelector('.btn-edit-tip')?.addEventListener('click', () => {
    const title = row.cells[0]?.textContent?.trim() || '';
    const addSection = document.getElementById('add-tip-section');
    const tipTitle   = document.getElementById('tip-title');

    if (addSection) addSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (tipTitle)  { tipTitle.value = title; tipTitle.focus(); }
  });
}

// Attach to existing rows
(function initExistingTipRows() {
  document.querySelectorAll('#tips-table tbody tr').forEach(row => {
    attachTipRowListeners(row);
  });
})();

/* ══════════════════════════════════════════
   DELETE / VIEW BUTTONS — Messages Table
   ══════════════════════════════════════════ */
(function initMessageActions() {
  const modalContent = document.getElementById('modal-message-content');
  const modalDate    = document.getElementById('modal-message-date');

  document.querySelectorAll('#messages-table tbody tr').forEach(row => {
    // View — populate modal with the row's message
    row.querySelector('.btn-view-msg')?.addEventListener('click', () => {
      const msgText = row.querySelector('.msg-excerpt-cell')?.textContent?.trim() || '';
      const dateText = row.cells[1]?.textContent?.trim() || '';
      if (modalContent) modalContent.textContent = msgText;
      if (modalDate)    modalDate.textContent = '📅 تاريخ الاستلام: ' + dateText;
    });

    // Delete
    row.querySelector('.btn-delete-msg')?.addEventListener('click', () => {
      if (confirm('هل أنتِ متأكدة من مسح هذه الرسالة؟')) {
        row.style.transition = 'opacity 0.35s, transform 0.35s';
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';
        setTimeout(() => row.remove(), 350);
      }
    });
  });
})();

/* ══════════════════════════════════════════
   SIDEBAR NAV LINK SCROLLING
   ══════════════════════════════════════════ */
(function initSidebarLinks() {
  const addTipLink  = document.getElementById('add-tip-link');
  const messagesLink = document.getElementById('messages-link');
  const addTipSection = document.getElementById('add-tip-section');
  const messagesTable = document.getElementById('messages-table');

  if (addTipLink && addTipSection) {
    addTipLink.addEventListener('click', (e) => {
      e.preventDefault();
      addTipSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (messagesLink && messagesTable) {
    messagesLink.addEventListener('click', (e) => {
      e.preventDefault();
      messagesTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();

/* ── Utility: Escape HTML to prevent XSS in dynamic rows ── */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
