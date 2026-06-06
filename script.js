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

// Pause AI marquee on hover
document.querySelectorAll('.ai-marquee').forEach(m => {
  m.addEventListener('mouseenter', () => m.querySelectorAll('.ai-track').forEach(t => t.style.animationPlayState = 'paused'));
  m.addEventListener('mouseleave', () => m.querySelectorAll('.ai-track').forEach(t => t.style.animationPlayState = 'running'));
});

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
        <h3 style="font-size:22px;font-weight:700;letter-spacing:-.02em;margin-bottom:10px;">Diagnóstico solicitado.</h3>
        <p style="color:#4A4A4A;font-size:15px;max-width:380px;margin:0 auto;">Nosso time vai te chamar no WhatsApp em até <strong>2 horas úteis</strong> pra agendar os 30 minutos. Sem fila, sem robô.</p>
      </div>
    `;
  }, 900);
}

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
