export const SUBJECTS = ["数学", "物理", "英語", "プログラミング", "実験", "その他"];

export const PRIORITY_CONFIG = {
  S: { label: "緊急", color: "#ff2d55", bg: "rgba(255,45,85,0.15)", exp: 100 },
  A: { label: "重要", color: "#ff9f0a", bg: "rgba(255,159,10,0.15)", exp: 60 },
  B: { label: "普通", color: "#30d158", bg: "rgba(48,209,88,0.15)", exp: 30 },
  C: { label: "余裕", color: "#636366", bg: "rgba(99,99,102,0.15)", exp: 10 },
};

export const INITIAL_FRIENDS = [
  { name: "ケンタ", avatar: "🧙", exp: 2840, completedThisWeek: 7 },
  { name: "ユウタ", avatar: "⚔️", exp: 1920, completedThisWeek: 4, isYou: true },
  { name: "ハルキ", avatar: "🏹", exp: 3200, completedThisWeek: 9 },
  { name: "ソラ", avatar: "🔮", exp: 2100, completedThisWeek: 5 },
];

export const initTasks = [
  { id: "1", title: "線形代数 レポート提出", subject: "数学", tag: "数学", deadline: new Date(Date.now() + 86400000).toISOString().split("T")[0], priority: "S", completed: false, exp: 100, note: "p.42-55の問題を全て解く", createdAt: new Date().toISOString() },
  { id: "2", title: "熱力学 演習問題 #3", subject: "物理", tag: "物理", deadline: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0], priority: "A", completed: false, exp: 60, note: "第3章まで", createdAt: new Date().toISOString() },
  { id: "3", title: "英語 ライティング課題", subject: "英語", tag: "英語", deadline: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0], priority: "B", completed: false, exp: 30, note: "500words以上", createdAt: new Date().toISOString() },
  { id: "4", title: "アルゴリズム 実装課題", subject: "プログラミング", tag: "プログラミング", deadline: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0], priority: "A", completed: false, exp: 60, note: "ソートアルゴリズム3種類", createdAt: new Date().toISOString() },
  { id: "5", title: "化学実験 考察レポート", subject: "実験", tag: "実験", deadline: new Date(Date.now() - 86400000).toISOString().split("T")[0], priority: "S", completed: true, exp: 100, note: "先生のコメント確認済", createdAt: new Date().toISOString() },
];

export function getDaysLeft(deadline) {
  const d = new Date(deadline);
  d.setHours(23, 59, 59);
  return Math.ceil((d.getTime() - Date.now()) / 86400000);
}

export function getDeadlineLabel(days) {
  if (days < 0) return { text: "EXPIRED", color: "#636366" };
  if (days === 0) return { text: "TODAY！", color: "#ff2d55" };
  if (days === 1) return { text: "明日まで", color: "#ff6b35" };
  if (days <= 3) return { text: `${days}日後`, color: "#ff9f0a" };
  return { text: `${days}日後`, color: "#30d158" };
}

export function calcLevel(exp) {
  const level = Math.floor(Math.sqrt(exp / 50)) + 1;
  const currentLevelExp = 50 * (level - 1) ** 2;
  const nextLevelExp = 50 * level ** 2;
  const progress = ((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  return { level, progress, nextExp: nextLevelExp - exp };
}

export const MONSTERS = [
  { name: "スライムキング",   emoji: "🟢", maxHp: 300,  level: 5  },
  { name: "ゴブリン将軍",    emoji: "👺", maxHp: 700,  level: 20 },
  { name: "闇の竜王",       emoji: "🐉", maxHp: 1500, level: 55 },
  { name: "魔王アスモデウス", emoji: "😈", maxHp: 4000, level: 99 },
];

export const BATTLE_SKILLS = [
  { name: "剣撃",    icon: "⚔️",  cost: 30,  damage: 80,   color: "#30d158", desc: "通常攻撃" },
  { name: "魔法弾",  icon: "✨",  cost: 60,  damage: 200,  color: "#0a84ff", desc: "魔法攻撃" },
  { name: "炎の渦",  icon: "🔥",  cost: 120, damage: 480,  color: "#ff9f0a", desc: "炎属性攻撃" },
  { name: "究極奥義", icon: "💥", cost: 300, damage: 1400, color: "#ff2d55", desc: "全力必殺技" },
];
