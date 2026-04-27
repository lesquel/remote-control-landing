/**
 * Level-B motion: scroll-triggered fade-up, hover tilt, hero parallax,
 * and nav scrolled state. All disabled when prefers-reduced-motion.
 */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initScrollIn(): void {
  if (REDUCED) {
    document.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('in-view'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );
  document.querySelectorAll('[data-animate]').forEach((el) => io.observe(el));
}

function initTilt(): void {
  if (REDUCED || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cards = document.querySelectorAll<HTMLElement>('[data-tilt]');
  cards.forEach((card) => {
    let raf = 0;
    const onMove = (e: PointerEvent): void => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;  // 0..1
      const py = (e.clientY - rect.top)  / rect.height; // 0..1
      const rx = (0.5 - py) * 6; // tilt up/down
      const ry = (px - 0.5) * 6; // tilt left/right
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty('--tilt-x', `${ry.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${rx.toFixed(2)}deg`);
      });
    };
    const onLeave = (): void => {
      cancelAnimationFrame(raf);
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
  });
}

function initHeroParallax(): void {
  if (REDUCED) return;
  const term = document.querySelector<HTMLElement>('.hero .terminal');
  if (!term) return;
  let raf = 0;
  const onScroll = (): void => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const y = Math.min(window.scrollY * 0.06, 24);
      term.style.setProperty('--parallax-y', `${y.toFixed(1)}px`);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initNavScrolled(): void {
  const nav = document.querySelector('nav.top');
  if (!nav) return;
  const onScroll = (): void => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function initAnimations(): void {
  initScrollIn();
  initTilt();
  initHeroParallax();
  initNavScrolled();
}
