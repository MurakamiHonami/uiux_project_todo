export default function Header({ level, totalExp, progress, nexp }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 20px",
      borderBottom: "1px solid rgba(48,209,88,0.2)",
      backgroundColor: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 100,
      flexWrap: "wrap", gap: 10,
    }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#30d158", fontFamily: "monospace", letterSpacing: 3, textShadow: "0 0 20px rgba(48,209,88,0.5)" }}>
          ⚔️ QUEST BOARD
        </div>
        <div style={{ fontSize: 10, color: "#48484a", letterSpacing: 2, marginTop: 1 }}>大学クエスト管理システム v2.0</div>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        backgroundColor: "rgba(255,159,10,0.06)",
        border: "1px solid rgba(255,159,10,0.25)",
        borderRadius: 10, padding: "10px 16px",
      }}>
        <span style={{ fontSize: 26 }}>⚔️</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>ユウタ <span style={{ color: "#ff9f0a", fontSize: 11 }}>Lv.{level}</span></div>
          <div style={{ fontSize: 10, color: "#636366" }}>理工学部 | 実家勢</div>
        </div>
        <div style={{ minWidth: 110 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#636366", marginBottom: 3 }}>
            <span>EXP</span><span style={{ color: "#30d158" }}>{totalExp.toLocaleString()}</span>
          </div>
          <div style={{ height: 7, backgroundColor: "#1c1c1e", borderRadius: 4, overflow: "hidden", border: "1px solid rgba(255,159,10,0.2)" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #ff9f0a, #ff6b35)", borderRadius: 4, transition: "width 0.8s" }} />
          </div>
          <div style={{ fontSize: 9, color: "#48484a", textAlign: "right", marginTop: 2 }}>次Lvまで {nexp} EXP</div>
        </div>
      </div>
    </div>
  );
}
