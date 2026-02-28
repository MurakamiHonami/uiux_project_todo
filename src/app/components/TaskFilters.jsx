export default function TaskFilters({ filterScope, onFilterScopeChange, filterTag, onFilterTagChange, allTags, sortBy, onSortByChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
      <div style={{ display: "flex", gap: 4 }}>
        {["all", "today", "soon"].map(s => (
          <button key={s} onClick={() => onFilterScopeChange(s)} style={{
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
          <button key={tag} onClick={() => onFilterTagChange(tag)} style={{
            padding: "4px 10px", borderRadius: 20, border: "1px solid",
            borderColor: filterTag === tag ? "#0a84ff" : "rgba(255,255,255,0.08)",
            backgroundColor: filterTag === tag ? "rgba(10,132,255,0.12)" : "transparent",
            color: filterTag === tag ? "#0a84ff" : "#636366",
            fontSize: 11, cursor: "pointer", fontFamily: "inherit",
          }}>{tag}</button>
        ))}
      </div>
      <select value={sortBy} onChange={e => onSortByChange(e.target.value)} style={{
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
  );
}
