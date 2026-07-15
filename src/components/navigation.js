const NAV_LINKS = [
  { href: 'index.html', label: 'Home', page: 'home' },
  { href: 'write.html', label: 'Write', page: 'write' },
  { href: 'explore.html', label: 'Explore', page: 'explore' },
  { href: 'star-map.html', label: 'Star Map', page: 'star-map' },
];

export function renderNavigation(activePage) {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.innerHTML = `
    <a href="index.html" class="nav__logo">
      <span class="nav__logo-icon">✨</span>
      Cosmic Letters
    </a>
    <ul class="nav__links">
      ${NAV_LINKS.map(link => `
        <li>
          <a href="${link.href}" class="nav__link ${link.page === activePage ? 'active' : ''}">
            ${link.label}
          </a>
        </li>
      `).join('')}
    </ul>
  `;
  return nav;
}

export function mountNavigation(activePage) {
  const container = document.getElementById('nav-container');
  if (container) {
    container.appendChild(renderNavigation(activePage));
  }
}
