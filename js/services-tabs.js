/**
 * Services Tabs - Hover/Focus activated panels
 */
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.services');
  if (!section) return;

  const tabs = Array.from(section.querySelectorAll('.services__tab'));
  const panels = Array.from(section.querySelectorAll('.services__panel'));

  const setCanvasHeight = () => {
    if (!section) return;
    const activePanel = section.querySelector('.services__panel.is-active');
    const panelsWrap = section.querySelector('.services__panels');
    if (!activePanel || !panelsWrap) return;
    panelsWrap.style.height = 'auto';
    const nextHeight = activePanel.offsetHeight;
    panelsWrap.style.height = `${nextHeight}px`;
  };

  const setActive = (tab) => {
    if (!tab) return;

    tabs.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-selected', 'false');
    });

    panels.forEach((panel) => {
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
    if (accent) {
      section.style.setProperty('--services-accent', accent);
    }
    if (accentSoft) {
      section.style.setProperty('--services-accent-soft', accentSoft);
    }
    if (ink) {
      section.style.setProperty('--services-ink', ink);
    }

    requestAnimationFrame(setCanvasHeight);
  };

  tabs.forEach((tab) => {
    tab.addEventListener('mouseenter', () => setActive(tab));
    tab.addEventListener('focus', () => setActive(tab));
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      setActive(tab);
    });
  });

  const initial = tabs.find((tab) => tab.classList.contains('is-active')) || tabs[0];
  setActive(initial);
  setCanvasHeight();

  window.addEventListener('resize', setCanvasHeight);
});
