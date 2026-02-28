"use client";

import { useState } from "react";
import { PRIORITY_CONFIG } from "./constants";

export default function CalendarView({ tasks, calMonth, setCalMonth, addToast }) {
  const [wakeAlarm, setWakeAlarm] = useState("07:30");
  const [alarmSet, setAlarmSet] = useState(false);

  const calDays = () => {
    const y = calMonth.getFullYear(), m = calMonth.getMonth();
    const first = new Date(y, m, 1).getDay();
    const last = new Date(y, m + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: last }, (_, i) => i + 1)];
  };

  const tasksByDate = {};
  tasks.forEach(t => {
    if (!tasksByDate[t.deadline]) tasksByDate[t.deadline] = [];
    tasksByDate[t.deadline].push(t);
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 16 }}>
        <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() - 1))} style={{
          background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
          color: "#aeaeb2", padding: "8px 14px", cursor: "pointer", fontSize: 14,
        }}>◀</button>
        <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "monospace", color: "#fff" }}>
          {calMonth.getFullYear()}年 {calMonth.getMonth() + 1}月
        </span>
        <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth() + 1))} style={{
          background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
          color: "#aeaeb2", padding: "8px 14px", cursor: "pointer", fontSize: 14,
        }}>▶</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 20 }}>
        {["日", "月", "火", "水", "木", "金", "土"].map((d, i) => (
          <div key={d} style={{ textAlign: "center", padding: "6px 2px", fontSize: 11, fontWeight: 700,
            color: i === 0 ? "#ff2d55" : i === 6 ? "#0a84ff" : "#636366" }}>{d}</div>
        ))}
        {calDays().map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const dateStr = `${calMonth.getFullYear()}-${String(calMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayTasks = tasksByDate[dateStr] || [];
          const isToday = new Date().toISOString().split("T")[0] === dateStr;
          return (
            <div key={day} style={{
              minHeight: 58, padding: 4, borderRadius: 6,
              backgroundColor: isToday ? "rgba(48,209,88,0.08)" : "rgba(255,255,255,0.02)",
              border: isToday ? "1px solid rgba(48,209,88,0.3)" : "1px solid rgba(255,255,255,0.05)",
              display: "flex", flexDirection: "column", gap: 2,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: isToday ? "#30d158" : "#aeaeb2" }}>{day}</span>
              {dayTasks.slice(0, 2).map(t => (
                <div key={t.id} style={{
                  borderRadius: 3, padding: "1px 3px", fontSize: 9, fontWeight: 700, color: "#000",
                  backgroundColor: PRIORITY_CONFIG[t.priority].color,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{t.title.slice(0, 5)}</div>
              ))}
              {dayTasks.length > 2 && <span style={{ fontSize: 9, color: "#636366" }}>+{dayTasks.length - 2}</span>}
            </div>
          );
        })}
      </div>

      <div style={{ backgroundColor: "rgba(255,159,10,0.05)", border: "1px solid rgba(255,159,10,0.2)", borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#ff9f0a", marginBottom: 12 }}>⏰ 起床アラーム設定</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="time" value={wakeAlarm} onChange={e => setWakeAlarm(e.target.value)} style={{
            flex: 1, padding: "10px 12px",
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,159,10,0.3)",
            borderRadius: 6, color: "#ff9f0a",
            fontSize: 24, fontFamily: "monospace", outline: "none",
          }} />
          <button onClick={() => { setAlarmSet(true); addToast(`${wakeAlarm} にアラームをセット！5分刻みスヌーズ付き`, "success"); }} style={{
            padding: "10px 20px",
            backgroundColor: "rgba(255,159,10,0.12)",
            border: "1px solid rgba(255,159,10,0.4)",
            borderRadius: 6, color: "#ff9f0a",
            fontSize: 13, cursor: "pointer", fontWeight: 700,
          }}>セット</button>
        </div>
        {alarmSet && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#30d158" }}>
            ✅ {wakeAlarm} にアラームをセット（5分刻みスヌーズ付き）
          </div>
        )}
      </div>
    </div>
  );
}
