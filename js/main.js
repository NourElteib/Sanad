/**
 * main.js — Global JavaScript
 * Shared utilities: navbar scroll effect, active link highlighting
 */

'use strict';

/* ── Navbar Scroll Effect ── */
(function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
})();

/* ── Active Nav Link ── */
(function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link-custom').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
      link.classList.add('active-link');
    }
  });
})();

/* ── Intersection Observer: Animate on Scroll ── */
(function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('anim-fade-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();

/* ── Current Year in Footer ── */
(function setFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
