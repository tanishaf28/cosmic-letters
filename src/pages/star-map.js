import { initApp } from '../main.js';
import { initStarMap } from '../components/starMap.js';
import { renderCosmicWeather } from '../components/cosmicWeather.js';
import { getAllForStarMap } from '../database/messages.js';

initApp('star-map');

const weatherContainer = document.getElementById('cosmic-weather');
const starCount = document.getElementById('star-count');

if (weatherContainer) renderCosmicWeather(weatherContainer);

const messages = await getAllForStarMap();
if (starCount) {
  starCount.textContent = `${messages.length} stars in the map`;
}

initStarMap('star-map-canvas', messages);
