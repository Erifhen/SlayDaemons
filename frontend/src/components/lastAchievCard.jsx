import React from "react";

export default function LastAchievCard({ achieves }) {
  if (!achieves) {
    return <p className="loading-message">Nenhuma conquista recente encontrada.</p>;
  }

  const achv = achieves;

  return (
    <div className={`achievement-card ${achv.isPrestige ? "prestige" : ""}`}>
      <div className="achievement-header">
        <span className="achievement-title">{achv.title}</span>
        {achv.isPrestige && <span className="achievement-star">⭐</span>}
      </div>

      <div className="achievement-image">
        <img src={achv.icon} alt={achv.title} />
      </div>

      <div className="achievement-description">
        <p>{achv.description}</p>
      </div>
    </div>
  );
}
