(() => {
  'use strict';

  const residenceHero = document.querySelector('.residences-hero');
  if (!residenceHero || document.querySelector('[data-domenea-360]')) return;

  const isEnglish = () => document.documentElement.lang === 'en';
  const text = (fr, en) => isEnglish() ? en : fr;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const wrap = value => ((value + 180) % 360 + 360) % 360 - 180;
  const baseUrl = new URL('.', document.currentScript?.src || window.location.href);
  const panoramaUrl = new URL('assets/tao-passot-360.jpg', baseUrl).href;
  const imageFallback = 'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%2013.jpg';

  const style = document.createElement('style');
  style.dataset.domenea360Styles = '';
  style.textContent = `
    .residences-hero { position: relative; }
    .domenea-360-entry { position:absolute; z-index:8; right:var(--pad); bottom:clamp(1.35rem,3vw,3rem); display:inline-flex; align-items:center; gap:.85rem; padding:0; border:0; color:var(--bone,#f4f4ef); background:transparent; cursor:pointer; font:inherit; text-align:left; }
    .domenea-360-entry::before { content:''; width:3rem; height:3rem; border:1px solid currentColor; border-radius:50%; background:rgba(18,30,22,.14); backdrop-filter:blur(5px); transition:transform .35s cubic-bezier(.16,1,.3,1),background .35s ease; }
    .domenea-360-entry::after { content:'360°'; position:absolute; left:1.5rem; top:1.5rem; transform:translate(-50%,-50%); font-size:.63rem; font-weight:600; letter-spacing:.07em; }
    .domenea-360-entry:hover::before,.domenea-360-entry:focus-visible::before { transform:scale(1.12); background:rgba(244,244,239,.12); }
    .domenea-360-entry span { display:grid; gap:.18rem; font-size:.72rem; line-height:1.2; letter-spacing:.08em; text-transform:uppercase; }
    .domenea-360-entry small { color:rgba(244,244,239,.68); font-size:.56rem; letter-spacing:.1em; }
    .domenea-360-entry:focus-visible,.domenea-360-control:focus-visible,.domenea-360-close:focus-visible { outline:2px solid currentColor; outline-offset:5px; }

    .domenea-360-viewer { position:fixed; inset:0; z-index:220; display:grid; grid-template-rows:auto 1fr auto; color:#f4f4ef; background:#101711; opacity:0; visibility:hidden; pointer-events:none; transition:opacity .42s cubic-bezier(.16,1,.3,1),visibility .42s step-end; }
    .domenea-360-viewer.is-open { opacity:1; visibility:visible; pointer-events:auto; transition:opacity .42s cubic-bezier(.16,1,.3,1),visibility 0s step-start; }
    body.is-360-open { overflow:hidden !important; }
    body.is-360-open [data-domenea-cursor] { opacity:0 !important; }

    .domenea-360-top,.domenea-360-bottom { position:relative; z-index:5; display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:1.1rem var(--pad); background:#101711; }
    .domenea-360-brand { display:flex; align-items:baseline; gap:.7rem; min-width:0; }
    .domenea-360-brand strong { font-size:.76rem; letter-spacing:.08em; }
    .domenea-360-brand span,.domenea-360-bottom { color:rgba(244,244,239,.65); font-size:.64rem; letter-spacing:.08em; text-transform:uppercase; }
    .domenea-360-actions { display:flex; align-items:center; gap:1.1rem; }
    .domenea-360-control,.domenea-360-close { padding:.35rem 0; border:0; border-bottom:1px solid rgba(244,244,239,.38); color:#f4f4ef; background:transparent; cursor:pointer; font:inherit; font-size:.64rem; letter-spacing:.08em; text-transform:uppercase; }

    .domenea-360-stage { position:relative; min-height:0; overflow:hidden; background:#0c120d; touch-action:none; cursor:grab; user-select:none; }
    .domenea-360-stage.is-dragging { cursor:grabbing; }
    .domenea-360-viewport { position:absolute; inset:0; overflow:hidden; }
    .domenea-360-track { position:absolute; left:0; top:0; height:100%; display:flex; will-change:transform; transform-origin:center center; }
    .domenea-360-pane { position:relative; flex:0 0 auto; overflow:hidden; background:#152019; }
    .domenea-360-pane img { display:block; width:100%; height:100%; object-fit:cover; pointer-events:none; user-select:none; -webkit-user-drag:none; }
    .domenea-360-pane::after { content:''; position:absolute; inset:0; pointer-events:none; background:linear-gradient(180deg,rgba(5,12,8,.05),transparent 28%,transparent 70%,rgba(5,12,8,.08)); }

    .domenea-360-guide { position:absolute; z-index:4; left:50%; top:50%; transform:translate(-50%,-50%); width:6rem; height:6rem; display:grid; place-items:center; border:1px solid rgba(244,244,239,.34); border-radius:50%; color:#f4f4ef; background:rgba(15,23,17,.12); backdrop-filter:blur(4px); font-size:.62rem; letter-spacing:.14em; text-transform:uppercase; pointer-events:none; transition:opacity .4s ease; }
    .domenea-360-stage.has-interacted .domenea-360-guide { opacity:0; }

    .domenea-360-hotspot { position:absolute; z-index:3; width:1rem; height:1rem; margin:-.5rem 0 0 -.5rem; padding:0; border:1px solid #f4f4ef; border-radius:50%; background:rgba(244,244,239,.22); box-shadow:0 0 0 .55rem rgba(244,244,239,.08); color:#172119; cursor:pointer; }
    .domenea-360-hotspot span { position:absolute; left:50%; bottom:calc(100% + 1rem); width:max-content; max-width:min(17rem,72vw); padding:.72rem .82rem; color:#172119; background:#e9e8df; font-size:.7rem; line-height:1.45; text-align:left; opacity:0; visibility:hidden; transform:translate(-50%,.3rem); transition:opacity .18s ease,transform .18s ease,visibility .18s step-end; pointer-events:none; }
    .domenea-360-hotspot:hover span,.domenea-360-hotspot:focus-visible span,.domenea-360-hotspot.is-active span { opacity:1; visibility:visible; transform:translate(-50%,0); transition:opacity .18s ease,transform .18s ease,visibility 0s step-start; }

    .domenea-360-loading,.domenea-360-error { position:absolute; inset:0; z-index:6; display:grid; place-items:center; padding:2rem; text-align:center; background:#101711; transition:opacity .3s ease,visibility .3s ease; }
    .domenea-360-loading[hidden],.domenea-360-error[hidden] { opacity:0; visibility:hidden; pointer-events:none; display:grid; }
    .domenea-360-loading-inner { display:grid; gap:1rem; justify-items:center; max-width:32rem; }
    .domenea-360-loading-ring { width:3.5rem; height:3.5rem; border:1px solid rgba(244,244,239,.18); border-top-color:#f4f4ef; border-radius:50%; animation:domenea360Spin 1s linear infinite; }
    @keyframes domenea360Spin { to { transform:rotate(360deg); } }
    .domenea-360-loading p,.domenea-360-error p { margin:0; color:rgba(244,244,239,.7); font-size:.83rem; line-height:1.55; }
    .domenea-360-disclaimer { max-width:45rem; text-transform:none; letter-spacing:0; line-height:1.35; }
    .domenea-360-hint { white-space:nowrap; }

    @media (max-width:700px) {
      .domenea-360-entry { right:var(--pad); bottom:1.15rem; }
      .domenea-360-entry span { display:none; }
      .domenea-360-entry::before { width:3.2rem; height:3.2rem; }
      .domenea-360-entry::after { left:1.6rem; top:1.6rem; }
      .domenea-360-top { padding-top:max(1rem,env(safe-area-inset-top)); }
      .domenea-360-brand span { display:none; }
      .domenea-360-actions { gap:.8rem; }
      .domenea-360-bottom { padding-bottom:max(1rem,env(safe-area-inset-bottom)); }
      .domenea-360-hint { display:none; }
      .domenea-360-disclaimer { font-size:.58rem; }
    }

    @media (prefers-reduced-motion:reduce) {
      .domenea-360-viewer,.domenea-360-entry::before,.domenea-360-guide { transition:none !important; }
      .domenea-360-loading-ring { animation:none; }
    }
  `;
  document.head.appendChild(style);

  const entry = document.createElement('button');
  entry.type = 'button';
  entry.className = 'domenea-360-entry';
  entry.dataset.domenea360 = '';
  entry.innerHTML = `<span><b data-fr="Explorer en 360°" data-en="Explore in 360°">${text('Explorer en 360°','Explore in 360°')}</b><small data-fr="Terrasse · piscine · horizon" data-en="Terrace · pool · horizon">${text('Terrasse · piscine · horizon','Terrace · pool · horizon')}</small></span>`;
  entry.setAttribute('aria-label', text('Explorer la terrasse et la piscine en 360 degrés','Explore the terrace and pool in 360 degrees'));
  residenceHero.appendChild(entry);

  const viewer = document.createElement('section');
  viewer.className = 'domenea-360-viewer';
  viewer.dataset.domenea360Viewer = '';
  viewer.setAttribute('role','dialog');
  viewer.setAttribute('aria-modal','true');
  viewer.setAttribute('aria-hidden','true');
  viewer.setAttribute('aria-label', text('Exploration 360 de TAO Passot','TAO Passot 360 exploration'));
  viewer.innerHTML = `
    <div class="domenea-360-top">
      <div class="domenea-360-brand"><strong>DOMENEA</strong><span>TAO Passot · 360°</span></div>
      <div class="domenea-360-actions">
        <button class="domenea-360-control" type="button" data-360-reset>${text('Recentrer','Reset')}</button>
        <button class="domenea-360-control" type="button" data-360-zoom-out aria-label="${text('Dézoomer','Zoom out')}">−</button>
        <button class="domenea-360-control" type="button" data-360-zoom-in aria-label="${text('Zoomer','Zoom in')}">+</button>
        <button class="domenea-360-close" type="button" data-360-close>${text('Fermer','Close')}</button>
      </div>
    </div>
    <div class="domenea-360-stage" data-360-stage>
      <div class="domenea-360-viewport" data-360-viewport></div>
      <div class="domenea-360-guide">${text('Glisser','Drag')}</div>
      <div class="domenea-360-loading" data-360-loading>
        <div class="domenea-360-loading-inner"><div class="domenea-360-loading-ring" aria-hidden="true"></div><p>${text('Préparation de la visite 360°…','Preparing the 360° experience…')}</p></div>
      </div>
      <div class="domenea-360-error" data-360-error hidden><p>${text('Le panorama n’a pas pu être chargé. Vous pouvez fermer cette vue et continuer la visite du site.','The panorama could not be loaded. Close this view to continue browsing the site.')}</p></div>
    </div>
    <div class="domenea-360-bottom">
      <span class="domenea-360-disclaimer">${text('Visualisation MVP illustrative — elle ne constitue pas une photographie contractuelle de TAO Passot.','Illustrative MVP visualisation — this is not a contractual photograph of TAO Passot.')}</span>
      <span class="domenea-360-hint">${text('Glisser pour regarder · molette pour zoomer','Drag to look · scroll to zoom')}</span>
    </div>
  `;
  document.body.appendChild(viewer);

  const stage = viewer.querySelector('[data-360-stage]');
  const viewport = viewer.querySelector('[data-360-viewport]');
  const loading = viewer.querySelector('[data-360-loading]');
  const error = viewer.querySelector('[data-360-error]');
  const closeButton = viewer.querySelector('[data-360-close]');
  const resetButton = viewer.querySelector('[data-360-reset]');
  const zoomInButton = viewer.querySelector('[data-360-zoom-in]');
  const zoomOutButton = viewer.querySelector('[data-360-zoom-out]');

  const state = { yaw:17, pitch:-5, zoom:1, paneWidth:0, paneHeight:0, ready:false, fallback:false };
  let track = null;
  let previousFocus = null;
  let dragging = false;
  let pointerId = null;
  let lastX = 0;
  let lastY = 0;
  let raf = 0;

  const hotspots = [
    { x:52, y:62, fr:'Piscine à débordement — le cœur de la vie extérieure.', en:'Infinity pool — the heart of outdoor living.' },
    { x:28, y:47, fr:'Séjour ouvert — l’intérieur se prolonge naturellement vers la terrasse.', en:'Open living room — the interior flows naturally onto the terrace.' },
    { x:77, y:38, fr:'L’horizon — une vue pensée pour accompagner les fins de journée.', en:'The horizon — a view designed to frame the end of the day.' }
  ];

  const scheduleRender = () => {
    if (!raf) raf = requestAnimationFrame(render);
  };

  const buildTrack = source => {
    viewport.innerHTML = '';
    track = document.createElement('div');
    track.className = 'domenea-360-track';

    for (let copy = 0; copy < 3; copy += 1) {
      const pane = document.createElement('div');
      pane.className = 'domenea-360-pane';
      const image = document.createElement('img');
      image.src = source;
      image.alt = '';
      image.draggable = false;
      pane.appendChild(image);

      hotspots.forEach((spot, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'domenea-360-hotspot';
        button.style.left = `${spot.x}%`;
        button.style.top = `${spot.y}%`;
        const label = text(spot.fr, spot.en);
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
    loading.hidden = true;
    error.hidden = true;
    resize();
    scheduleRender();
  };

  const loadPanorama = () => {
    if (state.ready) return;
    loading.hidden = false;
    error.hidden = true;

    const probe = new Image();
    probe.decoding = 'async';
    probe.onload = () => buildTrack(panoramaUrl);
    probe.onerror = () => {
      state.fallback = true;
      const fallbackProbe = new Image();
      fallbackProbe.decoding = 'async';
      fallbackProbe.onload = () => buildTrack(imageFallback);
      fallbackProbe.onerror = () => {
        loading.hidden = true;
        error.hidden = false;
      };
      fallbackProbe.src = imageFallback;
    };
    probe.src = panoramaUrl;
  };

  function resize() {
    if (!track || !state.ready) return;
    const width = Math.max(1, stage.clientWidth);
    const height = Math.max(1, stage.clientHeight);
    state.paneWidth = Math.max(width, height * 2);
    state.paneHeight = state.paneWidth / 2;
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
    const panPx = state.yaw / 360 * state.paneWidth;
    const pitchPx = state.pitch / 55 * Math.max(40, state.paneHeight * .14);
    const baseX = stageW / 2 - state.paneWidth * 1.5 + panPx;
    const baseY = stageH / 2 - state.paneHeight / 2 + pitchPx;
    track.style.transform = `translate3d(${baseX}px,${baseY}px,0) scale(${state.zoom})`;
  }

  const openViewer = () => {
    previousFocus = document.activeElement;
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden','false');
    document.body.classList.add('is-360-open');
    closeButton.focus({ preventScroll:true });
    loadPanorama();
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
    state.pitch = -5;
    state.zoom = 1;
    stage.classList.remove('has-interacted');
    scheduleRender();
  };

  const zoom = direction => {
    state.zoom = clamp(state.zoom + direction * .12, .92, 1.55);
    stage.classList.add('has-interacted');
    scheduleRender();
  };

  entry.addEventListener('click', openViewer);
  closeButton.addEventListener('click', closeViewer);
  resetButton.addEventListener('click', resetView);
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
    if (!dragging || event.pointerId !== pointerId) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    state.yaw = wrap(state.yaw + dx * .13 / state.zoom);
    state.pitch = clamp(state.pitch + dy * .08 / state.zoom, -34, 34);
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

  window.addEventListener('resize', resize, { passive:true });
  document.addEventListener('keydown', event => {
    if (!viewer.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeViewer();
    }
  });
})();