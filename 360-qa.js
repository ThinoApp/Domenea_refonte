(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug360') !== '1') return;

  document.documentElement.dataset.qa360 = 'loaded';

  const attemptOpen = () => {
    const trigger = document.querySelector('[data-domenea-360]');
    if (!trigger) {
      document.documentElement.dataset.qa360 = 'waiting-trigger';
      return false;
    }

    document.documentElement.dataset.qa360 = 'clicking';
    trigger.click();
    requestAnimationFrame(() => {
      const viewer = document.querySelector('[data-domenea360-viewer]');
      document.documentElement.dataset.qa360 = viewer?.classList.contains('is-open') ? 'opened' : 'click-did-not-open';
    });
    return true;
  };

  const start = () => {
    document.documentElement.dataset.qa360 = 'starting';
    if (attemptOpen()) return;
    const observer = new MutationObserver(() => {
      if (attemptOpen()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 12000);
  };

  setTimeout(start, 4300);
})();