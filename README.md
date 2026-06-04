# StudyMate — Design System

**StudyMate** is a campus space-booking web app for **University of Glasgow** students: browse every public building on campus, drill into a level, and reserve an individual seat or a group study space with live availability. The product is modelled on the simplicity of [Skedda](https://www.skedda.com) but reframed for a university library / learning-commons context.

> **Brand relationship.** StudyMate is an *independent student-facing product brand*. It **adopts the University of Glasgow's public visual language** — the official brand palette (University Blue + Cobalt) and the University's official typefaces (Noto Serif + Noto Sans) — so it feels native to Glasgow, and references "University of Glasgow" in copy. It does **not** reproduce the University's trademarked coat-of-arms crest; StudyMate ships with its own original wordmark and app mark. If this app becomes officially endorsed by the University, replace the StudyMate mark with the official UofG identity per their brand toolkit.

---

## Sources & references

| Source | What it gave us | Access notes |
|---|---|---|
| User brief (Tima.co / StudyMate) | Product concept, "browse all buildings, feature one first", desktop-first web app, student booking surface | — |
| [skedda.com](https://www.skedda.com) | UX reference for the booking model (building → level → space) | Public marketing site |
| University of Glasgow Brand Toolkit | Official colours (University Blue `#003865` PMS 2955, Cobalt `#0075B0` PMS 307, Leaf, Rust, Pillarbox, Thistle) and official typefaces (Noto Serif / Noto Sans) | Public: gla.ac.uk/myglasgow/staff/brandtoolkit |
| `uploads/study.jpeg` | Mood reference — warm, cozy, academic study desk (3D isometric) | Decoded ✓ |
| Library Floor Plan + Self-guided tour leaflet (uploaded screenshots) | **Real University of Glasgow Library structure**: 12 levels, the Silent/Quiet/Group colour-zone system, entrance on Level 2, and subject collections per floor. Wired into the UI kit's `data.js`. | Decoded ✓ |
| `uploads/IMG_2998.png`, `IMG_3003.png`, `IMG_3009.png` | Intended reference photos (likely Glasgow buildings) | ⚠️ **Could not be decoded** — appear to be iPhone HEIC files saved with a `.png` extension. See Caveats. |

---

## Content fundamentals — how StudyMate writes

- **Voice:** a calm, capable study companion. Helpful and encouraging without being chatty. Think a good library assistant, not a hype app.
- **Person:** address the student as **"you"**; the product is invisible ("Find your seat", not "StudyMate finds you a seat"). Use **"your"** for owned things ("Your bookings", "Your seat").
- **Casing:** **Sentence case** everywhere — buttons, headings, menu items ("Confirm booking", not "Confirm Booking"). Proper nouns keep their capitals ("University Library", "James McCune Smith Learning Hub").
- **Verbs:** action-first and concrete — *Book · Reserve · Find · Browse · Release · Change · Check in*. Avoid vague CTAs like "Submit" or "Go".
- **Numbers:** lead with the useful number — "**148** seats free", "closes **02:00**", "Level **3**". Use 24-hour time (UK academic convention). Dates as "Wed 31 May".
- **Tone of status:** factual and reassuring. Success = "Seat booked — see you at 10:00." Empty = "No free seats on this level. Try Level 4 or a nearby building." Never alarmist.
- **Glasgow specifics:** British spelling (*favourite, colour, organise, cancelled*). Buildings by their real names.
- **Emoji:** **none** in product UI. Meaning is carried by Lucide icons and colour, never emoji.

**Example microcopy**
- Hero: *"Find a seat. Anywhere on campus."*
- Sub: *"Live availability across every public building at the University of Glasgow."*
- Empty state: *"Nothing booked yet. Browse a building to reserve your first seat."*
- Confirmation: *"Booked — Library, Level 3, Seat 3-118. Held until 14:00."*

---

## Visual foundations

- **Palette & vibe.** Two anchor blues do the heavy lifting: **University Blue `#003865`** (primary — chrome, headings, primary buttons, selected seats) and **Cobalt `#0075B0`** (links, focus, "your booking", interactive accents). Backgrounds are warm-neutral **paper & ink** greys (`#f6f8fa` app bg, white surfaces). Imagery and accents skew **institutional and confident**, never neon. Glasgow's secondary colours (Leaf, Rust, Pillarbox, Thistle) appear only as **semantic** signals.
- **Library study-zone system.** A defining motif lifted from the real Library floor plan: every study floor is one of three zones — 🔴 **Silent** (`#C8102E`, no conversation), 🟡 **Quiet** (`#E6A200`, whispered), 🟢 **Group** (`#1E8A4B`, conversation & group work). Shown as level stripes, zone badges and legends. Soft-fill variants carry the same meaning in chips.
- **Type.** **Noto Serif** for display & headings (h1–h3) — scholarly, a touch of editorial warmth, tight tracking (`-0.02em`). **Noto Sans** for everything functional (h4, body, UI, labels). **Noto Sans Mono** for tokens/codes/seat IDs. This serif-display / sans-body split is the core typographic signature.
- **Spacing.** 4px base unit; generous whitespace; desktop layouts breathe. Cards use 14–16px internal padding; page gutters 24–32px.
- **Backgrounds.** Mostly flat warm-grey/white. Building hero/photo areas use a **University-Blue gradient block** (`135deg, #003865 → #0a4d80`) with a large translucent serif building-initial glyph as a tasteful placeholder until a real photo is dropped in — **no** rainbow or purple gradients, **no** busy textures.
- **Cards.** White surface, `1px` `--border` hairline, `--radius-lg` (14px) corners, `--shadow-sm` at rest lifting to `--shadow-lg` on hover. Calm, not floaty.
- **Borders & radii.** Hairline borders `#dde2e8`; controls at 8px, cards at 14px, pills/seats fully rounded or 7–12px. Nothing sharp-cornered.
- **Shadows.** Soft and **cool-tinted** (rgba of `#001d36`), never grey/black. Five-step elevation ramp; used sparingly — borders carry most separation.
- **Hover states.** Buttons darken (primary → `--primary-hover`); secondary/ghost gain a `--blue-50` wash and a stronger border; cards raise elevation; seats brighten their fill. ~200ms `ease-out`.
- **Press states.** Brief darken to `--primary-active`; optional 0.98 scale on tappable seats. No long bouncy animations.
- **Focus.** Always visible: 3px cobalt ring `0 0 0 3px rgba(0,117,176,.28)`. Accessibility is non-negotiable for a university audience.
- **Motion.** Restrained and functional — fades and small slides (120–360ms), `cubic-bezier(0.16,1,0.3,1)`. No parallax, no confetti.
- **Transparency / blur.** Used only for overlays on the blue photo blocks (`backdrop-filter: blur(4px)` on "Open" pills) and modal scrims. Sparing.
- **Imagery vibe.** Warm, real, daylight-or-lamplight study spaces when photos exist; the mood reference (`study.jpeg`) sets the temperature — cozy, focused, neutral-warm. Placeholders stand in until real photography is supplied.

---

## Iconography

- **System:** [**Lucide**](https://lucide.dev) — loaded from CDN (`unpkg.com/lucide`). Chosen as the closest open-source match to a clean, modern, institutional UI; **flagged as a substitution** since no icon set was supplied. Swap freely if the University standardises on another set.
- **Style rules:** outline only, **1.75px** stroke, round caps & joins, 24px default box. Never mix a filled set in. Seat/avatar glyphs may be filled where they need to read as solid tokens.
- **Core glyphs:** `building-2, map-pin, armchair, calendar-check, clock, users, search, wifi, plug, volume-x, monitor, coffee, bookmark, check, bell, settings`.
- **Emoji:** never used in UI. **Unicode** is not used as iconography. Status meaning is colour + icon + label.
- **Logo assets** (original StudyMate marks) live in `assets/`: `logo-mark.svg` (app tile), `logo-full.svg` (lockup), `logo-full-white.svg` (reversed for blue surfaces).

---

## Index — what's in this system

| Path | Contents |
|---|---|
| `README.md` | This file — context, content & visual foundations, iconography, index |
| `BUILD_GUIDE.md` | **Developer handoff** — file map, data model, design tokens & how to rebuild StudyMate on a production stack |
| `colors_and_type.css` | All design tokens: colours, type, spacing, radii, shadows, motion + semantic element defaults. **Import this in every artifact.** |
| `SKILL.md` | Agent-Skills manifest for reuse in Claude Code |
| `assets/` | StudyMate logo variants (mark, full, reversed) |
| `preview/` | 20 design-system cards (Type · Colors · Spacing · Components · Brand) shown in the Design System tab |
| `ui_kits/student-app/` | **Student booking web app** UI kit — `index.html` interactive prototype + JSX components + its own README |

### UI kits
- **`ui_kits/student-app/`** — desktop-first student booking flow: browse all campus buildings (University Library featured first) → pick a level → live seat map → confirm booking, plus "My bookings". See its README for the component list.

---

## Caveats & open questions
- **StudyMate is an original brand.** It borrows Glasgow's public palette + Noto typefaces for institutional fit but ships its own logo. If this becomes an official University product, swap in the UofG identity per their brand toolkit.
- **Three uploaded photos couldn't be read** (`IMG_2998/3003/3009.png` — likely HEIC mislabeled as PNG). Re-export them as real JPG/PNG if you'd like real building photography folded into the building cards (which currently use tasteful blue placeholder blocks).
- **Lucide is a substitution** for the icon set (none was supplied) — easy to swap.
- **Cobalt hex:** Glasgow's toolkit lists Cobalt inconsistently (`#005C8A` vs the RGB-accurate `#0075B0`); I used `#0075B0`. Tell me if you prefer the darker value.
