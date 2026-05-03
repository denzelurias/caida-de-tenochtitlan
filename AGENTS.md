# AGENTS.md

## Project

Static editorial web experience about Mexico-Tenochtitlan and the fall of 1521. The page should feel like a digital museum article inspired by Google Arts & Culture: restrained, historical, elegant, readable, and interactive.

## Structure

- `index.html`: semantic page structure and content only.
- `assets/css/styles.css`: visual system, responsive layout, placeholders, animations.
- `assets/js/main.js`: menu, scroll effects, timeline, map pins, gallery modal.
- `assets/img/`: future image assets and map backgrounds.
- `stitch_tenochtitlan_cr_nica_visual/`: original visual reference prototypes. Do not edit unless explicitly asked.
- `Investigación Tenochtitlan.docx`: source research document. Treat it as the historical content source.

## Working Rules

- Keep HTML, CSS, and JS separated.
- Preserve the Spanish narrative voice unless the user asks for another tone.
- Use real historical names carefully: Tenochtitlan, Tlatelolco, Iztapalapa, Tlacopan/Tacuba, Texcoco, Chapultepec.
- Do not replace placeholders with external images unless the user provides or approves the source.
- Use the `DESIGN.md` palette as the color source of truth: near-white archive surfaces, deep burgundy, parchment, stone, and earth tones.
- Avoid adding duplicated navigation. The top bar opens the single index drawer.
- Verify that all `href="#..."` anchors point to existing IDs after edits.

## Map Background

The interactive map currently uses a CSS-generated placeholder. To use a real map:

1. Add the file to `assets/img/`, for example `assets/img/mapa-valle-1519.jpg`.
2. In `assets/css/styles.css`, set these variables on `.map-stage`:

```css
.map-stage {
  --map-image: url("../img/mapa-valle-1519.jpg");
  --map-image-opacity: 0.9;
}
```

After replacing the map image, adjust each `.map-pin` inline `left` and `top` value in `index.html` so the pins align with the new background.
