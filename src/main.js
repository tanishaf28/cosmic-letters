import { createCosmicBackground, initStarfield } from './components/background.js';
import { mountNavigation } from './components/navigation.js';
import { initModalKeyboard } from './components/modal.js';

export function initApp(activePage) {
  createCosmicBackground();
  initStarfield();
  mountNavigation(activePage);
  initModalKeyboard();
}
