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

  const boot = async () => {
    try {
      await loadClassicScript('copy-rewrite.js');
      await loadClassicScript('script-core.js?v=immersion-3');
      await loadClassicScript('perspective-redesign.js');
      window.DOMENEA_COPY?.decoratePerspective();
      await loadClassicScript('360-experience.js?v=immersion-3');
      await loadClassicScript('scroll-portal.js?v=3');

      const params = new URLSearchParams(window.location.search);
      if (params.get('debug360') === '1') {
        await loadClassicScript('360-qa.js?v=3');
      }

      await loadClassicScript('cursor-trail.js');
      await loadClassicScript('architectural-thread.js?v=prod-mime-1');
    } catch (error) {
      console.error('[DOMENEA]', error);
    }
  };

  boot();
})();
