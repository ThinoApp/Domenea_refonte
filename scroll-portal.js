(() => {
  'use strict';

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const residences = document.querySelector('#residences');
  if (!residences || !gsap || !ScrollTrigger || document.querySelector('[data-scroll-portal]')) return;

  gsap.registerPlugin(ScrollTrigger);

  const scenes = [
    { number:'01', labelFr:'Mont Passot', labelEn:'Mont Passot', titleFr:'Le paysage.', titleEn:'The landscape.', image:'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%2012.jpg', alt:'Paysage tropical de Mont Passot à Nosy Be' },
    { number:'02', labelFr:'Villa', labelEn:'Villa', titleFr:'La villa.', titleEn:'The villa.', image:'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%208-2.jpg', alt:'Villa contemporaine TAO Passot ouverte sur le paysage' },
    { number:'03', labelFr:'Piscine', labelEn:'Pool', titleFr:'La piscine.', titleEn:'The pool.', image:'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%2013.jpg', alt:'Piscine à débordement de TAO Passot' },
    { number:'04', labelFr:'Séjour', labelEn:'Living room', titleFr:'Le séjour.', titleEn:'The living room.', image:'https://raw.githubusercontent.com/ThinoApp/Domenea/main/public/assets/Photo%208-3.jpeg', alt:'Séjour de TAO Passot ouvert sur la terrasse et la nature' }
  ];

  const style = document.createElement('style');
  style.dataset.scrollPortalStyles = '';
  style.textContent = `
    .scroll-portal{position:relative;height:440vh;background:#101711;color:#f4f4ef;isolation:isolate}
    .scroll-portal-stage{position:sticky;top:0;height:100dvh;overflow:hidden;background:#101711}
    .scroll-portal-scene{position:absolute;inset:0;overflow:hidden;visibility:hidden;will-change:clip-path;transform:translateZ(0)}
    .scroll-portal-scene:first-child{visibility:visible;clip-path:inset(0)}
    .scroll-portal-scene img{position:absolute;inset:-3%;width:106%;height:106%;object-fit:cover;transform:scale(1.08);will-change:transform,filter}
    .scroll-portal-scene:first-child img{transform:scale(1)}
    .scroll-portal-shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,12,8,.05),rgba(6,12,8,.08) 56%,rgba(6,12,8,.52));pointer-events:none}
    .scroll-portal-meta{position:absolute;z-index:24;left:var(--pad);right:var(--pad);bottom:clamp(1.6rem,4vw,3.5rem);display:flex;align-items:end;justify-content:space-between;gap:2rem;pointer-events:none}
    .scroll-portal-meta-copy{display:grid;gap:.35rem}
    .scroll-portal-meta small{font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(244,244,239,.66)}
    .scroll-portal-meta strong{font-size:clamp(2.1rem,5vw,6rem);font-weight:500;line-height:.9;letter-spacing:-.055em}
    .scroll-portal-count{font-size:.58rem;letter-spacing:.16em;color:rgba(244,244,239,.62)}
    .scroll-portal-guide{position:absolute;z-index:26;top:clamp(5.4rem,9vh,7rem);left:var(--pad);display:flex;align-items:center;gap:.75rem;font-size:.56rem;letter-spacing:.17em;text-transform:uppercase;color:rgba(244,244,239,.62);pointer-events:none}
    .scroll-portal-guide::before{content:'';width:2.8rem;height:1px;background:rgba(244,244,239,.45)}
    .scroll-portal-outline{position:absolute;z-index:20;pointer-events:none;border:1px solid rgba(244,244,239,.72);box-shadow:0 18px 70px rgba(4,9,6,.2);will-change:top,right,bottom,left,opacity}
    .scroll-portal-outline span{position:absolute;left:-1px;top:-1.7rem;font-size:.54rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(244,244,239,.76);white-space:nowrap}
    .scroll-portal-final{position:absolute;z-index:40;inset:0;display:grid;place-items:center;padding:var(--pad);background:rgba(7,13,9,.28);text-align:center;opacity:0;pointer-events:none}
    .scroll-portal-final-inner{display:grid;justify-items:center;gap:1.05rem;max-width:44rem}
    .scroll-portal-final-mark{width:clamp(7.5rem,14vw,12rem);aspect-ratio:1;border:1px solid rgba(244,244,239,.72);border-radius:50%;display:grid;place-items:center;font-size:clamp(1.8rem,4vw,3.4rem);font-weight:500;letter-spacing:-.04em}
    .scroll-portal-final small{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(244,244,239,.68)}
    .scroll-portal-final h2{margin:0;font-size:clamp(2.5rem,6vw,6.4rem);font-weight:500;line-height:.92;letter-spacing:-.055em}
    .scroll-portal-final p{margin:0;max-width:34ch;color:rgba(244,244,239,.72);font-size:clamp(.82rem,1.15vw,.98rem);line-height:1.55}
    .scroll-portal-cta{pointer-events:auto;margin-top:.25rem;padding:.86rem 1.2rem;border:1px solid rgba(244,244,239,.78);background:transparent;color:#f4f4ef;font:inherit;font-size:.64rem;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:background .25s ease,color .25s ease,transform .25s ease}
    .scroll-portal-cta:hover,.scroll-portal-cta:focus-visible{background:#f4f4ef;color:#101711;transform:translateY(-2px)}
    .scroll-portal-cta:focus-visible{outline:2px solid #f4f4ef;outline-offset:4px}
    @media(max-width:760px){.scroll-portal{height:360vh}.scroll-portal-meta{bottom:max(1.35rem,env(safe-area-inset-bottom));align-items:start}.scroll-portal-meta strong{font-size:clamp(2rem,10vw,3.6rem)}.scroll-portal-count{display:none}.scroll-portal-guide{top:calc(max(4.7rem,env(safe-area-inset-top)) + .6rem)}.scroll-portal-outline span{top:-1.5rem}.scroll-portal-final h2{font-size:clamp(2.8rem,13vw,4.8rem)}}
    @media(prefers-reduced-motion:reduce){.scroll-portal{height:auto;min-height:100dvh}.scroll-portal-stage{position:relative;min-height:100dvh}.scroll-portal-scene{display:none!important}.scroll-portal-scene:last-of-type{display:block!important;visibility:visible!important;clip-path:none!important}.scroll-portal-scene:last-of-type img{transform:none!important;filter:brightness(.68)!important}.scroll-portal-meta,.scroll-portal-guide,.scroll-portal-outline{display:none!important}.scroll-portal-final{opacity:1!important;pointer-events:auto!important}}
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.className = 'scroll-portal';
  section.dataset.scrollPortal = '';
  section.dataset.headerTheme = 'dark';
  section.setAttribute('aria-label', 'Mont Passot, villa, piscine, séjour et visite 360°');

  const sceneMarkup = scenes.map((scene,index)=>`<article class="scroll-portal-scene" data-portal-scene="${index}" style="z-index:${index+1}"><img src="${scene.image}" alt="${scene.alt}" loading="${index===0?'eager':'lazy'}" decoding="async"/><div class="scroll-portal-shade" aria-hidden="true"></div><div class="scroll-portal-meta" data-portal-meta="${index}"><div class="scroll-portal-meta-copy"><small data-fr="${scene.number} — ${scene.labelFr}" data-en="${scene.number} — ${scene.labelEn}">${scene.number} — ${scene.labelFr}</small><strong data-fr="${scene.titleFr}" data-en="${scene.titleEn}">${scene.titleFr}</strong></div><span class="scroll-portal-count">${scene.number} / 04</span></div></article>`).join('');
  const outlines = scenes.slice(1).map((scene,index)=>`<div class="scroll-portal-outline" data-portal-outline="${index+1}" style="z-index:${index+18}"><span data-fr="Vers ${scene.labelFr}" data-en="To ${scene.labelEn}">Vers ${scene.labelFr}</span></div>`).join('');

  section.innerHTML = `<div class="scroll-portal-stage">${sceneMarkup}${outlines}<div class="scroll-portal-guide" data-fr="Faire défiler pour avancer" data-en="Scroll to move forward">Faire défiler pour avancer</div><div class="scroll-portal-final" data-portal-final><div class="scroll-portal-final-inner"><small>05 — TAO Passot</small><div class="scroll-portal-final-mark">360°</div><h2 data-fr="Explorez librement." data-en="Explore freely.">Explorez librement.</h2><p data-fr="Vous avez traversé Mont Passot, la villa, la piscine et le séjour. Prenez maintenant le contrôle." data-en="You have passed through Mont Passot, the villa, the pool and the living room. Now take control.">Vous avez traversé Mont Passot, la villa, la piscine et le séjour. Prenez maintenant le contrôle.</p><button class="scroll-portal-cta" type="button" data-portal-360 data-fr="Ouvrir la visite 360°" data-en="Open the 360° tour">Ouvrir la visite 360°</button></div></div></div>`;

  residences.insertAdjacentElement('beforebegin', section);

  const isEnglish=()=>document.documentElement.lang==='en';
  const applyLanguage=()=>{const lang=isEnglish()?'en':'fr';section.querySelectorAll('[data-fr][data-en]').forEach(el=>{el.textContent=el.dataset[lang];});section.setAttribute('aria-label',isEnglish()?'Mont Passot, villa, pool, living room and 360° tour':'Mont Passot, villa, piscine, séjour et visite 360°');};
  applyLanguage();
  document.querySelector('[data-language]')?.addEventListener('click',()=>requestAnimationFrame(applyLanguage));
  section.querySelector('[data-portal-360]')?.addEventListener('click',()=>document.querySelector('[data-domenea360]')?.click());
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  const sceneEls=[...section.querySelectorAll('[data-portal-scene]')];
  const metaEls=[...section.querySelectorAll('[data-portal-meta]')];
  const outlineEls=[...section.querySelectorAll('[data-portal-outline]')];
  const final=section.querySelector('[data-portal-final]');
  const header=document.querySelector('[data-header]');
  const mobile=window.matchMedia('(max-width: 760px)').matches;
  const insetY=mobile?29:27;
  const insetX=mobile?15:30;

  gsap.set(metaEls,{autoAlpha:0,y:14});
  gsap.set(metaEls[0],{autoAlpha:1,y:0});
  gsap.set(final,{autoAlpha:0,y:16});
  sceneEls.slice(1).forEach(scene=>gsap.set(scene,{visibility:'visible',clipPath:`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round 1px)`}));
  outlineEls.forEach(outline=>gsap.set(outline,{top:`${insetY}%`,right:`${insetX}%`,bottom:`${insetY}%`,left:`${insetX}%`,autoAlpha:0}));

  const timeline=gsap.timeline({defaults:{ease:'none'}});
  sceneEls.slice(1).forEach((scene,offset)=>{
    const index=offset+1;
    const previous=sceneEls[index-1];
    const previousImage=previous.querySelector('img');
    const currentImage=scene.querySelector('img');
    const outline=outlineEls[index-1];
    const start=offset*1.15;
    timeline.set(outline,{autoAlpha:1},start).to(metaEls[index-1],{autoAlpha:0,y:-10,duration:.18},start+.08).to(previousImage,{scale:1.09,filter:'brightness(.76)',duration:1},start).fromTo(currentImage,{scale:1.12},{scale:1,duration:1},start).to(scene,{clipPath:'inset(0% 0% 0% 0% round 0px)',duration:1},start).to(outline,{top:'0%',right:'0%',bottom:'0%',left:'0%',duration:1},start).to(outline,{autoAlpha:0,duration:.12},start+.86).to(metaEls[index],{autoAlpha:1,y:0,duration:.24},start+.72);
  });
  const finalStart=(sceneEls.length-1)*1.15;
  timeline.to(metaEls[metaEls.length-1],{autoAlpha:0,y:-10,duration:.2},finalStart).to(sceneEls[sceneEls.length-1].querySelector('img'),{scale:1.06,filter:'brightness(.56)',duration:.75},finalStart).to(final,{autoAlpha:1,y:0,duration:.45},finalStart+.12).set(final,{pointerEvents:'auto'},finalStart+.45);

  const setHeaderDark=()=>{if(header)header.dataset.theme='dark';};
  const setHeaderLight=()=>{if(header)header.dataset.theme='light';};
  ScrollTrigger.create({trigger:section,start:'top top',end:'bottom bottom',animation:timeline,scrub:.8,invalidateOnRefresh:true,onEnter:setHeaderDark,onEnterBack:setHeaderDark,onLeave:setHeaderLight,onLeaveBack:setHeaderLight});
  window.addEventListener('load',()=>ScrollTrigger.refresh(),{once:true});
})();
