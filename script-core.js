(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactMotion = window.matchMedia('(max-width: 820px)').matches;

  const body = document.body;
  const header = $('[data-header]');
  const entry = $('[data-entry]');
  const entryClipPath = $('#entryClipPath');
  const entrySkip = $('[data-entry-skip]');
  const menuToggle = $('[data-menu-toggle]');
  const menuOverlay = $('[data-menu-overlay]');
  const menuLabel = $('[data-menu-label]');
  const languageButton = $('[data-language]');
  const stack = $('[data-stack]');
  const stackStage = $('[data-stack-stage]');
  const stackScenes = $$('[data-stack-scene]');
  const identitySlides = $$('[data-identity-slide]');
  const identityCounter = $('[data-identity-current]');
  const typeRows = $$('.type-row');
  const brochureForm = $('[data-brochure-form]');
  const formStatus = $('[data-form-status]');

  let currentLanguage = localStorage.getItem('domenea-language') === 'en' ? 'en' : 'fr';
  let stackScrollTrigger = null;
  let lenis = null;
  let menuOpen = false;
  let headerThemeBeforeMenu = 'dark';
  const motionCleanups = [];

  const clamp01 = value => Math.min(1, Math.max(0, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  function archGeometry(progress) {
    const widthP = easeInOutCubic(clamp01(progress));
    const heightP = easeOutQuart(clamp01(progress));
    const width = mix(.07, 1.56, widthP);
    const height = mix(.045, 1.34, heightP);
    const cx = .5;
    const x0 = cx - width * .5;
    const x1 = cx + width * .5;
    const yBottom = 1;
    const yTop = 1 - height;
    const capDepth = Math.min(width * mix(.46, .29, widthP), height * .52);
    const shoulderY = yTop + capDepth;
    const controlX = width * mix(.22, .27, widthP);
    const c1x = cx - controlX;
    const c2x = cx + controlX;

    return `M ${x0.toFixed(5)} ${yBottom.toFixed(5)} ` +
      `L ${x0.toFixed(5)} ${shoulderY.toFixed(5)} ` +
      `C ${x0.toFixed(5)} ${(yTop + capDepth * .46).toFixed(5)} ` +
      `${c1x.toFixed(5)} ${yTop.toFixed(5)} ${cx.toFixed(5)} ${yTop.toFixed(5)} ` +
      `C ${c2x.toFixed(5)} ${yTop.toFixed(5)} ` +
      `${x1.toFixed(5)} ${(yTop + capDepth * .46).toFixed(5)} ` +
      `${x1.toFixed(5)} ${shoulderY.toFixed(5)} L ${x1.toFixed(5)} ${yBottom.toFixed(5)} Z`;
  }

  function setEntryReveal(progress) {
    if (!entryClipPath) return;
    entryClipPath.setAttribute('d', `M 0 0 H 1 V 1 H 0 Z ${archGeometry(progress)}`);
  }

  function finishEntry() {
    if (!entry || entry.classList.contains('is-complete')) return;
    setEntryReveal(1);
    entry.classList.add('is-complete');
    body.classList.remove('is-entry-locked');
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  function playEntry() {
    if (!entry || !entryClipPath || reducedMotion) {
      finishEntry();
      return;
    }

    const timing = { revealStart: 1.9, revealDuration: 1.48, total: 3.48 };
    const startedAt = performance.now();
    let raf = 0;
    let running = true;

    setEntryReveal(0);
    entry.classList.add('is-playing');

    const tick = now => {
      if (!running) return;
      const elapsed = (now - startedAt) / 1000;
      const reveal = clamp01((elapsed - timing.revealStart) / timing.revealDuration);
      setEntryReveal(reveal);
      if (elapsed < timing.total) raf = requestAnimationFrame(tick);
      else {
        running = false;
        finishEntry();
      }
    };

    entrySkip?.addEventListener('click', () => {
      running = false;
      cancelAnimationFrame(raf);
      finishEntry();
    }, { once: true });

    raf = requestAnimationFrame(tick);
  }

  function prepareWordRevealElement(element) {
    const text = element.dataset[currentLanguage] || element.textContent || '';
    const words = text.trim().split(/\s+/).filter(Boolean);
    element.innerHTML = '';
    words.forEach((word, index) => {
      const mask = document.createElement('span');
      mask.className = 'word-mask';
      const inner = document.createElement('span');
      inner.textContent = word;
      inner.style.transitionDelay = `${Math.min(index * 22, 220)}ms`;
      mask.appendChild(inner);
      element.appendChild(mask);
      if (index < words.length - 1) element.appendChild(document.createTextNode(' '));
    });
  }

  function prepareWordReveals() {
    $$('.reveal-words').forEach(element => prepareWordRevealElement(element));
  }

  function applyLanguage(language) {
    currentLanguage = language === 'en' ? 'en' : 'fr';
    localStorage.setItem('domenea-language', currentLanguage);
    document.documentElement.lang = currentLanguage;

    $$('[data-fr][data-en]').forEach(node => {
      if (node.classList.contains('reveal-words')) return;
      node.textContent = node.dataset[currentLanguage] || node.textContent;
    });

    $$('[data-fr-placeholder][data-en-placeholder]').forEach(node => {
      const key = currentLanguage === 'fr' ? 'frPlaceholder' : 'enPlaceholder';
      node.setAttribute('placeholder', node.dataset[key] || '');
    });

    prepareWordReveals();
    initWordRevealObserver();
    updateTypePreview($('.type-row.is-active') || typeRows[0], false);
    updateLocationDetail($('.map-point.is-active') || $('.map-point'));

    if (languageButton) {
      languageButton.textContent = currentLanguage === 'fr' ? 'EN' : 'FR';
      languageButton.setAttribute('aria-label', currentLanguage === 'fr' ? 'Switch to English' : 'Passer en français');
    }

    if (menuLabel && menuOpen) menuLabel.textContent = currentLanguage === 'fr' ? 'Fermer' : 'Close';
  }

  function setMenu(open) {
    if (!menuOverlay || !menuToggle || !menuLabel) return;
    menuOpen = open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuOverlay.setAttribute('aria-hidden', String(!open));
    body.classList.toggle('menu-open', open);
    menuLabel.textContent = open ? (currentLanguage === 'fr' ? 'Fermer' : 'Close') : 'Menu';

    if (header) {
      if (open) {
        headerThemeBeforeMenu = header.dataset.theme || 'dark';
        header.dataset.theme = 'light';
      } else header.dataset.theme = headerThemeBeforeMenu;
    }

    if (open) {
      menuOverlay.style.visibility = 'visible';
      menuOverlay.classList.add('is-open');
    }

    if (window.gsap && !reducedMotion) {
      const links = $$('.menu-nav span');
      window.gsap.to(menuOverlay, {
        clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
        duration: .82,
        ease: 'power4.inOut',
        onComplete: () => {
          if (!open) {
            menuOverlay.classList.remove('is-open');
            menuOverlay.style.visibility = 'hidden';
          }
        }
      });
      if (open) window.gsap.fromTo(links, { yPercent: 115 }, { yPercent: 0, duration: .72, stagger: .035, delay: .16, ease: 'power4.out' });
    } else {
      menuOverlay.style.clipPath = open ? 'inset(0)' : 'inset(0 0 100% 0)';
      if (!open) {
        menuOverlay.classList.remove('is-open');
        menuOverlay.style.visibility = 'hidden';
      }
    }
  }

  function initLenis() {
    if (reducedMotion || compactMotion || !window.Lenis || !window.gsap || !window.ScrollTrigger) return;
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: .88, touchMultiplier: 1.05 });
    lenis.on('scroll', window.ScrollTrigger.update);
    const tick = time => lenis.raf(time * 1000);
    window.gsap.ticker.add(tick);
    window.gsap.ticker.lagSmoothing(0);
    motionCleanups.push(() => {
      window.gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    });
  }

  function initStack() {
    if (reducedMotion || !stack || !stackStage || stackScenes.length < 2) return;
    if (!window.gsap || !window.ScrollTrigger) {
      body.classList.add('no-gsap');
      return;
    }

    const { gsap } = window;
    stackScenes.forEach((scene, index) => {
      gsap.set(scene, { clipPath: index === 0 ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' });
    });

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stack,
        start: 'top top',
        end: () => `+=${Math.max(1, stackScenes.length - 1) * window.innerHeight}`,
        pin: stackStage,
        pinSpacing: true,
        scrub: .2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => { if (header) header.dataset.theme = 'dark'; },
        onEnterBack: () => { if (header) header.dataset.theme = 'dark'; },
        onLeave: () => { if (header) header.dataset.theme = 'dark'; }
      }
    });

    stackScenes.slice(1).forEach(scene => timeline.to(scene, { clipPath: 'inset(0% 0 0 0)', duration: 1 }));
    stackScrollTrigger = timeline.scrollTrigger;

    gsap.to('.hero-title-top', { xPercent: -7, ease: 'none', scrollTrigger: { trigger: stack, start: 'top top', end: () => `+=${window.innerHeight}`, scrub: true } });
    gsap.to('.hero-title-bottom', { xPercent: 8, ease: 'none', scrollTrigger: { trigger: stack, start: 'top top', end: () => `+=${window.innerHeight}`, scrub: true } });
  }

  function jumpToStackScene(index) {
    const targetIndex = Math.max(0, Math.min(stackScenes.length - 1, Number(index) || 0));
    if (!stackScrollTrigger || reducedMotion) {
      stackScenes[targetIndex]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const segmentCount = Math.max(1, stackScenes.length - 1);
    const progress = targetIndex / segmentCount;
    const top = stackScrollTrigger.start + (stackScrollTrigger.end - stackScrollTrigger.start) * progress;
    if (lenis) lenis.scrollTo(top, { duration: 1.1 });
    else window.scrollTo({ top, behavior: 'smooth' });
  }

  let wordObserver = null;
  function initWordRevealObserver() {
    wordObserver?.disconnect();
    const elements = $$('.reveal-words');
    if (reducedMotion) {
      elements.forEach(element => element.classList.add('is-word-visible'));
      return;
    }
    wordObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-word-visible');
        wordObserver.unobserve(entry.target);
      });
    }, { threshold: .22, rootMargin: '0px 0px -8% 0px' });
    elements.forEach(element => wordObserver.observe(element));
  }

  function initImageMasks() {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) {
      $$('.image-mask').forEach(element => element.style.clipPath = 'inset(0%)');
      return;
    }
    $$('.image-mask').forEach(element => {
      window.gsap.fromTo(element,
        { clipPath: 'inset(8% 8% 8% 8%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: element, start: 'top 88%', end: 'top 42%', scrub: .55 } }
      );
    });
  }

  function initIdentity() {
    if (reducedMotion || compactMotion || !window.gsap || !window.ScrollTrigger || identitySlides.length < 2) return;
    const { gsap } = window;
    gsap.set(identitySlides[0], { autoAlpha: 1, y: 0 });
    identitySlides[0].classList.add('is-active');

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.identity',
        start: 'top top',
        end: 'bottom bottom',
        scrub: .72,
        onUpdate: self => {
          if (!identityCounter) return;
          const current = Math.round(self.progress * (identitySlides.length - 1));
          identityCounter.textContent = String(current + 1).padStart(2, '0');
        }
      }
    });

    identitySlides.forEach((slide, index) => {
      if (index === 0) return;
      timeline
        .to(identitySlides[index - 1], { autoAlpha: 0, y: -34, duration: .18, onStart: () => identitySlides[index - 1].classList.remove('is-active') }, index - .15)
        .fromTo(slide, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: .28, onStart: () => slide.classList.add('is-active') }, index)
        .to('.identity-media img', { scale: 1 + index * .042, xPercent: index % 2 ? 2 : -2, duration: .45 }, index - .06);
    });

    gsap.to('.identity-ghost', { yPercent: -13, ease: 'none', scrollTrigger: { trigger: '.identity', start: 'top top', end: 'bottom bottom', scrub: true } });
  }

  function updateLocationDetail(point) {
    if (!point) return;
    $$('.map-point').forEach(item => item.classList.toggle('is-active', item === point));
    const place = currentLanguage === 'fr' ? point.dataset.placeFr : point.dataset.placeEn;
    const time = point.dataset.time || '';
    const placeNode = $('[data-location-place]');
    const timeNode = $('[data-location-time]');
    if (placeNode) placeNode.textContent = place || '';
    if (timeNode) timeNode.textContent = time;
  }

  function initLocation() {
    $$('.map-point').forEach(point => {
      point.addEventListener('mouseenter', () => updateLocationDetail(point));
      point.addEventListener('focus', () => updateLocationDetail(point));
      point.addEventListener('click', () => updateLocationDetail(point));
    });

    if (reducedMotion || compactMotion || !window.gsap || !window.ScrollTrigger) return;
    const timeline = window.gsap.timeline({ scrollTrigger: { trigger: '.location', start: 'top top', end: 'bottom bottom', scrub: .8 } });
    timeline
      .to('.location-image-bg', { scale: 1.14, yPercent: 6, duration: 1 }, 0)
      .to('.map-orbit-1', { rotate: 8, scale: 1.16, duration: 1 }, 0)
      .to('.map-orbit-2', { rotate: -22, scale: .92, duration: 1 }, 0)
      .to('.map-point-1', { x: 18, y: -12, duration: 1 }, 0)
      .to('.map-point-3', { x: -20, y: 16, duration: 1 }, 0);
  }

  function updateTypePreview(row, animate = true) {
    if (!row) return;
    typeRows.forEach(item => {
      const active = item === row;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });

    const index = typeRows.indexOf(row);
    const image = $('[data-type-image]');
    const title = $('[data-type-title]');
    const rooms = $('[data-type-rooms]');
    const number = $('[data-type-number]');
    const description = $('[data-type-description]');
    const previewMedia = $('.types-preview-media');

    const type = currentLanguage === 'fr' ? row.dataset.type : row.dataset.typeEn;
    const roomText = currentLanguage === 'fr' ? row.dataset.roomsFr : row.dataset.roomsEn;
    const descriptionText = currentLanguage === 'fr' ? row.dataset.descriptionFr : row.dataset.descriptionEn;

    if (number) number.textContent = String(index + 1).padStart(2, '0');
    if (title) title.textContent = type || '';
    if (rooms) rooms.textContent = roomText || '';
    if (description) description.textContent = descriptionText || '';

    if (image && row.dataset.image && image.src !== row.dataset.image) {
      if (animate) previewMedia?.classList.add('is-changing');
      const nextImage = new Image();
      nextImage.onload = () => {
        image.src = row.dataset.image;
        image.alt = `${type || 'TAO Passot'} - TAO Passot`;
        requestAnimationFrame(() => previewMedia?.classList.remove('is-changing'));
      };
      nextImage.onerror = () => previewMedia?.classList.remove('is-changing');
      nextImage.src = row.dataset.image;
    }
  }

  function initTypes() {
    typeRows.forEach(row => {
      row.addEventListener('mouseenter', () => updateTypePreview(row));
      row.addEventListener('focus', () => updateTypePreview(row));
      row.addEventListener('click', () => updateTypePreview(row));
    });
    updateTypePreview(typeRows[0], false);
  }

  function initResidenceMotion() {
    const title = $('[data-split-static]');
    if (!title) return;
    const text = title.textContent || '';
    title.innerHTML = '';
    [...text].forEach(char => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      title.appendChild(span);
    });

    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    window.gsap.from($$('.residences-hero-title .char'), {
      yPercent: 120,
      duration: .82,
      stagger: .025,
      ease: 'power4.out',
      scrollTrigger: { trigger: '.residences-hero', start: 'top 55%', once: true }
    });
    window.gsap.to('.residences-hero img', { yPercent: 7, scale: 1.055, ease: 'none', scrollTrigger: { trigger: '.residences-hero', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  function initRoots() {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    const timeline = window.gsap.timeline({ scrollTrigger: { trigger: '.roots', start: 'top top', end: 'bottom bottom', scrub: .8 } });
    timeline
      .to('.roots-layer-one', { scale: 1.12, filter: 'saturate(.34) brightness(.48)', duration: 1 }, 0)
      .to('.roots-layer-two', { opacity: 1, scale: 1.07, duration: .46 }, .5)
      .fromTo('.roots h2 span:first-child', { xPercent: -4 }, { xPercent: 5, duration: 1 }, 0)
      .fromTo('.roots h2 span:last-child', { xPercent: 4 }, { xPercent: -5, duration: 1 }, 0)
      .to('.roots p', { y: -42, duration: 1 }, 0);
  }

  function initAmenities() {
    if (reducedMotion || compactMotion || !window.gsap || !window.ScrollTrigger) return;
    const track = $('.amenities-track');
    if (!track) return;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    window.gsap.to(track, { x: () => -distance(), ease: 'none', scrollTrigger: { trigger: '.amenities', start: 'top top', end: 'bottom bottom', scrub: .65, invalidateOnRefresh: true } });
  }

  function initAbove() {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    const timeline = window.gsap.timeline({ scrollTrigger: { trigger: '.above', start: 'top top', end: 'bottom bottom', scrub: .8 } });
    timeline
      .fromTo('.above-plane-a', { xPercent: -16, yPercent: 10 }, { xPercent: 22, yPercent: -8, duration: 1 }, 0)
      .fromTo('.above-plane-b', { xPercent: 17, yPercent: 7 }, { xPercent: -15, yPercent: -8, duration: 1 }, 0)
      .to('.above-map', { rotate: 5, scale: 1.08, yPercent: -7, duration: 1 }, 0)
      .to('.above-orbit-a', { rotate: 14, scale: 1.12, duration: 1 }, 0)
      .to('.above-orbit-b', { rotate: -18, scale: .94, duration: 1 }, 0);
  }

  function initAcquisitionRows() {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    $$('.acquisition-steps li').forEach((row, index) => {
      window.gsap.from(row.querySelector('strong'), { xPercent: -16, opacity: 0, scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 55%', scrub: .58 } });
      window.gsap.from(row.querySelector('span'), { x: 54 + index * 8, opacity: 0, scrollTrigger: { trigger: row, start: 'top 88%', end: 'top 55%', scrub: .58 } });
    });
  }

  function initFooterMotion() {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;
    window.gsap.from('.footer-head h2', { yPercent: 30, opacity: 0, duration: 1.05, ease: 'power4.out', scrollTrigger: { trigger: '.footer', start: 'top 65%', once: true } });
    window.gsap.to('.footer-word', { xPercent: -7, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  }

  function initGenericParallax() {
    if (reducedMotion || compactMotion || !window.gsap || !window.ScrollTrigger) return;
    $$('[data-parallax]').forEach(element => {
      const amount = Number(element.dataset.parallax || .03) * 100;
      window.gsap.fromTo(element,
        { yPercent: -amount },
        { yPercent: amount, ease: 'none', scrollTrigger: { trigger: element.closest('section') || element, start: 'top bottom', end: 'bottom top', scrub: true } }
      );
    });
  }

  function initHeaderThemes() {
    if (!header) return;
    const sections = $$('[data-header-theme]');
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      if (menuOpen) return;
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) header.dataset.theme = visible.target.dataset.headerTheme || 'dark';
    }, { threshold: [.22, .48, .72] });
    sections.forEach(section => observer.observe(section));
  }

  function initBrochureForm() {
    if (!brochureForm) return;
    brochureForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!brochureForm.reportValidity()) return;

      const data = new FormData(brochureForm);
      const subject = currentLanguage === 'fr' ? 'Demande brochure TAO Passot' : 'TAO Passot brochure request';
      const labels = currentLanguage === 'fr'
        ? { name: 'Nom', email: 'Email', phone: 'Téléphone', program: 'Programme' }
        : { name: 'Name', email: 'Email', phone: 'Phone', program: 'Program' };
      const lines = ['name', 'email', 'phone', 'program']
        .map(key => `${labels[key]}: ${String(data.get(key) || '').trim()}`)
        .filter(line => !line.endsWith(': '));

      if (formStatus) formStatus.textContent = currentLanguage === 'fr' ? 'Ouverture de votre logiciel de messagerie.' : 'Opening your email application.';
      window.location.href = `mailto:info@domenea.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    });
  }

  function initMenuAndNavigation() {
    document.addEventListener('domenea:scroll-lock', event => {
      if (event.detail?.locked) lenis?.stop();
      else lenis?.start();
    });
    document.addEventListener('domenea:scroll-to', event => {
      const top = event.detail?.top;
      if (!Number.isFinite(top)) return;
      if (lenis) lenis.scrollTo(top, { duration: 1.15 });
      else window.scrollTo({ top, behavior: reducedMotion ? 'instant' : 'smooth' });
    });
    menuToggle?.addEventListener('click', () => setMenu(!menuOpen));
    languageButton?.addEventListener('click', () => applyLanguage(currentLanguage === 'fr' ? 'en' : 'fr'));

    $$('[data-stack-jump]').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.dataset.stackJump;
        if (button.closest('[data-menu-overlay]')) setMenu(false);
        requestAnimationFrame(() => jumpToStackScene(index));
      });
    });

    $$('.menu-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuOpen) setMenu(false);
    });
  }

  function initMotion() {
    if (!window.gsap || !window.ScrollTrigger) {
      body.classList.add('no-gsap');
      return;
    }
    window.gsap.registerPlugin(window.ScrollTrigger);
    initLenis();
    initStack();
    initImageMasks();
    initIdentity();
    initResidenceMotion();
    initRoots();
    initAmenities();
    initAbove();
    initAcquisitionRows();
    initFooterMotion();
    initGenericParallax();
    window.ScrollTrigger.refresh();
  }

  initMenuAndNavigation();
  initLocation();
  initTypes();
  initHeaderThemes();
  initBrochureForm();
  applyLanguage(currentLanguage);
  initMotion();
  playEntry();

  window.addEventListener('pagehide', () => {
    wordObserver?.disconnect();
    motionCleanups.forEach(cleanup => cleanup());
  }, { once: true });
})();
