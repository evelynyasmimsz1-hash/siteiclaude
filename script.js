// ============================================
// Imob Flow Lab — interações
// ============================================

// Mobile drawer
const navToggle = document.querySelector('.nav-toggle');
const drawer = document.querySelector('.mobile-drawer');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Sticky CTA visibility
const sticky = document.querySelector('.sticky-cta');
window.addEventListener('scroll', () => {
  if (!sticky) return;
  const visible = window.scrollY > 600 &&
                  window.scrollY < document.body.scrollHeight - window.innerHeight - 400;
  sticky.classList.toggle('visible', visible);
}, { passive: true });

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Count-up
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.target);
    if (isNaN(target)) return;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => countObserver.observe(el));

// WhatsApp chat loop
const chat = document.getElementById('chat');
const conversation = [
  { type: 'them', text: 'Olá! Vi o anúncio do apto 2 dorms no Brooklin 👋' },
  { type: 'typing' },
  { type: 'me', text: 'Oi! Aqui é a Sofia, do time da Imobiliária. Que bom te ver por aqui 😊 Posso te chamar pelo nome?' },
  { type: 'them', text: 'Pedro' },
  { type: 'me', text: 'Pedro, esse aptô tá com proposta esta semana. Posso te passar 3 opções parecidas, na sua faixa de preço, hoje?' },
  { type: 'them', text: 'Manda. Até 850k' },
  { type: 'typing' },
  { type: 'me', text: '✅ Anotei. 3 opções saindo + agendamento de visita pro corretor Caio. Te ligo em 9 min.' }
];

function renderMessage(item) {
  const div = document.createElement('div');
  if (item.type === 'typing') {
    div.className = 'msg msg-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
  } else {
    div.className = `msg msg-${item.type}`;
    div.textContent = item.text;
  }
  chat.appendChild(div);
}

async function playChat() {
  if (!chat) return;
  while (true) {
    chat.innerHTML = '';
    for (const item of conversation) {
      renderMessage(item);
      const last = chat.lastChild;
      await new Promise(r => setTimeout(r, item.type === 'typing' ? 1200 : 1100));
      if (item.type === 'typing') last.remove();
    }
    await new Promise(r => setTimeout(r, 2400));
  }
}
playChat();

// Form mock submit
function handleSubmit(form) {
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = 'Enviando...';
  btn.disabled = true;
  setTimeout(() => {
    form.innerHTML = `
      <div style="text-align:center;padding:24px 12px;">
        <div style="width:56px;height:56px;border-radius:50%;background:#0A0A0A;color:#fff;display:grid;place-items:center;margin:0 auto 18px;font-size:24px;">✓</div>
        <h3 style="font-size:22px;font-weight:700;letter-spacing:-.02em;margin-bottom:10px;">Pedido recebido.</h3>
        <p style="color:#4A4A4A;font-size:15px;max-width:380px;margin:0 auto;">Nosso time vai te chamar em até <strong>2 horas úteis</strong> pra te mostrar como funciona. Sem fila, sem robô.</p>
      </div>
    `;
  }, 900);
}

// ============================================
// Hero parallax based on mouse
// ============================================
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  let raf = null, tx = 0, ty = 0;
  function apply(){
    hero.style.setProperty('--mx', tx.toFixed(3));
    hero.style.setProperty('--my', ty.toFixed(3));
    raf = null;
  }
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(apply);
  });
  hero.addEventListener('mouseleave', () => {
    tx = 0; ty = 0;
    if (!raf) raf = requestAnimationFrame(apply);
  });
})();

// ============================================
// Hero particles
// ============================================
(function() {
  const canvas = document.querySelector('.hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, dpr, particles = [];

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height;
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles(n) {
    particles = [];
    for (let i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        vy: -(Math.random() * 0.35 + 0.08),
        vx: (Math.random() - 0.5) * 0.12,
        a: Math.random() * 0.55 + 0.15,
        ph: Math.random() * Math.PI * 2,
      });
    }
  }

  let t = 0;
  function step() {
    t += 0.016;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -8) { p.y = height + 8; p.x = Math.random() * width; }
      if (p.x < -8) p.x = width + 8;
      if (p.x > width + 8) p.x = -8;
      const op = p.a * (0.7 + 0.3 * Math.sin(t * 1.2 + p.ph));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(110,110,110,${op.toFixed(3)})`;
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  function init() {
    resize();
    const count = width < 700 ? 28 : 55;
    createParticles(count);
  }

  init();
  step();
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(init, 200);
  });
})();

// Smooth focus for # anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});
