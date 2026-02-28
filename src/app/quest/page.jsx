"use client";

import { useState } from "react";

const SUBJECTS = ["数学", "物理", "英語", "プログラミング", "実験", "その他"];
const PRIORITY_CONFIG = {
  S: { label: "緊急", color: "#ff2d55", bg: "rgba(255,45,85,0.15)", exp: 100 },
  A: { label: "重要", color: "#ff9f0a", bg: "rgba(255,159,10,0.15)", exp: 60 },
  B: { label: "普通", color: "#30d158", bg: "rgba(48,209,88,0.15)", exp: 30 },
  C: { label: "余裕", color: "#636366", bg: "rgba(99,99,102,0.15)", exp: 10 },
};

const INITIAL_FRIENDS = [
  { name: "ケンタ", avatar: "🧙", exp: 2840, completedThisWeek: 7 },
  { name: "ユウタ", avatar: "⚔️", exp: 1920, completedThisWeek: 4, isYou: true },
  { name: "ハルキ", avatar: "🏹", exp: 3200, completedThisWeek: 9 },
  { name: "ソラ", avatar: "🔮", exp: 2100, completedThisWeek: 5 },
];

const initTasks = [
  { id: "1", title: "線形代数 レポート提出", subject: "数学", tag: "数学", deadline: new Date(Date.now() + 86400000).toISOString().split("T")[0], priority: "S", completed: false, exp: 100, note: "p.42-55の問題を全て解く", createdAt: new Date().toISOString() },
  { id: "2", title: "熱力学 演習問題 #3", subject: "物理", tag: "物理", deadline: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0], priority: "A", completed: false, exp: 60, note: "第3章まで", createdAt: new Date().toISOString() },
  { id: "3", title: "英語 ライティング課題", subject: "英語", tag: "英語", deadline: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0], priority: "B", completed: false, exp: 30, note: "500words以上", createdAt: new Date().toISOString() },
  { id: "4", title: "アルゴリズム 実装課題", subject: "プログラミング", tag: "プログラミング", deadline: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0], priority: "A", completed: false, exp: 60, note: "ソートアルゴリズム3種類", createdAt: new Date().toISOString() },
  { id: "5", title: "化学実験 考察レポート", subject: "実験", tag: "実験", deadline: new Date(Date.now() - 86400000).toISOString().split("T")[0], priority: "S", completed: true, exp: 100, note: "先生のコメント確認済", createdAt: new Date().toISOString() },
];

function getDaysLeft(deadline) {
  const d = new Date(deadline);
  d.setHours(23, 59, 59);
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

function getDeadlineLabel(days) {
  if (days < 0) return { text: "EXPIRED", color: "#636366" };
  if (days === 0) return { text: "TODAY！", color: "#ff2d55" };
  if (days === 1) return { text: "明日まで", color: "#ff6b35" };
  if (days <= 3) return { text: `${days}日後`, color: "#ff9f0a" };
  return { text: `${days}日後`, color: "#30d158" };
}

function calcLevel(exp) {
  const level = Math.floor(Math.sqrt(exp / 50)) + 1;
  const currentLevelExp = 50 * (level - 1) ** 2;
  const nextLevelExp = 50 * level ** 2;
  const progress = ((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  return { level, progress, nextExp: nextLevelExp - exp };
}

function Toast({ toasts }) {
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

function TaskCard({ task, expanded, onToggle, onComplete, onDelete, onEdit }) {
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

function TaskForm({ initial, onSave, onCancel }) {
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

export default function QuestBoard() {
  const [tasks, setTasks] = useState(initTasks);
  const [view, setView] = useState("quests");
  const [filterTag, setFilterTag] = useState("ALL");
  const [filterScope, setFilterScope] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [totalExp, setTotalExp] = useState(1920);
  const [calMonth, setCalMonth] = useState(new Date());
  const [editTask, setEditTask] = useState(null);
  const [wakeAlarm, setWakeAlarm] = useState("07:30");
  const [alarmSet, setAlarmSet] = useState(false);
  const [friends] = useState(INITIAL_FRIENDS);

  const addToast = (message, type = "success") => {
    const id = Date.now().toString();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const allTags = ["ALL", ...Array.from(new Set(tasks.map(t => t.tag)))];

  const filteredTasks = tasks
    .filter(t => filterTag === "ALL" || t.tag === filterTag)
    .filter(t => {
      const d = getDaysLeft(t.deadline);
      if (filterScope === "today") return d === 0;
      if (filterScope === "soon") return d >= 0 && d <= 3;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === "priority") return { "S": 0, "A": 1, "B": 2, "C": 3 }[a.priority] - { "S": 0, "A": 1, "B": 2, "C": 3 }[b.priority];
      return b.exp - a.exp;
    });

  const incomplete = filteredTasks.filter(t => !t.completed);
  const complete = filteredTasks.filter(t => t.completed);

  const completeTask = id => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
    setTotalExp(e => e + task.exp);
    addToast(`+${task.exp} EXP 獲得！「${task.title}」クリア！`, "exp");
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast("クエストを削除しました", "error");
    if (expandedId === id) setExpandedId(null);
  };

  const saveTask = task => {
    if (editTask) {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
      addToast("クエストを更新しました！");
    } else {
      setTasks(prev => [...prev, task]);
      addToast("新クエスト受注！冒険に追加されました");
    }
    setShowForm(false);
    setEditTask(null);
  };

  const { level, progress, nextExp: nexp } = calcLevel(totalExp);

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

  const weeklyRanking = [...friends].sort((a, b) => b.completedThisWeek - a.completedThisWeek);

  const navItems = [
    { key: "quests", icon: "📋", label: "クエスト" },
    { key: "calendar", icon: "📅", label: "カレンダー" },
    { key: "ranking", icon: "🏆", label: "ランキング" },
    { key: "party", icon: "👥", label: "パーティ" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08080f", color: "#e5e5ea", fontFamily: "'Segoe UI', 'Noto Sans JP', sans-serif", position: "relative" }}>
      {/* BG grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(0,255,120,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,120,0.025) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Header */}
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

      {/* Nav */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backgroundColor: "rgba(0,0,0,0.5)",
        position: "sticky", top: "68px", zIndex: 99,
      }}>
        {navItems.map(item => (
          <button key={item.key} onClick={() => setView(item.key)} style={{
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

      {/* Main */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px", position: "relative", zIndex: 1 }}>

        {/* QUESTS */}
        {view === "quests" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
              {[
                { label: "進行中", value: tasks.filter(t => !t.completed).length, icon: "⚔️", color: "#30d158" },
                { label: "緊急", value: tasks.filter(t => !t.completed && getDaysLeft(t.deadline) <= 1).length, icon: "🔥", color: "#ff2d55" },
                { label: "完了", value: tasks.filter(t => t.completed).length, icon: "✅", color: "#0a84ff" },
                { label: "総EXP", value: totalExp.toLocaleString(), icon: "⭐", color: "#ff9f0a" },
              ].map(s => (
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

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {["all", "today", "soon"].map(s => (
                  <button key={s} onClick={() => setFilterScope(s)} style={{
                    padding: "6px 12px", borderRadius: 20, border: "1px solid",
                    borderColor: filterScope === s ? "#30d158" : "rgba(255,255,255,0.1)",
                    backgroundColor: filterScope === s ? "rgba(48,209,88,0.12)" : "transparent",
                    color: filterScope === s ? "#30d158" : "#636366",
                    fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                  }}>{{ all: "全て", today: "TODAY", soon: "直近3日" }[s]}</button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {allTags.map(tag => (
                  <button key={tag} onClick={() => setFilterTag(tag)} style={{
                    padding: "4px 10px", borderRadius: 20, border: "1px solid",
                    borderColor: filterTag === tag ? "#0a84ff" : "rgba(255,255,255,0.08)",
                    backgroundColor: filterTag === tag ? "rgba(10,132,255,0.12)" : "transparent",
                    color: filterTag === tag ? "#0a84ff" : "#636366",
                    fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                  }}>{tag}</button>
                ))}
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
                marginLeft: "auto", padding: "6px 10px",
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, color: "#aeaeb2", fontSize: 12, cursor: "pointer",
              }}>
                <option value="deadline">締切順</option>
                <option value="priority">優先度順</option>
                <option value="exp">EXP順</option>
              </select>
            </div>

            <button onClick={() => { setEditTask(null); setShowForm(true); }} style={{
              width: "100%", padding: 13, marginBottom: 12,
              backgroundColor: "rgba(48,209,88,0.08)",
              border: "1px dashed rgba(48,209,88,0.35)",
              borderRadius: 8, color: "#30d158",
              fontSize: 14, cursor: "pointer", fontWeight: 700, letterSpacing: 1,
            }}>＋ 新クエスト受注</button>

            {incomplete.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 16px" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
                <div style={{ color: "#30d158", fontFamily: "monospace", fontSize: 13, letterSpacing: 2 }}>ALL QUESTS CLEAR!</div>
                <div style={{ color: "#48484a", marginTop: 8, fontSize: 13 }}>今日も即帰宅からのゲームざんまい！</div>
              </div>
            )}

            {incomplete.map(task => (
              <TaskCard key={task.id} task={task} expanded={expandedId === task.id}
                onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
                onComplete={completeTask} onDelete={deleteTask}
                onEdit={t => { setEditTask(t); setShowForm(true); }} />
            ))}

            {complete.length > 0 && (
              <>
                <div style={{ textAlign: "center", color: "#3a3a3c", fontSize: 11, letterSpacing: 3, margin: "16px 0 8px" }}>── COMPLETED QUESTS ──</div>
                {complete.map(task => (
                  <TaskCard key={task.id} task={task} expanded={expandedId === task.id}
                    onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
                    onComplete={completeTask} onDelete={deleteTask}
                    onEdit={t => { setEditTask(t); setShowForm(true); }} />
                ))}
              </>
            )}
          </div>
        )}

        {/* CALENDAR */}
        {view === "calendar" && (
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
        )}

        {/* RANKING */}
        {view === "ranking" && (
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
        )}

        {/* PARTY */}
        {view === "party" && (
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
        )}
      </div>

      {showForm && <TaskForm initial={editTask} onSave={saveTask} onCancel={() => { setShowForm(false); setEditTask(null); }} />}
      <Toast toasts={toasts} />
    </div>
  );
}