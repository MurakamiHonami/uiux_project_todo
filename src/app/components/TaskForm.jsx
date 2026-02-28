"use client";

import { useState } from "react";
import { SUBJECTS, PRIORITY_CONFIG } from "./constants";

export default function TaskForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? SUBJECTS[0]);
  const [deadline, setDeadline] = useState(initial?.deadline ?? new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState(initial?.priority ?? "B");
  const [note, setNote] = useState(initial?.note ?? "");

  const inputStyle = {
    width: "100%", padding: "10px 12px",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6, color: "#fff", fontSize: 14,
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };
  const labelStyle = {
    display: "block", fontSize: 11, color: "#636366",
    marginBottom: 6, marginTop: 14, letterSpacing: 1, textTransform: "uppercase",
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onCancel()}
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{
        width: "100%", maxWidth: 500,
        backgroundColor: "#0d0d14",
        border: "1px solid rgba(48,209,88,0.35)",
        borderRadius: 12, padding: 24,
        boxShadow: "0 0 60px rgba(48,209,88,0.1)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#30d158", marginBottom: 20, fontFamily: "monospace", letterSpacing: 2 }}>
          {initial ? "⚔️ QUEST EDIT" : "⚔️ NEW QUEST"}
        </div>

        <label style={labelStyle}>クエスト名</label>
        <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="課題・タスク名を入力" />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>科目</label>
            <select style={inputStyle} value={subject} onChange={e => setSubject(e.target.value)}>
              {SUBJECTS.map(s => <option key={s} style={{ backgroundColor: "#111" }}>{s}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>締切日</label>
            <input style={inputStyle} type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
        </div>

        <label style={labelStyle}>優先度</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          {["S", "A", "B", "C"].map(p => {
            const pc = PRIORITY_CONFIG[p];
            return (
              <button key={p} onClick={() => setPriority(p)} style={{
                flex: 1, padding: "10px 4px",
                border: `1px solid ${pc.color}`,
                borderRadius: 6, cursor: "pointer",
                backgroundColor: priority === p ? pc.bg : "transparent",
                color: pc.color, fontWeight: 700, fontSize: 12,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              }}>
                <span style={{ fontSize: 16 }}>{p}</span>
                <span style={{ fontSize: 9 }}>{pc.label}</span>
                <span style={{ fontSize: 9, color: "#ff9f0a" }}>+{pc.exp}EXP</span>
              </button>
            );
          })}
        </div>

        <label style={labelStyle}>メモ</label>
        <textarea style={{ ...inputStyle, height: 72, resize: "vertical" }} value={note} onChange={e => setNote(e.target.value)} placeholder="備考・ページ数など" />

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: 12, backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
            color: "#636366", fontSize: 13, cursor: "pointer",
          }}>キャンセル</button>
          <button onClick={() => {
            if (!title.trim()) return;
            onSave({
              id: initial?.id ?? Date.now().toString(),
              title, subject, tag: subject, deadline, priority, note,
              completed: initial?.completed ?? false,
              exp: PRIORITY_CONFIG[priority].exp,
              createdAt: initial?.createdAt ?? new Date().toISOString(),
            });
          }} style={{
            flex: 2, padding: 12,
            backgroundColor: "rgba(48,209,88,0.12)",
            border: "1px solid rgba(48,209,88,0.5)",
            borderRadius: 6, color: "#30d158",
            fontSize: 14, cursor: "pointer", fontWeight: 700, letterSpacing: 1,
          }}>{initial ? "更新する" : "クエスト受注！"}</button>
        </div>
      </div>
    </div>
  );
}
