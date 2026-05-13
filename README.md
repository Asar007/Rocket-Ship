# Madras Swastic Engineers — Landing Page

A modern premium landing site built with **React + Vite + Tailwind CSS + Framer Motion**, with a fullscreen **ShaderGradient** animated background. Section flow follows the uploaded whiteboard skeleton (`landing-page-skeleton.html`).

## Stack

- React 18 + Vite 5
- Tailwind CSS 3
- Framer Motion
- `@shadergradient/react` (uses `@react-three/fiber` + `three`)
- `lucide-react` icons
- Google Fonts: Sora (display), Manrope (body), JetBrains Mono (eyebrow/labels)

## Install & Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Structure

```
src/
  assets/logo.png            # Company logo (auto-imported)
  components/
    ShaderBackground.jsx     # Fixed shader background layer
    Navbar.jsx               # Sticky glass navbar + mobile sheet
    Footer.jsx               # Site footer
    SectionHeading.jsx       # Shared eyebrow + title pattern
    AnimatedCounter.jsx      # In-view number counter
    ProgressRing.jsx         # SVG gradient ring
  sections/
    Hero.jsx                 # Hero with rotating gear visual
    About.jsx                # Story + timeline
    WhyChooseUs.jsx          # Three commitment cards
    Projects.jsx             # Project showcase grid
    Clients.jsx              # Infinite marquee rows
    Stats.jsx                # Counters + rings + bars
    ContactCTA.jsx           # Large glass CTA card
  styles/index.css           # Tailwind + custom layers
  App.jsx                    # Composition
  main.jsx                   # Entry
```

## Aesthetic

Dark navy backdrop, electric-blue + warm-gold accents, glassmorphism panels and a live shader that bleeds gold and blue beneath every section. Sora display font, Manrope body, JetBrains Mono for engineering-style labels.
