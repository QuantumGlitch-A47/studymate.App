/* StudyMate — Level view: zone-coded level rail, floor info, seat zones, legend */

const SM_ZONE = window.STUDYMATE.zoneMeta;

function Legend() {
  const items = [
    { cls: "available", label: "Available" },
    { cls: "selected", label: "Selected" },
    { cls: "yours", label: "Your seat" },
    { cls: "occupied", label: "Occupied" },
  ];
  return (
    <div className="sm-legend">
      {items.map((i) => (
        <span key={i.cls} className="sm-legend-item">
          <span className={"sm-seat-swatch " + i.cls}></span>
          {i.label}
        </span>
      ))}
    </div>
  );
}

function ZoneBadge({ zone }) {
  const meta = SM_ZONE[zone] || SM_ZONE.quiet;
  const icon = zone === "silent" ? "volume-x" : zone === "group" ? "users" : "armchair";
  return (
    <span className={"sm-zone-badge " + zone}>
      <Icon name={icon} size={14} />
      {meta.label} · {meta.rule}
    </span>
  );
}

function Seat({ seat, zone, selected, mine, onSelect }) {
  let cls = "sm-seat ";
  if (mine) cls += "yours";
  else if (selected) cls += "selected";
  else cls += seat.status;
  const disabled = seat.status === "occupied" && !mine;
  return (
    <button
      className={cls}
      disabled={disabled}
      onClick={() => !disabled && onSelect(zone, seat)}
      title={zone.name + " · seat " + seat.id}
    >
      {mine ? (
        <Icon name="user" size={14} />
      ) : selected ? (
        <Icon name="check" size={14} strokeWidth={3} />
      ) : (
        <span className="sm-seat-id">{seat.id}</span>
      )}
    </button>
  );
}

function Zone({ zone, selection, myBookings, buildingId, levelId, onSelect }) {
  const free = zone.seats.filter((s) => s.status === "available").length;
  return (
    <div className="sm-zone">
      <div className="sm-zone-head">
        <span className="sm-zone-title">
          <Icon name={zone.icon} size={16} />
          {zone.name}
        </span>
        <span className="sm-zone-free">{free} free</span>
      </div>
      <div className="sm-seatgrid">
        {zone.seats.map((s) => {
          const isSel = selection && selection.zone === zone.name && selection.seat === s.id;
          const mine = myBookings.some(
            (b) =>
              b.buildingId === buildingId &&
              b.levelId === levelId &&
              b.zone === zone.name &&
              b.seat === s.id
          );
          return (
            <Seat
              key={s.id}
              seat={s}
              zone={zone}
              selected={isSel}
              mine={mine}
              onSelect={(z, seat) =>
                onSelect({ zone: z.name, seat: seat.id, zoneType: z.type })
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function LevelView({ building, levelIdx, onLevel, selection, onSelect, myBookings }) {
  const level = building.levels[levelIdx];
  const [planOpen, setPlanOpen] = React.useState(false);
  const free = level.zones.reduce(
    (a, z) => a + z.seats.filter((s) => s.status === "available").length,
    0
  );
  return (
    <div className="sm-level">
      <aside className="sm-levels-rail">
        <span className="sm-rail-label">{building.levels.length} levels</span>
        {building.levels.map((l, i) => {
          const lf = l.zones.reduce(
            (a, z) => a + z.seats.filter((s) => s.status === "available").length,
            0
          );
          return (
            <button
              key={l.id}
              className={"sm-level-btn zone-" + l.zone + (i === levelIdx ? " active" : "")}
              onClick={() => onLevel(i)}
            >
              <span className="sm-level-stripe"></span>
              <span className="sm-level-name">{l.label}</span>
              <span className="sm-level-sub">{l.sublabel}</span>
              <span className={"sm-level-free" + (l.appointment || lf === 0 ? " none" : "")}>
                {l.appointment ? "Appt." : lf === 0 ? "Full" : lf + " free"}
              </span>
            </button>
          );
        })}
      </aside>

      <div className="sm-floor">
        <div className="sm-floor-head">
          <div className="sm-floor-headmain">
            <div className="sm-floor-titlerow">
              <h2 className="sm-floor-title">{level.label}</h2>
              <ZoneBadge zone={level.zone} />
            </div>
            <p className="sm-floor-desc">{level.desc}</p>
            <div className="sm-floor-subjects">
              {level.subjects.map((s) => (
                <span key={s} className="sm-subject-chip">{s}</span>
              ))}
            </div>
          </div>
          {level.plan && (
            <button
              className="sm-plan-thumb"
              onClick={() => setPlanOpen(true)}
              title="View official floor plan"
            >
              <img src={level.plan} alt={building.name + " " + level.label + " floor plan"} />
              <span className="sm-plan-thumb-label">
                <Icon name="map" size={13} /> Floor plan
              </span>
            </button>
          )}
        </div>

        {level.appointment ? (
          <div className="sm-floor-notice">
            <Icon name="info" size={20} />
            <div>
              <b>Access by appointment</b>
              <p>Archives &amp; Special Collections can't be booked through StudyMate. Request access via the Library Reading Room.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="sm-floor-toolbar">
              <span className="sm-floor-avail"><b>{free}</b> seats available on {level.label}</span>
              <Legend />
            </div>
            <div className="sm-floor-plan">
              <div className="sm-floor-marker">
                <Icon name={level.entrance ? "log-out" : "chevron-down"} size={15} />
                {level.entrance ? "Entrance / exit · Welcome Desk" : "Lifts & stairs"}
              </div>
              <div className="sm-zones">
                {level.zones.map((z) => (
                  <Zone
                    key={z.name}
                    zone={z}
                    selection={selection}
                    myBookings={myBookings}
                    buildingId={building.id}
                    levelId={level.id}
                    onSelect={(payload) =>
                      onSelect({ ...payload, levelId: level.id, levelLabel: level.label })
                    }
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {planOpen && level.plan && (
        <div className="sm-plan-lightbox" onClick={() => setPlanOpen(false)}>
          <div className="sm-plan-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="sm-plan-dialog-head">
              <div>
                <span className="sm-plan-dialog-title">{building.name} — {level.label}</span>
                <span className="sm-plan-dialog-sub">Official University of Glasgow floor plan</span>
              </div>
              <button className="sm-iconbtn" onClick={() => setPlanOpen(false)} aria-label="Close">
                <Icon name="x" size={20} />
              </button>
            </div>
            <img className="sm-plan-dialog-img" src={level.plan} alt={building.name + " " + level.label + " floor plan"} />
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { LevelView, Legend, Seat, Zone, ZoneBadge });
