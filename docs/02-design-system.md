# Aviteus Healthcare: Design System v1.0

**Rule one:** the logo and the brand colours stay exactly as they are. We only change how they are used.

Source of truth for code: `site/assets/css/styles.css` (section 1, Tokens).

---

## 1. Logo

- Keep the current logo file: `https://aviteushealthcare.co.uk/images/logo.png`. Copy it to `site/images/logo.png` before launch. The template already points there.
- Until the file is in place, `main.js` swaps in a text wordmark ("Aviteus **Healthcare**") so nothing looks broken. No inline scripts are used, so the strict Content Security Policy in `deploy/nginx.conf` works.
- **Ask the client for:** the original vector file (SVG, AI or EPS), a white version for the dark footer, and a square icon for the favicon and social profiles. A PNG alone will blur on high-resolution screens.
- Clear space: at least the height of the "A" on every side.
- Minimum size: 120px wide on screen.
- Never stretch, recolour, add shadows or place it on a busy photo.

## 2. Colour

### 2.1 Brand colours (unchanged)

| Token | Hex | Role | Contrast on white |
|---|---|---|---|
| `--slate` | `#374757` | **Primary.** Headings, body text, primary buttons, dark bands | 9.5:1 pass |
| `--teal` | `#359FBC` | **Accent.** Icons, borders, highlights, large text only | 3.1:1 large text only |
| `--grey` | `#959BAF` | **Secondary.** Decorative lines only | 2.8:1 never for text |
| `--bg` | `#F7F9FB` | Section background | |
| `--white` | `#FFFFFF` | Main background, cards | |

### 2.2 Accessible shades (same hues, darker or lighter)

The old site used teal and grey for small text. Both fail WCAG AA. These shades keep the same look and pass.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--slate-900` | `#263340` | Footer, top bar | 12.9:1 with white |
| `--teal-700` | `#1C7189` | Links, small teal text, teal buttons | 5.6:1 on white |
| `--teal-300` | `#7CC6DA` | Teal text on slate backgrounds | 5.0:1 on slate |
| `--teal-50` | `#E8F5F9` | Soft fills, icon boxes, candidate panels | |
| `--muted` | `#596170` | Secondary text. **Replaces old `#7C7D7E`** | 6.2:1 on white |
| `--line` | `#E1E6EC` | Borders | |

### 2.3 Colour rules

1. Body text is always `--slate` or `--muted`. Never teal. Never grey.
2. The main call to action is **slate** with white text. It reads as calm and trustworthy, which suits care buyers.
3. Teal is the "signal" colour: icons, ticks, numbers, the highlighted half of a headline.
4. Employer areas lean slate. Candidate areas lean soft teal. Visitors learn which side they are on without reading.
5. One dark slate band per page at most twice. Too many and the page feels heavy.

## 3. Typography

Both fonts are from the current site. We keep them for recognition.

| Role | Font | Weights | Size |
|---|---|---|---|
| Headings, buttons, labels | Poppins | 500, 600, 700 | H1 36 to 56px, H2 30 to 42px, H3 20px |
| Body | Open Sans | 400, 600 | 17px, line height 1.65 |

- **Self-hosted** in `static/assets/fonts/` (SIL Open Font Licence, licences included). No requests go to Google, so no visitor data is sent to a third party. Only five font files, 84 KB in total. `font-display: swap` stops blank text while fonts load.
- Fallback: system sans-serif. The page stays readable if Google Fonts is slow.
- Sentences short. Paragraphs three lines or less on desktop.
- Headlines are statements of benefit, not labels. "Checked before their first shift" beats "Compliance".

## 4. Spacing and shape

- 8px grid. Tokens `--s1` (4px) to `--s9` (96px).
- Corner radius 8px (same as live site) for buttons and inputs. 16px for cards.
- Max content width 1200px. 16px side gutter on phones, 32px on tablet and up.
- Section spacing 64px top and bottom. 48px for tight sections.

## 5. Components

| Component | Class | Where |
|---|---|---|
| Top bar with 24/7 line | `.topbar` | Every page |
| Sticky header, mega menu | `.site-header`, `.menu`, `.dropdown--wide` | Every page |
| Mobile menu | `.mobile-menu` | Under 1200px |
| Mobile action bar | `.action-bar` | Under 700px. Request Staff + Find Work |
| Hero | `.hero`, `.hero--page` | Top of every page |
| Booking card visual | `.booking-card` | Home hero. Marked "Illustrative example" |
| Trust strip | `.trust` | Under home hero |
| Two doors | `.door--employer`, `.door--candidate` | Home, contact |
| Problem card | `.problem` | Employer pain points |
| Service / sector card | `.card.card--link` | Hubs |
| Steps | `.steps`, `.steps--5` | Process sections |
| Tick list | `.ticks`, `.ticks--2` | Benefits, checks |
| Role chips | `.chips` | Roles we supply |
| Stats band | `.stats` | Proof numbers |
| Client wall | `.clients` | Text wordmarks until logo permission is confirmed |
| Testimonial | `.quote` | Real quotes only |
| FAQ accordion | `.faq details` | Auto-generates FAQ schema |
| Document list | `.docs` | Certificates and PDFs |
| Form | `.form-card`, `.field`, `.options` | Request staff, register, contact |
| CTA band | `.cta-band` | End of every page |
| Notice | `.notice` | Scam warning |

### Buttons

| Class | Use |
|---|---|
| `.btn--primary` | Main action. Slate. "Request Staff", "Register now" |
| `.btn--teal` | Phone calls. Teal 700 |
| `.btn--outline` | Second action |
| `.btn--light` / `.btn--ghost-light` | On dark bands |

Minimum height 48px. Big enough for thumbs, and meets WCAG target size.

## 6. Imagery

- [Certain] The old site uses no real photos of staff at work. This is the biggest visual gap against Newcross and Nurseplus.
- **Ask the client for:** a half-day photo shoot with real Aviteus workers in uniform (with signed consent), plus the office team. Real faces convert better than stock photos, and buyers spot stock instantly.
- Until then the template uses icons, the booking card visual and text wordmarks. Nothing fake.
- If stock is used: diverse UK care settings, natural light, no posed handshakes, no models in scrubs in a hospital for a care home page.
- Every image needs alt text that says what it shows.

## 7. Accessibility checklist

- All text pairs meet WCAG 2.2 AA (checked: see table 2.2).
- Skip link, visible focus ring (3px teal), keyboard menu.
- Form labels on every field, error messages in text (not just red borders), `aria-invalid` set on errors.
- Touch targets 44px minimum.
- `prefers-reduced-motion` respected.
- Test with a screen reader and on real phones before launch.

## 8. Review mode and claims

The staging preview (`dist/preview/`) outlines every claim in a dashed box. Hover or focus it to read what evidence is needed. The production build strips all review markup and removes any unapproved claim. See `README.md` and `04-claims-register.md`.

New components added in the build: `.included` (included / not included boxes), `.factor` (cost and timing factors), `.error-summary` and `.send-error` (form states), `.consent` (cookie banner, only if analytics is switched on), `.grid-auto` (grids that reflow when a card is removed).
