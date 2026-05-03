---
name: Tenochtitlan Historical Narrative
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#58413e'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8b716d'
  outline-variant: '#dfbfba'
  surface-tint: '#a83729'
  primary: '#390000'
  on-primary: '#ffffff'
  primary-container: '#600000'
  on-primary-container: '#ee6a57'
  inverse-primary: '#ffb4a8'
  secondary: '#645e49'
  on-secondary: '#ffffff'
  secondary-container: '#e8dfc5'
  on-secondary-container: '#68634d'
  tertiary: '#20160a'
  on-tertiary: '#ffffff'
  tertiary-container: '#362a1d'
  on-tertiary-container: '#a2907f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#871f15'
  secondary-fixed: '#ebe2c8'
  secondary-fixed-dim: '#cec6ad'
  on-secondary-fixed: '#1f1c0b'
  on-secondary-fixed-variant: '#4c4733'
  tertiary-fixed: '#f4dfcb'
  tertiary-fixed-dim: '#d7c3b0'
  on-tertiary-fixed: '#241a0e'
  on-tertiary-fixed-variant: '#524436'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-page: 64px
  sidebar-width: 320px
---

## Brand & Style

The brand personality is academic, authoritative, and deeply immersive. It is designed to evoke the feeling of a modern digital archive that honors the gravity of historical events. The target audience includes historians, educators, and students who seek a sophisticated storytelling experience.

The design style is **Modern Academic**. It blends the clean lines of contemporary editorial design with the tactile warmth of historical preservation. It uses high-contrast layouts and a structured grid to balance rich imagery with dense educational content, ensuring every element feels intentional and curated.

## Colors

The palette is rooted in materials of the era and the grit of the conflict. 

- **Primary (Deep Burgundy):** Used for primary actions, active navigation states, and key highlights. It represents the "living" thread of the narrative and the cost of war.
- **Secondary (Parchment):** The foundational background color. It provides a warm, non-reflective surface that mimics aged paper or stucco.
- **Tertiary (Stone/Earth):** Used for containers, subtle section breaks, and secondary buttons.
- **Neutrals (Obsidian/Charcoal):** High-contrast blacks and grays for typography to ensure maximum legibility and an institutional feel.

## Typography

This design system utilizes a classic serif/sans-serif pairing to distinguish between narrative storytelling and functional data.

- **Headlines:** Noto Serif is used for titles and chapter headings. It provides the "voice" of the archive—elegant, timeless, and serious.
- **Body & Labels:** Work Sans provides a functional, utilitarian counterpoint. It is used for long-form reading, metadata, and interface controls. 
- **Styling Note:** Use all-caps with generous letter spacing for navigation and metadata labels to evoke the feeling of archival cataloging.

## Layout & Spacing

The design system employs a **Fixed Grid** model within a flexible viewport. 

- **Sidebar:** A persistent vertical navigation bar (320px) anchors the experience on the left, acting as a "Table of Contents."
- **Content Area:** Content is centered in a 12-column grid with 24px gutters. 
- **Rhythm:** Generous vertical padding (80px - 120px) is used between major chapters to create a sense of pacing and "breath" in the historical narrative.
- **Micro-spacing:** Built on an 8px base unit for internal component padding.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and crisp boundaries rather than shadows. 

- **Flat Depth:** UI elements sit flush on the parchment background. Depth is communicated by shifting the background color to a darker stone or light clay tone for containers.
- **Contrast Borders:** Very thin (1px) borders in stone gray are used to define card boundaries or image frames.
- **Active State Elevation:** Interactive elements like the "Active Map" button use high color contrast (Burgundy on Parchment) to appear "pressed" or "raised" in the user's visual field without physical shadow effects.

## Shapes

The shape language is primarily **Soft** and structured. 

- **Base Radius:** 4px (0.25rem) for buttons and input fields to prevent them from feeling too modern or "bubbly."
- **Image Treatment:** Large hero images and artifact photos should have slightly rounded corners (8px) to soften the "cut" against the background.
- **Exceptions:** Secondary buttons and "chips" may use a fully rounded (pill) shape to distinguish them from primary structural elements.

## Components

- **Buttons:** Primary buttons are solid Burgundy with Cream text. Secondary buttons are outlined in Stone or Burgundy with no fill.
- **Navigation Items:** Vertical sidebar links use all-caps Work Sans. The active chapter is indicated by a solid Burgundy block background.
- **Cards:** Used for artifacts and sub-chapters. They feature a 1px Stone border or a subtle fill change to #D9C5B2.
- **Interactive Map Pin:** A custom drop-shadowed icon in Burgundy to contrast against the desaturated, earthy map textures.
- **Artifact Frames:** Images of historical objects should be treated as museum pieces, often centered with caption text in italicized Noto Serif below them.
- **Input Fields:** Minimalist lines or lightly filled containers using #EBE2C8, maintaining the low-elevation aesthetic.