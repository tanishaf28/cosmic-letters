import { COSMIC_WEATHER } from '../database/constants.js';
import { randomFrom } from '../utils/helpers.js';

export function renderCosmicWeather(container) {
  const weather = randomFrom(COSMIC_WEATHER);
  const el = document.createElement('div');
  el.className = 'cosmic-weather';
  el.innerHTML = `
    <span class="cosmic-weather__icon">${weather.icon}</span>
    <span class="cosmic-weather__text"><strong>Cosmic Weather:</strong> ${weather.text} ${weather.icon}</span>
  `;
  container.appendChild(el);
  return el;
}
