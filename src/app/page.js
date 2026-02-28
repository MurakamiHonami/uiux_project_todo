"use client";

import { useState } from "react";
import { initTasks, INITIAL_FRIENDS, getDaysLeft, calcLevel, MONSTERS } from "./components/constants";
import BgGrid from "./components/BgGrid";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import Toast from "./components/Toast";
import TaskForm from "./components/TaskForm";
import QuestView from "./components/QuestView";
import CalendarView from "./components/CalendarView";
import RankingView from "./components/RankingView";
import PartyView from "./components/PartyView";

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

  // 課題クリア：提出期限までの残日数 × ベースEXP を獲得
  const completeTask = id => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return;
    const daysLeft = Math.max(1, getDaysLeft(task.deadline));
    const earnedExp = task.exp * daysLeft;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
    setTotalExp(e => e + earnedExp);
    addToast(`+${earnedExp} EXP 獲得！(${task.exp}×${daysLeft}日) 「${task.title}」クリア！`, "exp");
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

  // モンスターへの攻撃：EXP消費してダメージを与える
  const handleAttack = (expCost, damage) => {
    setTotalExp(e => Math.max(0, e - expCost));
    setMonsterHp(hp => Math.max(0, hp - damage));
  };

  // 次のモンスターへ
  const handleNextMonster = () => {
    const nextIndex = (monsterIndex + 1) % MONSTERS.length;
    setMonsterIndex(nextIndex);
    setMonsterHp(MONSTERS[nextIndex].maxHp);
    addToast(`${MONSTERS[nextIndex].name}が現れた！`, "error");
  };

  const { level, progress, nextExp: nexp } = calcLevel(totalExp);
  const weeklyRanking = [...friends].sort((a, b) => b.completedThisWeek - a.completedThisWeek);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#08080f", color: "#e5e5ea", fontFamily: "'Segoe UI', 'Noto Sans JP', sans-serif", position: "relative" }}>
      <BgGrid />
      <Header level={level} totalExp={totalExp} progress={progress} nexp={nexp} />
      <NavBar view={view} onViewChange={setView} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "16px", position: "relative", zIndex: 1 }}>
        {view === "quests" && (
          <QuestView
            tasks={tasks} totalExp={totalExp}
            filterScope={filterScope} setFilterScope={setFilterScope}
            filterTag={filterTag} setFilterTag={setFilterTag}
            allTags={allTags}
            sortBy={sortBy} setSortBy={setSortBy}
            expandedId={expandedId} setExpandedId={setExpandedId}
            incomplete={incomplete} complete={complete}
            completeTask={completeTask} deleteTask={deleteTask}
            setEditTask={setEditTask} setShowForm={setShowForm}
            monster={MONSTERS[monsterIndex]}
            monsterHp={monsterHp}
            onAttack={handleAttack}
            onNextMonster={handleNextMonster}
          />
        )}
        {view === "calendar" && (
          <CalendarView tasks={tasks} calMonth={calMonth} setCalMonth={setCalMonth} addToast={addToast} />
        )}
        {view === "ranking" && <RankingView weeklyRanking={weeklyRanking} />}
        {view === "party" && <PartyView friends={friends} addToast={addToast} />}
      </div>

      {showForm && <TaskForm initial={editTask} onSave={saveTask} onCancel={() => { setShowForm(false); setEditTask(null); }} />}
      <Toast toasts={toasts} />
    </div>
  );
}
