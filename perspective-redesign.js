(() => {
  'use strict';

  const section = document.querySelector('.above');
  if (!section || section.dataset.redesigned === 'true') return;

  section.dataset.redesigned = 'true';
  section.dataset.headerTheme = 'dark';
  section.classList.add('above-redesign');

  const pin = section.querySelector('.above-pin');
  if (!pin) return;

  const meta = document.createElement('div');
  meta.className = 'above-spatial-meta';
  meta.setAttribute('aria-hidden', 'true');
  meta.innerHTML = '<span>Madagascar</span><span>Océan Indien</span>';
  pin.appendChild(meta);

  const style = document.createElement('style');
  style.dataset.perspectiveRedesign = '';
  style.textContent = `
    .above-redesign {
      height: 100dvh !important;
      min-height: 720px;
      background: var(--forest-deep);
      color: var(--bone);
    }

    .above-redesign .above-pin {
      position: relative !important;
      top: auto !important;
      height: 100% !important;
      min-height: 720px !important;
      overflow: hidden;
      background: var(--forest-deep);
      color: var(--bone);
    }

    .above-redesign .above-sky {
      inset: 0 !important;
      background: var(--forest-deep) !important;
    }

    .above-redesign .above-pin::after {
      content: '';
      position: absolute;
      z-index: 4;
      top: 0;
      bottom: 0;
      left: 46%;
      width: 1px;
      background: rgba(233, 232, 223, .16);
      pointer-events: none;
    }

    .above-redesign .above-plane-a {
      position: absolute !important;
      z-index: 1;
      inset: 0 0 0 46% !important;
      width: 54% !important;
      height: 100% !important;
      background-image: url('https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/hero-fallback-ocean.png') !important;
      background-size: cover !important;
      background-position: center !important;
      clip-path: none !important;
      filter: saturate(.76) contrast(.98) brightness(.82) !important;
      box-shadow: none !important;
      transform: none !important;
      transform-origin: center right;
    }

    .above-redesign .above-plane-a::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(23, 32, 25, .34) 0%, rgba(23, 32, 25, .04) 28%, rgba(23, 32, 25, .08) 100%);
      pointer-events: none;
    }

    .above-redesign .above-plane-b,
    .above-redesign .above-orbit {
      display: none !important;
    }

    .above-redesign > .above-pin > small {
      position: absolute !important;
      z-index: 5;
      top: calc(var(--header-h) + 2rem) !important;
      left: var(--pad) !important;
      color: rgba(233, 232, 223, .66);
      font-size: .62rem;
      font-weight: 500;
      line-height: 1;
      letter-spacing: .15em;
      text-transform: uppercase;
    }

    .above-redesign h2 {
      position: absolute !important;
      z-index: 5;
      top: 21% !important;
      left: var(--pad) !important;
      width: min(37vw, 620px) !important;
      max-width: 7.2ch !important;
      margin: 0;
      color: var(--bone);
      font-size: clamp(4rem, 6vw, 6rem) !important;
      font-weight: 400;
      line-height: .86 !important;
      letter-spacing: -.045em !important;
      text-wrap: balance;
    }

    .above-redesign .above-caption {
      position: absolute !important;
      z-index: 5;
      left: var(--pad) !important;
      right: auto !important;
      bottom: 3rem !important;
      width: min(19vw, 330px) !important;
      margin: 0;
      color: rgba(233, 232, 223, .72);
      font-size: .86rem;
      line-height: 1.55;
    }

    .above-redesign .above-map {
      position: absolute !important;
      z-index: 3;
      top: auto !important;
      right: auto !important;
      left: 25.5vw !important;
      bottom: 2.1rem !important;
      width: min(17vw, 250px) !important;
      height: min(17vw, 250px) !important;
      opacity: .22 !important;
      transform: none !important;
      mix-blend-mode: screen;
      pointer-events: none;
    }

    .above-redesign .above-map img {
      object-fit: contain;
      filter: grayscale(1) brightness(1.18);
    }

    .above-redesign .above-spatial-meta {
      position: absolute;
      z-index: 5;
      right: var(--pad);
      bottom: 2.1rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      color: rgba(233, 232, 223, .78);
      font-size: .6rem;
      font-weight: 500;
      letter-spacing: .13em;
      text-transform: uppercase;
      pointer-events: none;
    }

    .above-redesign .above-spatial-meta span + span::before {
      content: '';
      display: inline-block;
      width: 26px;
      height: 1px;
      margin: 0 .75rem .18em 0;
      background: rgba(233, 232, 223, .34);
    }

    @media (max-width: 980px) {
      .above-redesign .above-pin::after { left: 50%; }
      .above-redesign .above-plane-a { inset-left: 50% !important; left: 50% !important; width: 50% !important; }
      .above-redesign h2 { width: 42vw !important; font-size: clamp(3.8rem, 7.3vw, 5.5rem) !important; }
      .above-redesign .above-caption { width: min(25vw, 300px) !important; }
      .above-redesign .above-map { left: 29vw !important; width: 18vw !important; height: 18vw !important; }
    }

    @media (max-width: 680px) {
      .above-redesign {
        height: 100dvh !important;
        min-height: 840px;
      }

      .above-redesign .above-pin {
        min-height: 840px !important;
      }

      .above-redesign .above-pin::after {
        top: 47%;
        bottom: auto;
        left: 0;
        right: 0;
        width: auto;
        height: 1px;
      }

      .above-redesign .above-plane-a {
        inset: 0 0 auto 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 47% !important;
        background-position: center 54% !important;
      }

      .above-redesign > .above-pin > small {
        top: calc(47% + 1.55rem) !important;
      }

      .above-redesign h2 {
        top: calc(47% + 4rem) !important;
        width: calc(100% - var(--pad) * 2) !important;
        max-width: 8ch !important;
        font-size: clamp(3.35rem, 14vw, 5rem) !important;
        line-height: .88 !important;
      }

      .above-redesign .above-caption {
        bottom: 1.55rem !important;
        width: min(55vw, 290px) !important;
        font-size: .78rem;
      }

      .above-redesign .above-map {
        left: auto !important;
        right: var(--pad) !important;
        bottom: 1.15rem !important;
        width: min(31vw, 155px) !important;
        height: min(31vw, 155px) !important;
        opacity: .17 !important;
      }

      .above-redesign .above-spatial-meta {
        top: calc(47% - 2rem);
        right: var(--pad);
        bottom: auto;
        font-size: .52rem;
        color: rgba(233, 232, 223, .7);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .above-redesign .above-plane-a,
      .above-redesign .above-map { transform: none !important; }
    }
  `;
  document.head.appendChild(style);

  const clearLegacyMotion = () => {
    if (window.ScrollTrigger) {
      window.ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === section) trigger.kill(true);
      });
    }

    if (window.gsap) {
      window.gsap.set([
        section.querySelector('.above-plane-a'),
        section.querySelector('.above-plane-b'),
        section.querySelector('.above-map'),
        section.querySelector('.above-orbit-a'),
        section.querySelector('.above-orbit-b')
      ].filter(Boolean), { clearProps: 'transform' });
    }
  };

  clearLegacyMotion();
  requestAnimationFrame(clearLegacyMotion);
})();