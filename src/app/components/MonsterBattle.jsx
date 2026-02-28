"use client";

import { useState } from "react";
import { BATTLE_SKILLS } from "./constants";

export default function MonsterBattle({ monster, monsterHp, maxHp, totalExp, onAttack, onNextMonster }) {
  const [damageDisplay, setDamageDisplay] = useState(null);
  const [shakeX, setShakeX] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);

  const hpPercent = Math.max(0, (monsterHp / maxHp) * 100);
  const isDead = monsterHp <= 0;

  const triggerShake = () => {
    setShakeX(12);
    setTimeout(() => setShakeX(-10), 70);
    setTimeout(() => setShakeX(7), 140);
    setTimeout(() => setShakeX(-4), 210);
    setTimeout(() => setShakeX(0), 280);
  };

  const handleAttack = (skill) => {
    if (totalExp < skill.cost || isDead) return;
    const dmg = Math.min(skill.damage, Math.max(0, monsterHp));
    onAttack(skill.cost, skill.damage);
    setDamageDisplay({ value: dmg, color: skill.color, key: Date.now() });
    setIsFlashing(true);
    triggerShake();
    setTimeout(() => setDamageDisplay(null), 1100);
    setTimeout(() => setIsFlashing(false), 130);
  };

  const hpColor = hpPercent > 50 ? "#30d158" : hpPercent > 25 ? "#ff9f0a" : "#ff2d55";

  return (
    <div style={{
      backgroundColor: "rgba(255,255,255,0.02)",
      border: `1px solid ${isDead ? "rgba(255,159,10,0.4)" : "rgba(255,45,85,0.2)"}`,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 背景グロー */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: isDead
          ? "radial-gradient(ellipse at center, rgba(255,159,10,0.06) 0%, transparent 70%)"
          : "radial-gradient(ellipse at center, rgba(255,45,85,0.05) 0%, transparent 70%)",
      }} />

      <div style={{ position: "relative" }}>
        {isDead ? (
          /* 討伐完了画面 */
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 8 }}>💀</div>
            <div style={{ color: "#ff9f0a", fontFamily: "monospace", fontSize: 15, fontWeight: 900, letterSpacing: 2, marginBottom: 4 }}>
              MONSTER DEFEATED!
            </div>
            <div style={{ color: "#636366", fontSize: 12, marginBottom: 16 }}>
              {monster.name}を討伐した！
            </div>
            <button onClick={onNextMonster} style={{
              padding: "10px 28px",
              backgroundColor: "rgba(255,159,10,0.12)",
              border: "1px solid rgba(255,159,10,0.5)",
              borderRadius: 8, color: "#ff9f0a",
              fontSize: 13, cursor: "pointer", fontWeight: 700, letterSpacing: 1,
              fontFamily: "inherit",
            }}>⚔️ 次のモンスターへ</button>
          </div>
        ) : (
          <>
            {/* ヘッダー */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: "#ff2d55", fontFamily: "monospace", letterSpacing: 2, marginBottom: 2 }}>
                  ⚠ BOSS  Lv.{monster.level}
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{monster.name}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 10, color: "#636366", marginBottom: 2 }}>HP</div>
                <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14, color: hpColor }}>
                  {monsterHp} <span style={{ color: "#48484a", fontSize: 10 }}>/ {maxHp}</span>
                </div>
              </div>
            </div>

            {/* モンスター表示 + ダメージ数値 */}
            <div style={{ textAlign: "center", position: "relative", height: 96, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <div style={{
                fontSize: 70,
                transform: `translateX(${shakeX}px)`,
                transition: "transform 0.06s",
                filter: isFlashing ? "brightness(10) saturate(0)" : "none",
                userSelect: "none",
                lineHeight: 1,
              }}>
                {monster.emoji}
              </div>
              {damageDisplay && (
                <div key={damageDisplay.key} style={{
                  position: "absolute",
                  top: 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: damageDisplay.color,
                  fontSize: 24,
                  fontWeight: 900,
                  fontFamily: "monospace",
                  textShadow: `0 0 14px ${damageDisplay.color}`,
                  pointerEvents: "none",
                  letterSpacing: 1,
                }}>
                  -{damageDisplay.value}
                </div>
              )}
            </div>

            {/* HPバー */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ height: 10, backgroundColor: "#1c1c1e", borderRadius: 5, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{
                  height: "100%",
                  width: `${hpPercent}%`,
                  backgroundColor: hpColor,
                  borderRadius: 5,
                  boxShadow: `0 0 8px ${hpColor}60`,
                  transition: "width 0.35s ease, background-color 0.35s",
                }} />
              </div>
            </div>

            {/* スキルボタン */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {BATTLE_SKILLS.map(skill => {
                const canUse = totalExp >= skill.cost;
                return (
                  <button
                    key={skill.name}
                    onClick={() => handleAttack(skill)}
                    disabled={!canUse}
                    style={{
                      padding: "8px 4px",
                      backgroundColor: canUse ? `${skill.color}18` : "transparent",
                      border: `1px solid ${canUse ? skill.color + "90" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 8,
                      cursor: canUse ? "pointer" : "not-allowed",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                      opacity: canUse ? 1 : 0.35,
                      transition: "all 0.15s",
                      fontFamily: "inherit",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{skill.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: canUse ? skill.color : "#636366" }}>{skill.name}</span>
                    <span style={{ fontSize: 9, color: "#ff9f0a" }}>-{skill.cost} EXP</span>
                    <span style={{ fontSize: 9, color: canUse ? "#aeaeb2" : "#3a3a3c" }}>💥 {skill.damage}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
