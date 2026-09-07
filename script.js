(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menuLabel = document.querySelector('[data-menu-label]');
  const menuOverlay = document.querySelector('[data-menu-overlay]');
  const scenes = [...document.querySelectorAll('[data-scene]')];
  const themeSections = [...document.querySelectorAll('[data-header-theme]')];
  const railButtons = [...document.querySelectorAll('[data-jump]')];
  const revealMedia = [...document.querySelectorAll('.reveal-media')];
  let headerThemeBeforeMenu = 'dark';

  const setMenu = (open) => {
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
    menuLabel.textContent = open ? 'Fermer' : 'Menu';
    document.body.classList.toggle('menu-open', open);

    if (open) {
      menuOverlay.hidden = false;
      menuOverlay.classList.remove('is-entering');
      requestAnimationFrame(() => menuOverlay.classList.add('is-entering'));
      menuOverlay.querySelector('a')?.focus({ preventScroll: true });
    } else {
      menuOverlay.classList.remove('is-entering');
      menuOverlay.hidden = true;
      menuToggle.focus({ preventScroll: true });
    }
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  menuOverlay?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
    }
  });

  railButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.jump || '');
      target?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      scenes.forEach((scene) => scene.classList.toggle('is-active', scene === entry.target));
      railButtons.forEach((button) => {
        button.classList.toggle('is-active', button.dataset.jump === entry.target.id);
      });
    });
  }, { threshold: 0.58 });

  scenes.forEach((scene) => sceneObserver.observe(scene));
  railButtons[0]?.classList.add('is-active');

  const themeObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible && header) {
      header.dataset.theme = visible.target.dataset.headerTheme || 'dark';
    }
  }, { threshold: [0.25, 0.5, 0.75] });

  themeSections.forEach((section) => themeObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

  if (reducedMotion) {
    revealMedia.forEach((item) => item.classList.add('is-visible'));
  } else {
    revealMedia.forEach((item) => revealObserver.observe(item));
  }

  if (!reducedMotion) {
    scenes.forEach((scene) => {
      scene.addEventListener('pointermove', (event) => {
        const rect = scene.getBoundingClientRect();
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
        scene.style.setProperty('--scene-y', `${y.toFixed(2)}px`);
      }, { passive: true });

      scene.addEventListener('pointerleave', () => {
        scene.style.setProperty('--scene-y', '0px');
      }, { passive: true });
    });
  }
})();
