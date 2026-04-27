export function initMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const links  = document.querySelector<HTMLDivElement>('nav.top .links');
  if (!toggle || !links) return;

  function setOpen(open: boolean): void {
    if (!toggle || !links) return;
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? '✕' : '☰';
  }

  toggle.addEventListener('click', () => {
    setOpen(!links.classList.contains('open'));
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  const mq = window.matchMedia('(min-width: 721px)');
  const onChange = (e: MediaQueryListEvent | MediaQueryList): void => {
    if (e.matches) setOpen(false);
  };
  mq.addEventListener('change', onChange);
}
