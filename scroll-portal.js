(() => {
  'use strict';

  const residences = document.querySelector('#residences');
  if (!residences || document.querySelector('[data-scroll-portal]')) return;

  const scenes = [
    { label: ['Horizon', 'Horizon'], title: ['Tout commence ici.', 'It all begins here.'], detail: ['L’océan pour point de départ.', 'The ocean as a starting point.'], image: 'horizon', alt: ['Banc de sable entouré par les eaux turquoise de l’océan', 'Sandbank surrounded by turquoise ocean water'] },
    { label: ['Architecture', 'Architecture'], title: ['Changer de perspective.', 'A new perspective.'], detail: ['Des lignes ouvertes sur l’extérieur.', 'Lines that open to the outdoors.'], image: 'architecture', alt: ['Villa contemporaine éclairée au crépuscule, face à une piscine', 'Contemporary villa lit at dusk, facing a pool'] },
    { label: ['Piscine', 'Pool'], title: ['Au fil de l’eau.', 'At the water’s edge.'], detail: ['La terrasse, la piscine, puis l’horizon.', 'The terrace, the pool, then the horizon.'], image: 'pool', alt: ['Terrasse ombragée et piscine avec vue sur la mer', 'Shaded terrace and swimming pool overlooking the sea'] },
    { label: ['Séjour', 'Living'], title: ['Se sentir chez soi.', 'Feel at home.'], detail: ['Dedans, dehors. Tout naturellement.', 'Indoors, outdoors. Naturally.'], image: 'living', alt: ['Séjour ouvert avec mobilier en bois, suspensions tressées et plantes', 'Open living space with wooden furniture, woven pendant lights and plants'] }
  ];
  const number = index => String(index + 1).padStart(2, '0');
  const copy = values => `data-fr="${values[0]}" data-en="${values[1]}"`;
  const section = document.createElement('section');
  section.id = 'immersion';
  section.className = 'scroll-portal';
  section.dataset.scrollPortal = '';
  section.dataset.headerTheme = 'dark';
  section.dataset.mode = 'static';
  section.innerHTML = `
    <div class="scroll-portal-stage">
      <div class="scroll-portal-world">
        ${scenes.map((scene, index) => `
          <article class="scroll-portal-scene" data-portal-scene="${index}">
            <img src="assets/immersion/${scene.image}.webp" alt="${scene.alt[0]}" decoding="async" fetchpriority="low" />
            <div class="scroll-portal-shade" aria-hidden="true"></div>
            <div class="scroll-portal-caption">
              <small>${number(index)} — <span ${copy(scene.label)}>${scene.label[0]}</span></small>
              <h2 ${copy(scene.title)}>${scene.title[0]}</h2>
              <p ${copy(scene.detail)}>${scene.detail[0]}</p>
            </div>
          </article>`).join('')}
      </div>
      <div class="scroll-portal-top">
        <span class="scroll-portal-kicker" ${copy(['TAO PASSOT — UNE TRAVERSÉE', 'TAO PASSOT — A JOURNEY'])}>TAO PASSOT — UNE TRAVERSÉE</span>
        <a href="#residences" class="scroll-portal-skip"><span ${copy(['Aller aux villas', 'Go to the villas'])}>Aller aux villas</span> <span aria-hidden="true">↗</span></a>
      </div>
      <div class="scroll-portal-caption scroll-portal-live-caption" aria-hidden="true">
        <small data-portal-label></small><h2 data-portal-title></h2><p data-portal-detail></p>
      </div>
      <div class="scroll-portal-next" aria-hidden="true"><span ${copy(['PLUS LOIN', 'FURTHER IN'])}>PLUS LOIN</span><span data-portal-next></span><span>↓</span></div>
      <div class="scroll-portal-final" data-portal-final>
        <div class="scroll-portal-final-inner">
          <small ${copy(['ET SI VOUS Y ÉTIEZ ?', 'WHAT IF YOU WERE HERE?'])}>ET SI VOUS Y ÉTIEZ ?</small>
          <h2 ${copy(['À vous d’explorer.', 'Make it your own.'])}>À vous d’explorer.</h2>
          <p ${copy(['Prolongez la traversée. Entrez dans la visite panoramique de TAO Passot.', 'Continue the journey. Step inside the panoramic tour of TAO Passot.'])}>Prolongez la traversée. Entrez dans la visite panoramique de TAO Passot.</p>
          <button class="scroll-portal-cta" type="button" data-portal-360><span class="scroll-portal-orbit" aria-hidden="true">360°</span><span ${copy(['Entrer dans la visite', 'Enter the tour'])}>Entrer dans la visite</span><span aria-hidden="true">↗</span></button>
        </div>
      </div>
      <div class="scroll-portal-bottom">
        <span class="scroll-portal-guide"><span aria-hidden="true">↓</span><span ${copy(['DÉFILER POUR TRAVERSER', 'SCROLL TO EXPLORE'])}>DÉFILER POUR TRAVERSER</span></span>
        <nav class="scroll-portal-chapters">${scenes.map((scene, index) => `<button type="button" data-portal-jump="${index}"><span class="scroll-portal-track" aria-hidden="true"><i></i></span><span class="scroll-portal-chapter-label"><b>${number(index)}</b><span ${copy(scene.label)}>${scene.label[0]}</span></span></button>`).join('')}</nav>
        <span class="scroll-portal-counter" aria-hidden="true"><span data-portal-count>01</span> / 04</span>
      </div>
    </div>`;
  residences.insertAdjacentElement('beforebegin', section);

  const sceneEls = [...section.querySelectorAll('[data-portal-scene]')];
  const images = sceneEls.map(el => el.querySelector('img'));
  const shades = sceneEls.map(el => el.querySelector('.scroll-portal-shade'));
  const chapters = [...section.querySelectorAll('[data-portal-jump]')];
  const tracks = chapters.map(el => el.querySelector('i'));
  const liveCaption = section.querySelector('.scroll-portal-live-caption');
  const label = section.querySelector('[data-portal-label]');
  const title = section.querySelector('[data-portal-title]');
  const detail = section.querySelector('[data-portal-detail]');
  const next = section.querySelector('.scroll-portal-next');
  const nextLabel = section.querySelector('[data-portal-next]');
  const count = section.querySelector('[data-portal-count]');
  const final = section.querySelector('[data-portal-final]');
  const header = document.querySelector('[data-header]');
  let headerFrame = 0;
  const updateHeader = () => {
    headerFrame = 0;
    if (!header) return;
    const bounds = section.getBoundingClientRect();
    const edge = header.getBoundingClientRect().bottom;
    header.dataset.portalActive = String(bounds.top <= edge && bounds.bottom > edge);
  };
  const scheduleHeader = () => { if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader); };
  window.addEventListener('scroll', scheduleHeader, { passive: true });
  window.addEventListener('resize', scheduleHeader);
  scheduleHeader();
  const language = () => document.documentElement.lang === 'en' ? 1 : 0;
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const CHAPTER = 1.12;
  const TOTAL = 4.55;
  let progress = 0;
  let trigger;
  let compact = false;
  let activeIndex = -1;

  function render(value) {
    progress = value;
    const time = value * TOTAL;
    const index = Math.min(3, Math.floor(time / CHAPTER));
    const phase = (time - index * CHAPTER) / CHAPTER;
    const travel = clamp((phase - .2) / .72);
    const startScale = compact ? .64 : .34;
    // Perspective projection: the next full composition grows as the camera approaches.
    const scale = startScale / (1 - travel * (1 - startScale));
    const previewOpacity = smooth((phase - .10) / .10);
    const finalOpacity = smooth((time - 3.62) / .5);
    const captionIndex = index < 3 && travel > .93 ? index + 1 : index;
    const captionOpacity = index === 3 ? 1 - finalOpacity : travel > .93 ? smooth((travel - .93) / .07) : 1 - smooth(travel / .35);

    sceneEls.forEach((scene, i) => {
      // Only the current world and its immediate successor can ever overlap.
      const incoming = i === index + 1 && previewOpacity > 0;
      const visible = i === index || incoming;
      scene.style.visibility = visible ? 'visible' : 'hidden';
      scene.style.zIndex = incoming ? '2' : '1';
      scene.style.opacity = incoming ? String(previewOpacity) : '1';
      scene.style.transform = incoming ? `scale(${scale})` : 'none';
      scene.classList.toggle('is-portal', incoming && travel < 1);
      images[i].style.transform = `scale(${i === index ? 1 + travel * .16 : 1})`;
      shades[i].style.opacity = String(i === index ? .35 + travel * .55 : .25);
      scene.setAttribute('aria-hidden', String(i !== captionIndex));
      tracks[i].style.transform = `scaleX(${clamp((time - i * CHAPTER) / CHAPTER)})`;
    });
    liveCaption.style.opacity = String(captionOpacity);
    liveCaption.style.transform = `translateY(${(1 - captionOpacity) * 16}px)`;
    next.style.opacity = index < 3 ? String(previewOpacity * (1 - smooth(travel / .55))) : '0';
    final.style.opacity = String(finalOpacity);
    final.style.visibility = finalOpacity > 0 ? 'visible' : 'hidden';
    final.inert = finalOpacity < .98;
    final.setAttribute('aria-hidden', String(finalOpacity < .98));
    if (activeIndex !== captionIndex) {
      activeIndex = captionIndex;
      updateCaption();
    }
    if (index < 3) nextLabel.textContent = scenes[index + 1].label[language()];
    section.dataset.chapter = String(captionIndex + 1);
  }

  function updateCaption() {
    const index = Math.max(0, activeIndex);
    const scene = scenes[index];
    label.textContent = `${number(index)} — ${scene.label[language()]}`;
    title.textContent = scene.title[language()];
    detail.textContent = scene.detail[language()];
    count.textContent = number(index);
    chapters.forEach((button, i) => {
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  }

  function applyLanguage() {
    section.querySelectorAll('[data-fr][data-en]').forEach(el => { el.textContent = el.dataset[language() ? 'en' : 'fr']; });
    section.setAttribute('aria-label', language() ? 'A journey into the TAO Passot lifestyle' : 'Une traversée dans l’univers de TAO Passot');
    section.querySelector('nav').setAttribute('aria-label', language() ? 'Journey chapters' : 'Étapes de la traversée');
    images.forEach((img, i) => { img.alt = scenes[i].alt[language()]; });
    updateCaption();
    if (section.dataset.mode === 'motion') render(progress);
  }
  new MutationObserver(applyLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  applyLanguage();

  function scrollTo(top) {
    document.dispatchEvent(new CustomEvent('domenea:scroll-to', { detail: { top } }));
  }
  document.querySelector('[data-immersion-entry]')?.addEventListener('click', event => {
    event.preventDefault();
    scrollTo(section.getBoundingClientRect().top + window.scrollY);
  });
  chapters.forEach((button, index) => button.addEventListener('click', () => {
    if (trigger) scrollTo(trigger.start + (index * CHAPTER / TOTAL) * (trigger.end - trigger.start));
    else sceneEls[index].scrollIntoView({ behavior: 'auto', block: 'start' });
  }));
  section.querySelector('.scroll-portal-skip').addEventListener('click', event => {
    event.preventDefault();
    scrollTo(residences.getBoundingClientRect().top + window.scrollY);
    residences.setAttribute('tabindex', '-1');
    residences.focus({ preventScroll: true });
  });
  const tourButton = section.querySelector('[data-portal-360]');
  tourButton.addEventListener('click', () => {
    // Keep the actual source focused so the viewer restores focus here on close.
    tourButton.focus({ preventScroll: true });
    document.querySelector('[data-domenea360]')?.click();
  });

  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) {
    if (window.location.hash === '#immersion') section.scrollIntoView({ behavior: 'instant' });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add({ reduce: '(prefers-reduced-motion: reduce)', compact: '(max-width: 760px)', desktop: '(min-width: 761px)' }, context => {
    if (context.conditions.reduce) return;
    compact = context.conditions.compact;
    section.dataset.mode = 'motion';
    activeIndex = -1;
    const state = { progress: 0 };
    const animation = gsap.to(state, { progress: 1, duration: 1, ease: 'none', paused: true, onUpdate: () => render(state.progress) });
    render(0);
    trigger = ScrollTrigger.create({
      id: 'domenea-immersion', trigger: section, start: 'top top', end: 'bottom bottom',
      animation, scrub: compact ? .35 : .65, invalidateOnRefresh: true
    });
    return () => {
      trigger = null;
      section.dataset.mode = 'static';
      sceneEls.forEach((el, i) => {
        el.removeAttribute('style'); el.removeAttribute('aria-hidden'); el.classList.remove('is-portal');
        images[i].removeAttribute('style'); shades[i].removeAttribute('style'); tracks[i].removeAttribute('style');
      });
      final.removeAttribute('style'); final.removeAttribute('aria-hidden'); final.inert = false;
    };
  });
  // This module arrives after core motion setup: remeasure all downstream sections now,
  // even when the document load event has already fired.
  let anchorPending = window.location.hash === '#immersion';
  const cancelAnchor = () => { anchorPending = false; };
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(event => window.addEventListener(event, cancelAnchor, { once: true, passive: true }));
  const refreshLayout = () => {
    ScrollTrigger.refresh();
    if (anchorPending) scrollTo(section.getBoundingClientRect().top + window.scrollY);
    scheduleHeader();
  };
  requestAnimationFrame(refreshLayout);
  if (document.readyState !== 'complete') window.addEventListener('load', refreshLayout, { once: true });
  document.fonts?.ready.then(refreshLayout);
})();
