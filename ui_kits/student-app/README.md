# UI Kit — StudyMate Student Booking Web App

A desktop-first, click-through prototype of the StudyMate student experience: **browse every public study building on campus → pick a level → reserve a seat or space**, plus a **My bookings** view. Built to match the StudyMate design system (Glasgow blues, Noto type, Lucide icons).

> This is a high-fidelity **UI recreation**, not production code. State is in-memory React; availability data is illustrative.

## Run it
Open `index.html`. It loads `../../colors_and_type.css` (the system tokens) plus React + Babel from CDN, then the component files below.

## Flow
1. **Browse spaces** — campus summary, a *Featured* building (University Library), and a grid of all buildings with live availability bars and status pills.
2. **Level view** — click a building to open its level rail (colour-coded by study zone), floor info (zone, description, subjects), and the seat zones. Click an available seat.
3. **Reserve** — a slide-in panel shows seat details and a booking-window time picker; confirm to book.
4. **My bookings** — confirmed seats listed; release any booking.

## The Library, for real
`data.js` models the **University of Glasgow Library** from its actual *Self-guided tour* floor-plan leaflet: **12 levels**, the **Silent / Quiet / Group** colour-zone system, the entrance on Level 2, and the real subject collections per floor (History on 8, Law on 7, Archives on 12 — access by appointment, etc.).

## Every campus building
The browse grid lists **all 30 buildings** from the University's official room-photo directory (`gla.ac.uk/myglasgow/estates/timetabling/roomphotos/`) — Adam Smith, Boyd Orr, Gilbert Scott, the Bute Gardens townhouses, Clarice Pears, Wolfson Medical School, Kelvin Hall and the rest — each with real street locations, generated level layouts and study-zone coding. The University Library is featured first. Building photos are intentionally left as branded placeholder blocks (the user opted out of photos).

## Components
| File | Exports | Role |
|---|---|---|
| `data.js` | `window.STUDYMATE` | Buildings, levels, zones, seats + zone metadata |
| `Icons.jsx` | `Icon` | Inline Lucide-path icon component (no DOM-swap conflicts) |
| `Chrome.jsx` | `Sidebar`, `TopBar` | App nav rail + search/date header |
| `Buildings.jsx` | `BuildingsView`, `BuildingCard`, `FeaturedBuilding`, `StatusPill` | Browse-buildings screen |
| `SeatMap.jsx` | `LevelView`, `Zone`, `Seat`, `Legend`, `ZoneBadge` | Level + seat-map screen |
| `Booking.jsx` | `BookingPanel`, `MyBookings`, `Toast` | Reserve drawer, bookings list, confirmation toast |
| `App.jsx` | — | View routing + booking state, mounts to `#root` |

Each `.jsx` file exports its components to `window` so the Babel scripts can share scope.

## Coverage notes
- **Campus map** and **Saved** are intentionally left as empty-state placeholders — no source design exists for them yet.
- Group-room capacity, check-in/QR, and payments are out of scope for this kit.
