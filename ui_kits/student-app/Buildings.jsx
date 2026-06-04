/* StudyMate — Browse buildings: BuildingCard, FeaturedBuilding, BuildingsView */

function StatusPill({ status, free }) {
  const map = {
    open: { cls: "ok", label: free + " free" },
    filling: { cls: "warn", label: "Filling up · " + free },
    full: { cls: "danger", label: "Full" },
  };
  const s = map[status] || map.open;
  return (
    <span className={"sm-status-pill " + s.cls}>
      <span className="sm-status-dot"></span>
      {s.label}
    </span>
  );
}

function AmenityTag({ label }) {
  const icons = {
    "Silent floors": "volume-x",
    "Power sockets": "plug",
    "Wi-Fi": "wifi",
    "Near café": "coffee",
    "Group rooms": "users",
    "Group pods": "users",
    "Active learning": "users",
    "Bookable rooms": "calendar",
    "Quiet study": "armchair",
  };
  return (
    <span className="sm-amenity">
      <Icon name={icons[label] || "armchair"} size={13} />
      {label}
    </span>
  );
}

function FeaturedBuilding({ building, onOpen }) {
  const pct = Math.round(building.ratio * 100);
  return (
    <div className="sm-featured" onClick={() => onOpen(building)}>
      <div className={"sm-featured-art" + (building.photo ? " has-photo" : "")} data-initial={building.initial}>
        {building.photo ? (
          <img className="sm-featured-img" src={building.photo} alt={building.name} />
        ) : (
          <span className="sm-featured-glyph">{building.initial}</span>
        )}
        <span className="sm-featured-eyebrow">
          <Icon name="star" size={13} /> Most popular today
        </span>
      </div>
      <div className="sm-featured-body">
        <StatusPill status={building.status} free={building.free} />
        <h2 className="sm-featured-name">{building.name}</h2>
        <p className="sm-featured-loc">
          <Icon name="map-pin" size={15} /> {building.location} · {building.levels.length} levels ·
          Open {building.hours}
        </p>
        <p className="sm-featured-blurb">{building.blurb}</p>
        <div className="sm-amenities">
          {building.tags.map((t) => (
            <AmenityTag key={t} label={t} />
          ))}
        </div>
        <div className="sm-featured-cta">
          <span className="sm-availbar">
            <span className="sm-availbar-fill" style={{ width: pct + "%" }}></span>
          </span>
          <button className="sm-btn sm-btn-primary">
            View seats <Icon name="arrow-right" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function BuildingCard({ building, onOpen }) {
  const pct = Math.round(building.ratio * 100);
  return (
    <button className="sm-bcard" onClick={() => onOpen(building)}>
      <div className={"sm-bcard-art" + (building.photo ? " has-photo" : "")}>
        {building.photo ? (
          <img className="sm-bcard-img" src={building.photo} alt={building.name} />
        ) : (
          <span className="sm-bcard-glyph">{building.initial}</span>
        )}
        <StatusPill status={building.status} free={building.free} />
      </div>
      <div className="sm-bcard-body">
        <h3 className="sm-bcard-name">{building.name}</h3>
        <p className="sm-bcard-loc">
          <Icon name="map-pin" size={14} /> {building.location}
        </p>
        <div className="sm-bcard-foot">
          <span className="sm-bcard-levels">{building.levels.length} levels</span>
          <span className="sm-bcard-go">
            <Icon name="arrow-right" size={16} />
          </span>
        </div>
        <span className="sm-availbar sm-availbar-sm">
          <span
            className={"sm-availbar-fill " + building.status}
            style={{ width: pct + "%" }}
          ></span>
        </span>
      </div>
    </button>
  );
}

function BuildingsView({ buildings, query, onOpen }) {
  const q = query.trim().toLowerCase();
  const filtered = buildings.filter(
    (b) => !q || b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q)
  );
  const featured = filtered.find((b) => b.featured);
  const rest = filtered.filter((b) => !b.featured);
  const totalFree = buildings.reduce((a, b) => a + b.free, 0);

  return (
    <div className="sm-view">
      <div className="sm-summary">
        <div className="sm-summary-stat">
          <span className="sm-summary-num">{totalFree}</span>
          <span className="sm-summary-label">seats free across campus</span>
        </div>
        <div className="sm-summary-divider"></div>
        <div className="sm-summary-stat">
          <span className="sm-summary-num">{buildings.length}</span>
          <span className="sm-summary-label">buildings open now</span>
        </div>
        <div className="sm-segmented">
          <button className="active"><Icon name="layout-grid" size={16} /> Grid</button>
          <button><Icon name="map" size={16} /> Map</button>
        </div>
      </div>

      {featured && (
        <>
          <h2 className="sm-section-h">Featured</h2>
          <FeaturedBuilding building={featured} onOpen={onOpen} />
        </>
      )}

      <div className="sm-section-row">
        <h2 className="sm-section-h">All buildings</h2>
        <button className="sm-link-btn">
          <Icon name="sliders" size={15} /> Filter
        </button>
      </div>
      {rest.length ? (
        <div className="sm-bgrid">
          {rest.map((b) => (
            <BuildingCard key={b.id} building={b} onOpen={onOpen} />
          ))}
        </div>
      ) : (
        <p className="sm-empty">No buildings match "{query}".</p>
      )}
    </div>
  );
}

Object.assign(window, { BuildingsView, BuildingCard, FeaturedBuilding, StatusPill });
