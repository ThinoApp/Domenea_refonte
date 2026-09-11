# DOMENEA cinematic prototype V2

Prototype HTML/CSS/JS qui fusionne deux références de direction artistique :

- la mise en scène architecturale cinématographique du pin Pinterest partagé ;
- le langage de portfolio spatial plein écran observé sur dsgninterior.se.

## Intention

- faire de l'image l'interface principale ;
- utiliser des scènes plein écran plutôt que des cartes ;
- donner au titrage une échelle architecturale ;
- conserver des respirations éditoriales pour expliquer TAO Passot ;
- limiter les contrôles visibles aux actions utiles.

## Ouvrir

Servir le dossier en HTTP avec la commande ci-dessous : les modules 3D nécessitent un serveur local. Une connexion internet est nécessaire pour les images temporaires, la police et la vidéo actuellement chargée depuis le site de développement DOMENEA.

Pour tester également la visite 360° dans les mêmes conditions que GitHub Pages :

```sh
unzip -q -o pano2vr-output.zip -d pano2vr
python3 scripts/patch_pano2vr_autorotate.py pano2vr
python3 -m http.server 4173 --bind 127.0.0.1
```

Ouvrir `http://127.0.0.1:4173/#immersion`. Le dossier `pano2vr/` est généré et ignoré par Git ; le déploiement le reconstruit depuis l’archive.

## Traversée immersive

`scroll-portal.js` et `scroll-portal.css` composent quatre scènes : horizon, architecture, piscine, séjour, puis l’entrée dans la visite 360°. Une scène et son successeur sont les seuls plans affichés pendant un passage. Le cadre agrandit la composition complète ; le paysage précédent avance légèrement pour renforcer la profondeur.

La molette et le geste tactile restent libres, les étapes permettent un accès direct, et « Aller aux villas » permet de sortir de la séquence. Le lien « Explorer le lieu » sur l’accueil mène à la traversée. La préférence de réduction des animations remplace le travelling par une galerie verticale. Le même repli s’applique si GSAP est indisponible.

Les images de cette section sont des WebP locaux (environ 1,6 Mo au total). Leur provenance et leur statut de références temporaires figurent dans `assets/immersion/README.md`.

## Fil conducteur 3D

`architectural-thread.js` place une sculpture minérale sur le parcours existant, sans ajouter de section ni modifier la durée des animations. Ses positions et rotations se règlent dans `route`. `architectural-forms.mjs` définit neuf silhouettes partageant la même géométrie : arche, collection d’arches, repère, portail, maison, anneau, feuille, vague et clé. Le maillage se transforme progressivement à l’approche de chaque étape, dans les deux sens du scroll.

Three.js est embarqué localement dans `assets/vendor/three/` avec sa licence. Un seul canvas de taille limitée est utilisé ; le rendu s’arrête une fois le mouvement stabilisé. La sculpture n’intercepte pas les clics, s’atténue au passage des textes et disparaît pendant le menu ou la visite 360°. Sur mobile elle reste plus petite ; avec la préférence de réduction des animations elle conserve une petite arche fixe. Si WebGL est indisponible, le site reste navigable sans sculpture.

## Remplacement futur

Les visuels externes sont uniquement des références temporaires. La prochaine version doit les remplacer par les rendus, photos et vidéos officiels TAO Passot / DOMENEA.
