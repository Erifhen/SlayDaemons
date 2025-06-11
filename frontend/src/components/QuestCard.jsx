import React from "react";

export default function QuestCard({ quest, onToggle, onDelete, disabled }) {
  const reward = quest.reward;

  return (
    <div
      className={`quest-card ${
        !quest.active || quest.completed || disabled ? "completed" : "active"
      }`}
    >
      <div className="quest-content">
        <label>
          <input
            type="checkbox"
            disabled={!quest.active || disabled}
            checked={quest.completed}
            onChange={() => onToggle(quest.id)}
          />
          <span className="quest-text">{quest.text}</span>
        </label>

        {reward && (
          <span className="quest-reward">
            🎁 {reward.type === "xp" ? `+${reward.value} XP em ${reward.category}` : `+${reward.value} pontos de Saúde/Descanso`}
          </span>
        )}
      </div>

      <button className="quest-delete" onClick={() => onDelete(quest.id)}>🗑</button>
    </div>
  );
}
