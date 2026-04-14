/**
 * share.js — Share With Us Page JavaScript
 * Handles: character counter, form validation, success toast, breathing exercise
 */

'use strict';

/* ══════════════════════════════════════════
   CHARACTER COUNTER & FORM VALIDATION
   ══════════════════════════════════════════ */
(function initShareForm() {
  const textarea    = document.getElementById('user-message');
  const counter     = document.getElementById('char-counter');
  const submitBtn   = document.getElementById('submit-msg-btn');
  const form        = document.getElementById('share-form');
  const MIN_CHARS   = 10;

  if (!textarea || !counter || !submitBtn) return;

  /**
   * updateCounter — Updates character count display and enables/disables submit.
   */
  function updateCounter() {
    const len = textarea.value.trim().length;
    const total = textarea.value.length;

    counter.textContent = `${total} حرف — الحد الأدنى ${MIN_CHARS} أحرف`;

    if (len >= MIN_CHARS) {
      counter.className = 'char-counter valid';
      counter.textContent = `✓ ${total} حرف — جاهزة للإرسال`;
      submitBtn.disabled = false;
    } else {
      counter.className = len > 0 ? 'char-counter warning' : 'char-counter';
      submitBtn.disabled = true;
    }
  }

  textarea.addEventListener('input', updateCounter);
  updateCounter(); // init state

  /* ── Form Submission ── */
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (textarea.value.trim().length < MIN_CHARS) return;

      showToast('💜 تم إرسال رسالتك بنجاح! شكراً لثقتك بنا 🌸');
      textarea.value = '';
      updateCounter();
    });
  }
})();

/* ══════════════════════════════════════════
   SUCCESS TOAST
   ══════════════════════════════════════════ */
/**
 * showToast — Displays a temporary success toast notification.
 * @param {string} message - The message to display
 */
function showToast(message) {
  let toast = document.getElementById('success-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'success-toast';
    toast.className = 'toast-custom';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ══════════════════════════════════════════
   BREATHING EXERCISE
   ══════════════════════════════════════════ */
(function initBreathingExercise() {
  const btn    = document.getElementById('breathe-btn');
  const circle = document.getElementById('breathe-circle');
  const label  = document.getElementById('breathe-label');

  if (!btn || !circle) return;

  let running   = false;
  let timeoutId = null;

  const STEPS = [
    { text: 'شهيق... خذي نفساً عميقاً 🌬️', cls: 'inhale',  dur: 4000 },
    { text: 'حبس... احبسي نفسك ✨',           cls: 'hold',   dur: 4000 },
    { text: 'زفير... أخرجي الهواء ببطء 🍃',  cls: 'exhale', dur: 4000 },
    { text: 'راحة... استعدي للتكرار 💜',      cls: '',       dur: 2000 },
  ];

  let stepIndex = 0;

  function runStep() {
    if (!running) return;
    const step = STEPS[stepIndex];

    // clear previous classes
    circle.className = '';
    if (step.cls) circle.classList.add(step.cls);

    if (label) label.textContent = step.text;

    stepIndex = (stepIndex + 1) % STEPS.length;
    timeoutId = setTimeout(runStep, step.dur);
  }

  btn.addEventListener('click', () => {
    if (running) {
      // stop
      running = false;
      clearTimeout(timeoutId);
      circle.className = '';
      if (label) label.textContent = 'اضغطي لبدء التمرين';
      btn.textContent = '▶ ابدئي تمرين التنفس';
    } else {
      // start
      running    = true;
      stepIndex  = 0;
      btn.textContent = '⏹ إيقاف التمرين';
      runStep();
    }
  });
})();
