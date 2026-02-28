import { calcLevel } from "./constants";

export default function RankingView({ weeklyRanking }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#ff9f0a", fontFamily: "monospace", letterSpacing: 3 }}>🏆 WEEKLY RANKING</div>
        <div style={{ color: "#636366", fontSize: 12, marginTop: 4 }}>今週のクエスト完了数ランキング</div>
      </div>
      {weeklyRanking.map((f, i) => (
        <div key={f.name} style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
          backgroundColor: f.isYou ? "rgba(255,159,10,0.05)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${f.isYou ? "rgba(255,159,10,0.3)" : "rgba(255,255,255,0.07)"}`,
          borderRadius: 8, marginBottom: 8, position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, height: 2,
            width: `${(f.completedThisWeek / weeklyRanking[0].completedThisWeek) * 100}%`,
            backgroundColor: i === 0 ? "#ff9f0a" : i === 1 ? "#aeaeb2" : i === 2 ? "#cd7f32" : "#0a84ff",
          }} />
          <div style={{ fontSize: i < 3 ? 28 : 16, minWidth: 40, textAlign: "center", fontFamily: "monospace", fontWeight: 900,
            color: i === 0 ? "#ff9f0a" : i === 1 ? "#aeaeb2" : i === 2 ? "#cd7f32" : "#48484a" }}>
            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
          </div>
          <span style={{ fontSize: 32 }}>{f.avatar}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              {f.name}
              {f.isYou && <span style={{ fontSize: 9, padding: "2px 6px", backgroundColor: "rgba(255,159,10,0.15)", border: "1px solid rgba(255,159,10,0.4)", borderRadius: 4, color: "#ff9f0a", fontFamily: "monospace" }}>YOU</span>}
            </div>
            <div style={{ fontSize: 11, color: "#636366", marginTop: 2 }}>総EXP: {f.exp.toLocaleString()} | Lv.{calcLevel(f.exp).level}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: i === 0 ? "#ff9f0a" : "#aeaeb2", fontFamily: "monospace" }}>{f.completedThisWeek}</div>
            <div style={{ fontSize: 9, color: "#636366" }}>完了</div>
          </div>
        </div>
      ))}
    </div>
  );
}
