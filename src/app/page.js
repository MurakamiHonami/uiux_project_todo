"use client";

import { useState } from "react";
import {
  initTasks,
  INITIAL_FRIENDS,
  getDaysLeft,
  calcLevel,
  MONSTERS,
} from "./components/constants";
import BgGrid from "./components/BgGrid";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import QuestView from "./components/QuestView";
import CalendarView from "./components/CalendarView";
import RankingView from "./components/RankingView";
import PartyView from "./components/PartyView";
import StarIcon from "@mui/icons-material/Star";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Groups3Icon from "@mui/icons-material/Groups3";
const SUBJECTS = ["数学", "物理", "英語", "プログラミング", "実験", "その他"];
const PRIORITY_CONFIG = {
  S: { label: "緊急", color: "#ff2d55", bg: "rgba(255,45,85,0.15)", exp: 100 },
  A: { label: "重要", color: "#ff9f0a", bg: "rgba(255,159,10,0.15)", exp: 60 },
  B: { label: "普通", color: "#30d158", bg: "rgba(48,209,88,0.15)", exp: 30 },
  C: { label: "余裕", color: "#636366", bg: "rgba(99,99,102,0.15)", exp: 10 },
};

function getDeadlineLabel(days) {
  if (days < 0) return { text: "EXPIRED", color: "#636366" };
  if (days === 0) return { text: "TODAY！", color: "#ff2d55" };
  if (days === 1) return { text: "明日まで", color: "#ff6b35" };
  if (days <= 3) return { text: `${days}日後`, color: "#ff9f0a" };
  return { text: `${days}日後`, color: "#30d158" };
}

function Toast({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 999,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "10px 16px",
            backgroundColor: "#111118",
            border: `1px solid ${t.type === "exp" ? "#ff9f0a" : t.type === "error" ? "#ff2d55" : "#30d158"}`,
            borderRadius: 8,
            color:
              t.type === "exp"
                ? "#ff9f0a"
                : t.type === "error"
                  ? "#ff2d55"
                  : "#30d158",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
            maxWidth: 300,
          }}
        >
          {t.type === "exp" ? <StarIcon /> : t.type === "error" ? "💀" : "✅"}{" "}
          {t.message}
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
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: `3px solid ${pc.color}`,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8,
        opacity: task.completed ? 0.55 : 1,
        transition: "opacity 0.3s",
      }}
    >
      <div
        onClick={onToggle}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 14px",
          cursor: "pointer",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: 1,
            minWidth: 0,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              border: `1px solid ${pc.color}`,
              backgroundColor: pc.bg,
              color: pc.color,
              fontSize: 11,
              fontWeight: 700,
              flexShrink: 0,
              fontFamily: "monospace",
            }}
          >
            {task.priority}
          </span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor: "rgba(10,132,255,0.12)",
              border: "1px solid rgba(10,132,255,0.3)",
              color: "#0a84ff",
              fontSize: 11,
              flexShrink: 0,
            }}
          >
            {task.tag}
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "#48484a" : "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.title}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span style={{ color: dl.color, fontSize: 12, fontWeight: 700 }}>
            {dl.text}
          </span>
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor: "rgba(255,159,10,0.12)",
              border: "1px solid rgba(255,159,10,0.3)",
              color: "#ff9f0a",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            +{task.exp}EXP
          </span>
          <span style={{ color: "#48484a", fontSize: 12 }}>
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>
      {expanded && (
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 14px",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <span style={{ color: "#636366", fontSize: 12, minWidth: 55 }}>
              📅 締切
            </span>
            <span style={{ color: "#aeaeb2", fontSize: 13 }}>
              {task.deadline}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
            <span style={{ color: "#636366", fontSize: 12, minWidth: 55 }}>
              📚 科目
            </span>
            <span style={{ color: "#aeaeb2", fontSize: 13 }}>
              {task.subject}
            </span>
          </div>
          {task.note && (
            <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
              <span style={{ color: "#636366", fontSize: 12, minWidth: 55 }}>
                📝 メモ
              </span>
              <span style={{ color: "#aeaeb2", fontSize: 13 }}>
                {task.note}
              </span>
            </div>
          )}
          <div
            style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}
          >
            {!task.completed && (
              <button
                onClick={() => onComplete(task.id)}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "rgba(48,209,88,0.12)",
                  border: "1px solid rgba(48,209,88,0.4)",
                  borderRadius: 6,
                  color: "#30d158",
                  fontSize: 13,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                <EmojiEventsIcon /> クリア！
              </button>
            )}
            <button
              onClick={() => onEdit(task)}
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(10,132,255,0.08)",
                border: "1px solid rgba(10,132,255,0.3)",
                borderRadius: 6,
                color: "#0a84ff",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <EditIcon /> 編集
            </button>
            <button
              onClick={() => onDelete(task.id)}
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(255,45,85,0.08)",
                border: "1px solid rgba(255,45,85,0.3)",
                borderRadius: 6,
                color: "#ff2d55",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <DeleteIcon /> 削除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? SUBJECTS[0]);
  const [deadline, setDeadline] = useState(
    initial?.deadline ?? new Date().toISOString().split("T")[0],
  );
  const [priority, setPriority] = useState(initial?.priority ?? "B");
  const [note, setNote] = useState(initial?.note ?? "");

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };
  const labelStyle = {
    display: "block",
    fontSize: 11,
    color: "#636366",
    marginBottom: 6,
    marginTop: 14,
    letterSpacing: 1,
    textTransform: "uppercase",
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.85)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#0d0d14",
          border: "1px solid rgba(48,209,88,0.35)",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 0 60px rgba(48,209,88,0.1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#30d158",
            marginBottom: 20,
            fontFamily: "monospace",
            letterSpacing: 2,
          }}
        >
          {initial
            ? <EditIcon /> + " QUEST EDIT"
            : <NoteAltIcon /> + " NEW QUEST"}
        </div>

        <label style={labelStyle}>クエスト名</label>
        <input
          style={inputStyle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="課題・タスク名を入力"
        />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>科目</label>
            <select
              style={inputStyle}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              {SUBJECTS.map((s) => (
                <option key={s} style={{ backgroundColor: "#111" }}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>締切日</label>
            <input
              style={inputStyle}
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        <label style={labelStyle}>優先度</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          {["S", "A", "B", "C"].map((p) => {
            const pc = PRIORITY_CONFIG[p];
            return (
              <button
                key={p}
                onClick={() => setPriority(p)}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  border: `1px solid ${pc.color}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  backgroundColor: priority === p ? pc.bg : "transparent",
                  color: pc.color,
                  fontWeight: 700,
                  fontSize: 12,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 16 }}>{p}</span>
                <span style={{ fontSize: 9 }}>{pc.label}</span>
                <span style={{ fontSize: 9, color: "#ff9f0a" }}>
                  +{pc.exp}EXP
                </span>
              </button>
            );
          })}
        </div>

        <label style={labelStyle}>メモ</label>
        <textarea
          style={{ ...inputStyle, height: 72, resize: "vertical" }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="備考・ページ数など"
        />

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 12,
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              color: "#636366",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              if (!title.trim()) return;
              onSave({
                id: initial?.id ?? Date.now().toString(),
                title,
                subject,
                tag: subject,
                deadline,
                priority,
                note,
                completed: initial?.completed ?? false,
                exp: PRIORITY_CONFIG[priority].exp,
                createdAt: initial?.createdAt ?? new Date().toISOString(),
              });
            }}
            style={{
              flex: 2,
              padding: 12,
              backgroundColor: "rgba(48,209,88,0.12)",
              border: "1px solid rgba(48,209,88,0.5)",
              borderRadius: 6,
              color: "#30d158",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            {initial ? "更新する" : "クエスト受注！"}
          </button>
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
  const [friends] = useState(INITIAL_FRIENDS);

  // モンスター状態
  const [monsterIndex, setMonsterIndex] = useState(0);
  const [monsterHp, setMonsterHp] = useState(MONSTERS[0].maxHp);

  const addToast = (message, type = "success") => {
    const id = Date.now().toString();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const allTags = ["ALL", ...Array.from(new Set(tasks.map((t) => t.tag)))];

  const filteredTasks = tasks
    .filter((t) => filterTag === "ALL" || t.tag === filterTag)
    .filter((t) => {
      const d = getDaysLeft(t.deadline);
      if (filterScope === "today") return d === 0;
      if (filterScope === "soon") return d >= 0 && d <= 3;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "deadline")
        return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === "priority")
        return (
          { S: 0, A: 1, B: 2, C: 3 }[a.priority] -
          { S: 0, A: 1, B: 2, C: 3 }[b.priority]
        );
      return b.exp - a.exp;
    });

  const incomplete = filteredTasks.filter((t) => !t.completed);
  const complete = filteredTasks.filter((t) => t.completed);

  // 課題クリア：提出期限までの残日数 × ベースEXP を獲得
  const completeTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.completed) return;
    const daysLeft = Math.max(1, getDaysLeft(task.deadline));
    const earnedExp = task.exp * daysLeft;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t)),
    );
    setTotalExp((e) => e + earnedExp);
    addToast(
      `+${earnedExp} EXP 獲得！(${task.exp}×${daysLeft}日) 「${task.title}」クリア！`,
      "exp",
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast("クエストを削除しました", "error");
    if (expandedId === id) setExpandedId(null);
  };

  const saveTask = (task) => {
    if (editTask) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      addToast("クエストを更新しました！");
    } else {
      setTasks((prev) => [...prev, task]);
      addToast("新クエスト受注！冒険に追加されました");
    }
    setShowForm(false);
    setEditTask(null);
  };

  // モンスターへの攻撃：EXP消費してダメージを与える
  const handleAttack = (expCost, damage) => {
    setTotalExp((e) => Math.max(0, e - expCost));
    setMonsterHp((hp) => Math.max(0, hp - damage));
  };

  // 次のモンスターへ
  const handleNextMonster = () => {
    const nextIndex = (monsterIndex + 1) % MONSTERS.length;
    setMonsterIndex(nextIndex);
    setMonsterHp(MONSTERS[nextIndex].maxHp);
    addToast(`${MONSTERS[nextIndex].name}が現れた！`, "error");
  };

  const { level, progress, nextExp: nexp } = calcLevel(totalExp);
  const weeklyRanking = [...friends].sort(
    (a, b) => b.completedThisWeek - a.completedThisWeek,
  );

  const navItems = [
    { key: "quests", icon: <AssignmentTurnedInIcon />, label: "クエスト" },
    { key: "calendar", icon: <CalendarMonthIcon />, label: "カレンダー" },
    { key: "ranking", icon: <EmojiEventsIcon />, label: "ランキング" },
    { key: "party", icon: <Groups3Icon />, label: "パーティ" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#08080f",
        color: "#e5e5ea",
        fontFamily: "'Segoe UI', 'Noto Sans JP', sans-serif",
        position: "relative",
      }}
    >
      <BgGrid />
      <Header
        level={level}
        totalExp={totalExp}
        progress={progress}
        nexp={nexp}
      />
      <NavBar view={view} onViewChange={setView} />

      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {view === "quests" && (
          <QuestView
            tasks={tasks}
            totalExp={totalExp}
            filterScope={filterScope}
            setFilterScope={setFilterScope}
            filterTag={filterTag}
            setFilterTag={setFilterTag}
            allTags={allTags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            incomplete={incomplete}
            complete={complete}
            completeTask={completeTask}
            deleteTask={deleteTask}
            setEditTask={setEditTask}
            setShowForm={setShowForm}
            monster={MONSTERS[monsterIndex]}
            monsterHp={monsterHp}
            onAttack={handleAttack}
            onNextMonster={handleNextMonster}
          />
        )}
        {view === "calendar" && (
          <CalendarView
            tasks={tasks}
            calMonth={calMonth}
            setCalMonth={setCalMonth}
            addToast={addToast}
          />
        )}
        {view === "ranking" && <RankingView weeklyRanking={weeklyRanking} />}
        {view === "party" && (
          <PartyView friends={friends} addToast={addToast} />
        )}
      </div>

      {showForm && (
        <TaskForm
          initial={editTask}
          onSave={saveTask}
          onCancel={() => {
            setShowForm(false);
            setEditTask(null);
          }}
        />
      )}
      <Toast toasts={toasts} />
    </div>
  );
}
