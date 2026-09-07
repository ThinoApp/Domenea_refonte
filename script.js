(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const entry = document.querySelector('[data-entry]');
  const entryClipPath = document.querySelector('#entryClipPath');
  const entrySkip = document.querySelector('[data-entry-skip]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuLabel = document.querySelector('[data-menu-label]');
  const menuOverlay = document.querySelector('[data-menu-overlay]');
  const languageButton = document.querySelector('[data-language]');
  const stack = document.querySelector('[data-stack]');
  const stackStage = document.querySelector('[data-stack-stage]');
  const stackScenes = [...document.querySelectorAll('[data-stack-scene]')];
  const revealBlocks = [...document.querySelectorAll('.reveal-block')];
  const revealMedia = [...document.querySelectorAll('.reveal-media')];
  const themeSections = [...document.querySelectorAll('[data-header-theme]')];
  const brochureForm = document.querySelector('[data-brochure-form]');

  let stackScrollTrigger = null;
  let headerThemeBeforeMenu = 'dark';
  let currentLanguage = localStorage.getItem('domenea-language') || 'fr';

  const clamp01 = (value) => Math.min(1, Math.max(0, value));
  const mix = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

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
    window.gsap?.delayedCall(.05, () => window.ScrollTrigger?.refresh());
  }

  function playEntry() {
    if (!entry || !entryClipPath || reducedMotion) {
      finishEntry();
      return;
    }

    const timing = {
      revealStart: 1.95,
      revealDuration: 1.5,
      total: 3.55,
    };

    let startedAt = performance.now();
    let raf = 0;
    let running = true;

    setEntryReveal(0);
    entry.classList.add('is-playing');

    const tick = (now) => {
      if (!running) return;
      const elapsed = (now - startedAt) / 1000;
      const reveal = clamp01((elapsed - timing.revealStart) / timing.revealDuration);
      setEntryReveal(reveal);

      if (elapsed < timing.total) {
        raf = requestAnimationFrame(tick);
      } else {
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

  function applyLanguage(language) {
    currentLanguage = language === 'en' ? 'en' : 'fr';
    localStorage.setItem('domenea-language', currentLanguage);
    document.documentElement.lang = currentLanguage;

    document.querySelectorAll('[data-fr][data-en]').forEach((node) => {
      node.textContent = node.dataset[currentLanguage] || node.textContent;
    });

    document.querySelectorAll('[data-fr-placeholder][data-en-placeholder]').forEach((node) => {
      node.setAttribute('placeholder', node.dataset[`${currentLanguage}Placeholder`] || '');
    });

    if (languageButton) {
      languageButton.textContent = currentLanguage === 'fr' ? 'EN' : 'FR';
      languageButton.setAttribute('aria-label', currentLanguage === 'fr' ? 'Switch to English' : 'Passer en français');
    }
  }

  function setMenu(open) {
    if (!menuToggle || !menuOverlay || !menuLabel) return;

    if (header) {
      if (open) {
        headerThemeBeforeMenu = header.dataset.theme || 'dark';
        header.dataset.theme = 'light';
      } else {
        header.dataset.theme = headerThemeBeforeMenu;
      }
    }

    menuToggle.setAttribute('aria-expanded', String(open));
    menuLabel.textContent = open ? (currentLanguage === 'fr' ? 'Fermer' : 'Close') : 'Menu';
    body.classList.toggle('menu-open', open);

    if (open) {
      menuOverlay.hidden = false;
      menuOverlay.classList.remove('is-entering');
      requestAnimationFrame(() => menuOverlay.classList.add('is-entering'));
      menuOverlay.querySelector('a, button')?.focus({ preventScroll: true });
    } else {
      menuOverlay.classList.remove('is-entering');
      menuOverlay.hidden = true;
      menuToggle.focus({ preventScroll: true });
    }
  }

  function initStack() {
    if (reducedMotion || !stack || !stackStage || stackScenes.length < 2) return;

    if (!window.gsap || !window.ScrollTrigger) {
      body.classList.add('no-gsap');
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

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
        scrub: .18,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => { if (header) header.dataset.theme = 'dark'; },
        onEnterBack: () => { if (header) header.dataset.theme = 'dark'; },
        onLeave: () => { if (header) header.dataset.theme = 'light'; },
      },
    });

    stackScenes.slice(1).forEach((scene) => {
      timeline.to(scene, { clipPath: 'inset(0% 0 0 0)', duration: 1 });
    });

    stackScrollTrigger = timeline.scrollTrigger;
  }

  function jumpToStackScene(index) {
    const targetIndex = Math.max(0, Math.min(stackScenes.length - 1, Number(index) || 0));

    if (reducedMotion || !stackScrollTrigger) {
      stackScenes[targetIndex]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      return;
    }

    const segmentCount = Math.max(1, stackScenes.length - 1);
    const progress = targetIndex / segmentCount;
    const top = stackScrollTrigger.start + (stackScrollTriggger.end - stackScrollTrigger.start) * progress;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function initReveals() {
    if (reducedMotion) {
      [...revealBlocks, ...revealMedia].forEach((node) => node.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .16, rootMargin: '0px 0px -8% 0px' });

    [...revealBlocks, ...revealMedia].forEach((node) => observer.observe(node));
  }

  function initHeaderThemes() {
    if (!header || !themeSections.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && !body.classList.contains('menu-open')) {
        header.dataset.theme = visible.target.dataset.headerTheme || 'light';
      }
    }, { threshold: [.22, .48, .72] });

    themeSections.forEach((section) => observer.observe(section));
  }

  function initBrochureForm() {
    if (!brochureForm) return;

    brochureForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!brochureForm.reportValidity()) return;

      const data = new FormData(brochureForm);
      const subject = currentLanguage === 'fr' ? 'Demande brochure TAO Passot' : 'TAO Passot brochure request';
      const labels = currentLanguage === 'fr'
        ? { name: 'Nom', email: 'Email', phone: 'Téléphone', program: 'Programme', message: 'Demande' }
        : { name: 'Name', email: 'Email', phone: 'Phone', program: 'Program', message: 'Request' };

      const bodyLines = ['name', 'email', 'phone', 'program', 'message']
        .map((key) => `${labels[key]}: ${String(data.get(key) || '').trim()}`)
        .filter((line) => !line.endsWith(': '));

      window.location.href = `mailto:info@domenea.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    });
  }

  languageButton?.addEventListener('click', () => applyLanguage(currentLanguage === 'fr' ? 'en' : 'fr'));

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  menuOverlay?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  menuOverlay?.querySelectorAll('[data-stack-jump]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = button.dataset.stackJump;
      setMenu(false);
      requestAnimationFrame(() => jumpToStackScene(index));
    });
  });

  document.querySelectorAll('[data-stack-jump]').forEach((button) => {
    if (button.closest('[data-menu-overlay]')) return;
    button.addEventListener('click', () => jumpToStackScene(button.dataset.stackJump));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') setMenu(false);
  });

  applyLanguage(currentLanguage);
  initStack();
  initReveals();
  initHeaderThemes();
  initBrochureForm();
  playEntry();
})();
