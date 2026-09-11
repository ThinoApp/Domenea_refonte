(() => {
  'use strict';

  if (document.querySelector('[data-architectural-thread]')) return;
  const moduleBase = new URL('.', document.currentScript.src);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 760px)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // One sculpture travels through the existing layout. No section is pinned,
  // transformed or given extra scroll distance by this module.
  const route = [
    { form: 'arch', section: '[data-stack]', at: 0, x: .83, y: .21, size: 340, rx: -.16, ry: -.48, rz: -.16 },
    { form: 'leaf', section: '[data-stack]', at: .26, x: .88, y: .24, size: 265, rx: .16, ry: .58, rz: .12 },
    { form: 'arch', section: '[data-stack]', at: .56, x: .15, y: .23, size: 270, rx: -.12, ry: 1.08, rz: -.22 },
    { form: 'house', section: '[data-stack]', at: .84, x: .87, y: .24, size: 280, rx: .18, ry: 2.75, rz: .12 },
    { form: 'arch', section: '#concept', at: .2, x: .79, y: .42, size: 410, rx: -.18, ry: 3.65, rz: -.22 },
    { form: 'arch', section: '#concept', at: .75, x: .83, y: .38, size: 345, rx: .18, ry: 5.72, rz: .20 },
    { form: 'collection', section: '#programs', at: .12, x: .85, y: .22, size: 270, rx: -.12, ry: 6.65, rz: -.12 },
    { form: 'pin', section: '#location', at: .10, x: .21, y: .25, size: 295, rx: .27, ry: 7.0, rz: -.35 },
    { form: 'pin', section: '#location', at: .8, x: .20, y: .28, size: 230, rx: -.2, ry: 8.55, rz: .15 },
    { form: 'portal', section: '#immersion', at: .04, x: .92, y: .28, size: 130, rx: -.12, ry: 9.65, rz: -.1 },
    { form: 'portal', section: '#immersion', at: .87, x: .92, y: .28, size: 130, rx: .2, ry: 12.95, rz: .12 },
    { form: 'house', section: '#residences', at: 0, x: .82, y: .24, size: 330, rx: -.16, ry: 13.25, rz: -.18 },
    { form: 'house', section: '#residences', at: .65, x: .92, y: .24, size: 155, rx: .2, ry: 14.9, rz: .1 },
    { form: 'ring', section: '#investment', at: .22, x: .23, y: .27, size: 280, rx: -.1, ry: 15.25, rz: -.12 },
    { form: 'leaf', section: '#lifestyle', at: .2, x: .84, y: .24, size: 310, rx: .22, ry: 16.5, rz: .3 },
    { form: 'leaf', section: '#lifestyle', at: .75, x: .85, y: .25, size: 290, rx: -.18, ry: 18.4, rz: -.25 },
    { form: 'wave', section: '#amenities', at: .08, x: .85, y: .38, size: 240, rx: .22, ry: 19.4, rz: .2 },
    { form: 'wave', section: '#amenities', at: .8, x: .88, y: .32, size: 250, rx: -.16, ry: 21.55, rz: -.22 },
    { form: 'pin', section: '#perspective', at: .1, x: .8, y: .26, size: 270, rx: .25, ry: 22.4, rz: .15 },
    { form: 'key', section: '#acquisition', at: .06, x: .87, y: .22, size: 190, rx: -.2, ry: 24.65, rz: -.1 },
    { form: 'arch', section: '#contact', at: .08, x: .80, y: .35, size: 350, rx: -.12, ry: 25.6, rz: .04 },
    { form: 'arch', section: '#contact', at: .9, x: .90, y: .23, size: 170, rx: -.1, ry: 25.15, rz: 0 }
  ];
  const host = document.createElement('div');
  host.className = 'architectural-thread';
  host.dataset.architecturalThread = '';
  host.setAttribute('aria-hidden', 'true');
  host.innerHTML = '<canvas></canvas>';
  document.body.appendChild(host);

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);
  let points = [];
  let width = window.innerWidth;
  let height = window.innerHeight;
  let frame = 0;
  let measureFrame = 0;
  let lastTime = 0;
  let renderer, scene, camera, sculpture, geometry, face, grain;
  let formNames = [];
  let ready = false;
  let lost = false;
  let disposed = false;
  let pointerX = 0;
  let pointerY = 0;
  let pointerTiltX = 0;
  let pointerTiltY = 0;
  let previousChapter = '';
  let captionNodes = [];
  let current = null;

  function suppressed() {
    return document.hidden || document.body.matches('.is-entry-locked, .menu-open, .is-360-open');
  }

  function measure() {
    measureFrame = 0;
    width = document.documentElement.clientWidth;
    height = window.innerHeight;
    const y = window.scrollY;
    const scrollEnd = Math.max(1, document.documentElement.scrollHeight - height);
    points = route.flatMap(point => {
      const el = document.querySelector(point.section);
      if (!el) return [];
      const bounds = el.getBoundingClientRect();
      const span = Math.max(height * .35, bounds.height - height);
      return [{ ...point, el, scroll: clamp(bounds.top + y + span * point.at - (point.at === 0 ? 0 : height * .08), 0, scrollEnd) }];
    }).sort((a, b) => a.scroll - b.scroll);
    if (points.length) points[0].scroll = 0;
    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact.matches ? 1.25 : 1.6));
      renderer.setSize(400, 400, false);
    }
    wake();
  }

  function scheduleMeasure() {
    if (!measureFrame) measureFrame = requestAnimationFrame(measure);
  }

  function targetPose() {
    const y = window.scrollY;
    let index = 0;
    while (index < points.length - 2 && y >= points[index + 1].scroll) index++;
    const a = points[index];
    const b = points[Math.min(index + 1, points.length - 1)];
    if (!a || !b) return null;
    const progress = clamp((y - a.scroll) / Math.max(1, b.scroll - a.scroll), 0, 1);
    const t = smooth(progress);
    const pose = {};
    ['x', 'y', 'size', 'rx', 'ry', 'rz'].forEach(key => { pose[key] = lerp(a[key], b[key], t); });
    const chapter = t < .5 ? a : b;
    const morph = smooth(clamp((progress - .48) / .52, 0, 1));
    pose.forms = formNames.map(name => (name === a.form ? 1 - morph : 0) + (name === b.form ? morph : 0));
    host.dataset.form = morph < .5 ? a.form : b.form;
    if (previousChapter !== chapter.section) {
      previousChapter = chapter.section;
      host.dataset.chapter = chapter.section;
      captionNodes = [...chapter.el.querySelectorAll('h1, h2, h3, p, a, button, input, select')];
    }
    if (compact.matches) {
      pose.x = .83;
      pose.y = .20 + Math.sin(y / Math.max(1, height) * .4) * .025;
      pose.size = chapter.section === '#immersion' ? 92 : 125;
      pose.rz *= .6;
    }
    if (reduced.matches) {
      Object.assign(pose, { x: .88, y: .20, size: compact.matches ? 85 : 115, rx: -.12, ry: -.5, rz: 0 });
      pose.forms = formNames.map(name => name === 'arch' ? 1 : 0);
      host.dataset.form = 'arch';
    }
    pose.size = Math.min(pose.size, height * .48, width * (compact.matches ? .36 : .3));
    pose.x = clamp(pose.x * width, pose.size * .4 + 12, width - pose.size * .4 - 12);
    pose.y = clamp(pose.y * height, 74 + pose.size * .36, height - pose.size * .4 - 20);
    return pose;
  }

  function contentOpacity(pose) {
    const radius = pose.size * .28;
    const box = { left: pose.x - radius, right: pose.x + radius, top: pose.y - radius, bottom: pose.y + radius };
    const collision = captionNodes.some(node => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || rect.bottom < box.top || rect.top > box.bottom || rect.right < box.left || rect.left > box.right) return false;
      const style = getComputedStyle(node);
      if (style.visibility === 'hidden' || Number(style.opacity) <= .15) return false;
      const panel = node.closest('[data-stack-scene], [data-portal-scene], .identity-slide');
      if (panel) {
        const panelStyle = getComputedStyle(panel);
        if (panelStyle.visibility === 'hidden' || Number(panelStyle.opacity) <= .15) return false;
        const inset = panelStyle.clipPath.match(/^inset\(([\d.]+)(%|px)/);
        if (inset) {
          const panelRect = panel.getBoundingClientRect();
          const hiddenHeight = Number(inset[1]) * (inset[2] === '%' ? panelRect.height / 100 : 1);
          if (panelRect.top + hiddenHeight >= Math.min(rect.bottom, box.bottom)) return false;
        }
      }
      return true;
    });
    return collision ? .20 : 1;
  }

  function tick(now) {
    frame = 0;
    if (!ready || disposed || lost || !points.length) return;
    if (suppressed()) { host.style.opacity = '0'; return; }
    const target = targetPose();
    if (!target) return;
    const dt = Math.min(64, now - (lastTime || now - 16));
    lastTime = now;
    const ease = reduced.matches ? 1 : 1 - Math.exp(-dt / 105);
    if (!current) current = { ...target, opacity: 0 };
    let distance = 0;
    ['x', 'y', 'size', 'rx', 'ry', 'rz'].forEach(key => {
      current[key] = lerp(current[key], target[key], ease);
      distance += Math.abs(current[key] - target[key]);
    });
    const targetTiltX = reduced.matches ? 0 : pointerX;
    const targetTiltY = reduced.matches ? 0 : pointerY;
    pointerTiltX = lerp(pointerTiltX, targetTiltX, ease);
    pointerTiltY = lerp(pointerTiltY, targetTiltY, ease);
    distance += Math.abs(pointerTiltX - targetTiltX) + Math.abs(pointerTiltY - targetTiltY);
    const opacity = contentOpacity(current);
    current.opacity = lerp(current.opacity, opacity, ease);
    distance += Math.abs(current.opacity - opacity) * 10;
    host.style.opacity = String(current.opacity);
    host.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${current.size / 400})`;
    sculpture.rotation.set(current.rx + pointerTiltY * .08, current.ry + pointerTiltX * .12, current.rz);
    target.forms.forEach((weight, i) => {
      const value = lerp(sculpture.morphTargetInfluences[i], weight, ease);
      sculpture.morphTargetInfluences[i] = value;
      distance += Math.abs(value - weight) * 12;
    });
    renderer.render(scene, camera);
    if (distance > .025) frame = requestAnimationFrame(tick);
  }

  function wake() {
    if (!frame && ready && !disposed && !lost) frame = requestAnimationFrame(tick);
  }

  async function initialise() {
    try {
      const [THREE, { createArchitecturalForms }] = await Promise.all([
        import(new URL('assets/vendor/three/three.module.min.js', moduleBase)),
        import(new URL('architectural-forms.js?v=1', moduleBase))
      ]);
      if (disposed) return;
      renderer = new THREE.WebGLRenderer({ canvas: host.querySelector('canvas'), alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(32, 1, .1, 30);
      camera.position.set(0, 0, 7.4);

      const forms = createArchitecturalForms(THREE);
      geometry = forms.geometry;
      formNames = forms.names;

      const pixels = new Uint8Array(128 * 128 * 4);
      let seed = 73;
      for (let i = 0; i < pixels.length; i += 4) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const v = 185 + ((seed >>> 24) % 60);
        pixels[i] = v; pixels[i + 1] = v; pixels[i + 2] = v; pixels[i + 3] = 255;
      }
      grain = new THREE.DataTexture(pixels, 128, 128);
      grain.wrapS = grain.wrapT = THREE.RepeatWrapping;
      grain.repeat.set(3, 3);
      grain.needsUpdate = true;
      face = new THREE.MeshStandardMaterial({ color: 0xd6c5a3, roughness: .58, metalness: .12, bumpMap: grain, bumpScale: .012 });
      sculpture = new THREE.Mesh(geometry, face);
      sculpture.morphTargetInfluences[0] = 1;
      scene.add(sculpture);
      scene.add(new THREE.HemisphereLight(0xf7f1df, 0x263d30, 2.6));
      const key = new THREE.DirectionalLight(0xffefcf, 4.0);
      key.position.set(-3, 5, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xd7e6df, 3.2);
      rim.position.set(4, 1, -2);
      scene.add(rim);
      const fill = new THREE.DirectionalLight(0xf4e8cc, 1.4);
      fill.position.set(1, -3, 4);
      scene.add(fill);
      ready = true;
      host.dataset.ready = 'true';
      measure();
    } catch (error) {
      host.remove();
      dispose();
      console.warn('[DOMENEA] Decorative 3D arch unavailable; page navigation remains active.', error);
    }
  }

  function pointerMove(event) {
    if (!finePointer.matches || reduced.matches) return;
    pointerX = event.clientX / Math.max(1, width) - .5;
    pointerY = event.clientY / Math.max(1, height) - .5;
    wake();
  }
  function pointerLeave() { pointerX = 0; pointerY = 0; wake(); }
  function visibilityChange() { lastTime = 0; wake(); }
  function contextLost(event) { event.preventDefault(); lost = true; host.style.opacity = '0'; cancelAnimationFrame(frame); frame = 0; }
  function contextRestored() { lost = false; current = null; scheduleMeasure(); }
  function pageHide(event) {
    cancelAnimationFrame(frame); frame = 0;
    if (!event.persisted) dispose();
  }
  function pageShow() { current = null; scheduleMeasure(); }
  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame); cancelAnimationFrame(measureFrame);
    observer.disconnect(); resizeObserver.disconnect();
    window.removeEventListener('scroll', wake);
    window.removeEventListener('resize', scheduleMeasure);
    window.removeEventListener('pointermove', pointerMove);
    window.removeEventListener('pointerout', pointerOut);
    window.removeEventListener('blur', pointerLeave);
    document.removeEventListener('visibilitychange', visibilityChange);
    window.removeEventListener('pagehide', pageHide);
    window.removeEventListener('pageshow', pageShow);
    window.removeEventListener('load', scheduleMeasure);
    reduced.removeEventListener('change', scheduleMeasure);
    compact.removeEventListener('change', scheduleMeasure);
    window.ScrollTrigger?.removeEventListener('refresh', scheduleMeasure);
    geometry?.dispose(); face?.dispose(); grain?.dispose(); renderer?.dispose();
  }
  function pointerOut(event) { if (!event.relatedTarget) pointerLeave(); }
  const observer = new MutationObserver(wake);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  const resizeObserver = new ResizeObserver(scheduleMeasure);
  resizeObserver.observe(document.querySelector('main'));
  resizeObserver.observe(document.querySelector('footer'));
  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('pointermove', pointerMove, { passive: true });
  window.addEventListener('pointerout', pointerOut, { passive: true });
  window.addEventListener('blur', pointerLeave);
  document.addEventListener('visibilitychange', visibilityChange);
  window.addEventListener('pagehide', pageHide);
  window.addEventListener('pageshow', pageShow);
  reduced.addEventListener('change', scheduleMeasure);
  compact.addEventListener('change', scheduleMeasure);
  host.querySelector('canvas').addEventListener('webglcontextlost', contextLost);
  host.querySelector('canvas').addEventListener('webglcontextrestored', contextRestored);
  window.ScrollTrigger?.addEventListener('refresh', scheduleMeasure);
  window.addEventListener('load', scheduleMeasure, { once: true });
  document.fonts?.ready.then(() => { if (!disposed) scheduleMeasure(); });
  initialise();
})();