---
name: Tenochtitlan Academic
colors:
  surface: '#fff8f6'
  surface-dim: '#ebd5d2'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0ee'
  surface-container: '#ffe9e6'
  surface-container-high: '#fae3df'
  surface-container-highest: '#f4ddda'
  on-surface: '#251917'
  on-surface-variant: '#58413e'
  inverse-surface: '#3b2d2b'
  inverse-on-surface: '#ffedea'
  outline: '#8b716d'
  outline-variant: '#dfbfba'
  surface-tint: '#a93729'
  primary: '#3a0000'
  on-primary: '#ffffff'
  primary-container: '#610000'
  on-primary-container: '#ef6a58'
  inverse-primary: '#ffb4a8'
  secondary: '#4c56af'
  on-secondary: '#ffffff'
  secondary-container: '#97a1ff'
  on-secondary-container: '#29338c'
  tertiary: '#000a56'
  on-tertiary: '#ffffff'
  tertiary-container: '#00178d'
  on-tertiary-container: '#7b8afa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#881f14'
  secondary-fixed: '#dfe0ff'
  secondary-fixed-dim: '#bdc2ff'
  on-secondary-fixed: '#000865'
  on-secondary-fixed-variant: '#333d95'
  tertiary-fixed: '#dfe0ff'
  tertiary-fixed-dim: '#bcc3ff'
  on-tertiary-fixed: '#000c60'
  on-tertiary-fixed-variant: '#293aa7'
  background: '#fff8f6'
  on-background: '#251917'
  surface-variant: '#f4ddda'
typography:
  headline-display:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
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
    lineHeight: '1.6'
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  section-gap: 120px
  gutter: 32px
  margin-edge: 64px
  unit: 8px
  container-max: 1280px
---

## Brand & Style

The brand personality is academic, curatorial, and deeply historical. It aims to evoke the atmosphere of a high-end digital museum or a premium scholarly publication. The target audience includes researchers, history enthusiasts, and students who value a thoughtful, narrative-driven exploration of history.

The design style is **Minimalist / Editorial**, characterized by:
- **Classical Foundations:** Heavy reliance on timeless serif typography and an earthy, organic color palette.
- **Asymmetric Balance:** Intentional use of negative space and unbalanced layouts to guide the eye through a narrative sequence.
- **Academic Restraint:** Visual elements are secondary to content; photography is treated with museum-grade reverence (using techniques like grayscale, vignettes, or high-contrast studio lighting).
- **Modern Utility:** While the aesthetic is historic, the navigation and interactive elements are crisp and functional, ensuring a seamless digital experience.

## Colors

The palette is derived from natural, historical pigments. 
- **Primary (Deep Oxblood):** Used for headlines and critical action states, symbolizing the weight of history and empire.
- **Background (Aged Parchment):** The `#EAD7B1` base color provides a warm, non-white surface that reduces eye strain and reinforces the "archival" feel.
- **Neutral (Carbon Ink):** Text is set in a very dark brown-black rather than pure black to maintain softness against the parchment background.
- **Accents:** Muted indigo and deep blues provide subtle variety for categorization (e.g., "Culture" or "Architecture" labels) without breaking the earthy harmony.

## Typography

The typographic system relies on a high-contrast pairing between an elegant serif and a grounded sans-serif.
- **Noto Serif** is reserved for headlines and storytelling markers. It is set with tight line height for large displays to create a "block" effect similar to traditional book titles.
- **Work Sans** handles all functional and body text. Its neutral, contemporary character ensures legibility for long-form reading.
- **Labels** are treated with uppercase transformations and generous letter spacing to act as "metadata" markers, distinguishing them from the narrative flow.

## Layout & Spacing

The system uses a **Fixed Grid** approach for the main canvas to maintain editorial control over line lengths. 
- **Main Layout:** A persistent 64rem (approx.) wide content area, offset by a 16rem sidebar on desktop.
- **Vertical Rhythm:** A large 120px gap between major narrative chapters creates breathing room and signals a shift in topic.
- **Bento Grid:** For artifacts and sub-sections, a 12-column grid is used with 32px gutters, allowing for asymmetrical arrangements where primary artifacts take up 8 columns and secondary details take up 4.

## Elevation & Depth

This system avoids traditional material shadows to maintain its "printed" aesthetic. 
- **Tonal Layering:** Depth is achieved by shifting background colors (e.g., moving from the `#EAD7B1` parchment to a slightly lighter `surface-container-low` for transition sections).
- **Structural Outlines:** Elements are defined by 1px solid borders (`stone-border`) rather than shadows. This creates a "boxed" or "ledger" feel.
- **Flat Overlays:** Image overlays use simple black/tinted gradients to ensure text legibility while maintaining a flat, 2D appearance.

## Shapes

The shape language is primarily **Sharp to Soft**. 
- **Cards and Images:** Use a consistent 12px (`rounded-xl`) corner radius to soften the academic tone and provide a touch of modern digital polish.
- **Functional Elements:** Buttons and interactive pills often use "Pill-shaped" (9999px) or very small (4px) radii to distinguish them from content containers.
- **Side Navigation:** Uses a specific "Rounded-Right" treatment for active states, emphasizing the directional flow of the timeline.

## Components

### Buttons & Interaction
- **Primary Actions:** Solid deep red (`primary`) with white text. On hover, use a slight opacity reduction (90%) rather than a color shift.
- **Outline Buttons:** 1px borders using the `outline` token. Used for secondary "Read More" or "Explore" actions.

### Chips & Labels
- **Category Chips:** Small, pill-shaped backgrounds with `label-sm` typography. Background colors are low-saturation "Fixed" variants of the secondary and tertiary colors.

### Cards
- **Editorial Cards:** Feature a top-heavy image container followed by a padded text area. They use a 1px border and no shadow.
- **Feature Cards:** Use the `primary-container` color for the entire card body to highlight key social or structural data.

### Navigation
- **Top Bar:** Sticky, using the parchment background color with a thin bottom border.
- **Sidebar:** Fixed width, featuring a "Chronicle Index" style with iconography from the Material Symbols set (outlined style). Active links should use the `primary` color with a `rounded-r-full` shape.