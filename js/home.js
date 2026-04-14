/**
 * home.js — Home Page JavaScript
 * Handles: animated counters (optional), hero parallax stub
 */

'use strict';

/* ── Tip Cards: simple hover glow pulse ── */
document.querySelectorAll('.tip-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = 'var(--clr-primary-light)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = 'var(--clr-border)';
  });
});

/* ── Routine List: check-off items ── */
document.querySelectorAll('.routine-list li').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', () => {
    item.classList.toggle('done');
    if (item.classList.contains('done')) {
      item.style.textDecoration = 'line-through';
      item.style.color = 'var(--clr-text-muted)';
    } else {
      item.style.textDecoration = '';
      item.style.color = '';
    }
  });
});
