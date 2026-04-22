/* ==========================================================================
   opencode-pilot landing — app
   Modular IIFEs, no build step, runs in any modern browser.
   ========================================================================== */
(function () {
  'use strict';

  // Tweaks (theme variants). Mirrors the EDITMODE block in the page.
  const TWEAKS = window.TWEAKS || {
    theme: 'terminal-green',
    showGrid: true,
    showScanlines: false,
    heroGlitch: true
  };

  /* --------------------------------------------------------------------- */
  /* Terminal typing animation                                             */
  /* --------------------------------------------------------------------- */
  function initTerminal() {
    const el = document.getElementById('termBody');
    if (!el) return;

    const lines = [
      { t: 400,  html: '<span class="muted">Last login: Mon Apr 20 14:22 on ttys003</span>' },
      { t: 600,  html: '<span class="ps">➜</span> <span class="hi">~/projects/api</span> <span class="muted">$</span> <span class="type" data-text="bunx @lesquel/opencode-pilot init"></span>' },
      { t: 2200, html: '<span class="muted">↓</span> fetching <span class="hi">@lesquel/opencode-pilot@1.14.1</span>' },
      { t: 2600, html: '<span class="muted">↓</span> fetching <span class="hi">@opencode-ai/plugin@latest</span>' },
      { t: 2900, html: '<span class="ok">✓</span> <span class="muted">located config: </span><span class="hi">~/.config/opencode</span>' },
      { t: 3200, html: '<span class="ok">✓</span> <span class="muted">writing </span><span class="hi">opencode.json::plugin</span>' },
      { t: 3500, html: '<span class="ok">✓</span> <span class="muted">writing </span><span class="hi">tui.json::plugin</span>' },
      { t: 3800, html: '<span class="ok">✓</span> <span class="muted">cleaning stale wrappers</span>' },
      { t: 4200, html: '' },
      { t: 4400, html: '<span class="ok">●</span> <span class="hi">Installed.</span> <span class="muted">Restart OpenCode to load the plugin.</span>' },
      { t: 4700, html: '<span class="ps">➜</span> <span class="hi">~/projects/api</span> <span class="muted">$</span> opencode' },
      { t: 5200, html: '' },
      { t: 5300, html: '<span class="ok">┌───────────────────────────────────────────┐</span>' },
      { t: 5400, html: '<span class="ok">│</span>  <span class="hi">opencode-pilot</span> <span class="muted">v1.14.1 · loaded</span>         <span class="ok">│</span>' },
      { t: 5500, html: '<span class="ok">│</span>                                           <span class="ok">│</span>' },
      { t: 5600, html: '<span class="ok">│</span>  <span class="muted">URL:</span> <span class="ok">http://127.0.0.1:4097</span>          <span class="ok">│</span>' },
      { t: 5700, html: '<span class="ok">│</span>  <span class="muted">Token:</span> <span class="hi">4a9c-2f1b-8d30-ee77</span>         <span class="ok">│</span>' },
      { t: 5800, html: '<span class="ok">│</span>  <span class="muted">Phone: press</span> <span class="hi">c</span> <span class="muted">in dashboard for QR</span> <span class="ok">│</span>' },
      { t: 5900, html: '<span class="ok">└───────────────────────────────────────────┘</span>' },
      { t: 6300, html: '<span class="ps">›</span> <span class="muted">ready. press</span> <span class="hi">/remote</span> <span class="muted">anytime.</span><span class="cursor" style="display:inline-block;width:.55ch;height:.85em;background:var(--accent);margin-left:2px;vertical-align:baseline"></span>' }
    ];

    const timeouts = [];
    function clearAll() {
      while (timeouts.length) clearTimeout(timeouts.pop());
    }

    function run() {
      clearAll();
      el.innerHTML = '';
      lines.forEach((l) => {
        timeouts.push(setTimeout(() => {
          const span = document.createElement('span');
          span.className = 'line';
          span.innerHTML = l.html;
          el.appendChild(span);
          const t = span.querySelector('.type');
          if (t) {
            const text = t.getAttribute('data-text');
            t.textContent = '';
            let j = 0;
            const typeInt = setInterval(() => {
              t.textContent += text[j];
              j++;
              if (j >= text.length) clearInterval(typeInt);
            }, 50);
          }
        }, l.t));
      });
    }

    run();
    setInterval(run, 14000);
  }

  /* --------------------------------------------------------------------- */
  /* Tabs                                                                  */
  /* --------------------------------------------------------------------- */
  function initTabs() {
    document.querySelectorAll('.tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.panel;
        document.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* --------------------------------------------------------------------- */
  /* Copy buttons                                                          */
  /* --------------------------------------------------------------------- */
  function initCopy() {
    document.querySelectorAll('.cp').forEach((btn) => {
      btn.addEventListener('click', () => {
        const t = btn.dataset.copy;
        if (navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {});
        const orig = btn.textContent;
        btn.textContent = '✓ copied';
        btn.classList.add('ok');
        setTimeout(() => {
          btn.textContent = orig;
          btn.classList.remove('ok');
        }, 1400);
      });
    });
  }

  /* --------------------------------------------------------------------- */
  /* Dashboard mock — session switching                                    */
  /* --------------------------------------------------------------------- */
  const sessions = [
    { title: 'refactor SSE reconnect', agent: 'build',   cost: '$0.42 · 12.4k tok', user: 'La reconexión SSE se vuelve loca cuando cambio de red. ¿Puedes añadir backoff exponencial y un pong explícito?', bot: 'Entendido. Añadiré backoff exponencial (1s → 30s máx) y heartbeat cada 15s.', tool: { name: 'edit', file: 'src/dashboard/sse.ts', status: 'completed · 142ms', pre: '-  const delay = 1000;\n+  const delay = Math.min(30_000, 1_000 * 2 ** attempts);\n+  scheduleHeartbeat(15_000);' } },
    { title: 'fix tunnel token leak',  agent: 'plan',    cost: '$0.08 · 2.1k tok',  user: 'El URL del túnel lleva el token en el query string — aparece en logs. Propón un fix.', bot: 'Plan: mover el token a un cookie HttpOnly + SameSite=Strict. Rotar al emparejar. Auditar logs de cloudflared.', tool: { name: 'read', file: 'docs/TUNNEL_TESTING.md', status: 'completed · 18ms', pre: '› checklist:\n  [x] token never in URL\n  [x] TLS only\n  [ ] token rotation on pair' } },
    { title: 'docs/INSTALL review',    agent: 'explore', cost: '$0.15 · 4.8k tok',  user: 'Lee docs/INSTALL.md y dime qué gotchas del loader no están cubiertos.', bot: 'Tres gotchas no cubiertos: (1) orden de plugin en tui.json, (2) wrappers legacy en plugins/, (3) cache del loader por proceso.', tool: { name: 'glob', file: '**/INSTALL*.md', status: 'completed · 6ms', pre: 'docs/INSTALL.md       1 file\ndocs/INSTALL_FR.md    1 file' } },
    { title: 'migrate to drizzle',     agent: 'build',   cost: '$1.23 · 38k tok',   user: 'Migra el schema de Prisma a Drizzle manteniendo las migraciones.', bot: 'Empiezo generando el schema Drizzle a partir del prisma.schema. Crearé un puente de tipos para no romper los consumers.', tool: { name: 'bash', file: 'drizzle-kit generate', status: 'running · 3s', pre: '[drizzle] scanning schema…\n[drizzle] 14 tables detected\n[drizzle] generating…' } },
    { title: 'add OAuth PKCE',         agent: 'general', cost: '$0.31 · 9.0k tok',  user: 'Añade soporte OAuth2 con PKCE al cliente. Usa web crypto para el challenge.', bot: 'Implementaré el flow PKCE con S256 y storage del verifier en sessionStorage. El callback hará el exchange.', tool: { name: 'edit', file: 'src/auth/pkce.ts', status: 'completed · 89ms', pre: '+ export async function makeChallenge(verifier: string) {\n+   const h = await crypto.subtle.digest("SHA-256", enc(verifier));\n+   return base64url(h);\n+ }' } }
  ];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function renderSession(i) {
    const s = sessions[i];
    if (!s) return;
    const agent = document.getElementById('dashAgent');
    const title = document.getElementById('dashTitle');
    const cost  = document.getElementById('dashCost');
    const t     = document.getElementById('dashTranscript');
    if (!agent || !title || !cost || !t) return;

    agent.textContent = `agent · ${s.agent}`;
    title.textContent = s.title;
    cost.textContent  = s.cost;
    t.innerHTML = `
      <div class="msg user">
        <div class="who">U</div>
        <div class="body">${escapeHtml(s.user)}</div>
      </div>
      <div class="msg bot">
        <div class="who">A</div>
        <div class="body">
          ${escapeHtml(s.bot)}
          <div class="tool-call">
            <div class="tc-head">
              <span style="color:var(--fg-dim)">◈</span>
              <span class="name">${escapeHtml(s.tool.name)}</span>
              <span style="color:var(--fg-dim)">${escapeHtml(s.tool.file)}</span>
              <span class="st">${escapeHtml(s.tool.status)}</span>
            </div>
<pre>${escapeHtml(s.tool.pre)}</pre>
          </div>
        </div>
      </div>
    `;
  }

  function initDashboard() {
    document.querySelectorAll('[data-session]').forEach((el) => {
      el.addEventListener('click', () => {
        document.querySelectorAll('[data-session]').forEach((x) => x.classList.remove('active'));
        el.classList.add('active');
        renderSession(+el.dataset.session);
      });
    });
  }

  /* --------------------------------------------------------------------- */
  /* QR (decorative)                                                       */
  /* --------------------------------------------------------------------- */
  function drawQR(seed) {
    const qr = document.getElementById('qr');
    if (!qr) return;
    qr.innerHTML = '';
    let s = 0;
    for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
    function rnd() {
      s = (s * 1103515245 + 12345) >>> 0;
      return (s >>> 16) / 65535;
    }
    const size = 21;
    const finderMask = (x, y) =>
      (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const d = document.createElement('i');
        if (finderMask(x, y) || rnd() > 0.52) d.className = 'off';
        qr.appendChild(d);
      }
    }
    ['tl', 'tr', 'bl'].forEach((pos) => {
      const f = document.createElement('div');
      f.className = `finder ${pos}`;
      qr.appendChild(f);
    });
  }

  function initQR() {
    drawQR('lan-192.168.1.14');
    document.querySelectorAll('.qr-tabs button').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.qr-tabs button').forEach((b) => b.classList.remove('on'));
        btn.classList.add('on');
        const which = btn.dataset.qr;
        drawQR(which === 'lan' ? 'lan-192.168.1.14' : 'tunnel-https-4a9c');
        const url = document.getElementById('phoneUrl');
        if (url) {
          url.textContent = which === 'lan'
            ? '192.168.1.14:4097/?t=4a9c…'
            : 'https://pilot-4a9c.trycloudflare.com';
        }
      });
    });
  }

  /* --------------------------------------------------------------------- */
  /* Theme + tweaks                                                        */
  /* --------------------------------------------------------------------- */
  const themes = ['terminal-green', 'amber', 'violet', 'mono-light'];
  const themeLabels = {
    'terminal-green': 'terminal',
    'amber': 'amber',
    'violet': 'violet',
    'mono-light': 'light'
  };

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const label = document.getElementById('themeLabel');
    if (label) label.textContent = themeLabels[t] || t;
    document.querySelectorAll('.sw').forEach((sw) =>
      sw.classList.toggle('on', sw.dataset.theme === t)
    );
    try { localStorage.setItem('pilot-theme', t); } catch (e) { /* noop */ }
    // Update theme-color meta to match background of selected theme.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      if (bg) meta.setAttribute('content', bg);
    }
  }

  function postEdit(edits) {
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    } catch (e) { /* noop */ }
  }

  function initTheme() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'terminal-green';
        const next = themes[(themes.indexOf(cur) + 1) % themes.length];
        applyTheme(next);
        postEdit({ theme: next });
      });
    }
    let saved = null;
    try { saved = localStorage.getItem('pilot-theme'); } catch (e) { /* noop */ }
    applyTheme(saved || TWEAKS.theme);
  }

  function initTweaks() {
    const tk = document.getElementById('tweaks');
    if (!tk) return;

    window.addEventListener('message', (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode')   tk.classList.add('open');
      if (d.type === '__deactivate_edit_mode') tk.classList.remove('open');
    });
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) { /* noop */ }

    document.querySelectorAll('.sw').forEach((sw) => {
      sw.addEventListener('click', () => {
        applyTheme(sw.dataset.theme);
        postEdit({ theme: sw.dataset.theme });
      });
    });

    const tkGrid   = document.getElementById('tkGrid');
    const tkScan   = document.getElementById('tkScan');
    const tkGlitch = document.getElementById('tkGlitch');
    if (tkGrid)   tkGrid.checked   = !!TWEAKS.showGrid;
    if (tkScan)   tkScan.checked   = !!TWEAKS.showScanlines;
    if (tkGlitch) tkGlitch.checked = !!TWEAKS.heroGlitch;

    if (tkGrid) tkGrid.addEventListener('change', () => {
      document.body.setAttribute('data-grid', tkGrid.checked);
      postEdit({ showGrid: tkGrid.checked });
    });
    if (tkScan) tkScan.addEventListener('change', () => {
      document.body.setAttribute('data-scanlines', tkScan.checked);
      postEdit({ showScanlines: tkScan.checked });
    });
    if (tkGlitch) tkGlitch.addEventListener('change', () => {
      const h = document.querySelector('h1.hero-title');
      if (h) h.setAttribute('data-glitch', tkGlitch.checked);
      postEdit({ heroGlitch: tkGlitch.checked });
    });

    // initial state
    document.body.setAttribute('data-grid', TWEAKS.showGrid);
    document.body.setAttribute('data-scanlines', TWEAKS.showScanlines);
    const h = document.querySelector('h1.hero-title');
    if (h) h.setAttribute('data-glitch', TWEAKS.heroGlitch);
  }

  /* --------------------------------------------------------------------- */
  /* Mobile nav drawer                                                     */
  /* --------------------------------------------------------------------- */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('nav.top .links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });

    // Close on link click
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      });
    });

    // Close when resizing back to desktop
    const mq = window.matchMedia('(min-width: 721px)');
    const onChange = (e) => {
      if (e.matches) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* --------------------------------------------------------------------- */
  /* Boot                                                                  */
  /* --------------------------------------------------------------------- */
  function boot() {
    initTerminal();
    initTabs();
    initCopy();
    initDashboard();
    initQR();
    initTheme();
    initTweaks();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
