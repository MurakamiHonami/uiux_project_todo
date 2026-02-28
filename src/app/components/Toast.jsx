export default function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 16, display: "flex", flexDirection: "column", gap: 8, zIndex: 999 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: "10px 16px",
          backgroundColor: "#111118",
          border: `1px solid ${t.type === "exp" ? "#ff9f0a" : t.type === "error" ? "#ff2d55" : "#30d158"}`,
          borderRadius: 8,
          color: t.type === "exp" ? "#ff9f0a" : t.type === "error" ? "#ff2d55" : "#30d158",
          fontSize: 13, fontWeight: 700,
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
          maxWidth: 300,
        }}>
          {t.type === "exp" ? "⭐" : t.type === "error" ? "💀" : "✅"} {t.message}
        </div>
      ))}
    </div>
  );
}
