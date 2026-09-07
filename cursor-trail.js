(() => {
  'use strict';

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const canHover = window.matchMedia('(hover: hover)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!finePointer || !canHover || reducedMotion) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.cursorTrail = '';
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '135',
    opacity: '0',
    transition: 'opacity 180ms ease-out',
    contain: 'strict'
  });
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!context) {
    canvas.remove();
    return;
  }

  const strands = [
    { spring: 0.235, friction: 0.705, width: 1.15, alpha: 0.42, offset: -2.3, warmth: '167, 132, 91' },
    { spring: 0.205, friction: 0.735, width: 0.9, alpha: 0.3, offset: 0, warmth: '184, 151, 108' },
    { spring: 0.178, friction: 0.765, width: 0.7, alpha: 0.22, offset: 2.6, warmth: '140, 111, 76' }
  ];

  const pointCount = 18;
  const pointer = { x: 0, y: 0, px: 0, py: 0, speed: 0, seen: false, inside: false };
  let width = 0;
  let height = 0;
  let dpr = 1;
  let frame = 0;
  let lastMoveAt = 0;
  let lastFrameAt = performance.now();
  let visible = false;
  let entryLocked = document.body.classList.contains('is-entry-locked');

  const ropes = strands.map(config => ({
    config,
    points: Array.from({ length: pointCount }, () => ({ x: 0, y: 0, vx: 0, vy: 0 }))
  }));

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
  };

  const seed = (x, y) => {
    ropes.forEach(({ points }) => {
      points.forEach(point => {
        point.x = x;
        point.y = y;
        point.vx = 0;
        point.vy = 0;
      });
    });
  };

  const setVisible = nextVisible => {
    visible = nextVisible;
    canvas.style.opacity = nextVisible ? '1' : '0';
  };

  const wake = () => {
    if (!frame) {
      lastFrameAt = performance.now();
      frame = requestAnimationFrame(render);
    }
  };

  const updatePointer = event => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

    const events = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [event];
    const latest = events[events.length - 1] || event;
    const nextX = latest.clientX;
    const nextY = latest.clientY;

    if (!pointer.seen) {
      pointer.x = pointer.px = nextX;
      pointer.y = pointer.py = nextY;
      pointer.seen = true;
      seed(nextX, nextY);
    }

    const dx = nextX - pointer.x;
    const dy = nextY - pointer.y;
    pointer.px = pointer.x;
    pointer.py = pointer.y;
    pointer.x = nextX;
    pointer.y = nextY;
    pointer.speed = Math.min(90, Math.hypot(dx, dy));
    pointer.inside = true;
    lastMoveAt = performance.now();

    if (!entryLocked) setVisible(true);
    wake();
  };

  const drawStrand = (rope, speedFactor) => {
    const { points, config } = rope;
    if (points.length < 3) return;

    for (let i = points.length - 2; i >= 0; i -= 1) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const p2 = points[Math.min(points.length - 1, i + 2)];
      const progress = 1 - i / (points.length - 1);
      const tailFade = Math.pow(progress, 1.42);
      const motionFade = 0.42 + speedFactor * 0.58;
      const alpha = config.alpha * tailFade * motionFade;
      if (alpha < 0.008) continue;

      context.beginPath();
      context.moveTo(p0.x, p0.y);
      context.quadraticCurveTo(
        p1.x,
        p1.y,
        (p1.x + p2.x) * 0.5,
        (p1.y + p2.y) * 0.5
      );
      context.strokeStyle = `rgba(${config.warmth}, ${alpha})`;
      context.lineWidth = config.width * (0.72 + tailFade * 0.38);
      context.stroke();
    }
  };

  function render(now) {
    frame = 0;
    const dt = Math.min(2, Math.max(0.5, (now - lastFrameAt) / 16.667));
    lastFrameAt = now;

    context.clearRect(0, 0, width, height);

    if (!pointer.seen || entryLocked) {
      setVisible(false);
      if (pointer.seen) seed(pointer.x, pointer.y);
      return;
    }

    const dx = pointer.x - pointer.px;
    const dy = pointer.y - pointer.py;
    const velocityLength = Math.hypot(dx, dy);
    const nx = velocityLength > 0.001 ? -dy / velocityLength : 0;
    const ny = velocityLength > 0.001 ? dx / velocityLength : 0;
    const speedFactor = Math.min(1, pointer.speed / 38);
    const separation = 0.45 + speedFactor * 0.75;

    let maxMotion = 0;

    ropes.forEach(({ points, config }, strandIndex) => {
      const lead = points[0];
      const targetX = pointer.x + nx * config.offset * separation;
      const targetY = pointer.y + ny * config.offset * separation;
      const leadSpring = config.spring * (1 + speedFactor * 0.22);

      lead.vx = (lead.vx + (targetX - lead.x) * leadSpring * dt) * Math.pow(config.friction, dt);
      lead.vy = (lead.vy + (targetY - lead.y) * leadSpring * dt) * Math.pow(config.friction, dt);
      lead.x += lead.vx * dt;
      lead.y += lead.vy * dt;
      maxMotion = Math.max(maxMotion, Math.abs(lead.vx) + Math.abs(lead.vy));

      for (let i = 1; i < points.length; i += 1) {
        const previous = points[i - 1];
        const point = points[i];
        const tail = i / (points.length - 1);
        const spring = (config.spring * (0.57 - tail * 0.17)) * dt;
        const friction = Math.pow(Math.min(0.91, config.friction + 0.075 + tail * 0.055), dt);
        const microBend = Math.sin((i + 1) * 0.78 + strandIndex * 1.9) * speedFactor * 0.14;

        point.vx = (point.vx + (previous.x - point.x) * spring + nx * microBend) * friction;
        point.vy = (point.vy + (previous.y - point.y) * spring + ny * microBend) * friction;
        point.x += point.vx * dt;
        point.y += point.vy * dt;
        maxMotion = Math.max(maxMotion, Math.abs(point.vx) + Math.abs(point.vy));
      }

      drawStrand({ points, config }, speedFactor);
    });

    pointer.speed *= Math.pow(0.76, dt);
    pointer.px += (pointer.x - pointer.px) * 0.4;
    pointer.py += (pointer.y - pointer.py) * 0.4;

    const idleFor = now - lastMoveAt;
    if (!pointer.inside || idleFor > 110) {
      const fadeProgress = Math.min(1, Math.max(0, (idleFor - 110) / 760));
      canvas.style.opacity = String(Math.max(0, 1 - fadeProgress));
    }

    if (idleFor > 920 && maxMotion < 0.075) {
      setVisible(false);
      seed(pointer.x, pointer.y);
      return;
    }

    frame = requestAnimationFrame(render);
  }

  window.addEventListener('pointermove', updatePointer, { passive: true });
  window.addEventListener('pointerenter', event => {
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    pointer.inside = true;
  }, { passive: true });
  window.addEventListener('pointerleave', () => {
    pointer.inside = false;
    lastMoveAt = performance.now() - 180;
    wake();
  }, { passive: true });
  window.addEventListener('blur', () => {
    pointer.inside = false;
    setVisible(false);
  });
  window.addEventListener('resize', resize, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      setVisible(false);
    } else if (pointer.seen) {
      seed(pointer.x, pointer.y);
    }
  });

  const bodyObserver = new MutationObserver(() => {
    const nextLocked = document.body.classList.contains('is-entry-locked');
    if (nextLocked === entryLocked) return;
    entryLocked = nextLocked;
    seed(pointer.x, pointer.y);
    setVisible(false);
    if (!entryLocked && pointer.seen && pointer.inside) wake();
  });
  bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  resize();
})();