import StatsGrid from "./StatsGrid";
import TaskFilters from "./TaskFilters";
import TaskCard from "./TaskCard";

export default function QuestView({
  tasks, totalExp,
  filterScope, setFilterScope,
  filterTag, setFilterTag,
  allTags,
  sortBy, setSortBy,
  expandedId, setExpandedId,
  incomplete, complete,
  completeTask, deleteTask,
  setEditTask, setShowForm,
}) {
  const handleEditTask = (t) => { setEditTask(t); setShowForm(true); };

  return (
    <div>
      <StatsGrid tasks={tasks} totalExp={totalExp} />
      <TaskFilters
        filterScope={filterScope} onFilterScopeChange={setFilterScope}
        filterTag={filterTag} onFilterTagChange={setFilterTag}
        allTags={allTags}
        sortBy={sortBy} onSortByChange={setSortBy}
      />

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
          onEdit={handleEditTask} />
      ))}

      {complete.length > 0 && (
        <>
          <div style={{ textAlign: "center", color: "#3a3a3c", fontSize: 11, letterSpacing: 3, margin: "16px 0 8px" }}>── COMPLETED QUESTS ──</div>
          {complete.map(task => (
            <TaskCard key={task.id} task={task} expanded={expandedId === task.id}
              onToggle={() => setExpandedId(expandedId === task.id ? null : task.id)}
              onComplete={completeTask} onDelete={deleteTask}
              onEdit={handleEditTask} />
          ))}
        </>
      )}
    </div>
  );
}
