(() => {
  'use strict';

  const residenceHero = document.querySelector('.residences-hero');
  if (!residenceHero || document.querySelector('[data-domenea360]')) return;

  const currentScript = document.currentScript;
  const baseUrl = new URL('.', currentScript?.src || window.location.href);
  const panoIndexUrl = new URL('pano2vr/index.html?v=hd-20260908-2', baseUrl);
  const panoProbeUrl = new URL('pano2vr/pano.xml?v=hd-20260908-2', baseUrl);
  const fallbackImageUrl = new URL('assets/tao-passot-360-clean.jpg?v=3', baseUrl);
  const isEnglish = () => document.documentElement.lang === 'en';
  const t = (fr, en) => isEnglish() ? en : fr;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const style = document.createElement('style');
  style.dataset.domenea360Styles = '';
  style.textContent = `
    .residences-hero{position:relative}
    .domenea-360-entry{position:absolute;z-index:8;right:var(--pad);bottom:clamp(1.35rem,3vw,3rem);display:inline-flex;align-items:center;gap:.85rem;padding:0;border:0;color:var(--bone,#f4f4ef);background:transparent;cursor:pointer;font:inherit;text-align:left}
    .domenea-360-entry::before{content:'';width:3rem;height:3rem;border:1px solid currentColor;border-radius:50%;background:rgba(18,30,22,.16);backdrop-filter:blur(5px);transition:transform .35s cubic-bezier(.16,1,.3,1),background .35s ease}
    .domenea-360-entry::after{content:'360°';position:absolute;left:1.5rem;top:1.5rem;transform:translate(-50%,-50%);font-size:.63rem;font-weight:600;letter-spacing:.07em}
    .domenea-360-entry:hover::before,.domenea-360-entry:focus-visible::before{transform:scale(1.12);background:rgba(244,244,239,.12)}
    .domenea-360-entry span{display:grid;gap:.18rem;font-size:.72rem;line-height:1.2;letter-spacing:.08em;text-transform:uppercase}
    .domenea-360-entry small{color:rgba(244,244,239,.68);font-size:.56rem;letter-spacing:.1em}
    .domenea-360-entry:focus-visible,.domenea-360-close:focus-visible{outline:2px solid currentColor;outline-offset:5px}

    .domenea-360-viewer{position:fixed;inset:0;z-index:220;display:grid;grid-template-rows:auto minmax(0,1fr) auto;color:#f4f4ef;background:#101711;opacity:0;visibility:hidden;pointer-events:none;transition:opacity .35s cubic-bezier(.16,1,.3,1),visibility .35s step-end}
    .domenea-360-viewer.is-open{opacity:1;visibility:visible;pointer-events:auto;transition:opacity .35s cubic-bezier(.16,1,.3,1),visibility 0s step-start}
    body.is-360-open{overflow:hidden!important}
    body.is-360-open [data-domenea-cursor]{opacity:0!important}

    .domenea-360-top,.domenea-360-bottom{position:relative;z-index:6;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem var(--pad);background:#101711}
    .domenea-360-brand{display:flex;align-items:baseline;gap:.72rem;min-width:0}
    .domenea-360-brand strong{font-size:.76rem;letter-spacing:.08em}
    .domenea-360-brand span,.domenea-360-bottom{color:rgba(244,244,239,.64);font-size:.62rem;letter-spacing:.08em;text-transform:uppercase}
    .domenea-360-close{padding:.35rem 0;border:0;border-bottom:1px solid rgba(244,244,239,.42);color:#f4f4ef;background:transparent;cursor:pointer;font:inherit;font-size:.64rem;letter-spacing:.08em;text-transform:uppercase}

    .domenea-360-stage{position:relative;min-height:0;overflow:hidden;background:#101711}
    .domenea-360-frame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#101711;opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s step-end}
    .domenea-360-stage.is-pano-ready .domenea-360-frame{opacity:1;visibility:visible;transition:opacity .3s ease,visibility 0s step-start}

    .domenea-360-loading{position:absolute;inset:0;z-index:4;display:grid;place-items:center;padding:2rem;text-align:center;background:#101711;transition:opacity .25s ease,visibility .25s ease}
    .domenea-360-loading[hidden]{opacity:0;visibility:hidden;pointer-events:none}
    .domenea-360-loading-inner{display:grid;gap:1rem;justify-items:center;max-width:34rem}
    .domenea-360-loading-line{width:min(16rem,52vw);height:1px;background:rgba(244,244,239,.18);overflow:hidden}
    .domenea-360-loading-line::after{content:'';display:block;width:42%;height:100%;background:#f4f4ef;animation:domenea360Load 1.15s cubic-bezier(.16,1,.3,1) infinite alternate}
    @keyframes domenea360Load{from{transform:translateX(-105%)}to{transform:translateX(250%)}}
    .domenea-360-loading p{margin:0;color:rgba(244,244,239,.7);font-size:.82rem;line-height:1.55}

    .domenea-360-fallback{position:absolute;inset:0;display:none;overflow:hidden;background:#101711;touch-action:none;cursor:grab;user-select:none}
    .domenea-360-fallback.is-visible{display:block}
    .domenea-360-fallback.is-dragging{cursor:grabbing}
    .domenea-360-fallback-track{position:absolute;left:0;top:0;display:flex;height:100%;will-change:transform}
    .domenea-360-fallback-pane{flex:0 0 auto;height:100%;background-position:center;background-repeat:no-repeat;background-size:100% 100%}
    .domenea-360-fallback-guide{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:6rem;height:6rem;display:grid;place-items:center;border:1px solid rgba(244,244,239,.34);border-radius:50%;color:#f4f4ef;background:rgba(15,23,17,.12);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;pointer-events:none;transition:opacity .3s ease}
    .domenea-360-fallback.has-interacted .domenea-360-fallback-guide{opacity:0}

    .domenea-360-disclaimer{max-width:48rem;text-transform:none;letter-spacing:0;line-height:1.35}
    .domenea-360-mode{white-space:nowrap}

    @media(max-width:700px){
      .domenea-360-entry{right:var(--pad);bottom:1.15rem}.domenea-360-entry span{display:none}.domenea-360-entry::before{width:3.2rem;height:3.2rem}.domenea-360-entry::after{left:1.6rem;top:1.6rem}
      .domenea-360-top{padding-top:max(1rem,env(safe-area-inset-top))}.domenea-360-brand span{display:none}
      .domenea-360-bottom{padding-bottom:max(1rem,env(safe-area-inset-bottom))}.domenea-360-mode{display:none}.domenea-360-disclaimer{font-size:.58rem}
    }
    @media(prefers-reduced-motion:reduce){.domenea-360-viewer,.domenea-360-entry::before,.domenea-360-frame,.domenea-360-fallback-guide{transition:none!important}.domenea-360-loading-line::after{animation:none}}
  `;
  document.head.appendChild(style);

  const entry = document.createElement('button');
  entry.type = 'button';
  entry.className = 'domenea-360-entry';
  entry.dataset.domenea360 = '';
  entry.innerHTML = `<span><b>${t('Explorer en 360°','Explore in 360°')}</b><small>${t('Visite immersive TAO Passot','TAO Passot immersive tour')}</small></span>`;
  entry.setAttribute('aria-label', t('Explorer TAO Passot en visite 360','Explore TAO Passot in a 360 tour'));
  residenceHero.appendChild(entry);

  const viewer = document.createElement('section');
  viewer.className = 'domenea-360-viewer';
  viewer.dataset.domenea360Viewer = '';
  viewer.setAttribute('role','dialog');
  viewer.setAttribute('aria-modal','true');
  viewer.setAttribute('aria-hidden','true');
  viewer.setAttribute('aria-label', t('Visite immersive de TAO Passot','TAO Passot immersive tour'));
  viewer.innerHTML = `
    <div class="domenea-360-top">
      <div class="domenea-360-brand"><strong>DOMENEA</strong><span>TAO Passot / 360°</span></div>
      <button class="domenea-360-close" type="button" data-360-close>${t('Fermer','Close')}</button>
    </div>
    <div class="domenea-360-stage" data-360-stage>
      <iframe class="domenea-360-frame" data-360-frame title="${t('Visite virtuelle TAO Passot','TAO Passot virtual tour')}" allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen></iframe>
      <div class="domenea-360-fallback" data-360-fallback>
        <div class="domenea-360-fallback-track" data-360-fallback-track></div>
        <div class="domenea-360-fallback-guide">${t('Glisser','Drag')}</div>
      </div>
      <div class="domenea-360-loading" data-360-loading>
        <div class="domenea-360-loading-inner"><div class="domenea-360-loading-line" aria-hidden="true"></div><p>${t('Préparation de la visite 360°...','Preparing the 360° tour...')}</p></div>
      </div>
    </div>
    <div class="domenea-360-bottom">
      <span class="domenea-360-disclaimer">${t('Visualisation illustrative. Elle ne constitue pas une photographie contractuelle de TAO Passot.','Illustrative visualisation. It is not a contractual photograph of TAO Passot.')}</span>
      <span class="domenea-360-mode" data-360-mode>Pano2VR</span>
    </div>
  `;
  document.body.appendChild(viewer);

  const stage = viewer.querySelector('[data-360-stage]');
  const frame = viewer.querySelector('[data-360-frame]');
  const fallback = viewer.querySelector('[data-360-fallback]');
  const fallbackTrack = viewer.querySelector('[data-360-fallback-track]');
  const loading = viewer.querySelector('[data-360-loading]');
  const closeButton = viewer.querySelector('[data-360-close]');
  const modeLabel = viewer.querySelector('[data-360-mode]');

  let previousFocus = null;
  let panoAvailable = null;
  let fallbackReady = false;
  let dragging = false;
  let pointerId = null;
  let lastX = 0;
  let offsetX = 0;
  let paneWidth = 0;

  const probePano = async () => {
    if (panoAvailable !== null) return panoAvailable;
    try {
      const response = await fetch(panoProbeUrl.href, { cache:'no-store' });
      panoAvailable = response.ok;
    } catch (_) {
      panoAvailable = false;
    }
    return panoAvailable;
  };

  const sizeFallback = () => {
    if (!fallbackReady) return;
    const height = Math.max(1, fallback.clientHeight);
    paneWidth = Math.max(height * 2.12, fallback.clientWidth * 1.15);
    fallbackTrack.style.width = `${paneWidth * 3}px`;
    [...fallbackTrack.children].forEach(pane => {
      pane.style.width = `${paneWidth}px`;
    });
    renderFallback();
  };

  const renderFallback = () => {
    if (!fallbackReady) return;
    const center = fallback.clientWidth / 2 - paneWidth * 1.5;
    fallbackTrack.style.transform = `translate3d(${center + offsetX}px,0,0)`;
  };

  const buildFallback = () => {
    if (fallbackReady) return;
    fallbackTrack.innerHTML = '';
    for (let i = 0; i < 3; i += 1) {
      const pane = document.createElement('div');
      pane.className = 'domenea-360-fallback-pane';
      pane.style.backgroundImage = `url("${fallbackImageUrl.href}")`;
      fallbackTrack.appendChild(pane);
    }
    fallbackReady = true;
    sizeFallback();
  };

  const showFallback = () => {
    stage.classList.remove('is-pano-ready');
    frame.removeAttribute('src');
    buildFallback();
    fallback.classList.add('is-visible');
    loading.hidden = true;
    modeLabel.textContent = t('Panorama de secours','Fallback panorama');
    requestAnimationFrame(sizeFallback);
  };

  const showPano = () => {
    fallback.classList.remove('is-visible');
    loading.hidden = false;
    modeLabel.textContent = 'Pano2VR';
    const onLoad = () => {
      frame.removeEventListener('load', onLoad);
      stage.classList.add('is-pano-ready');
      loading.hidden = true;
    };
    frame.addEventListener('load', onLoad);
    frame.src = panoIndexUrl.href;
  };

  const openViewer = async () => {
    previousFocus = document.activeElement;
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden','false');
    document.body.classList.add('is-360-open');
    document.dispatchEvent(new CustomEvent('domenea:scroll-lock', { detail: { locked: true } }));
    loading.hidden = false;
    closeButton.focus({ preventScroll:true });

    const available = await probePano();
    if (!viewer.classList.contains('is-open')) return;
    if (available) showPano();
    else showFallback();
  };

  const closeViewer = () => {
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden','true');
    document.body.classList.remove('is-360-open');
    document.dispatchEvent(new CustomEvent('domenea:scroll-lock', { detail: { locked: false } }));
    stage.classList.remove('is-pano-ready');
    fallback.classList.remove('is-visible','is-dragging','has-interacted');
    dragging = false;
    pointerId = null;
    frame.src = 'about:blank';
    loading.hidden = false;
    previousFocus?.focus?.({ preventScroll:true });
  };

  entry.addEventListener('click', openViewer);
  closeButton.addEventListener('click', closeViewer);

  fallback.addEventListener('pointerdown', event => {
    if (event.button !== undefined && event.button !== 0) return;
    dragging = true;
    pointerId = event.pointerId;
    lastX = event.clientX;
    fallback.classList.add('is-dragging','has-interacted');
    fallback.setPointerCapture?.(pointerId);
  });

  fallback.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== pointerId || !paneWidth) return;
    const dx = event.clientX - lastX;
    lastX = event.clientX;
    offsetX += dx;
    if (offsetX > paneWidth / 2) offsetX -= paneWidth;
    if (offsetX < -paneWidth / 2) offsetX += paneWidth;
    renderFallback();
  });

  const endDrag = event => {
    if (!dragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
    dragging = false;
    fallback.classList.remove('is-dragging');
    try { fallback.releasePointerCapture?.(pointerId); } catch (_) {}
    pointerId = null;
  };

  fallback.addEventListener('pointerup', endDrag);
  fallback.addEventListener('pointercancel', endDrag);

  document.addEventListener('keydown', event => {
    if (!viewer.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeViewer();
    }
  });

  const resizeObserver = new ResizeObserver(sizeFallback);
  resizeObserver.observe(stage);
})();
