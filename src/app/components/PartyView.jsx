import { calcLevel } from "./constants";

export default function PartyView({ friends, addToast }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "#0a84ff", fontFamily: "monospace", letterSpacing: 2 }}>👥 PARTY MEMBERS</div>
        <div style={{ color: "#636366", fontSize: 12, marginTop: 4 }}>仲間と一緒にクエストをクリアしよう</div>
      </div>

      <button onClick={() => addToast("オンライン通話を開始！パーティに参加しました 🎙️", "success")} style={{
        width: "100%", padding: 14, marginBottom: 10,
        backgroundColor: "rgba(48,209,88,0.08)",
        border: "1px solid rgba(48,209,88,0.3)",
        borderRadius: 8, color: "#30d158",
        fontSize: 15, cursor: "pointer", fontWeight: 700, letterSpacing: 1,
      }}>🎙️ オンライン通話を開始</button>

      <button onClick={() => addToast("板書をパーティに共有しました！📸", "success")} style={{
        width: "100%", padding: 14, marginBottom: 16,
        backgroundColor: "rgba(10,132,255,0.08)",
        border: "1px solid rgba(10,132,255,0.25)",
        borderRadius: 8, color: "#0a84ff",
        fontSize: 15, cursor: "pointer", fontWeight: 700, letterSpacing: 1,
      }}>📸 板書を共有する</button>

      {friends.map(f => {
        const fl = calcLevel(f.exp);
        return (
          <div key={f.name} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
            backgroundColor: f.isYou ? "rgba(255,159,10,0.05)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${f.isYou ? "rgba(255,159,10,0.3)" : "rgba(255,255,255,0.07)"}`,
            borderRadius: 8, marginBottom: 8,
          }}>
            <span style={{ fontSize: 36 }}>{f.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                {f.name}
                {f.isYou && <span style={{ fontSize: 9, padding: "2px 6px", backgroundColor: "rgba(255,159,10,0.15)", border: "1px solid rgba(255,159,10,0.4)", borderRadius: 4, color: "#ff9f0a", fontFamily: "monospace" }}>YOU</span>}
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#30d158", boxShadow: "0 0 6px #30d158", display: "inline-block" }} />
              </div>
              <div style={{ fontSize: 11, color: "#636366", marginBottom: 6 }}>Lv.{fl.level} | EXP {f.exp.toLocaleString()}</div>
              <div style={{ height: 4, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${fl.progress}%`, background: "linear-gradient(90deg, #0a84ff, #30d158)", transition: "width 0.8s" }} />
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#30d158", fontSize: 20, fontWeight: 900, fontFamily: "monospace" }}>{f.completedThisWeek}</div>
              <div style={{ fontSize: 9, color: "#636366" }}>今週完了</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
