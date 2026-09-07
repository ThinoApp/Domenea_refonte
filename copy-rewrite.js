(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const setCopy = (selector, fr, en) => {
    const node = $(selector);
    if (!node) return;
    node.dataset.fr = fr;
    node.dataset.en = en;
    node.textContent = fr;
  };

  const setDescription = (row, fr, en) => {
    if (!row) return;
    row.dataset.descriptionFr = fr;
    row.dataset.descriptionEn = en;
  };

  const prepare = () => {
    document.title = 'TAO Passot - Villas privées à Nosy Be | DOMENEA';
    $('meta[name="description"]')?.setAttribute('content', 'TAO Passot par DOMENEA : des villas privées de 2 à 4 chambres à Mont Passot, Nosy Be, entre nature, piscine et horizon.');
    $('meta[property="og:description"]')?.setAttribute('content', 'Vivre à TAO Passot, entre Mont Passot et l’océan Indien.');

    setCopy('.entry-subtitle', 'VILLAS PRIVÉES À NOSY BE', 'PRIVATE VILLAS IN NOSY BE');
    setCopy('.entry-bottom span:nth-child(2)', '2 À 4 CHAMBRES', '2 TO 4 BEDROOMS');
    setCopy('.entry-skip', 'Passer', 'Skip');

    setCopy('.desktop-nav a[href="#location"]', 'Nosy Be', 'Nosy Be');
    setCopy('.menu-nav a[href="#location"] span', 'Nosy Be', 'Nosy Be');
    setCopy('.menu-nav a[href="#investment"] span', 'Investir', 'Invest');

    setCopy('.hero-copy > p',
      'À Mont Passot, des villas privées ouvertes sur la nature, pensées pour vivre entre lumière, piscine et horizon.',
      'At Mont Passot, private villas open to nature, designed for life between light, pool and horizon.'
    );
    setCopy('.hero-actions .text-link:first-child', 'Recevoir la brochure', 'Request the brochure');
    setCopy('.hero-actions .text-link-muted', 'Planifier une visite privée', 'Plan a private visit');

    setCopy('#lieu .stack-copy h2 span', 'Ici, tout commence par le paysage.', 'Here, everything begins with the landscape.');
    setCopy('#lieu .stack-copy p',
      'À quelques minutes de la plage et des lacs, TAO Passot offre le calme de Mont Passot avec l’océan Indien à l’horizon.',
      'Just minutes from the beach and lakes, TAO Passot brings the calm of Mont Passot with the Indian Ocean on the horizon.'
    );

    setCopy('#architecture .stack-copy h2 span', 'Dedans, dehors, sans rupture.', 'Inside and out, as one.');
    setCopy('#architecture .stack-copy p',
      'Les pièces de vie s’ouvrent sur les terrasses, la piscine et la nature pour profiter pleinement de la lumière et du climat de Nosy Be.',
      'Living spaces open onto terraces, the pool and nature, making the most of Nosy Be’s light and climate.'
    );
    setCopy('#architecture .scene-meta-left span:first-child', 'Ouvert sur l’extérieur', 'Open to the outdoors');

    setCopy('#residence-intro .stack-copy h2 span', 'Votre villa, au calme.', 'Your villa, in peace and quiet.');
    setCopy('#residence-intro .stack-copy p',
      'Dans une résidence privée de 20 000 m², chaque villa préserve son intimité tout en restant ouverte sur les espaces verts et la vue.',
      'Within a 20,000 m² private residence, each villa preserves its privacy while opening onto green space and the view.'
    );
    setCopy('#residence-intro .scene-link', 'Découvrir les villas', 'Discover the villas');

    const identitySlides = $$('.identity-slide');
    if (identitySlides[0]) {
      setCopy('.identity-slide:nth-child(1) .eyebrow', 'Vivre avec le paysage', 'Living with the landscape');
      setCopy('.identity-slide:nth-child(1) h2', 'La nature reste au premier plan.', 'Nature stays at the forefront.');
      setCopy('.identity-slide:nth-child(1) > p:last-child',
        'Chaque villa est pensée pour profiter de la lumière, de la végétation et des vues, sans perdre la sensation d’intimité.',
        'Each villa is designed to make the most of light, vegetation and views without giving up a sense of privacy.'
      );
    }
    if (identitySlides[1]) {
      setCopy('.identity-slide:nth-child(2) .eyebrow', 'Le confort au quotidien', 'Everyday comfort');
      setCopy('.identity-slide:nth-child(2) h2', 'Une maison ouverte sur l’extérieur.', 'A home open to the outdoors.');
      setCopy('.identity-slide:nth-child(2) > p:last-child',
        'Terrasses, ombre et ventilation naturelle prolongent les espaces de vie et rendent l’extérieur présent toute la journée.',
        'Terraces, shade and natural ventilation extend the living spaces and keep the outdoors part of everyday life.'
      );
    }
    if (identitySlides[2]) {
      setCopy('.identity-slide:nth-child(3) .eyebrow', 'Pensée pour durer', 'Made to last');
      setCopy('.identity-slide:nth-child(3) h2', 'Un lieu fait pour durer.', 'A place made to last.');
      setCopy('.identity-slide:nth-child(3) > p:last-child',
        'Des matériaux choisis avec soin et une architecture sobre pour préserver le confort et la qualité du lieu au fil des années.',
        'Carefully chosen materials and restrained architecture help preserve the comfort and quality of the place over time.'
      );
    }

    setCopy('.chapter-kicker', 'Les projets TAO', 'TAO projects');
    setCopy('.chapter-title', 'TAO grandit à Nosy Be.', 'TAO is growing in Nosy Be.');
    setCopy('.chapter-copy',
      'TAO Passot est aujourd’hui disponible. TAO Lake 1 et TAO Lake 2 viendront prolonger la collection dans le même esprit.',
      'TAO Passot is available today. TAO Lake 1 and TAO Lake 2 will extend the collection in the same spirit.'
    );
    setCopy('.chapter-programs > div:nth-child(2) span', 'En préparation', 'In preparation');
    setCopy('.chapter-programs > div:nth-child(3) span', 'En préparation', 'In preparation');

    setCopy('.location-image-copy', 'ENTRE MONT PASSOT ET L’OCÉAN', 'BETWEEN MONT PASSOT AND THE OCEAN');
    setCopy('.location-title > span', 'Tout est à portée.', 'Everything within reach.');
    setCopy('.location-detail > small', 'AUTOUR DE VOUS', 'AROUND YOU');
    setCopy('.location-detail > p:last-child',
      'Plages, lacs, commerces et aéroport restent accessibles, tandis que TAO Passot conserve le calme de Mont Passot.',
      'Beaches, lakes, shops and the airport remain within reach while TAO Passot keeps the calm of Mont Passot.'
    );

    setCopy('.residences-intro .eyebrow', '2, 3 ou 4 chambres', '2, 3 or 4 bedrooms');
    setCopy('.residences-lead',
      'Intimité, Harmonie ou Prestige : trois villas pour des façons de vivre différentes, avec toujours la terrasse, la piscine et le paysage au centre.',
      'Intimacy, Harmony or Prestige: three villas for different ways of living, always centred on the terrace, pool and landscape.'
    );
    $('.types-rail')?.setAttribute('aria-label', 'Choisir une villa TAO Passot');

    const typeRows = $$('.type-row');
    setDescription(typeRows[0],
      'Deux chambres et une relation directe avec la terrasse, la piscine et le paysage : l’essentiel pour profiter pleinement de Nosy Be.',
      'Two bedrooms with a direct connection to the terrace, pool and landscape: everything you need to fully enjoy Nosy Be.'
    );
    setDescription(typeRows[1],
      'Trois chambres et plus d’espace pour recevoir famille et amis, tout en préservant l’intimité de chacun.',
      'Three bedrooms and more room for family and friends, while preserving everyone’s privacy.'
    );
    setDescription(typeRows[2],
      'Quatre chambres et des volumes plus généreux pour se retrouver, recevoir et profiter du panorama au coucher du soleil.',
      'Four bedrooms and more generous spaces for gathering, hosting and enjoying the panorama at sunset.'
    );
    setCopy('.types-preview-copy small', 'VILLA SÉLECTIONNÉE', 'SELECTED VILLA');
    const initialDescription = $('[data-type-description]');
    if (initialDescription && typeRows[0]) initialDescription.textContent = typeRows[0].dataset.descriptionFr;

    setCopy('.investment-copy > small', 'Votre investissement', 'Your investment');
    setCopy('.investment-copy h2', 'Un lieu à vivre aujourd’hui, à transmettre demain.', 'A place to live today, and pass on tomorrow.');
    setCopy('.investment-copy > p',
      'TAO Passot réunit qualité de construction, architecture et cadre naturel dans une propriété pensée pour conserver sa qualité au fil des années.',
      'TAO Passot brings together build quality, architecture and a natural setting in a property designed to retain its quality over time.'
    );
    setCopy('.investment-stats > div:nth-child(2) span', 'vue sur l’océan', 'ocean view');
    setCopy('.investment-stats > div:nth-child(3) span', 'piscine à débordement', 'infinity pool');

    setCopy('.roots-small', 'VIVRE À TAO PASSOT', 'LIFE AT TAO PASSOT');
    setCopy('.roots h2 span:first-child', 'Vivre', 'Live');
    setCopy('.roots h2 span:last-child', 'dehors.', 'outdoors.');
    $('.roots h2')?.setAttribute('aria-label', 'Vivre dehors');
    setCopy('.roots p',
      'Commencer la journée dehors, se retrouver autour de la piscine, regarder le soleil descendre sur l’océan : ici, la nature fait partie du quotidien.',
      'Start the day outside, gather around the pool, watch the sun set over the ocean: here, nature is part of everyday life.'
    );

    setCopy('.amenities-head h2', 'Art de vivre', 'Lifestyle');
    setCopy('.amenities-head > span', 'MOMENTS', 'MOMENTS');
    setCopy('.amenity-panel-intro p',
      'Ici, les journées se vivent au rythme de l’eau, de la nature et de la lumière.',
      'Here, days unfold to the rhythm of water, nature and light.'
    );
    setCopy('.amenity-panel:nth-child(2) h3', 'Piscine à débordement', 'Infinity pool');
    setCopy('.amenity-panel:nth-child(3) p', 'À quelques minutes', 'Just minutes away');
    setCopy('.amenity-panel:nth-child(4) p', 'Chaque soir, face à l’horizon', 'Every evening, facing the horizon');
    setCopy('.amenity-panel:nth-child(5) p', 'Vue jusqu’à 180°', 'Views up to 180°');

    setCopy('.above > .above-pin > small', 'Mont Passot / Nosy Be', 'Mont Passot / Nosy Be');
    setCopy('.above h2', 'Le calme, sans s’isoler.', 'Peace and quiet, without feeling remote.');
    setCopy('.above-caption',
      'TAO Passot se trouve à Mont Passot, entre les lacs et la côte, à proximité des plages, des commerces et de l’aéroport.',
      'TAO Passot sits at Mont Passot, between the lakes and the coast, close to beaches, shops and the airport.'
    );

    setCopy('.acquisition-head > small', 'Votre projet', 'Your project');
    setCopy('.acquisition-head h2', 'Parlons de la villa qui vous correspond.', 'Let’s find the villa that fits your plans.');
    setCopy('.acquisition-head > p',
      'Selon votre budget et vos envies, découvrez les options disponibles et échangez avec notre équipe sur la suite de votre projet.',
      'Based on your budget and plans, explore the available options and speak with our team about the next step.'
    );
    setCopy('.acquisition-steps li:nth-child(1) span', 'Offre de lancement', 'Launch offer');
    setCopy('.acquisition-steps li:nth-child(2) span', 'Accompagnement investisseur', 'Investor support');
    setCopy('.acquisition-steps li:nth-child(3) span', 'Projet sur mesure', 'Tailored project');

    setCopy('.footer-head h2', 'Votre projet commence ici.', 'Your project starts here.');
    setCopy('.footer-head > p',
      'Recevez la brochure, découvrez les villas disponibles et échangez avec notre équipe sur votre projet à Nosy Be.',
      'Receive the brochure, discover the available villas and speak with our team about your project in Nosy Be.'
    );
    setCopy('.footer-form label:nth-child(4) > span', 'Projet', 'Project');
    setCopy('.footer-form button span', 'Demander la brochure', 'Request the brochure');

    const formStatus = $('[data-form-status]');
    if (formStatus && !formStatus.dataset.copyObserver) {
      formStatus.dataset.copyObserver = 'true';
      const observer = new MutationObserver(() => {
        if (!formStatus.textContent.trim()) return;
        const desired = document.documentElement.lang === 'en'
          ? 'Your email app will open so you can send the request.'
          : 'Votre messagerie va s’ouvrir pour finaliser la demande.';
        if (formStatus.textContent !== desired) formStatus.textContent = desired;
      });
      observer.observe(formStatus, { childList: true, characterData: true, subtree: true });
    }
  };

  const decoratePerspective = () => {
    const meta = $('.above-spatial-meta');
    if (!meta) return;
    const spans = $$('span', meta);
    if (spans[0]) {
      spans[0].dataset.fr = 'Madagascar';
      spans[0].dataset.en = 'Madagascar';
      spans[0].textContent = 'Madagascar';
    }
    if (spans[1]) {
      spans[1].dataset.fr = 'Océan Indien';
      spans[1].dataset.en = 'Indian Ocean';
      spans[1].textContent = document.documentElement.lang === 'en' ? 'Indian Ocean' : 'Océan Indien';
    }
  };

  window.DOMENEA_COPY = { prepare, decoratePerspective };
  prepare();
})();