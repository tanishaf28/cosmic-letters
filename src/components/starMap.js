import { CATEGORIES } from '../database/constants.js';
import { openMessageModal } from './modal.js';

export function initStarMap(canvasId = 'star-map-canvas', messages = []) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let hoveredStar = null;
  let animationId;

  const categoryColors = {
    secret: '#a0a0d0',
    hope: '#5aa2ff',
    dream: '#9370f0',
    confession: '#ff7fbd',
    random: '#f2c94c',
  };

  // Faint dust particles drifting behind the stars, distinct from the twinkling starfield layer
  const dust = Array.from({ length: 40 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.2 + 0.3,
    speed: Math.random() * 0.00006 + 0.00002,
    drift: Math.random() * Math.PI * 2,
  }));

  // Mouse-driven parallax, eased toward target each frame
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

  // Nearest-neighbor constellation links, computed once per star set
  let links = [];
  function computeLinks() {
    links = [];
    const maxDist = 0.16; // fraction of min(width, height)
    for (let i = 0; i < messages.length; i++) {
      let nearest = null;
      let nearestDist = Infinity;
      for (let j = 0; j < messages.length; j++) {
        if (i === j) continue;
        const dx = messages[i].star_x - messages[j].star_x;
        const dy = messages[i].star_y - messages[j].star_y;
        const dist = Math.hypot(dx, dy);
        if (dist < nearestDist) { nearestDist = dist; nearest = j; }
      }
      if (nearest !== null && nearestDist < maxDist) {
        const key = i < nearest ? `${i}-${nearest}` : `${nearest}-${i}`;
        if (!links.some(l => l.key === key)) {
          links.push({ key, a: i, b: nearest });
        }
      }
    }
  }

  // Occasional shooting star for a living-sky feel
  let shootingStar = null;
  function maybeSpawnShootingStar() {
    if (shootingStar || Math.random() > 0.004) return;
    const fromLeft = Math.random() > 0.5;
    const startX = fromLeft ? -0.05 : 1.05;
    const startY = Math.random() * 0.4;
    const angle = fromLeft ? Math.PI / 7 : Math.PI - Math.PI / 7;
    shootingStar = {
      x: startX, y: startY,
      vx: Math.cos(angle) * 0.014, vy: Math.sin(angle) * 0.014 + 0.006,
      life: 1,
    };
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function starRadius(msg) {
    const likes = msg.likes || 0;
    return 1.8 + Math.min(likes, 60) / 60 * 2.2;
  }

  function drawSparkle(x, y, radius, color, intensity) {
    const glowR = radius * 6;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    gradient.addColorStop(0, color + Math.round(intensity * 130).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    if (radius > 3) {
      const spikeLen = radius * 3.2;
      ctx.strokeStyle = color;
      ctx.globalAlpha = intensity * 0.5;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - spikeLen, y); ctx.lineTo(x + spikeLen, y);
      ctx.moveTo(x, y - spikeLen); ctx.lineTo(x, y + spikeLen);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = intensity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    parallax.x += (parallax.tx - parallax.x) * 0.04;
    parallax.y += (parallax.ty - parallax.y) * 0.04;

    const time = Date.now() * 0.001;

    ctx.save();
    ctx.translate(parallax.x, parallax.y);

    // Drifting dust
    dust.forEach(d => {
      const x = ((d.x + Math.sin(time * d.speed * 200 + d.drift) * 0.02) % 1) * width;
      const y = ((d.y + time * d.speed) % 1) * height;
      ctx.beginPath();
      ctx.arc(x, y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 242, 255, 0.25)';
      ctx.fill();
    });

    // Constellation links
    ctx.strokeStyle = 'rgba(244, 242, 255, 0.08)';
    ctx.lineWidth = 1;
    links.forEach(({ a, b }) => {
      ctx.beginPath();
      ctx.moveTo(messages[a].star_x * width, messages[a].star_y * height);
      ctx.lineTo(messages[b].star_x * width, messages[b].star_y * height);
      ctx.stroke();
    });

    // Stars
    messages.forEach((msg, i) => {
      const x = msg.star_x * width;
      const y = msg.star_y * height;
      const color = categoryColors[msg.category] || '#f4f2ff';
      const isHovered = hoveredStar === i;
      const pulse = Math.sin(time * 1.6 + i) * 0.25 + 0.75;
      const baseRadius = starRadius(msg);
      const radius = isHovered ? baseRadius + 2.5 : baseRadius;
      const intensity = isHovered ? 1 : 0.65 + pulse * 0.35;

      drawSparkle(x, y, radius, color, intensity);

      if (isHovered) {
        const cat = CATEGORIES[msg.category] || CATEGORIES.random;
        ctx.font = '500 12px Outfit, sans-serif';
        ctx.fillStyle = '#f4f2ff';
        ctx.textAlign = 'center';
        ctx.fillText(`${cat.emoji} Star #${msg.id.slice(-4).toUpperCase()}`, x, y - baseRadius * 6 - 8);
      }
    });

    // Shooting star
    maybeSpawnShootingStar();
    if (shootingStar) {
      const s = shootingStar;
      s.x += s.vx; s.y += s.vy; s.life -= 0.018;
      const x = s.x * width, y = s.y * height;
      const tailX = x - s.vx * width * 6, tailY = y - s.vy * height * 6;
      const grad = ctx.createLinearGradient(x, y, tailX, tailY);
      grad.addColorStop(0, `rgba(244, 242, 255, ${Math.max(s.life, 0)})`);
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      if (s.life <= 0 || s.x > 1.1 || s.x < -0.1 || s.y > 1.1) shootingStar = null;
    }

    ctx.restore();

    animationId = requestAnimationFrame(draw);
  }

  function getStarAt(mx, my) {
    for (let i = messages.length - 1; i >= 0; i--) {
      const x = messages[i].star_x * width + parallax.x;
      const y = messages[i].star_y * height + parallax.y;
      const dist = Math.hypot(mx - x, my - y);
      if (dist < 14) return i;
    }
    return null;
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const star = getStarAt(mx, my);
    hoveredStar = star;
    canvas.style.cursor = star !== null ? 'pointer' : 'crosshair';

    parallax.tx = ((mx / width) - 0.5) * -16;
    parallax.ty = ((my / height) - 0.5) * -16;
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const star = getStarAt(mx, my);
    if (star !== null) openMessageModal(messages[star]);
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredStar = null;
    canvas.style.cursor = 'crosshair';
    parallax.tx = 0;
    parallax.ty = 0;
  });

  resize();
  computeLinks();
  draw();
  window.addEventListener('resize', resize);

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
  };
}
