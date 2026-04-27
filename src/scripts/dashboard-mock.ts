type ToolMock = {
  name: string;
  file: string;
  status: string;
  pre: string;
};

type Session = {
  title: string;
  agent: string;
  cost: string;
  user: string;
  bot: string;
  tool: ToolMock;
};

const SESSIONS: Session[] = [
  {
    title: 'refactor SSE reconnect',
    agent: 'build',
    cost: '$0.42 · 12.4k tok',
    user: 'La reconexión SSE se vuelve loca cuando cambio de red. ¿Puedes añadir backoff exponencial y un pong explícito?',
    bot: 'Entendido. Añadiré backoff exponencial (1s → 30s máx) y heartbeat cada 15s.',
    tool: {
      name: 'edit',
      file: 'src/dashboard/sse.ts',
      status: 'completed · 142ms',
      pre: '-  const delay = 1000;\n+  const delay = Math.min(30_000, 1_000 * 2 ** attempts);\n+  scheduleHeartbeat(15_000);',
    },
  },
  {
    title: 'codex hook bridge audit',
    agent: 'plan',
    cost: '$0.08 · 2.1k tok',
    user: 'Verificá que el bridge /codex/hooks/PermissionRequest respete el timeout de 250s antes de auto-deny.',
    bot: 'OK. Reviso transport/http/handlers/codex.ts y los tests de integration. El cap de 255s es de Bun.serve.',
    tool: {
      name: 'read',
      file: 'docs/CODEX-INTEGRATION.md',
      status: 'completed · 18ms',
      pre: '› checklist:\n  [x] hookToken accepted\n  [x] PermissionRequest blocking until resolve\n  [x] timeout < Bun idleTimeout cap',
    },
  },
  {
    title: 'docs/INSTALL review',
    agent: 'explore',
    cost: '$0.15 · 4.8k tok',
    user: 'Lee docs/INSTALL.md y dime qué gotchas del loader no están cubiertos.',
    bot: 'Tres gotchas no cubiertos: (1) orden de plugin en tui.json, (2) wrappers legacy en plugins/, (3) cache del loader por proceso.',
    tool: {
      name: 'glob',
      file: '**/INSTALL*.md',
      status: 'completed · 6ms',
      pre: 'docs/INSTALL.md       1 file\ndocs/INSTALL_FR.md    1 file',
    },
  },
  {
    title: 'migrate to drizzle',
    agent: 'build',
    cost: '$1.23 · 38k tok',
    user: 'Migra el schema de Prisma a Drizzle manteniendo las migraciones.',
    bot: 'Empiezo generando el schema Drizzle a partir del prisma.schema. Crearé un puente de tipos para no romper los consumers.',
    tool: {
      name: 'bash',
      file: 'drizzle-kit generate',
      status: 'running · 3s',
      pre: '[drizzle] scanning schema…\n[drizzle] 14 tables detected\n[drizzle] generating…',
    },
  },
  {
    title: 'add OAuth PKCE',
    agent: 'general',
    cost: '$0.31 · 9.0k tok',
    user: 'Añade soporte OAuth2 con PKCE al cliente. Usa web crypto para el challenge.',
    bot: 'Implementaré el flow PKCE con S256 y storage del verifier en sessionStorage. El callback hará el exchange.',
    tool: {
      name: 'edit',
      file: 'src/auth/pkce.ts',
      status: 'completed · 89ms',
      pre: '+ export async function makeChallenge(verifier: string) {\n+   const h = await crypto.subtle.digest("SHA-256", enc(verifier));\n+   return base64url(h);\n+ }',
    },
  },
];

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] ?? c));
}

function renderSession(i: number): void {
  const s = SESSIONS[i];
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

export function initDashboardMock(): void {
  document.querySelectorAll<HTMLElement>('[data-session]').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelectorAll('[data-session]').forEach((x) => x.classList.remove('active'));
      el.classList.add('active');
      const idx = Number(el.dataset.session);
      if (!Number.isNaN(idx)) renderSession(idx);
    });
  });
}
