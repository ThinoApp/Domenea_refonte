(() => {
  'use strict';

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!finePointer || !canHover || reducedMotion) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes domeneaCursorMorph {
      0%, 100% { border-radius: 50%; transform: translate3d(var(--cursor-x), var(--cursor-y), 0) rotate(0deg) scale(1); }
      28% { border-radius: 44% 56% 58% 42% / 48% 43% 57% 52%; }
      58% { border-radius: 58% 42% 45% 55% / 42% 58% 42% 58%; transform: translate3d(var(--cursor-x), var(--cursor-y), 0) rotate(7deg) scale(1.04); }
      82% { border-radius: 47% 53% 41% 59% / 58% 46% 54% 42%; }
    }

    [data-domenea-cursor] {
      --cursor-x: -100px;
      --cursor-y: -100px;
      position: fixed;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
      margin: -15px 0 0 -15px;
      background: #fff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 135;
      opacity: 0;
      mix-blend-mode: difference;
      will-change: transform, border-radius;
      transition: opacity 160ms ease-out;
      animation: domeneaCursorMorph 2.4s cubic-bezier(.16, 1, .3, 1) infinite;
    }

    [data-domenea-cursor][data-visible="true"] { opacity: 1; }
  `;
  document.head.appendChild(style);

  const cursor = document.createElement('div');
  cursor.setAttribute('aria-hidden', 'true');
  cursor.dataset.domeneaCursor = '';
  cursor.dataset.visible = 'false';
  document.body.appendChild(cursor);

  const pointer = {
    targetX: -100,
    targetY: -100,
    x: -100,
    y: -100,
    seen: false,
    inside: false
  };

  let frame = 0;
  let entryLocked = document.body.classList.contains('is-entry-locked');

  const setVisible = visible => {
    cursor.dataset.visible = visible && !entryLocked ? 'true' : 'false';
  };

  const render = () => {
    frame = 0;

    const ease = 0.22;
    pointer.x += (pointer.targetX - pointer.x) * ease;
    pointer.y += (pointer.targetY - pointer.y) * ease;

    cursor.style.setProperty('--cursor-x', `${pointer.x}px`);
    cursor.style.setProperty('--cursor-y', `${pointer.y}px`);

    const distance = Math.hypot(pointer.targetX - pointer.x, pointer.targetY - pointer.y);
    if (pointer.inside && distance > 0.08) {
      frame = requestAnimationFrame(render);
    } else {
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
      cursor.style.setProperty('--cursor-x', `${pointer.x}px`);
      cursor.style.setProperty('--cursor-y', `${pointer.y}px`);
    }
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  window.addEventListener('pointermove', event => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;

    if (!pointer.seen) {
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
      pointer.seen = true;
    }

    pointer.inside = true;
    setVisible(true);
    wake();
  }, { passive: true });

  window.addEventListener('pointerenter', event => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    pointer.inside = true;
    if (pointer.seen) setVisible(true);
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    pointer.inside = false;
    setVisible(false);
  }, { passive: true });

  window.addEventListener('blur', () => {
    pointer.inside = false;
    setVisible(false);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      setVisible(false);
    }
  });

  const bodyObserver = new MutationObserver(() => {
    const nextLocked = document.body.classList.contains('is-entry-locked');
    if (nextLocked === entryLocked) return;
    entryLocked = nextLocked;
    setVisible(pointer.seen && pointer.inside);
  });

  bodyObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
})();