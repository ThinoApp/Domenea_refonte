(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug360') !== '1') return;

  document.documentElement.dataset.qa360 = 'loaded';

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    const trigger = document.querySelector('[data-domenea-360]');

    if (!trigger) {
      document.documentElement.dataset.qa360 = `waiting-${attempts}`;
      if (attempts >= 80) {
        clearInterval(timer);
        document.documentElement.dataset.qa360 = 'trigger-timeout';
      }
      return;
    }

    document.documentElement.dataset.qa360 = 'clicking';
    trigger.click();
    clearInterval(timer);

    setTimeout(() => {
      const viewer = document.querySelector('[data-domenea360-viewer]');
      document.documentElement.dataset.qa360 = viewer?.classList.contains('is-open') ? 'opened' : 'click-did-not-open';
    }, 150);
  }, 200);
})();