import { initApp } from '../main.js';
import { CATEGORIES } from '../database/constants.js';
import { createMessage } from '../database/messages.js';
import { showLaunchOverlay } from '../components/cosmicReply.js';
import { showToast } from '../components/toast.js';

initApp('write');

const form = document.getElementById('write-form');
const textarea = document.getElementById('message-text');
const charCounter = document.getElementById('char-counter');
const emotionPicker = document.getElementById('emotion-picker');
const visibilityOptions = document.querySelectorAll('[name="visibility"]');

let selectedCategory = 'random';
let selectedVisibility = 'public';

// Emotion picker
if (emotionPicker) {
  emotionPicker.querySelectorAll('.emotion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      emotionPicker.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedCategory = btn.dataset.category;
    });
  });
  emotionPicker.querySelector('[data-category="random"]')?.classList.add('selected');
}

// Visibility option cards
document.querySelectorAll('.option-card').forEach(card => {
  card.addEventListener('click', () => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio) {
      radio.checked = true;
      document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedVisibility = radio.value;
    }
  });
});

document.querySelector('.option-card input[value="public"]')?.closest('.option-card')?.classList.add('selected');

// Char counter
textarea?.addEventListener('input', () => {
  const len = textarea.value.length;
  const max = 500;
  charCounter.textContent = `${len} / ${max}`;
  charCounter.classList.toggle('warning', len > max * 0.9);
});

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const text = textarea.value.trim();
  if (!text) {
    showToast('Write something before launching', 'info');
    textarea.focus();
    return;
  }

  if (text.length > 500) {
    showToast('Message is too long (max 500 characters)', 'info');
    return;
  }

  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.innerHTML = 'Launching...';

  try {
    const message = await createMessage({
      messageText: text,
      category: selectedCategory,
      visibility: selectedVisibility,
    });

    setTimeout(() => {
      showLaunchOverlay(message, selectedVisibility === 'private', message.access_token);
      form.reset();
      emotionPicker?.querySelectorAll('.emotion-btn').forEach(b => b.classList.remove('selected'));
      emotionPicker?.querySelector('[data-category="random"]')?.classList.add('selected');
      selectedCategory = 'random';
      charCounter.textContent = '0 / 500';
      btn.disabled = false;
      btn.innerHTML = 'Launch Message';
    }, 800);
  } catch (err) {
    showToast('Your message got lost in transit. Try again.', 'info');
    btn.disabled = false;
    btn.innerHTML = 'Launch Message 🚀';
  }
});
