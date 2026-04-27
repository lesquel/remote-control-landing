export function initTabs(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.panel;
      if (!target) return;
      tabs.forEach((t) => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      document.getElementById(target)?.classList.add('active');
    });
  });
}
