/* ── PARTICLE CANVAS ─────────────────────────────────── */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function createParticle() {
  return {
    x: randomBetween(0, canvas.width),
    y: randomBetween(0, canvas.height),
    r: randomBetween(1, 2.5),
    vx: randomBetween(-0.3, 0.3),
    vy: randomBetween(-0.5, -0.1),
    alpha: randomBetween(0.1, 0.6),
    color: Math.random() > 0.5 ? '233,196,106' : '244,162,97'
  };
}

for (let i = 0; i < 80; i++) particles.push(createParticle());

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -10) { Object.assign(p, createParticle(), { y: canvas.height + 10 }); }
    if (p.x < -10 || p.x > canvas.width + 10) p.vx *= -1;
  });

  // Draw connecting lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  animId = requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── STICKY NAV ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

/* ── HAMBURGER ─────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ── SCROLL ANIMATIONS (IntersectionObserver) ─────── */
const aosElements = document.querySelectorAll('[data-aos]');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
aosElements.forEach(el => observer.observe(el));

/* ── SMOOTH ACTIVE NAV ─────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${id}`) {
            if (!a.classList.contains('nav-cta')) a.style.color = 'var(--accent)';
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => sectionObserver.observe(s));

/* ── CONTACT OBFUSCATION (bot protection) ───────────────── */
function rot13(s) {
  return s.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

document.querySelectorAll('[data-ct][data-cv]').forEach(el => {
  const scheme = rot13(el.dataset.ct);   // e.g. 'mailto' or 'tel'
  const value = rot13(el.dataset.cv);   // e.g. 'rafid1841@gmail.com'
  el.href = `${scheme}:${value}`;
  el.style.cursor = 'pointer';
  delete el.dataset.ct;
  delete el.dataset.cv;
});

/* ── TERMINAL TYPING EFFECT ─────────────────────────────── */
const terminalLines = document.querySelectorAll('.t-output');
terminalLines.forEach((line, i) => {
  const text = line.textContent;
  line.textContent = '';
  setTimeout(() => {
    let idx = 0;
    const type = () => {
      if (idx < text.length) {
        line.textContent += text[idx++];
        setTimeout(type, 18);
      }
    };
    type();
  }, 1200 + i * 150);
});
