const NAV_ITEMS = [
  { key: "quests", icon: "📋", label: "クエスト" },
  { key: "calendar", icon: "📅", label: "カレンダー" },
  { key: "ranking", icon: "🏆", label: "ランキング" },
  { key: "party", icon: "👥", label: "パーティ" },
];

export default function NavBar({ view, onViewChange }) {
  return (
    <div style={{
      display: "flex",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "sticky", top: "68px", zIndex: 99,
    }}>
      {NAV_ITEMS.map(item => (
        <button key={item.key} onClick={() => onViewChange(item.key)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          padding: "10px 4px", background: "none", border: "none",
          borderBottom: view === item.key ? "2px solid #30d158" : "2px solid transparent",
          color: view === item.key ? "#30d158" : "#636366",
          cursor: "pointer", fontSize: 11, fontFamily: "inherit",
          transition: "all 0.2s",
        }}>
          <span style={{ fontSize: 18 }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
