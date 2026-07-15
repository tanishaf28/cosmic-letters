import { initApp } from '../main.js';
import { CATEGORIES } from '../database/constants.js';
import { getPublicMessages, getRandomMessage, toggleLike } from '../database/messages.js';
import { createMessageCard } from '../components/messageCard.js';
import { renderCosmicWeather } from '../components/cosmicWeather.js';
import { showToast } from '../components/toast.js';
import { debounce } from '../utils/helpers.js';

initApp('explore');

const grid = document.getElementById('message-grid');
const filters = document.getElementById('category-filters');
const searchInput = document.getElementById('search-input');
const randomBtn = document.getElementById('random-btn');
const loadMoreBtn = document.getElementById('load-more');
const weatherContainer = document.getElementById('cosmic-weather');

let currentCategory = 'all';
let currentSearch = '';
let offset = 0;
const LIMIT = 8;

if (weatherContainer) renderCosmicWeather(weatherContainer);

function buildFilters() {
  if (!filters) return;

  const allChip = document.createElement('button');
  allChip.className = 'filter-chip active';
  allChip.textContent = 'All';
  allChip.dataset.category = 'all';
  filters.appendChild(allChip);

  Object.values(CATEGORIES).forEach(cat => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.textContent = `${cat.emoji} ${cat.label}`;
    chip.dataset.category = cat.key;
    filters.appendChild(chip);
  });

  filters.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    filters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    currentCategory = chip.dataset.category;
    offset = 0;
    loadMessages(true);
  });
}

async function handleLike(messageId, card) {
  const result = await toggleLike(messageId);
  if (!result) return;

  const btn = card.querySelector('[data-like]');
  const likesEl = card.querySelector('.message-card__likes');
  if (btn) {
    btn.classList.toggle('liked', result.liked);
    btn.innerHTML = result.liked ? '❤️' : '🤍';
  }
  if (likesEl) {
    likesEl.textContent = `♥ ${result.message.likes}`;
  }
}

async function loadMessages(reset = false) {
  const { messages, hasMore } = await getPublicMessages({
    category: currentCategory,
    search: currentSearch,
    limit: LIMIT,
    offset,
  });

  if (reset) {
    grid.innerHTML = '';
  }

  if (messages.length === 0 && offset === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1">
        <div class="empty-state__icon">🌌</div>
        <p>No messages found in this corner of the universe.</p>
      </div>
    `;
  } else {
    messages.forEach(msg => {
      grid.appendChild(createMessageCard(msg, { onLike: handleLike }));
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.style.display = hasMore ? 'inline-flex' : 'none';
  }
}

buildFilters();
loadMessages(true);

searchInput?.addEventListener('input', debounce((e) => {
  currentSearch = e.target.value.trim();
  offset = 0;
  loadMessages(true);
}, 300));

randomBtn?.addEventListener('click', async () => {
  const msg = await getRandomMessage(currentCategory === 'all' ? null : currentCategory);
  if (!msg) {
    showToast('The universe is quiet... for now', 'info');
    return;
  }
  grid.innerHTML = '';
  grid.appendChild(createMessageCard(msg, { onLike: handleLike }));
  showToast('A random star appeared', 'success');
  if (loadMoreBtn) loadMoreBtn.style.display = 'none';
});

loadMoreBtn?.addEventListener('click', () => {
  offset += LIMIT;
  loadMessages(false);
});

let loading = false;
window.addEventListener('scroll', () => {
  if (loading) return;
  const { scrollY, innerHeight } = window;
  const docHeight = document.documentElement.scrollHeight;
  if (scrollY + innerHeight >= docHeight - 200) {
    if (loadMoreBtn && loadMoreBtn.style.display !== 'none') {
      loading = true;
      offset += LIMIT;
      loadMessages(false).finally(() => { loading = false; });
    }
  }
});
