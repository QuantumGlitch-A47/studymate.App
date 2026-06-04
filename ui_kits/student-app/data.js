/* StudyMate — data for the UI kit prototype.

   • University Library: the real 12-level structure from the UofG
     "Library Floor Plan / Self-guided tour" leaflet — colour-coded
     study zones (Silent / Quiet / Group) and real collections per floor.
   • All other buildings: the full official list from
     gla.ac.uk/myglasgow/estates/timetabling/roomphotos/ (30 buildings).
   Seat availability is illustrative. */
(function () {
  function rng(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  function makeZone(name, icon, count, occRate, seed, type) {
    const rand = rng(seed);
    const seats = [];
    for (let i = 1; i <= count; i++) {
      seats.push({ id: i, status: rand() < occRate ? "occupied" : "available" });
    }
    return { name, icon, type, seats };
  }

  // Build a level's seat zones from its study-zone kind.
  function seatZonesFor(zone, occ, seed) {
    if (zone === "silent") {
      return [
        makeZone("Window bay", "sun", 12, occ - 0.08, seed + 1, "Silent"),
        makeZone("Silent desks", "armchair", 24, occ, seed + 2, "Silent"),
        makeZone("Reading room", "bookmark", 12, occ + 0.06, seed + 3, "Silent"),
      ];
    }
    if (zone === "group") {
      return [
        makeZone("Group pods", "users", 12, occ, seed + 1, "Group"),
        makeZone("Open study", "armchair", 18, occ - 0.05, seed + 2, "Group"),
        makeZone("Social table", "coffee", 8, occ + 0.05, seed + 3, "Social"),
      ];
    }
    return [
      makeZone("Window bay", "sun", 12, occ - 0.08, seed + 1, "Quiet"),
      makeZone("Quiet desks", "armchair", 24, occ, seed + 2, "Quiet"),
      makeZone("Computer cluster", "monitor", 16, occ + 0.12, seed + 3, "PCs"),
    ];
  }

  function descFor(zone) {
    if (zone === "silent") return "Silent individual study — desks, window seating and open shelving.";
    if (zone === "group") return "Group study and collaboration space with open seating.";
    return "Quiet study desks, PCs and window bays.";
  }
  function subjectsFor(zone, extra) {
    const base =
      zone === "silent"
        ? ["Silent desks", "Window bay", "Reading room"]
        : zone === "group"
        ? ["Group pods", "Open study"]
        : ["Quiet desks", "PCs"];
    return (extra || []).concat(base);
  }

  // ---- University Library (detailed, real) ------------------------------
  const libLevelsMeta = [
    { n: 1, label: "Level 1", zone: "quiet", desc: "Individual study spaces & PCs.",
      subjects: ["Individual study", "PCs"], occ: 0.5 },
    { n: 2, label: "Level 2", zone: "group", entrance: true,
      desc: "Entrance & exit. Welcome Desk, Reach Out, self-service kiosks, exhibition space and a large group & individual study area.",
      subjects: ["Welcome Desk", "Reach Out IT helpdesk", "Self-service kiosks", "Exhibition space"], occ: 0.58 },
    { n: 3, label: "Level 3", zone: "group",
      desc: "Library café, The Lounge, group & individual study and the High Demand Collection.",
      subjects: ["High Demand Collection", "Library Seminar Room", "The Lounge", "Café", "Laptop loans"], occ: 0.64 },
    { n: 4, label: "Level 4", zone: "quiet",
      desc: "Education & language collections, Music, Family Study Lounge, Sound & Vision Lab.",
      subjects: ["Education", "Language Resource", "Music", "Family Study Lounge", "Jura Lab"], occ: 0.46 },
    { n: 5, label: "Level 5", zone: "quiet",
      desc: "Sciences, Postgraduate Study Area (card access) and the Assistive Technology Room.",
      subjects: ["Chemistry", "Physics", "Biology", "Maths", "Psychology", "Postgraduate Study"], occ: 0.4 },
    { n: 6, label: "Level 6", zone: "quiet",
      desc: "Social sciences, economics, geography, politics and Slavonic collections.",
      subjects: ["Economics", "Geography", "Politics", "Sociology", "Slavonic"], occ: 0.52 },
    { n: 7, label: "Level 7", zone: "quiet",
      desc: "Law, Maps & Atlases, Statistics and the Europeans Information Centre.",
      subjects: ["Law", "Maps & Atlases", "Statistics", "Europeans Information Centre"], occ: 0.55 },
    { n: 8, label: "Level 8", zone: "silent",
      desc: "A typical study floor — History, Archaeology, individual desks, student PCs and views to Kelvingrove Park.",
      subjects: ["History", "Archaeology", "Celtic", "Military Science", "Sound Booth"], occ: 0.34 },
    { n: 9, label: "Level 9", zone: "silent",
      desc: "Modern languages and area-studies collections, with a Sound Booth and Prayer Room.",
      subjects: ["English", "German", "Hispanic", "French", "Italian", "Prayer Room"], occ: 0.28 },
    { n: 10, label: "Level 10", zone: "silent",
      desc: "Classics, Philosophy and Theology, plus the IT Training Room.",
      subjects: ["Classics", "Oriental", "Philosophy", "Theology", "IT Training Room"], occ: 0.3 },
    { n: 11, label: "Level 11", zone: "silent",
      desc: "Fine Arts, Bibliography, Theatre and the Textile Conservation Collection.",
      subjects: ["Fine Arts", "Bibliography", "Theatre", "Textile Conservation"], occ: 0.22 },
    { n: 12, label: "Level 12", zone: "silent", appointment: true,
      desc: "Archives & Special Collections — access by appointment.",
      subjects: ["Archives & Special Collections", "Seminar Room"], occ: 0.7 },
  ];

  const library = {
    id: "library",
    name: "University Library",
    location: "Hillhead Street",
    initial: "L",
    featured: true,
    photo: "assets/library.jpg",
    hours: "07:00 – 02:00",
    tags: ["Silent floors", "Power sockets", "Wi-Fi", "Café"],
    blurb:
      "Twelve floors from the group-study and café levels up to the silent reading rooms. Colour-coded study zones throughout — the heart of study at Glasgow.",
    levels: libLevelsMeta.map((m) => ({
      id: m.n,
      label: m.label,
      sublabel: m.zone === "silent" ? "Silent study" : m.zone === "group" ? "Group study" : "Quiet study",
      zone: m.zone,
      desc: m.desc,
      subjects: m.subjects,
      entrance: !!m.entrance,
      appointment: !!m.appointment,
      plan: "assets/library/level-" + m.n + ".jpg",
      zones: m.appointment ? [] : seatZonesFor(m.zone, m.occ, m.n * 10 + 7),
    })),
  };

  // ---- Generator for every other building -------------------------------
  // spec: { id, name, location, initial?, hours, tags, blurb, levels:[ {label, zone, occ, entrance?, subjects?} ] }
  let seedCounter = 1000;
  function mk(spec) {
    const levels = spec.levels.map((l, i) => {
      seedCounter += 17;
      return {
        id: i + 1,
        label: l.label,
        sublabel: l.zone === "silent" ? "Silent study" : l.zone === "group" ? "Group study" : "Quiet study",
        zone: l.zone,
        desc: l.desc || descFor(l.zone),
        subjects: l.subjects || subjectsFor(l.zone),
        entrance: !!l.entrance,
        appointment: false,
        zones: seatZonesFor(l.zone, l.occ, seedCounter),
      };
    });
    return {
      id: spec.id,
      name: spec.name,
      location: spec.location,
      initial: spec.initial || spec.name.replace(/^The\s+/, "")[0],
      photo: spec.photo,
      hours: spec.hours,
      tags: spec.tags,
      blurb: spec.blurb,
      levels,
    };
  }

  // L = library quote shorthand for tags
  const T = {
    quiet: ["Quiet study", "Power sockets", "Wi-Fi"],
    group: ["Group rooms", "Wi-Fi"],
    pc: ["PCs", "Power sockets", "Wi-Fi"],
    cafe: ["Café", "Wi-Fi"],
  };

  const others = [
    mk({ id: "jms", name: "James McCune Smith Learning Hub", location: "University Avenue", initial: "S",
      hours: "08:00 – 00:00", tags: ["Group rooms", "Active learning", "Café", "Wi-Fi"],
      photo: "assets/jms.jpg",
      blurb: "Glasgow's flagship learning hub — flexible, modern and made for collaboration. Seven floors of bookable rooms and open study.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.5, entrance: true, subjects: ["Welcome", "Café", "Group pods"] },
        { label: "Level 1", zone: "group", occ: 0.55, subjects: ["Active learning", "Group rooms"] },
        { label: "Level 2", zone: "group", occ: 0.48, subjects: ["Collaboration", "Group rooms"] },
        { label: "Level 3", zone: "quiet", occ: 0.42, subjects: ["Quiet desks", "PCs"] },
        { label: "Level 4", zone: "quiet", occ: 0.36, subjects: ["Quiet desks", "Window bay"] },
        { label: "Level 5", zone: "silent", occ: 0.3, subjects: ["Silent desks", "City views"] },
        { label: "Level 6", zone: "silent", occ: 0.24, subjects: ["Silent desks", "Reading room"] },
      ] }),
    mk({ id: "arc", name: "Advanced Research Centre", location: "Thurso Street", initial: "A",
      hours: "08:00 – 22:00", tags: ["Bookable rooms", "Café", "Wi-Fi"],
      blurb: "Bright interdisciplinary building by the river Kelvin, with bookable study and collaboration spaces.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.3, entrance: true, subjects: ["Atrium", "Café", "Open study"] },
        { label: "Level 1", zone: "quiet", occ: 0.24, subjects: ["Quiet desks", "PCs"] },
        { label: "Level 2", zone: "silent", occ: 0.2, subjects: ["Silent desks", "Window bay"] },
      ] }),
    mk({ id: "boydorr", name: "Boyd Orr Building", location: "University Avenue", initial: "B",
      hours: "08:00 – 21:00", tags: T.pc,
      blurb: "Major science teaching building with large lecture theatres and computer clusters.",
      levels: [
        { label: "Level 2", zone: "quiet", occ: 0.66, entrance: true, subjects: ["PC cluster", "Quiet desks"] },
        { label: "Level 4", zone: "quiet", occ: 0.58, subjects: ["PC cluster"] },
        { label: "Level 6", zone: "silent", occ: 0.44, subjects: ["Silent desks"] },
      ] }),
    mk({ id: "25bute", name: "25 Bute Gardens", location: "Bute Gardens", initial: "25",
      hours: "08:30 – 18:00", tags: T.quiet,
      blurb: "Arts & Humanities teaching rooms in a converted Bute Gardens townhouse.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.5, entrance: true },
        { label: "First floor", zone: "quiet", occ: 0.4 },
      ] }),
    mk({ id: "42bute", name: "42 Bute Gardens", location: "Bute Gardens", initial: "42",
      hours: "08:30 – 18:00", tags: T.group,
      blurb: "Seminar and group-study rooms across two floors on Bute Gardens.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.45, entrance: true },
        { label: "First floor", zone: "quiet", occ: 0.38 },
      ] }),
    mk({ id: "claricepears", name: "Clarice Pears SHW Building", location: "90 Byres Road", initial: "C",
      hours: "08:00 – 20:00", tags: ["Group rooms", "Café", "Power sockets", "Wi-Fi"],
      blurb: "Home of the School of Health & Wellbeing — a modern building with open and bookable study space.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.4, entrance: true, subjects: ["Café", "Open study"] },
        { label: "Level 2", zone: "quiet", occ: 0.34 },
        { label: "Level 4", zone: "silent", occ: 0.26 },
      ] }),
    mk({ id: "davidson", name: "Davidson Building", location: "University Avenue", initial: "D",
      hours: "08:00 – 21:00", tags: T.quiet,
      blurb: "Life-sciences teaching building with quiet study between classes.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.55, entrance: true },
        { label: "First floor", zone: "quiet", occ: 0.48 },
      ] }),
    mk({ id: "gilbertscott", name: "Gilbert Scott Building", location: "University Avenue", initial: "G",
      hours: "08:00 – 18:00", tags: ["Quiet study", "Heritage", "Wi-Fi"],
      photo: "assets/gilbertscott.jpg",
      blurb: "The University's iconic main building. Historic reading and study rooms beneath the tower, including the Hunterian Museum.",
      levels: [
        { label: "East Quad", zone: "quiet", occ: 0.62, entrance: true, subjects: ["Reading room", "Quiet desks"] },
        { label: "Hunterian level", zone: "silent", occ: 0.4, subjects: ["Museum study", "Silent desks"] },
      ] }),
    mk({ id: "gilmorehill", name: "Gilmorehill Halls", location: "9 University Avenue", initial: "G",
      hours: "09:00 – 21:00", tags: T.group,
      blurb: "Film & Television and Theatre Studies building, with the Gilmorehill Centre and seminar rooms.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.42, entrance: true },
        { label: "Gallery", zone: "quiet", occ: 0.36 },
      ] }),
    mk({ id: "grahamkerr", name: "Graham Kerr Building", location: "University Avenue", initial: "G",
      hours: "08:00 – 20:00", tags: T.quiet,
      blurb: "Zoology and life-sciences building with quiet study and PCs.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.58, entrance: true },
        { label: "First floor", zone: "quiet", occ: 0.5 },
      ] }),
    mk({ id: "hetherington", name: "Hetherington Building", location: "Bute Gardens", initial: "H",
      hours: "08:30 – 18:00", tags: T.group,
      blurb: "Research and seminar building on Bute Gardens with group study rooms.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.4, entrance: true },
        { label: "First floor", zone: "quiet", occ: 0.34 },
      ] }),
    mk({ id: "hag", name: "Hunterian Art Gallery", location: "82 Hillhead Street", initial: "H",
      hours: "10:00 – 17:00", tags: ["Quiet study", "Gallery", "Wi-Fi"],
      blurb: "Study quietly among the collections, including the Mackintosh House. Calm and inspiring.",
      levels: [
        { label: "Gallery floor", zone: "silent", occ: 0.3, entrance: true, subjects: ["Quiet seating", "Print Study"] },
      ] }),
    mk({ id: "jws", name: "James Watt South Building", location: "University Avenue", initial: "J",
      hours: "08:00 – 21:00", tags: T.pc,
      blurb: "Engineering teaching building with computer labs and quiet study desks.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.6, entrance: true, subjects: ["PC labs", "Quiet desks"] },
        { label: "Level 3", zone: "quiet", occ: 0.5 },
        { label: "Level 5", zone: "silent", occ: 0.42 },
      ] }),
    mk({ id: "josephblack", name: "Joseph Black Building", location: "University Avenue", initial: "J",
      hours: "08:00 – 21:00", tags: T.pc,
      blurb: "School of Chemistry building with PC clusters and quiet study areas.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.64, entrance: true, subjects: ["Chemistry", "PCs"] },
        { label: "Level A", zone: "quiet", occ: 0.52 },
      ] }),
    mk({ id: "kelvin", name: "Kelvin Building", location: "University Avenue", initial: "K",
      hours: "09:00 – 18:00", tags: T.quiet,
      blurb: "School of Physics & Astronomy building, near the Boyd Orr. Quiet study near the labs.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.9, entrance: true, subjects: ["Physics", "Quiet desks"] },
        { label: "First floor", zone: "quiet", occ: 0.82 },
      ] }),
    mk({ id: "kelvinhall", name: "Kelvin Hall", location: "1445 Argyle Street", initial: "K",
      hours: "07:00 – 22:00", tags: ["Group study", "Collections", "Café", "Wi-Fi"],
      blurb: "Shared home of University collections and sport. Study space alongside the archives and gym.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.35, entrance: true, subjects: ["Collections study", "Café"] },
        { label: "Mezzanine", zone: "quiet", occ: 0.28 },
      ] }),
    mk({ id: "mcintyre", name: "McIntyre Building", location: "University Avenue", initial: "M",
      hours: "08:30 – 18:00", tags: T.group,
      blurb: "Student-facing building by the main gate with seminar and group rooms.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.48, entrance: true },
        { label: "First floor", zone: "quiet", occ: 0.4 },
      ] }),
    mk({ id: "molema", name: "Molema Building", location: "University Avenue", initial: "M",
      hours: "08:30 – 18:00", tags: T.quiet,
      blurb: "Teaching building with quiet study rooms off University Avenue.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.52, entrance: true },
        { label: "First floor", zone: "quiet", occ: 0.44 },
      ] }),
    mk({ id: "59oakfield", name: "59 Oakfield Avenue", location: "Oakfield Avenue", initial: "59",
      hours: "08:30 – 18:00", tags: T.quiet,
      blurb: "Arts & Social Sciences seminar rooms in a converted Oakfield Avenue townhouse.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.5, entrance: true },
        { label: "First floor", zone: "group", occ: 0.42 },
      ] }),
    mk({ id: "profsquare", name: "Professors' Square", location: "The Square", initial: "P",
      hours: "09:00 – 18:00", tags: ["Quiet study", "Heritage", "Wi-Fi"],
      blurb: "Historic terraced houses around The Square — small, calm study and meeting rooms.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.46, entrance: true },
      ] }),
    mk({ id: "rankine", name: "Rankine Building", location: "Oakfield Avenue", initial: "R",
      hours: "08:00 – 21:00", tags: T.pc,
      blurb: "James Watt School of Engineering building with computer labs and quiet study.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.62, entrance: true, subjects: ["Engineering", "PC labs"] },
        { label: "Level 3", zone: "quiet", occ: 0.5 },
      ] }),
    mk({ id: "sas", name: "Sir Alexander Stone Building", location: "University Gardens", initial: "S",
      hours: "08:30 – 18:00", tags: T.quiet,
      blurb: "School of Law annexe with quiet study and seminar rooms on University Gardens.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.44, entrance: true, subjects: ["Law", "Quiet desks"] },
      ] }),
    mk({ id: "scw", name: "Sir Charles Wilson Building", location: "University Avenue", initial: "W",
      hours: "08:00 – 21:00", tags: T.quiet,
      blurb: "A calm, classic study setting moments from the main gate, with a large lecture theatre.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.84, entrance: true },
        { label: "First floor", zone: "silent", occ: 0.76 },
      ] }),
    mk({ id: "sjb", name: "Sir James Black Building", location: "University Avenue", initial: "J",
      hours: "08:00 – 21:00", tags: T.pc,
      blurb: "Biomedical sciences building with PC clusters and quiet study desks.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.6, entrance: true, subjects: ["Biomedical", "PCs"] },
        { label: "Level 2", zone: "quiet", occ: 0.5 },
      ] }),
    mk({ id: "15southpark", name: "15 Southpark Terrace", location: "Southpark Terrace", initial: "15",
      hours: "08:30 – 18:00", tags: T.group,
      blurb: "Small seminar and group-study rooms in a Southpark Terrace townhouse.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.4, entrance: true },
      ] }),
    mk({ id: "standrews", name: "St Andrew's Building", location: "11 Eldon Street", initial: "S",
      hours: "08:00 – 20:00", tags: ["Group rooms", "PCs", "Wi-Fi"],
      blurb: "School of Education building at Eldon Street, with PC clusters and group study.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.46, entrance: true, subjects: ["Education", "Group rooms"] },
        { label: "First floor", zone: "quiet", occ: 0.38 },
      ] }),
    mk({ id: "thomson", name: "Thomson Building", location: "University Avenue", initial: "T",
      hours: "08:00 – 20:00", tags: T.quiet,
      blurb: "Medical and life-sciences teaching building with quiet study areas.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.56, entrance: true },
        { label: "First floor", zone: "quiet", occ: 0.48 },
      ] }),
    mk({ id: "unigardens", name: "University Gardens", location: "University Gardens", initial: "U",
      hours: "08:30 – 18:00", tags: ["Quiet study", "Heritage", "Wi-Fi"],
      blurb: "A terrace of Arts & Humanities townhouses (1–13) with small, characterful study rooms.",
      levels: [
        { label: "Ground", zone: "quiet", occ: 0.48, entrance: true },
        { label: "First floor", zone: "group", occ: 0.4 },
      ] }),
    mk({ id: "wolfsonmed", name: "Wolfson Medical School", location: "University Avenue", initial: "W",
      hours: "08:00 – 21:00", tags: ["Group rooms", "Café", "PCs", "Wi-Fi"],
      blurb: "Striking atrium building for the School of Medicine — clinical-skills suites, group rooms and open study.",
      levels: [
        { label: "Ground", zone: "group", occ: 0.44, entrance: true, subjects: ["Medicine", "Atrium", "Café"] },
        { label: "Level 2", zone: "quiet", occ: 0.36 },
        { label: "Level 3", zone: "silent", occ: 0.3 },
      ] }),
  ];

  const buildingsRaw = [library, ...others];

  function countFree(levels) {
    let free = 0, total = 0;
    levels.forEach((l) =>
      l.zones.forEach((z) =>
        z.seats.forEach((s) => {
          total++;
          if (s.status === "available") free++;
        })
      )
    );
    return { free, total: total || 1 };
  }

  const buildings = buildingsRaw.map((b) => {
    const { free, total } = countFree(b.levels);
    const ratio = free / total;
    let status = "open";
    if (ratio < 0.05) status = "full";
    else if (ratio < 0.2) status = "filling";
    return { ...b, free, total, ratio, status };
  });

  // ---- Which buildings are shown in the app -----------------------------
  // Every building above stays defined in code. To show more, just add its
  // id to this list (e.g. "arc", "kelvin", "wolfsonmed", …). To show all,
  // set VISIBLE = null.
  const VISIBLE = ["library", "jms", "gilbertscott"];
  const visibleBuildings = VISIBLE
    ? VISIBLE.map((id) => buildings.find((b) => b.id === id)).filter(Boolean)
    : buildings;

  window.STUDYMATE = {
    buildings: visibleBuildings, // shown in the UI
    allBuildings: buildings,     // full catalogue, kept for later
    zoneMeta: {
      silent: { label: "Silent study", rule: "No conversation" },
      quiet: { label: "Quiet study", rule: "Whispered conversation" },
      group: { label: "Group study", rule: "Conversation & group work" },
    },
  };
})();
