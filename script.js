/**
 * Jyotisha — script.js v4.0
 * No Lenis. Native scroll only. All scripts deferred.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. FADE-IN-UP ────────────────────────────────────────────────────────
  document.querySelectorAll('.fade-in-up').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }));
  });

  // ── 2. CUSTOM CURSOR — desktop pointer devices only ───────────────────────
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (dot && ring && hasHover) {
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
    }, { passive: true });
    (function tick() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      dot.style.left  = mouseX + 'px'; dot.style.top   = mouseY + 'px';
      ring.style.left = ringX  + 'px'; ring.style.top  = ringY  + 'px';
      requestAnimationFrame(tick);
    })();
  } else if (dot && ring) {
    // Touch / mobile — hide cursor elements, restore default cursor
    dot.style.display  = 'none';
    ring.style.display = 'none';
    document.body.style.cursor = 'auto';
  }

  // ── 3. MOBILE MENU ────────────────────────────────────────────────────────
  const mobileBtn  = document.getElementById('mobile-menu-btn');
  const closeBtn   = document.getElementById('close-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  function toggleMenu(show) {
    if (!mobileMenu) return;
    menuOpen = show;
    mobileMenu.style.zIndex = show ? '60' : '';
    mobileMenu.classList.toggle('opacity-0',           !show);
    mobileMenu.classList.toggle('pointer-events-none', !show);
    mobileMenu.classList.toggle('opacity-100',          show);
    mobileMenu.classList.toggle('pointer-events-auto',  show);
    document.body.classList.toggle('mobile-menu-open', show);
    // DO NOT touch body overflow — it breaks scroll position on iOS
  }

  mobileBtn?.addEventListener('click',  () => toggleMenu(!menuOpen));
  closeBtn?.addEventListener('click',   () => toggleMenu(false));
  document.querySelectorAll('.mobile-link').forEach(l =>
    l.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

  // ── 4. NAV BLUR ON SCROLL ─────────────────────────────────────────────────
  const nav = document.querySelector('nav');
  if (nav) {
    const check = () => nav.classList.toggle('nav-scrolled', window.scrollY > 50);
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  // ── 5. SCROLL REVEAL ──────────────────────────────────────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObs.observe(el));

  // ── 6. ANIMATED COUNTERS ──────────────────────────────────────────────────
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      if (!target) return;
      let cur = 0;
      const step = target / 55;
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.round(cur) + '+';
        if (cur >= target) clearInterval(t);
      }, 20);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter-num[data-target]').forEach(el => counterObs.observe(el));

  // ── 7. 3D TILT (desktop only) ─────────────────────────────────────────────
  const section2    = document.querySelector('.section2');
  const motionImage = document.querySelector('.image-motion');
  if (section2 && motionImage && hasHover) {
    let tiltTick = false;
    section2.addEventListener('mousemove', e => {
      if (tiltTick) return; tiltTick = true;
      requestAnimationFrame(() => {
        const { left, top, width, height } = section2.getBoundingClientRect();
        const dx = (e.clientX - left - width  / 2) / (width  / 2);
        const dy = (e.clientY - top  - height / 2) / (height / 2);
        motionImage.style.transform = `perspective(1200px) rotateX(${-dy*6}deg) rotateY(${dx*8}deg) scale(1.02)`;
        tiltTick = false;
      });
    }, { passive: true });
    section2.addEventListener('mouseleave', () => {
      motionImage.style.transition = 'transform 0.6s ease-out';
      motionImage.style.transform  = 'perspective(1200px) rotateX(0) rotateY(0) scale(1)';
      setTimeout(() => { motionImage.style.transition = ''; }, 620);
    });
  }

  // ── 8. TOAST ──────────────────────────────────────────────────────────────
  window.showToast = function(msg, isError = false) {
    const t = document.createElement('div');
    t.className = 'jyo-toast';
    if (isError) t.style.borderColor = 'rgba(231,50,35,0.45)';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('jyo-toast--visible')));
    setTimeout(() => {
      t.classList.remove('jyo-toast--visible');
      t.addEventListener('transitionend', () => t.remove(), { once: true });
    }, 3500);
  };

  // ── 9. GSAP SCROLL EXTRAS (graceful — only if GSAP loaded) ───────────────
  window.addEventListener('load', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // About portrait subtle parallax
    const portrait = document.querySelector('img[alt="The Archivist"]');
    if (portrait) {
      gsap.to(portrait, {
        yPercent: -5, ease: 'none',
        scrollTrigger: { trigger: portrait.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    // Section2 image scale
    const s2img = document.querySelector('.section2 img');
    if (s2img) {
      gsap.fromTo(s2img, { scale: 1.08 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.section2', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
  });

});
