# SEO Plan — Madras Swastic Engineers
**Scope:** All-India + export · B2B · Industrial/Heavy Fabrication
**Site:** https://www.madrasswastic.com/
**Drafted:** 2026-05-27
**Companion:** `docs/GEO-ANALYSIS.md` (AI-search readiness)

---

## 1. Strategic Framing

You are not competing for "metal fabrication" as a 2.4M-result keyword. You are competing for the **subset of B2B buyers** (project engineers, procurement leads, OEM supply-chain) who already know they need heavy/structural/precision fabrication and are evaluating Indian or Asia-Pacific suppliers. That audience runs three distinct query types:

| Query type | Example | Intent |
|---|---|---|
| **Capability** | "heavy fabrication services India", "structural fabrication contractor Chennai" | Vendor shortlist |
| **Sector-fit** | "ISRO fabrication vendor", "process plant fabricator paper mill", "petrochemical ETP fabricator" | Pre-qualified suppliers for their sector |
| **Trust** | "Madras Swastic Engineers", "[firm name] reviews / case studies" | Confirming a name they already heard |

The plan below optimises all three. **"Fabrication engineer" is intentionally excluded** — it is a job-board query.

---

## 2. Keyword Universe (Targeted)

### Tier 1 — Primary (head, build dedicated pages)
| Keyword | Modifier strategy | Target page |
|---|---|---|
| heavy fabrication | + Chennai / India / services | New: `/services/heavy-fabrication` |
| structural fabrication | + India / contractor / works | New: `/services/structural-fabrication` |
| metal fabrication company | + India / Chennai | Home + About |
| precision fabrication | + India / aerospace / engineering | New: `/services/precision-fabrication` |
| turnkey fabrication | + India / industrial / plant | Customization (rewrite) |

### Tier 2 — Mid-tail (sector + capability, win cheap)
- aerospace fabrication India
- ISRO vendor fabrication / ISRO-approved fabrication
- rocket structural fabrication India
- crew module fabrication
- effluent treatment plant fabricator India
- milk of lime equipment manufacturer
- paper mill turnkey fabrication India
- sugar industry ETP fabricator
- petrochemical ETP manufacturer India
- raw water treatment plant India

### Tier 3 — Export / international (low competition, high commercial value)
- heavy fabrication company in India for export
- Indian metal fabrication exporter
- Chennai-based industrial fabricator (English variants of common procurement queries)
- ISO-equivalent Indian fabrication supplier
- contract manufacturing India (heavy engineering)

### Tier 4 — Brand + jobs-to-be-done (long-tail, content blog)
- how to choose a heavy fabrication contractor in India
- heavy fabrication vs structural fabrication
- what does a turnkey fabrication contractor do
- ISRO fabrication vendor requirements
- AWS welding standards Indian fabricators

---

## 3. Recommended Content Architecture

```
/                                  -> Home (entity + heavy fabrication India)
/about                             -> Authority + entity ("Madras Swastic Engineers")
/projects                          -> Proof (case studies, no change in URL)
/customization                     -> Bespoke / made-to-drawing
/contact                           -> Conversion

NEW:
/services/                         -> Hub (capability index, no thin content)
/services/heavy-fabrication        -> Tier 1
/services/structural-fabrication   -> Tier 1
/services/precision-fabrication    -> Tier 1
/services/turnkey-plants           -> Tier 1 (paper/sugar/petrochem)
/services/aerospace-fabrication    -> Tier 2 (ISRO, Gaganyaan, SSLV)
/sectors/                          -> Optional hub
/sectors/aerospace                 -> Sector-fit (ISRO/Gaganyaan/SSLV detail)
/sectors/paper                     -> Sector-fit
/sectors/sugar                     -> Sector-fit
/sectors/petrochemical             -> Sector-fit

OPTIONAL (later, content-led, +12 weeks):
/insights/                         -> Blog hub
/insights/<post-slug>              -> Tier-4 long-tail capture
```

**Hard rules:**
- Each `/services/*` page = **800–1,200 words minimum** of unique technical detail. Anything thinner triggers Google's "thin content" pattern detector for templated pages.
- Each `/sectors/*` page must contain **at least one named past project** from `/projects` to avoid duplicate fluff.
- Do NOT auto-generate location pages (Chennai, Mumbai, Bangalore, etc.) — for a single-location B2B firm, geo-templated pages look like spam. Use one `/locations/chennai` only if/when you have a second physical site.

---

## 4. Page-by-Page Edits (Existing Pages)

### `/` (Home — `src/pages/Home.jsx`, sections in `src/sections/`)

Current `<title>`:
> Engineering Precision for Space & Industry · Madras Swastic Engineers

Recommended `<title>` (60 chars):
> Heavy Fabrication & Industrial Engineering India | Madras Swastic

Recommended meta description (155 chars):
> Madras Swastic Engineers — Chennai-based heavy & precision fabrication firm. ISRO Gaganyaan partner. Turnkey plants for paper, sugar, petrochemical sectors. Est. 2009.

Body changes:
- Hero subhead (`src/sections/Hero.jsx:136`) — keep design but add one literal-keyword caption line above the existing trust strip:
  > *Heavy and precision metal fabrication, turnkey engineering — Chennai, India · serving clients across India and export markets since 2009.*
- About section (already updated with the 145-word canonical block) — verify the new lead paragraph contains: "metal fabrication," "heavy fabrication," "Chennai, India." Currently it has "engineering firm," not "fabrication firm." **Action: change "engineering firm" to "metal fabrication and engineering firm"** in the canonical paragraph.

### `/about`

Current `<title>`:
> About Us · Madras Swastic Engineers

Recommended `<title>`:
> About Madras Swastic Engineers | Heavy Fabrication Company in Chennai

Recommended meta description:
> Founded 2009 in Chennai. ISRO fabrication partner for Gaganyaan, PSLV, GSLV programmes. Heavy fabrication, structural assemblies, turnkey plants — delivered across India and exported.

Body: add a "What we do" H2 listing the five service families (links into new `/services/*` pages once built).

### `/projects`

Current `<title>`:
> *(verify — likely "Projects" + brand)*

Recommended `<title>`:
> Fabrication Projects — Aerospace, Structural, Process Plant | Madras Swastic

Recommended meta description:
> Selected heavy and precision fabrication projects: Gaganyaan crew training simulator, SSLV simulators, plant erection, structural assemblies — delivered across India.

Body: add a one-line lead under SectionHeading: *"Selected heavy fabrication and turnkey engineering projects delivered for ISRO and industrial clients across India."*

### `/customization`

Current copy targets "bespoke fabrication." Reframe as **"custom metal fabrication & contract manufacturing"** — this is what export buyers search for.

Recommended `<title>`:
> Custom Metal Fabrication & Contract Manufacturing | Madras Swastic India

### `/contact`

Title is fine. Add an *Export enquiries* sub-block with a clear "Indian Standard Time, English-language correspondence, drawings via secure transfer" line — directly addresses export buyer hesitations.

---

## 5. New Pages — Outline Each (800–1,200 words target)

### `/services/heavy-fabrication`

H1: **Heavy Fabrication Services in India**
Lead (60 words, citable): definition + capability statement + named programmes (ISRO Gaganyaan, PSLV, GSLV, refinery, paper mills) + tonnage range + tolerances.

Sections:
1. What we mean by *heavy fabrication* (definition, vs light/precision)
2. Capabilities — plate thickness range, weld processes (SMAW, GMAW, TIG), max assembly size, lifting/handling capacity
3. Standards we work to (IS, ASME, AWS D1.1, ISRO QA)
4. Materials — carbon, alloy, stainless, exotic
5. Sectors served (link to `/sectors/*`)
6. Named past deliveries (link to `/projects` items)
7. Inspection & quality — CMM, dimensional reports, NDT
8. Lead time, packaging for export, logistics
9. How to request a quotation (form anchor)

### `/services/structural-fabrication`
Same skeleton, focused on lattice towers, spaceframes, dome erection, process structures.

### `/services/precision-fabrication`
Focus on micron-tolerance work, precision brackets, fixtures, jigs. CTS / SSLV simulator detail anchors authority.

### `/services/turnkey-plants`
Paper / sugar / petrochemical plant focus. Milk-of-lime equipment, ETPs, raw water systems. **This is your only commercially defensible "turnkey" page.**

### `/services/aerospace-fabrication`
ISRO programmes (PSLV, GSLV, GSLV Mk III, Gaganyaan, SSLV), QA, traceability, the CTS-in-90-days story.

### `/sectors/aerospace`, `/sectors/paper`, `/sectors/sugar`, `/sectors/petrochemical`
Industry-specific landing pages. Each gets 600–800 words, one named project, sector-specific schema/equipment vocabulary.

---

## 6. Schema Strategy

Current schema (in `index.html`): single `ProfessionalService` LocalBusiness. **Insufficient for export visibility.**

Add an **Organization graph** (in `index.html`) with:
```jsonld
{
  "@context": "https://schema.org",
  "@graph": [
    { "@id": "#org", "@type": "Organization",
      "name": "Madras Swastic Engineers",
      "alternateName": ["Madras Swastic", "Swastic Engineers"],
      "url": "https://www.madrasswastic.com/",
      "foundingDate": "2009",
      "address": { ... },
      "areaServed": [
        { "@type": "Country", "name": "India" },
        { "@type": "Place", "name": "Export markets — APAC, Middle East, Europe" }
      ],
      "sameAs": [ /* LinkedIn, YouTube, Wikidata when available */ ],
      "knowsAbout": [
        "Heavy fabrication", "Metal fabrication", "Structural fabrication",
        "Precision fabrication", "Turnkey plant engineering",
        "Effluent treatment plants", "Aerospace fabrication"
      ]
    }
  ]
}
```

Add a **`Service` node per service page**, e.g. on `/services/heavy-fabrication`:
```jsonld
{
  "@type": "Service",
  "serviceType": "Heavy fabrication",
  "provider": { "@id": "https://www.madrasswastic.com/#org" },
  "areaServed": ["IN", "AE", "SA", "SG", "MY", "GB", "DE"],
  "audience": { "@type": "BusinessAudience", "name": "Industrial OEMs, EPC contractors, government space programmes" },
  "category": "Industrial fabrication"
}
```

**Do not** add `FAQPage` schema to commercial pages — Google restricted rich-result eligibility to gov/health in Aug 2023. Use plain HTML for FAQs.

---

## 7. Trust & E-E-A-T (Critical for B2B + Export)

Procurement buyers don't convert without these:

| Element | Status | Action |
|---|---|---|
| Certifications page (ISO 9001, ASME U-stamp if any, ISRO vendor approval ref) | Likely missing | Create `/about#certifications` block or `/certifications` page |
| Client logos (real, with permission) | Unknown | Add to Home `Clients` section if not already real |
| Named case studies with metrics | Partial (Projects page has names) | Add tonnage, delivery time, location to each |
| Author/MD bio with photo + LinkedIn | Missing | Add to About page (`Person` schema linked to `Organization`) |
| Press mentions / PM Modi inauguration link | Not linked | Add citation to The Hindu/ISRO press release for the VSSC inauguration |
| Export readiness signals | Missing | Add: incoterms accepted, packaging spec, IEC code reference (no number, just confirmation), shipping ports used (Chennai/Tuticorin) |

---

## 8. Off-Page / Brand Mention Plan

For an Indian B2B fabrication firm, the highest-ROI off-page work is:

### Industry directories (free or paid, all worth listing)
- **IndiaMART** — claim/optimise listing with full capability text
- **TradeIndia** — same
- **ExportersIndia** — same; critical for export queries
- **Justdial** — for branded queries
- **Sulekha B2B**
- **Engineering Export Promotion Council (EEPC India)** — government export body, free authoritative backlink

### Authority publications (one outreach push)
- **Engineering Today / The Machinist / Industrial Products Finder** — pitch a CTS-build technical piece
- **The Hindu / Business Line — Chennai industry desk** — pitch the Modi-inaugurated CTS as a Chennai-MSME milestone
- **ISRO press releases / VSSC vendor lists** — confirm and link any official mention

### LinkedIn
- Company page, optimised "About" section using Tier 1 keywords
- MD posts one technical project breakdown per month
- Employee advocacy — 5–10 employees follow + share

### YouTube (single highest GEO/AI signal — see GEO analysis)
- One 60-second walkthrough per project page (CTS, SSLV, dome erection)
- Title each with target keyword + project name
- Embed on the matching `/projects` / `/services` page

---

## 9. Hreflang / International (Export Audience)

You write English only and your buyers are international English-readers. You **do not need full hreflang i18n** — but you should:

- Set `<html lang="en">` ✓ (already correct)
- Optionally add `<link rel="alternate" hreflang="en" href="…" />` and `<link rel="alternate" hreflang="x-default" href="…" />` on each canonical page to signal "this is the English version, served globally" — clean signal for Google's international index.
- Add `areaServed` array in schema as above.

---

## 10. Technical Foundations (Mostly Already Solid)

| Item | Status | Action |
|---|---|---|
| SSR/SSG | ✓ vite-react-ssg | None |
| Sitemap | ✓ exists, lastmod just added | When new pages ship, add them with lastmod |
| robots.txt | ✓ open | Keep open; no AI crawlers blocked |
| llms.txt | ✓ just added | Update when new service pages ship |
| Schema | Partial | Implement Organization graph + per-Service nodes (Section 6) |
| Internal linking | Sparse | Each `/services/*` page links to ≥2 `/sectors/*` + ≥2 `/projects` items |
| Breadcrumbs | Missing | Add visible breadcrumb + `BreadcrumbList` schema once nested pages exist |
| Image alt text | Mostly good | Audit during page builds |
| Core Web Vitals | Recently optimised (recent commits show) | Re-test after new pages ship |

---

## 11. Measurement

**Set up before launching new pages:**
- Google Search Console — verify domain property (not just URL prefix)
- Submit updated `sitemap.xml`
- GA4 with a "Lead" event on contact form submission
- Bing Webmaster Tools (export buyers in Middle East/Europe disproportionately use Bing)
- IndexNow ping on deploy (Bing + Yandex)

**Track these queries in GSC weekly:**
1. heavy fabrication india
2. heavy fabrication chennai
3. structural fabrication contractor india
4. metal fabrication company chennai
5. turnkey fabrication india
6. aerospace fabrication india
7. ISRO fabrication vendor
8. effluent treatment plant fabricator india
9. madras swastic engineers (brand baseline)

Conversion target: 12 qualified RFQ-form submissions/month within 6 months. (B2B fabrication baseline is ~0.5–1.5% conversion on relevant traffic; you need ~1k–2k monthly qualified visitors to hit that.)

---

## 12. 90-Day Roadmap

### Weeks 1–2 — Foundations (no new pages)
- [ ] Apply title/meta/H1 edits to all 5 existing pages (Section 4)
- [ ] Add Organization graph schema (Section 6, base entity only — no Service nodes yet)
- [ ] Update About lead paragraph with "metal fabrication and engineering firm" wording
- [ ] Set up GSC, GA4 lead event, Bing Webmaster
- [ ] Claim IndiaMART / TradeIndia / ExportersIndia listings; submit EEPC India membership if not already

### Weeks 3–6 — Service pages
- [ ] Build `/services` hub + 5 service pages (Section 5)
- [ ] Add `Service` schema to each
- [ ] Update `sitemap.xml` + `llms.txt` with new URLs
- [ ] Add breadcrumbs + `BreadcrumbList` schema
- [ ] Internal-link from Home, About, Projects, Customization to relevant `/services/*`

### Weeks 7–10 — Sector pages + trust
- [ ] Build 4 `/sectors/*` pages
- [ ] Add MD bio + `Person` schema on `/about`
- [ ] Add `/about#certifications` block with ISO/ISRO-vendor refs
- [ ] Add 1 named press citation (Hindu / ISRO release) with anchor link

### Weeks 11–13 — Off-page + content
- [ ] First LinkedIn technical post
- [ ] First YouTube project walkthrough (60–90s)
- [ ] Pitch one trade-press piece (Engineering Today or Machinist)
- [ ] Re-test CWV; submit any regressions to PageSpeed
- [ ] First GSC review — which queries are gaining impressions, which clusters need more depth

---

## 13. Falsifiability (How We Know This Plan Worked)

| Metric | 30 days | 90 days | 180 days |
|---|---|---|---|
| GSC impressions on Tier 1 queries | ≥ 500 | ≥ 3,000 | ≥ 10,000 |
| GSC click-through-rate (branded) | n/a | ≥ 30% | ≥ 35% |
| Indexed URLs (was 5) | 10+ | 20+ | 25+ |
| Qualified RFQ submissions | baseline measured | ≥ 4/mo | ≥ 12/mo |
| Ranking position avg, Tier 1 keywords | n/a | top 50 | top 20 |
| LinkedIn company followers | baseline measured | +200 | +800 |

If at day 90 we have < 1,000 impressions on Tier 1 queries combined, the diagnosis is one of: (a) service pages too thin, (b) no off-page authority, (c) target keywords mis-chosen. Re-run `/seo audit` and `/seo backlinks` to localise the failure.

---

## 14. Out of Scope (Explicitly Not Doing)

- **`/seo programmatic`** — no auto-generated geo/city/template pages. Not appropriate for a single-location, premium B2B brand.
- **"fabrication engineer" keyword** — jobs vertical, wrong intent.
- **FAQPage schema on commercial pages** — Google deprecated rich-result eligibility (Aug 2023).
- **HowTo schema** — deprecated Sept 2023.
- **Mass directory submission** — only the 5–6 named in Section 8 are worth claiming. Spammy directory pushes can suppress.
- **Backlink purchasing / PBNs** — disqualifies the brand from any premium aerospace/government tender.

---

## 15. Next Action

**You decide one of:**
1. **Apply Section 4 page edits now** (titles, metas, body keyword insertions) — I can ship in one pass, no new pages, immediate Tier 1 keyword alignment.
2. **Scaffold the `/services/*` page structure first** (routes + skeleton + nav links, no copy yet) — sets the architecture, then I fill copy page-by-page on request.
3. **Both, in that order** — fastest path to ranking signals.

Recommend (3). If you confirm, I batch the page edits + create the `/services` route skeleton in the next message.
