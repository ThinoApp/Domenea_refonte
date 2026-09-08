(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug360') !== '1') return;
  const open = () => {
    const trigger = document.querySelector('[data-domenea-360]');
    if (trigger) {
      trigger.click();
      return true;
    }
    return false;
  };
  if (!open()) {
    const observer = new MutationObserver(() => {
      if (open()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 10000);
  }
})();