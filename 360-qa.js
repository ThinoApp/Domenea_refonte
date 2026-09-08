(() => {
  'use strict';
  const params = new URLSearchParams(window.location.search);
  if (params.get('debug360') !== '1') return;

  const attemptOpen = () => {
    const trigger = document.querySelector('[data-domenea-360]');
    if (!trigger) return false;
    trigger.click();
    return true;
  };

  const start = () => {
    if (attemptOpen()) return;
    const observer = new MutationObserver(() => {
      if (attemptOpen()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 12000);
  };

  // The normal site has a ceremonial entry sequence. For QA, wait until that
  // sequence has completed so its body-lock / focus logic cannot immediately
  // close or mask the 360 dialog.
  setTimeout(start, 4300);
})();