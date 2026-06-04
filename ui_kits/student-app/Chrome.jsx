/* StudyMate — app chrome: Sidebar + TopBar */

function Sidebar({ view, onNav, bookingCount }) {
  const items = [
    { id: "browse", icon: "building-2", label: "Browse spaces" },
    { id: "bookings", icon: "calendar-check", label: "My bookings", badge: bookingCount },
    { id: "map", icon: "map", label: "Campus map" },
    { id: "saved", icon: "bookmark", label: "Saved" },
  ];
  const active = view === "level" || view === "browse" ? "browse" : view;
  return (
    <aside className="sm-sidebar">
      <div className="sm-brand">
        <img src="../../assets/logo-full.svg" alt="StudyMate" height="30" />
      </div>
      <nav className="sm-nav">
        {items.map((it) => (
          <button
            key={it.id}
            className={"sm-nav-item" + (active === it.id ? " active" : "")}
            onClick={() => onNav(it.id)}
          >
            <Icon name={it.icon} size={19} />
            <span>{it.label}</span>
            {it.badge ? <span className="sm-nav-badge">{it.badge}</span> : null}
          </button>
        ))}
      </nav>
      <div className="sm-sidebar-foot">
        <div className="sm-uofg-note">
          <Icon name="info" size={15} />
          <span>For University of Glasgow students</span>
        </div>
        <button className="sm-nav-item">
          <Icon name="settings" size={19} />
          <span>Settings</span>
        </button>
        <button className="sm-user">
          <span className="sm-avatar">AM</span>
          <span className="sm-user-meta">
            <span className="sm-user-name">Aria Mackenzie</span>
            <span className="sm-user-sub">School of Physics</span>
          </span>
          <Icon name="chevron-down" size={16} className="sm-muted" />
        </button>
      </div>
    </aside>
  );
}

function TopBar({ date, onDate, query, onQuery, title, subtitle, onBack }) {
  return (
    <header className="sm-topbar">
      <div className="sm-topbar-left">
        {onBack && (
          <button className="sm-iconbtn" onClick={onBack} aria-label="Back">
            <Icon name="arrow-left" size={20} />
          </button>
        )}
        <div>
          <h1 className="sm-topbar-title">{title}</h1>
          {subtitle && <p className="sm-topbar-sub">{subtitle}</p>}
        </div>
      </div>
      <div className="sm-topbar-right">
        <label className="sm-search">
          <Icon name="search" size={18} className="sm-muted" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search buildings…"
          />
        </label>
        <button className="sm-datepick">
          <Icon name="calendar" size={17} />
          <span>{date}</span>
          <Icon name="chevron-down" size={15} className="sm-muted" />
        </button>
        <button className="sm-iconbtn" aria-label="Notifications">
          <Icon name="bell" size={19} />
          <span className="sm-dot-indicator"></span>
        </button>
      </div>
    </header>
  );
}

Object.assign(window, { Sidebar, TopBar });
