import { initApp } from '../main.js';
import { getMessageByToken } from '../database/messages.js';
import { createMessageCard } from '../components/messageCard.js';
import { getQueryParam } from '../utils/helpers.js';

initApp('private');

const container = document.getElementById('private-message');
const token = getQueryParam('token');

if (!token) {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state__icon">🌑</div>
      <h2>Lost in Space</h2>
      <p style="margin-top: 0.5rem; color: var(--text-muted);">No star link provided. This message may have drifted beyond reach.</p>
      <a href="index.html" class="btn btn--primary" style="margin-top: 1.5rem;">Return Home</a>
    </div>
  `;
} else {
  const message = await getMessageByToken(token);
  if (!message) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">💫</div>
        <h2>Star Not Found</h2>
        <p style="margin-top: 0.5rem; color: var(--text-muted);">This private star has faded or the link is incorrect.</p>
        <a href="index.html" class="btn btn--primary" style="margin-top: 1.5rem;">Return Home</a>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span style="font-size: 2rem;">🔗</span>
        <h2 style="margin-top: 0.5rem; font-size: 1.3rem;">Private Star Message</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.25rem;">Only you were meant to find this</p>
      </div>
    `;
    container.appendChild(createMessageCard(message, { showActions: false }));
  }
}
