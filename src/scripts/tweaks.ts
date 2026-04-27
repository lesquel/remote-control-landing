import { applyTheme, type Theme } from './theme';

type Tweaks = {
  theme: Theme;
  showGrid: boolean;
  showScanlines: boolean;
  heroGlitch: boolean;
};

declare global {
  interface Window {
    TWEAKS?: Partial<Tweaks>;
  }
}

const DEFAULTS: Tweaks = {
  theme: 'terminal-green',
  showGrid: true,
  showScanlines: false,
  heroGlitch: true,
};

function postEdit(edits: Record<string, unknown>): void {
  try {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  } catch { /* noop */ }
}

export function initTweaks(): void {
  const tk = document.getElementById('tweaks');
  if (!tk) return;

  const cfg: Tweaks = { ...DEFAULTS, ...(window.TWEAKS ?? {}) } as Tweaks;

  window.addEventListener('message', (e: MessageEvent) => {
    const d = (e.data ?? {}) as { type?: string };
    if (d.type === '__activate_edit_mode')   tk.classList.add('open');
    if (d.type === '__deactivate_edit_mode') tk.classList.remove('open');
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch { /* noop */ }

  document.querySelectorAll<HTMLElement>('.sw').forEach((sw) => {
    sw.addEventListener('click', () => {
      const t = sw.dataset.theme as Theme | undefined;
      if (!t) return;
      applyTheme(t);
      postEdit({ theme: t });
    });
  });

  const tkGrid   = document.getElementById('tkGrid')   as HTMLInputElement | null;
  const tkScan   = document.getElementById('tkScan')   as HTMLInputElement | null;
  const tkGlitch = document.getElementById('tkGlitch') as HTMLInputElement | null;
  if (tkGrid)   tkGrid.checked   = cfg.showGrid;
  if (tkScan)   tkScan.checked   = cfg.showScanlines;
  if (tkGlitch) tkGlitch.checked = cfg.heroGlitch;

  tkGrid?.addEventListener('change', () => {
    document.body.setAttribute('data-grid', String(tkGrid.checked));
    postEdit({ showGrid: tkGrid.checked });
  });
  tkScan?.addEventListener('change', () => {
    document.body.setAttribute('data-scanlines', String(tkScan.checked));
    postEdit({ showScanlines: tkScan.checked });
  });
  tkGlitch?.addEventListener('change', () => {
    const h = document.querySelector('h1.hero-title');
    if (h) h.setAttribute('data-glitch', String(tkGlitch.checked));
    postEdit({ heroGlitch: tkGlitch.checked });
  });

  document.body.setAttribute('data-grid', String(cfg.showGrid));
  document.body.setAttribute('data-scanlines', String(cfg.showScanlines));
  const h = document.querySelector('h1.hero-title');
  if (h) h.setAttribute('data-glitch', String(cfg.heroGlitch));
}
