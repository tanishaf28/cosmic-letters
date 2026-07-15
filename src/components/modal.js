import { createMessageCard } from './messageCard.js';

let overlay = null;

function getOverlay() {
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal glass-card" id="modal-content"></div>`;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    document.body.appendChild(overlay);
  }
  return overlay;
}

export function openMessageModal(message) {
  const el = getOverlay();
  const content = el.querySelector('#modal-content');
  content.innerHTML = '';
  content.style.position = 'relative';

  const card = createMessageCard(message, { showActions: false });
  content.appendChild(card);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn btn--icon modal__close';
  closeBtn.innerHTML = '✕';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.addEventListener('click', closeModal);
  content.appendChild(closeBtn);

  requestAnimationFrame(() => el.classList.add('active'));
}

export function closeModal() {
  if (overlay) overlay.classList.remove('active');
}

export function initModalKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}
