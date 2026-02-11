/**
 * Services Tabs
 * Desktop: Hover/Focus activated panels in the shared canvas
 * Mobile (<768px): Panels shown inline under each tab (accordion-style)
 */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.services');
  if (!section) return;

  const tabs = Array.from(section.querySelectorAll('.services__tab'));
  const canvas = section.querySelector('[data-services-canvas]');
  const panelsContainer = section.querySelector('.services__panels');

  const MOBILE_BREAKPOINT = 768;
  let isMobileLayout = false;

  // Map each tab to its corresponding panel and wrapper
  const tabPanelMap = tabs.map((tab) => {
    const panelId = tab.getAttribute('aria-controls');
    const panel = section.querySelector(`#${panelId}`);
    const tabWrap = tab.closest('.services__tab-wrap');
    return { tab, panel, tabWrap };
  });

  /* ── Desktop helpers ── */

  const setCanvasHeight = () => {
    if (isMobileLayout || !panelsContainer) return;
    const activePanel = panelsContainer.querySelector('.services__panel.is-active');
    if (!activePanel) return;
    panelsContainer.style.height = 'auto';
    const nextHeight = activePanel.offsetHeight;
    panelsContainer.style.height = `${nextHeight}px`;
  };

  const setActive = (tab) => {
    if (!tab || isMobileLayout) return;

    tabs.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
    });

    const allPanels = Array.from(section.querySelectorAll('.services__panel'));
    allPanels.forEach((panel) => {
      panel.classList.remove('is-active');
      panel.setAttribute('aria-hidden', 'true');
    });

    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');

    const panelId = tab.getAttribute('aria-controls');
    const panel = section.querySelector(`#${panelId}`);
    if (panel) {
      panel.classList.add('is-active');
      panel.setAttribute('aria-hidden', 'false');
    }

    const accent = tab.dataset.accent;
    const accentSoft = tab.dataset.accentSoft;
    const ink = tab.dataset.ink;
    if (accent) section.style.setProperty('--services-accent', accent);
    if (accentSoft) section.style.setProperty('--services-accent-soft', accentSoft);
    if (ink) section.style.setProperty('--services-ink', ink);

    requestAnimationFrame(setCanvasHeight);
  };

  /* ── Layout switching ── */

  const switchToMobile = () => {
    isMobileLayout = true;

    // Move each panel into its parent tab-wrap
    tabPanelMap.forEach(({ tab, panel, tabWrap }) => {
      if (panel && tabWrap) {
        panel.classList.add('is-active');
        panel.setAttribute('aria-hidden', 'false');
        tabWrap.appendChild(panel);
      }
      // All tabs look "selected" on mobile
      if (tab) tab.classList.add('is-active');
    });
  };

  const switchToDesktop = () => {
    isMobileLayout = false;

    // Move panels back into the shared canvas container
    tabPanelMap.forEach(({ panel }) => {
      if (panel && panelsContainer) {
        panelsContainer.appendChild(panel);
      }
    });

    // Reset panels height wrapper
    if (panelsContainer) panelsContainer.style.height = '';

    // Re-activate first tab (or whichever was active)
    const activeTab = tabs[0];
    setActive(activeTab);
  };

  const handleLayout = () => {
    const shouldBeMobile = window.innerWidth < MOBILE_BREAKPOINT;

    if (shouldBeMobile && !isMobileLayout) {
      switchToMobile();
    } else if (!shouldBeMobile && isMobileLayout) {
      switchToDesktop();
    }
  };

  /* ── Tab interactions (desktop only, guarded by isMobileLayout) ── */

  tabs.forEach((tab) => {
    tab.addEventListener('mouseenter', () => setActive(tab));
    tab.addEventListener('focus', () => setActive(tab));
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      setActive(tab);
    });
  });

  /* ── Init ── */

  handleLayout();

  if (!isMobileLayout) {
    const initial =
      tabs.find((tab) => tab.classList.contains('is-active')) || tabs[0];
    setActive(initial);
    setCanvasHeight();
  }

  window.addEventListener('resize', () => {
    handleLayout();
    if (!isMobileLayout) {
      setCanvasHeight();
    }
  });
});
