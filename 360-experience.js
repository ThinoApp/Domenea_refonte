(() => {
  'use strict';

  const residenceHero = document.querySelector('.residences-hero');
  if (!residenceHero || document.querySelector('[data-domenea-360]')) return;

  const isEnglish = () => document.documentElement.lang === 'en';
  const text = (fr, en) => isEnglish() ? en : fr;

  const style = document.createElement('style');
  style.dataset.domenea360Styles = '';
  style.textContent = `
    .residences-hero { position: relative; }

    .domenea-360-entry {
      position: absolute;
      z-index: 8;
      right: var(--pad);
      bottom: clamp(1.35rem, 3vw, 3rem);
      display: inline-flex;
      align-items: center;
      gap: .85rem;
      padding: 0;
      border: 0;
      color: var(--bone, #f4f4ef);
      background: transparent;
      cursor: pointer;
      font: inherit;
      text-align: left;
    }

    .domenea-360-entry::before {
      content: '';
      width: 3rem;
      height: 3rem;
      border: 1px solid currentColor;
      border-radius: 50%;
      background: rgba(18, 30, 22, .14);
      backdrop-filter: blur(5px);
      transition: transform .35s cubic-bezier(.16, 1, .3, 1), background .35s ease;
    }

    .domenea-360-entry::after {
      content: '360°';
      position: absolute;
      left: 1.5rem;
      top: 1.5rem;
      transform: translate(-50%, -50%);
      font-size: .63rem;
      font-weight: 600;
      letter-spacing: .07em;
    }

    .domenea-360-entry:hover::before,
    .domenea-360-entry:focus-visible::before {
      transform: scale(1.12);
      background: rgba(244, 244, 239, .12);
    }

    .domenea-360-entry span {
      display: grid;
      gap: .18rem;
      font-size: .72rem;
      line-height: 1.2;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .domenea-360-entry small {
      color: rgba(244, 244, 239, .68);
      font-size: .56rem;
      letter-spacing: .1em;
    }

    .domenea-360-entry:focus-visible,
    .domenea-360-control:focus-visible,
    .domenea-360-close:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 5px;
    }

    .domenea-360-viewer {
      position: fixed;
      inset: 0;
      z-index: 220;
      display: grid;
      grid-template-rows: auto 1fr auto;
      color: #f4f4ef;
      background: #101711;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transition: opacity .45s cubic-bezier(.16, 1, .3, 1), visibility .45s step-end;
    }

    .domenea-360-viewer.is-open {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transition: opacity .45s cubic-bezier(.16, 1, .3, 1), visibility 0s step-start;
    }

    body.is-360-open { overflow: hidden !important; }
    body.is-360-open [data-domenea-cursor] { opacity: 0 !important; }

    .domenea-360-top,
    .domenea-360-bottom {
      position: relative;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.1rem var(--pad);
      background: #101711;
    }

    .domenea-360-brand {
      display: flex;
      align-items: baseline;
      gap: .7rem;
      min-width: 0;
    }

    .domenea-360-brand strong {
      font-size: .76rem;
      letter-spacing: .08em;
    }

    .domenea-360-brand span,
    .domenea-360-bottom,
    .domenea-360-status {
      color: rgba(244, 244, 239, .65);
      font-size: .64rem;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .domenea-360-actions {
      display: flex;
      align-items: center;
      gap: 1.1rem;
    }

    .domenea-360-control,
    .domenea-360-close {
      padding: .35rem 0;
      border: 0;
      border-bottom: 1px solid rgba(244, 244, 239, .38);
      color: #f4f4ef;
      background: transparent;
      cursor: pointer;
      font: inherit;
      font-size: .64rem;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .domenea-360-stage {
      position: relative;
      min-height: 0;
      overflow: hidden;
      background: #0c120d;
    }

    #domenea-360-panorama {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      background: #0c120d;
    }

    .domenea-360-loading,
    .domenea-360-error {
      position: absolute;
      inset: 0;
      z-index: 4;
      display: grid;
      place-items: center;
      padding: 2rem;
      text-align: center;
      background: #101711;
      transition: opacity .35s ease, visibility .35s ease;
    }

    .domenea-360-loading[hidden],
    .domenea-360-error[hidden] {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      display: grid;
    }

    .domenea-360-loading-inner {
      display: grid;
      gap: 1rem;
      justify-items: center;
      max-width: 32rem;
    }

    .domenea-360-loading-ring {
      width: 3.5rem;
      height: 3.5rem;
      border: 1px solid rgba(244,244,239,.18);
      border-top-color: #f4f4ef;
      border-radius: 50%;
      animation: domenea360Spin 1s linear infinite;
    }

    @keyframes domenea360Spin { to { transform: rotate(360deg); } }

    .domenea-360-loading p,
    .domenea-360-error p {
      margin: 0;
      color: rgba(244,244,239,.7);
      font-size: .83rem;
      line-height: 1.55;
    }

    .domenea-360-guide {
      position: absolute;
      z-index: 3;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 6rem;
      height: 6rem;
      display: grid;
      place-items: center;
      border: 1px solid rgba(244,244,239,.34);
      border-radius: 50%;
      color: #f4f4ef;
      background: rgba(15, 23, 17, .1);
      backdrop-filter: blur(4px);
      font-size: .62rem;
      letter-spacing: .14em;
      text-transform: uppercase;
      pointer-events: none;
      transition: opacity .45s ease;
    }

    .domenea-360-stage.has-interacted .domenea-360-guide { opacity: 0; }

    .domenea-360-disclaimer {
      max-width: 45rem;
      text-transform: none;
      letter-spacing: 0;
      line-height: 1.35;
    }

    .domenea-360-hint { white-space: nowrap; }

    .domenea-360-viewer .pnlm-container { background: #0c120d; font-family: inherit; }
    .domenea-360-viewer .pnlm-controls-container,
    .domenea-360-viewer .pnlm-about-msg,
    .domenea-360-viewer .pnlm-load-box,
    .domenea-360-viewer .pnlm-panorama-info { display: none !important; }

    .domenea-360-viewer .pnlm-hotspot-base {
      width: 1rem;
      height: 1rem;
      margin: -.5rem 0 0 -.5rem;
      border: 1px solid #f4f4ef;
      border-radius: 50%;
      background: rgba(244,244,239,.2);
      box-shadow: 0 0 0 .55rem rgba(244,244,239,.08);
    }

    .domenea-360-viewer .pnlm-tooltip span {
      min-width: 12rem;
      padding: .75rem .85rem !important;
      border-radius: 0 !important;
      color: #172119 !important;
      background: #e9e8df !important;
      font-family: inherit;
      font-size: .7rem;
      line-height: 1.45;
      box-shadow: none !important;
    }

    @media (max-width: 700px) {
      .domenea-360-entry {
        right: var(--pad);
        bottom: 1.15rem;
      }

      .domenea-360-entry span { display: none; }
      .domenea-360-entry::before { width: 3.2rem; height: 3.2rem; }
      .domenea-360-entry::after { left: 1.6rem; top: 1.6rem; }

      .domenea-360-top {
        padding-top: max(1rem, env(safe-area-inset-top));
      }

      .domenea-360-brand span { display: none; }
      .domenea-360-actions { gap: .8rem; }
      .domenea-360-actions [data-360-reset],
      .domenea-360-actions [data-360-zoom-out],
      .domenea-360-actions [data-360-zoom-in] { display: none; }

      .domenea-360-bottom {
        padding-bottom: max(1rem, env(safe-area-inset-bottom));
      }

      .domenea-360-hint { display: none; }
      .domenea-360-disclaimer { font-size: .58rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .domenea-360-viewer,
      .domenea-360-entry::before,
      .domenea-360-guide { transition: none !important; }
      .domenea-360-loading-ring { animation: none; }
    }
  `;
  document.head.appendChild(style);

  const entry = document.createElement('button');
  entry.type = 'button';
  entry.className = 'domenea-360-entry';
  entry.dataset.domenea360 = '';
  entry.innerHTML = `<span><b data-fr="Explorer en 360°" data-en="Explore in 360°">${text('Explorer en 360°', 'Explore in 360°')}</b><small data-fr="Terrasse · piscine · horizon" data-en="Terrace · pool · horizon">${text('Terrasse · piscine · horizon', 'Terrace · pool · horizon')}</small></span>`;
  entry.setAttribute('aria-label', text('Explorer la terrasse et la piscine en 360 degrés', 'Explore the terrace and pool in 360 degrees'));
  residenceHero.appendChild(entry);

  const viewer = document.createElement('section');
  viewer.className = 'domenea-360-viewer';
  viewer.dataset.domenea360Viewer = '';
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-hidden', 'true');
  viewer.setAttribute('aria-label', text('Exploration 360 de TAO Passot', 'TAO Passot 360 exploration'));
  viewer.innerHTML = `
    <div class="domenea-360-top">
      <div class="domenea-360-brand"><strong>DOMENEA</strong><span>TAO Passot · 360°</span></div>
      <div class="domenea-360-actions">
        <button class="domenea-360-control" type="button" data-360-reset>${text('Recentrer', 'Reset')}</button>
        <button class="domenea-360-control" type="button" data-360-zoom-out aria-label="${text('Dézoomer', 'Zoom out')}">−</button>
        <button class="domenea-360-control" type="button" data-360-zoom-in aria-label="${text('Zoomer', 'Zoom in')}">+</button>
        <button class="domenea-360-close" type="button" data-360-close>${text('Fermer', 'Close')}</button>
      </div>
    </div>
    <div class="domenea-360-stage" data-360-stage>
      <div id="domenea-360-panorama"></div>
      <div class="domenea-360-guide">${text('Glisser', 'Drag')}</div>
      <div class="domenea-360-loading" data-360-loading>
        <div class="domenea-360-loading-inner">
          <div class="domenea-360-loading-ring" aria-hidden="true"></div>
          <p>${text('Préparation de la visite 360°…', 'Preparing the 360° experience…')}</p>
        </div>
      </div>
      <div class="domenea-360-error" data-360-error hidden>
        <p>${text('La visite 360° n’a pas pu être chargée. Vous pouvez fermer cette vue et continuer la visite du site.', 'The 360° experience could not be loaded. Close this view to continue browsing the site.')}</p>
      </div>
    </div>
    <div class="domenea-360-bottom">
      <span class="domenea-360-disclaimer">${text('Visualisation MVP illustrative — elle ne constitue pas une photographie contractuelle de TAO Passot.', 'Illustrative MVP visualisation — this is not a contractual photograph of TAO Passot.')}</span>
      <span class="domenea-360-hint">${text('Glisser pour regarder · molette pour zoomer', 'Drag to look · scroll to zoom')}</span>
    </div>
  `;
  document.body.appendChild(viewer);

  const stage = viewer.querySelector('[data-360-stage]');
  const loading = viewer.querySelector('[data-360-loading]');
  const error = viewer.querySelector('[data-360-error]');
  const closeButton = viewer.querySelector('[data-360-close]');
  const resetButton = viewer.querySelector('[data-360-reset]');
  const zoomInButton = viewer.querySelector('[data-360-zoom-in]');
  const zoomOutButton = viewer.querySelector('[data-360-zoom-out]');
  let panoramaViewer = null;
  let librariesPromise = null;
  let previousFocus = null;

  const panoramaUrl = new URL('assets/tao-passot-360.jpg', document.currentScript?.src || window.location.href).href;

  const loadStylesheet = href => new Promise((resolve, reject) => {
    if ([...document.styleSheets].some(sheet => sheet.href === href)) return resolve();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });

  const loadScript = src => new Promise((resolve, reject) => {
    if (window.pannellum) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const loadLibraries = () => {
    if (librariesPromise) return librariesPromise;
    librariesPromise = Promise.all([
      loadStylesheet('https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css'),
      loadScript('https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js')
    ]);
    return librariesPromise;
  };

  const createPanorama = async () => {
    if (panoramaViewer) {
      panoramaViewer.resize();
      return;
    }

    loading.hidden = false;
    error.hidden = true;

    try {
      await loadLibraries();
      panoramaViewer = window.pannellum.viewer('domenea-360-panorama', {
        type: 'equirectangular',
        panorama: panoramaUrl,
        autoLoad: true,
        showControls: false,
        compass: false,
        draggable: true,
        mouseZoom: true,
        doubleClickZoom: false,
        pitch: -7,
        yaw: 17,
        hfov: 104,
        minHfov: 55,
        maxHfov: 120,
        friction: .12,
        backgroundColor: [12, 18, 13],
        hotSpots: [
          { pitch: -10, yaw: 6, type: 'info', text: text('Piscine à débordement — le cœur de la vie extérieure.', 'Infinity pool — the heart of outdoor living.') },
          { pitch: -3, yaw: -52, type: 'info', text: text('Séjour ouvert — l’intérieur se prolonge naturellement vers la terrasse.', 'Open living room — the interior flows naturally onto the terrace.') },
          { pitch: -4, yaw: 50, type: 'info', text: text('L’horizon — une vue pensée pour accompagner les fins de journée.', 'The horizon — a view designed to frame the end of the day.') }
        ]
      });

      panoramaViewer.on('load', () => { loading.hidden = true; });
      panoramaViewer.on('error', () => {
        loading.hidden = true;
        error.hidden = false;
      });
    } catch (loadError) {
      console.error('[DOMENEA 360]', loadError);
      loading.hidden = true;
      error.hidden = false;
    }
  };

  const openViewer = () => {
    previousFocus = document.activeElement;
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-360-open');
    closeButton.focus({ preventScroll: true });
    createPanorama();
  };

  const closeViewer = () => {
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-360-open');
    stage.classList.remove('has-interacted');
    previousFocus?.focus?.({ preventScroll: true });
  };

  const interactive = () => stage.classList.add('has-interacted');
  stage.addEventListener('pointerdown', interactive, { passive: true });
  stage.addEventListener('wheel', interactive, { passive: true });

  entry.addEventListener('click', openViewer);
  closeButton.addEventListener('click', closeViewer);
  resetButton.addEventListener('click', () => panoramaViewer?.lookAt(-7, 17, 104, 700));
  zoomInButton.addEventListener('click', () => panoramaViewer?.setHfov(Math.max(55, panoramaViewer.getHfov() - 10), 350));
  zoomOutButton.addEventListener('click', () => panoramaViewer?.setHfov(Math.min(120, panoramaViewer.getHfov() + 10), 350));

  document.addEventListener('keydown', event => {
    if (!viewer.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeViewer();
      return;
    }

    if (event.key === 'Tab') {
      const focusable = [...viewer.querySelectorAll('button:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener('resize', () => panoramaViewer?.resize(), { passive: true });
})();