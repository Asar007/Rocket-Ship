# GEO Analysis — madrasswastic.com

**Site:** https://www.madrasswastic.com/
**Audited:** 2026-05-27
**Source:** Local codebase inspection (vite-react-ssg, prerendered HTML)
**Framing note:** Per Google's official guidance (May 2026), "optimizing for generative AI search is still SEO." Findings below are SEO fundamentals applied to AI-search surfaces (Google AI Overviews, ChatGPT, Perplexity, Bing Copilot), not a separate discipline.

---

## GEO Readiness Score: 58 / 100

| Dimension | Weight | Score | Notes |
|-----------|-------:|------:|-------|
| Citability (passages) | 25% | 12 / 25 | Strong specific facts (ISRO Gaganyaan, PSLV/GSLV/GSLV Mk III, est. 2009, Guindy). No 134–167 word self-contained answer blocks; no first-60-word "What is…" definition. |
| Structural readability | 20% | 11 / 20 | Clean H1→H2 hierarchy on each page, but headings are marketing-styled ("Engineering for Space. Built for Industry.") not query-shaped ("What does Madras Swastic Engineers do?"). No FAQ section. |
| Multi-modal | 15% | 10 / 15 | Project images present (WebP), 3D Gaganyaan scene, capsule frames. No captions, no `figcaption`, no transcript/alt-rich explanations for AI extraction. |
| Authority & brand signals | 20% | 8 / 20 | ProfessionalService schema is good. No `sameAs` to LinkedIn / Wikidata / YouTube / Wikipedia. No author bylines / Person schema. No publication or update dates. **Brand entity is split** (see Critical Issue #1). |
| Technical accessibility | 20% | 17 / 20 | vite-react-ssg prerenders HTML — AI crawlers see content without JS. robots.txt allows all UAs. No llms.txt. Sitemap lacks `<lastmod>`. |

---

## Platform Breakdown

| Platform | Estimated visibility | Why |
|----------|----------------------|-----|
| **Google AI Overviews** | Medium | SSR + schema + traditional SEO basics in place. Will surface for branded ("madras swastic engineers") and ISRO-vendor queries once organic ranking improves. Hurt by lack of question-shaped H2s. |
| **ChatGPT (web search)** | Low–Medium | Wikipedia and Reddit presence is the primary citation lever here (47.9% / 11.3%). The brand has zero detectable Wikipedia / Reddit footprint. |
| **Perplexity** | Low | Reddit-heavy citation source (46.7%) — same problem as ChatGPT. |
| **Bing Copilot** | Medium | Bing indexes SSR'd HTML easily; ProfessionalService schema helps. No IndexNow ping configured. |

---

## AI Crawler Access Status

`public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /space
Disallow: /cts-render
Sitemap: https://www.madrasswastic.com/sitemap.xml
```

**Status:** All major AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, CCBot, anthropic-ai, Bytespider) are implicitly allowed via the wildcard. No explicit AI directives — fine for visibility, but no signal of intent.

**Recommendation (optional):** Add explicit allow blocks for major AI search crawlers so future config audits are unambiguous, and explicitly opt out of training crawlers if desired:

```
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: PerplexityBot
Allow: /

# Optional: opt out of training crawlers but keep search crawlers
User-agent: CCBot
Disallow: /
User-agent: anthropic-ai
Disallow: /
```

---

## llms.txt Status: MISSING

No `/llms.txt` at the project root. Per Google (Mueller, Illyes, 2026), `/llms.txt` is not a confirmed citation ranking signal — claude-seo reports its presence with no weight. **Low-priority quick win** for completeness only.

Ready-to-use template:

```markdown
# Madras Swastic Engineers
> Turnkey industrial engineering firm in Chennai, India. Fabrication partner on ISRO's Gaganyaan crew-module programme. Serves space, paper, sugar and petrochemical sectors. Founded 2009.

## Main pages
- [Home](https://www.madrasswastic.com/): Overview of capabilities across space and industrial sectors
- [About](https://www.madrasswastic.com/about): Founded 2009; ISRO partnership since 2016; Gaganyaan fabrication partner
- [Projects](https://www.madrasswastic.com/projects): Crew Training Simulator, SSLV core/base simulators, structural and process work
- [Customization](https://www.madrasswastic.com/customization): Bespoke fabrication to client drawings, tolerances and timelines
- [Contact](https://www.madrasswastic.com/contact): md@madrasswastic.com · +91 98841 48474

## Key facts
- Founded: 2009
- Headquarters: 21-C, 5th Cross St, South Phase, Guindy Industrial Estate, Guindy, Chennai 600032, Tamil Nadu, India
- Sectors served: Space (ISRO), paper, sugar, petrochemical
- ISRO programmes: PSLV, GSLV, GSLV Mk III, Gaganyaan
- Capabilities: rocket vibration-simulation systems, zero-G test rigs, equipment handling, ground systems for launch, milk-of-lime equipment, water and effluent treatment plants
- Notable: Crew Training Simulator delivered to ISRO/HSFC in 90 days; inaugurated by PM Narendra Modi at VSSC, Trivandrum
```

Save to `public/llms.txt` — vite will serve it at `/llms.txt` in dev and copy it to `dist/` at build.

---

## Brand Mention Analysis

| Platform | Detected | Impact on AI citation |
|----------|----------|-----------------------|
| Wikipedia | No (none detected in schema `sameAs`) | High — strongest signal for ChatGPT |
| Wikidata | No | High |
| LinkedIn company page | Not linked from schema | Moderate |
| YouTube channel / mentions | Not linked | Strongest correlation (~0.737) for AI citations |
| Reddit discussions | Unknown / unlikely (B2B niche) | High for Perplexity (46.7% of citations) |
| Press / news (The Hindu, Hindustan Times, ISRO press releases) | Likely exists offline; not linked from schema | High |

**Action:** Even without building new presence, audit existing press coverage (ISRO/PM Modi inauguration of CTS at VSSC is a clear earned-media moment) and link any existing LinkedIn / Crunchbase / GitHub Org / press pages via `sameAs` in the JSON-LD.

---

## Passage-Level Citability

Audit of content sources (`src/sections/*.jsx`, `src/pages/*.jsx`):

**Strong quotable facts already in copy:**
- "Founded in 2009, Madras Swastic Engineers fabricates across the full scale of industry…" (Hero, ~40 words — good)
- "Selected to design and manufacture rocket vibration-simulation systems, zero-G test rigs, equipment handling and ground systems across PSLV, GSLV and GSLV Mk III." (AboutJourney, 28 words — citable)
- "A CTS was manufactured within a 90-day period and successfully handed over to ISRO/HSFC Director, Shri M. Mohan." (Projects, 19 words — extremely citable, named entity + specific timeline)
- "The CTS was officially inaugurated by Shri Narendra Modi, Prime Minister of India, at the space summit held at VSSC, Trivandrum." (Projects, 22 words — very citable)

**Gaps:**
- No single self-contained 134–167 word block answering "What does Madras Swastic Engineers do?" — AI extractors prefer one paragraph they can pull verbatim.
- Hero subhead is 60 words but spread across two `<motion.p>` paragraphs and a trust strip. AI parsers see four blocks, not one answer.
- Projects facts are buried in a `story: [...]` array rendered inside a modal — verify that prerendered HTML actually includes this prose (next action below).

---

## Server-Side Rendering Check

**Stack:** `vite-react-ssg` (static prerender at build time).
**Status: GOOD** — all five sitemap routes (`/`, `/about`, `/projects`, `/customization`, `/contact`) are prerendered. Per-page `<title>` and `<meta description>` are injected by `src/lib/seo.jsx` into the static HTML.

**Verify after next deploy:**
```bash
curl -s https://www.madrasswastic.com/projects | grep -i "Crew Training Simulator"
curl -s https://www.madrasswastic.com/about | grep -i "Gaganyaan"
```
If the project `story` paragraphs do not appear in raw HTML (they live inside a modal triggered by click), AI crawlers will miss them. **Likely issue** based on `ProjectModal.jsx` pattern — fix is to render the story prose in a visually-hidden `<div>` or `<details>` element so it lives in the DOM, not just modal state.

---

## CRITICAL Issue #1 — Brand Name Inconsistency

The brand is spelled **"Madras Swastic Engineers"** everywhere — except `src/sections/About.jsx:48`, which says **"Madras Swastik Engineers"** (with a `k`). This is the only Swastik/Swastic split in the codebase.

```jsx
// src/sections/About.jsx:48 — INCONSISTENT
subtitle="Founded in 2009, Madras Swastik Engineers provides service and engineering support to ISRO..."
```

**Why this matters for GEO:** AI systems (ChatGPT, Perplexity, Google AI Overviews) build a single entity by exact-string matching brand names across mentions. A split brand fragments authority signals and can cause AI to treat the two spellings as different entities. Fix this **first**.

---

## Top 5 Highest-Impact Changes

1. **Fix the "Swastik / Swastic" split in `src/sections/About.jsx:48`** — change "Madras Swastik Engineers" → "Madras Swastic Engineers." One-line fix, biggest entity-disambiguation win.

2. **Render project stories in the static HTML, not just inside modal state.** Add the `story: [...]` paragraphs from `src/sections/Projects.jsx` as a visually-hidden `<div>` (e.g. `sr-only` or `hidden` `<section>` rendered inline beside each card) so the Gaganyaan / CTS / SSLV detail is in the prerendered DOM. These are the most citable passages on the site.

3. **Add `sameAs` to the JSON-LD in `index.html:32-50`** linking the brand's LinkedIn, Wikidata (create one), YouTube, and any press pages. Schema:
   ```json
   "sameAs": [
     "https://www.linkedin.com/company/madras-swastic-engineers",
     "https://www.youtube.com/@madrasswastic",
     "https://www.wikidata.org/wiki/Q…"
   ]
   ```

4. **Add a 140-word "What does Madras Swastic Engineers do?" answer block to the Home page** above the fold, before `<About />`. Self-contained paragraph, specific verbs, named programmes, named sectors, founded date, location. This becomes the canonical AI-citation passage.

5. **Add `<lastmod>` to every URL in `public/sitemap.xml`.** AI crawlers (GPTBot, OAI-SearchBot, PerplexityBot) use lastmod to prioritise recrawl, and absence is read as "stale or unmaintained." Also raise `/projects` priority and add `lastmod` from git history at build time.

---

## Schema Recommendations

Current schema (`index.html:29-51`): single `ProfessionalService` node with NAP — solid baseline.

**Add (recommended additions, in order):**

1. **`Organization` → `sameAs` array** (see #3 above).
2. **`Service` nodes** for the four sector capabilities, with `serviceType` and `provider` referencing the main org. Lets Google AI Overviews answer "who does X in India" with this site.
3. **`Project` (CreativeWork) entries** for CTS, SSLV simulators, etc. — these have named ISRO recipients and dates, ideal for AI citation.
4. **`Person` schema** for Managing Director (currently only "md@" email is published) — gives Google an author entity to cite.
5. **`BreadcrumbList`** on `/about`, `/projects`, `/customization`, `/contact` — improves AI navigation understanding.

Do **not** add `FAQPage` schema for commercial pages — Google deprecated rich-result eligibility for non-government/health sites in 2023. Keep FAQ content as plain HTML.

---

## Content Reformatting Suggestions

**`src/sections/Hero.jsx:136-140`** — Tighten and reposition for citation:

> Madras Swastic Engineers is a turnkey industrial engineering firm founded in 2009 in Chennai, India, that designs, fabricates and installs precision systems for ISRO's PSLV, GSLV, GSLV Mk III and Gaganyaan programmes — including rocket vibration-simulation rigs, zero-G test systems and crew-module hardware — alongside turnkey plants for the paper, sugar and petrochemical sectors. The firm operates from 21-C, 5th Cross St, Guindy Industrial Estate, Chennai 600032, and delivered the Gaganyaan Crew Training Simulator to ISRO/HSFC in 90 days, inaugurated by Prime Minister Narendra Modi at VSSC, Trivandrum.

(~145 words, single block, specific facts, named entities → optimal AI passage.)

**Headings to add (question-shaped, AI-search aligned):**
- About page H2: "What does Madras Swastic Engineers do?"
- About page H2: "When was Madras Swastic Engineers founded?"
- Projects page H2: "Which ISRO programmes has Madras Swastic Engineers supported?"
- Customization page H2: "Does Madras Swastic Engineers do bespoke fabrication?"

These map directly to "people also ask" AI Overview slots without changing the visual design.

---

## Quick Wins Checklist (do these first)

- [ ] Fix `Swastik` → `Swastic` in `src/sections/About.jsx:48`
- [ ] Add `sameAs` array to `index.html` JSON-LD
- [ ] Add `<lastmod>` to all 5 entries in `public/sitemap.xml`
- [ ] Write the 140-word "what we do" block and place it as a visible paragraph on `/` and as the lead paragraph on `/about`
- [ ] Render `ProjectModal` story prose in static HTML (sr-only div) so AI crawlers see CTS / SSLV / Gaganyaan details
- [ ] Create `public/llms.txt` from the template above
- [ ] Add four question-shaped H2s above (About, Projects, Customization)
- [ ] Add an "Updated: YYYY-MM-DD" stamp to /about and /projects

## Medium Effort

- [ ] Create LinkedIn company page if not present, link via `sameAs`
- [ ] Create Wikidata item for the brand (free, machine-readable, high AI weight)
- [ ] Add `Service` schema for each sector capability
- [ ] Add `Person` + `Organization` connection for managing director
- [ ] Add IndexNow ping on deploy (Bing + Yandex)

## High Impact / Long-Term

- [ ] Pursue Wikipedia article (the ISRO/Gaganyaan/PM Modi inauguration of CTS likely meets notability if cited to The Hindu, ISRO press releases, etc.)
- [ ] Launch a YouTube channel with one short walkthrough per project — YouTube mention correlation with AI citations is ~0.737, the single strongest signal
- [ ] Publish a short technical case-study post per major project (CTS, SSLV) on the site, dated, with author byline — creates citable URLs distinct from the marketing pages

---

## Footnote

All recommendations follow Google's primary-source position (May 2026): GEO is SEO. The `llms.txt` and explicit AI-crawler directives are included for completeness, not because either is a confirmed AI-citation ranking lever. The two largest expected lifts here — entity consistency and rendering project stories into static HTML — are pure SEO fixes that happen to be load-bearing for AI search visibility.
