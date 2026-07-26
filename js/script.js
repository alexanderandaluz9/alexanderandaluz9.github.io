/* =================================================================
   CONFIGURACIÓN RÁPIDA — MODIFICA AQUÍ
   ================================================================= */
const CONFIG = {
  // Frases que se van "escribiendo" en el hero, una tras otra.
  // MODIFICA AQUÍ tus propias frases.
  typedPhrases: [
    "Construyo software con Java y Python.",
    "Aprendiendo backend, un proyecto a la vez.",
    "Código limpio, resultados reales."
  ],
  typingSpeed: 45,      // ms por letra al escribir
  deletingSpeed: 25,    // ms por letra al borrar
  pauseBetween: 1800    // ms de pausa antes de borrar
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initMobileMenu();
  initRevealOnScroll();
  initTypedText();
  initCounters();
  initBackToTop();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* -----------------------------------------------------------------
   1) Barra de navegación: se encoge y gana fondo al hacer scroll
   ----------------------------------------------------------------- */
function initNavScroll() {
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -----------------------------------------------------------------
   2) Menú móvil (hamburguesa a pantalla completa)
   ----------------------------------------------------------------- */
function initMobileMenu() {
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');

  const toggle = (open) => {
    const isOpen = open ?? !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', isOpen);
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  burger.addEventListener('click', () => toggle());
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });
}

/* -----------------------------------------------------------------
   3) Animación "reveal": las secciones aparecen al hacer scroll
   ----------------------------------------------------------------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // pequeño desfase entre elementos para un efecto en cascada
        setTimeout(() => entry.target.classList.add('is-visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(el => observer.observe(el));
}

/* -----------------------------------------------------------------
   4) Efecto de "máquina de escribir" en el subtítulo del hero
   ----------------------------------------------------------------- */
function initTypedText() {
  const el = document.getElementById('typedText');
  if (!el) return;

  if (prefersReducedMotion) {
    el.textContent = CONFIG.typedPhrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = CONFIG.typedPhrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(tick, CONFIG.pauseBetween);
        return;
      }
    } else {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % CONFIG.typedPhrases.length;
      }
    }

    setTimeout(tick, deleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed);
  }

  tick();
}

/* -----------------------------------------------------------------
   5) Contadores animados en "Sobre mí" (0 -> número final)
   ----------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll('.stat__num');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1200;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo para que arranque rápido y frene suave
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* -----------------------------------------------------------------
   6) Botón "volver arriba"
   ----------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
}
