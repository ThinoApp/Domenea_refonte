---
name: DOMENEA Cinematic Prototype V2
description: Architectural real-estate storytelling through full-screen scenes and mineral editorial interludes.
colors:
  ink: "#171918"
  mineral-paper: "#deddd6"
  soft-paper: "#ecebe5"
  off-white: "#f4f4ef"
  muted: "#6b6c67"
typography:
  display:
    fontFamily: "Manrope, Avenir Next, Helvetica Neue, sans-serif"
    fontSize: "clamp(4.1rem, 9vw, 9.2rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.06em"
  headline:
    fontFamily: "Manrope, Avenir Next, Helvetica Neue, sans-serif"
    fontSize: "clamp(3.3rem, 7vw, 7.3rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.055em"
  body:
    fontFamily: "Manrope, Avenir Next, Helvetica Neue, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Manrope, Avenir Next, Helvetica Neue, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 500
    lineHeight: 1.45
rounded:
  square: "0px"
spacing:
  page: "clamp(1.15rem, 2.7vw, 3rem)"
components:
  text-action:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "0.55rem 0"
  text-action-on-media:
    textColor: "{colors.off-white}"
    rounded: "{rounded.square}"
    padding: "0.35rem 0"
---

# Design System: DOMENEA Cinematic Prototype V2

## Overview

**Creative North Star: "The Inhabited Landscape"**

DOMENEA is presented as an architectural experience before it behaves like a property catalogue. Full-screen media carries the emotional load, while typography behaves like signage inside the landscape rather than a conventional marketing headline.

The interface stays peripheral. It does not compete with the architecture. Mineral editorial interludes create pauses where project facts can be understood without turning the page into a grid of cards.

**Key Characteristics:**
- Full-bleed architectural and tropical media.
- Oversized centered scene typography.
- Peripheral navigation and factual microcopy.
- Mineral paper interludes between immersive scenes.
- Square geometry and hairline separators.

## Colors

The palette alternates photographic darkness with warm mineral surfaces, without decorative accent colors.

### Primary
- **Ink:** the dark environmental surface and text color on mineral sections.

### Neutral
- **Mineral Paper:** main editorial surface between media scenes.
- **Soft Paper:** secondary quiet surface token reserved for future editorial use.
- **Off White:** text and controls over photography.
- **Muted:** secondary text on mineral surfaces.

**The Image Owns Color Rule.** Saturated color comes from photography and film, not from UI chrome.

## Typography

**Display Font:** Manrope with Avenir Next and Helvetica Neue fallbacks.
**Body Font:** Manrope with the same fallback stack.

**Character:** neutral, wide enough to feel architectural, but quiet enough to let image scale create the personality.

### Hierarchy
- **Display:** regular weight, extreme spatial scale, tightly tracked, used only on full-screen scenes.
- **Headline:** regular weight with a slightly calmer scale for editorial statements.
- **Body:** restrained neutral prose, generally kept below 46 characters per line in the prototype's large text blocks.
- **Label:** small peripheral navigation, facts and calls to action.

**The Spatial Type Rule.** Display type belongs to a scene, not inside a container.

## Layout

The page alternates 100dvh media scenes with long editorial pauses. Scene titles are centered while controls and project facts remain at the edges. Editorial sections use asymmetric two-column composition on desktop and collapse to a strict single column below 900px. Mobile preserves full-screen imagery but reduces secondary metadata and removes the scene rail.

## Elevation & Depth

The system uses no box shadows. Depth comes from photographic perspective, scale changes, foreground scrims and the transition between full-bleed media and flat mineral surfaces.

**The No Floating UI Rule.** Navigation may overlay media, but it does not become a card, glass panel or elevated surface.

## Shapes

All structural geometry is square. Buttons are text actions with a single hairline underline. Images are uncropped by decorative masks and receive no rounded corners.

## Components

### Navigation
- Fixed 72px desktop header and 64px mobile header.
- Brand sits left; language and menu action sit right.
- Header text switches between off-white and ink based on the underlying section.
- Full-screen menu uses the mineral paper surface and oversized link typography.

### Text Actions
- No filled button container.
- One-pixel underline supplies affordance.
- Focus uses a visible two-pixel outline with five-pixel offset.

### Scene Rail
- Desktop-only semantic scene navigation.
- Hairline segments expand to indicate the currently dominant scene.

### Full-Screen Scene
- Media fills the viewport and is visible by default.
- Title rises into position once the scene becomes dominant.
- Camera drift is limited to scale and a small vertical transform.
- Reduced-motion mode removes transforms and scroll snapping.

## Do's and Don'ts

### Do:
- **Do** let one decisive image carry each immersive scene.
- **Do** keep navigation and factual labels peripheral.
- **Do** use long quiet editorial sections to reset the eye between scenes.
- **Do** treat motion as camera language rather than decoration.

### Don't:
- **Don't** reintroduce property cards, glass panels or rounded content containers into this prototype language.
- **Don't** use decorative gradients, glowing accents or gradient text.
- **Don't** copy imagery, copywriting or brand assets from reference websites.
