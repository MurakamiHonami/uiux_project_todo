import { getDaysLeft } from "./constants";

export default function StatsGrid({ tasks, totalExp }) {
  const stats = [
    { label: "進行中", value: tasks.filter(t => !t.completed).length, icon: "⚔️", color: "#30d158" },
    { label: "緊急", value: tasks.filter(t => !t.completed && getDaysLeft(t.deadline) <= 1).length, icon: "🔥", color: "#ff2d55" },
    { label: "完了", value: tasks.filter(t => t.completed).length, icon: "✅", color: "#0a84ff" },
    { label: "総EXP", value: totalExp.toLocaleString(), icon: "⭐", color: "#ff9f0a" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
      {stats.map(s => (
        <div key={s.label} style={{
          backgroundColor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8, padding: "12px 8px", textAlign: "center",
        }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
          <div style={{ fontSize: 10, color: "#636366", marginTop: 2 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}
