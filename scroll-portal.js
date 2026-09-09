(() => {
  'use strict';

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const anchor = document.querySelector('#concept');
  if (!anchor || !gsap || !ScrollTrigger || document.querySelector('[data-scroll-portal]')) return;

  gsap.registerPlugin(ScrollTrigger);

  const scenes = [
    {
      number: '01',
      labelFr: 'Mont Passot',
      labelEn: 'Mont Passot',
      titleFr: 'Le paysage ouvre la voie.',
      titleEn: 'The landscape opens the way.',
      image: 'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%2012.jpg',
      alt: 'Paysage tropical autour de Mont Passot à Nosy Be'
    },
    {
      number: '02',
      labelFr: 'Architecture',
      labelEn: 'Architecture',
      titleFr: 'La villa se laisse traverser.',
      titleEn: 'The villa opens itself to you.',
      image: 'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%208-2.jpg',
      alt: 'Architecture contemporaine TAO Passot ouverte sur la nature'
    },
    {
      number: '03',
      labelFr: 'Piscine',
      labelEn: 'Pool',
      titleFr: 'L’eau prolonge l’horizon.',
      titleEn: 'Water extends the horizon.',
      image: 'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%208-1.jpeg',
      alt: 'Piscine et terrasse de la résidence TAO Passot'
    },
    {
      number: '04',
      labelFr: 'Séjour',
      labelEn: 'Living space',
      titleFr: 'Dedans, dehors, sans rupture.',
      titleEn: 'Inside and out, without a break.',
      image: 'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%208-3.jpeg',
      alt: 'Espace de vie de TAO Passot ouvert vers l’extérieur'
    },
    {
      number: '05',
      labelFr: 'Immersion',
      labelEn: 'Immersion',
      titleFr: 'À vous d’explorer.',
      titleEn: 'Now explore it yourself.',
      image: 'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%2016.jpg',
      alt: 'Vue de TAO Passot au coucher du soleil',
      final: true
    }
  ];

  const style = document.createElement('style');
  style.dataset.scrollPortalStyles = '';
  style.textContent = `
    .scroll-portal{position:relative;height:520vh;background:#101711;color:#f4f4ef;isolation:isolate}
    .scroll-portal-stage{position:sticky;top:0;height:100dvh;overflow:hidden;background:#101711}
    .scroll-portal-scene{position:absolute;inset:0;overflow:hidden;visibility:hidden;clip-path:inset(34% 36% 34% 36% round 2px);will-change:clip-path,transform,filter;transform:translateZ(0)}
    .scroll-portal-scene:first-of-type{visibility:visible;clip-path:inset(0 0 0 0)}
    .scroll-portal-scene img{position:absolute;inset:-2%;width:104%;height:104%;object-fit:cover;transform:scale(1.08);will-change:transform,filter}
    .scroll-portal-scene:first-of-type img{transform:scale(1)}
    .scroll-portal-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,13,9,.08),rgba(7,13,9,.1) 48%,rgba(7,13,9,.56));pointer-events:none}
    .scroll-portal-frame{position:absolute;z-index:8;top:34%;right:36%;bottom:34%;left:36%;border:1px solid rgba(244,244,239,.68);box-shadow:0 0 0 1px rgba(16,23,17,.18),0 24px 80px rgba(5,10,7,.28);pointer-events:none;opacity:0;will-change:top,right,bottom,left,opacity}
    .scroll-portal-intro{position:absolute;z-index:20;left:var(--pad);top:clamp(5.8rem,11vh,8.5rem);max-width:min(34rem,72vw);display:grid;gap:.8rem;pointer-events:none}
    .scroll-portal-intro small{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(244,244,239,.65)}
    .scroll-portal-intro h2{margin:0;font-size:clamp(2.5rem,6vw,6.6rem);font-weight:500;line-height:.92;letter-spacing:-.055em;max-width:10ch}
    .scroll-portal-intro p{margin:0;max-width:35ch;color:rgba(244,244,239,.72);font-size:clamp(.82rem,1.25vw,1rem);line-height:1.55}
    .scroll-portal-meta{position:absolute;z-index:10;left:var(--pad);right:var(--pad);bottom:clamp(1.5rem,4vw,3.4rem);display:flex;align-items:end;justify-content:space-between;gap:2rem;opacity:0;transform:translateY(18px)}
    .scroll-portal-meta-left{display:grid;gap:.35rem;max-width:min(40rem,70vw)}
    .scroll-portal-meta small{font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(244,244,239,.62)}
    .scroll-portal-meta strong{font-size:clamp(1.6rem,3.6vw,4.6rem);font-weight:500;line-height:.95;letter-spacing:-.045em}
    .scroll-portal-progress{display:flex;align-items:center;gap:.7rem;font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(244,244,239,.6)}
    .scroll-portal-progress i{display:block;width:3rem;height:1px;background:rgba(244,244,239,.38)}
    .scroll-portal-final{position:absolute;z-index:14;inset:0;display:grid;place-items:center;padding:var(--pad);text-align:center;opacity:0;pointer-events:none}
    .scroll-portal-final-inner{display:grid;justify-items:center;gap:1rem;max-width:48rem}
    .scroll-portal-final small{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(244,244,239,.7)}
    .scroll-portal-final h3{margin:0;font-size:clamp(2.8rem,7vw,7.5rem);font-weight:500;line-height:.9;letter-spacing:-.06em}
    .scroll-portal-final p{margin:0 0 .35rem;max-width:38ch;font-size:clamp(.84rem,1.2vw,1rem);line-height:1.55;color:rgba(244,244,239,.72)}
    .scroll-portal-cta{pointer-events:auto;border:1px solid rgba(244,244,239,.76);background:rgba(16,23,17,.18);color:#f4f4ef;padding:.9rem 1.25rem;font:inherit;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;backdrop-filter:blur(8px);transition:background .25s ease,color .25s ease,transform .25s ease}
    .scroll-portal-cta:hover,.scroll-portal-cta:focus-visible{background:#f4f4ef;color:#101711;transform:translateY(-2px)}
    .scroll-portal-cta:focus-visible{outline:2px solid #f4f4ef;outline-offset:4px}
    .scroll-portal-cue{position:absolute;z-index:22;right:var(--pad);top:50%;display:grid;gap:.55rem;justify-items:center;transform:translateY(-50%);font-size:.53rem;letter-spacing:.16em;text-transform:uppercase;color:rgba(244,244,239,.58);writing-mode:vertical-rl;pointer-events:none}
    .scroll-portal-cue::after{content:'';display:block;width:1px;height:4rem;background:linear-gradient(to bottom,rgba(244,244,239,.65),transparent)}
    @media(max-width:760px){
      .scroll-portal{height:420vh}
      .scroll-portal-scene{clip-path:inset(31% 18% 31% 18% round 1px)}
      .scroll-portal-frame{top:31%;right:18%;bottom:31%;left:18%}
      .scroll-portal-intro{top:calc(max(4.8rem,env(safe-area-inset-top)) + 1rem);max-width:82vw}
      .scroll-portal-intro h2{font-size:clamp(2.4rem,12vw,4.4rem)}
      .scroll-portal-intro p{max-width:30ch}
      .scroll-portal-meta{bottom:max(1.4rem,env(safe-area-inset-bottom));align-items:start}
      .scroll-portal-meta strong{font-size:clamp(1.7rem,8vw,3rem)}
      .scroll-portal-progress{display:none}
      .scroll-portal-cue{display:none}
      .scroll-portal-final h3{font-size:clamp(3rem,14vw,5rem)}
    }
    @media(prefers-reduced-motion:reduce){
      .scroll-portal{height:auto;min-height:100dvh}
      .scroll-portal-stage{position:relative;min-height:100dvh}
      .scroll-portal-scene{display:none!important}
      .scroll-portal-scene:last-of-type{display:block!important;visibility:visible!important;clip-path:none!important}
      .scroll-portal-scene:last-of-type img{transform:none!important}
      .scroll-portal-intro,.scroll-portal-cue,.scroll-portal-meta{display:none!important}
      .scroll-portal-final{opacity:1!important;pointer-events:auto!important}
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.className = 'scroll-portal';
  section.dataset.scrollPortal = '';
  section.setAttribute('aria-label', 'Traversée immersive de TAO Passot');

  const sceneMarkup = scenes.map((scene, index) => `
    <article class="scroll-portal-scene" data-portal-scene="${index}" style="z-index:${index + 1}">
      <img src="${scene.image}" alt="${scene.alt}" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async" />
      <div class="scroll-portal-shade" aria-hidden="true"></div>
      <div class="scroll-portal-meta" data-portal-meta="${index}">
        <div class="scroll-portal-meta-left">
          <small data-fr="${scene.number} — ${scene.labelFr}" data-en="${scene.number} — ${scene.labelEn}">${scene.number} — ${scene.labelFr}</small>
          <strong data-fr="${scene.titleFr}" data-en="${scene.titleEn}">${scene.titleFr}</strong>
        </div>
        <span class="scroll-portal-progress"><i></i>${String(index + 1).padStart(2, '0')} / ${String(scenes.length).padStart(2, '0')}</span>
      </div>
    </article>
  `).join('');

  const frameMarkup = scenes.slice(1).map((_, index) => `<div class="scroll-portal-frame" data-portal-frame="${index + 1}" style="z-index:${index + 7}"></div>`).join('');

  section.innerHTML = `
    <div class="scroll-portal-stage" data-portal-stage>
      ${sceneMarkup}
      ${frameMarkup}
      <div class="scroll-portal-intro" data-portal-intro>
        <small data-fr="Traversée TAO Passot" data-en="TAO Passot passage">Traversée TAO Passot</small>
        <h2 data-fr="Entrez dans le paysage." data-en="Enter the landscape.">Entrez dans le paysage.</h2>
        <p data-fr="Faites défiler pour traverser le site, la villa et ses espaces jusqu’à l’immersion 360°." data-en="Scroll to pass through the site, the villa and its spaces, then enter the 360° experience.">Faites défiler pour traverser le site, la villa et ses espaces jusqu’à l’immersion 360°.</p>
      </div>
      <div class="scroll-portal-cue" data-fr="Faire défiler" data-en="Scroll">Faire défiler</div>
      <div class="scroll-portal-final" data-portal-final>
        <div class="scroll-portal-final-inner">
          <small>TAO Passot / 360°</small>
          <h3 data-fr="À vous d’explorer." data-en="Now explore it yourself.">À vous d’explorer.</h3>
          <p data-fr="La visite guidée s’arrête ici. Prenez maintenant le contrôle et parcourez librement TAO Passot." data-en="The guided passage ends here. Take control and explore TAO Passot freely.">La visite guidée s’arrête ici. Prenez maintenant le contrôle et parcourez librement TAO Passot.</p>
          <button class="scroll-portal-cta" type="button" data-portal-360 data-fr="Explorer en 360°" data-en="Explore in 360°">Explorer en 360°</button>
        </div>
      </div>
    </div>
  `;

  anchor.insertAdjacentElement('afterend', section);

  const isEnglish = () => document.documentElement.lang === 'en';
  const applyLanguage = () => {
    const lang = isEnglish() ? 'en' : 'fr';
    section.querySelectorAll('[data-fr][data-en]').forEach(element => {
      element.textContent = element.dataset[lang];
    });
    section.setAttribute('aria-label', isEnglish() ? 'Immersive passage through TAO Passot' : 'Traversée immersive de TAO Passot');
  };
  applyLanguage();

  document.querySelector('[data-language]')?.addEventListener('click', () => requestAnimationFrame(applyLanguage));

  section.querySelector('[data-portal-360]')?.addEventListener('click', () => {
    document.querySelector('[data-domenea360]')?.click();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const sceneEls = [...section.querySelectorAll('[data-portal-scene]')];
  const metaEls = [...section.querySelectorAll('[data-portal-meta]')];
  const frameEls = [...section.querySelectorAll('[data-portal-frame]')];
  const intro = section.querySelector('[data-portal-intro]');
  const final = section.querySelector('[data-portal-final]');
  const mobile = window.matchMedia('(max-width: 760px)').matches;
  const insetY = mobile ? 31 : 34;
  const insetX = mobile ? 18 : 36;

  gsap.set(metaEls, { autoAlpha: 0, y: 18 });
  gsap.set(metaEls[0], { autoAlpha: 1, y: 0 });
  gsap.set(frameEls, { autoAlpha: 0 });
  gsap.set(final, { autoAlpha: 0, y: 20 });

  sceneEls.slice(1).forEach(scene => {
    gsap.set(scene, { visibility: 'visible', clipPath: `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round 2px)` });
  });

  const timeline = gsap.timeline({ defaults: { ease: 'none' } });
  timeline.to(intro, { autoAlpha: 0, y: -24, duration: .45 }, 0);

  sceneEls.slice(1).forEach((scene, offset) => {
    const index = offset + 1;
    const previous = sceneEls[index - 1];
    const previousImage = previous.querySelector('img');
    const currentImage = scene.querySelector('img');
    const frame = frameEls[index - 1];
    const start = offset + .48;

    timeline
      .set(frame, { autoAlpha: 1 }, start)
      .to(previousImage, { scale: 1.16, filter: 'brightness(.62) blur(2px)', duration: .9 }, start)
      .fromTo(currentImage, { scale: 1.18 }, { scale: 1, duration: 1 }, start)
      .to(scene, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1 }, start)
      .to(frame, { top: '0%', right: '0%', bottom: '0%', left: '0%', duration: 1 }, start)
      .to(frame, { autoAlpha: 0, duration: .16 }, start + .84)
      .to(metaEls[index - 1], { autoAlpha: 0, y: -12, duration: .24 }, start + .08)
      .to(metaEls[index], { autoAlpha: 1, y: 0, duration: .28 }, start + .7);
  });

  timeline.to(metaEls[metaEls.length - 1], { autoAlpha: 0, y: -12, duration: .2 }, '>-0.08');
  timeline.to(final, { autoAlpha: 1, y: 0, duration: .42 }, '<0.04');

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    animation: timeline,
    scrub: 0.75,
    invalidateOnRefresh: true,
    onEnter: () => document.documentElement.classList.add('is-scroll-portal-active'),
    onEnterBack: () => document.documentElement.classList.add('is-scroll-portal-active'),
    onLeave: () => document.documentElement.classList.remove('is-scroll-portal-active'),
    onLeaveBack: () => document.documentElement.classList.remove('is-scroll-portal-active')
  });

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', refresh, { once: true });
})();
