import { CATEGORIES } from '../database/constants.js';
import { formatTimeAgo, isExpired } from '../utils/helpers.js';
import { isLiked } from '../database/messages.js';

export function createMessageCard(message, { onLike, showActions = true } = {}) {
  const cat = CATEGORIES[message.category] || CATEGORIES.random;
  const expired = isExpired(message.created_at);
  const liked = isLiked(message.id);
  const shortId = message.id.slice(-4).toUpperCase();

  const card = document.createElement('article');
  card.className = `glass-card message-card ${expired ? 'message-card--lost' : ''}`;
  card.dataset.id = message.id;
  card.dataset.category = message.category;
  card.style.animationDelay = `${Math.random() * 0.3}s`;

  card.innerHTML = `
    <div class="message-card__header">
      <span class="message-card__id">${cat.emoji} Anonymous Star #${shortId}</span>
      ${showActions ? `
        <button class="btn btn--icon ${liked ? 'liked' : ''}" data-like="${message.id}" aria-label="Like message">
          ${liked ? '❤️' : '🤍'}
        </button>
      ` : ''}
    </div>
    <p class="message-card__text">"${escapeHtml(message.message_text)}"</p>
    <div class="message-card__meta">
      <span class="message-card__category message-card__category--${message.category}">
        ${cat.emoji} ${cat.label}
      </span>
      <span class="message-card__time">${formatTimeAgo(message.created_at)}</span>
      <span class="message-card__likes">♥ ${message.likes || 0}</span>
    </div>
  `;

  if (showActions && onLike) {
    card.querySelector('[data-like]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      onLike(message.id, card);
    });
  }

  return card;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function renderMessageGrid(container, messages, options = {}) {
  container.innerHTML = '';
  if (!messages.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1">
        <div class="empty-state__icon">🌌</div>
        <p>No messages found in this corner of the universe.</p>
        <p style="margin-top: 0.5rem; font-size: 0.9rem;">Be the first to send a thought into space.</p>
      </div>
    `;
    return;
  }

  messages.forEach(msg => {
    container.appendChild(createMessageCard(msg, options));
  });
}
