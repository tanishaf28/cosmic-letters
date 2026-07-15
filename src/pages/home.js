import { initApp } from '../main.js';
import { renderCosmicWeather } from '../components/cosmicWeather.js';
import { renderDailyQuestion } from '../components/dailyQuestion.js';
import { getPublicMessages } from '../database/messages.js';
import { renderMessageGrid } from '../components/messageCard.js';

initApp('home');

const weatherContainer = document.getElementById('cosmic-weather');
const questionContainer = document.getElementById('daily-question');
const previewGrid = document.getElementById('preview-grid');

if (weatherContainer) renderCosmicWeather(weatherContainer);
if (questionContainer) renderDailyQuestion(questionContainer);

if (previewGrid) {
  const { messages } = await getPublicMessages({ limit: 3 });
  renderMessageGrid(previewGrid, messages, { showActions: false });
}
