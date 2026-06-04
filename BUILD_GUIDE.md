# StudyMate — Project Layout & Build Guide

A developer handoff for rebuilding **StudyMate** (the University of Glasgow campus study-space booking app) as a real, production application — anywhere, on any stack.

This repository is a **design system + high-fidelity prototype**, not production code. It is the source of truth for *how StudyMate should look and behave*. This document tells you what's here, how it's organised, the data model, and how to turn it into a shippable product.

---

## 1. What this project is

| Layer | Where | Status |
|---|---|---|
| **Design tokens** (colour, type, spacing, shadow, motion) | `colors_and_type.css` | ✅ Production-ready — copy as-is |
| **Brand assets** (logo) | `assets/` | ✅ Production-ready |
| **Design-system specimen cards** | `preview/` | 📖 Reference only |
| **UI kit** (the app, recreated in React + Babel) | `ui_kits/student-app/` | 🎨 Visual/interaction spec — rebuild with real data |
| **Docs** | `README.md`, `SKILL.md`, this file | 📖 Reference |

The UI kit runs entirely in the browser with **in-memory mock data** (`data.js`). There is no backend, no auth, no persistence. Treat the JSX components as a **pixel-accurate spec** of the screens and interactions you need to build.

---

## 2. File map

```
StudyMate/
├── README.md                  # Brand, content & visual foundations, iconography
├── BUILD_GUIDE.md             # ← this file
├── SKILL.md                   # Agent-Skills manifest (for AI tooling reuse)
├── colors_and_type.css        # ALL design tokens + semantic element defaults
│
├── assets/                    # Brand assets (SVG)
│   ├── logo-mark.svg          #   app tile / favicon mark
│   ├── logo-full.svg          #   primary horizontal lockup
│   └── logo-full-white.svg    #   reversed lockup for dark/blue surfaces
│
├── preview/                   # Design-system specimen cards (one concept each)
│   ├── type-*.html            #   typography
│   ├── color-*.html           #   palettes, seat states, study zones, semantics
│   ├── radii / elevation / spacing.html
│   ├── buttons / inputs / badges / timeslots / seat-map / building-card.html
│   └── logo*.html / iconography.html
│
└── ui_kits/student-app/       # THE APP — high-fidelity recreation
    ├── index.html             #   entry point: loads CSS, React, Babel, then all .jsx
    ├── data.js                #   mock data — buildings, levels, zones, seats
    ├── Icons.jsx              #   <Icon name=…> inline-SVG icon component (Lucide paths)
    ├── Chrome.jsx             #   <Sidebar>, <TopBar>
    ├── Buildings.jsx          #   <BuildingsView>, <BuildingCard>, <FeaturedBuilding>, <StatusPill>
    ├── SeatMap.jsx            #   <LevelView>, <Zone>, <Seat>, <Legend>, <ZoneBadge>
    ├── Booking.jsx            #   <BookingPanel>, <MyBookings>, <Toast>
    ├── App.jsx               #   root: view routing + booking state
    ├── assets/library.jpg     #   University Library photo
    └── README.md              #   UI-kit-specific notes
```

---

## 3. Screens & navigation

The app is a single-page experience with four primary views, routed by a `view` state string in `App.jsx`:

```
browse  ──click building──▶  level  ──click seat──▶  [Booking panel] ──confirm──▶ toast
  │                                                                                  │
  └────────────────────────────────  bookings  ◀───────────────────────────────────┘
                                       (also: map, saved — placeholder empty states)
```

1. **`browse`** — campus summary bar (total free seats, building count), a **featured building** (University Library, with photo), and a responsive grid of **all 30 buildings** with live availability bars + status pills. Search filters by name/location.
2. **`level`** — opens a building. Left **level rail** (colour-coded by study zone) + a floor panel showing the zone badge, description, subject chips, and **seat zones** (grids of bookable seats). Clicking an available seat opens the booking panel.
3. **Booking panel** — slide-in drawer: seat details + a booking-window time picker → **Confirm booking** → success toast.
4. **`bookings`** — list of confirmed reservations with a **Release** action. Empty state when none.
5. **`map` / `saved`** — intentional placeholders (no source design yet).

---

## 4. The data model

This is the most important section for a real build. Everything renders from one shape. In `data.js` it's mock data on `window.STUDYMATE`; in production this comes from your API.

### Building
```ts
type Zone = "silent" | "quiet" | "group";
type SeatStatus = "available" | "occupied";        // "selected"/"yours" are UI-only

interface Building {
  id: string;
  name: string;
  location: string;          // street / campus location
  initial: string;           // 1–2 char fallback glyph when no photo
  featured?: boolean;        // pin to top of browse
  photo?: string;            // optional image URL; falls back to gradient + initial
  hours: string;             // e.g. "07:00 – 02:00"
  tags: string[];            // amenity chips: "Wi-Fi", "Café", "Silent floors"…
  blurb: string;
  levels: Level[];
  // —— derived at load (compute server-side or client-side) ——
  free: number;              // available seats across all levels
  total: number;
  ratio: number;             // free / total
  status: "open" | "filling" | "full";  // ratio<0.05 full; <0.2 filling; else open
}

interface Level {
  id: number;
  label: string;             // "Level 3", "Ground"
  sublabel: string;          // "Silent study" — derived from zone
  zone: Zone;                // drives the colour coding everywhere
  desc: string;              // floor description
  subjects: string[];        // collection/facility chips
  entrance?: boolean;        // shows the "Entrance / Welcome Desk" marker
  appointment?: boolean;     // not bookable — shows a notice instead of seats
  zones: SeatZone[];         // empty when appointment-only
}

interface SeatZone {
  name: string;              // "Window bay", "Quiet desks", "Group pods"
  icon: string;              // Icon name (see Icons.jsx)
  type: string;              // "Silent" | "Quiet" | "Group" | "PCs" | "Social"
  seats: { id: number; status: SeatStatus }[];
}
```

### The study-zone system (a core brand motif)
Lifted from the real Library floor plan. Every study floor is exactly one zone:

| Zone | Colour | Rule | Token |
|---|---|---|---|
| 🔴 Silent | `#C8102E` | No conversation | `--zone-silent` |
| 🟡 Quiet | `#E6A200` | Whispered conversation | `--zone-quiet` |
| 🟢 Group | `#1E8A4B` | Conversation & group work | `--zone-group` |

Each has `-soft` (badge background) and `-ink` (badge text) variants in `colors_and_type.css`.

### A booking (created client-side on confirm)
```ts
interface Booking {
  buildingId: string; buildingName: string;
  levelId: number; levelLabel: string;
  zone: string; seat: number; seatCode: string;   // e.g. "3-118"
  from: string; to: string;   // "10:00" – "13:00"
  date: string;               // "Wed 31 May"
}
```

---

## 5. Design tokens

`colors_and_type.css` is framework-agnostic CSS custom properties — copy it into any stack untouched. Highlights:

- **Brand blues:** `--uofg-blue #003865` (primary), `--uofg-cobalt #0075B0` (accent/links/focus), plus a 50–900 tint ramp.
- **Neutrals:** warm "paper & ink" grey ramp (`--ink-50` … `--ink-900`, `--paper`).
- **Seat states:** `--seat-available/-selected/-yours/-occupied` (+ `-fill`).
- **Study zones:** `--zone-silent/-quiet/-group` (+ `-soft`, `-ink`).
- **Semantics:** `--success --warning --danger --feature` (+ `-soft`).
- **Type:** `--font-serif` (Noto Serif — headings) / `--font-sans` (Noto Sans — UI) / `--font-mono` (Noto Sans Mono). 9-step size scale `--text-xs`…`--text-4xl`.
- **Spacing** (`--space-1…8`, 4px base), **radii** (`--radius-xs…pill`), **elevation** (`--shadow-xs…xl`, cool-tinted), **motion** (`--ease-out`, `--dur*`), **focus ring** (`--ring`).

Fonts load from Google Fonts at the top of the file (`@import`). Both are the University's *official* typefaces — no licensing concern.

---

## 6. Iconography

`Icons.jsx` ships ~35 **Lucide** icons as inline SVG paths via a single `<Icon name="…" size={} />` component — no runtime dependency, no DOM-swap conflicts. In a real build you can instead `npm i lucide-react` and use it directly; the names match Lucide's. Style rule: **1.75px stroke, round caps/joins, outline only, no emoji**.

---

## 7. Taking it to production

The prototype is deliberately framework-light (React 18 + Babel-in-browser). For a real app:

**Recommended stack**
- **Frontend:** Vite + React (or Next.js if you want SSR/routing/SEO). Port each `.jsx` file 1:1 — they're already idiomatic function components. Move the inline `<style>` in `index.html` into CSS modules or keep it as one global stylesheet alongside `colors_and_type.css`.
- **State/data:** TanStack Query (or SWR) against your API; React Router (or Next routing) for `browse` / `building/:id` / `bookings`.
- **Backend:** any REST/GraphQL. Suggested endpoints:
  - `GET /buildings` → `Building[]` (with derived `free`/`status`)
  - `GET /buildings/:id` → full `Level[]` + `SeatZone[]` with live `status`
  - `POST /bookings` `{ seatId, from, to, date }` → `Booking`
  - `GET /bookings` (current user) · `DELETE /bookings/:id`
- **Live availability:** seat `status` is the live bit — poll `GET /buildings/:id` or push via WebSocket so the seat map updates in real time. Add a **`reserved`/`held`** transient status (seat locked for N minutes while a user is in the booking panel) to prevent double-booking.
- **Auth:** University SSO (Shibboleth / Microsoft Entra) — this is a student app, so gate it behind institutional login and read the user's name/school from the IdP (the sidebar avatar/name is currently mocked as "Aria Mackenzie").

**Migration checklist**
1. Copy `colors_and_type.css` + `assets/` into the new project.
2. Port the 6 `.jsx` component files; replace `window.X` exports with ES `import`/`export`.
3. Replace `data.js` with API calls returning the **same shapes** (Section 4).
4. Wire booking mutations (`POST`/`DELETE`) and replace the in-memory `bookings` state.
5. Add real auth + a seat-hold/locking mechanism.
6. Keep the study-zone colour system and seat-state colours — they're the product's visual signature.

**Out of scope in this prototype** (build these for real): group-room capacity & booking rules, check-in / QR codes, no-show handling, notifications, payments (if any), accessibility seat filters, admin tools for managing buildings/levels/rules.

---

## 8. Accessibility notes

- Focus ring (`--ring`, cobalt) is defined — keep it visible on all interactive elements.
- Seat status must not rely on colour alone: seats already pair colour with an icon/number; preserve that. Add `aria-label`s on seats (`"Seat 3-118, available"`).
- Target a university audience → meet WCAG AA. The blue/white and zone colours are chosen for contrast; re-check any new combinations.

---

*Generated as a handoff artifact. The visual + interaction source of truth is `ui_kits/student-app/` — run `index.html` to see exactly what to build.*
