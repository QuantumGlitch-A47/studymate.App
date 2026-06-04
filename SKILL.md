---
name: studymate-design
description: Use this skill to generate well-branded interfaces and assets for StudyMate — a University of Glasgow campus study-space booking web app — for production or throwaway prototypes/mocks. Contains essential design guidelines, colours, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

- **Tokens:** `colors_and_type.css` holds every colour, type, spacing, radius, shadow and motion variable, plus the Library study-zone system (Silent/Quiet/Group). Import it in every artifact.
- **Brand:** StudyMate is an independent product brand that adopts the University of Glasgow public palette (University Blue `#003865`, Cobalt `#0075B0`) and the official UofG typefaces (Noto Serif headings / Noto Sans UI). Logos are in `assets/`. Do **not** reproduce the University's crest.
- **Cards:** `preview/` contains the design-system specimen cards.
- **UI kit:** `ui_kits/student-app/` is a working, factored React recreation of the student booking flow — copy components from here.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for the user to view. If working on production code, copy assets and read the rules here to design as an expert in this brand.

If the user invokes this skill without other guidance, ask them what they want to build, ask a few focused questions, then act as an expert designer who outputs HTML artifacts _or_ production code depending on the need.
