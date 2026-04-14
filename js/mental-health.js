/**
 * mental-health.js — Mental Health Page JavaScript
 * Handles: content filter tabs WITHOUT page reload, daily checklist with progress bar
 */

'use strict';

/* ══════════════════════════════════════════
   CONTENT FILTER
   ══════════════════════════════════════════ */
(function initContentFilter() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.content-card-wrapper');

  if (!pills.length || !cards.length) return;

  /**
   * filterCards — Shows/hides content cards based on selected category.
   * @param {string} category - 'all' | 'mental' | 'confidence'
   */
  function filterCards(category) {
    cards.forEach(wrapper => {
      const cardCategory = wrapper.dataset.category || 'all';

      if (category === 'all' || cardCategory === category) {
        wrapper.style.display = '';
        // trigger re-animation
        const inner = wrapper.querySelector('.content-card');
        if (inner) {
          inner.classList.remove('anim-fade-up');
          void inner.offsetWidth; // reflow
          inner.classList.add('anim-fade-up');
        }
      } else {
        wrapper.style.display = 'none';
      }
    });
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      // update active state
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.dataset.filter;
      filterCards(category);
    });
  });

  // init with 'all'
  filterCards('all');
})();

/* ══════════════════════════════════════════
   DAILY CHECKLIST
   ══════════════════════════════════════════ */
(function initChecklist() {
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  const progressFill  = document.getElementById('checklist-progress-fill');
  const progressLabel = document.getElementById('checklist-progress-label');
  const total = checkboxes.length;

  if (!total) return;

  /**
   * updateProgress — Recalculates and animates the progress bar.
   */
  function updateProgress() {
    const checked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const pct = Math.round((checked / total) * 100);

    if (progressFill)  progressFill.style.width  = pct + '%';
    if (progressLabel) progressLabel.textContent  = `${checked} / ${total} مهمة`;
  }

  checkboxes.forEach(cb => {
    const item = cb.closest('.checklist-item');

    cb.addEventListener('change', () => {
      if (item) item.classList.toggle('checked', cb.checked);
      updateProgress();
    });
  });

  updateProgress(); // init
})();
