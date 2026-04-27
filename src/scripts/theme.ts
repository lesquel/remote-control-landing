const THEMES = ['terminal-green', 'amber', 'violet', 'mono-light'] as const;
type Theme = typeof THEMES[number];

const LABELS: Record<Theme, string> = {
  'terminal-green': 'terminal',
  'amber': 'amber',
  'violet': 'violet',
  'mono-light': 'light',
};

const STORAGE_KEY = 'pilot-theme';

function postEdit(edits: Record<string, unknown>): void {
  try {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  } catch { /* noop */ }
}

export function applyTheme(t: Theme): void {
  document.documentElement.setAttribute('data-theme', t);
  const label = document.getElementById('themeLabel');
  if (label) label.textContent = LABELS[t] ?? t;
  document.querySelectorAll<HTMLElement>('.sw').forEach((sw) =>
    sw.classList.toggle('on', sw.dataset.theme === t),
  );
  try { localStorage.setItem(STORAGE_KEY, t); } catch { /* noop */ }
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    if (bg) meta.setAttribute('content', bg);
  }
}

function readSaved(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && (THEMES as readonly string[]).includes(v) ? (v as Theme) : null;
  } catch { return null; }
}

export function initTheme(defaultTheme: Theme = 'terminal-green'): void {
  const toggle = document.getElementById('themeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const cur = (document.documentElement.getAttribute('data-theme') ?? 'terminal-green') as Theme;
      const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length] ?? 'terminal-green';
      applyTheme(next);
      postEdit({ theme: next });
    });
  }
  applyTheme(readSaved() ?? defaultTheme);
}

export { THEMES, type Theme };
