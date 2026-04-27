/**
 * Terminal typewriter animation — hero demo.
 * Idempotent: clears its own timeouts before re-running.
 */
type Line = { t: number; html: string };

const LINES: Line[] = [
  { t: 400,  html: '<span class="muted">Last login: Sat Apr 26 09:14 on ttys003</span>' },
  { t: 600,  html: '<span class="ps">➜</span> <span class="hi">~/projects/api</span> <span class="muted">$</span> <span class="type" data-text="bunx @lesquel/opencode-pilot init"></span>' },
  { t: 2200, html: '<span class="muted">↓</span> fetching <span class="hi">@lesquel/opencode-pilot@1.18.2</span>' },
  { t: 2600, html: '<span class="muted">↓</span> fetching <span class="hi">@opencode-ai/plugin@latest</span>' },
  { t: 2900, html: '<span class="ok">✓</span> <span class="muted">located config: </span><span class="hi">~/.config/opencode</span>' },
  { t: 3200, html: '<span class="ok">✓</span> <span class="muted">writing </span><span class="hi">opencode.json::plugin</span>' },
  { t: 3500, html: '<span class="ok">✓</span> <span class="muted">writing </span><span class="hi">tui.json::plugin</span>' },
  { t: 3800, html: '<span class="ok">✓</span> <span class="muted">codex bridge ready (POST /codex/hooks/*)</span>' },
  { t: 4200, html: '' },
  { t: 4400, html: '<span class="ok">●</span> <span class="hi">Installed.</span> <span class="muted">Restart OpenCode (or wire Codex hooks) to load.</span>' },
  { t: 4700, html: '<span class="ps">➜</span> <span class="hi">~/projects/api</span> <span class="muted">$</span> opencode' },
  { t: 5200, html: '' },
  { t: 5300, html: '<span class="ok">┌───────────────────────────────────────────┐</span>' },
  { t: 5400, html: '<span class="ok">│</span>  <span class="hi">opencode-pilot</span> <span class="muted">v1.18.2 · loaded</span>         <span class="ok">│</span>' },
  { t: 5500, html: '<span class="ok">│</span>                                           <span class="ok">│</span>' },
  { t: 5600, html: '<span class="ok">│</span>  <span class="muted">URL:</span> <span class="ok">http://127.0.0.1:4097</span>          <span class="ok">│</span>' },
  { t: 5700, html: '<span class="ok">│</span>  <span class="muted">Token:</span> <span class="hi">4a9c-2f1b-8d30-ee77</span>         <span class="ok">│</span>' },
  { t: 5800, html: '<span class="ok">│</span>  <span class="muted">Phone: press</span> <span class="hi">c</span> <span class="muted">in dashboard for QR</span> <span class="ok">│</span>' },
  { t: 5900, html: '<span class="ok">└───────────────────────────────────────────┘</span>' },
  { t: 6300, html: '<span class="ps">›</span> <span class="muted">ready. press</span> <span class="hi">/remote</span> <span class="muted">anytime.</span><span class="cursor" style="display:inline-block;width:.55ch;height:.85em;background:var(--accent);margin-left:2px;vertical-align:baseline"></span>' },
];

const LOOP_MS = 14_000;
const TYPE_INTERVAL_MS = 50;

export function initTerminal(): void {
  const el = document.getElementById('termBody');
  if (!el) return;

  const timeouts: ReturnType<typeof setTimeout>[] = [];
  const intervals: ReturnType<typeof setInterval>[] = [];

  function clearAll(): void {
    timeouts.splice(0).forEach(clearTimeout);
    intervals.splice(0).forEach(clearInterval);
  }

  function run(): void {
    clearAll();
    if (!el) return;
    el.innerHTML = '';
    LINES.forEach((line) => {
      timeouts.push(setTimeout(() => {
        const span = document.createElement('span');
        span.className = 'line';
        span.innerHTML = line.html;
        el.appendChild(span);
        const t = span.querySelector<HTMLElement>('.type');
        if (t) {
          const text = t.getAttribute('data-text') ?? '';
          t.textContent = '';
          let j = 0;
          const typeInt = setInterval(() => {
            t.textContent = (t.textContent ?? '') + (text[j] ?? '');
            j++;
            if (j >= text.length) clearInterval(typeInt);
          }, TYPE_INTERVAL_MS);
          intervals.push(typeInt);
        }
      }, line.t));
    });
  }

  run();
  const loop = setInterval(run, LOOP_MS);
  intervals.push(loop);
}
