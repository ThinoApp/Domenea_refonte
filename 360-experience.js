(() => {
  'use strict';

  const residenceHero = document.querySelector('.residences-hero');
  if (!residenceHero || document.querySelector('[data-domenea-360]')) return;

  const isEnglish = () => document.documentElement.lang === 'en';
  const t = (fr, en) => isEnglish() ? en : fr;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = value => ((value + 180) % 360 + 360) % 360 - 180;
  const baseUrl = new URL('.', document.currentScript?.src || window.location.href);
  const panoramaUrl = new URL('assets/tao-passot-360-clean.jpg?v=1', baseUrl).href;

  const style = document.createElement('style');
  style.dataset.domenea360Styles = '';
  style.textContent = `
    .residences-hero{position:relative}
    .domenea-360-entry{position:absolute;z-index:8;right:var(--pad);bottom:clamp(1.35rem,3vw,3rem);display:inline-flex;align-items:center;gap:.85rem;padding:0;border:0;color:var(--bone,#f4f4ef);background:transparent;cursor:pointer;font:inherit;text-align:left}
    .domenea-360-entry::before{content:'';width:3rem;height:3rem;border:1px solid currentColor;border-radius:50%;background:rgba(18,30,22,.14);backdrop-filter:blur(5px);transition:transform .35s cubic-bezier(.16,1,.3,1),background .35s ease}
    .domenea-360-entry::after{content:'360°';position:absolute;left:1.5rem;top:1.5rem;transform:translate(-50%,-50%);font-size:.63rem;font-weight:600;letter-spacing:.07em}
    .domenea-360-entry:hover::before,.domenea-360-entry:focus-visible::before{transform:scale(1.12);background:rgba(244,244,239,.12)}
    .domenea-360-entry span{display:grid;gap:.18rem;font-size:.72rem;line-height:1.2;letter-spacing:.08em;text-transform:uppercase}
    .domenea-360-entry small{color:rgba(244,244,239,.68);font-size:.56rem;letter-spacing:.1em}
    .domenea-360-entry:focus-visible,.domenea-360-control:focus-visible,.domenea-360-close:focus-visible,.domenea-360-hotspot:focus-visible{outline:2px solid currentColor;outline-offset:5px}

    .domenea-360-viewer{position:fixed;inset:0;z-index:220;display:grid;grid-template-rows:auto minmax(0,1fr) auto;color:#f4f4ef;background:#101711;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .42s cubic-bezier(.16,1,.3,1),visibility .42s step-end}
    .domenea-360-viewer.is-open{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .42s cubic-bezier(.16,1,.3,1),visibility 0s step-start}
    body.is-360-open{overflow:hidden!important}
    body.is-360-open [data-domenea-cursor]{opacity:0!important}

    .domenea-360-top,.domenea-360-bottom{position:relative;z-index:6;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.05rem var(--pad);background:#101711}
    .domenea-360-brand{display:flex;align-items:baseline;gap:.7rem;min-width:0}
    .domenea-360-brand strong{font-size:.76rem;letter-spacing:.08em}
    .domenea-360-brand span,.domenea-360-bottom{color:rgba(244,244,239,.64);font-size:.64rem;letter-spacing:.08em;text-transform:uppercase}
    .domenea-360-actions{display:flex;align-items:center;gap:1.05rem}
    .domenea-360-control,.domenea-360-close{padding:.35rem 0;border:0;border-bottom:1px solid rgba(244,244,239,.38);color:#f4f4ef;background:transparent;cursor:pointer;font:inherit;font-size:.64rem;letter-spacing:.08em;text-transform:uppercase}

    .domenea-360-stage{position:relative;min-height:0;overflow:hidden;background:#101711;touch-action:none;cursor:grab;user-select:none}
    .domenea-360-stage.is-dragging{cursor:grabbing}
    .domenea-360-viewport{position:absolute;inset:0;overflow:hidden;background:#101711}
    .domenea-360-track{position:absolute;left:0;top:0;display:flex;will-change:transform;transform-origin:center center}
    .domenea-360-pane{position:relative;flex:0 0 auto;overflow:hidden;background-color:#101711;background-repeat:no-repeat;background-position:center center;background-size:100% 100%}
    .domenea-360-pane::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(5,12,8,.04),transparent 24%,transparent 72%,rgba(5,12,8,.08))}

    .domenea-360-guide{position:absolute;z-index:5;left:50%;top:50%;transform:translate(-50%,-50%);width:6rem;height:6rem;display:grid;place-items:center;border:1px solid rgba(244,244,239,.34);border-radius:50%;color:#f4f4ef;background:rgba(15,23,17,.12);backdrop-filter:blur(4px);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;pointer-events:none;transition:opacity .4s ease}
    .domenea-360-stage.has-interacted .domenea-360-guide{opacity:0}

    .domenea-360-hotspot{position:absolute;z-index:4;width:1rem;height:1rem;margin:-.5rem 0 0 -.5rem;padding:0;border:1px solid #f4f4ef;border-radius:50%;background:rgba(244,244,239,.22);box-shadow:0 0 0 .55rem rgba(244,244,239,.08);color:#172119;cursor:pointer}
    .domenea-360-hotspot span{position:absolute;left:50%;bottom:calc(100% + 1rem);width:max-content;max-width:min(17rem,72vw);padding:.72rem .82rem;color:#172119;background:#e9e8df;font-size:.7rem;line-height:1.45;text-align:left;opacity:0;visibility:hidden;transform:translate(-50%,.3rem);transition:opacity .18s ease,transform .18s ease,visibility .18s step-end;pointer-events:none}
    .domenea-360-hotspot:hover span,.domenea-360-hotspot:focus-visible span,.domenea-360-hotspot.is-active span{opacity:1;visibility:visible;transform:translate(-50%,0);transition:opacity .18s ease,transform .18s ease,visibility 0s step-start}

    .domenea-360-loading,.domenea-360-error{position:absolute;inset:0;z-index:7;display:grid;place-items:center;padding:2rem;text-align:center;background:#101711;transition:opacity .25s ease,visibility .25s ease}
    .domenea-360-loading[hidden],.domenea-360-error[hidden]{opacity:0;visibility:hidden;pointer-events:none}
    .domenea-360-loading-inner{display:grid;gap:1rem;justify-items:center;max-width:34rem}
    .domenea-360-loading-line{width:min(16rem,52vw);height:1px;background:rgba(244,244,239,.18);overflow:hidden}
    .domenea-360-loading-line::after{content:'';display:block;width:42%;height:100%;background:#f4f4ef;animation:domenea360Load 1.2s cubic-bezier(.16,1,.3,1) infinite alternate}
    @keyframes domenea360Load{from{transform:translateX(-105%)}to{transform:translateX(250%)}}
    .domenea-360-loading p,.domenea-360-error p{margin:0;color:rgba(244,244,239,.7);font-size:.83rem;line-height:1.55}
    .domenea-360-error button{margin-top:1rem;color:#f4f4ef;background:transparent;border:0;border-bottom:1px solid rgba(244,244,239,.5);padding:.3rem 0;cursor:pointer;text-transform:uppercase;letter-spacing:.08em;font-size:.64rem}
    .domenea-360-disclaimer{max-width:46rem;text-transform:none;letter-spacing:0;line-height:1.35}
    .domenea-360-hint{white-space:nowrap}

    @media(max-width:700px){
      .domenea-360-entry{right:var(--pad);bottom:1.15rem}.domenea-360-entry span{display:none}.domenea-360-entry::before{width:3.2rem;height:3.2rem}.domenea-360-entry::after{left:1.6rem;top:1.6rem}
      .domenea-360-top{padding-top:max(1rem,env(safe-area-inset-top))}.domenea-360-brand span{display:none}.domenea-360-actions{gap:.75rem}.domenea-360-bottom{padding-bottom:max(1rem,env(safe-area-inset-bottom))}.domenea-360-hint{display:none}.domenea-360-disclaimer{font-size:.58rem}
    }
    @media(prefers-reduced-motion:reduce){.domenea-360-viewer,.domenea-360-entry::before,.domenea-360-guide{transition:none!important}.domenea-360-loading-line::after{animation:none}}
  `;
  document.head.appendChild(style);

  const entry = document.createElement('button');
  entry.type = 'button';
  entry.className = 'domenea-360-entry';
  entry.dataset.domenea360 = '';
  entry.innerHTML = `<span><b>${t('Explorer en 360°','Explore in 360°')}</b><small>${t('Terrasse · piscine · horizon','Terrace · pool · horizon')}</small></span>`;
  entry.setAttribute('aria-label', t('Explorer la terrasse et la piscine en 360 degrés','Explore the terrace and pool in 360 degrees'));
  residenceHero.appendChild(entry);

  const viewer = document.createElement('section');
  viewer.className = 'domenea-360-viewer';
  viewer.dataset.domenea360Viewer = '';
  viewer.setAttribute('role','dialog');
  viewer.setAttribute('aria-modal','true');
  viewer.setAttribute('aria-hidden','true');
  viewer.setAttribute('aria-label', t('Exploration 360 de TAO Passot','TAO Passot 360 exploration'));
  viewer.innerHTML = `
    <div class="domenea-360-top">
      <div class="domenea-360-brand"><strong>DOMENEA</strong><span>TAO Passot · 360°</span></div>
      <div class="domenea-360-actions">
        <button class="domenea-360-control" type="button" data-360-reset>${t('Recentrer','Reset')}</button>
        <button class="domenea-360-control" type="button" data-360-zoom-out aria-label="${t('Dézoomer','Zoom out')}">−</button>
        <button class="domenea-360-control" type="button" data-360-zoom-in aria-label="${t('Zoomer','Zoom in')}">+</button>
        <button class="domenea-360-close" type="button" data-360-close>${t('Fermer','Close')}</button>
      </div>
    </div>
    <div class="domenea-360-stage" data-360-stage>
      <div class="domenea-360-viewport" data-360-viewport></div>
      <div class="domenea-360-guide">${t('Glisser','Drag')}</div>
      <div class="domenea-360-loading" data-360-loading>
        <div class="domenea-360-loading-inner"><div class="domenea-360-loading-line" aria-hidden="true"></div><p>${t('Préparation de la visite 360°…','Preparing the 360° experience…')}</p></div>
      </div>
      <div class="domenea-360-error" data-360-error hidden><div><p data-360-error-copy></p><button type="button" data-360-retry>${t('Réessayer','Retry')}</button></div></div>
    </div>
    <div class="domenea-360-bottom">
      <span class="domenea-360-disclaimer">${t('Visualisation MVP illustrative — elle ne constitue pas une photographie contractuelle de TAO Passot.','Illustrative MVP visualisation — this is not a contractual photograph of TAO Passot.')}</span>
      <span class="domenea-360-hint">${t('Glisser pour regarder · molette pour zoomer','Drag to look · scroll to zoom')}</span>
    </div>
  `;
  document.body.appendChild(viewer);

  const stage = viewer.querySelector('[data-360-stage]');
  const viewport = viewer.querySelector('[data-360-viewport]');
  const loading = viewer.querySelector('[data-360-loading]');
  const error = viewer.querySelector('[data-360-error]');
  const errorCopy = viewer.querySelector('[data-360-error-copy]');
  const retryButton = viewer.querySelector('[data-360-retry]');
  const closeButton = viewer.querySelector('[data-360-close]');
  const resetButton = viewer.querySelector('[data-360-reset]');
  const zoomInButton = viewer.querySelector('[data-360-zoom-in]');
  const zoomOutButton = viewer.querySelector('[data-360-zoom-out]');

  const state = { yaw:17, pitch:0, zoom:1, paneWidth:0, paneHeight:0, ready:false };
  let track = null;
  let previousFocus = null;
  let dragging = false;
  let pointerId = null;
  let lastX = 0;
  let lastY = 0;
  let raf = 0;
  let resizeObserver = null;

  const hotspots = [
    { x:52, y:64, fr:'Piscine à débordement — le cœur de la vie extérieure.', en:'Infinity pool — the heart of outdoor living.' },
    { x:30, y:47, fr:'Séjour ouvert — l’intérieur se prolonge naturellement vers la terrasse.', en:'Open living room — the interior flows naturally onto the terrace.' },
    { x:78, y:35, fr:'L’horizon — une vue pensée pour accompagner les fins de journée.', en:'The horizon — a view designed to frame the end of the day.' }
  ];

  const scheduleRender = () => { if (!raf) raf = requestAnimationFrame(render); };

  const hideStatus = () => {
    loading.hidden = true;
    error.hidden = true;
  };

  const showError = message => {
    loading.hidden = true;
    errorCopy.textContent = message;
    error.hidden = false;
  };

  const validatePanorama = () => new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    const timeout = setTimeout(() => reject(new Error('timeout')), 10000);
    img.onload = () => {
      clearTimeout(timeout);
      const ratio = img.naturalWidth / Math.max(1, img.naturalHeight);
      if (img.naturalWidth < 400 || img.naturalHeight < 200 || Math.abs(ratio - 2) > .08) {
        reject(new Error(`invalid dimensions ${img.naturalWidth}x${img.naturalHeight}`));
        return;
      }
      console.info('[DOMENEA 360] panorama ready', img.naturalWidth, img.naturalHeight, panoramaUrl);
      resolve(img);
    };
    img.onerror = () => { clearTimeout(timeout); reject(new Error('image load failed')); };
    img.src = panoramaUrl;
  });

  const buildTrack = () => {
    viewport.innerHTML = '';
    track = document.createElement('div');
    track.className = 'domenea-360-track';

    for (let copy = 0; copy < 3; copy += 1) {
      const pane = document.createElement('div');
      pane.className = 'domenea-360-pane';
      pane.style.backgroundImage = `url("${panoramaUrl}")`;

      hotspots.forEach(spot => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'domenea-360-hotspot';
        button.style.left = `${spot.x}%`;
        button.style.top = `${spot.y}%`;
        const label = t(spot.fr, spot.en);
        button.setAttribute('aria-label', label);
        button.innerHTML = `<span>${label}</span>`;
        button.addEventListener('click', event => {
          event.stopPropagation();
          const active = !button.classList.contains('is-active');
          viewport.querySelectorAll('.domenea-360-hotspot').forEach(node => node.classList.remove('is-active'));
          button.classList.toggle('is-active', active);
        });
        pane.appendChild(button);
      });

      track.appendChild(pane);
    }

    viewport.appendChild(track);
    state.ready = true;
    resize();
    hideStatus();
    scheduleRender();
  };

  const loadPanorama = async () => {
    state.ready = false;
    loading.hidden = false;
    error.hidden = true;
    try {
      await validatePanorama();
      buildTrack();
    } catch (err) {
      console.error('[DOMENEA 360] panorama validation failed', err);
      showError(t(
        'Le panorama 360° n’a pas pu être validé. Rechargez la page puis réessayez.',
        'The 360° panorama could not be validated. Reload the page and try again.'
      ));
    }
  };

  function resize() {
    if (!track || !state.ready) return;
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);

    // Always oversize vertically. This guarantees there can never be an exposed
    // grey strip, even while the user pitches or zooms the panorama.
    state.paneHeight = height * 1.18;
    state.paneWidth = state.paneHeight * 2;

    track.style.width = `${state.paneWidth * 3}px`;
    track.style.height = `${state.paneHeight}px`;
    [...track.children].forEach(pane => {
      pane.style.width = `${state.paneWidth}px`;
      pane.style.height = `${state.paneHeight}px`;
    });
    scheduleRender();
  }

  function render() {
    raf = 0;
    if (!track || !state.ready) return;

    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;
    const scaledH = state.paneHeight * state.zoom;
    const maxVertical = Math.max(0, (scaledH - stageH) * .46);
    const pitchOffset = clamp(state.pitch / 28, -1, 1) * maxVertical;
    const panPx = state.yaw / 360 * state.paneWidth;
    const baseX = stageW / 2 - state.paneWidth * 1.5 + panPx;
    const baseY = stageH / 2 - state.paneHeight / 2 + pitchOffset;

    track.style.transform = `translate3d(${baseX}px,${baseY}px,0) scale(${state.zoom})`;
  }

  const openViewer = () => {
    previousFocus = document.activeElement;
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden','false');
    document.body.classList.add('is-360-open');
    closeButton.focus({ preventScroll:true });
    if (!state.ready) loadPanorama();
    requestAnimationFrame(resize);
  };

  const closeViewer = () => {
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-360-open');
    stage.classList.remove('is-dragging','has-interacted');
    dragging = false;
    pointerId = null;
    previousFocus?.focus?.({ preventScroll:true });
  };

  const resetView = () => {
    state.yaw = 17;
    state.pitch = 0;
    state.zoom = 1;
    stage.classList.remove('has-interacted');
    scheduleRender();
  };

  const zoom = direction => {
    state.zoom = clamp(state.zoom + direction * .1, 1, 1.5);
    stage.classList.add('has-interacted');
    scheduleRender();
  };

  entry.addEventListener('click', openViewer);
  closeButton.addEventListener('click', closeViewer);
  resetButton.addEventListener('click', resetView);
  retryButton.addEventListener('click', loadPanorama);
  zoomInButton.addEventListener('click', () => zoom(1));
  zoomOutButton.addEventListener('click', () => zoom(-1));

  stage.addEventListener('pointerdown', event => {
    if (event.button !== undefined && event.button !== 0) return;
    dragging = true;
    pointerId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    stage.classList.add('is-dragging','has-interacted');
    stage.setPointerCapture?.(pointerId);
  });

  stage.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== pointerId || !state.ready) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    state.yaw = wrap(state.yaw + dx * .14 / state.zoom);
    state.pitch = clamp(state.pitch + dy * .08 / state.zoom, -28, 28);
    scheduleRender();
  });

  const endDrag = event => {
    if (!dragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    try { stage.releasePointerCapture?.(pointerId); } catch (_) {}
    pointerId = null;
  };

  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('wheel', event => {
    if (!viewer.classList.contains('is-open')) return;
    event.preventDefault();
    zoom(event.deltaY < 0 ? 1 : -1);
  }, { passive:false });

  document.addEventListener('keydown', event => {
    if (!viewer.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeViewer();
    }
  });

  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
})();