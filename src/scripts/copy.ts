const FEEDBACK_MS = 1400;

export function initCopy(): void {
  document.querySelectorAll<HTMLButtonElement>('.cp').forEach((btn) => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy ?? '';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).catch(() => { /* noop */ });
      }
      const orig = btn.textContent ?? 'copy';
      btn.textContent = '✓ copied';
      btn.classList.add('ok');
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove('ok');
      }, FEEDBACK_MS);
    });
  });
}
