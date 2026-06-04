/* StudyMate — Booking panel (confirm drawer) + My bookings view + toast */

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];

function BookingPanel({ building, selection, date, onClose, onConfirm }) {
  const [from, setFrom] = React.useState("10:00");
  const [to, setTo] = React.useState("13:00");

  if (!selection) return null;
  const fromIdx = TIME_SLOTS.indexOf(from);
  const toIdx = TIME_SLOTS.indexOf(to);
  const seatCode =
    selection.levelLabel.replace(/[^0-9]/g, "") + "-" + (100 + selection.seat);

  function pickSlot(t) {
    const idx = TIME_SLOTS.indexOf(t);
    if (idx <= fromIdx) setFrom(t);
    else setTo(t);
  }

  return (
    <>
      <div className="sm-scrim" onClick={onClose}></div>
      <aside className="sm-panel" role="dialog" aria-label="Confirm booking">
        <div className="sm-panel-head">
          <h2>Reserve this seat</h2>
          <button className="sm-iconbtn" onClick={onClose} aria-label="Close">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="sm-panel-seat">
          <span className="sm-panel-seat-icon">
            <Icon name="armchair" size={22} />
          </span>
          <div>
            <div className="sm-panel-seat-code">Seat {seatCode}</div>
            <div className="sm-panel-seat-meta">
              {selection.zone} · {selection.zoneType}
            </div>
          </div>
        </div>

        <dl className="sm-panel-facts">
          <div>
            <dt><Icon name="building-2" size={15} /> Building</dt>
            <dd>{building.name}</dd>
          </div>
          <div>
            <dt><Icon name="map-pin" size={15} /> Level</dt>
            <dd>{selection.levelLabel}</dd>
          </div>
          <div>
            <dt><Icon name="calendar" size={15} /> Date</dt>
            <dd>{date}</dd>
          </div>
        </dl>

        <div className="sm-panel-section">
          <div className="sm-panel-label">
            <Icon name="clock" size={15} /> Booking window
          </div>
          <div className="sm-slotgrid">
            {TIME_SLOTS.map((t, i) => {
              let cls = "sm-slot";
              if (i === fromIdx || i === toIdx) cls += " sel";
              else if (i > fromIdx && i < toIdx) cls += " range";
              return (
                <button key={t} className={cls} onClick={() => pickSlot(t)}>
                  {t}
                </button>
              );
            })}
          </div>
          <p className="sm-slot-summary">
            {from} – {to} · <b>{toIdx - fromIdx} hours</b>
          </p>
        </div>

        <div className="sm-panel-foot">
          <button className="sm-btn sm-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="sm-btn sm-btn-primary"
            onClick={() =>
              onConfirm({
                buildingId: building.id,
                buildingName: building.name,
                levelId: selection.levelId,
                levelLabel: selection.levelLabel,
                zone: selection.zone,
                seat: selection.seat,
                seatCode,
                from,
                to,
                date,
              })
            }
          >
            <Icon name="check" size={18} strokeWidth={2.4} /> Confirm booking
          </button>
        </div>
      </aside>
    </>
  );
}

function Toast({ booking, onClose }) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [booking, onClose]);
  if (!booking) return null;
  return (
    <div className="sm-toast">
      <span className="sm-toast-icon">
        <Icon name="check" size={18} strokeWidth={2.6} />
      </span>
      <div>
        <div className="sm-toast-title">Seat booked</div>
        <div className="sm-toast-sub">
          {booking.buildingName} · {booking.levelLabel} · Seat {booking.seatCode} ·{" "}
          {booking.from}–{booking.to}
        </div>
      </div>
      <button className="sm-iconbtn sm-toast-x" onClick={onClose} aria-label="Dismiss">
        <Icon name="x" size={18} />
      </button>
    </div>
  );
}

function MyBookings({ bookings, onRelease, onBrowse }) {
  if (!bookings.length) {
    return (
      <div className="sm-view">
        <div className="sm-empty-state">
          <span className="sm-empty-icon">
            <Icon name="calendar-check" size={28} />
          </span>
          <h2>Nothing booked yet</h2>
          <p>Browse a building to reserve your first seat on campus.</p>
          <button className="sm-btn sm-btn-primary" onClick={onBrowse}>
            <Icon name="building-2" size={17} /> Browse spaces
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="sm-view">
      <h2 className="sm-section-h">Upcoming bookings</h2>
      <div className="sm-booking-list">
        {bookings.map((b, i) => (
          <div className="sm-booking-row" key={i}>
            <span className="sm-booking-date">
              <span className="sm-booking-day">{b.date.split(" ")[1]}</span>
              <span className="sm-booking-mon">{b.date.split(" ")[2]}</span>
            </span>
            <div className="sm-booking-main">
              <div className="sm-booking-title">{b.buildingName}</div>
              <div className="sm-booking-meta">
                <span><Icon name="map-pin" size={14} /> {b.levelLabel} · {b.zone}</span>
                <span><Icon name="armchair" size={14} /> Seat {b.seatCode}</span>
                <span><Icon name="clock" size={14} /> {b.from}–{b.to}</span>
              </div>
            </div>
            <span className="sm-booking-status">
              <span className="sm-status-dot"></span> Confirmed
            </span>
            <button className="sm-btn sm-btn-danger-ghost" onClick={() => onRelease(i)}>
              Release
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { BookingPanel, MyBookings, Toast });
