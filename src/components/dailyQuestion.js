import { DAILY_QUESTIONS } from '../database/constants.js';

export function renderDailyQuestion(container) {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % DAILY_QUESTIONS.length;
  const question = DAILY_QUESTIONS[dayIndex];

  const el = document.createElement('div');
  el.className = 'daily-question';
  el.innerHTML = `
    <div class="daily-question__label">Daily Cosmic Question</div>
    <p class="daily-question__text">"${question}"</p>
    <a href="write.html" class="btn btn--ghost btn--sm">Answer Anonymously →</a>
  `;
  container.appendChild(el);
  return el;
}
