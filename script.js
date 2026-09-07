(() => {
  'use strict';

  const currentScript = document.currentScript;
  const baseUrl = new URL('.', currentScript?.src || window.location.href);

  const loadClassicScript = source => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL(source, baseUrl).href;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Unable to load ${source}`));
    document.head.appendChild(script);
  });

  loadClassicScript('script-core.js').catch(error => console.error('[DOMENEA]', error));
  loadClassicScript('cursor-trail.js').catch(error => console.error('[DOMENEA]', error));
})();