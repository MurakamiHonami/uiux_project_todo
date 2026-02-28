import { getDaysLeft, getDeadlineLabel, PRIORITY_CONFIG } from "./constants";

export default function TaskCard({ task, expanded, onToggle, onComplete, onDelete, onEdit }) {
  const days = getDaysLeft(task.deadline);
  const dl = getDeadlineLabel(days);
  const pc = PRIORITY_CONFIG[task.priority];

  return (
    <div style={{
      backgroundColor: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderLeft: `3px solid ${pc.color}`,
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 8,
      opacity: task.completed ? 0.55 : 1,
      transition: "opacity 0.3s",
    }}>
      <div
        onClick={onToggle}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", cursor: "pointer", gap: 8, flexWrap: "wrap" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0, flexWrap: "wrap" }}>
          <span style={{
            padding: "2px 8px", borderRadius: 4, border: `1px solid ${pc.color}`,
            backgroundColor: pc.bg, color: pc.color, fontSize: 11, fontWeight: 700, flexShrink: 0,
            fontFamily: "monospace",
          }}>{task.priority}</span>
          <span style={{
            padding: "2px 8px", borderRadius: 4,
            backgroundColor: "rgba(10,132,255,0.12)", border: "1px solid rgba(10,132,255,0.3)",
            color: "#0a84ff", fontSize: 11, flexShrink: 0,
          }}>{task.tag}</span>
          <span style={{
            fontSize: 14, fontWeight: 600,
            textDecoration: task.completed ? "line-through" : "none",
            color: task.completed ? "#48484a" : "#fff",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{task.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ color: dl.color, fontSize: 12, fontWeight: 700 }}>{dl.text}</span>
          <span style={{
            padding: "2px 8px", borderRadius: 4,
            backgroundColor: "rgba(255,159,10,0.12)", border: "1px solid rgba(255,159,10,0.3)",
            color: "#ff9f0a", fontSize: 11, fontWeight: 700,
          }}>+{task.exp}EXP</span>
          <span style={{ color: "#48484a", fontSize: 12 }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 14px", backgroundColor: "rgba(0,0,0,0.25)" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <span style={{ color: "#636366", fontSize: 12, minWidth: 55 }}>📅 締切</span>
            <span style={{ color: "#aeaeb2", fontSize: 13 }}>{task.deadline}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <span style={{ color: "#636366", fontSize: 12, minWidth: 55 }}>📚 科目</span>
            <span style={{ color: "#aeaeb2", fontSize: 13 }}>{task.subject}</span>
          </div>
          {task.note && (
            <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
              <span style={{ color: "#636366", fontSize: 12, minWidth: 55 }}>📝 メモ</span>
              <span style={{ color: "#aeaeb2", fontSize: 13 }}>{task.note}</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {!task.completed && (
              <button onClick={() => onComplete(task.id)} style={{
                padding: "8px 16px", backgroundColor: "rgba(48,209,88,0.12)",
                border: "1px solid rgba(48,209,88,0.4)", borderRadius: 6,
                color: "#30d158", fontSize: 13, cursor: "pointer", fontWeight: 700,
              }}>⚔️ クリア！</button>
            )}
            <button onClick={() => onEdit(task)} style={{
              padding: "8px 16px", backgroundColor: "rgba(10,132,255,0.08)",
              border: "1px solid rgba(10,132,255,0.3)", borderRadius: 6,
              color: "#0a84ff", fontSize: 13, cursor: "pointer",
            }}>✏️ 編集</button>
            <button onClick={() => onDelete(task.id)} style={{
              padding: "8px 16px", backgroundColor: "rgba(255,45,85,0.08)",
              border: "1px solid rgba(255,45,85,0.3)", borderRadius: 6,
              color: "#ff2d55", fontSize: 13, cursor: "pointer",
            }}>🗑️ 削除</button>
          </div>
        </div>
      )}
    </div>
  );
}
