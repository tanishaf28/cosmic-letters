import { AI_REPLIES } from '../database/constants.js';
import { randomFrom, randomLightYears } from '../utils/helpers.js';

export function generateCosmicReply() {
  return {
    distance: randomLightYears(),
    reply: randomFrom(AI_REPLIES),
  };
}

export function renderAiReply(container) {
  const { distance, reply } = generateCosmicReply();
  const el = document.createElement('div');
  el.className = 'ai-reply';
  el.innerHTML = `
    <div class="ai-reply__distance">Your message traveled ${distance} light years</div>
    <div class="ai-reply__label">A stranger responds:</div>
    <p class="ai-reply__text">"${reply}"</p>
  `;
  container.appendChild(el);
  return el;
}

export function showLaunchOverlay(message, isPrivate = false, accessToken = null) {
  let overlay = document.getElementById('launch-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'launch-overlay';
    overlay.className = 'launch-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="launch-overlay__content">
      <div class="launch-overlay__star">⭐</div>
      <p class="launch-overlay__text">Your message has become a star</p>
      <p class="launch-overlay__subtext">${isPrivate ? 'Your private star link is ready' : 'It now drifts through the cosmic universe'}</p>
      ${isPrivate && accessToken ? `
        <div class="private-link-box" style="margin-top: 2rem; text-align: left;">
          <div class="private-link-box__label">Your Star Link (share with one person)</div>
          <div class="private-link-box__url">
            <input class="private-link-box__input" id="overlay-link" readonly value="${getLink(accessToken)}">
            <button class="btn btn--secondary btn--sm" id="overlay-copy">Copy</button>
          </div>
        </div>
      ` : ''}
      <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <a href="explore.html" class="btn btn--primary btn--sm">Explore Messages</a>
        <button class="btn btn--secondary btn--sm" id="overlay-close">Write Another</button>
      </div>
    </div>
  `;

  overlay.classList.add('active');

  overlay.querySelector('#overlay-close')?.addEventListener('click', () => {
    overlay.classList.remove('active');
    window.location.href = 'write.html';
  });

  overlay.querySelector('#overlay-copy')?.addEventListener('click', async () => {
    const input = overlay.querySelector('#overlay-link');
    try {
      await navigator.clipboard.writeText(input.value);
      overlay.querySelector('#overlay-copy').textContent = 'Copied!';
    } catch {
      input.select();
    }
  });

  setTimeout(() => {
    const aiContainer = document.createElement('div');
    aiContainer.style.maxWidth = '480px';
    aiContainer.style.margin = '1.5rem auto 0';
    renderAiReply(aiContainer);
    overlay.querySelector('.launch-overlay__content').appendChild(aiContainer);
  }, 1200);
}

function getLink(token) {
  const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
  return `${base}private.html?token=${token}`;
}
