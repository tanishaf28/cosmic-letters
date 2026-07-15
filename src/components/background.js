export function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let particles = [];
  let width, height;
  let animationId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
  }

  function initStars() {
    const count = Math.floor((width * height) / 6000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.7
        ? `hsl(${Math.random() > 0.5 ? 220 : 320}, 80%, 80%)`
        : '#f0f4ff',
    }));

    particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const time = Date.now() * 0.001;

    stars.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase);
      const opacity = star.opacity * (0.6 + twinkle * 0.4);
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = opacity;
      ctx.fill();
    });

    particles.forEach(p => {
      p.x += p.speedX;
      p.y -= p.speedY;
      if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = '#4d9fff';
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  window.addEventListener('resize', resize);

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
  };
}

export function createCosmicBackground() {
  const bg = document.createElement('div');
  bg.className = 'cosmic-bg';
  bg.innerHTML = `
    <video class="cosmic-bg__video" autoplay muted loop playsinline poster="src/assets/nebula-poster.jpg">
      <source src="src/assets/nebula-bg-mobile.mp4" media="(max-width: 720px)" type="video/mp4">
      <source src="src/assets/nebula-bg.mp4" type="video/mp4">
    </video>
    <div class="cosmic-bg__vignette"></div>
    <canvas id="starfield-canvas"></canvas>
  `;
  document.body.prepend(bg);

  const credit = document.createElement('a');
  credit.className = 'bg-credit';
  credit.href = 'https://www.magnific.com/free-video/deep-space-nebula_3704188';
  credit.target = '_blank';
  credit.rel = 'noopener noreferrer';
  credit.textContent = 'Background video by Freepik';
  document.body.appendChild(credit);
}
