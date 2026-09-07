(() => {
  'use strict';

  const entry = document.querySelector('[data-domenea-360]');
  const viewer = document.querySelector('[data-domenea360Viewer]');
  const stage = viewer?.querySelector('[data-360-stage]');
  const host = document.getElementById('domenea-360-panorama');
  if (!entry || !viewer || !stage || !host || host.dataset.native360 === 'true') return;

  host.dataset.native360 = 'true';

  const loading = viewer.querySelector('[data-360-loading]');
  const error = viewer.querySelector('[data-360-error]');
  const closeButton = viewer.querySelector('[data-360-close]');
  const resetButton = viewer.querySelector('[data-360-reset]');
  const zoomInButton = viewer.querySelector('[data-360-zoom-in]');
  const zoomOutButton = viewer.querySelector('[data-360-zoom-out]');
  const baseUrl = new URL('.', document.currentScript?.src || window.location.href);
  const panoramaUrl = new URL('assets/tao-passot-360.jpg', baseUrl).href;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const rad = d => d * Math.PI / 180;
  const deg = r => r * 180 / Math.PI;

  const style = document.createElement('style');
  style.dataset.native360 = '';
  style.textContent = `
    #domenea-360-panorama { position:absolute; inset:0; overflow:hidden; }
    .native-360-canvas,.native-360-fallback { position:absolute; inset:0; width:100%; height:100%; }
    .native-360-canvas { display:block; background:#0c120d; }
    .native-360-fallback { display:none; background-repeat:repeat-x; background-size:auto 112%; background-position:50% 50%; }
    #domenea-360-panorama.is-fallback .native-360-canvas { display:none; }
    #domenea-360-panorama.is-fallback .native-360-fallback { display:block; }
    .native-360-hotspots { position:absolute; inset:0; z-index:2; pointer-events:none; }
    .native-360-hotspot { position:absolute; width:1rem; height:1rem; margin:-.5rem 0 0 -.5rem; padding:0; border:1px solid #f4f4ef; border-radius:50%; background:rgba(244,244,239,.22); box-shadow:0 0 0 .55rem rgba(244,244,239,.08); opacity:0; pointer-events:auto; cursor:pointer; transform:scale(.88); transition:opacity .2s ease,transform .2s ease; }
    .native-360-hotspot.is-visible { opacity:1; transform:scale(1); }
    .native-360-hotspot span { position:absolute; left:50%; bottom:calc(100% + 1rem); width:max-content; max-width:min(17rem,70vw); padding:.72rem .82rem; color:#172119; background:#e9e8df; font-size:.7rem; line-height:1.45; text-align:left; opacity:0; visibility:hidden; transform:translate(-50%,.3rem); transition:opacity .18s ease,transform .18s ease,visibility .18s step-end; pointer-events:none; }
    .native-360-hotspot:hover span,.native-360-hotspot:focus-visible span,.native-360-hotspot.is-active span { opacity:1; visibility:visible; transform:translate(-50%,0); transition:opacity .18s ease,transform .18s ease,visibility 0s step-start; }
    .native-360-hotspot:focus-visible { outline:2px solid #f4f4ef; outline-offset:5px; }
    .domenea-360-stage { touch-action:none; cursor:grab; }
    .domenea-360-stage.is-dragging { cursor:grabbing; }
  `;
  document.head.appendChild(style);

  host.innerHTML = '<canvas class="native-360-canvas" aria-hidden="true"></canvas><div class="native-360-fallback" aria-hidden="true"></div><div class="native-360-hotspots"></div>';
  const canvas = host.querySelector('.native-360-canvas');
  const fallback = host.querySelector('.native-360-fallback');
  const hotspotLayer = host.querySelector('.native-360-hotspots');

  const initial = { yaw: rad(17), pitch: rad(-7), fov: 104 };
  const view = { ...initial };
  let renderer = null;
  let initPromise = null;
  let image = null;
  let raf = 0;
  let dragging = false;
  let pointerId = null;
  let lastX = 0;
  let lastY = 0;
  let previousFocus = null;

  const spots = [
    { yaw: 6, pitch: -10, fr: 'Piscine à débordement — le cœur de la vie extérieure.', en: 'Infinity pool — the heart of outdoor living.' },
    { yaw: -52, pitch: -3, fr: 'Séjour ouvert — l’intérieur se prolonge naturellement vers la terrasse.', en: 'Open living room — the interior flows naturally onto the terrace.' },
    { yaw: 50, pitch: -4, fr: 'L’horizon — une vue pensée pour accompagner les fins de journée.', en: 'The horizon — a view designed to frame the end of the day.' }
  ];

  const spotNodes = spots.map((spot, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'native-360-hotspot';
    button.dataset.spot = String(index);
    const label = document.documentElement.lang === 'en' ? spot.en : spot.fr;
    button.setAttribute('aria-label', label);
    button.innerHTML = `<span>${label}</span>`;
    button.addEventListener('click', e => {
      e.stopPropagation();
      const active = !button.classList.contains('is-active');
      spotNodes.forEach(node => node.classList.remove('is-active'));
      button.classList.toggle('is-active', active);
    });
    hotspotLayer.appendChild(button);
    return button;
  });

  const vertex = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
  const fragment = `precision highp float;varying vec2 v;uniform sampler2D t;uniform float y,p,f,ar;const float PI=3.141592653589793;void main(){vec2 q=v*2.-1.;q.y=-q.y;float g=tan(f*.5);vec3 d=normalize(vec3(q.x*ar*g,q.y*g,-1.));float cp=cos(p),sp=sin(p);d=vec3(d.x,d.y*cp-d.z*sp,d.y*sp+d.z*cp);float cy=cos(y),sy=sin(y);d=vec3(d.x*cy-d.z*sy,d.y,d.x*sy+d.z*cy);float lo=atan(d.x,-d.z),la=asin(clamp(d.y,-1.,1.));gl_FragColor=texture2D(t,vec2(fract(lo/(2.*PI)+.5),.5-la/PI));}`;

  const compile = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'Shader error');
    return shader;
  };

  const makeWebGL = img => {
    const gl = canvas.getContext('webgl', { alpha:false, antialias:false, depth:false, stencil:false, preserveDrawingBuffer:false }) || canvas.getContext('experimental-webgl');
    if (!gl) throw new Error('WebGL unavailable');
    const vs = compile(gl, gl.VERTEX_SHADER, vertex);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'WebGL link error');
    gl.deleteShader(vs); gl.deleteShader(fs);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.useProgram(program);
    const loc = { a:gl.getAttribLocation(program,'a'), t:gl.getUniformLocation(program,'t'), y:gl.getUniformLocation(program,'y'), p:gl.getUniformLocation(program,'p'), f:gl.getUniformLocation(program,'f'), ar:gl.getUniformLocation(program,'ar') };
    gl.enableVertexAttribArray(loc.a); gl.vertexAttribPointer(loc.a,2,gl.FLOAT,false,0,0); gl.uniform1i(loc.t,0);
    host.classList.remove('is-fallback');
    return { mode:'webgl', gl, program, loc };
  };

  const makeFallback = () => {
    host.classList.add('is-fallback');
    fallback.style.backgroundImage = `url("${panoramaUrl}")`;
    return { mode:'fallback' };
  };

  const loadImage = () => new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => img.naturalWidth ? resolve(img) : reject(new Error('Empty panorama'));
    img.onerror = () => reject(new Error('Panorama image unavailable'));
    img.src = panoramaUrl;
  });

  const projectSpots = () => {
    if (renderer?.mode !== 'webgl') return;
    const w = stage.clientWidth, h = stage.clientHeight;
    const aspect = w / Math.max(1,h), tan = Math.tan(rad(view.fov)*.5);
    const cy=Math.cos(view.yaw), sy=Math.sin(view.yaw), cp=Math.cos(view.pitch), sp=Math.sin(view.pitch);
    spots.forEach((spot,i) => {
      const Y=rad(spot.yaw), P=rad(spot.pitch), cP=Math.cos(P);
      const wx=cP*Math.sin(Y), wy=Math.sin(P), wz=-cP*Math.cos(Y);
      const x1=cy*wx+sy*wz, z1=-sy*wx+cy*wz;
      const x=x1, y=cp*wy+sp*z1, z=-sp*wy+cp*z1, depth=-z;
      const node=spotNodes[i];
      if(depth<=.02){node.classList.remove('is-visible','is-active');return;}
      const nx=(x/depth)/(tan*aspect), ny=(y/depth)/tan;
      const visible=Math.abs(nx)<=1.06&&Math.abs(ny)<=1.06;
      node.classList.toggle('is-visible',visible);
      if(!visible){node.classList.remove('is-active');return;}
      node.style.left=`${(nx*.5+.5)*w}px`; node.style.top=`${(.5-ny*.5)*h}px`;
    });
  };

  const resize = () => {
    if (renderer?.mode !== 'webgl') return;
    const dpr=Math.min(window.devicePixelRatio||1,2), rect=stage.getBoundingClientRect();
    const w=Math.max(1,Math.round(rect.width*dpr)), h=Math.max(1,Math.round(rect.height*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    renderer.gl.viewport(0,0,w,h);
  };

  const draw = () => {
    raf=0;
    if(!renderer)return;
    if(renderer.mode==='fallback'){
      const turns=view.yaw/(Math.PI*2), zoom=clamp(112*(initial.fov/view.fov),100,205), py=50+(deg(view.pitch)/82)*18;
      fallback.style.backgroundSize=`auto ${zoom}%`; fallback.style.backgroundPosition=`${50-turns*100}% ${py}%`; return;
    }
    resize();
    const {gl,program,loc}=renderer, w=Math.max(1,stage.clientWidth), h=Math.max(1,stage.clientHeight);
    gl.useProgram(program); gl.uniform1f(loc.y,view.yaw); gl.uniform1f(loc.p,view.pitch); gl.uniform1f(loc.f,rad(view.fov)); gl.uniform1f(loc.ar,w/h); gl.drawArrays(gl.TRIANGLES,0,6); projectSpots();
  };
  const redraw = () => { if(!raf) raf=requestAnimationFrame(draw); };

  const init = () => {
    if(renderer){loading.hidden=true;error.hidden=true;redraw();return Promise.resolve();}
    if(initPromise)return initPromise;
    loading.hidden=false; error.hidden=true;
    initPromise=loadImage().then(img=>{image=img;try{renderer=makeWebGL(img);}catch(e){console.warn('[DOMENEA 360] WebGL fallback',e);renderer=makeFallback();}loading.hidden=true;error.hidden=true;redraw();}).catch(e=>{initPromise=null;loading.hidden=true;error.hidden=false;console.error('[DOMENEA 360]',e);});
    return initPromise;
  };

  const stop = e => { e.preventDefault(); e.stopImmediatePropagation(); };
  const open = e => { stop(e); previousFocus=document.activeElement; viewer.classList.add('is-open'); viewer.setAttribute('aria-hidden','false'); document.body.classList.add('is-360-open'); closeButton?.focus({preventScroll:true}); requestAnimationFrame(()=>{init();redraw();}); };
  const close = e => { if(e)stop(e); viewer.classList.remove('is-open'); viewer.setAttribute('aria-hidden','true'); document.body.classList.remove('is-360-open'); dragging=false;pointerId=null;stage.classList.remove('is-dragging','has-interacted'); previousFocus?.focus?.({preventScroll:true}); };
  const reset = e => { if(e)stop(e); Object.assign(view,initial);stage.classList.remove('has-interacted');redraw(); };
  const zoom = amount => { view.fov=clamp(view.fov+amount,55,120);stage.classList.add('has-interacted');redraw(); };

  entry.addEventListener('click',open,true);
  closeButton?.addEventListener('click',close,true);
  resetButton?.addEventListener('click',e=>{stop(e);reset();},true);
  zoomInButton?.addEventListener('click',e=>{stop(e);zoom(-10);},true);
  zoomOutButton?.addEventListener('click',e=>{stop(e);zoom(10);},true);

  stage.addEventListener('pointerdown',e=>{if(e.button!==undefined&&e.button!==0)return;dragging=true;pointerId=e.pointerId;lastX=e.clientX;lastY=e.clientY;stage.classList.add('is-dragging','has-interacted');stage.setPointerCapture?.(pointerId);});
  stage.addEventListener('pointermove',e=>{if(!dragging||e.pointerId!==pointerId)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;view.yaw-=dx*.0042;view.pitch=clamp(view.pitch+dy*.0034,rad(-82),rad(82));redraw();});
  const end=e=>{if(!dragging||(e.pointerId!==undefined&&e.pointerId!==pointerId))return;dragging=false;stage.classList.remove('is-dragging');try{stage.releasePointerCapture?.(pointerId);}catch(_){}pointerId=null;};
  stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
  stage.addEventListener('wheel',e=>{if(!viewer.classList.contains('is-open'))return;e.preventDefault();zoom(Math.sign(e.deltaY)*4.5);},{passive:false});
  window.addEventListener('resize',redraw,{passive:true});

  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();if(image){renderer=makeFallback();loading.hidden=true;error.hidden=true;redraw();}});
  document.addEventListener('keydown',e=>{if(!viewer.classList.contains('is-open'))return;if(e.key==='Escape'){close(e);}},true);
})();