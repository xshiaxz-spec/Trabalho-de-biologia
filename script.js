

'use strict';

/* ─── LOADING SCREEN ──────────────────────────────────── */
(function initLoading() {
  const fill = document.getElementById('loading-fill');
  const pct = document.getElementById('loading-percent');
  const screen = document.getElementById('loading-screen');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 3;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => { screen.classList.add('hidden'); initAll(); }, 400);
    }
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 80);
})();

/* ─── MAIN INIT ───────────────────────────────────────── */
function initAll() {
  initNavbar();
  initStars();
  initParticles();
  initExploreBtn();
  initGreenhouseCanvas();
  initSmokeCanvas();
  initScrollObservers();
  initTempSlider();
  initCounters();
  initCarousel3D();
  initCarouselBgCanvas();
  initCharts();
  initLeavesCanvas();
  initFinalCanvas();
  initInteractiveMap();
  initRestartBtn();
  initNavToggle();
  initFlipCarousel();
  initVoting();
}

/* ─── NAVBAR ──────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
  // Smooth scroll nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      document.getElementById('nav-links').classList.remove('open');
    });
  });
}

function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

/* ─── STARS CANVAS ────────────────────────────────────── */
function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.2,
      a: Math.random(), da: (Math.random() - 0.5) * 0.01,
      speed: Math.random() * 0.2 + 0.05
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      s.y -= s.speed;
      if (s.y < 0) { s.y = H; s.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 230, 255, ${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ─── FLOATING PARTICLES ──────────────────────────────── */
function initParticles() {
  const container = document.getElementById('intro-particles');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 1}px;
      height: ${Math.random() * 4 + 1}px;
      background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.1});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float-particle ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * 5}s infinite alternate;
      box-shadow: 0 0 6px rgba(0,212,255,0.4);
    `;
    container.appendChild(p);
  }

  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float-particle {
      0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
      100% { transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 60 + 20}px, -${Math.random() * 80 + 30}px) scale(1.5); opacity: 0.8; }
    }
  `;
  document.head.appendChild(style);
}

/* ─── EXPLORE BUTTON ──────────────────────────────────── */
function initExploreBtn() {
  document.getElementById('explore-btn').addEventListener('click', () => {
    document.getElementById('what').scrollIntoView({ behavior: 'smooth' });
  });
}

/* ─── GREENHOUSE ANIMATION CANVAS ─────────────────────── */
function initGreenhouseCanvas() {
  const canvas = document.getElementById('greenhouse-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, rays = [], gasParticles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initElements();
  }

  function initElements() {
    rays = Array.from({ length: 12 }, (_, i) => ({
      angle: -Math.PI / 2 + (i - 6) * 0.18,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.002,
      type: i < 8 ? 'solar' : 'ir', // solar or infrared
      reflected: false, bounceY: 0.4 + Math.random() * 0.2
    }));
    gasParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: H * 0.2 + Math.random() * H * 0.3,
      r: Math.random() * 5 + 2, vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      color: ['rgba(0,212,255,0.3)', 'rgba(150,255,100,0.25)', 'rgba(255,200,50,0.2)'][Math.floor(Math.random() * 3)]
    }));
  }

  function drawScene() {
    ctx.clearRect(0, 0, W, H);

    // Atmosphere layer
    const atmoGrad = ctx.createLinearGradient(0, 0, 0, H);
    atmoGrad.addColorStop(0, 'rgba(0, 10, 30, 0.0)');
    atmoGrad.addColorStop(0.3, 'rgba(0, 100, 200, 0.06)');
    atmoGrad.addColorStop(0.5, 'rgba(0, 200, 255, 0.04)');
    atmoGrad.addColorStop(0.7, 'rgba(20, 100, 50, 0.05)');
    atmoGrad.addColorStop(1, 'rgba(0, 20, 50, 0.0)');
    ctx.fillStyle = atmoGrad;
    ctx.fillRect(0, 0, W, H);

    // Sun
    const sunX = W * 0.5, sunY = H * 0.08;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 60);
    sunGrad.addColorStop(0, 'rgba(255,240,150,0.9)');
    sunGrad.addColorStop(0.5, 'rgba(255,200,50,0.4)');
    sunGrad.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,230,100,0.9)'; ctx.fill();
    ctx.beginPath(); ctx.arc(sunX, sunY, 60, 0, Math.PI * 2);
    ctx.fillStyle = sunGrad; ctx.fill();

    // Earth surface bar
    const earthY = H * 0.82;
    const earthGrad = ctx.createLinearGradient(0, earthY, 0, H);
    earthGrad.addColorStop(0, '#1a4a20');
    earthGrad.addColorStop(1, '#0d2a10');
    ctx.fillStyle = earthGrad;
    ctx.fillRect(0, earthY, W, H - earthY);

    // Gas layer indicator
    ctx.beginPath();
    ctx.moveTo(0, H * 0.25); ctx.lineTo(W, H * 0.25);
    ctx.strokeStyle = 'rgba(0,212,255,0.1)'; ctx.lineWidth = 1;
    ctx.setLineDash([5, 10]); ctx.stroke(); ctx.setLineDash([]);

    // Gas particles
    gasParticles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < H * 0.15 || p.y > H * 0.55) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color; ctx.fill();
    });

    // Rays
    rays.forEach(ray => {
      ray.progress += ray.speed;
      if (ray.progress > 1) {
        ray.progress = 0;
        ray.reflected = false;
      }

      const startX = sunX, startY = sunY;
      const endX = startX + Math.cos(ray.angle) * W * 0.4;
      const earthHitY = earthY;

      const midX = startX + Math.cos(ray.angle) * W * 0.4 * Math.min(ray.progress * 2, 1);
      const midY = startY + (earthHitY - startY) * Math.min(ray.progress * 2, 1);

      if (ray.type === 'solar') {
        const grad = ctx.createLinearGradient(startX, startY, midX, midY);
        grad.addColorStop(0, 'rgba(255,240,100,0)');
        grad.addColorStop(0.5, 'rgba(255,240,100,0.6)');
        grad.addColorStop(1, 'rgba(255,240,100,0)');
        ctx.beginPath(); ctx.moveTo(startX, startY); ctx.lineTo(midX, midY);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
      } else {
        // IR rays — bounce off gas layer
        const gasLayerY = H * 0.35;
        if (ray.progress < 0.5) {
          const p = ray.progress * 2;
          const ry = earthY - (earthY - gasLayerY) * p;
          const rx = endX + (startX - endX) * p * 0.3;
          const grad = ctx.createLinearGradient(endX, earthY, rx, ry);
          grad.addColorStop(0, 'rgba(255,80,0,0)');
          grad.addColorStop(0.5, 'rgba(255,80,0,0.5)');
          grad.addColorStop(1, 'rgba(255,80,0,0)');
          ctx.beginPath(); ctx.moveTo(endX, earthY); ctx.lineTo(rx, ry);
          ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
        } else {
          const p = (ray.progress - 0.5) * 2;
          const ry = gasLayerY + (H * 0.1) * p;
          ctx.beginPath(); ctx.moveTo(endX + 30, gasLayerY); ctx.lineTo(endX + 30 + 40 * p, ry);
          ctx.strokeStyle = `rgba(255,80,0,${0.5 - p * 0.4})`; ctx.lineWidth = 1.5; ctx.stroke();
        }
      }
    });

    // Labels
    ctx.fillStyle = 'rgba(0,212,255,0.6)'; ctx.font = '11px Space Mono';
    ctx.fillText('CAMADA DE GASES', W * 0.05, H * 0.23);
    ctx.fillStyle = 'rgba(255,180,50,0.7)';
    ctx.fillText('☀ RADIAÇÃO SOLAR', W * 0.05, H * 0.1);
    ctx.fillStyle = 'rgba(255,80,0,0.7)';
    ctx.fillText('🌡 INFRAVERMELHO RETIDO', W * 0.05, H * 0.55);

    requestAnimationFrame(drawScene);
  }

  resize();
  window.addEventListener('resize', resize);
  drawScene();
}

/* ─── SMOKE CANVAS ────────────────────────────────────── */
function initSmokeCanvas() {
  const canvas = document.getElementById('smoke-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class SmokeParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = H + 10;
      this.vy = -(Math.random() * 1.5 + 0.5);
      this.vx = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 30 + 10;
      this.alpha = Math.random() * 0.15 + 0.05;
      this.growth = Math.random() * 0.2 + 0.05;
      this.color = Math.random() > 0.6 ? '255,60,0' : '80,80,80';
    }
    update() {
      this.y += this.vy; this.x += this.vx;
      this.r += this.growth; this.alpha -= 0.0008;
      if (this.y < -this.r || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`; ctx.fill();
    }
  }

  for (let i = 0; i < 60; i++) {
    const p = new SmokeParticle();
    p.y = Math.random() * H; // Pre-distribute
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();
}

/* ─── SCROLL OBSERVERS ────────────────────────────────── */
function initScrollObservers() {
  const fadeEls = document.querySelectorAll('.human-card, .bio-card, .sol-card, .local-card, .quote-line');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), parseInt(delay));
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  fadeEls.forEach(el => observer.observe(el));
}

/* ─── TEMP SLIDER ─────────────────────────────────────── */
function initTempSlider() {
  const slider = document.getElementById('temp-slider');
  const display = document.getElementById('slider-temp');
  const warmOverlay = document.getElementById('warm-overlay');
  const rightCaption = document.getElementById('planet-right-caption');
  if (!slider) return;

  slider.addEventListener('input', () => {
    const v = parseInt(slider.value);
    // Map 0-100 → −18°C to +4°C
    const temp = -18 + (v / 100) * 22;
    const rounded = temp.toFixed(1);
    const sign = temp >= 0 ? '+' : '';
    display.textContent = sign + rounded + '°C';

    // Color shift display
    const heatLevel = Math.max(0, (temp - 0) / 4); // 0 at 0°C, 1 at 4°C
    const coldLevel = Math.max(0, (-temp) / 18); // 1 at −18°C
    display.style.color = temp < 0 ? '#88ccff' : temp < 15 ? '#00d4ff' : temp < 20 ? '#ffd700' : '#ff4500';

    warmOverlay.style.background = `rgba(${Math.floor(255 * heatLevel)}, ${Math.floor(100 * (1 - heatLevel))}, 0, ${heatLevel * 0.5})`;

    if (temp < 0) {
      rightCaption.textContent = '❄️ Planeta Congelado';
    } else if (temp <= 16) {
      rightCaption.textContent = '✅ Planeta Habitável';
    } else if (temp <= 20) {
      rightCaption.textContent = '⚠️ Aquecimento Perigoso';
    } else {
      rightCaption.textContent = '🔥 Planeta em Crise';
    }

    // Update explanation panel
    updateTempExplanation(temp);
  });

  // Init explanation with default value
  updateTempExplanation(-18 + (45 / 100) * 22);
}

/* ─── ANIMATED COUNTERS ───────────────────────────────── */
function initCounters() {
  const tempEl = document.getElementById('temp-counter');
  const co2El = document.getElementById('co2-counter');
  const deforestEl = document.getElementById('deforest-counter');

  let started = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      animateTemp();
      animateCO2();
      animateDeforest();
    }
  }, { threshold: 0.3 });

  const section = document.getElementById('human');
  if (section) observer.observe(section);

  function animateTemp() {
    let v = 0; const target = 1.2; const dur = 2000;
    const start = Date.now();
    (function step() {
      const t = Math.min(1, (Date.now() - start) / dur);
      v = target * easeOut(t);
      tempEl.textContent = '+' + v.toFixed(2) + '°C';
      if (t < 1) requestAnimationFrame(step);
    })();
  }

  function animateCO2() {
    let v = 280; const target = 421; const dur = 2500;
    const start = Date.now();
    (function step() {
      const t = Math.min(1, (Date.now() - start) / dur);
      v = 280 + (target - 280) * easeOut(t);
      co2El.textContent = Math.floor(v) + 'ppm';
      if (t < 1) requestAnimationFrame(step);
    })();
  }

  function animateDeforest() {
    let v = 0; const target = 27000; const dur = 3000; // hectares lost per hour estimated
    const start = Date.now();
    (function step() {
      const t = Math.min(1, (Date.now() - start) / dur);
      v = target * easeOut(t);
      deforestEl.textContent = Math.floor(v).toLocaleString('pt-BR') + ' ha';
      if (t < 1) requestAnimationFrame(step);
    })();
  }

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
}

/* ─── 3D CAROUSEL ─────────────────────────────────────── */
function initCarousel3D() {
  const scene    = document.getElementById('carousel-scene');
  const cards    = document.querySelectorAll('.card-3d');
  const dots     = document.querySelectorAll('.c-dot');
  const prevBtn  = document.getElementById('carousel-prev');
  const nextBtn  = document.getElementById('carousel-next');
  const modal    = document.getElementById('card-expand-modal');
  const modalInner   = document.getElementById('modal-inner');
  const modalBox     = document.getElementById('modal-box');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose   = document.getElementById('modal-close-btn');
  if (!scene || cards.length === 0) return;

  const total = cards.length;
  let current = 0;
  let autoInterval;
  let isDragging = false;
  let dragStartX = 0;
  let isHovered = false;
  let isOpen = false;

  function getRadius() {
    const vw = window.innerWidth;
    if (vw < 600) return 280;
    if (vw < 900) return 340;
    return 420;
  }

  function positionCards() {
    const radius = getRadius();
    cards.forEach((card, i) => {
      const offset = i - current;
      const normalizedOffset = ((offset % total) + total) % total;
      const angle = (normalizedOffset / total) * 360;
      const rad = (angle * Math.PI) / 180;
      const x = Math.sin(rad) * radius;
      const z = Math.cos(rad) * radius - radius;
      const scale = 0.65 + 0.35 * Math.cos(rad);
      const opacity = 0.3 + 0.7 * ((Math.cos(rad) + 1) / 2);
      const isActive = normalizedOffset === 0;

      card.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = isActive ? 10 : Math.floor(scale * 5);
      card.style.pointerEvents = isActive ? 'auto' : 'none';
      card.classList.toggle('active-card', isActive);
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  /* ── MODAL OPEN/CLOSE ── */
  function openModal(card) {
    if (isOpen) return;
    isOpen = true;

    // Grab the back-face content and clone it into the modal
    const backFace = card.querySelector('.card-back');
    const accent   = backFace.style.getPropertyValue('--back-accent') || '#00d4ff';
    const backInner = card.querySelector('.card-back-inner');

    // Clone content (without the old close btn — modal has its own)
    const clone = backInner.cloneNode(true);
    const oldBtn = clone.querySelector('.card-close-btn');
    if (oldBtn) oldBtn.remove();

    modalBox.style.setProperty('--modal-accent', accent);
    modalBox.style.borderColor = accent + '55';
    modalInner.innerHTML = '';
    modalInner.appendChild(clone);

    modal.classList.add('active');
    clearInterval(autoInterval);
  }

  function closeModal() {
    if (!isOpen) return;
    isOpen = false;
    modal.classList.remove('active');
    startAuto();
  }

  modalOverlay.addEventListener('click', closeModal);
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── CARD CLICK ── */
  cards.forEach(card => {
    card.addEventListener('click', e => {
      if (isOpen) return;
      if (!card.classList.contains('active-card')) return;
      if (e.target.closest('.card-close-btn')) return;
      openModal(card);
    });
  });

  function goTo(index) {
    if (isOpen) return;
    current = ((index % total) + total) % total;
    positionCards();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
  nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

  const wrapper = document.getElementById('carousel-wrapper');
  wrapper.addEventListener('mousedown', e => { isDragging = true; dragStartX = e.clientX; });
  wrapper.addEventListener('mousemove', e => { if (isDragging) e.preventDefault(); });
  wrapper.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 40) { diff < 0 ? next() : prev(); resetAuto(); }
  });
  wrapper.addEventListener('touchstart', e => { dragStartX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend', e => {
    const diff = e.changedTouches[0].clientX - dragStartX;
    if (Math.abs(diff) > 40) { diff < 0 ? next() : prev(); resetAuto(); }
  });

  wrapper.addEventListener('mouseenter', () => { isHovered = true; clearInterval(autoInterval); });
  wrapper.addEventListener('mouseleave', () => { isHovered = false; startAuto(); });

  function startAuto() {
    autoInterval = setInterval(() => { if (!isHovered && !isOpen) next(); }, 3500);
  }
  function resetAuto() { clearInterval(autoInterval); startAuto(); }

  document.addEventListener('keydown', e => {
    if (isOpen) return;
    const section = document.getElementById('carousel');
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') { next(); resetAuto(); }
      if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    }
  });

  window.addEventListener('resize', positionCards);
  positionCards();
  startAuto();
}

/* ─── CAROUSEL BG CANVAS ──────────────────────────────── */
function initCarouselBgCanvas() {
  const canvas = document.getElementById('carousel-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, gridLines = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildGrid();
  }

  function buildGrid() {
    gridLines = [];
    const spacing = 60;
    for (let x = 0; x < W; x += spacing) gridLines.push({ x1: x, y1: 0, x2: x, y2: H, type: 'v' });
    for (let y = 0; y < H; y += spacing) gridLines.push({ x1: 0, y1: y, x2: W, y2: y, type: 'h' });
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.005;

    // Grid
    gridLines.forEach(l => {
      ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2);
      ctx.strokeStyle = 'rgba(0,212,255,0.04)'; ctx.lineWidth = 1; ctx.stroke();
    });

    // Animated node highlights
    for (let i = 0; i < 5; i++) {
      const nx = (Math.sin(t + i * 1.3) * 0.4 + 0.5) * W;
      const ny = (Math.cos(t * 0.7 + i * 0.9) * 0.4 + 0.5) * H;
      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, 120);
      grad.addColorStop(0, 'rgba(0,212,255,0.06)');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(nx, ny, 120, 0, Math.PI * 2);
      ctx.fillStyle = grad; ctx.fill();
    }

    // Scan lines
    const scanY = ((t * 50) % H);
    const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
    scanGrad.addColorStop(0, 'transparent');
    scanGrad.addColorStop(0.5, 'rgba(0,212,255,0.04)');
    scanGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 40, W, 80);

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ─── CHARTS ──────────────────────────────────────────── */
function initCharts() {
  // Common chart options
  const commonOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(5,10,20,0.9)',
        borderColor: 'rgba(0,212,255,0.3)', borderWidth: 1,
        titleColor: '#00d4ff', bodyColor: '#e8edf5',
        padding: 12, cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#7a8ba0', font: { family: 'Space Mono', size: 9 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#7a8ba0', font: { family: 'Space Mono', size: 9 } }
      }
    },
    animation: { duration: 1500, easing: 'easeInOutCubic' }
  };

  // Observer to trigger on scroll
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      buildCharts();
      observer.disconnect();
    }
  }, { threshold: 0.2 });
  const section = document.getElementById('data');
  if (section) observer.observe(section);

  function buildCharts() {
    // Temperature Chart
    const tempCtx = document.getElementById('tempChart');
    if (tempCtx) {
      new Chart(tempCtx, {
        type: 'line',
        data: {
          labels: ['1850','1870','1890','1910','1930','1950','1970','1990','2000','2010','2020','2023'],
          datasets: [{
            data: [-0.3,-0.25,-0.2,-0.28,-0.1,0.0,0.1,0.35,0.5,0.72,1.0,1.45],
            borderColor: '#ff4444', backgroundColor: 'rgba(255,68,68,0.1)',
            fill: true, tension: 0.4, pointBackgroundColor: '#ff4444',
            pointRadius: 3, pointHoverRadius: 6,
            borderWidth: 2
          }]
        },
        options: { ...commonOptions }
      });
    }

    // CO2 Chart
    const co2Ctx = document.getElementById('co2Chart');
    if (co2Ctx) {
      new Chart(co2Ctx, {
        type: 'line',
        data: {
          labels: ['1800','1850','1900','1950','1970','1990','2000','2010','2020','2023'],
          datasets: [{
            data: [280,284,296,311,325,354,369,388,413,421],
            borderColor: '#00d4ff', backgroundColor: 'rgba(0,212,255,0.08)',
            fill: true, tension: 0.4, pointBackgroundColor: '#00d4ff',
            pointRadius: 3, pointHoverRadius: 6,
            borderWidth: 2
          }]
        },
        options: { ...commonOptions }
      });
    }

    // Ice Chart (declining)
    const iceCtx = document.getElementById('iceChart');
    if (iceCtx) {
      new Chart(iceCtx, {
        type: 'bar',
        data: {
          labels: ['1980','1985','1990','1995','2000','2005','2010','2015','2020','2023'],
          datasets: [{
            data: [7.5,7.2,6.9,6.5,6.3,5.8,4.9,4.6,3.9,4.1],
            backgroundColor: 'rgba(100,200,255,0.3)',
            borderColor: '#64c8ff', borderWidth: 1, borderRadius: 4
          }]
        },
        options: { ...commonOptions }
      });
    }

    // Sea Level Chart
    const seaCtx = document.getElementById('seaChart');
    if (seaCtx) {
      new Chart(seaCtx, {
        type: 'line',
        data: {
          labels: ['1993','1996','1999','2002','2005','2008','2011','2014','2017','2020','2023'],
          datasets: [{
            data: [0,15,27,38,50,63,78,95,112,140,165],
            borderColor: '#00ff88', backgroundColor: 'rgba(0,255,136,0.08)',
            fill: true, tension: 0.4, pointBackgroundColor: '#00ff88',
            pointRadius: 3, borderWidth: 2
          }]
        },
        options: { ...commonOptions }
      });
    }
  }
}

/* ─── LEAVES CANVAS ───────────────────────────────────── */
function initLeavesCanvas() {
  const canvas = document.getElementById('leaves-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  const leaves = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Leaf {
    constructor() { this.reset(); this.y = Math.random() * H; }
    reset() {
      this.x = Math.random() * W;
      this.y = -20;
      this.vy = Math.random() * 1.5 + 0.5;
      this.vx = Math.sin(Date.now() * 0.001 + Math.random()) * 0.5;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      this.size = Math.random() * 8 + 5;
      this.alpha = Math.random() * 0.4 + 0.2;
      this.color = `rgba(${Math.floor(Math.random() * 50)}, ${Math.floor(150 + Math.random() * 105)}, ${Math.floor(Math.random() * 50)}, ${this.alpha})`;
    }
    update() {
      this.x += this.vx + Math.sin(Date.now() * 0.001 + this.y * 0.01) * 0.3;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      if (this.y > H + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.4, this.size, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color; ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 40; i++) leaves.push(new Leaf());

  // Only animate when section is visible
  let visible = false;
  const obs = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: 0.1 });
  const section = document.getElementById('solutions');
  if (section) obs.observe(section);

  function animate() {
    if (visible) {
      ctx.clearRect(0, 0, W, H);
      leaves.forEach(l => { l.update(); l.draw(); });
    }
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();
}

/* ─── FINAL CANVAS ────────────────────────────────────── */
function initFinalCanvas() {
  const canvas = document.getElementById('final-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class FinalParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      const type = Math.random();
      if (type < 0.5) this.color = [0, 255, 136]; // green
      else if (type < 0.8) this.color = [0, 212, 255]; // cyan
      else this.color = [255, 255, 255]; // white
      this.alpha = Math.random() * 0.5 + 0.1;
      this.da = (Math.random() - 0.5) * 0.005;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.alpha += this.da;
      if (this.alpha < 0.05 || this.alpha > 0.6) this.da *= -1;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color.join(',')},${this.alpha})`; ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new FinalParticle());

  // Large globe
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.003;

    // Background glow
    const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.5);
    bg.addColorStop(0, 'rgba(0,60,30,0.15)');
    bg.addColorStop(0.5, 'rgba(0,30,60,0.1)');
    bg.addColorStop(1, 'transparent');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Orbiting rings
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(W / 2, H / 2, 200 + i * 60, 80 + i * 20, t + i * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, ${100 + i * 50}, ${150 + i * 30}, 0.15)`;
      ctx.lineWidth = 1; ctx.stroke();
    }

    // Globe
    const globeGrad = ctx.createRadialGradient(W / 2 - 30, H / 2 - 30, 0, W / 2, H / 2, 80);
    globeGrad.addColorStop(0, 'rgba(30,150,80,0.5)');
    globeGrad.addColorStop(0.5, 'rgba(10,80,180,0.4)');
    globeGrad.addColorStop(1, 'rgba(0,30,80,0.2)');
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 80, 0, Math.PI * 2);
    ctx.fillStyle = globeGrad; ctx.fill();
    ctx.strokeStyle = 'rgba(0,255,136,0.4)'; ctx.lineWidth = 1; ctx.stroke();

    // Atmosphere glow
    const atmo = ctx.createRadialGradient(W / 2, H / 2, 70, W / 2, H / 2, 120);
    atmo.addColorStop(0, 'transparent');
    atmo.addColorStop(0.7, 'rgba(0,212,255,0.04)');
    atmo.addColorStop(1, 'rgba(0,212,255,0.15)');
    ctx.beginPath(); ctx.arc(W / 2, H / 2, 120, 0, Math.PI * 2);
    ctx.fillStyle = atmo; ctx.fill();

    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ─── MAPA INTERATIVO — CIDADES ───────────────────────── */
const CITY_DATA = {
  quissama: {
    name: 'Quissamã',
    icon: '📍',
    region: 'Norte Fluminense · RJ · Nossa cidade',
    stats: [
      { val: '+2°C',    lbl: 'Projeção até 2100' },
      { val: '54 mil',  lbl: 'Habitantes' },
      { val: '720 km²', lbl: 'Área total' },
      { val: '100%',    lbl: 'Litoral em risco' },
    ],
    impacts: [
      { icon: '🌊', text: 'Erosão costeira acelerada ameaça a orla e comunidades pesqueiras.' },
      { icon: '🏝️', text: 'P.N. Restinga de Jurubatiba sofre com secas prolongadas e invasão de espécies.' },
      { icon: '🐠', text: 'Lagoas costeiras com salinização crescente, comprometendo peixes nativos.' },
      { icon: '🌡️', text: 'Ondas de calor mais frequentes afetam saúde e agricultura local.' },
    ],
    eco: [
      { icon: '🏝️', text: 'P.N. Restinga de Jurubatiba — único parque nacional de restinga do Brasil.' },
      { icon: '💧', text: 'Lagoas costeiras: Lagoa de Quissamã, Lagoa Comprida e outras 8 lagoas interligadas.' },
      { icon: '🌿', text: 'Restinga: vegetação adaptada à areia e salinidade, habitat exclusivo.' },
      { icon: '🐦', text: 'Mais de 200 espécies de aves registradas — área de importância para migratórias.' },
    ],
    actions: [
      { icon: '♻️', text: 'Separe resíduos e apoie a coleta seletiva no município.' },
      { icon: '🌱', text: 'Replante espécies nativas de restinga em áreas degradadas.' },
      { icon: '📣', text: 'Denuncie desmatamento e pesca irregular nas lagoas ao IBAMA.' },
      { icon: '🚶', text: 'Reduza o uso de carro para deslocamentos curtos na cidade.' },
    ],
    ods: ['ODS 13', 'ODS 14', 'ODS 15', 'ODS 6'],
    color: '#00d4ff',
  },
  carapebus: {
    name: 'Carapebus',
    icon: '🌿',
    region: 'Norte Fluminense · RJ',
    stats: [
      { val: '+1.8°C',   lbl: 'Projeção até 2100' },
      { val: '15 mil',   lbl: 'Habitantes' },
      { val: '308 km²',  lbl: 'Área total' },
      { val: '2 lagoas', lbl: 'Ecossistemas em risco' },
    ],
    impacts: [
      { icon: '🏝️', text: 'Abriga parte do P.N. Restinga de Jurubatiba, com ecossistemas únicos.' },
      { icon: '💧', text: 'Lagoa de Carapebus e Lagoa Comprida sofrem avanço de salinidade.' },
      { icon: '🌾', text: 'Agricultura familiar impactada por chuvas irregulares e secas.' },
      { icon: '🐦', text: 'Aves migratórias perdem habitat com a degradação das lagoas.' },
    ],
    eco: [
      { icon: '💧', text: 'Lagoa de Carapebus e Lagoa Comprida: ecossistemas de água doce ameaçados.' },
      { icon: '🌿', text: 'Faz parte do corredor ecológico do P.N. Restinga de Jurubatiba.' },
      { icon: '🐸', text: 'Grande diversidade de anfíbios e répteis nas áreas úmidas.' },
      { icon: '🌾', text: 'Zona de amortecimento do parque: agricultura e conservação coexistindo.' },
    ],
    actions: [
      { icon: '🌱', text: 'Apoie programas de educação ambiental nas escolas da cidade.' },
      { icon: '💧', text: 'Use água com responsabilidade — as lagoas dependem do equilíbrio hídrico.' },
      { icon: '🚫', text: 'Evite descartar lixo nas margens das lagoas.' },
      { icon: '🤝', text: 'Participe de mutirões de limpeza e reflorestamento local.' },
    ],
    ods: ['ODS 15', 'ODS 14', 'ODS 2', 'ODS 6'],
    color: '#00ff88',
  },
  campos: {
    name: 'Campos dos Goytacazes',
    icon: '🏙️',
    region: 'Norte Fluminense · RJ · Maior cidade da região',
    stats: [
      { val: '+2.2°C',     lbl: 'Projeção até 2100' },
      { val: '507 mil',    lbl: 'Habitantes' },
      { val: '4.027 km²',  lbl: 'Área total' },
      { val: 'Rio Paraíba', lbl: 'Recurso hídrico em risco' },
    ],
    impacts: [
      { icon: '🌊', text: 'Rio Paraíba do Sul com volume reduzido por secas e uso intensivo.' },
      { icon: '🌧️', text: 'Enchentes urbanas mais frequentes com chuvas concentradas.' },
      { icon: '🌡️', text: 'Ilha de calor urbana intensa — +4°C a +6°C em relação ao entorno rural.' },
      { icon: '🌾', text: 'Cana-de-açúcar e pecuária regionais ameaçadas por irregularidade hídrica.' },
    ],
    eco: [
      { icon: '🌊', text: 'Rio Paraíba do Sul: principal rio do norte fluminense, cada vez mais ameaçado.' },
      { icon: '🌳', text: 'Fragmentos de Mata Atlântica em processo acelerado de degradação.' },
      { icon: '🐊', text: 'Jacarés e capivaras habitam as várzeas do Paraíba, mas perdem espaço.' },
      { icon: '🌾', text: 'Maior polo sucroalcooleiro do estado — setor vulnerável à seca.' },
    ],
    actions: [
      { icon: '🚇', text: 'Priorize transporte coletivo na cidade para reduzir emissões.' },
      { icon: '💡', text: 'Invista em eficiência energética em residências e comércios.' },
      { icon: '🌳', text: 'Apoie a arborização urbana para combater o efeito ilha de calor.' },
      { icon: '📊', text: 'Cobre planos municipais de adaptação climática dos representantes eleitos.' },
    ],
    ods: ['ODS 11', 'ODS 13', 'ODS 6', 'ODS 3'],
    color: '#ff6b35',
  },
  macae: {
    name: 'Macaé',
    icon: '🛢️',
    region: 'Norte Fluminense · RJ · Polo do Petróleo',
    stats: [
      { val: '+1.9°C',  lbl: 'Projeção até 2100' },
      { val: '239 mil', lbl: 'Habitantes' },
      { val: '1.216 km²', lbl: 'Área total' },
      { val: '36 km',   lbl: 'Litoral ameaçado' },
    ],
    impacts: [
      { icon: '🌊', text: 'Costa com erosão acelerada; bairros litorâneos em risco de inundação.' },
      { icon: '🛢️', text: 'Polo do petróleo exposto a eventos climáticos extremos.' },
      { icon: '🌧️', text: 'Enchentes urbanas recorrentes em áreas de baixada.' },
      { icon: '🐠', text: 'Recifes costeiros e manguezais com branqueamento e degradação.' },
    ],
    eco: [
      { icon: '🌊', text: 'Manguezais do estuário do Rio Macaé: berçário de peixes e caranguejos.' },
      { icon: '🐠', text: 'Recifes artificiais e naturais ao largo da costa, ricos em biodiversidade.' },
      { icon: '🌿', text: 'Restinga da Barra de Macaé: fragmento costeiro ainda preservado.' },
      { icon: '🐢', text: 'Praias de desova de tartarugas marinhas monitoradas pelo Projeto Tamar.' },
    ],
    actions: [
      { icon: '🏭', text: 'Pressione pela transição da economia do petróleo para energias renováveis.' },
      { icon: '🐠', text: 'Apoie projetos de monitoramento de recifes e tartarugas marinhas.' },
      { icon: '🌊', text: 'Participe de limpezas de praia para reduzir plástico no oceano.' },
      { icon: '☀️', text: 'Instale painéis solares — Macaé tem alto índice de irradiação solar.' },
    ],
    ods: ['ODS 11', 'ODS 9', 'ODS 13', 'ODS 14'],
    color: '#ffd700',
  },
  rioostras: {
    name: 'Rio das Ostras',
    icon: '🦪',
    region: 'Norte Fluminense · RJ',
    stats: [
      { val: '+1.8°C',  lbl: 'Projeção até 2100' },
      { val: '130 mil', lbl: 'Habitantes' },
      { val: '228 km²', lbl: 'Área total' },
      { val: '22 km',   lbl: 'Litoral em risco' },
    ],
    impacts: [
      { icon: '🦪', text: 'Cultivo de ostras afetado pela acidificação e aquecimento do oceano.' },
      { icon: '🌊', text: 'Ressaca do mar mais intensa, atingindo avenidas e residências.' },
      { icon: '🏖️', text: 'Praias com perda de areia acelerada por erosão costeira.' },
      { icon: '🐟', text: 'Pesca artesanal em declínio com mudança nos cardumes.' },
    ],
    eco: [
      { icon: '🦪', text: 'Rio das Ostras: referência histórica na aquicultura de bivalves.' },
      { icon: '🌿', text: 'Lagoa de Imboacica: área de proteção ambiental com vegetação nativa.' },
      { icon: '🐟', text: 'Rio das Ostras e Rio Iriri: importantes para a pesca artesanal local.' },
      { icon: '🌊', text: 'Costa rochosa alternada com praias arenosas — alta diversidade de habitat.' },
    ],
    actions: [
      { icon: '🦪', text: 'Consuma mariscos cultivados localmente e de forma sustentável.' },
      { icon: '🏖️', text: 'Participe de campanhas contra construções irregulares na orla.' },
      { icon: '🚫', text: 'Evite plástico descartável — ele chega ao mar e afeta a vida marinha.' },
      { icon: '📸', text: 'Registre e denuncie casos de erosão e descarte irregular de resíduos.' },
    ],
    ods: ['ODS 14', 'ODS 2', 'ODS 13', 'ODS 11'],
    color: '#9b59b6',
  },
};

function initInteractiveMap() {
  const cities    = document.querySelectorAll('.map-city');
  const panel     = document.getElementById('city-info-panel');
  const idleEl    = document.getElementById('cip-idle');
  const contentEl = document.getElementById('cip-content');
  const closeBtn  = document.getElementById('cip-close');
  const mapHint   = document.getElementById('map-hint');
  if (!cities.length || !panel) return;

  const BASE_R = { 'large-dot': 8, 'medium-dot': 7, 'highlight-dot': 9, default: 6 };
  const SEL_R  = { 'large-dot': 12,'medium-dot': 11,'highlight-dot': 13, default: 10 };
  function getDotR(dot, table) {
    for (const cls of Object.keys(table)) if (dot.classList.contains(cls)) return table[cls];
    return table.default;
  }

  // Hover tooltip
  const hoverTip = document.createElement('div');
  hoverTip.style.cssText = `position:fixed;display:none;pointer-events:none;z-index:700;
    background:rgba(3,8,20,0.97);border:1px solid rgba(255,215,0,0.45);
    border-radius:8px;padding:6px 14px;font-family:'Space Mono',monospace;
    font-size:0.65rem;color:#ffd700;letter-spacing:0.06em;
    box-shadow:0 4px 20px rgba(0,0,0,0.6);white-space:nowrap;
    backdrop-filter:blur(10px);transform:translate(-50%,-140%);`;
  document.body.appendChild(hoverTip);

  // Tab switching
  const tabBtns   = document.querySelectorAll('.cip-tab');
  const tabPanels = document.querySelectorAll('.cip-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(`cip-panel-${btn.dataset.tab}`);
      if (target) target.classList.add('active');
    });
  });

  function renderList(items, cls, iconCls) {
    return items.map(i =>
      `<div class="${cls}"><span class="${iconCls}">${i.icon}</span><span>${i.text}</span></div>`
    ).join('');
  }

  function showCity(key) {
    const d = CITY_DATA[key];
    if (!d) return;

    // Reset dots
    cities.forEach(c => {
      c.classList.remove('selected');
      const dot = c.querySelector('.city-dot, .highlight-dot');
      if (dot) dot.setAttribute('r', getDotR(dot, BASE_R));
    });
    const sel = document.querySelector(`.map-city[data-city="${key}"]`);
    if (sel) {
      sel.classList.add('selected');
      const dot = sel.querySelector('.city-dot, .highlight-dot');
      if (dot) dot.setAttribute('r', getDotR(dot, SEL_R));
    }

    // Update accent color
    panel.style.borderLeftColor = d.color + '99';
    tabBtns.forEach(b => b.style.setProperty('--tab-active', d.color));

    // Header
    document.getElementById('cip-icon').textContent   = d.icon;
    document.getElementById('cip-name').textContent   = d.name;
    document.getElementById('cip-region').textContent = d.region;

    // Tab: Dados
    document.getElementById('cip-stats').innerHTML = d.stats.map(s =>
      `<div class="cip-stat" style="border-color:${d.color}33">
        <span class="cip-stat-val" style="color:${d.color}">${s.val}</span>
        <span class="cip-stat-lbl">${s.lbl}</span>
      </div>`
    ).join('');
    document.getElementById('cip-ods-row').innerHTML =
      `<div class="cip-divider-label" style="margin-top:0.5rem">ODS RELACIONADAS</div>
       <div class="cip-ods-badges">` +
      d.ods.map(o =>
        `<span class="cip-ods-badge" style="border-color:${d.color}55;color:${d.color};background:${d.color}11">${o}</span>`
      ).join('') + `</div>`;

    // Tab: Riscos
    document.getElementById('cip-impacts').innerHTML =
      `<div class="cip-divider-label">IMPACTOS CLIMÁTICOS</div>` +
      renderList(d.impacts, 'cip-impact-item', 'cip-impact-icon');

    // Tab: Ecossistema
    document.getElementById('cip-eco').innerHTML =
      `<div class="cip-divider-label">ECOSSISTEMAS</div>` +
      renderList(d.eco, 'cip-eco-item', 'cip-eco-icon');

    // Tab: Ações
    document.getElementById('cip-actions').innerHTML =
      `<div class="cip-divider-label">O QUE FAZER</div>` +
      renderList(d.actions, 'cip-action-item', 'cip-action-icon');

    // Reset to first tab
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    tabBtns[0]?.classList.add('active');
    document.getElementById('cip-panel-dados')?.classList.add('active');

    // Show content
    idleEl.style.display = 'none';
    contentEl.classList.add('visible');
    if (mapHint) mapHint.classList.add('hidden');
  }

  function hideCity() {
    cities.forEach(c => {
      c.classList.remove('selected');
      const dot = c.querySelector('.city-dot, .highlight-dot');
      if (dot) dot.setAttribute('r', getDotR(dot, BASE_R));
    });
    panel.style.borderLeftColor = 'rgba(255,215,0,0.15)';
    contentEl.classList.remove('visible');
    idleEl.style.display = 'flex';
    if (mapHint) mapHint.classList.remove('hidden');
  }

  cities.forEach(city => {
    const key = city.dataset.city;
    const d = CITY_DATA[key];
    if (!d) return;
    city.addEventListener('click', () => showCity(key));
    city.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showCity(key); });
    city.addEventListener('mouseenter', e => {
      hoverTip.textContent = `${d.icon}  ${d.name}`;
      hoverTip.style.display = 'block';
    });
    city.addEventListener('mousemove', e => {
      hoverTip.style.left = e.clientX + 'px';
      hoverTip.style.top  = e.clientY + 'px';
    });
    city.addEventListener('mouseleave', () => { hoverTip.style.display = 'none'; });
  });

  // Chips in idle state
  document.querySelectorAll('.cip-idle-chip').forEach(chip => {
    chip.addEventListener('click', () => showCity(chip.dataset.target));
  });

  closeBtn?.addEventListener('click', hideCity);

  // Auto-open Quissamã when section enters view
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(() => showCity('quissama'), 600);
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  const localSection = document.getElementById('local');
  if (localSection) observer.observe(localSection);
}

/* ─── RESTART BUTTON ──────────────────────────────────── */
function initRestartBtn() {
  const btn = document.getElementById('restart-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ─── VOTAÇÃO INTERATIVA (CONCLUSÃO) ──────────────────── */
function initVoting() {
  const votes = { sim: 0, nao: 0, parcial: 0 };
  let voted = false;

  const btns = {
    sim:     document.getElementById('vote-sim'),
    nao:     document.getElementById('vote-nao'),
    parcial: document.getElementById('vote-parcial'),
  };
  const counts = {
    sim:     document.getElementById('count-sim'),
    nao:     document.getElementById('count-nao'),
    parcial: document.getElementById('count-parcial'),
  };
  const bars = {
    sim:     document.getElementById('bar-sim'),
    nao:     document.getElementById('bar-nao'),
    parcial: document.getElementById('bar-parcial'),
  };
  const barWrap = document.getElementById('rq-bar-wrap');
  const totalEl = document.getElementById('rq-total');
  if (!btns.sim) return;

  function updateUI() {
    const total = votes.sim + votes.nao + votes.parcial;
    Object.keys(votes).forEach(k => {
      counts[k].textContent = votes[k];
      const pct = total > 0 ? Math.round((votes[k] / total) * 100) : 0;
      bars[k].style.width = pct + '%';
    });
    if (total > 0) {
      barWrap.style.display = 'flex';
      totalEl.style.display = 'block';
      totalEl.textContent = `${total} voto${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''}`;
    }
  }

  Object.keys(btns).forEach(key => {
    btns[key].addEventListener('click', () => {
      if (voted) return;
      voted = true;
      votes[key]++;
      updateUI();
      // Dim other buttons
      Object.keys(btns).forEach(k => {
        if (k !== key) btns[k].classList.add('voted');
      });
      btns[key].style.opacity = '1';
      btns[key].style.boxShadow = `0 0 20px currentColor`;
    });
  });
}

/* ─── FLIP CAROUSEL (SOLUTIONS) ───────────────────────── */
function initFlipCarousel() {
  const items = document.querySelectorAll('.flip-item');
  const cards = document.querySelectorAll('.flip-detail-card');
  const idle  = document.querySelector('.flip-detail-idle');
  if (!items.length) return;

  items.forEach(item => {
    item.addEventListener('click', () => {
      const idx = item.dataset.idx;

      // Update items
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Hide idle state
      if (idle) idle.classList.add('hidden');

      // Show correct card
      cards.forEach(c => {
        c.classList.remove('active');
        // Reset the unlock bar and progress bar so they re-animate
        const fill = c.querySelector('.flip-detail-unlock-fill');
        const barFill = c.querySelector('.flip-detail-bar-fill');
        if (fill) fill.style.width = '0%';
        if (barFill) barFill.style.width = '0%';
      });

      const target = document.querySelector(`.flip-detail-card[data-detail="${idx}"]`);
      if (target) {
        requestAnimationFrame(() => {
          target.classList.add('active');
        });
      }
    });
  });
}

/* ─── TEMP SLIDER ZONES ───────────────────────────────── */
function updateTempExplanation(temp) {
  const zones = {
    frozen:  document.getElementById('temp-exp-frozen'),
    ideal:   document.getElementById('temp-exp-ideal'),
    warning: document.getElementById('temp-exp-warning'),
    crisis:  document.getElementById('temp-exp-crisis'),
  };

  let active = null;
  if (temp < 0)        active = 'frozen';
  else if (temp <= 17) active = 'ideal';
  else if (temp <= 20) active = 'warning';
  else                 active = 'crisis';

  Object.entries(zones).forEach(([key, el]) => {
    if (!el) return;
    if (key === active) {
      if (!el.classList.contains('active')) {
        el.classList.add('active');
      }
    } else {
      el.classList.remove('active');
    }
  });
}

/* ─── PARALLAX EFFECT ─────────────────────────────────── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;

  // Parallax earth
  const earthContainer = document.querySelector('.earth-container');
  if (earthContainer) {
    earthContainer.style.transform = `translateY(calc(-50% + ${scrolled * 0.3}px))`;
  }

  // Intro content parallax
  const introContent = document.querySelector('.intro-content');
  if (introContent && scrolled < window.innerHeight) {
    introContent.style.transform = `translateY(${scrolled * 0.15}px)`;
    introContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
  }
});

/* ─── GAS CARD INTERACTIONS ───────────────────────────── */
document.querySelectorAll('.gas-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const gas = card.dataset.gas;
    const colors = { co2: '#00d4ff', ch4: '#00ff88', n2o: '#ffd700' };
    card.style.boxShadow = `0 15px 50px ${colors[gas]}30, 0 0 0 1px ${colors[gas]}40`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

/* ─── MAP PIN HOVER TOOLTIPS ──────────────────────────── */
document.querySelectorAll('.map-pin').forEach(pin => {
  pin.addEventListener('mouseenter', () => {
    pin.querySelector('.pin-dot').style.transform = 'scale(1.8)';
  });
  pin.addEventListener('mouseleave', () => {
    pin.querySelector('.pin-dot').style.transform = '';
  });
});

/* ─── SECTION COLOR SHIFTING ON SCROLL ─────────────────── */
(function initColorShift() {
  const sections = ['intro', 'what', 'human', 'natural', 'bio', 'carousel', 'local', 'data', 'solutions', 'final'];
  const bgColors = {
    intro: 'rgba(2,4,8,1)',
    what: 'rgba(5,12,25,1)',
    human: 'rgba(15,4,4,1)',
    natural: 'rgba(5,12,25,1)',
    bio: 'rgba(10,3,3,1)',
    carousel: 'rgba(1,2,6,1)',
    local: 'rgba(8,6,2,1)',
    data: 'rgba(2,5,12,1)',
    solutions: 'rgba(2,10,5,1)',
    final: 'rgba(1,2,5,1)'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const color = bgColors[id] || 'rgba(2,4,8,1)';
        document.body.style.transition = 'background 1s ease';
        document.body.style.background = color;
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
})();
