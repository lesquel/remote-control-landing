import { initTerminal }      from './terminal';
import { initTabs }          from './tabs';
import { initCopy }          from './copy';
import { initDashboardMock } from './dashboard-mock';
import { initQR }            from './qr';
import { initTheme }         from './theme';
import { initTweaks }        from './tweaks';
import { initMobileNav }     from './mobile-nav';
import { initAnimations }    from './animations';

function boot(): void {
  initTheme();
  initTweaks();
  initTerminal();
  initTabs();
  initCopy();
  initDashboardMock();
  initQR();
  initMobileNav();
  initAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}

document.addEventListener('astro:page-load', () => {
  initTheme();
  initTweaks();
  initTerminal();
  initTabs();
  initCopy();
  initDashboardMock();
  initQR();
  initMobileNav();
  initAnimations();
});
