/* StudyMate — App root: view routing + booking state */

function App() {
  const buildings = window.STUDYMATE.buildings;
  const [view, setView] = React.useState("browse"); // browse | level | bookings | map | saved
  const [activeBuilding, setActiveBuilding] = React.useState(null);
  const [levelIdx, setLevelIdx] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [date] = React.useState("Wed 31 May");
  const [selection, setSelection] = React.useState(null);
  const [bookings, setBookings] = React.useState([]);
  const [toast, setToast] = React.useState(null);

  function openBuilding(b) {
    setActiveBuilding(b);
    setLevelIdx(0);
    setSelection(null);
    setView("level");
  }
  function nav(id) {
    if (id === "browse") {
      setActiveBuilding(null);
      setView("browse");
    } else setView(id);
  }
  function confirm(booking) {
    setBookings((prev) => [...prev, booking]);
    setSelection(null);
    setToast(booking);
  }
  function release(idx) {
    setBookings((prev) => prev.filter((_, i) => i !== idx));
  }

  let title = "Browse spaces";
  let subtitle = "Find a seat anywhere on campus";
  let onBack = null;
  if (view === "level" && activeBuilding) {
    title = activeBuilding.name;
    subtitle = activeBuilding.location + " · Open " + activeBuilding.hours;
    onBack = () => nav("browse");
  } else if (view === "bookings") {
    title = "My bookings";
    subtitle = "Your reserved seats and rooms";
  } else if (view === "map") {
    title = "Campus map";
    subtitle = "University of Glasgow";
  } else if (view === "saved") {
    title = "Saved spaces";
    subtitle = "Buildings you've bookmarked";
  }

  return (
    <div className="sm-app">
      <Sidebar view={view} onNav={nav} bookingCount={bookings.length} />
      <div className="sm-main">
        <TopBar
          date={date}
          query={query}
          onQuery={setQuery}
          title={title}
          subtitle={subtitle}
          onBack={onBack}
        />
        <div className="sm-scroll">
          {view === "browse" && (
            <BuildingsView buildings={buildings} query={query} onOpen={openBuilding} />
          )}
          {view === "level" && activeBuilding && (
            <LevelView
              building={activeBuilding}
              levelIdx={levelIdx}
              onLevel={setLevelIdx}
              selection={selection}
              onSelect={setSelection}
              myBookings={bookings}
            />
          )}
          {view === "bookings" && (
            <MyBookings
              bookings={bookings}
              onRelease={release}
              onBrowse={() => nav("browse")}
            />
          )}
          {(view === "map" || view === "saved") && (
            <div className="sm-view">
              <div className="sm-empty-state">
                <span className="sm-empty-icon">
                  <Icon name={view === "map" ? "map" : "bookmark"} size={28} />
                </span>
                <h2>{view === "map" ? "Campus map" : "Saved spaces"}</h2>
                <p>
                  {view === "map"
                    ? "An interactive map of every bookable building — coming soon in this prototype."
                    : "Bookmark a building to find it here quickly."}
                </p>
                <button className="sm-btn sm-btn-primary" onClick={() => nav("browse")}>
                  Browse spaces
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {view === "level" && activeBuilding && (
        <BookingPanel
          building={activeBuilding}
          selection={selection}
          date={date}
          onClose={() => setSelection(null)}
          onConfirm={confirm}
        />
      )}
      <Toast booking={toast} onClose={() => setToast(null)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
