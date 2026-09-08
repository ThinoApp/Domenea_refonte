(() => {
  'use strict';

  const style = document.createElement('style');
  style.dataset.domenea360RenderHotfix = '';
  style.textContent = `
    .domenea-360-pane {
      background-image: url('assets/tao-passot-360.jpg') !important;
      background-size: 100% 100% !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-color: #0c120d !important;
    }

    .domenea-360-pane > img {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      min-width: 100% !important;
      min-height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: fill !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
})();